import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const MULTICAST_PSEUDOCODE = [
  "// Broadcast / Multicast / Reliable Multicast Protocol",
  "1. Broadcast Mode: Sender P1 transmits packet to ALL nodes (P2, P3, P4, P5)",
  "2. Multicast Mode: Sender P1 transmits packet ONLY to Group G = {P2, P4}",
  "3. Reliable Multicast Mode:",
  "   - Sender P1 transmits packet with sequence number Seq=1",
  "   - Receivers reply ACK(Seq=1)",
  "   - If packet loss occurs on P4: P4 sends NACK(Seq=1) -> Sender retransmits",
  "   - Receivers filter duplicate sequence numbers"
];

export function MulticastBroadcastVisualizer() {
  const [castMode, setCastMode] = useState("MULTICAST"); // "BROADCAST", "MULTICAST", "RELIABLE"
  const [simulatePacketLoss, setSimulatePacketLoss] = useState(true);

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 180 }, // Sender P1
      { x: 300, y: 80 },  // P2 (Group G)
      { x: 300, y: 280 }, // P3 (Non-group)
      { x: 500, y: 80 },  // P4 (Group G)
      { x: 500, y: 280 }  // P5 (Non-group)
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['LEADER', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
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
          type: actionText.includes("NACK") || actionText.includes("Loss") ? "CRASH" : "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "P1", label: "P1 (Sender)", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "P2", label: "P2 (Group G)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'REPLICA' },
          { id: "P3", label: "P3 (Non-Group)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'NODE' },
          { id: "P4", label: "P4 (Group G)", x: positions[3].x, y: positions[3].y, status: states[3], role: 'REPLICA' },
          { id: "P5", label: "P5 (Non-Group)", x: positions[4].x, y: positions[4].y, status: states[4], role: 'NODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        castInfo: `Mode: ${castMode} | Target Group G = {P2, P4} | Packet Loss Simulation: ${simulatePacketLoss ? 'Active' : 'Disabled'}`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: `${castMode} Transmission Initialized`,
      explanation: `Sender P1 initiates ${castMode} message payload. Group membership G = {P2, P4}.`,
      rule: "Multicast Architecture",
      why: "Multicast sends messages efficiently to a specific subset of nodes rather than flooding the entire network.",
      codeLine: 1,
      actionText: `P1 ready to send ${castMode} payload`,
      actor: "P1"
    });

    if (castMode === "BROADCAST") {
      const bcastMsgs = [
        { from: "P1", to: "P2", label: "BCAST(m)", type: "request" },
        { from: "P1", to: "P3", label: "BCAST(m)", type: "request" },
        { from: "P1", to: "P4", label: "BCAST(m)", type: "request" },
        { from: "P1", to: "P5", label: "BCAST(m)", type: "request" }
      ];

      pushStep({
        title: "Broadcast Transmission (1-to-All)",
        explanation: "Sender P1 transmits message m to ALL active nodes in the cluster (P2, P3, P4, P5).",
        rule: "Broadcast Protocol",
        why: "Broadcast reaches every network participant regardless of group membership.",
        codeLine: 1,
        messages: bcastMsgs,
        states: ['LEADER', 'PROMISE', 'PROMISE', 'PROMISE', 'PROMISE'],
        actionText: "P1 broadcast message to all nodes",
        actor: "P1",
        target: "All Nodes"
      });
    } else if (castMode === "MULTICAST") {
      const mcastMsgs = [
        { from: "P1", to: "P2", label: "MCAST(m, Group G)", type: "request" },
        { from: "P1", to: "P4", label: "MCAST(m, Group G)", type: "request" }
      ];

      pushStep({
        title: "Selective Multicast (1-to-Group)",
        explanation: "Sender P1 transmits message m ONLY to members of Group G (P2 and P4). Non-members P3 & P5 are skipped.",
        rule: "Multicast Filtering",
        why: "Selective routing conserves network bandwidth by delivering packets only to subscribed nodes.",
        codeLine: 2,
        messages: mcastMsgs,
        states: ['LEADER', 'PROMISE', 'ACTIVE', 'PROMISE', 'ACTIVE'],
        actionText: "P1 multicasted message to Group G {P2, P4}",
        actor: "P1",
        target: "P2, P4"
      });
    } else {
      // RELIABLE MULTICAST
      const relMsgs = [
        { from: "P1", to: "P2", label: "R-MCAST(Seq=1)", type: "request" },
        { from: "P1", to: "P4", label: "R-MCAST(Seq=1)", type: "request" }
      ];

      pushStep({
        title: "Reliable Multicast Transmission (Seq=1)",
        explanation: "Sender P1 transmits R-MCAST packet with sequence number Seq=1 to Group G.",
        rule: "Reliable Multicast",
        why: "Reliable multicast guarantees all non-faulty group members deliver identical message sets.",
        codeLine: 3,
        messages: relMsgs,
        states: ['LEADER', 'PROMISE', 'ACTIVE', 'PROMISE', 'ACTIVE'],
        actionText: "P1 sent R-MCAST(Seq=1) to Group G",
        actor: "P1",
        target: "Group G"
      });

      if (simulatePacketLoss) {
        const lossMsgs = [
          { from: "P2", to: "P1", label: "ACK(Seq=1)", type: "response" },
          { from: "P4", to: "P1", label: "NACK(Seq=1 - Lost)", type: "response" }
        ];

        pushStep({
          title: "Packet Loss Detected on P4! NACK Response",
          explanation: "P2 delivers message and sends ACK(Seq=1). Packet to P4 is dropped in transit; P4 detects missing sequence and sends NACK(Seq=1).",
          rule: "NACK Feedback",
          why: "Receiver-initiated NACKs allow fast retransmission without clogging the sender with ACKs from all nodes.",
          codeLine: 3,
          messages: lossMsgs,
          states: ['LEADER', 'LEADER', 'ACTIVE', 'CRASHED', 'ACTIVE'],
          actionText: "P4 detected packet loss and sent NACK(Seq=1)",
          actor: "P4",
          target: "P1"
        });

        const retxMsgs = [{ from: "P1", to: "P4", label: "RETX(Seq=1)", type: "request" }];
        pushStep({
          title: "Retransmission & Delivery Confirmation",
          explanation: "Sender P1 retransmits packet RETX(Seq=1) to P4. P4 delivers message and filters potential duplicates.",
          rule: "Retransmission Recovery",
          why: "Guarantees eventual atomic message delivery despite transient packet loss.",
          codeLine: 4,
          messages: retxMsgs,
          states: ['LEADER', 'LEADER', 'ACTIVE', 'LEADER', 'ACTIVE'],
          actionText: "P1 retransmitted packet to P4; delivery confirmed!",
          actor: "P1",
          target: "P4"
        });
      }
    }

    return stepList;
  }, [castMode, simulatePacketLoss]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Broadcast / Multicast / Reliable Multicast Topology
                </h3>
                <p className="text-[11px] text-blue-400 font-mono mt-0.5">
                  {sim.activeState.castInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["P1", "P2"], ["P1", "P3"], ["P1", "P4"], ["P1", "P5"]]}
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
          <CodePanel codeLines={MULTICAST_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Multicast Mode Selection
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Transmission Mode:</label>
              <select
                value={castMode}
                onChange={(e) => setCastMode(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="BROADCAST">Broadcast (All Nodes P2..P5)</option>
                <option value="MULTICAST">Multicast (Group G: P2, P4)</option>
                <option value="RELIABLE">Reliable Multicast (ACK/NACK Retransmission)</option>
              </select>
            </div>

            {castMode === "RELIABLE" && (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Packet Loss Injection:</label>
                <button
                  onClick={() => setSimulatePacketLoss(!simulatePacketLoss)}
                  className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                    simulatePacketLoss
                      ? "bg-red-600/30 border-red-500 text-red-300"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {simulatePacketLoss ? "Simulating Packet Loss on P4 (NACK Trigger)" : "No Packet Loss"}
                </button>
              </div>
            )}
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
