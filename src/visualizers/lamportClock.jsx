import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { calculateLinearPositions } from '../utils/simulationUtils';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const PSEUDOCODE = [
  "// Initial State",
  "clock = 0",
  "",
  "// Rule 1: Local Event or Send",
  "clock = clock + 1",
  "if sending_message:",
  "    send(message, clock)",
  "",
  "// Rule 2: Receive Message with Timestamp T",
  "clock = max(clock, T) + 1"
];

export function LamportClockVisualizer() {
  const [nodeCount, setNodeCount] = useState(3);

  const steps = useMemo(() => {
    const positions = calculateLinearPositions(nodeCount, 640, 320);
    const pNames = Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`);

    const currentClocks = {};
    pNames.forEach(name => {
      currentClocks[name] = 0;
    });

    const stepList = [];

    const pushStep = (title, explanation, rule, why, codeLine, activeNodes = [], messages = [], events = []) => {
      stepList.push({
        nodes: pNames.map((name, idx) => ({
          id: name,
          label: name,
          x: positions[idx].x,
          y: positions[idx].y,
          clock: currentClocks[name],
          status: activeNodes.includes(name) ? 'ACTIVE' : 'IDLE'
        })),
        messages,
        events: [...stepList.flatMap(s => s.events), ...events],
        title,
        explanation,
        rule,
        why,
        codeLine
      });
    };

    // STEP 0: Initial State
    pushStep(
      "Initial System State",
      "Processes P1 to P" + nodeCount + " are initialized with starting logical clocks.",
      "clock = 0",
      "Logical clocks provide a monotonically increasing counter to establish partial event ordering.",
      2,
      [],
      [],
      [{ action: "System initialized", type: "SYSTEM" }]
    );

    // STEP 1: P1 Local Event
    currentClocks['P1'] += 1;
    pushStep(
      "P1 Local Computation Event",
      "Process P1 performs an internal local calculation.",
      "clock = clock + 1",
      "Before every local event or message transmission, a process MUST increment its scalar logical clock.",
      5,
      ['P1'],
      [],
      [{ action: "P1 local compute event", from: "P1", clock: currentClocks['P1'], type: "LOCAL_EVENT" }]
    );

    // STEP 2: P1 Sends Message to P2
    currentClocks['P1'] += 1;
    const sentTime1 = currentClocks['P1'];
    pushStep(
      "P1 Sends Message to P2 (T=" + sentTime1 + ")",
      "P1 increments its clock to " + sentTime1 + " and attaches this timestamp to the outgoing message.",
      "clock = clock + 1; send(msg, timestamp)",
      "The message timestamp represents the causal time of sending according to P1's clock.",
      7,
      ['P1'],
      [{ id: 'm1', from: 'P1', to: 'P2', label: 'MSG 1', timestamp: sentTime1, progress: 0.3 }],
      [{ action: "P1 sends MSG 1 (T=" + sentTime1 + ") to P2", from: "P1", to: "P2", clock: sentTime1, type: "SEND_MESSAGE" }]
    );

    // STEP 3: P2 Receives Message from P1
    const p2Old = currentClocks['P2'];
    currentClocks['P2'] = Math.max(currentClocks['P2'], sentTime1) + 1;
    pushStep(
      "P2 Receives Message from P1",
      "P2 receives timestamp T=" + sentTime1 + ". P2 updates clock from " + p2Old + " to max(" + p2Old + ", " + sentTime1 + ") + 1 = " + currentClocks['P2'] + ".",
      "clock = max(clock, receivedTimestamp) + 1",
      "To preserve causality, the receiving process must advance its clock to exceed both its own local clock and the sender's timestamp.",
      10,
      ['P2'],
      [{ id: 'm1', from: 'P1', to: 'P2', label: 'MSG 1', timestamp: sentTime1, progress: 1.0, status: 'DELIVERED' }],
      [{ action: "P2 receives MSG 1 (T=" + sentTime1 + "), updates clock to " + currentClocks['P2'], from: "P1", to: "P2", clock: currentClocks['P2'], type: "RECEIVE_MESSAGE" }]
    );

    // STEP 4: P2 Local Event
    currentClocks['P2'] += 1;
    pushStep(
      "P2 Local Compute Event",
      "P2 performs an internal operation and increments clock to " + currentClocks['P2'] + ".",
      "clock = clock + 1",
      "Local events always advance the local clock by 1.",
      5,
      ['P2'],
      [],
      [{ action: "P2 local compute event", from: "P2", clock: currentClocks['P2'], type: "LOCAL_EVENT" }]
    );

    // STEP 5: P2 Sends Message to P3
    if (nodeCount >= 3) {
      currentClocks['P2'] += 1;
      const sentTime2 = currentClocks['P2'];
      pushStep(
        "P2 Sends Message to P3 (T=" + sentTime2 + ")",
        "P2 increments its clock to " + sentTime2 + " and sends a message to P3.",
        "clock = clock + 1; send(msg, timestamp)",
        "Timestamps strictly reflect causal chain ordering P1 -> P2 -> P3.",
        7,
        ['P2'],
        [{ id: 'm2', from: 'P2', to: 'P3', label: 'MSG 2', timestamp: sentTime2, progress: 0.4 }],
        [{ action: "P2 sends MSG 2 (T=" + sentTime2 + ") to P3", from: "P2", to: "P3", clock: sentTime2, type: "SEND_MESSAGE" }]
      );

      // STEP 6: P3 Receives Message
      const p3Old = currentClocks['P3'];
      currentClocks['P3'] = Math.max(currentClocks['P3'], sentTime2) + 1;
      pushStep(
        "P3 Receives Message from P2",
        "P3 updates its clock from " + p3Old + " to max(" + p3Old + ", " + sentTime2 + ") + 1 = " + currentClocks['P3'] + ".",
        "clock = max(clock, receivedTimestamp) + 1",
        "P3's timestamp guarantees that P3's receive event happens causally after P2's send event.",
        10,
        ['P3'],
        [{ id: 'm2', from: 'P2', to: 'P3', label: 'MSG 2', timestamp: sentTime2, progress: 1.0, status: 'DELIVERED' }],
        [{ action: "P3 receives MSG 2 (T=" + sentTime2 + "), updates clock to " + currentClocks['P3'], from: "P2", to: "P3", clock: currentClocks['P3'], type: "RECEIVE_MESSAGE" }]
      );
    }

    return stepList;
  }, [nodeCount]);

  const sim = useSimulation(steps);

  const connections = useMemo(() => {
    const list = [];
    for (let i = 1; i < nodeCount; i++) {
      list.push({ from: `P${i}`, to: `P${i + 1}`, directed: true });
    }
    return list;
  }, [nodeCount]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 light:border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Lamport Logical Clock Network Topology
              </h3>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60 light:border-gray-200">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={connections}
                showClock={true}
                width={640}
                height={340}
              />
            </div>

            <StepControls
              currentStep={sim.currentStep}
              totalSteps={sim.totalSteps}
              isPlaying={sim.isPlaying}
              speed={sim.speed}
              onNext={sim.nextStep}
              onPrev={sim.prevStep}
              onTogglePlay={sim.togglePlay}
              onReset={sim.reset}
              onGoToStep={sim.goToStep}
              onSpeedChange={sim.setSpeed}
            />
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <CodePanel codeLines={PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Node Configuration
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Number of Processes:</span>
                <span className="font-bold text-blue-400">{nodeCount}</span>
              </div>
              <input
                type="range"
                min="3"
                max="5"
                value={nodeCount}
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
                className="w-full accent-blue-500 bg-gray-800 h-1.5 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExplanationPanel activeState={sim.activeState} />
        <EventLog events={sim.activeState.events || []} currentStep={sim.currentStep} />
      </div>
    </div>
  );
}
