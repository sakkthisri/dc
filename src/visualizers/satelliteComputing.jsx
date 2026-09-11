import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const SATELLITE_PSEUDOCODE = [
  "// Satellite Communication & Orbital Delay Engine",
  "1. Orbit Classification & Distance:",
  "   - LEO (Low Earth Orbit): ~550km altitude -> Propagation Latency: ~25ms",
  "   - GEO (Geostationary Orbit): ~35,786km altitude -> Propagation Latency: ~600ms",
  "2. Uplink Transmission: Ground Station A transmits radio payload to Satellite",
  "3. Inter-Satellite Link (ISL) / Transponder Relay: Forward signal across space",
  "4. Downlink Transmission: Satellite transmits radio payload down to Ground Station B"
];

export function SatelliteComputingVisualizer() {
  const [orbitType, setOrbitType] = useState("LEO"); // "LEO" vs "GEO"

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 260 }, // Ground Station A
      { x: 320, y: 80 },  // Satellite (LEO or GEO)
      { x: 540, y: 260 }  // Ground Station B
    ];

    const stepList = [];
    const recordedEvents = [];
    const latency = orbitType === "LEO" ? "25ms" : "600ms";

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['PRIMARY', 'LEADER', 'NAMENODE'],
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
          { id: "GS_A", label: "Ground Station A", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "Sat", label: `Satellite (${orbitType} ${latency})`, x: positions[1].x, y: positions[1].y, status: states[1], role: 'LEADER' },
          { id: "GS_B", label: "Ground Station B", x: positions[2].x, y: positions[2].y, status: states[2], role: 'NAMENODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        satInfo: `Orbit: ${orbitType} | Distance: ${orbitType === 'LEEO' ? '550 km' : '35,786 km'} | One-Way Latency: ${latency}`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: `${orbitType} Satellite Network Initialized`,
      explanation: `System configured for ${orbitType} orbit (${orbitType === "LEO" ? "Low Earth Orbit 550km" : "Geostationary Orbit 35,786km"}). One-way propagation delay: ${latency}.`,
      rule: "Speed of Light Delay",
      why: "Radio signals travel at c = 300,000 km/s through vacuum, creating inherent physical latency over long orbital distances.",
      codeLine: 1,
      actionText: `Satellite network initialized in ${orbitType} orbit`,
      actor: "GS_A"
    });

    // STEP 1: Uplink Transmission
    const upMsg = [{ from: "GS_A", to: "Sat", label: `Uplink (${latency})`, type: "request" }];
    pushStep({
      title: `Phase 1: Uplink Transmission (${latency})`,
      explanation: `Ground Station A transmits radio payload uplink to ${orbitType} Satellite. Transmission time: ${latency}.`,
      rule: "Uplink Signal Path",
      why: "Higher altitude orbits (GEO) require exponentially larger propagation delays compared to LEO constellations.",
      codeLine: 2,
      messages: upMsg,
      states: ['PRIMARY', 'PROMISE', 'NAMENODE'],
      actionText: `Uplink signal transmitted to ${orbitType} Satellite`,
      actor: "GS_A",
      target: "Sat"
    });

    // STEP 2: Downlink Transmission
    const downMsg = [{ from: "Sat", to: "GS_B", label: `Downlink (${latency})`, type: "response" }];
    pushStep({
      title: `Phase 2: Downlink Transmission to Destination (${latency})`,
      explanation: `Satellite transponder relays signal and transmits downlink payload to Ground Station B. Total round-trip: ${orbitType === "LEO" ? "50ms" : "1200ms"}.`,
      rule: "Downlink Relay",
      why: "Completes orbital wireless communications link.",
      codeLine: 4,
      messages: downMsg,
      states: ['PRIMARY', 'LEADER', 'LEADER'],
      actionText: `Downlink signal received by Ground Station B (Total RTT: ${orbitType === "LEO" ? "50ms" : "1200ms"})`,
      actor: "Sat",
      target: "GS_B"
    });

    return stepList;
  }, [orbitType]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Satellite Communication & Orbital Delay Engine
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.satInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["GS_A", "Sat"], ["Sat", "GS_B"]]}
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
          <CodePanel codeLines={SATELLITE_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Orbital Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Orbital Type & Distance:</label>
              <select
                value={orbitType}
                onChange={(e) => setOrbitType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="LEO">LEO (Low Earth Orbit ~550km, ~25ms delay)</option>
                <option value="GEO">GEO (Geostationary Orbit ~35,786km, ~600ms delay)</option>
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
