import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const CONSISTENCY_PSEUDOCODE = [
  "// Distributed Consistency Models",
  "1. Strict Consistency (Linearizability):",
  "   - Any read immediately returns value of latest write across entire network",
  "   - Requires synchronous blocking locks across all replicas",
  "2. Eventual Consistency:",
  "   - Replicas accept local writes immediately & propagate updates asynchronously",
  "   - Reads may temporarily return stale values until background convergence",
  "3. Causal Consistency:",
  "   - Guarantees causally related writes are seen by all nodes in identical order"
];

export function ConsistencyModelsVisualizer() {
  const [modelType, setModelType] = useState("EVENTUAL"); // "STRICT", "EVENTUAL", "CAUSAL"

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 180 }, // Writer Client
      { x: 300, y: 100 }, // Replica A
      { x: 300, y: 260 }, // Replica B
      { x: 500, y: 180 }  // Reader Client
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['PRIMARY', 'LEADER', 'REPLICA', 'NODE'],
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
          type: "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "Writer", label: "Writer Client", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "RepA", label: "Replica A (x=10)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'LEADER' },
          { id: "RepB", label: "Replica B", x: positions[2].x, y: positions[2].y, status: states[2], role: 'REPLICA' },
          { id: "Reader", label: "Reader Client", x: positions[3].x, y: positions[3].y, status: states[3], role: 'NODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        modelInfo: `Consistency Model: ${modelType} | Target Data: x=10 -> x=20`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "Cluster Initialized",
      explanation: `System running in ${modelType} Consistency Mode. Initial value x=10 across Replica A and Replica B.`,
      rule: "Consistency Initial State",
      why: "Consistency models define formal guarantees regarding order and freshness of read operations following writes.",
      codeLine: 1,
      actionText: "Initial state x=10 across replicas",
      actor: "Cluster"
    });

    // STEP 1: Write to Replica A
    const writeMsg = [{ from: "Writer", to: "RepA", label: "WRITE(x=20)", type: "request" }];
    pushStep({
      title: "Writer Sends WRITE(x=20) to Replica A",
      explanation: "Writer Client submits update x=20 to Replica A.",
      rule: "Write Submission",
      why: "Replica A updates local memory x=20 immediately.",
      codeLine: 1,
      messages: writeMsg,
      states: ['PRIMARY', 'LEADER', 'REPLICA', 'NODE'],
      actionText: "Writer sent WRITE(x=20) to Replica A",
      actor: "Writer",
      target: "Replica A"
    });

    if (modelType === "STRICT") {
      const syncMsgs = [
        { from: "RepA", to: "RepB", label: "SYNC_WRITE(x=20)", type: "request" },
        { from: "RepB", to: "RepA", label: "ACK", type: "response" }
      ];

      pushStep({
        title: "Strict Consistency: Synchronous Locking & Propagation",
        explanation: "Replica A blocks response and synchronously propagates x=20 to Replica B before confirming write completion.",
        rule: "Linearizability Guarantee",
        why: "Strict consistency forces instant global agreement so no client can read a stale value.",
        codeLine: 2,
        messages: syncMsgs,
        states: ['PRIMARY', 'LEADER', 'LEADER', 'NODE'],
        actionText: "Replica A synchronously replicated x=20 to Replica B",
        actor: "Replica A",
        target: "Replica B"
      });

      const readMsg = [
        { from: "Reader", to: "RepB", label: "READ(x)", type: "request" },
        { from: "RepB", to: "Reader", label: "return x=20", type: "response" }
      ];

      pushStep({
        title: "Reader Queries Replica B -> Returns Fresh Value (x=20)",
        explanation: "Reader Client queries Replica B. Because write was synchronous, Replica B immediately returns x=20.",
        rule: "Strict Read Guarantee",
        why: "Guarantees absolute linearizability across all node read queries.",
        codeLine: 2,
        messages: readMsg,
        states: ['PRIMARY', 'LEADER', 'LEADER', 'LEADER'],
        actionText: "Reader received x=20 from Replica B (Fresh Read)",
        actor: "Reader",
        target: "Replica B"
      });
    } else {
      // EVENTUAL / CAUSAL
      const readStaleMsg = [
        { from: "Reader", to: "RepB", label: "READ(x)", type: "request" },
        { from: "RepB", to: "Reader", label: "return x=10 (Stale)", type: "response" }
      ];

      pushStep({
        title: `${modelType} Consistency: Reader Queries Replica B (Stale Read x=10)`,
        explanation: "Reader Client queries Replica B BEFORE asynchronous replication finishes. Replica B returns stale value x=10!",
        rule: `${modelType} Stale Read Window`,
        why: "Asynchronous replication trades short-term read freshness for maximum write speed and availability.",
        codeLine: 6,
        messages: readStaleMsg,
        states: ['PRIMARY', 'LEADER', 'PROMISE', 'NODE'],
        actionText: "Reader received stale x=10 from Replica B during replication lag",
        actor: "Reader",
        target: "Replica B"
      });

      const asyncMsg = [{ from: "RepA", to: "RepB", label: "ASYNC_PROPAGATE(x=20)", type: "request" }];
      pushStep({
        title: "Background Asynchronous Propagation & Convergence",
        explanation: "Replica A background-streams update x=20 to Replica B. Replicas converge to identical state x=20.",
        rule: "Eventual Convergence",
        why: "Eventual consistency guarantees all replicas will become consistent given sufficient time without new writes.",
        codeLine: 7,
        messages: asyncMsg,
        states: ['PRIMARY', 'LEADER', 'LEADER', 'LEADER'],
        actionText: "Replicas converged! Replica B updated to x=20",
        actor: "Replica A",
        target: "Replica B"
      });
    }

    return stepList;
  }, [modelType]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Consistency Models & Replication Lag Visualizer
                </h3>
                <p className="text-[11px] text-purple-400 font-mono mt-0.5">
                  {sim.activeState.modelInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Writer", "RepA"], ["RepA", "RepB"], ["Reader", "RepB"]]}
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
          <CodePanel codeLines={CONSISTENCY_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Consistency Model Selector
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Consistency Level:</label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="EVENTUAL">Eventual Consistency (Async replication, temporary stale reads)</option>
                <option value="STRICT">Strict Consistency (Linearizable, synchronous blocking locks)</option>
                <option value="CAUSAL">Causal Consistency (Preserves happens-before order)</option>
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
