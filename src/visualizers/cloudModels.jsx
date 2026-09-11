import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const CLOUD_PSEUDOCODE = [
  "// Cloud Computing Service Models & Deployment Stack",
  "1. IaaS (Infrastructure as a Service):",
  "   - Cloud Provider manages: Data Centers, Hardware, Virtualization",
  "   - Customer manages: OS, Runtimes, Middleware, Applications",
  "2. PaaS (Platform as a Service):",
  "   - Cloud Provider manages: Infrastructure, OS, Runtimes, Database Engine",
  "   - Customer manages: Application Code & Data",
  "3. SaaS (Software as a Service):",
  "   - Cloud Provider manages: Entire application stack end-to-end"
];

export function CloudModelsVisualizer() {
  const [serviceModel, setServiceModel] = useState("IaaS"); // "IaaS", "PaaS", "SaaS"

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 180 }, // Customer Management Layer
      { x: 320, y: 100 }, // Managed App Runtime
      { x: 320, y: 260 }, // Cloud Provider IaaS
      { x: 540, y: 180 }  // User Client
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['PRIMARY', 'ROUTER', 'NAMENODE', 'NODE'],
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
          { id: "Cust", label: serviceModel === "SaaS" ? "End User" : "Customer Admin", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "Runtime", label: "Managed Runtime (PaaS)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'ROUTER' },
          { id: "Infra", label: "Cloud Hardware (IaaS)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'NAMENODE' },
          { id: "App", label: "SaaS App", x: positions[3].x, y: positions[3].y, status: states[3], role: 'LEADER' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        cloudInfo: `Service Model: ${serviceModel} | Managed by Provider: ${serviceModel === 'IaaS' ? 'Hardware & Hypervisor' : serviceModel === 'PaaS' ? 'Hardware, OS & Runtimes' : 'Entire Stack'}`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: `${serviceModel} Stack Responsibility Initialized`,
      explanation: `Configured Cloud Model: ${serviceModel}. Demonstrating boundaries between Customer responsibility vs Provider management.`,
      rule: "Shared Responsibility Model",
      why: "Cloud computing service models dictate operational overhead and control granularities.",
      codeLine: 1,
      actionText: `${serviceModel} cloud stack active`,
      actor: "Cust"
    });

    // STEP 1: Provisioning Workflow
    const provMsg = [{ from: "Cust", to: serviceModel === "IaaS" ? "Infra" : serviceModel === "PaaS" ? "Runtime" : "App", label: `Provision (${serviceModel})`, type: "request" }];
    pushStep({
      title: `Provisioning Resources on ${serviceModel}`,
      explanation: serviceModel === "IaaS"
        ? "Customer provisions Virtual Machines (AWS EC2 / GCP Compute Engine) and installs custom OS images."
        : serviceModel === "PaaS"
        ? "Customer deploys application code directly onto managed runtime platform (Heroku / Firebase App Hosting)."
        : "Customer accesses fully managed web application over browser (Google Workspace / Salesforce).",
      rule: `${serviceModel} Provisioning`,
      why: "Higher abstraction layers accelerate development velocity by delegating infrastructure maintenance.",
      codeLine: serviceModel === "IaaS" ? 2 : serviceModel === "PaaS" ? 6 : 9,
      messages: provMsg,
      states: ['LEADER', 'ROUTER', 'NAMENODE', 'LEADER'],
      actionText: `Resources provisioned via ${serviceModel}`,
      actor: "Cust"
    });

    return stepList;
  }, [serviceModel]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Cloud Computing Service Models (IaaS / PaaS / SaaS)
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.cloudInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Cust", "Runtime"], ["Cust", "Infra"], ["Runtime", "App"]]}
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
          <CodePanel codeLines={CLOUD_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Cloud Service Model Selector
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Service Model:</label>
              <select
                value={serviceModel}
                onChange={(e) => setServiceModel(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="IaaS">IaaS (Infrastructure as a Service - Raw VMs)</option>
                <option value="PaaS">PaaS (Platform as a Service - Managed App Runtimes)</option>
                <option value="SaaS">SaaS (Software as a Service - Fully Managed Apps)</option>
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
