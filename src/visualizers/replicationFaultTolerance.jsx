import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const REPLICATION_PSEUDOCODE = [
  "// Active-Passive Replication & Automated Failover",
  "1. Synchronous Replication:",
  "   - Primary P receives Write(x=5)",
  "   - Primary blocks client & forwards Write(x=5) to Replicas (R1, R2)",
  "   - Replicas write to disk & return ACK",
  "   - Primary confirms 200 OK to Client",
  "2. Primary Crash & Failover:",
  "   - Primary P crashes during workload execution",
  "   - Replicas detect heartbeat loss & start election",
  "   - Replica R1 with highest log index promoted to NEW PRIMARY"
];

export function ReplicationFaultToleranceVisualizer() {
  const [replMode, setReplMode] = useState("SYNC"); // SYNC vs ASYNC
  const [primaryCrash, setPrimaryCrash] = useState(true);

  const steps = useMemo(() => {
    const positions = [
      { x: 320, y: 80 },  // Primary P
      { x: 160, y: 260 }, // Replica R1
      { x: 480, y: 260 }  // Replica R2
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['LEADER', 'REPLICA', 'REPLICA'],
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
          type: actionText.includes("Failover") || actionText.includes("Crash") ? "CRASH" : "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "P", label: "Primary (P)", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "R1", label: "Replica R1", x: positions[1].x, y: positions[1].y, status: states[1], role: 'REPLICA' },
          { id: "R2", label: "Replica R2", x: positions[2].x, y: positions[2].y, status: states[2], role: 'REPLICA' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        replInfo: `Mode: ${replMode} Replication | Primary: P | Replicas: R1, R2`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "Primary-Replica Topology Initialized",
      explanation: `System configured in ${replMode} Replication mode. Primary P handles client writes.`,
      rule: "Replication Architecture",
      why: "Replication guarantees data redundancy and high availability across physical server failures.",
      codeLine: 1,
      actionText: "Primary-Replica cluster ready",
      actor: "Cluster"
    });

    // STEP 1: Client Write
    const writeMsg = [{ from: "Client", to: "P", label: "WRITE(val=99)", type: "request" }];
    pushStep({
      title: "Client Submits Write to Primary P",
      explanation: "Client sends WRITE(val=99) to Primary P. Primary logs change locally.",
      rule: "Write Routing",
      why: "Primary-backup models route all mutating writes to single leader node.",
      codeLine: 2,
      messages: writeMsg,
      actionText: "Client sent WRITE(val=99) to Primary P",
      actor: "Client",
      target: "P"
    });

    // STEP 2: Replication Propagation
    const replMsgs = [
      { from: "P", to: "R1", label: `REPLICATE(99, ${replMode})`, type: "request" },
      { from: "P", to: "R2", label: `REPLICATE(99, ${replMode})`, type: "request" }
    ];

    pushStep({
      title: `Replicating Payload (${replMode} Mode)`,
      explanation: replMode === "SYNC"
        ? "Primary P blocks client response and streams data synchronously to R1 and R2."
        : "Primary P returns OK to client immediately and asynchronously streams data to R1 and R2 in background.",
      rule: `${replMode} Replication Rule`,
      why: replMode === "SYNC"
        ? "Synchronous replication guarantees zero data loss (RPO=0) on crash."
        : "Asynchronous replication offers lower write latency but risks data loss during un-replicated window.",
      codeLine: 3,
      messages: replMsgs,
      states: ['LEADER', 'PROMISE', 'PROMISE'],
      actionText: `Primary P replicated payload to R1 & R2 (${replMode})`,
      actor: "P",
      target: "R1, R2"
    });

    if (primaryCrash) {
      // STEP 3: Primary Crash
      pushStep({
        title: "Primary P Crashes!",
        explanation: "Primary P experiences total system crash. Heartbeat transmission to replicas halts.",
        rule: "Leader Failure",
        why: "Triggers automatic failover to prevent extended service outage.",
        codeLine: 6,
        states: ['CRASHED', 'REPLICA', 'REPLICA'],
        actionText: "Primary P crashed!",
        actor: "P"
      });

      // STEP 4: Automatic Failover Election
      const failoverMsg = [{ from: "R1", to: "R2", label: "ELECTION(R1 Highest Log)", type: "request" }];
      pushStep({
        title: "Automated Failover: Replica R1 Promoted to LEADER",
        explanation: "Replicas R1 and R2 detect heartbeat timeout. Replica R1 (most up-to-date log index) is promoted to NEW PRIMARY!",
        rule: "Automated Failover",
        why: "Failover restores write availability by promoting healthy standby replica.",
        codeLine: 8,
        messages: failoverMsg,
        states: ['CRASHED', 'LEADER', 'REPLICA'],
        actionText: "Replica R1 promoted to NEW PRIMARY!",
        actor: "R1"
      });
    }

    return stepList;
  }, [replMode, primaryCrash]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Primary-Backup Replication & Automated Failover Topology
                </h3>
                <p className="text-[11px] text-green-400 font-mono mt-0.5">
                  {sim.activeState.replInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["P", "R1"], ["P", "R2"], ["R1", "R2"]]}
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
          <CodePanel codeLines={REPLICATION_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Replication Controls
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Replication Synchronicity:</label>
              <select
                value={replMode}
                onChange={(e) => setReplMode(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="SYNC">Synchronous Replication (RPO=0 Zero Data Loss)</option>
                <option value="ASYNC">Asynchronous Replication (Low Latency)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Primary Failover Trigger:</label>
              <button
                onClick={() => setPrimaryCrash(!primaryCrash)}
                className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                  primaryCrash
                    ? "bg-red-600/30 border-red-500 text-red-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {primaryCrash ? "Simulate Primary P Crash (Trigger Failover)" : "Primary P Healthy"}
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
