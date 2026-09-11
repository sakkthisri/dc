import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { calculateLinearPositions } from '../utils/simulationUtils';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { CausalityInspector } from '../components/visualizer/CausalityInspector';
import { Legend } from '../components/visualizer/Legend';

const PSEUDOCODE = [
  "// Vector Clock Rules for Process P_i",
  "// Initial State: V_i = [0, 0, 0]",
  "",
  "// Rule 1: Before any local event or send",
  "V_i[i] = V_i[i] + 1",
  "",
  "// Rule 2: On sending message",
  "V_i[i] = V_i[i] + 1",
  "send(message, V_i)",
  "",
  "// Rule 3: On receiving message with Vector V_msg",
  "for j in 1..N:",
  "    V_i[j] = max(V_i[j], V_msg[j])",
  "V_i[i] = V_i[i] + 1"
];

export function VectorClockVisualizer() {
  const [nodeCount] = useState(3);

  const steps = useMemo(() => {
    const positions = calculateLinearPositions(nodeCount, 640, 320);
    const pNames = Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`);

    // Vector state per process
    const vectors = {};
    pNames.forEach(name => {
      vectors[name] = Array(nodeCount).fill(0);
    });

    const stepList = [];
    const recordedEvents = [];

    const pushStep = (title, explanation, rule, why, codeLine, activeNodes = [], messages = [], actionText = "", actor = "", target = "") => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: actor,
          to: target,
          vectorClock: [...vectors[actor || target || 'P1']],
          type: actionText.includes("send") ? "SEND_MESSAGE" : actionText.includes("receive") ? "RECEIVE_MESSAGE" : "LOCAL_EVENT"
        });
      }

      stepList.push({
        nodes: pNames.map((name, idx) => ({
          id: name,
          label: name,
          x: positions[idx].x,
          y: positions[idx].y,
          vectorClock: [...vectors[name]],
          status: activeNodes.includes(name) ? 'ACTIVE' : 'IDLE'
        })),
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine
      });
    };

    // STEP 0: Initial State
    pushStep(
      "Initial Vector State",
      "Processes initialized with zero vector clocks: P1 [0,0,0], P2 [0,0,0], P3 [0,0,0].",
      "V_i = [0, 0, ... 0]",
      "Vector clocks track the exact causal history of events across all processes in the system.",
      2,
      [],
      [],
      "System initialized with zero vector clocks",
      "P1"
    );

    // STEP 1: P1 Local Event
    vectors['P1'][0] += 1;
    pushStep(
      "P1 Local Event (e1)",
      "P1 increments its own component V_1[1] to 1. Vector becomes [1,0,0].",
      "V_1[1] = V_1[1] + 1",
      "Process P1 knows only about its own local event e1.",
      5,
      ['P1'],
      [],
      "P1 performs local event e1 -> V1=[1,0,0]",
      "P1"
    );

    // STEP 2: P2 Local Event (Concurrent to e1)
    vectors['P2'][1] += 1;
    pushStep(
      "P2 Local Event (e2) — Concurrent to e1",
      "P2 increments V_2[2] to 1. Vector becomes [0,1,0].",
      "V_2[2] = V_2[2] + 1",
      "Events e1 [1,0,0] and e2 [0,1,0] are CONCURRENT (e1 || e2) because neither causally preceded the other.",
      5,
      ['P2'],
      [],
      "P2 performs local event e2 -> V2=[0,1,0]",
      "P2"
    );

    // STEP 3: P1 Sends Message to P2
    vectors['P1'][0] += 1;
    const sentVec1 = [...vectors['P1']];
    pushStep(
      "P1 Sends Message to P2 (V_msg = [2,0,0])",
      "P1 increments V_1[1] to 2 and sends message with vector payload [2,0,0].",
      "V_1[1] = V_1[1] + 1; send(msg, V_1)",
      "The message carries P1's complete causal knowledge [2,0,0] across the network channel.",
      8,
      ['P1'],
      [{ id: 'v1', from: 'P1', to: 'P2', label: 'V:[2,0,0]', progress: 0.3 }],
      "P1 sends msg to P2 with vector [2,0,0]",
      "P1",
      "P2"
    );

    // STEP 4: P2 Receives Message from P1
    for (let k = 0; k < nodeCount; k++) {
      vectors['P2'][k] = Math.max(vectors['P2'][k], sentVec1[k]);
    }
    vectors['P2'][1] += 1;
    pushStep(
      "P2 Receives Message from P1",
      "P2 computes element-wise max([0,1,0], [2,0,0]) = [2,1,0], then increments its own component V_2[2] to 2. Final V_2 = [2,2,0].",
      "V_2[j] = max(V_2[j], V_msg[j]); V_2[2] = V_2[2] + 1",
      "P2 now knows causally about P1's send event! V_2=[2,2,0] > V_1=[2,0,0], confirming e1 -> e_recv.",
      13,
      ['P2'],
      [{ id: 'v1', from: 'P1', to: 'P2', label: 'V:[2,0,0]', progress: 1.0, status: 'DELIVERED' }],
      "P2 receives msg from P1, updates vector to [2,2,0]",
      "P2"
    );

    // STEP 5: P3 Local Event
    vectors['P3'][2] += 1;
    pushStep(
      "P3 Local Event (e3)",
      "P3 increments V_3[3] to 1. Vector becomes [0,0,1].",
      "V_3[3] = V_3[3] + 1",
      "Event e3 [0,0,1] is concurrent with P2's event [2,2,0].",
      5,
      ['P3'],
      [],
      "P3 performs local event e3 -> V3=[0,0,1]",
      "P3"
    );

    // STEP 6: P2 Sends Message to P3
    vectors['P2'][1] += 1;
    const sentVec2 = [...vectors['P2']];
    pushStep(
      "P2 Sends Message to P3 (V_msg = [2,3,0])",
      "P2 increments V_2[2] to 3 and sends payload [2,3,0] to P3.",
      "V_2[2] = V_2[2] + 1; send(msg, V_2)",
      "The message carries knowledge of both P1 and P2's past events.",
      8,
      ['P2'],
      [{ id: 'v2', from: 'P2', to: 'P3', label: 'V:[2,3,0]', progress: 0.4 }],
      "P2 sends msg to P3 with vector [2,3,0]",
      "P2",
      "P3"
    );

    // STEP 7: P3 Receives Message from P2
    for (let k = 0; k < nodeCount; k++) {
      vectors['P3'][k] = Math.max(vectors['P3'][k], sentVec2[k]);
    }
    vectors['P3'][2] += 1;
    pushStep(
      "P3 Receives Message from P2",
      "P3 computes max([0,0,1], [2,3,0]) = [2,3,1], then increments V_3[3] to 2. Final V_3 = [2,3,2].",
      "V_3[j] = max(V_3[j], V_msg[j]); V_3[3] = V_3[3] + 1",
      "P3 has now synchronized state with both P1 and P2!",
      13,
      ['P3'],
      [{ id: 'v2', from: 'P2', to: 'P3', label: 'V:[2,3,0]', progress: 1.0, status: 'DELIVERED' }],
      "P3 receives msg from P2, updates vector to [2,3,2]",
      "P3"
    );

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
      {/* Topology & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 light:border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Vector Clock Network Topology
              </h3>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60 light:border-gray-200">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={connections}
                showClock={false}
                showVector={true}
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
          <CausalityInspector events={sim.activeState.events || []} />
        </div>
      </div>

      {/* Bottom Grid: Explanation & Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExplanationPanel activeState={sim.activeState} />
        <EventLog events={sim.activeState.events || []} currentStep={sim.currentStep} />
      </div>
    </div>
  );
}
