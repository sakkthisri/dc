import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const DOCKER_PSEUDOCODE = [
  "// Containerization & Docker Lifecycle",
  "1. Dockerfile Definition:",
  "   FROM node:18-alpine -> COPY . . -> RUN npm build -> CMD node server.js",
  "2. Image Build Phase:",
  "   - docker build -t app:v1 . (Creates immutable read-only image layers)",
  "3. Container Instantiation:",
  "   - docker run -d -p 8080:8080 app:v1",
  "   - Shares Host Kernel (lightweight 50MB RAM footprint vs 2GB Hypervisor VM)"
];

export function ContainerizationDockerVisualizer() {
  const [containerCount, setContainerCount] = useState(3);

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 180 }, // Docker Host Daemon
      { x: 300, y: 100 }, // Container 1
      { x: 300, y: 180 }, // Container 2
      { x: 300, y: 260 }, // Container 3
      { x: 520, y: 180 }  // Docker Registry
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['ROUTER', 'LEADER', 'LEADER', 'LEADER', 'NAMENODE'],
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
          { id: "Host", label: "Docker Engine (Host Kernel)", x: positions[0].x, y: positions[0].y, status: states[0], role: 'ROUTER' },
          { id: "C1", label: "Container 1 (Port 8081)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'LEADER' },
          { id: "C2", label: "Container 2 (Port 8082)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'LEADER' },
          { id: "C3", label: "Container 3 (Port 8083)", x: positions[3].x, y: positions[3].y, status: containerCount >= 3 ? states[3] : 'CRASHED', role: 'LEADER' },
          { id: "Reg", label: "Docker Hub Registry", x: positions[4].x, y: positions[4].y, status: states[4], role: 'NAMENODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        dockerInfo: `Containers Running: ${containerCount} | Image: app:v1 (Alpine) | Overhead: Shared Host Kernel (Fast startup ~100ms)`
      });
    };

    // STEP 0: Docker Engine Initialized
    pushStep({
      title: "Docker Daemon & Container Engine Ready",
      explanation: "Docker Engine active on Host Linux Kernel. Image app:v1 ready in Docker Registry.",
      rule: "Container Architecture",
      why: "Containers isolate application processes using Linux namespaces and cgroups while sharing the underlying host OS kernel.",
      codeLine: 1,
      actionText: "Docker daemon listening on unix:///var/run/docker.sock",
      actor: "Host"
    });

    // STEP 1: Image Pull
    const pullMsg = [{ from: "Reg", to: "Host", label: "docker pull app:v1", type: "response" }];
    pushStep({
      title: "Pull Immutable Read-Only Image Layers",
      explanation: "Docker Daemon pulls image layers (base OS, runtime, app code) from Docker Hub Registry.",
      rule: "Layer Copy-on-Write",
      why: "Read-only image layers are shared across containers to save disk space.",
      codeLine: 2,
      messages: pullMsg,
      states: ['ROUTER', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'LEADER'],
      actionText: "Image layers app:v1 cached locally",
      actor: "Reg",
      target: "Host"
    });

    // STEP 2: Container Instantiation
    const runMsgs = [
      { from: "Host", to: "C1", label: "docker run (Port 8081)", type: "request" },
      { from: "Host", to: "C2", label: "docker run (Port 8082)", type: "request" }
    ];
    if (containerCount >= 3) {
      runMsgs.push({ from: "Host", to: "C3", label: "docker run (Port 8083)", type: "request" });
    }

    pushStep({
      title: `Instantiating ${containerCount} Lightweight Container Instances`,
      explanation: `Docker Engine creates ${containerCount} isolated container instances from app:v1 image.`,
      rule: "Container Isolation",
      why: "Containerization boots in milliseconds with megabytes of RAM overhead compared to gigabyte Virtual Machines running full guest OS instances.",
      codeLine: 3,
      messages: runMsgs,
      states: ['LEADER', 'LEADER', 'LEADER', 'LEADER', 'NAMENODE'],
      actionText: `Started ${containerCount} container instances in ~100ms`,
      actor: "Host",
      target: "Containers"
    });

    return stepList;
  }, [containerCount]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Docker Containerization & Image Instantiation Pipeline
                </h3>
                <p className="text-[11px] text-blue-400 font-mono mt-0.5">
                  {sim.activeState.dockerInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Host", "C1"], ["Host", "C2"], ["Host", "C3"], ["Reg", "Host"]]}
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
          <CodePanel codeLines={DOCKER_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Container Instance Controls
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Container Replica Count:</label>
              <select
                value={containerCount}
                onChange={(e) => setContainerCount(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value={2}>2 Containers Running</option>
                <option value={3}>3 Containers Running</option>
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
