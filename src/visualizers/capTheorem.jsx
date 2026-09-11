import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const CAP_PSEUDOCODE = [
  "// Brewer's CAP Theorem Trade-off",
  "// In the event of a Network Partition P:",
  "1. IF System chooses Consistency (CP Mode):",
  "   - Reject writes on isolated minority partition",
  "   - Guarantee all active reads return latest written data",
  "   - Trade-off: Lower Availability (503 Error on minority)",
  "",
  "2. IF System chooses Availability (AP Mode):",
  "   - Accept writes locally on both partitions",
  "   - Guarantee every request receives a non-error response",
  "   - Trade-off: Temporary Inconsistency (Stale reads / split-brain)",
  "",
  "3. Upon Partition Healing:",
  "   - Execute background anti-entropy / vector clock state sync"
];

export function CapTheoremVisualizer() {
  const [capMode, setCapMode] = useState("CP"); // "CP" or "AP"
  const [isPartitioned, setIsPartitioned] = useState(true);

  const steps = useMemo(() => {
    const positions = [
      { x: 140, y: 120 }, // Node A (Subnet 1)
      { x: 140, y: 260 }, // Node B (Subnet 1)
      { x: 500, y: 190 }  // Node C (Subnet 2 - Isolated)
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      nodeStates = ['ACTIVE', 'ACTIVE', 'ACTIVE'],
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
          type: actionText.includes("REJECT") ? "CRASH" : actionText.includes("PARTITION") ? "SYSTEM" : "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "A", label: "Node A (Subnet 1)", x: positions[0].x, y: positions[0].y, status: nodeStates[0] },
          { id: "B", label: "Node B (Subnet 1)", x: positions[1].x, y: positions[1].y, status: nodeStates[1] },
          { id: "C", label: "Node C (Subnet 2)", x: positions[2].x, y: positions[2].y, status: nodeStates[2] }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        capInfo: `Mode: ${capMode} Mode | Network: ${isPartitioned ? 'PARTITIONED (Subnet 1 {A,B} || Subnet 2 {C})' : 'CONNECTED'}`
      });
    };

    // STEP 0: System State
    pushStep({
      title: "Distributed Database Cluster State",
      explanation: `System operating in ${capMode} Mode. Network is currently ${isPartitioned ? 'PARTITIONED' : 'FULLY CONNECTED'}.`,
      rule: "CAP Initial State",
      why: "CAP theorem dictates that during network partitions (P), a distributed system MUST choose between Consistency (C) and Availability (A).",
      codeLine: 1,
      actionText: `Cluster initialized in ${capMode} Mode`,
      actor: "Cluster"
    });

    if (isPartitioned) {
      // STEP 1: Partition Injection
      pushStep({
        title: "Network Link Severed! Partition Injected",
        explanation: "Communication link between Subnet 1 {Node A, Node B} and Subnet 2 {Node C} severs completely.",
        rule: "Partition Tolerance (P)",
        why: "Network partitions occur inevitably in distributed systems due to switch failures, fiber cuts, or router dropped packets.",
        codeLine: 1,
        nodeStates: ['ACTIVE', 'ACTIVE', 'ELECTION'],
        actionText: "Network Partition severs Node C from Node A & B",
        actor: "Network"
      });

      // STEP 2: Client Write Request to Isolated Node C
      const writeMsg = [{ from: "Client", to: "C", label: "WRITE(x=42)", type: "request" }];
      pushStep({
        title: "Client Sends Write Request to Node C",
        explanation: "An external client attempts to write data 'x = 42' to isolated Node C on Subnet 2.",
        rule: "Isolated Node Write Request",
        why: "Node C cannot communicate with Node A or Node B to verify quorum or replicate changes.",
        codeLine: capMode === "CP" ? 2 : 7,
        messages: writeMsg,
        actionText: "Client sends WRITE(x=42) to Node C",
        actor: "Client",
        target: "Node C"
      });

      if (capMode === "CP") {
        // CP MODE STEPS
        const cpRejectMsg = [{ from: "C", to: "Client", label: "503 Error (Write Rejected)", type: "response" }];
        pushStep({
          title: "CP Mode: Write REJECTED (Consistency Preserved)",
          explanation: "In CP Mode, Node C refuses the write and returns HTTP 503 error because it cannot reach majority quorum ({A, B}).",
          rule: "CP Mode Rule: Prioritize Consistency",
          why: "Refusing writes on isolated minority partitions prevents split-brain state divergence, maintaining strict linearizable consistency across reads.",
          codeLine: 3,
          messages: cpRejectMsg,
          nodeStates: ['ACTIVE', 'ACTIVE', 'CRASHED'],
          actionText: "Node C REJECTS write (503 Service Unavailable)",
          actor: "Node C",
          target: "Client"
        });

        pushStep({
          title: "CP Mode Summary: Strong Consistency Maintained",
          explanation: "All active nodes hold identical data (x=10). System sacrificed Availability on minority partition to guarantee Consistency.",
          rule: "CP Guarantee",
          why: "No client can read stale or conflicting data from Node C.",
          codeLine: 4,
          nodeStates: ['ACTIVE', 'ACTIVE', 'ELECTION'],
          actionText: "CP Trade-off: Consistency maintained, Availability reduced",
          actor: "System"
        });
      } else {
        // AP MODE STEPS
        const apAcceptMsg = [{ from: "C", to: "Client", label: "200 OK (Local Write Accepted)", type: "response" }];
        pushStep({
          title: "AP Mode: Write ACCEPTED (Availability Preserved)",
          explanation: "In AP Mode, Node C accepts the write locally (x=42) and returns 200 OK to remain available to the client.",
          rule: "AP Mode Rule: Prioritize Availability",
          why: "AP systems guarantee every non-failing node returns a response, even if data replication across partitions is blocked.",
          codeLine: 8,
          messages: apAcceptMsg,
          nodeStates: ['ACTIVE', 'ACTIVE', 'ACTIVE'],
          actionText: "Node C ACCEPTS write locally (x=42)",
          actor: "Node C",
          target: "Client"
        });

        pushStep({
          title: "AP Mode Result: Temporary Inconsistency (Split-Brain)",
          explanation: "Node C has x=42 while Nodes A & B have x=10. Data diverges until partition heals and conflict resolution runs.",
          rule: "AP Guarantee",
          why: "System sacrificed strict consistency to guarantee 100% uptime and write availability for all clients.",
          codeLine: 9,
          nodeStates: ['ACTIVE', 'ACTIVE', 'PROMISE'],
          actionText: "AP Trade-off: Availability maintained, Inconsistency introduced",
          actor: "System"
        });
      }
    } else {
      pushStep({
        title: "Normal Un-partitioned Cluster Operation",
        explanation: "All nodes communicate without latency or loss. Writes replicate instantly across Node A, B, and C.",
        rule: "No Partition Active",
        why: "When network is healthy, distributed systems provide both high availability and strong consistency simultaneously.",
        codeLine: 1,
        actionText: "Normal cluster operation without network partition",
        actor: "Cluster"
      });
    }

    return stepList;
  }, [capMode, isPartitioned]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  CAP Theorem Network Partition Visualizer
                </h3>
                <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                  {sim.activeState.capInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60 relative">
              {isPartitioned && (
                <div className="absolute left-[330px] top-6 bottom-6 w-1 border-r-2 border-dashed border-red-500/80 flex items-center justify-center">
                  <span className="bg-red-900/90 text-red-300 text-[10px] font-bold px-1.5 py-0.5 rounded transform -rotate-90">
                    NETWORK PARTITION
                  </span>
                </div>
              )}
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={isPartitioned ? [["A", "B"]] : [["A", "B"], ["B", "C"], ["A", "C"]]}
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
          <CodePanel codeLines={CAP_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              CAP Trade-off Controls
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">System Mode:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCapMode("CP")}
                  className={`py-1.5 px-3 text-xs font-bold rounded border ${
                    capMode === "CP"
                      ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  CP Mode (Consistency)
                </button>
                <button
                  onClick={() => setCapMode("AP")}
                  className={`py-1.5 px-3 text-xs font-bold rounded border ${
                    capMode === "AP"
                      ? "bg-amber-600/30 border-amber-500 text-amber-300"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  AP Mode (Availability)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Network State:</label>
              <button
                onClick={() => setIsPartitioned(!isPartitioned)}
                className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                  isPartitioned
                    ? "bg-red-600/30 border-red-500 text-red-300"
                    : "bg-blue-600/30 border-blue-500 text-blue-300"
                }`}
              >
                {isPartitioned ? "Network Partition Active (Click to Heal)" : "Network Healthy (Click to Partition)"}
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
