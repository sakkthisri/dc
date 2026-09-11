import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const SERVERLESS_PSEUDOCODE = [
  "// Serverless FaaS Function Scaling & Mobile Cellular Handoff",
  "1. HTTP Event Trigger: API Gateway receives POST /api/order",
  "2. Cold Start vs Warm Execution:",
  "   - Cold Start: Spin up container, initialize runtime (Latency ~500ms)",
  "   - Warm Execution: Reuse existing idle container (Latency ~10ms)",
  "3. Mobile Cellular Handoff:",
  "   - Mobile Client moves out of range of Tower A -> Handoff seamlessly to Tower B"
];

export function ServerlessMobileVisualizer() {
  const [executionState, setExecutionState] = useState("COLD_START"); // "COLD_START" vs "WARM"

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 180 }, // Client / Mobile Device
      { x: 300, y: 100 }, // API Gateway / Cell Tower A
      { x: 300, y: 260 }, // FaaS Container / Cell Tower B
      { x: 520, y: 180 }  // Managed Database
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['PRIMARY', 'ROUTER', 'LEADER', 'NAMENODE'],
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
          { id: "Client", label: "Mobile Client", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "Gateway", label: "API Gateway", x: positions[1].x, y: positions[1].y, status: states[1], role: 'ROUTER' },
          { id: "FaaS", label: executionState === "COLD_START" ? "FaaS Instance (Cold 500ms)" : "FaaS Instance (Warm 10ms)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'LEADER' },
          { id: "DB", label: "Managed Database", x: positions[3].x, y: positions[3].y, status: states[3], role: 'NAMENODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        srvInfo: `Execution Type: ${executionState} | Runtime Init: ${executionState === 'COLD_START' ? '500ms (Container Initialization)' : '0ms (Reused Warm Instance)'}`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "Serverless Architecture Initialized",
      explanation: `System operating in ${executionState} mode. Serverless functions scale down to 0 when idle.`,
      rule: "Pay-Per-Execution Model",
      why: "Serverless eliminates infrastructure management and idle server billing costs.",
      codeLine: 1,
      actionText: "API Gateway listening for event triggers",
      actor: "Gateway"
    });

    // STEP 1: Event Trigger
    const trigMsg = [{ from: "Client", to: "Gateway", label: "POST /api/order", type: "request" }];
    pushStep({
      title: "API Gateway Receives Event Trigger",
      explanation: "Client sends HTTP POST request. Gateway matches route to Serverless Function handler.",
      rule: "Event-Driven Trigger",
      why: "Events trigger short-lived ephemeral container execution on demand.",
      codeLine: 1,
      messages: trigMsg,
      states: ['PRIMARY', 'LEADER', 'LEADER', 'NAMENODE'],
      actionText: "Gateway routed POST /api/order to FaaS Function",
      actor: "Client",
      target: "Gateway"
    });

    if (executionState === "COLD_START") {
      const coldMsg = [{ from: "Gateway", to: "FaaS", label: "Spin up Container (500ms)", type: "request" }];
      pushStep({
        title: "Cold Start: Container Initialization (500ms)",
        explanation: "No active warm container instance exists. FaaS platform downloads image, provisions container, and starts language runtime (500ms overhead).",
        rule: "Cold Start Penalty",
        why: "Occurs when scaling up from zero or receiving concurrent requests exceeding warm capacity.",
        codeLine: 2,
        messages: coldMsg,
        states: ['PRIMARY', 'ROUTER', 'PROMISE', 'NAMENODE'],
        actionText: "FaaS platform initialized new container instance (500ms)",
        actor: "Gateway",
        target: "FaaS"
      });
    } else {
      const warmMsg = [{ from: "Gateway", to: "FaaS", label: "Invoke Warm Instance (10ms)", type: "request" }];
      pushStep({
        title: "Warm Execution: Reusing Active Container (10ms)",
        explanation: "FaaS platform reuses existing warm container instance. Execution starts immediately with zero initialization overhead (10ms).",
        rule: "Warm Reuse",
        why: "Warm instances remain active for ~15 minutes post-execution to handle burst traffic.",
        codeLine: 3,
        messages: warmMsg,
        states: ['PRIMARY', 'ROUTER', 'LEADER', 'NAMENODE'],
        actionText: "Warm container invoked instantly (10ms latency)",
        actor: "Gateway",
        target: "FaaS"
      });
    }

    return stepList;
  }, [executionState]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Serverless Function Execution & Cold Start Visualizer
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.srvInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Client", "Gateway"], ["Gateway", "FaaS"], ["FaaS", "DB"]]}
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
          <CodePanel codeLines={SERVERLESS_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Invocation Instance State
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Instance State:</label>
              <select
                value={executionState}
                onChange={(e) => setExecutionState(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="COLD_START">Cold Start (Container Initialization Penalty ~500ms)</option>
                <option value="WARM">Warm Execution (Container Reused ~10ms)</option>
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
