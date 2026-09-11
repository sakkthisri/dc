import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { calculateRingPositions } from '../utils/simulationUtils';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const RAFT_PSEUDOCODE = [
  "// Raft Consensus State Machine",
  "1. Follower: Reset election timer on AppendEntries heartbeat",
  "2. If election timer expires:",
  "   - Become Candidate, increment term T",
  "   - Vote for self, broadcast RequestVote(T, candidateId)",
  "3. Candidate receives votes:",
  "   - If votes from majority of cluster: become LEADER",
  "   - If AppendEntries received from new leader: revert to Follower",
  "   - If election timeout expires: restart election for T+1",
  "4. Leader:",
  "   - Periodically send AppendEntries heartbeat to all nodes",
  "   - On client command: append to local log, replicate to followers",
  "   - Once replicated on majority: commit log entry & reply to client"
];

export function RaftConsensusVisualizer() {
  const [leaderFailed, setLeaderFailed] = useState(true);
  const [clientData, setClientData] = useState("set balance=100");

  const steps = useMemo(() => {
    const nodeCount = 5;
    const positions = calculateRingPositions(nodeCount, 640, 340, 130);
    const stepList = [];
    const recordedEvents = [];
    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['LEADER', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER'],
      term = 1,
      leader = 'S1',
      votes = '1/5',
      commitIdx = 0,
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
          type: actionText.includes("Vote") ? "ELECTION" : actionText.includes("Crash") ? "CRASH" : "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "S1", label: "S1 (Term " + term + ")", x: positions[0].x, y: positions[0].y, status: states[0], role: states[0] },
          { id: "S2", label: "S2 (Term " + term + ")", x: positions[1].x, y: positions[1].y, status: states[1], role: states[1] },
          { id: "S3", label: "S3 (Term " + term + ")", x: positions[2].x, y: positions[2].y, status: states[2], role: states[2] },
          { id: "S4", label: "S4 (Term " + term + ")", x: positions[3].x, y: positions[3].y, status: states[3], role: states[3] },
          { id: "S5", label: "S5 (Term " + term + ")", x: positions[4].x, y: positions[4].y, status: states[4], role: states[4] }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        raftInfo: `Term: ${term} | Active Leader: ${leader || 'None'} | Votes: ${votes} | Commit Index: ${commitIdx}`
      });
    };

    // STEP 0: Initial state with S1 as Leader
    pushStep({
      title: "Normal Cluster Operation (Term 1)",
      explanation: "Node S1 is the active Leader in Term 1 sending periodic AppendEntries heartbeats to Followers S2..S5.",
      rule: "Leader Heartbeat",
      why: "Followers require heartbeats to suppress local election timeouts and confirm leader health.",
      codeLine: 1,
      states: ['LEADER', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER'],
      term: 1,
      leader: 'S1',
      votes: '5/5',
      actionText: "S1 sends AppendEntries heartbeat to all Followers",
      actor: "S1",
      target: "Followers"
    });

    if (leaderFailed) {
      // STEP 1: S1 Crashes
      pushStep({
        title: "Leader S1 Crashes!",
        explanation: "Leader S1 experiences a hardware crash. Heartbeat transmission halts across the network.",
        rule: "Leader Failure Detection",
        why: "When heartbeats stop, followers' randomized election timers begin counting down.",
        codeLine: 2,
        states: ['CRASHED', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER'],
        term: 1,
        leader: null,
        votes: '0/5',
        actionText: "Leader S1 crashed! Heartbeat lost",
        actor: "S1"
      });

      // STEP 2: S2 Election Timeout & Candidate Transition
      pushStep({
        title: "Election Timeout! S2 becomes Candidate (Term 2)",
        explanation: "S2's election timer expires (150ms). S2 transitions to CANDIDATE state, increments Term to 2, and votes for self.",
        rule: "Candidate Transition",
        why: "A follower that receives no heartbeats assumes leader failure and attempts election.",
        codeLine: 2,
        states: ['CRASHED', 'CANDIDATE', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER'],
        term: 2,
        leader: null,
        votes: '1/5 (S2)',
        actionText: "S2 election timeout -> transitions to Candidate (Term 2)",
        actor: "S2"
      });

      // STEP 3: RequestVote Broadcast
      const reqVoteMsgs = [
        { from: "S2", to: "S3", label: "RequestVote(Term 2)", type: "request" },
        { from: "S2", to: "S4", label: "RequestVote(Term 2)", type: "request" },
        { from: "S2", to: "S5", label: "RequestVote(Term 2)", type: "request" }
      ];

      pushStep({
        title: "RequestVote RPC Broadcast",
        explanation: "Candidate S2 broadcasts RequestVote(Term=2, CandidateId=S2) to active cluster members S3, S4, S5.",
        rule: "RequestVote Broadcast",
        why: "Candidates require majority vote approval (3/5 quorum) to be recognized as legitimate leader.",
        codeLine: 3,
        messages: reqVoteMsgs,
        states: ['CRASHED', 'CANDIDATE', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER'],
        term: 2,
        leader: null,
        votes: '1/5 (S2)',
        actionText: "S2 broadcasts RequestVote to S3, S4, S5",
        actor: "S2",
        target: "S3,S4,S5"
      });

      // STEP 4: Vote Responses & Quorum Check
      const voteRespMsgs = [
        { from: "S3", to: "S2", label: "VoteGranted", type: "response" },
        { from: "S4", to: "S2", label: "VoteGranted", type: "response" },
        { from: "S5", to: "S2", label: "VoteGranted", type: "response" }
      ];

      pushStep({
        title: "Votes Received (4/5 Majority Quorum)",
        explanation: "Nodes S3, S4, S5 grant their votes to S2. S2 accumulates 4 out of 5 votes, satisfying the majority threshold (>= 3).",
        rule: "Majority Quorum Rule",
        why: "Raft guarantees at most one leader can be elected per term by enforcing strict majority overlaps.",
        codeLine: 3,
        messages: voteRespMsgs,
        states: ['CRASHED', 'CANDIDATE', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER'],
        term: 2,
        leader: null,
        votes: '4/5 (Quorum Passed)',
        actionText: "S2 received 4/5 votes (S2, S3, S4, S5)",
        actor: "Cluster",
        target: "S2"
      });

      // STEP 5: S2 Elected Leader
      pushStep({
        title: "S2 Elected Leader for Term 2",
        explanation: "Having secured majority votes, Candidate S2 transitions to LEADER and sends heartbeats to suppress other candidates.",
        rule: "Leader Assumption",
        why: "S2 is now authoritative for log replication and client command processing.",
        codeLine: 4,
        states: ['CRASHED', 'LEADER', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER'],
        term: 2,
        leader: 'S2',
        votes: '4/5',
        actionText: "S2 transitions to LEADER in Term 2",
        actor: "S2"
      });

      // STEP 6: Client Log Replication Request
      const appendMsgs = [
        { from: "S2", to: "S3", label: `AppendEntries("${clientData}")`, type: "request" },
        { from: "S2", to: "S4", label: `AppendEntries("${clientData}")`, type: "request" },
        { from: "S2", to: "S5", label: `AppendEntries("${clientData}")`, type: "request" }
      ];

      pushStep({
        title: "Client Request Log Replication",
        explanation: `Client submits command "${clientData}" to Leader S2. S2 appends log entry at index 1 and replicates via AppendEntries RPC.`,
        rule: "Log Replication",
        why: "Leader writes to local log first, then broadcasts to followers before committing.",
        codeLine: 4,
        messages: appendMsgs,
        states: ['CRASHED', 'LEADER', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER'],
        term: 2,
        leader: 'S2',
        votes: '4/5',
        commitIdx: 0,
        actionText: `S2 replicates log entry "${clientData}" to followers`,
        actor: "S2",
        target: "Followers"
      });

      // STEP 7: Log Entry Committed
      pushStep({
        title: "Log Entry Committed (Commit Index = 1)",
        explanation: `Followers acknowledge AppendEntries. Leader S2 updates commitIndex to 1 and applies "${clientData}" to state machine.`,
        rule: "Commit Majority",
        why: "An entry is committed once stored on a majority of nodes, guaranteeing persistence across future leader elections.",
        codeLine: 4,
        states: ['CRASHED', 'LEADER', 'FOLLOWER', 'FOLLOWER', 'FOLLOWER'],
        term: 2,
        leader: 'S2',
        votes: '4/5',
        commitIdx: 1,
        actionText: `Log index 1 committed ("${clientData}")`,
        actor: "S2"
      });
    }

    return stepList;
  }, [leaderFailed, clientData]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Raft Consensus Cluster Topology (5 Nodes)
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.raftInfo}
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
          <CodePanel codeLines={RAFT_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Raft Cluster Controls & Log Injection
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Leader S1 Failure Toggle:</label>
              <select
                value={leaderFailed ? "CRASH" : "HEALTHY"}
                onChange={(e) => setLeaderFailed(e.target.value === "CRASH")}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="CRASH">Simulate Leader S1 Crash (Trigger Election)</option>
                <option value="HEALTHY">Keep S1 Healthy (Normal Heartbeat State)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Client Command Payload:</label>
              <input
                type="text"
                value={clientData}
                onChange={(e) => setClientData(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs font-mono"
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
