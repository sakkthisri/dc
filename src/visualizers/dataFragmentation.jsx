import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const FRAGMENTATION_PSEUDOCODE = [
  "// Distributed Database Table Fragmentation",
  "1. Horizontal Fragmentation (Row Slicing):",
  "   - Table Users split by Predicate: WHERE age < 30 -> Node A, WHERE age >= 30 -> Node B",
  "2. Vertical Fragmentation (Column Slicing):",
  "   - Table Users split by Attributes: {id, name} -> Node A, {id, salary, ssn} -> Node B",
  "3. Hybrid Fragmentation:",
  "   - Applies vertical column partitioning followed by horizontal range predicates"
];

export function DataFragmentationVisualizer() {
  const [fragType, setFragType] = useState("HORIZONTAL"); // "HORIZONTAL", "VERTICAL", "HYBRID"

  const steps = useMemo(() => {
    const positions = [
      { x: 320, y: 80 },  // Global Schema Master
      { x: 160, y: 260 }, // Fragment Node A
      { x: 480, y: 260 }  // Fragment Node B
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['NAMENODE', 'PRIMARY', 'REPLICA'],
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
          { id: "Master", label: "Global Relation: Users", x: positions[0].x, y: positions[0].y, status: states[0], role: 'NAMENODE' },
          { id: "NodeA", label: fragType === "VERTICAL" ? "Node A {id, name}" : "Node A (age < 30)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'PRIMARY' },
          { id: "NodeB", label: fragType === "VERTICAL" ? "Node B {id, salary}" : "Node B (age >= 30)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'REPLICA' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        fragInfo: `Strategy: ${fragType} Fragmentation | Relation: Users(id, name, age, salary)`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "Global Schema Relation Initialized",
      explanation: `Global relation Users(id, name, age, salary) ready for ${fragType} fragmentation across database nodes.`,
      rule: "Fragmentation Scheme",
      why: "Database fragmentation distributes logical tables across physical storage to localize query processing.",
      codeLine: 1,
      actionText: "Global schema relation initialized",
      actor: "Master"
    });

    // STEP 1: Fragment Distribution
    const fragMsgs = [
      { from: "Master", to: "NodeA", label: fragType === "VERTICAL" ? "Columns {id, name}" : "Rows (age < 30)", type: "request" },
      { from: "Master", to: "NodeB", label: fragType === "VERTICAL" ? "Columns {id, salary}" : "Rows (age >= 30)", type: "request" }
    ];

    pushStep({
      title: `${fragType} Fragment Distribution Execution`,
      explanation: fragType === "HORIZONTAL"
        ? "Horizontal Slicing: Rows where age < 30 sent to Node A; rows where age >= 30 sent to Node B."
        : "Vertical Slicing: Attribute columns {id, name} sent to Node A; {id, salary} sent to Node B.",
      rule: `${fragType} Rules`,
      why: fragType === "HORIZONTAL"
        ? "Allows regional queries to target local row partitions directly."
        : "Keeps sensitive financial attributes localized to secure nodes while public profile attributes remain open.",
      codeLine: fragType === "HORIZONTAL" ? 1 : 2,
      messages: fragMsgs,
      states: ['NAMENODE', 'LEADER', 'LEADER'],
      actionText: `Relation fragmented via ${fragType} scheme to Node A & B`,
      actor: "Master",
      target: "Node A, B"
    });

    return stepList;
  }, [fragType]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Database Data Fragmentation Visualizer
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.fragInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Master", "NodeA"], ["Master", "NodeB"]]}
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
          <CodePanel codeLines={FRAGMENTATION_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Fragmentation Strategy
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Fragmentation Scheme:</label>
              <select
                value={fragType}
                onChange={(e) => setFragType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="HORIZONTAL">Horizontal Fragmentation (Row Range Slicing)</option>
                <option value="VERTICAL">Vertical Fragmentation (Column Attribute Slicing)</option>
                <option value="HYBRID">Hybrid (Combined Row & Column Partitioning)</option>
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
