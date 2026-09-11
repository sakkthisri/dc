import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const PAXOS_PSEUDOCODE = [
  "// Paxos Consensus Protocol",
  "// Phase 1: Prepare",
  "1. Proposer P sends PREPARE(n) with proposal number n to Acceptors",
  "2. Acceptor A receives PREPARE(n):",
  "   if n > minProposal:",
  "      minProposal = n",
  "      reply PROMISE(n, maxAcceptedN, maxAcceptedV)",
  "",
  "// Phase 2: Accept",
  "3. If Proposer receives PROMISE from Majority (N/2 + 1):",
  "      v = value with highest maxAcceptedN (or proposed value v_new)",
  "      send ACCEPT_REQ(n, v) to Acceptors",
  "4. Acceptor A receives ACCEPT_REQ(n, v):",
  "   if n >= minProposal:",
  "      minProposal = n; maxAcceptedN = n; maxAcceptedV = v",
  "      reply ACCEPTED(n, v) to Proposer & Learners",
  "5. If Learner receives ACCEPTED from Majority: Commit Value v"
];

export function PaxosConsensusVisualizer() {
  const [proposalVal, setProposalVal] = useState("V=100");
  const [failedAcceptor, setFailedAcceptor] = useState("None");

  const steps = useMemo(() => {
    // 1 Proposer, 3 Acceptors, 1 Learner = 5 nodes total
    const positions = [
      { x: 100, y: 170 }, // P1 (Proposer)
      { x: 300, y: 70 },  // A1 (Acceptor 1)
      { x: 300, y: 170 }, // A2 (Acceptor 2)
      { x: 300, y: 270 }, // A3 (Acceptor 3)
      { x: 520, y: 170 }  // L1 (Learner)
    ];

    const stepList = [];
    const recordedEvents = [];
    const totalAcceptors = 3;
    const quorum = Math.floor(totalAcceptors / 2) + 1; // 2

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      pState = 'ACTIVE',
      aStates = ['ACTIVE', 'ACTIVE', 'ACTIVE'],
      lState = 'ACTIVE',
      messages = [],
      acceptedCount = 0,
      actionText = '',
      actor = '',
      target = ''
    }) => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: actor,
          to: target,
          type: actionText.includes("PREPARE") || actionText.includes("ACCEPT") ? "CONSENSUS" : actionText.includes("CRASH") ? "CRASH" : "SYSTEM"
        });
      }

      const isA1Failed = failedAcceptor === "A1" || failedAcceptor === "A2,A3";
      const isA2Failed = failedAcceptor === "A2" || failedAcceptor === "A2,A3";
      const isA3Failed = failedAcceptor === "A3" || failedAcceptor === "A2,A3";

      stepList.push({
        nodes: [
          { id: "P1", label: "Proposer (P1)", x: positions[0].x, y: positions[0].y, status: pState, role: 'PROPOSER' },
          { id: "A1", label: "Acceptor A1", x: positions[1].x, y: positions[1].y, status: isA1Failed ? 'CRASHED' : aStates[0], role: 'ACCEPTOR' },
          { id: "A2", label: "Acceptor A2", x: positions[2].x, y: positions[2].y, status: isA2Failed ? 'CRASHED' : aStates[1], role: 'ACCEPTOR' },
          { id: "A3", label: "Acceptor A3", x: positions[3].x, y: positions[3].y, status: isA3Failed ? 'CRASHED' : aStates[2], role: 'ACCEPTOR' },
          { id: "L1", label: "Learner (L1)", x: positions[4].x, y: positions[4].y, status: lState, role: 'LEARNER' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        quorumInfo: `Accepted Promises: ${acceptedCount}/${totalAcceptors} | Required Quorum: ${quorum}`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "Initial System State",
      explanation: `Proposer P1 initiates Paxos consensus to propose value ${proposalVal}. Target acceptors: A1, A2, A3 (Quorum threshold = 2).`,
      rule: "Paxos initialization",
      why: "Before accepting any state change, Paxos requires a majority quorum (N/2 + 1) of acceptors to promise not to accept lower-numbered proposals.",
      codeLine: 1,
      actionText: `Proposer P1 ready to propose ${proposalVal}`,
      actor: "P1"
    });

    // STEP 1: Phase 1a Prepare
    const isA1Failed = failedAcceptor === "A1" || failedAcceptor === "A2,A3";
    const isA2Failed = failedAcceptor === "A2" || failedAcceptor === "A2,A3";
    const isA3Failed = failedAcceptor === "A3" || failedAcceptor === "A2,A3";

    const prepMsgs = [];
    if (!isA1Failed) prepMsgs.push({ from: "P1", to: "A1", label: "PREPARE(n=1)", type: "request" });
    if (!isA2Failed) prepMsgs.push({ from: "P1", to: "A2", label: "PREPARE(n=1)", type: "request" });
    if (!isA3Failed) prepMsgs.push({ from: "P1", to: "A3", label: "PREPARE(n=1)", type: "request" });

    pushStep({
      title: "Phase 1a: Prepare Broadcast",
      explanation: "Proposer P1 broadcasts PREPARE(n=1) to all reachable Acceptors to request proposal priority.",
      rule: "Phase 1a: PREPARE(n)",
      why: "Asking acceptors for promises ensures earlier or competing proposals with smaller proposal numbers cannot overwrite this consensus round.",
      codeLine: 3,
      messages: prepMsgs,
      pState: 'WAITING',
      actionText: "P1 sends PREPARE(n=1) broadcast to Acceptors",
      actor: "P1",
      target: "Acceptors"
    });

    // STEP 2: Phase 1b Promise
    const promiseMsgs = [];
    if (!isA1Failed) promiseMsgs.push({ from: "A1", to: "P1", label: "PROMISE(n=1)", type: "response" });
    if (!isA2Failed) promiseMsgs.push({ from: "A2", to: "P1", label: "PROMISE(n=1)", type: "response" });
    if (!isA3Failed) promiseMsgs.push({ from: "A3", to: "P1", label: "PROMISE(n=1)", type: "response" });

    const promiseCount = promiseMsgs.length;
    const hasQuorum = promiseCount >= quorum;

    pushStep({
      title: "Phase 1b: Promise Responses",
      explanation: hasQuorum
        ? `Acceptors reply with PROMISE(n=1). P1 received ${promiseCount}/${totalAcceptors} promises, satisfying the majority quorum requirement (${quorum}).`
        : `P1 received only ${promiseCount}/${totalAcceptors} promises due to acceptor failures. Quorum (${quorum}) NOT achieved!`,
      rule: "Phase 1b: PROMISE(n)",
      why: "Acceptors update minProposal = 1 and guarantee they will reject any future proposals with number < 1.",
      codeLine: 7,
      messages: promiseMsgs,
      acceptedCount: promiseCount,
      aStates: [
        isA1Failed ? "CRASHED" : "PROMISE",
        isA2Failed ? "CRASHED" : "PROMISE",
        isA3Failed ? "CRASHED" : "PROMISE"
      ],
      actionText: hasQuorum ? `Quorum reached (${promiseCount}/${totalAcceptors} Promises)` : `Quorum failed (${promiseCount}/${totalAcceptors} Promises)`,
      actor: "Acceptors",
      target: "P1"
    });

    if (hasQuorum) {
      // STEP 3: Phase 2a Accept Request
      const acceptReqMsgs = [];
      if (!isA1Failed) acceptReqMsgs.push({ from: "P1", to: "A1", label: `ACCEPT_REQ(n=1, ${proposalVal})`, type: "request" });
      if (!isA2Failed) acceptReqMsgs.push({ from: "P1", to: "A2", label: `ACCEPT_REQ(n=1, ${proposalVal})`, type: "request" });
      if (!isA3Failed) acceptReqMsgs.push({ from: "P1", to: "A3", label: `ACCEPT_REQ(n=1, ${proposalVal})`, type: "request" });

      pushStep({
        title: "Phase 2a: Accept Request Broadcast",
        explanation: `Having secured a majority quorum, Proposer P1 broadcasts ACCEPT_REQ(n=1, ${proposalVal}) to acceptors.`,
        rule: "Phase 2a: ACCEPT_REQ(n, v)",
        why: "With Phase 1 promises secured, P1 can now safely instruct acceptors to record the target value.",
        codeLine: 11,
        messages: acceptReqMsgs,
        pState: 'ACTIVE',
        acceptedCount: promiseCount,
        actionText: `P1 sends ACCEPT_REQ(n=1, ${proposalVal})`,
        actor: "P1",
        target: "Acceptors"
      });

      // STEP 4: Phase 2b Accepted
      const acceptedMsgs = [];
      if (!isA1Failed) {
        acceptedMsgs.push({ from: "A1", to: "P1", label: `ACCEPTED(${proposalVal})`, type: "response" });
        acceptedMsgs.push({ from: "A1", to: "L1", label: `ACCEPTED(${proposalVal})`, type: "response" });
      }
      if (!isA2Failed) {
        acceptedMsgs.push({ from: "A2", to: "P1", label: `ACCEPTED(${proposalVal})`, type: "response" });
        acceptedMsgs.push({ from: "A2", to: "L1", label: `ACCEPTED(${proposalVal})`, type: "response" });
      }
      if (!isA3Failed) {
        acceptedMsgs.push({ from: "A3", to: "P1", label: `ACCEPTED(${proposalVal})`, type: "response" });
        acceptedMsgs.push({ from: "A3", to: "L1", label: `ACCEPTED(${proposalVal})`, type: "response" });
      }

      pushStep({
        title: "Phase 2b: Accepted Broadcast & Decision",
        explanation: `Acceptors persist ${proposalVal} and broadcast ACCEPTED messages to Proposer P1 and Learner L1.`,
        rule: "Phase 2b: ACCEPTED(n, v)",
        why: "Acceptors persist the value because proposal number n >= minProposal.",
        codeLine: 14,
        messages: acceptedMsgs,
        aStates: [
          isA1Failed ? "CRASHED" : "ACCEPTED",
          isA2Failed ? "CRASHED" : "ACCEPTED",
          isA3Failed ? "CRASHED" : "ACCEPTED"
        ],
        acceptedCount: promiseCount,
        actionText: `Acceptors broadcast ACCEPTED(${proposalVal})`,
        actor: "Acceptors",
        target: "L1"
      });

      // STEP 5: Consensus Achieved / Learner Commit
      pushStep({
        title: "Consensus Finalized!",
        explanation: `Learner L1 receives majority ACCEPTED notifications and commits ${proposalVal} as the permanent chosen consensus decision!`,
        rule: "Learner Commit",
        why: "Once a majority of acceptors have accepted a proposal, that value is chosen permanently and will never change in subsequent rounds.",
        codeLine: 15,
        lState: 'LEADER',
        acceptedCount: promiseCount,
        actionText: `Learner L1 committed ${proposalVal}`,
        actor: "L1"
      });
    } else {
      // Failed Quorum Step
      pushStep({
        title: "Consensus Aborted (Insufficient Quorum)",
        explanation: `Without a majority quorum of promises (${promiseCount} < ${quorum}), Proposer P1 must abort round n=1 and retry with higher proposal number n=2.`,
        rule: "Quorum Failure Rule",
        why: "Paxos prevents split-brain inconsistencies by strictly requiring majority agreement before accepting values.",
        codeLine: 9,
        pState: 'CRASHED',
        acceptedCount: promiseCount,
        actionText: "Paxos round aborted due to lack of quorum",
        actor: "P1"
      });
    }

    return stepList;
  }, [proposalVal, failedAcceptor]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Paxos Consensus Topology (Proposer - Acceptors - Learner)
                </h3>
                <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                  {sim.activeState.quorumInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[]}
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
          <CodePanel codeLines={PAXOS_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Paxos Parameters & Fault Injection
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Proposed Value:</label>
              <select
                value={proposalVal}
                onChange={(e) => setProposalVal(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="V=100">V = 100 (Transaction A)</option>
                <option value="V=200">V = 200 (Transaction B)</option>
                <option value="V=300">V = 300 (Transaction C)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Simulate Acceptor Failure:</label>
              <select
                value={failedAcceptor}
                onChange={(e) => setFailedAcceptor(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="None">None (All 3 Acceptors Active &rarr; Quorum 3/3)</option>
                <option value="A3">Acceptor A3 Crashed (2/3 Active &rarr; Quorum 2/3 PASS)</option>
                <option value="A2,A3">Acceptor A2 & A3 Crashed (1/3 Active &rarr; Quorum FAIL)</option>
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
