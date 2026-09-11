import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const WAREHOUSE_PSEUDOCODE = [
  "// Distributed Data Warehousing & ETL Pipeline",
  "1. Extract Phase:",
  "   - Extract transactional records from OLTP Source DBs (Sales DB, Web Analytics)",
  "2. Transform Phase:",
  "   - Cleanse, deduplicate, and convert records into columnar format (Parquet)",
  "3. Load Phase:",
  "   - Bulk load partitioned data into Data Warehouse Shards (Shard 1, Shard 2)",
  "4. Parallel OLAP Query Execution:",
  "   - Analytics engine executes MPP (Massively Parallel Processing) SQL query across shards"
];

export function DistributedDataWarehouseVisualizer() {
  const [etlBatchSize, setEtlBatchSize] = useState("10,000");

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 100 }, // Source DB 1
      { x: 100, y: 260 }, // Source DB 2
      { x: 300, y: 180 }, // ETL Engine
      { x: 500, y: 100 }, // DW Shard 1
      { x: 500, y: 260 }  // DW Shard 2
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['NODE', 'NODE', 'ROUTER', 'PRIMARY', 'PRIMARY'],
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
          type: "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "Src1", label: "Sales OLTP DB", x: positions[0].x, y: positions[0].y, status: states[0], role: 'NODE' },
          { id: "Src2", label: "Web Analytics DB", x: positions[1].x, y: positions[1].y, status: states[1], role: 'NODE' },
          { id: "ETL", label: "ETL Transform Pipeline", x: positions[2].x, y: positions[2].y, status: states[2], role: 'ROUTER' },
          { id: "Shard1", label: "DW Shard 1 (Sales)", x: positions[3].x, y: positions[3].y, status: states[3], role: 'PRIMARY' },
          { id: "Shard2", label: "DW Shard 2 (Analytics)", x: positions[4].x, y: positions[4].y, status: states[4], role: 'PRIMARY' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        dwInfo: `Batch Size: ${etlBatchSize} records | Pipeline: OLTP -> Extract -> Transform -> MPP Load`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "ETL Data Pipeline Initialized",
      explanation: "Data Sources ready for batch extraction into distributed data warehouse MPP shards.",
      rule: "Data Warehousing Architecture",
      why: "Data warehouses separate analytical processing (OLAP) from transactional databases (OLTP) to optimize query performance.",
      codeLine: 1,
      actionText: "Data warehouse ETL pipeline ready",
      actor: "ETL"
    });

    // STEP 1: Extract Phase
    const extMsgs = [
      { from: "Src1", to: "ETL", label: `Extract Batch (${etlBatchSize})`, type: "request" },
      { from: "Src2", to: "ETL", label: `Extract Batch (${etlBatchSize})`, type: "request" }
    ];

    pushStep({
      title: "Phase 1: Extract Records from OLTP Sources",
      explanation: `ETL engine extracts ${etlBatchSize} raw transactional records from Sales DB and Web Analytics DB.`,
      rule: "Extract Phase",
      why: "Gathers raw data without impacting live production transaction latencies.",
      codeLine: 1,
      messages: extMsgs,
      states: ['PROMISE', 'PROMISE', 'LEADER', 'PRIMARY', 'PRIMARY'],
      actionText: `Extracted ${etlBatchSize} records from OLTP source DBs`,
      actor: "ETL",
      target: "Src1, Src2"
    });

    // STEP 2: Transform Phase
    pushStep({
      title: "Phase 2: Data Transformation & Columnar Formatting",
      explanation: "ETL engine cleanses schema, converts timestamps, and formats records into compressed columnar Parquet files.",
      rule: "Transform Phase",
      why: "Columnar formatting dramatically speeds up OLAP aggregation queries by reading only required column ranges.",
      codeLine: 2,
      states: ['NODE', 'NODE', 'LEADER', 'PRIMARY', 'PRIMARY'],
      actionText: "Data transformed into columnar Parquet format",
      actor: "ETL"
    });

    // STEP 3: Load Phase into Warehouse Shards
    const loadMsgs = [
      { from: "ETL", to: "Shard1", label: "Load Columnar Batch", type: "request" },
      { from: "ETL", to: "Shard2", label: "Load Columnar Batch", type: "request" }
    ];

    pushStep({
      title: "Phase 3: Bulk Load into Massively Parallel Warehouse Shards",
      explanation: "Transformed records are loaded in parallel across DW Shard 1 and DW Shard 2.",
      rule: "Load Phase",
      why: "Distributing star-schema fact tables across shards allows MPP execution engines to run parallel SQL scans.",
      codeLine: 3,
      messages: loadMsgs,
      states: ['NODE', 'NODE', 'ROUTER', 'LEADER', 'LEADER'],
      actionText: "Transformed records loaded into DW Shards 1 & 2",
      actor: "ETL",
      target: "Shard1, Shard2"
    });

    return stepList;
  }, [etlBatchSize]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Distributed Data Warehouse ETL Pipeline
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.dwInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Src1", "ETL"], ["Src2", "ETL"], ["ETL", "Shard1"], ["ETL", "Shard2"]]}
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
          <CodePanel codeLines={WAREHOUSE_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              ETL Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Batch Record Size:</label>
              <select
                value={etlBatchSize}
                onChange={(e) => setEtlBatchSize(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="10,000">10,000 Records / Batch</option>
                <option value="100,000">100,000 Records / Batch</option>
                <option value="1,000,000">1,000,000 Records / Batch (High Throughput)</option>
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
