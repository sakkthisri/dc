import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const SCHEDULING_PSEUDOCODE = [
  "// Distributed Task Scheduling & Work-Stealing Engine",
  "1. Master Queue Scheduling:",
  "   - Scheduler receives batch of 10 tasks",
  "   - Dispatches tasks to Workers W1, W2 based on available slots",
  "2. Work-Stealing Protocol:",
  "   - Worker W1 queue becomes empty while Worker W2 has 6 pending tasks",
  "   - Idle Worker W1 sends STEAL_TASK request to Worker W2",
  "   - Worker W2 transfers 3 tasks to Worker W1 queue",
  "3. Execution & Completion: Parallel task execution balances cluster utilization"
];

export function DistributedSchedulingVisualizer() {
  const [schedAlgo, setSchedAlgo] = useState("WORK_STEAL"); // "MASTER_QUEUE", "WORK_STEAL"

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 180 }, // Scheduler Master
      { x: 340, y: 100 }, // Worker W1 (Empty / Stealer)
      { x: 340, y: 260 }  // Worker W2 (Overloaded)
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['ROUTER', 'ACTIVE', 'ACTIVE'],
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
          { id: "Master", label: "Scheduler Master", x: positions[0].x, y: positions[0].y, status: states[0], role: 'ROUTER' },
          { id: "W1", label: "Worker W1 (Queue: 0)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'PRIMARY' },
          { id: "W2", label: "Worker W2 (Queue: 6)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'REPLICA' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        schedInfo: `Scheduler Mode: ${schedAlgo} | W1 Task Queue: 0 | W2 Task Queue: 6 (Imbalanced)`
      });
    };

    // STEP 0: Initial Imbalance
    pushStep({
      title: "Workload Queue Imbalance State",
      explanation: "Worker W1 completed its tasks (Queue: 0). Worker W2 has 6 pending tasks queued up.",
      rule: "Scheduling Imbalance",
      why: "Unbalanced task queues waste idle worker CPU cycles.",
      codeLine: 1,
      actionText: "Task queue imbalance detected (W1 idle, W2 overloaded)",
      actor: "Master"
    });

    if (schedAlgo === "WORK_STEAL") {
      const stealReqMsg = [{ from: "W1", to: "W2", label: "STEAL_TASKS(count=3)", type: "request" }];
      pushStep({
        title: "Work-Stealing Protocol: Idle Worker W1 Steals Tasks",
        explanation: "Idle Worker W1 sends STEAL_TASKS request to overloaded Worker W2 to steal half of its queued tasks.",
        rule: "Work-Stealing Algorithm",
        why: "Decentralized work-stealing allows idle nodes to offload busy nodes without bottlenecking the master scheduler.",
        codeLine: 2,
        messages: stealReqMsg,
        states: ['ROUTER', 'LEADER', 'PROMISE'],
        actionText: "Idle Worker W1 sent STEAL_TASKS request to W2",
        actor: "W1",
        target: "W2"
      });

      const stealRespMsg = [{ from: "W2", to: "W1", label: "TRANSFER(3 Tasks)", type: "response" }];
      pushStep({
        title: "Tasks Transferred: Equal Cluster Balance Achieved",
        explanation: "Worker W2 transfers 3 tasks to Worker W1. Queues are now balanced (W1: 3 tasks, W2: 3 tasks).",
        rule: "Load Convergence",
        why: "Maximizes cluster parallel speedup by keeping 100% of worker nodes active.",
        codeLine: 3,
        messages: stealRespMsg,
        states: ['ROUTER', 'LEADER', 'LEADER'],
        actionText: "Worker W2 transferred 3 tasks to W1 (Balanced W1:3, W2:3)",
        actor: "W2",
        target: "W1"
      });
    }

    return stepList;
  }, [schedAlgo]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Distributed Task Scheduling & Work-Stealing Visualizer
                </h3>
                <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                  {sim.activeState.schedInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Master", "W1"], ["Master", "W2"], ["W1", "W2"]]}
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
          <CodePanel codeLines={SCHEDULING_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Scheduling Policy
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Scheduling Policy:</label>
              <select
                value={schedAlgo}
                onChange={(e) => setSchedAlgo(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="WORK_STEAL">Work-Stealing (Decentralized Idle Worker Transfer)</option>
                <option value="MASTER_QUEUE">Centralized Master FIFO Queue</option>
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
