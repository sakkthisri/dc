import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const RECOVERY_PSEUDOCODE = [
  "// Distributed Checkpoint & Write-Ahead Log (WAL) Recovery",
  "1. Normal Execution: Transactions written to WAL disk log",
  "2. Periodic Checkpoint (LSN=100): Snapshot state saved to stable storage",
  "3. Crash Event: System crashes at LSN=140",
  "4. State Restoration Phase:",
  "   - Load latest consistent Checkpoint (LSN=100)",
  "5. Log Replay Phase (Redo / Undo):",
  "   - Replay WAL log entries LSN=101 .. LSN=140 in sequential order",
  "6. Service Restored: System resumes processing client traffic"
];

export function DistributedRecoveryVisualizer() {
  const [recoveryMethod, setRecoveryMethod] = useState("WAL_REPLAY");

  const steps = useMemo(() => {
    const positions = [
      { x: 120, y: 180 }, // App Process
      { x: 320, y: 180 }, // WAL Disk Log
      { x: 520, y: 180 }  // Stable Storage Checkpoint
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['ACTIVE', 'ACTIVE', 'ACTIVE'],
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
          type: actionText.includes("Crash") ? "CRASH" : "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "App", label: "App Process", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "WAL", label: "WAL Disk Log", x: positions[1].x, y: positions[1].y, status: states[1], role: 'NODE' },
          { id: "Storage", label: "Checkpoint Store", x: positions[2].x, y: positions[2].y, status: states[2], role: 'NAMENODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        recInfo: `Recovery Mechanism: ${recoveryMethod} | State: Checkpoint LSN=100 + WAL Log Replay (LSN 101..140)`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "Normal Execution & WAL Logging",
      explanation: "App executes transactions (LSN=101..140) and appends write-ahead logs (WAL) to disk before modifying in-memory state.",
      rule: "Write-Ahead Logging",
      why: "WAL ensures atomic durability (ACID 'D') by persisting state changes on disk prior to RAM state mutation.",
      codeLine: 1,
      messages: [{ from: "App", to: "WAL", label: "Append WAL (LSN=101..140)", type: "request" }],
      actionText: "App process writing transactions to WAL log",
      actor: "App",
      target: "WAL"
    });

    // STEP 1: Checkpoint Saved
    pushStep({
      title: "Periodic Checkpoint Saved (LSN=100)",
      explanation: "App flushes dirty RAM pages to stable storage snapshot checkpoint LSN=100.",
      rule: "Checkpointing",
      why: "Checkpointing truncates log replay requirements during recovery, speeding up restart times.",
      codeLine: 2,
      messages: [{ from: "App", to: "Storage", label: "Flush Checkpoint (LSN=100)", type: "request" }],
      states: ['LEADER', 'ACTIVE', 'LEADER'],
      actionText: "Checkpoint LSN=100 saved to stable storage",
      actor: "App",
      target: "Storage"
    });

    // STEP 2: System Crash
    pushStep({
      title: "System Crash at LSN=140!",
      explanation: "App process experiences sudden power outage at LSN=140. In-memory RAM state lost completely.",
      rule: "Crash Recovery Trigger",
      why: "Crash recovery must reconstruct exact state prior to crash from disk logs.",
      codeLine: 3,
      states: ['CRASHED', 'ACTIVE', 'ACTIVE'],
      actionText: "App process crashed! In-memory RAM wiped",
      actor: "App"
    });

    // STEP 3: Load Checkpoint
    pushStep({
      title: "Recovery Phase 1: Load Checkpoint (LSN=100)",
      explanation: "Recovery manager restarts process and loads baseline Checkpoint LSN=100 from stable storage.",
      rule: "State Restoration",
      why: "Establishes known good baseline snapshot.",
      codeLine: 4,
      messages: [{ from: "Storage", to: "App", label: "Load Snapshot (LSN=100)", type: "response" }],
      states: ['PROMISE', 'ACTIVE', 'LEADER'],
      actionText: "Loaded base Checkpoint snapshot LSN=100",
      actor: "Storage",
      target: "App"
    });

    // STEP 4: WAL Log Replay
    pushStep({
      title: "Recovery Phase 2: WAL Log Replay (LSN 101..140)",
      explanation: "Recovery manager reads WAL disk log and sequentially replays transactions LSN=101 through LSN=140.",
      rule: "Redo Log Replay",
      why: "Replaying WAL entries restores uncommitted or un-checkpointed state changes lost in RAM.",
      codeLine: 5,
      messages: [{ from: "WAL", to: "App", label: "Replay WAL (101..140)", type: "response" }],
      states: ['LEADER', 'LEADER', 'ACTIVE'],
      actionText: "Replayed WAL logs LSN 101 through 140",
      actor: "WAL",
      target: "App"
    });

    // STEP 5: Service Restored
    pushStep({
      title: "State Recovery Finalized (100% Consistent)",
      explanation: "Process state fully restored to LSN=140. App resumes accepting active client transactions.",
      rule: "Recovery Complete",
      why: "Guarantees zero lost transactions and complete durability.",
      codeLine: 6,
      states: ['LEADER', 'ACTIVE', 'ACTIVE'],
      actionText: "Service fully restored and processing traffic!",
      actor: "App"
    });

    return stepList;
  }, [recoveryMethod]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Distributed State Recovery & WAL Replay
                </h3>
                <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                  {sim.activeState.recInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["App", "WAL"], ["App", "Storage"]]}
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
          <CodePanel codeLines={RECOVERY_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Recovery Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Recovery Algorithm:</label>
              <select
                value={recoveryMethod}
                onChange={(e) => setRecoveryMethod(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="WAL_REPLAY">Checkpoint + WAL Log Replay (ARIES standard)</option>
                <option value="ROLLBACK">Backward Rollback to Last Checkpoint</option>
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
