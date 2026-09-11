import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const MINING_PSEUDOCODE = [
  "// Distributed Data Mining & Parameter Server Architecture",
  "1. Feature Extraction: Worker nodes (Node A, Node B, Node C) extract local features",
  "2. Parallel Model Training:",
  "   - Node A trains local gradient w_A on Partition 1",
  "   - Node B trains local gradient w_B on Partition 2",
  "3. Parameter Aggregation:",
  "   - Workers send local gradients (w_A, w_B) to Parameter Server",
  "   - Parameter Server computes global model update: W_new = W - alpha * avg(w_A, w_B)",
  "4. Model Sync: Broadcast global model parameters W_new back to workers"
];

export function DistributedDataMiningVisualizer() {
  const [miningTask, setMiningTask] = useState("KMEANS"); // "KMEANS" vs "GRADIENT_DESCENT"

  const steps = useMemo(() => {
    const positions = [
      { x: 320, y: 80 },  // Parameter Server / Aggregator
      { x: 120, y: 260 }, // Worker Node A
      { x: 320, y: 260 }, // Worker Node B
      { x: 520, y: 260 }  // Worker Node C
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['NAMENODE', 'PRIMARY', 'PRIMARY', 'PRIMARY'],
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
          { id: "PS", label: "Parameter Server", x: positions[0].x, y: positions[0].y, status: states[0], role: 'NAMENODE' },
          { id: "WorkerA", label: "Worker A (Data P1)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'PRIMARY' },
          { id: "WorkerB", label: "Worker B (Data P2)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'PRIMARY' },
          { id: "WorkerC", label: "Worker C (Data P3)", x: positions[3].x, y: positions[3].y, status: states[3], role: 'PRIMARY' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        dmInfo: `Task: Distributed ${miningTask} Mining | Architecture: Workers -> Parameter Server Aggregation`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "Distributed Data Mining Initialized",
      explanation: `Dataset partitioned across Worker A, B, C. Parameter Server holds global model weights W.`,
      rule: "Distributed Mining Architecture",
      why: "Distributed mining processes petabyte-scale data without centralizing raw records onto a single machine.",
      codeLine: 1,
      actionText: "Distributed data mining cluster ready",
      actor: "Parameter Server"
    });

    // STEP 1: Parallel Local Training
    pushStep({
      title: "Phase 1: Parallel Local Compute",
      explanation: "Workers A, B, and C compute local gradient updates (w_A, w_B, w_C) on local data partitions in parallel.",
      rule: "Local Gradient Step",
      why: "Computing gradients locally minimizes network overhead by sending compact parameter updates instead of raw data.",
      codeLine: 2,
      states: ['NAMENODE', 'LEADER', 'LEADER', 'LEADER'],
      actionText: "Workers computed local gradient updates",
      actor: "Workers"
    });

    // STEP 2: Gradient Push to Parameter Server
    const pushMsgs = [
      { from: "WorkerA", to: "PS", label: "Push Gradient w_A", type: "request" },
      { from: "WorkerB", to: "PS", label: "Push Gradient w_B", type: "request" },
      { from: "WorkerC", to: "PS", label: "Push Gradient w_C", type: "request" }
    ];

    pushStep({
      title: "Phase 2: Push Local Gradients to Parameter Server",
      explanation: "Workers transmit gradient vectors to Parameter Server.",
      rule: "Parameter Push",
      why: "Aggregating updates at the parameter server ensures model convergence.",
      codeLine: 3,
      messages: pushMsgs,
      states: ['LEADER', 'PROMISE', 'PROMISE', 'PROMISE'],
      actionText: "Workers pushed local gradients to Parameter Server",
      actor: "Workers",
      target: "Parameter Server"
    });

    // STEP 3: Global Model Sync Broadcast
    const syncMsgs = [
      { from: "PS", to: "WorkerA", label: "Sync W_new", type: "response" },
      { from: "PS", to: "WorkerB", label: "Sync W_new", type: "response" },
      { from: "PS", to: "WorkerC", label: "Sync W_new", type: "response" }
    ];

    pushStep({
      title: "Phase 3: Global Model Weight Broadcast (W_new)",
      explanation: "Parameter Server averages gradients, updates global weight W_new, and broadcasts updated model weights back to all workers.",
      rule: "Model Synchronization",
      why: "Synchronizing global weights keeps worker models aligned for subsequent iteration steps.",
      codeLine: 4,
      messages: syncMsgs,
      states: ['LEADER', 'LEADER', 'LEADER', 'LEADER'],
      actionText: "Parameter Server broadcast updated global model W_new",
      actor: "Parameter Server",
      target: "Workers"
    });

    return stepList;
  }, [miningTask]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Distributed Data Mining & Parameter Server Architecture
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.dmInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["PS", "WorkerA"], ["PS", "WorkerB"], ["PS", "WorkerC"]]}
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
          <CodePanel codeLines={MINING_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Mining Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Algorithm Task:</label>
              <select
                value={miningTask}
                onChange={(e) => setMiningTask(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="KMEANS">Distributed K-Means Clustering</option>
                <option value="GRADIENT_DESCENT">Distributed Stochastic Gradient Descent (SGD)</option>
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
