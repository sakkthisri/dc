import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const EDGE_PSEUDOCODE = [
  "// Edge Computing & IoT Stream Processing Architecture",
  "1. IoT Sensor Telemetry Stream (100 events/sec):",
  "   - Sensors transmit raw temperature/vibration data stream",
  "2. Edge Node Processing (Local Fog Gateway):",
  "   - Filter noise & anomaly detection at local Edge Gateway (Latency: 5ms)",
  "3. Cloud Aggregation:",
  "   - Transmit aggregated summary metrics to Remote Cloud Data Center (Latency: 120ms)",
  "4. Trade-off Comparison:",
  "   - Edge Processing: Ultra-low latency (5ms), reduced WAN bandwidth requirement",
  "   - Cloud Processing: High compute capacity, higher WAN round-trip latency (120ms)"
];

export function EdgeIotVisualizer() {
  const [processingMode, setProcessingMode] = useState("EDGE"); // "EDGE" vs "CLOUD"

  const steps = useMemo(() => {
    const positions = [
      { x: 90, y: 180 },  // IoT Sensors
      { x: 300, y: 180 }, // Edge Fog Gateway
      { x: 550, y: 180 }  // Central Cloud Data Center
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['NODE', 'PRIMARY', 'NAMENODE'],
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
          { id: "Sensors", label: "IoT Sensors (100Hz)", x: positions[0].x, y: positions[0].y, status: states[0], role: 'NODE' },
          { id: "Edge", label: "Edge Gateway (5ms)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'PRIMARY' },
          { id: "Cloud", label: "Remote Cloud (120ms)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'NAMENODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        edgeInfo: `Processing Location: ${processingMode} | Latency: ${processingMode === 'EDGE' ? '5ms (Ultra-Fast)' : '120ms (Cloud Round-Trip)'}`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "IoT Edge/Cloud Topology Initialized",
      explanation: `Configured Processing Strategy: ${processingMode}. Sensor array streaming 100 telemetry events per second.`,
      rule: "Edge Computing Paradigm",
      why: "Edge computing pushes computation and data storage closer to sources of data generation.",
      codeLine: 1,
      actionText: "IoT sensor network streaming telemetry",
      actor: "Sensors"
    });

    if (processingMode === "EDGE") {
      const edgeMsg = [{ from: "Sensors", to: "Edge", label: "Telemetry Stream (5ms)", type: "request" }];
      pushStep({
        title: "Edge Node Processing: Local Real-Time Response (5ms)",
        explanation: "IoT sensors stream data to local Edge Gateway. Edge processes anomaly detection in 5ms without WAN traffic.",
        rule: "Edge Latency Optimization",
        why: "Ultra-low latency is required for autonomous driving, industrial robotics, and emergency shutdown triggers.",
        codeLine: 2,
        messages: edgeMsg,
        states: ['NODE', 'LEADER', 'NAMENODE'],
        actionText: "Edge Gateway processed telemetry locally in 5ms",
        actor: "Edge",
        target: "Sensors"
      });

      const cloudAggMsg = [{ from: "Edge", to: "Cloud", label: "Aggregated Summary (1h)", type: "request" }];
      pushStep({
        title: "Background Cloud Aggregation",
        explanation: "Edge Gateway sends compressed hourly aggregate summaries to the Cloud for long-term analytics storage.",
        rule: "Bandwidth Optimization",
        why: "Reduces cellular and WAN bandwidth consumption by up to 95%.",
        codeLine: 3,
        messages: cloudAggMsg,
        states: ['NODE', 'LEADER', 'LEADER'],
        actionText: "Edge Gateway sent compressed summary to Cloud",
        actor: "Edge",
        target: "Cloud"
      });
    } else {
      const cloudMsg = [{ from: "Sensors", to: "Cloud", label: "Raw Telemetry Stream (120ms)", type: "request" }];
      pushStep({
        title: "Cloud Processing: High Latency WAN Round-Trip (120ms)",
        explanation: "IoT sensors stream raw events directly across public internet WAN to distant Cloud Data Center.",
        rule: "Centralized Cloud Rule",
        why: "Cloud provides massive GPU/TPU compute power but incurs 120ms round-trip latency.",
        codeLine: 4,
        messages: cloudMsg,
        states: ['NODE', 'PRIMARY', 'LEADER'],
        actionText: "Raw telemetry processed in Cloud (120ms latency)",
        actor: "Sensors",
        target: "Cloud"
      });
    }

    return stepList;
  }, [processingMode]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Edge Computing vs Cloud IoT Data Processing
                </h3>
                <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                  {sim.activeState.edgeInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Sensors", "Edge"], ["Edge", "Cloud"]]}
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
          <CodePanel codeLines={EDGE_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Processing Strategy
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Compute Location:</label>
              <select
                value={processingMode}
                onChange={(e) => setProcessingMode(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="EDGE">Edge Processing (5ms Ultra-Low Latency)</option>
                <option value="CLOUD">Direct Cloud Processing (120ms WAN Latency)</option>
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
