import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const SPARK_PSEUDOCODE = [
  "// Apache Spark DAG & RDD Lineage Execution",
  "1. Construct RDD Lineage Graph:",
  "   rdd1 = sc.textFile('data.txt')       // Source RDD",
  "   rdd2 = rdd1.flatMap(line => line.split(' ')) // Narrow Dependency",
  "   rdd3 = rdd2.map(word => (word, 1))           // Narrow Dependency",
  "2. Trigger Action (count / saveAsTextFile):",
  "   rdd4 = rdd3.groupByKey()             // Wide Dependency (Shuffle Boundary!)",
  "   rdd5 = rdd4.reduceByKey((a, b) => a + b)",
  "3. DAG Scheduler splits graph into Stage 1 (Pipelined) & Stage 2 (Post-Shuffle)",
  "4. Fault Tolerance (Partition Failure):",
  "   - Partition 2 on Worker 1 crashes",
  "   - Spark re-computes ONLY Partition 2 from parent RDD lineage!"
];

export function SparkDagVisualizer() {
  const [simulatePartitionLoss, setSimulatePartitionLoss] = useState(true);

  const steps = useMemo(() => {
    const positions = [
      { x: 80, y: 180 },  // RDD1 (textFile)
      { x: 220, y: 180 }, // RDD2 (flatMap - Narrow)
      { x: 360, y: 180 }, // RDD3 (map - Narrow)
      { x: 500, y: 120 }, // RDD4 (groupByKey - Stage 2 Shuffle)
      { x: 500, y: 240 }  // RDD5 (reduceByKey - Stage 2 Result)
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
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
          type: actionText.includes("Shuffle") || actionText.includes("Recompute") ? "CONSENSUS" : "SYSTEM"
        });
      }

      stepList.push({
        nodes: [
          { id: "RDD1", label: "RDD1 (textFile)", x: positions[0].x, y: positions[0].y, status: states[0], role: 'NODE' },
          { id: "RDD2", label: "RDD2 (flatMap)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'PRIMARY' },
          { id: "RDD3", label: "RDD3 (map)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'PRIMARY' },
          { id: "RDD4", label: "RDD4 (groupByKey)", x: positions[3].x, y: positions[3].y, status: states[3], role: states[3] === 'CRASHED' ? 'CRASHED' : 'REPLICA' },
          { id: "RDD5", label: "RDD5 (reduceByKey)", x: positions[4].x, y: positions[4].y, status: states[4], role: 'LEADER' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        sparkInfo: `Execution Engine: In-Memory DAG Scheduler | Stage 1 (Narrow) -> Stage 2 (Shuffle Wide)`
      });
    };

    // STEP 0: DAG Construction
    pushStep({
      title: "Lazy RDD Lineage Construction",
      explanation: "Driver constructs RDD Lineage DAG: textFile -> flatMap -> map -> groupByKey -> reduceByKey.",
      rule: "Lazy Evaluation",
      why: "Spark transformations are lazy; no compute executes until an action (count/save) is called.",
      codeLine: 1,
      actionText: "Spark RDD Lineage DAG constructed",
      actor: "Driver"
    });

    // STEP 1: Stage 1 Execution (Narrow Dependencies)
    const narrowMsgs = [
      { from: "RDD1", to: "RDD2", label: "In-Memory Stream", type: "request" },
      { from: "RDD2", to: "RDD3", label: "In-Memory Stream", type: "request" }
    ];

    pushStep({
      title: "Stage 1 Execution: Narrow Dependency Pipelining",
      explanation: "flatMap and map have Narrow Dependencies (1-to-1 partition mapping). Spark pipelines execution in-memory on Stage 1 worker threads without network shuffle.",
      rule: "Narrow Dependency Rule",
      why: "Narrow dependencies allow transformations to run entirely within local memory without disk spills or network transfers.",
      codeLine: 3,
      messages: narrowMsgs,
      states: ['ACTIVE', 'LEADER', 'LEADER', 'ACTIVE', 'ACTIVE'],
      actionText: "Stage 1 pipelined in-memory across Narrow RDDs",
      actor: "Stage 1 Workers",
      target: "RDD2, RDD3"
    });

    // STEP 2: Shuffle Boundary & Stage 2 Transition
    const shuffleMsgs = [{ from: "RDD3", to: "RDD4", label: "Network Shuffle Boundary", type: "request" }];
    pushStep({
      title: "Shuffle Boundary: Wide Dependency Triggered",
      explanation: "groupByKey requires a Wide Dependency (Shuffle). DAG Scheduler splits execution, materializing Stage 1 output and transferring keys across the cluster.",
      rule: "Wide Dependency & Stage Boundaries",
      why: "Wide dependencies group data from multiple parent partitions, forcing an expensive network shuffle stage boundary.",
      codeLine: 4,
      messages: shuffleMsgs,
      states: ['ACTIVE', 'ACTIVE', 'PROMISE', 'PROMISE', 'ACTIVE'],
      actionText: "DAG Scheduler creates Stage 2 at Shuffle Boundary",
      actor: "DAGScheduler",
      target: "RDD4"
    });

    if (simulatePartitionLoss) {
      // STEP 3: Partition Failure
      pushStep({
        title: "Worker Partition Loss on RDD4 (Stage 2)",
        explanation: "Worker 1 hosting RDD4 Partition 2 experiences an out-of-memory crash. Partition 2 lost from RAM!",
        rule: "Fault Injection",
        why: "Distributed nodes can fail at any time during long-running analytics jobs.",
        codeLine: 4,
        states: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'CRASHED', 'ACTIVE'],
        actionText: "RDD4 Partition 2 lost on Worker 1!",
        actor: "Worker 1"
      });

      // STEP 4: Lineage Recomputation
      const recompMsgs = [{ from: "RDD3", to: "RDD4", label: "Re-compute Partition 2", type: "request" }];
      pushStep({
        title: "Lineage Re-computation: Selective Recovery",
        explanation: "Spark does NOT restart the entire job. It consults the RDD Lineage Graph and re-computes ONLY lost Partition 2 from parent RDD3!",
        rule: "RDD Lineage Fault Tolerance",
        why: "Lineage graphs provide resilient fault tolerance without needing expensive disk checkpointing after every transformation.",
        codeLine: 4,
        messages: recompMsgs,
        states: ['ACTIVE', 'ACTIVE', 'LEADER', 'PROMISE', 'ACTIVE'],
        actionText: "Spark re-computes lost RDD4 Partition 2 from RDD3 lineage",
        actor: "DAGScheduler",
        target: "RDD4"
      });
    }

    // STEP 5: Final Result Output
    const finalMsgs = [{ from: "RDD4", to: "RDD5", label: "reduceByKey", type: "response" }];
    pushStep({
      title: "Stage 2 Finalization: reduceByKey Complete",
      explanation: "RDD5 completes aggregation. Action returns final dataset results to Driver node.",
      rule: "Job Finalization",
      why: "In-memory DAG pipeline yields up to 100x faster performance than traditional MapReduce.",
      codeLine: 2,
      messages: finalMsgs,
      states: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'LEADER'],
      actionText: "Spark DAG job finalized successfully",
      actor: "Driver"
    });

    return stepList;
  }, [simulatePartitionLoss]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Apache Spark DAG & RDD Lineage Graph
                </h3>
                <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                  {sim.activeState.sparkInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["RDD1", "RDD2"], ["RDD2", "RDD3"], ["RDD3", "RDD4"], ["RDD4", "RDD5"]]}
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
          <CodePanel codeLines={SPARK_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Spark Fault Tolerance Controls
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Partition Failure Simulation:</label>
              <button
                onClick={() => setSimulatePartitionLoss(!simulatePartitionLoss)}
                className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                  simulatePartitionLoss
                    ? "bg-amber-600/30 border-amber-500 text-amber-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {simulatePartitionLoss
                  ? "Simulating RDD Partition Loss (Lineage Recomputation)"
                  : "Normal DAG Execution (No Failures)"}
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
