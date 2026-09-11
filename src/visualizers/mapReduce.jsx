import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const MAPREDUCE_PSEUDOCODE = [
  "// MapReduce Distributed Execution Pipeline",
  "1. Input Split: Partition raw text into chunks Split_1 & Split_2",
  "2. Map Phase (Parallel Mappers):",
  "   - Mapper 1 reads Split 1 -> emits (hadoop, 1), (mapreduce, 1)",
  "   - Mapper 2 reads Split 2 -> emits (spark, 1), (mapreduce, 1)",
  "3. Shuffle & Sort Phase (Network Data Transfer):",
  "   - Partition keys via Hash(key) mod Reducers",
  "   - Route (hadoop, [1]), (mapreduce, [1, 1]) -> Reducer 1",
  "   - Route (spark, [1]) -> Reducer 2",
  "4. Reduce Phase (Aggregation):",
  "   - Reducer 1 sums counts -> (hadoop, 1), (mapreduce, 2)",
  "   - Reducer 2 sums counts -> (spark, 1)",
  "5. Output Write: Write aggregated results to HDFS output directory"
];

export function MapReduceVisualizer() {
  const [inputText, setInputText] = useState("hadoop mapreduce spark mapreduce hadoop");

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 120 }, // Split 1
      { x: 100, y: 240 }, // Split 2
      { x: 260, y: 120 }, // Mapper 1
      { x: 260, y: 240 }, // Mapper 2
      { x: 440, y: 120 }, // Reducer 1
      { x: 440, y: 240 }, // Reducer 2
      { x: 580, y: 180 }  // HDFS Output Sink
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
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
          type: actionText.includes("Map") || actionText.includes("Reduce") ? "CONSENSUS" : "SYSTEM"
        });
      }

      stepList.push({
        nodes: [
          { id: "S1", label: "Split 1", x: positions[0].x, y: positions[0].y, status: states[0], role: 'NODE' },
          { id: "S2", label: "Split 2", x: positions[1].x, y: positions[1].y, status: states[1], role: 'NODE' },
          { id: "M1", label: "Mapper 1", x: positions[2].x, y: positions[2].y, status: states[2], role: 'PRIMARY' },
          { id: "M2", label: "Mapper 2", x: positions[3].x, y: positions[3].y, status: states[3], role: 'PRIMARY' },
          { id: "R1", label: "Reducer 1", x: positions[4].x, y: positions[4].y, status: states[4], role: 'REPLICA' },
          { id: "R2", label: "Reducer 2", x: positions[5].x, y: positions[5].y, status: states[5], role: 'REPLICA' },
          { id: "Out", label: "HDFS Output", x: positions[6].x, y: positions[6].y, status: states[6], role: 'NAMENODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        mapReduceInfo: `Input: "${inputText}" | Pipeline: Split -> Map -> Shuffle -> Reduce -> Output`
      });
    };

    // STEP 0: System State
    pushStep({
      title: "MapReduce Framework Initialized",
      explanation: `Input text "${inputText}" ready for parallel MapReduce batch execution.`,
      rule: "MapReduce Paradigm",
      why: "MapReduce processes massive datasets in parallel across large compute clusters using a simple functional programming model.",
      codeLine: 1,
      actionText: "MapReduce job initialized",
      actor: "Master"
    });

    // STEP 1: Input Split Phase
    const splitMsgs = [
      { from: "S1", to: "M1", label: 'Chunk 1 ("hadoop mapreduce")', type: "request" },
      { from: "S2", to: "M2", label: 'Chunk 2 ("spark mapreduce hadoop")', type: "request" }
    ];

    pushStep({
      title: "Phase 1: Input Splitting",
      explanation: "Input text is sliced into independent splits (Chunk 1 and Chunk 2) and assigned to parallel Mapper nodes.",
      rule: "Input Splitting",
      why: "Splitting allows each mapper node to process data locally without waiting for global text completion.",
      codeLine: 1,
      messages: splitMsgs,
      states: ['PROMISE', 'PROMISE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
      actionText: "Splits dispatched to Mapper 1 and Mapper 2",
      actor: "InputSplits",
      target: "Mappers"
    });

    // STEP 2: Map Execution
    pushStep({
      title: "Phase 2: Map Processing (Key-Value Generation)",
      explanation: "Mapper 1 emits (hadoop, 1), (mapreduce, 1). Mapper 2 emits (spark, 1), (mapreduce, 1), (hadoop, 1).",
      rule: "Map Function",
      why: "The map function transforms raw input records into intermediate key-value tuples.",
      codeLine: 2,
      states: ['ACTIVE', 'ACTIVE', 'LEADER', 'LEADER', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
      actionText: "Mappers generated intermediate (Key, Value) pairs",
      actor: "Mappers"
    });

    // STEP 3: Shuffle & Sort Phase
    const shuffleMsgs = [
      { from: "M1", to: "R1", label: "(hadoop, 1), (mapreduce, 1)", type: "request" },
      { from: "M2", to: "R1", label: "(hadoop, 1), (mapreduce, 1)", type: "request" },
      { from: "M2", to: "R2", label: "(spark, 1)", type: "request" }
    ];

    pushStep({
      title: "Phase 3: Shuffle & Sort (Network Data Exchange)",
      explanation: "Hash partitioner routes keys across network: 'hadoop' & 'mapreduce' sent to Reducer 1; 'spark' sent to Reducer 2. Keys are sorted into lists.",
      rule: "Shuffle & Sort",
      why: "Shuffle guarantees all values associated with the exact same key land on the exact same reducer node.",
      codeLine: 3,
      messages: shuffleMsgs,
      states: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'PROMISE', 'PROMISE', 'ACTIVE'],
      actionText: "Shuffle network exchange routed key buckets to Reducers",
      actor: "ShuffleNetwork",
      target: "Reducers"
    });

    // STEP 4: Reduce Phase
    pushStep({
      title: "Phase 4: Reduce Aggregation",
      explanation: "Reducer 1 sums 'hadoop' -> 2, 'mapreduce' -> 2. Reducer 2 sums 'spark' -> 1.",
      rule: "Reduce Function",
      why: "The reduce function aggregates intermediate values associated with each unique key into a single concise result.",
      codeLine: 4,
      states: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'LEADER', 'LEADER', 'ACTIVE'],
      actionText: "Reducers aggregated key counts",
      actor: "Reducers"
    });

    // STEP 5: HDFS Output
    const outMsgs = [
      { from: "R1", to: "Out", label: '{"hadoop": 2, "mapreduce": 2}', type: "response" },
      { from: "R2", to: "Out", label: '{"spark": 1}', type: "response" }
    ];

    pushStep({
      title: "Phase 5: Final Result Output Write",
      explanation: "Reducers stream final Word Count results to HDFS storage files: dataset_part_0000 and dataset_part_0001.",
      rule: "Job Completion",
      why: "Aggregated results are persisted to fault-tolerant distributed storage.",
      codeLine: 5,
      messages: outMsgs,
      states: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'LEADER'],
      actionText: "MapReduce job complete! Results written to HDFS",
      actor: "Reducers",
      target: "HDFS"
    });

    return stepList;
  }, [inputText]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  MapReduce Pipeline (Split -&gt; Map -&gt; Shuffle -&gt; Reduce -&gt; Output)
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.mapReduceInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["S1", "M1"], ["S2", "M2"], ["M1", "R1"], ["M2", "R1"], ["M2", "R2"], ["R1", "Out"], ["R2", "Out"]]}
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
          <CodePanel codeLines={MAPREDUCE_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              MapReduce Input Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Custom Input Text (Word Count):</label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs font-mono"
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
