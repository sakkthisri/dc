import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const FAILURE_DETECTION_PSEUDOCODE = [
  "// Heartbeat Failure Detector Protocol",
  "1. Monitoring Master P1 sends periodic Heartbeat Ping to Workers (P2, P3, P4)",
  "2. Workers reply with Heartbeat ACK",
  "3. Timer Check (Timeout T = 3s):",
  "   - If no ACK received within T:",
  "         Transition node state to SUSPECTED_FAILED",
  "   - If no ACK received within 2T:",
  "         Transition node state to CONFIRMED_DEAD",
  "4. Node Recovery:",
  "   - If P3 sends ACK after recovery: clear failure suspicion & mark HEALTHY"
];

export function FailureDetectionVisualizer() {
  const [nodeToCrash, setNodeToCrash] = useState("P3");

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 180 }, // Monitor Master P1
      { x: 340, y: 80 },  // P2
      { x: 340, y: 180 }, // P3 (Target)
      { x: 340, y: 280 }  // P4
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['LEADER', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
      messages = [],
      actionText = '',
      actor = '',
      target = ''
    }) => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: actor,
          to: target,
          type: actionText.includes("SUSPECTED") || actionText.includes("DEAD") ? "CRASH" : "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "P1", label: "P1 (Monitor)", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "P2", label: "P2 (Worker)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'REPLICA' },
          { id: "P3", label: "P3 (Worker)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'REPLICA' },
          { id: "P4", label: "P4 (Worker)", x: positions[3].x, y: positions[3].y, status: states[3], role: 'REPLICA' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        hbInfo: `Monitor: P1 | Target: ${nodeToCrash} | Failure Model: Crash-Stop with Heartbeat Timeout`
      });
    };

    // STEP 0: Initial Normal Heartbeat
    pushStep({
      title: "Normal Heartbeat Operation (Interval t=1s)",
      explanation: "Monitor Node P1 broadcasts periodic Heartbeat Ping messages to P2, P3, and P4.",
      rule: "Heartbeat Ping",
      why: "Heartbeat messages continuously assert node liveness across asynchronous networks.",
      codeLine: 1,
      messages: [
        { from: "P1", to: "P2", label: "HEARTBEAT_PING", type: "request" },
        { from: "P1", to: "P3", label: "HEARTBEAT_PING", type: "request" },
        { from: "P1", to: "P4", label: "HEARTBEAT_PING", type: "request" }
      ],
      actionText: "P1 sent Heartbeat Ping to all Workers",
      actor: "P1",
      target: "P2, P3, P4"
    });

    // STEP 1: Heartbeat ACKs Received
    pushStep({
      title: "Heartbeat ACKs Received (All Healthy)",
      explanation: "Workers P2, P3, P4 reply with HEARTBEAT_ACK. P1 resets timer count to 0 for all nodes.",
      rule: "Liveness Confirmation",
      why: "ACKs confirm worker processes are active and network sockets are responsive.",
      codeLine: 2,
      messages: [
        { from: "P2", to: "P1", label: "ACK", type: "response" },
        { from: "P3", to: "P1", label: "ACK", type: "response" },
        { from: "P4", to: "P1", label: "ACK", type: "response" }
      ],
      actionText: "All workers replied ACK (Cluster Healthy)",
      actor: "Workers",
      target: "P1"
    });

    // STEP 2: Target Node Crash
    const crashedStates = ['LEADER', 'ACTIVE', nodeToCrash === "P3" ? "CRASHED" : "ACTIVE", 'ACTIVE'];
    pushStep({
      title: `Node ${nodeToCrash} Crashes!`,
      explanation: `Worker ${nodeToCrash} experiences an unhandled crash failure. Heartbeat ping fails to generate ACK.`,
      rule: "Crash Failure",
      why: "Crash-stop failure models assume crashed nodes cease all execution without sending malicious data.",
      codeLine: 3,
      states: crashedStates,
      actionText: `Node ${nodeToCrash} crashed! ACK missing`,
      actor: nodeToCrash
    });

    // STEP 3: Timeout Expired -> Suspected Failure
    pushStep({
      title: `Timeout T Expired! Node ${nodeToCrash} SUSPECTED FAILED`,
      explanation: `Heartbeat timer for ${nodeToCrash} exceeds threshold T=3s. Monitor P1 marks ${nodeToCrash} as SUSPECTED_FAILED.`,
      rule: "Suspected Failure Transition",
      why: "In asynchronous networks, timeout expiration indicates potential process crash or high network delay.",
      codeLine: 3,
      states: ['LEADER', 'ACTIVE', 'PROMISE', 'ACTIVE'],
      actionText: `P1 marked Node ${nodeToCrash} as SUSPECTED_FAILED`,
      actor: "P1"
    });

    // STEP 4: Double Timeout -> Confirmed Dead
    pushStep({
      title: `Timeout 2T Expired! Node ${nodeToCrash} CONFIRMED DEAD`,
      explanation: `Timer exceeds 2T=6s with zero heartbeats. Monitor P1 removes ${nodeToCrash} from active routing tables.`,
      rule: "Confirmed Dead Transition",
      why: "Permanent failure confirmation triggers automated failover and workload rescheduling.",
      codeLine: 3,
      states: ['LEADER', 'ACTIVE', 'CRASHED', 'ACTIVE'],
      actionText: `Node ${nodeToCrash} marked CONFIRMED_DEAD; removed from cluster`,
      actor: "P1"
    });

    return stepList;
  }, [nodeToCrash]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Heartbeat Failure Detection Visualizer
                </h3>
                <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                  {sim.activeState.hbInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["P1", "P2"], ["P1", "P3"], ["P1", "P4"]]}
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
          <CodePanel codeLines={FAILURE_DETECTION_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Fault Injection Controls
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Target Node to Crash:</label>
              <select
                value={nodeToCrash}
                onChange={(e) => setNodeToCrash(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="P3">Worker Node P3</option>
                <option value="P2">Worker Node P2</option>
              </select>
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
