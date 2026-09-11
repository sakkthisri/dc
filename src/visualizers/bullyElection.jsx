import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { calculateGridPositions } from '../utils/simulationUtils';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const PSEUDOCODE = [
  "// Bully Election Algorithm for Process P_i",
  "// Triggered when P_i detects Coordinator (P_max) failure",
  "",
  "1. Send ELECTION msg to all processes P_j with ID_j > ID_i",
  "2. Wait for OK response:",
  "   - If no OK received within timeout:",
  "         P_i declares itself COORDINATOR",
  "         Broadcast COORDINATOR msg to all lower processes",
  "   - If OK received from P_j:",
  "         P_i yields and waits for P_j's election to complete",
  "",
  "3. Upon receiving ELECTION from P_k (where k < i):",
  "   - Send OK to P_k",
  "   - Start own election if not already running"
];

export function BullyElectionVisualizer() {
  const [nodeCount] = useState(4);
  const [failedNode, setFailedNode] = useState('P5');
  const [initiatorNode, setInitiatorNode] = useState('P2');

  const steps = useMemo(() => {
    const positions = calculateGridPositions(nodeCount, 640, 320);
    const pNames = Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`);
    const highestNode = `P${nodeCount}`;

    const stepList = [];
    const recordedEvents = [];

    const pushStep = (title, explanation, rule, why, codeLine, activeNodes = [], leader = highestNode, crashed = [], messages = [], actionText = "", actor = "", target = "") => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: actor,
          to: target,
          type: actionText.includes("ELECTION") ? "ELECTION" : actionText.includes("COORDINATOR") ? "LEADER" : actionText.includes("CRASH") ? "CRASH" : "SYSTEM"
        });
      }

      stepList.push({
        nodes: pNames.map((name, idx) => ({
          id: name,
          label: name,
          x: positions[idx].x,
          y: positions[idx].y,
          isLeader: leader === name && !crashed.includes(name),
          status: crashed.includes(name) ? 'CRASHED' : activeNodes.includes(name) ? 'ELECTION' : 'ACTIVE'
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

    // STEP 0: Normal state with highest node as coordinator
    pushStep(
      "Normal System Operation",
      "Process " + highestNode + " (highest ID) is currently the active Coordinator.",
      "Coordinator = Max(Process_IDs)",
      "In Bully Algorithm, the highest active process ID always holds coordinator authority.",
      1,
      [],
      highestNode,
      [],
      [],
      "System operating normally with coordinator " + highestNode,
      highestNode
    );

    // STEP 1: Coordinator Fails
    const activeCrashed = [failedNode];
    pushStep(
      "Coordinator " + failedNode + " Crashes!",
      "The current coordinator " + failedNode + " experiences a crash failure and stops responding.",
      "Coordinator crashed!",
      "When the coordinator node dies, heartbeat timeouts expire on active processes.",
      2,
      [],
      null,
      activeCrashed,
      [],
      "Coordinator " + failedNode + " crashed!",
      failedNode
    );

    // STEP 2: Initiator detects crash and starts election
    const initId = parseInt(initiatorNode.replace('P', ''));
    pushStep(
      "Process " + initiatorNode + " Detects Failure & Initiates Election",
      initiatorNode + " sends ELECTION messages to all processes with higher IDs.",
      "Send ELECTION to P_j where j > " + initId,
      "Lower-ID processes bully higher processes to take over leadership.",
      4,
      [initiatorNode],
      null,
      activeCrashed,
      [],
      initiatorNode + " initiates election",
      initiatorNode
    );

    // STEP 3: ELECTION messages sent from Initiator to higher nodes
    const higherNodes = pNames.filter(n => parseInt(n.replace('P', '')) > initId);
    const electionMsgs = higherNodes.map((hName, idx) => ({
      id: `el_${idx}`,
      from: initiatorNode,
      to: hName,
      label: 'ELECTION',
      type: 'ELECTION',
      progress: hName === failedNode ? 1.0 : 0.6,
      status: hName === failedNode ? 'DROPPED' : 'IN_FLIGHT'
    }));

    pushStep(
      initiatorNode + " Transmits ELECTION Messages",
      initiatorNode + " sends ELECTION packets to: " + higherNodes.join(', ') + ".",
      "send(ELECTION) to higher nodes",
      "Notice that the crashed node " + failedNode + " drops the message and never responds.",
      4,
      [initiatorNode, ...higherNodes],
      null,
      activeCrashed,
      electionMsgs,
      initiatorNode + " sends ELECTION to " + higherNodes.join(', '),
      initiatorNode
    );

    // STEP 4: Higher active processes receive ELECTION and respond OK
    const higherActive = higherNodes.filter(n => n !== failedNode);
    const okMsgs = higherActive.map((hName, idx) => ({
      id: `ok_${idx}`,
      from: hName,
      to: initiatorNode,
      label: 'OK',
      type: 'COORDINATOR',
      progress: 0.7
    }));

    pushStep(
      "Higher Active Nodes Respond 'OK' to " + initiatorNode,
      "Higher active nodes (" + higherActive.join(', ') + ") respond 'OK', taking over election responsibility from " + initiatorNode + ".",
      "Send OK to lower process; start own election",
      "Because a higher active process responded OK, " + initiatorNode + " steps down and waits.",
      10,
      higherActive,
      null,
      activeCrashed,
      okMsgs,
      higherActive.join(', ') + " send OK to " + initiatorNode,
      higherActive[0] || initiatorNode,
      initiatorNode
    );

    // STEP 5: Highest active process wins election
    const newLeader = higherActive[higherActive.length - 1] || initiatorNode;
    pushStep(
      "Process " + newLeader + " Wins Election!",
      newLeader + " receives no OK responses from higher nodes (since " + failedNode + " is dead). " + newLeader + " declares itself the new Coordinator!",
      "No higher OK received -> Declare self COORDINATOR",
      "The highest active process 'bullies' all lower processes into accepting its leadership.",
      7,
      [newLeader],
      newLeader,
      activeCrashed,
      [],
      newLeader + " wins election and becomes new Coordinator",
      newLeader
    );

    // STEP 6: Broadcast COORDINATOR announcement
    const lowerNodes = pNames.filter(n => n !== newLeader && n !== failedNode);
    const coordMsgs = lowerNodes.map((lName, idx) => ({
      id: `coord_${idx}`,
      from: newLeader,
      to: lName,
      label: 'COORDINATOR',
      type: 'COORDINATOR',
      progress: 0.8
    }));

    pushStep(
      "Coordinator Announcement Broadcasted",
      newLeader + " broadcasts COORDINATOR message to all lower active processes (" + lowerNodes.join(', ') + ").",
      "Broadcast COORDINATOR to all active processes",
      "All active processes update their coordinator reference to " + newLeader + ".",
      8,
      [newLeader, ...lowerNodes],
      newLeader,
      activeCrashed,
      coordMsgs,
      newLeader + " broadcasts COORDINATOR to " + lowerNodes.join(', '),
      newLeader
    );

    return stepList;
  }, [nodeCount, failedNode, initiatorNode]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 light:border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Bully Leader Election Grid Topology
              </h3>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60 light:border-gray-200">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[]}
                showClock={false}
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

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Fault Injection & Election Controls
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Crashed Coordinator:</label>
              <select
                value={failedNode}
                onChange={(e) => setFailedNode(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                {Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Election Initiator:</label>
              <select
                value={initiatorNode}
                onChange={(e) => setInitiatorNode(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                {Array.from({ length: nodeCount - 1 }, (_, i) => `P${i + 1}`).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
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
