import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const RESOURCE_ALLOCATION_PSEUDOCODE = [
  "// Distributed Resource Allocation Engine",
  "1. Process P1 requests Allocation: CPU = 4 Cores, RAM = 8GB",
  "2. Resource Manager validates global cluster capacity:",
  "   - Total Pool: CPU = 16 Cores, RAM = 32GB",
  "   - Currently Available: CPU = 12 Cores, RAM = 24GB",
  "3. Grant Allocation: Assign resources to Process P1 -> Update Pool",
  "4. Contention Resolution:",
  "   - If Process P2 requests exceeding available pool: Queue & Preempt lower priority tasks"
];

export function ResourceAllocationVisualizer() {
  const [resourceType, setResourceType] = useState("CPU_RAM");

  const steps = useMemo(() => {
    const positions = [
      { x: 320, y: 80 },  // Resource Manager
      { x: 140, y: 260 }, // Process P1
      { x: 320, y: 260 }, // Process P2
      { x: 500, y: 260 }  // Process P3
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['NAMENODE', 'PRIMARY', 'REPLICA', 'NODE'],
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
          { id: "RM", label: "Resource Manager", x: positions[0].x, y: positions[0].y, status: states[0], role: 'NAMENODE' },
          { id: "P1", label: "Process P1 (High)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'PRIMARY' },
          { id: "P2", label: "Process P2 (Med)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'REPLICA' },
          { id: "P3", label: "Process P3 (Low)", x: positions[3].x, y: positions[3].y, status: states[3], role: 'NODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        resInfo: `Allocation Resource: ${resourceType} | Total Pool: 16 Cores / 32GB RAM | Allocated: 12 Cores / 24GB RAM`
      });
    };

    // STEP 0: Pool Initial State
    pushStep({
      title: "Cluster Resource Pool Initialized",
      explanation: "Resource Manager monitors global pool: 16 CPU Cores, 32GB RAM, 10Gbps Network.",
      rule: "Capacity Tracking",
      why: "Centralized resource management prevents over-commitment and node memory exhaustion.",
      codeLine: 1,
      actionText: "Resource Manager pool ready",
      actor: "RM"
    });

    // STEP 1: Process P1 Allocation Request
    const req1Msg = [{ from: "P1", to: "RM", label: "REQ(4 Cores, 8GB RAM)", type: "request" }];
    pushStep({
      title: "Process P1 Requests Allocation",
      explanation: "Process P1 requests 4 CPU Cores and 8GB RAM for batch data analytics.",
      rule: "Allocation Request",
      why: "Processes register resource requirements prior to execution.",
      codeLine: 1,
      messages: req1Msg,
      states: ['NAMENODE', 'LEADER', 'REPLICA', 'NODE'],
      actionText: "P1 requested 4 Cores / 8GB RAM",
      actor: "P1",
      target: "RM"
    });

    // STEP 2: Allocation Granted to P1
    const grant1Msg = [{ from: "RM", to: "P1", label: "GRANT(4 Cores, 8GB RAM)", type: "response" }];
    pushStep({
      title: "Resource Manager Grants Allocation to P1",
      explanation: "Resource Manager verifies pool availability (16 > 4) and binds resources to P1.",
      rule: "Grant Execution",
      why: "Pool available capacity updated to 12 Cores / 24GB RAM.",
      codeLine: 3,
      messages: grant1Msg,
      states: ['LEADER', 'LEADER', 'REPLICA', 'NODE'],
      actionText: "Resource Manager granted allocation to P1",
      actor: "RM",
      target: "P1"
    });

    return stepList;
  }, [resourceType]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Distributed Resource Allocation Manager
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.resInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["RM", "P1"], ["RM", "P2"], ["RM", "P3"]]}
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
          <CodePanel codeLines={RESOURCE_ALLOCATION_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Resource Pool Settings
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Target Resource Category:</label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="CPU_RAM">CPU Cores & RAM Allocation</option>
                <option value="DISK_STORAGE">Disk Storage Allocation</option>
                <option value="NETWORK_BW">Network Bandwidth Allocation</option>
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
