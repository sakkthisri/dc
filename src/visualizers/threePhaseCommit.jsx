import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const THREE_PC_PSEUDOCODE = [
  "// Three-Phase Commit (3PC) Non-Blocking Protocol",
  "// Phase 1: CanCommit",
  "1. Coordinator C asks CAN_COMMIT? to cohorts",
  "2. Cohorts verify system resources & reply YES / NO",
  "",
  "// Phase 2: PreCommit",
  "3. If all voted YES: Coordinator broadcasts PRE_COMMIT",
  "4. Cohorts enter PRE_COMMIT state, acquire locks, write WAL & reply ACK",
  "",
  "// Phase 3: DoCommit",
  "5. Coordinator broadcasts DO_COMMIT",
  "6. Cohorts finalize commit & reply ACK",
  "",
  "// Non-Blocking Timeout Recovery Rule:",
  "7. If Coordinator crashes during PRE_COMMIT:",
  "   - Cohorts timeout and safely auto-commit! (No 2PC lockup)"
];

export function ThreePhaseCommitVisualizer() {
  const [coordFailInPreCommit, setCoordFailInPreCommit] = useState(false);

  const steps = useMemo(() => {
    const positions = [
      { x: 320, y: 80 },  // Coordinator C
      { x: 120, y: 260 }, // DB1
      { x: 320, y: 260 }, // DB2
      { x: 520, y: 260 }  // DB3
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      cState = 'ACTIVE',
      dbStates = ['ACTIVE', 'ACTIVE', 'ACTIVE'],
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
          type: actionText.includes("PreCommit") ? "CONSENSUS" : actionText.includes("CRASH") ? "CRASH" : "SYSTEM"
        });
      }

      stepList.push({
        nodes: [
          { id: "C", label: "Coordinator", x: positions[0].x, y: positions[0].y, status: cState, role: 'COORDINATOR' },
          { id: "DB1", label: "Cohort DB1", x: positions[1].x, y: positions[1].y, status: dbStates[0], role: 'COHORT' },
          { id: "DB2", label: "Cohort DB2", x: positions[2].x, y: positions[2].y, status: dbStates[1], role: 'COHORT' },
          { id: "DB3", label: "Cohort DB3", x: positions[3].x, y: positions[3].y, status: dbStates[2], role: 'COHORT' }
        ],
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
    pushStep({
      title: "3PC Initialization",
      explanation: "3PC introduces an intermediate 'PreCommit' state between prepare and commit to guarantee non-blocking execution under network partitions.",
      rule: "3PC Initialization",
      why: "By splitting prepare into CanCommit and PreCommit, no cohort can be in a commit state while another is in an un-prepared state.",
      codeLine: 1,
      actionText: "3PC Transaction TX_303 started",
      actor: "Coordinator"
    });

    // STEP 1: Phase 1 CanCommit
    const canCommitMsgs = [
      { from: "C", to: "DB1", label: "CAN_COMMIT?", type: "request" },
      { from: "C", to: "DB2", label: "CAN_COMMIT?", type: "request" },
      { from: "C", to: "DB3", label: "CAN_COMMIT?", type: "request" }
    ];

    pushStep({
      title: "Phase 1: CanCommit Inquiry",
      explanation: "Coordinator broadcasts CAN_COMMIT? to DB1, DB2, DB3 to query whether hardware and schema locks are ready.",
      rule: "Phase 1: CanCommit",
      why: "Checks node readiness without taking heavy locks early.",
      codeLine: 1,
      messages: canCommitMsgs,
      cState: 'WAITING',
      actionText: "Coordinator sends CAN_COMMIT?",
      actor: "Coordinator",
      target: "DB1, DB2, DB3"
    });

    // STEP 2: CanCommit Responses
    const yesMsgs = [
      { from: "DB1", to: "C", label: "YES", type: "response" },
      { from: "DB2", to: "C", label: "YES", type: "response" },
      { from: "DB3", to: "C", label: "YES", type: "response" }
    ];

    pushStep({
      title: "Phase 1: All Cohorts Reply YES",
      explanation: "All cohorts reply YES, confirming readiness to proceed to the lock preparation phase.",
      rule: "CanCommit Voting",
      why: "Universal YES allows transition to Phase 2 PreCommit.",
      codeLine: 2,
      messages: yesMsgs,
      actionText: "All cohorts voted YES",
      actor: "Cohorts",
      target: "Coordinator"
    });

    // STEP 3: Phase 2 PreCommit
    const preCommitMsgs = [
      { from: "C", to: "DB1", label: "PRE_COMMIT", type: "request" },
      { from: "C", to: "DB2", label: "PRE_COMMIT", type: "request" },
      { from: "C", to: "DB3", label: "PRE_COMMIT", type: "request" }
    ];

    pushStep({
      title: "Phase 2: PreCommit Broadcast",
      explanation: "Coordinator broadcasts PRE_COMMIT. Cohorts enter PRE_COMMIT state, acquire database locks, and write WAL logs.",
      rule: "Phase 2: PreCommit",
      why: "PreCommit guarantees all cohorts have agreed and prepared locks before any node actually commits state changes.",
      codeLine: 3,
      messages: preCommitMsgs,
      dbStates: ['PROMISE', 'PROMISE', 'PROMISE'],
      actionText: "Coordinator broadcasts PRE_COMMIT",
      actor: "Coordinator",
      target: "Cohorts"
    });

    if (coordFailInPreCommit) {
      // NON-BLOCKING RECOVERY DEMO
      pushStep({
        title: "Coordinator Crashes in PreCommit phase!",
        explanation: "Coordinator crashes! In 2PC this would block nodes forever, BUT in 3PC cohorts detect Coordinator timeout while in PRE_COMMIT.",
        rule: "3PC Timeout Recovery",
        why: "Because all nodes entered PRE_COMMIT together, cohorts know no node could have aborted. Cohorts safely AUTO-COMMIT after timeout!",
        codeLine: 7,
        cState: 'CRASHED',
        dbStates: ['PROMISE', 'PROMISE', 'PROMISE'],
        actionText: "Coordinator crashed! Cohorts start PreCommit timeout timer",
        actor: "Cohorts"
      });

      pushStep({
        title: "3PC Non-Blocking Resolution: Auto-Commit Complete",
        explanation: "Cohorts DB1, DB2, DB3 timeout and automatically finalize DO_COMMIT locally, unlocking resources without waiting for coordinator recovery!",
        rule: "Auto-Commit Rule",
        why: "3PC eliminates the blocking problem inherent in 2PC, making transaction protocols partition-tolerant.",
        codeLine: 7,
        cState: 'CRASHED',
        dbStates: ['LEADER', 'LEADER', 'LEADER'],
        actionText: "Cohorts auto-committed transaction successfully!",
        actor: "Cohorts"
      });
    } else {
      // STEP 4: Phase 3 DoCommit
      const doCommitMsgs = [
        { from: "C", to: "DB1", label: "DO_COMMIT", type: "request" },
        { from: "C", to: "DB2", label: "DO_COMMIT", type: "request" },
        { from: "C", to: "DB3", label: "DO_COMMIT", type: "request" }
      ];

      pushStep({
        title: "Phase 3: DoCommit Broadcast",
        explanation: "Coordinator receives ACKs for PreCommit and broadcasts final DO_COMMIT instructions.",
        rule: "Phase 3: DoCommit",
        why: "Final step committing data changes permanently to storage.",
        codeLine: 5,
        messages: doCommitMsgs,
        cState: 'ACTIVE',
        actionText: "Coordinator broadcasts DO_COMMIT",
        actor: "Coordinator",
        target: "Cohorts"
      });

      // STEP 5: Transaction Finalized
      pushStep({
        title: "Transaction Finalized & Committed",
        explanation: "Cohorts write transaction commit markers to disk and release locks completely.",
        rule: "3PC Finalization",
        why: "Atomic, consistent state commitment across all distributed database shards.",
        codeLine: 6,
        dbStates: ['LEADER', 'LEADER', 'LEADER'],
        actionText: "3PC Transaction committed successfully",
        actor: "Cohorts"
      });
    }

    return stepList;
  }, [coordFailInPreCommit]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Three-Phase Commit (3PC) Topology & Non-Blocking Engine
              </h3>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["C", "DB1"], ["C", "DB2"], ["C", "DB3"]]}
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
          <CodePanel codeLines={THREE_PC_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              3PC Simulation Controls
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Coordinator Fault Scenario:</label>
              <button
                onClick={() => setCoordFailInPreCommit(!coordFailInPreCommit)}
                className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                  coordFailInPreCommit
                    ? "bg-amber-600/30 border-amber-500 text-amber-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {coordFailInPreCommit
                  ? "Crash Coordinator in PreCommit (Demonstrate 3PC Auto-Commit)"
                  : "Normal Coordinator Operation (3-Phase Flow)"}
              </button>
            </div>

            <div className="mt-3 p-2.5 bg-gray-950/80 border border-gray-800 rounded text-[11px] space-y-1 text-gray-300">
              <div className="font-bold text-gray-200 uppercase tracking-wide">2PC vs 3PC Quick Comparison</div>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <span className="text-red-400 font-semibold">2PC: Blocking</span>
                <span className="text-emerald-400 font-semibold">3PC: Non-Blocking</span>
                <span className="text-gray-400">2 Phases (Prepare, Commit)</span>
                <span className="text-gray-400">3 Phases (+PreCommit)</span>
              </div>
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
