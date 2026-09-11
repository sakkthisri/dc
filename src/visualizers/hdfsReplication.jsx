import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const HDFS_PSEUDOCODE = [
  "// Hadoop Distributed File System (HDFS) Replication",
  "1. Client requests NameNode to write file dataset.csv (256MB)",
  "2. NameNode splits file into 128MB Blocks (Block_1, Block_2)",
  "3. NameNode selects target DataNodes based on Replication Factor (RF=3)",
  "4. Pipeline Replication Write:",
  "   - Client -> DataNode_1 -> DataNode_2 -> DataNode_3",
  "5. DataNodes send Heartbeat & BlockReports to NameNode (every 3s)",
  "6. If DataNode fails (Heartbeat timeout):",
  "   - NameNode detects under-replicated block count (2 < RF)",
  "   - NameNode schedules background re-replication to healthy DataNode_4"
];

export function HdfsReplicationVisualizer() {
  const [repFactor, setRepFactor] = useState(3);
  const [dn2Failed, setDn2Failed] = useState(true);

  const steps = useMemo(() => {
    const positions = [
      { x: 320, y: 70 },  // NameNode (NN)
      { x: 100, y: 250 }, // DataNode 1 (DN1)
      { x: 250, y: 250 }, // DataNode 2 (DN2)
      { x: 400, y: 250 }, // DataNode 3 (DN3)
      { x: 550, y: 250 }  // DataNode 4 (DN4)
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      nnState = 'ACTIVE',
      dnStates = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
      messages = [],
      blockLocations = {},
      actionText = '',
      actor = '',
      target = ''
    }) => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: actor,
          to: target,
          type: actionText.includes("Crash") || actionText.includes("Timeout") ? "CRASH" : "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "NN", label: "NameNode (Master)", x: positions[0].x, y: positions[0].y, status: nnState, role: 'NAMENODE' },
          { id: "DN1", label: "DataNode 1", x: positions[1].x, y: positions[1].y, status: dnStates[0], role: 'DATANODE' },
          { id: "DN2", label: "DataNode 2", x: positions[2].x, y: positions[2].y, status: dnStates[1], role: 'DATANODE' },
          { id: "DN3", label: "DataNode 3", x: positions[3].x, y: positions[3].y, status: dnStates[2], role: 'DATANODE' },
          { id: "DN4", label: "DataNode 4", x: positions[4].x, y: positions[4].y, status: dnStates[3], role: 'DATANODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        hdfsInfo: `Replication Factor (RF): ${repFactor} | Active Block Replicas: ${blockLocations.B1 ? blockLocations.B1.length : 0}/${repFactor}`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "HDFS Cluster Initialized",
      explanation: `NameNode metadata catalog ready. Target Replication Factor RF=${repFactor}.`,
      rule: "HDFS Architecture",
      why: "NameNode stores file system metadata (filename to block mapping); DataNodes store raw data blocks.",
      codeLine: 1,
      actionText: "HDFS cluster ready for upload",
      actor: "NameNode"
    });

    // STEP 1: Upload & Block Allocation
    const allocMsgs = [{ from: "Client", to: "NN", label: "Create File (dataset.csv 256MB)", type: "request" }];
    pushStep({
      title: "File Upload Request & Block Slicing",
      explanation: "Client requests upload of dataset.csv (256MB). NameNode splits file into 2 x 128MB blocks (B1, B2) and allocates pipeline targets.",
      rule: "Block Allocation",
      why: "Slicing large files into 128MB block chunks enables streaming map-reduce processing and multi-node fault tolerance.",
      codeLine: 2,
      messages: allocMsgs,
      actionText: "Client requests block allocation for dataset.csv",
      actor: "Client",
      target: "NameNode"
    });

    // STEP 2: Primary Pipeline Write
    const pipeMsgs = [
      { from: "NN", to: "DN1", label: "Write B1 (Pipeline)", type: "request" },
      { from: "DN1", to: "DN2", label: "Pipe B1 Replica", type: "request" },
      { from: "DN2", to: "DN3", label: "Pipe B1 Replica", type: "request" }
    ];

    pushStep({
      title: "Pipeline Write: DN1 -> DN2 -> DN3",
      explanation: "Client streams Block B1 to DataNode 1, which pipelines data synchronously to DN2 and DN3 across racks.",
      rule: "Pipeline Replication",
      why: "Pipelining write streams minimizes client network bottleneck by letting DataNodes forward data directly to peers.",
      codeLine: 4,
      messages: pipeMsgs,
      blockLocations: { B1: ["DN1", "DN2", "DN3"] },
      actionText: "DataNode 1 pipelines Block B1 to DN2 & DN3",
      actor: "DN1",
      target: "DN2, DN3"
    });

    // STEP 3: Block Report ACKs
    pushStep({
      title: "Block Receipt Acknowledgement (RF=3 Met)",
      explanation: "DataNodes DN1, DN2, DN3 acknowledge successful write. NameNode updates metadata catalog (B1 replicas = 3).",
      rule: "BlockReport Verification",
      why: "Confirms target replication factor (3/3) is fully satisfied.",
      codeLine: 5,
      blockLocations: { B1: ["DN1", "DN2", "DN3"] },
      actionText: "Block B1 replicas confirmed on DN1, DN2, DN3",
      actor: "NameNode"
    });

    if (dn2Failed) {
      // STEP 4: DataNode Failure & Heartbeat Loss
      pushStep({
        title: "DataNode DN2 Crashes! Heartbeat Timeout",
        explanation: "DataNode DN2 experiences a disk failure. Heartbeat timeout expires on NameNode (no heartbeat received for 30s).",
        rule: "Heartbeat Failure Detection",
        why: "NameNode continuously monitors node health via periodic 3-second heartbeat signals.",
        codeLine: 6,
        dnStates: ['ACTIVE', 'CRASHED', 'ACTIVE', 'ACTIVE'],
        blockLocations: { B1: ["DN1", "DN3"] },
        actionText: "DN2 crashed! Missing heartbeat detected on NameNode",
        actor: "NameNode"
      });

      // STEP 5: Automated Background Re-replication
      const reReplMsgs = [{ from: "DN1", to: "DN4", label: "Re-replicate B1", type: "request" }];
      pushStep({
        title: "Under-Replication Detected! Re-replicating to DN4",
        explanation: "NameNode detects Block B1 replica count dropped to 2 (below target RF=3). NameNode commands DN1 to copy B1 to healthy DN4.",
        rule: "Automated Self-Healing",
        why: "HDFS automatically repairs lost block replicas without operator intervention to maintain target durability.",
        codeLine: 8,
        messages: reReplMsgs,
        dnStates: ['ACTIVE', 'CRASHED', 'ACTIVE', 'PROMISE'],
        blockLocations: { B1: ["DN1", "DN3", "DN4"] },
        actionText: "DN1 copies Block B1 to DN4 to restore RF=3",
        actor: "DN1",
        target: "DN4"
      });

      // STEP 6: Target Replication Restored
      pushStep({
        title: "Replication Factor Restored (RF = 3/3)",
        explanation: "DN4 reports successful block receipt. NameNode updates metadata catalog: B1 is again fully replicated across DN1, DN3, and DN4!",
        rule: "Rereplication Complete",
        why: "Full fault tolerance restored despite total loss of DataNode 2.",
        codeLine: 8,
        dnStates: ['ACTIVE', 'CRASHED', 'ACTIVE', 'ACTIVE'],
        blockLocations: { B1: ["DN1", "DN3", "DN4"] },
        actionText: "Target replication factor (3/3) fully restored!",
        actor: "NameNode"
      });
    }

    return stepList;
  }, [repFactor, dn2Failed]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  HDFS Block Pipeline & Automated Re-Replication
                </h3>
                <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                  {sim.activeState.hdfsInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["NN", "DN1"], ["NN", "DN2"], ["NN", "DN3"], ["NN", "DN4"]]}
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
          <CodePanel codeLines={HDFS_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              HDFS Parameters & Disk Failure Injection
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Target Replication Factor (RF):</label>
              <select
                value={repFactor}
                onChange={(e) => setRepFactor(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value={3}>RF = 3 (Default Production Standard)</option>
                <option value={2}>RF = 2 (Minimal Backup)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">DataNode 2 Health State:</label>
              <button
                onClick={() => setDn2Failed(!dn2Failed)}
                className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                  dn2Failed
                    ? "bg-red-600/30 border-red-500 text-red-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {dn2Failed ? "Simulating DN2 Disk Crash (Trigger Re-Replication)" : "DN2 Healthy (No Failure)"}
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
