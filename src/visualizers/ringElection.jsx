import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { calculateRingPositions } from '../utils/simulationUtils';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const PSEUDOCODE = [
  "// Ring Election Algorithm for Process P_i",
  "// Topology: Logical ring P_1 -> P_2 -> ... -> P_N -> P_1",
  "",
  "1. Upon detecting failure, P_i creates ELECTION msg with [ID_i]",
  "2. Send ELECTION msg to successor P_(i+1):",
  "   - If successor is dead, skip to next active process",
  "3. On receiving ELECTION msg containing active ID list [IDs]:",
  "   - Append own ID_j to list: [IDs, ID_j]",
  "   - Forward ELECTION([IDs, ID_j]) to successor",
  "4. When ELECTION msg returns to initiator P_i:",
  "   - Leader = Max(collected IDs)",
  "   - Broadcast COORDINATOR(Leader) token around ring"
];

export function RingElectionVisualizer() {
  const [nodeCount, setNodeCount] = useState(5);
  const failedNode = `P${nodeCount}`;
  const initiatorNode = 'P1';

  const steps = useMemo(() => {
    const positions = calculateRingPositions(nodeCount, 640, 340);
    const pNames = Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`);

    const stepList = [];
    const recordedEvents = [];

    const pushStep = (title, explanation, rule, why, codeLine, activeNodes = [], leader = `P${nodeCount}`, crashed = [], messages = [], actionText = "", actor = "", target = "") => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: actor,
          to: target,
          type: actionText.includes("ELECTION") ? "ELECTION" : actionText.includes("COORDINATOR") ? "LEADER" : "SYSTEM"
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

    // STEP 0: Initial State
    pushStep(
      "Normal Ring Operation",
      "Process P" + nodeCount + " is current active coordinator. Communication flows clockwise around the ring.",
      "Ring Topology: P1 -> P2 -> ... -> PN -> P1",
      "Ring algorithms use a single unidirectional logical ring to circulate election messages.",
      1,
      [],
      `P${nodeCount}`,
      [],
      [],
      "Normal operation with leader P" + nodeCount
    );

    // STEP 1: Coordinator Crashes
    const activeCrashed = [failedNode];
    pushStep(
      "Coordinator " + failedNode + " Crashes",
      failedNode + " crashes and stops forwarding ring tokens.",
      "Coordinator node failed",
      "A process downstream notices token inactivity and triggers a ring election.",
      4,
      [],
      null,
      activeCrashed,
      [],
      failedNode + " crashed!",
      failedNode
    );

    // STEP 2: Initiator starts election token
    const collectedIds = [initiatorNode];
    pushStep(
      "Process " + initiatorNode + " Initiates Ring Election",
      initiatorNode + " creates an ELECTION token with ID list [" + collectedIds.join(', ') + "] and forwards it to successor.",
      "Send ELECTION([ID_init]) to successor",
      "The election message accumulates active process IDs as it circles the ring.",
      5,
      [initiatorNode],
      null,
      activeCrashed,
      [],
      initiatorNode + " creates election token [" + collectedIds.join(', ') + "]",
      initiatorNode
    );

    // Circle election message around active nodes
    const activeRingNodes = pNames.filter(n => n !== failedNode);
    const initIdx = activeRingNodes.indexOf(initiatorNode);
    const orderedRing = [
      ...activeRingNodes.slice(initIdx),
      ...activeRingNodes.slice(0, initIdx)
    ];

    let currentIds = [initiatorNode];

    for (let i = 0; i < orderedRing.length - 1; i++) {
      const fromNode = orderedRing[i];
      const toNode = orderedRing[i + 1];
      
      if (!currentIds.includes(toNode)) {
        currentIds.push(toNode);
      }

      pushStep(
        "Election Token Passes: " + fromNode + " → " + toNode,
        fromNode + " appends its ID and forwards token [" + currentIds.join(', ') + "] to " + toNode + ".",
        "Append ID and forward: [" + currentIds.join(', ') + "]",
        "Each active node adds its ID to the message payload before passing it along.",
        8,
        [fromNode, toNode],
        null,
        activeCrashed,
        [{ id: `token_${i}`, from: fromNode, to: toNode, label: `IDs:[${currentIds.join(',')}]`, type: 'ELECTION', progress: 0.5 }],
        fromNode + " passes election token [" + currentIds.join(', ') + "] to " + toNode,
        fromNode,
        toNode
      );
    }

    // Winner selection
    const winner = activeRingNodes.reduce((max, curr) => 
      parseInt(curr.replace('P','')) > parseInt(max.replace('P','')) ? curr : max, activeRingNodes[0]);

    pushStep(
      "Token Returns to Initiator " + initiatorNode + " — Winner Selected!",
      "The election token returns to " + initiatorNode + " with full active ID list [" + currentIds.join(', ') + "]. Maximum ID process " + winner + " wins!",
      "Leader = Max([" + currentIds.join(', ') + "]) -> " + winner,
      "Once the initiator receives its own election message back, it selects the maximum ID as new Coordinator.",
      11,
      [winner],
      winner,
      activeCrashed,
      [],
      winner + " selected as new Coordinator from list [" + currentIds.join(', ') + "]",
      winner
    );

    // Broadcast COORDINATOR token around ring
    pushStep(
      "COORDINATOR Announcement Token Circulated",
      winner + " circulates a COORDINATOR token announcing " + winner + " as the new leader across the ring.",
      "Broadcast COORDINATOR(" + winner + ") token around ring",
      "All active ring nodes update their coordinator state to " + winner + ".",
      12,
      [winner],
      winner,
      activeCrashed,
      [{ id: 'c_tok', from: winner, to: orderedRing[1] || winner, label: `COORD:${winner}`, type: 'COORDINATOR', progress: 0.5 }],
      winner + " announces leadership to ring",
      winner
    );

    return stepList;
  }, [nodeCount, failedNode, initiatorNode]);

  const sim = useSimulation(steps);

  const ringConnections = useMemo(() => {
    const list = [];
    const pNames = Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`);
    for (let i = 0; i < pNames.length; i++) {
      const nextIdx = (i + 1) % pNames.length;
      list.push({ from: pNames[i], to: pNames[nextIdx], directed: true });
    }
    return list;
  }, [nodeCount]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 light:border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Circular Ring Topology Election
              </h3>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60 light:border-gray-200">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={ringConnections}
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
              Ring Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Ring Node Count: {nodeCount}</label>
              <input
                type="range"
                min="4"
                max="7"
                value={nodeCount}
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
                className="w-full accent-blue-500 bg-gray-800 h-1.5 rounded"
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
