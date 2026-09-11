import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const TWO_PC_PSEUDOCODE = [
  "// Two-Phase Commit (2PC) Atomic Protocol",
  "// Phase 1: Prepare Phase",
  "1. Coordinator C sends PREPARE to all Cohorts (DB1, DB2, DB3)",
  "2. Cohort DB_i executes local transaction to prepare stage:",
  "   - If transaction prepare succeeds: write undo/redo log, reply VOTE_COMMIT",
  "   - If prepare fails: reply VOTE_ABORT",
  "",
  "// Phase 2: Commit/Abort Phase",
  "3. Coordinator C gathers votes:",
  "   - If ALL cohorts replied VOTE_COMMIT:",
  "         write COMMIT to WAL; broadcast GLOBAL_COMMIT",
  "   - If ANY cohort replied VOTE_ABORT (or timeout):",
  "         write ABORT to WAL; broadcast GLOBAL_ABORT",
  "4. Cohorts receive global decision: execute commit/rollback & reply ACK"
];

export function TwoPhaseCommitVisualizer() {
  const [voteScenario, setVoteScenario] = useState("COMMIT"); // "COMMIT" or "ABORT"
  const [coordCrash, setCoordCrash] = useState(false);

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
          type: actionText.includes("VOTE") ? "CONSENSUS" : actionText.includes("CRASH") ? "CRASH" : "SYSTEM"
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
      title: "Initial 2PC State",
      explanation: "Coordinator initiates distributed transaction TX_101 across 3 database cohorts (DB1, DB2, DB3).",
      rule: "2PC Initialization",
      why: "2PC guarantees all database partitions either commit changes together atomically or abort completely.",
      codeLine: 1,
      actionText: "Coordinator starts TX_101",
      actor: "Coordinator"
    });

    // STEP 1: Phase 1 Prepare
    const prepMsgs = [
      { from: "C", to: "DB1", label: "PREPARE", type: "request" },
      { from: "C", to: "DB2", label: "PREPARE", type: "request" },
      { from: "C", to: "DB3", label: "PREPARE", type: "request" }
    ];

    pushStep({
      title: "Phase 1: Prepare Broadcast",
      explanation: "Coordinator sends PREPARE message to DB1, DB2, and DB3 requesting local transaction lock & log write.",
      rule: "Phase 1: PREPARE",
      why: "Asking cohorts to prepare ensures they have acquired necessary locks and written write-ahead logs (WAL) prior to committing.",
      codeLine: 1,
      messages: prepMsgs,
      cState: 'WAITING',
      actionText: "Coordinator sends PREPARE to Cohorts",
      actor: "Coordinator",
      target: "DB1, DB2, DB3"
    });

    // STEP 2: Phase 1 Voting
    const isAbort = voteScenario === "ABORT";
    const voteMsgs = [
      { from: "DB1", to: "C", label: "VOTE_COMMIT", type: "response" },
      { from: "DB2", to: "C", label: isAbort ? "VOTE_ABORT" : "VOTE_COMMIT", type: "response" },
      { from: "DB3", to: "C", label: "VOTE_COMMIT", type: "response" }
    ];

    pushStep({
      title: "Phase 1: Cohort Votes Received",
      explanation: isAbort
        ? "DB1 & DB3 vote VOTE_COMMIT, but DB2 votes VOTE_ABORT due to local lock conflict."
        : "All cohorts (DB1, DB2, DB3) successfully lock resources and reply VOTE_COMMIT.",
      rule: "Phase 1 Voting",
      why: "Every cohort must agree to commit for global commit to proceed. A single VOTE_ABORT forces global rollback.",
      codeLine: 3,
      messages: voteMsgs,
      dbStates: [
        'PROMISE',
        isAbort ? 'CRASHED' : 'PROMISE',
        'PROMISE'
      ],
      actionText: isAbort ? "DB2 voted VOTE_ABORT" : "All cohorts voted VOTE_COMMIT",
      actor: "Cohorts",
      target: "Coordinator"
    });

    if (coordCrash) {
      // Coordinator Crash Step (Demonstrates 2PC Blocking Problem)
      pushStep({
        title: "2PC Vulnerability: Coordinator Crashes Post-Prepare!",
        explanation: "Coordinator crashes before broadcasting global decision! Cohorts DB1, DB2, DB3 remain BLOCKED indefinitely in PREPARED state holding database locks.",
        rule: "2PC Blocking Problem",
        why: "In 2PC, cohorts cannot autonomously decide to commit or abort while prepared, leading to resource lock-ups when coordinator dies.",
        codeLine: 7,
        cState: 'CRASHED',
        dbStates: ['PROMISE', 'PROMISE', 'PROMISE'],
        actionText: "Coordinator crashed! Cohorts locked in PREPARED state",
        actor: "Coordinator"
      });
    } else {
      // STEP 3: Phase 2 Global Decision Broadcast
      const decMsg = isAbort ? "GLOBAL_ABORT" : "GLOBAL_COMMIT";
      const decMsgs = [
        { from: "C", to: "DB1", label: decMsg, type: "request" },
        { from: "C", to: "DB2", label: decMsg, type: "request" },
        { from: "C", to: "DB3", label: decMsg, type: "request" }
      ];

      pushStep({
        title: `Phase 2: Broadcast ${decMsg}`,
        explanation: `Coordinator evaluates votes and broadcasts ${decMsg} decision to all database cohorts.`,
        rule: "Phase 2 Broadcast",
        why: isAbort ? "A cohort voted abort, requiring all participating databases to abort and release locks." : "100% commit votes received; all cohorts finalize transaction.",
        codeLine: 8,
        messages: decMsgs,
        cState: 'ACTIVE',
        actionText: `Coordinator broadcasts ${decMsg}`,
        actor: "Coordinator",
        target: "Cohorts"
      });

      // STEP 4: Transaction Complete
      const ackMsgs = [
        { from: "DB1", to: "C", label: "ACK", type: "response" },
        { from: "DB2", to: "C", label: "ACK", type: "response" },
        { from: "DB3", to: "C", label: "ACK", type: "response" }
      ];

      pushStep({
        title: `Transaction ${isAbort ? 'Aborted' : 'Committed'} & Locks Released`,
        explanation: `Cohorts execute ${decMsg}, release database locks, and send ACK back to Coordinator.`,
        rule: "Transaction Completion",
        why: "ACSK confirm that atomic state consistency was updated across all distributed database shards.",
        codeLine: 10,
        messages: ackMsgs,
        cState: 'ACTIVE',
        dbStates: isAbort ? ['CRASHED', 'CRASHED', 'CRASHED'] : ['LEADER', 'LEADER', 'LEADER'],
        actionText: `Transaction finalized: ${decMsg}`,
        actor: "Cohorts"
      });
    }

    return stepList;
  }, [voteScenario, coordCrash]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Two-Phase Commit (2PC) Protocol Topology
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
          <CodePanel codeLines={TWO_PC_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              2PC Simulation Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Cohort Vote Scenario:</label>
              <select
                value={voteScenario}
                onChange={(e) => setVoteScenario(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="COMMIT">All Cohorts Vote COMMIT (Successful TX)</option>
                <option value="ABORT">Cohort DB2 Votes ABORT (Global Rollback)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Coordinator Fault Injection:</label>
              <button
                onClick={() => setCoordCrash(!coordCrash)}
                className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                  coordCrash
                    ? "bg-red-600/30 border-red-500 text-red-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {coordCrash ? "Coordinator Crashed (Simulating 2PC Blocking)" : "Coordinator Healthy"}
              </button>
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
