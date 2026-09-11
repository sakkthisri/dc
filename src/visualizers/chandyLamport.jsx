import React, { useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { calculateLinearPositions } from '../utils/simulationUtils';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';
import { Camera } from 'lucide-react';

const PSEUDOCODE = [
  "// Chandy-Lamport Distributed Snapshot Algorithm",
  "",
  "1. Initiator process P_i records its own local state S_i",
  "2. P_i sends MARKER message along all outgoing channels",
  "3. Upon receiving MARKER on channel C_ji at process P_j:",
  "   - If P_j has NOT recorded its local state:",
  "         P_j records local state S_j",
  "         P_j marks channel C_ji as EMPTY",
  "         P_j sends MARKER on all outgoing channels",
  "   - If P_j HAS already recorded its local state:",
  "         P_j records channel C_ji state = [messages received on C_ji since S_j was recorded]"
];

export function ChandyLamportVisualizer() {
  const nodeCount = 3;
  const initiatorNode = 'P1';

  const steps = useMemo(() => {
    const positions = calculateLinearPositions(nodeCount, 640, 320);
    const pNames = Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`);

    const stepList = [];
    const recordedEvents = [];

    const snapshotRecords = {
      localStates: {},
      channelStates: {}
    };

    const pushStep = (title, explanation, rule, why, codeLine, activeNodes = [], messages = [], actionText = "", actor = "", target = "") => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: actor,
          to: target,
          type: actionText.includes("MARKER") ? "SNAPSHOT_MARKER" : "LOCAL_EVENT"
        });
      }

      stepList.push({
        nodes: pNames.map((name, idx) => ({
          id: name,
          label: name,
          x: positions[idx].x,
          y: positions[idx].y,
          customLabel: snapshotRecords.localStates[name] ? `State Saved (${snapshotRecords.localStates[name]})` : 'State Active',
          status: snapshotRecords.localStates[name] ? 'SNAPSHOT' : activeNodes.includes(name) ? 'ACTIVE' : 'IDLE'
        })),
        messages,
        events: [...recordedEvents],
        snapshotRecords: JSON.parse(JSON.stringify(snapshotRecords)),
        title,
        explanation,
        rule,
        why,
        codeLine
      });
    };

    // STEP 0: Initial State
    pushStep(
      "Asynchronous System Running",
      "Processes P1, P2, P3 running application tasks and exchanging messages across FIFO channels.",
      "Chandy-Lamport Init",
      "Distributed snapshot algorithm records consistent global state without freezing application runtime.",
      1,
      [],
      [],
      "System initialized"
    );

    // STEP 1: Initiator Records Local State
    snapshotRecords.localStates[initiatorNode] = "Val=100";
    pushStep(
      initiatorNode + " Initiates Distributed Snapshot",
      initiatorNode + " captures its local state S_1 (Val=100).",
      "Record local state S_i",
      "Capturing local state is the first phase of the snapshot protocol.",
      2,
      [initiatorNode],
      [],
      initiatorNode + " records local state S_1 (Val=100)",
      initiatorNode
    );

    // STEP 2: Initiator Sends MARKER along channel
    const targetNode = initiatorNode === 'P1' ? 'P2' : 'P3';
    pushStep(
      initiatorNode + " Broadcasts MARKER Message to " + targetNode,
      initiatorNode + " sends MARKER message on outgoing channel to " + targetNode + ".",
      "send(MARKER) on all outgoing channels",
      "MARKER packets demarcate application messages recorded before vs after the snapshot.",
      3,
      [initiatorNode],
      [{ id: 'm1', from: initiatorNode, to: targetNode, label: 'MARKER', type: 'MARKER', progress: 0.5 }],
      initiatorNode + " sends MARKER to " + targetNode,
      initiatorNode,
      targetNode
    );

    // STEP 3: Target Receives MARKER & Records Local State
    snapshotRecords.localStates[targetNode] = "Val=250";
    snapshotRecords.channelStates[`Channel ${initiatorNode}->${targetNode}`] = "EMPTY (0 in-flight)";

    pushStep(
      targetNode + " Receives MARKER from " + initiatorNode,
      targetNode + " receives MARKER for the first time, saves local state S_2 (Val=250), and marks channel state as EMPTY.",
      "First MARKER: Save state S_j, mark channel EMPTY",
      "Because this is target's first MARKER, all incoming messages on this channel prior to MARKER were already accounted for.",
      6,
      [targetNode],
      [{ id: 'm1', from: initiatorNode, to: targetNode, label: 'MARKER', type: 'MARKER', progress: 1.0, status: 'DELIVERED' }],
      targetNode + " saves local state S_2 (Val=250)",
      targetNode
    );

    // STEP 4: Global Snapshot Summary
    if (nodeCount >= 3) {
      const remainingNode = 'P3';
      snapshotRecords.localStates[remainingNode] = "Val=50";
      snapshotRecords.channelStates[`Channel ${targetNode}->${remainingNode}`] = "MSG[payload=5]";
    }

    pushStep(
      "Consistent Global Snapshot Complete!",
      "All process states and in-flight channel messages have been recorded cleanly into a consistent global state matrix.",
      "Global Snapshot Recorded",
      "The recorded cut represents a valid consistent global state that satisfies causal invariants.",
      10,
      pNames,
      [],
      "Global Snapshot completed successfully"
    );

    return stepList;
  }, [nodeCount, initiatorNode]);

  const sim = useSimulation(steps);

  const connections = useMemo(() => {
    const list = [];
    for (let i = 1; i < nodeCount; i++) {
      list.push({ from: `P${i}`, to: `P${i + 1}`, directed: true });
    }
    return list;
  }, [nodeCount]);

  const currentRecords = sim.activeState.snapshotRecords || { localStates: {}, channelStates: {} };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 light:border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Chandy-Lamport Snapshot Channel Graph
              </h3>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60 light:border-gray-200">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={connections}
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

          {/* Recorded Global State Summary Matrix */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-200 uppercase tracking-wider">
              <Camera className="w-4 h-4 text-purple-400" />
              <span>Recorded Global State Matrix</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-gray-300">Local Process States:</div>
              <div className="space-y-1">
                {Object.entries(currentRecords.localStates).map(([pName, stateVal]) => (
                  <div key={pName} className="flex justify-between p-1.5 rounded bg-gray-950 border border-gray-800 font-mono">
                    <span className="text-blue-400 font-bold">{pName}:</span>
                    <span className="text-gray-200">{stateVal}</span>
                  </div>
                ))}
              </div>

              <div className="font-semibold text-gray-300 pt-2">Channel In-Flight States:</div>
              <div className="space-y-1">
                {Object.entries(currentRecords.channelStates).map(([chName, chVal]) => (
                  <div key={chName} className="flex justify-between p-1.5 rounded bg-gray-950 border border-gray-800 font-mono text-[11px]">
                    <span className="text-purple-400">{chName}:</span>
                    <span className="text-gray-300">{chVal}</span>
                  </div>
                ))}
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
