import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { calculateRingPositions } from '../utils/simulationUtils';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const CASSANDRA_PSEUDOCODE = [
  "// Apache Cassandra Consistent Hash Ring & Replication",
  "1. Hash key via Murmur3: Token = Hash(key) mod 2^64",
  "2. Map Token to Hash Ring: find first Node whose Token >= key Token",
  "   - Primary Coordinator Node = Node_C (Token 180°)",
  "3. Replication Factor (RF=3):",
  "   - Store Replicas on next RF-1 distinct physical nodes clockwise on ring",
  "   - Replicas -> Node_C (Primary), Node_D (Replica 1), Node_A (Replica 2)",
  "4. Evaluate Tunable Consistency Level:",
  "   - ONE: Return SUCCESS on 1 ACK",
  "   - QUORUM: Return SUCCESS on (RF/2 + 1) = 2 ACKs",
  "   - ALL: Return SUCCESS on 3 ACKs"
];

export function CassandraHashingVisualizer() {
  const [consistencyLevel, setConsistencyLevel] = useState("QUORUM"); // ONE, QUORUM, ALL
  const [writeKey, setWriteKey] = useState("user_42");

  const steps = useMemo(() => {
    // 4 Nodes around ring: Node A (0 deg), Node B (90 deg), Node C (180 deg), Node D (270 deg)
    const nodeCount = 4;
    const positions = calculateRingPositions(nodeCount, 640, 340, 130);
    const stepList = [];
    const recordedEvents = [];
    const rf = 3;
    const requiredAcks = consistencyLevel === "ONE" ? 1 : consistencyLevel === "QUORUM" ? 2 : 3;

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
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
          type: actionText.includes("ACK") || actionText.includes("Token") ? "CONSENSUS" : "SYSTEM"
        });
      }

      stepList.push({
        nodes: [
          { id: "A", label: "Node A (0°)", x: positions[0].x, y: positions[0].y, status: states[0], role: 'REPLICA' },
          { id: "B", label: "Node B (90°)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'NODE' },
          { id: "C", label: "Node C (180°)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'PRIMARY' },
          { id: "D", label: "Node D (270°)", x: positions[3].x, y: positions[3].y, status: states[3], role: 'REPLICA' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        cassandraInfo: `Key: "${writeKey}" | Hash Token: 135° | Consistency: ${consistencyLevel} (${requiredAcks}/${rf} ACKs required)`
      });
    };

    // STEP 0: Ring Geometry State
    pushStep({
      title: "Cassandra Consistent Hash Ring Geometry",
      explanation: "4 Physical nodes (A, B, C, D) are assigned tokens around the 360-degree continuum ring.",
      rule: "Consistent Hashing Ring",
      why: "Consistent hashing allows dynamic node additions and removals with minimal key rebalancing overhead.",
      codeLine: 1,
      actionText: "Cassandra token ring initialized (4 Nodes)",
      actor: "Cluster"
    });

    // STEP 1: Key Hashing & Token Mapping
    const hashMsg = [{ from: "Client", to: "B", label: `Write("${writeKey}")`, type: "request" }];
    pushStep({
      title: `Key Hashing: Hash("${writeKey}") = Token 135°`,
      explanation: `Client sends write request for key "${writeKey}" to Coordinator Node B. Murmur3 hash maps key to token 135°.`,
      rule: "Token Calculation",
      why: "Token 135° falls between Node B (90°) and Node C (180°). The first node proceeding clockwise is Node C.",
      codeLine: 2,
      messages: hashMsg,
      actionText: `Client routes write("${writeKey}") to Coordinator Node B`,
      actor: "Client",
      target: "Node B"
    });

    // STEP 2: Primary & Replica Ring Mapping
    const routeMsgs = [
      { from: "B", to: "C", label: "Write (Primary 180°)", type: "request" },
      { from: "B", to: "D", label: "Write (Replica 270°)", type: "request" },
      { from: "B", to: "A", label: "Write (Replica 0°)", type: "request" }
    ];

    pushStep({
      title: `Primary & RF=3 Replica Assignment`,
      explanation: `Coordinator Node B routes key payload to Primary Node C (180°) and clockwise successors Node D (270°) & Node A (0°).`,
      rule: "Clockwise Replica Routing",
      why: "RF=3 ensures key replicas are distributed across 3 distinct physical nodes for high availability.",
      codeLine: 3,
      messages: routeMsgs,
      states: ['PROMISE', 'ACTIVE', 'LEADER', 'PROMISE'],
      actionText: "Coordinator B routes write to Node C (Primary), Node D, Node A",
      actor: "Node B",
      target: "Node C, Node D, Node A"
    });

    // STEP 3: Consistency Level Evaluation
    const ackMsgs = [
      { from: "C", to: "B", label: "ACK", type: "response" },
      { from: "D", to: "B", label: "ACK", type: "response" }
    ];
    if (consistencyLevel === "ALL") {
      ackMsgs.push({ from: "A", to: "B", label: "ACK", type: "response" });
    }

    pushStep({
      title: `Evaluating Consistency Level: ${consistencyLevel}`,
      explanation: `Nodes process local write and respond with ACKs. Coordinator requires ${requiredAcks} ACKs to confirm query success.`,
      rule: `Consistency Level: ${consistencyLevel}`,
      why: consistencyLevel === "QUORUM"
        ? "QUORUM guarantees R + W > N, proving read-your-own-writes consistency across asynchronous storage."
        : consistencyLevel === "ONE"
        ? "ONE offers ultra-low write latency by returning immediately on 1 ACK."
        : "ALL guarantees strict linearizability across every single replica.",
      codeLine: 4,
      messages: ackMsgs,
      states: ['PROMISE', 'ACTIVE', 'LEADER', 'PROMISE'],
      actionText: `Coordinator B received ${ackMsgs.length} ACKs (Required: ${requiredAcks})`,
      actor: "Replicas",
      target: "Node B"
    });

    // STEP 4: Query Success
    const clientSuccessMsg = [{ from: "B", to: "Client", label: "200 OK (Write Confirmed)", type: "response" }];
    pushStep({
      title: `Cassandra Write Successful (${consistencyLevel})`,
      explanation: `Coordinator Node B confirms ${requiredAcks}/${rf} ACKs received and returns 200 OK to the client.`,
      rule: "Write Completion",
      why: "Tunable consistency lets applications balance latency against read/write consistency requirements.",
      codeLine: 4,
      messages: clientSuccessMsg,
      states: ['LEADER', 'ACTIVE', 'LEADER', 'LEADER'],
      actionText: `Write query confirmed for key "${writeKey}"`,
      actor: "Node B",
      target: "Client"
    });

    return stepList;
  }, [consistencyLevel, writeKey]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Cassandra Consistent Hash Ring & Tunable Consistency
                </h3>
                <p className="text-[11px] text-purple-400 font-mono mt-0.5">
                  {sim.activeState.cassandraInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]]}
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
          <CodePanel codeLines={CASSANDRA_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Cassandra Parameters & Consistency Level
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Target Key:</label>
              <input
                type="text"
                value={writeKey}
                onChange={(e) => setWriteKey(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Tunable Consistency Level:</label>
              <select
                value={consistencyLevel}
                onChange={(e) => setConsistencyLevel(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="ONE">ONE (1 ACK - Fastest Latency)</option>
                <option value="QUORUM">QUORUM (2 ACKs - Recommended R+W &gt; N)</option>
                <option value="ALL">ALL (3 ACKs - Strict Linearizability)</option>
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
