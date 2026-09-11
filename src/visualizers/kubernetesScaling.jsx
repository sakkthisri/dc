import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const K8S_PSEUDOCODE = [
  "// Kubernetes Orchestration: HPA Autoscaling & Self-Healing",
  "1. Control Plane Reconciliation Loop (Every 15s):",
  "   - Desired Replicas: Deployment.spec.replicas = 2",
  "   - Actual Replicas: count(healthy Pods) = 2",
  "2. Horizontal Pod Autoscaler (HPA):",
  "   - Collect CPU metrics from Metrics Server: average CPU = 85% (Target = 50%)",
  "   - Calculate desiredReplicas = ceil(2 * 85 / 50) = 4",
  "   - Kube-API updates Deployment spec to replicas = 4",
  "3. Kube-Scheduler places new Pod_3 & Pod_4 on Worker Node 2",
  "4. Self-Healing on Pod / Node Crash:",
  "   - Pod_2 crashes on Worker Node 1",
  "   - ReplicaSet Controller detects Actual (3) < Desired (4)",
  "   - Kube-Scheduler automatically provisions replacement Pod_5"
];

export function KubernetesScalingVisualizer() {
  const [cpuLoad, setCpuLoad] = useState(85); // %
  const [simulateCrash, setSimulateCrash] = useState(true);

  const steps = useMemo(() => {
    const positions = [
      { x: 320, y: 70 },  // Control Plane (API Server / Controller Manager / Scheduler / HPA)
      { x: 120, y: 190 }, // Worker Node 1 (Pod 1, Pod 2)
      { x: 520, y: 190 }, // Worker Node 2 (Pod 3, Pod 4)
      { x: 320, y: 300 }  // Ingress Load Balancer
    ];

    const stepList = [];
    const recordedEvents = [];
    const isAutoscalingTriggered = cpuLoad > 50;
    const targetReplicas = isAutoscalingTriggered ? 4 : 2;

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
      messages = [],
      actualCount = 2,
      actionText = '',
      actor = '',
      target = ''
    }) => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: actor,
          to: target,
          type: actionText.includes("Crash") ? "CRASH" : actionText.includes("HPA") || actionText.includes("Scale") ? "CONSENSUS" : "SYSTEM"
        });
      }

      stepList.push({
        nodes: [
          { id: "ControlPlane", label: "Control Plane", x: positions[0].x, y: positions[0].y, status: states[0], role: 'NAMENODE' },
          { id: "Worker1", label: "Worker Node 1", x: positions[1].x, y: positions[1].y, status: states[1], role: 'DATANODE' },
          { id: "Worker2", label: "Worker Node 2", x: positions[2].x, y: positions[2].y, status: states[2], role: 'DATANODE' },
          { id: "Ingress", label: "Ingress Router", x: positions[3].x, y: positions[3].y, status: states[3], role: 'ROUTER' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        k8sInfo: `CPU Load: ${cpuLoad}% (Target 50%) | Desired Replicas: ${targetReplicas} | Actual Replicas: ${actualCount}`
      });
    };

    // STEP 0: Initial Deployment State
    pushStep({
      title: "Kubernetes Cluster Initial State",
      explanation: "Control Plane manages 2 worker nodes. Deployment configured with replicas: 2 (Pod 1 on Worker 1, Pod 2 on Worker 1).",
      rule: "Kubernetes Declarative State",
      why: "Kubernetes operates via continuous reconciliation loops to align actual cluster state with target declarative configuration.",
      codeLine: 1,
      actualCount: 2,
      actionText: "Deployment running with 2 replicas",
      actor: "ControlPlane"
    });

    if (isAutoscalingTriggered) {
      // STEP 1: Metrics Spike & HPA Autoscaling
      const hpaMsg = [{ from: "Worker1", to: "ControlPlane", label: `Metrics CPU ${cpuLoad}%`, type: "request" }];
      pushStep({
        title: `HPA Metrics Spike Detected (CPU = ${cpuLoad}%)`,
        explanation: `Metrics Server reports average CPU usage (${cpuLoad}%) exceeding target (50%). Horizontal Pod Autoscaler calculates target replicas = 4.`,
        rule: "Horizontal Pod Autoscaling",
        why: "HPA scales pod replicas dynamically in response to real-time workload traffic demand.",
        codeLine: 2,
        messages: hpaMsg,
        states: ['LEADER', 'PROMISE', 'ACTIVE', 'ACTIVE'],
        actualCount: 2,
        actionText: `HPA triggered scaling from 2 -> 4 replicas (CPU ${cpuLoad}%)`,
        actor: "HPA",
        target: "ControlPlane"
      });

      // STEP 2: Scheduling New Pods
      const schedMsg = [{ from: "ControlPlane", to: "Worker2", label: "Schedule Pod 3 & Pod 4", type: "request" }];
      pushStep({
        title: "Kube-Scheduler Provisions Pod 3 & Pod 4 on Worker 2",
        explanation: "Kube-Scheduler evaluates node capacity and binds Pod 3 & Pod 4 to Worker Node 2.",
        rule: "Pod Scheduling",
        why: "Scheduler selects optimal worker nodes based on resource requests, taints, and node affinity rules.",
        codeLine: 3,
        messages: schedMsg,
        states: ['ACTIVE', 'ACTIVE', 'LEADER', 'ACTIVE'],
        actualCount: 4,
        actionText: "Kube-Scheduler scheduled Pod 3 & Pod 4 to Worker Node 2",
        actor: "KubeScheduler",
        target: "Worker 2"
      });

      // STEP 3: Ingress Endpoint Update
      const ingressMsg = [{ from: "Ingress", to: "Worker2", label: "Route Traffic to Pod 3/4", type: "response" }];
      pushStep({
        title: "Ingress Controller & Load Balancer Endpoint Update",
        explanation: "Kube-Proxy and Ingress Controller update EndpointSlices, routing web traffic across all 4 Pods on Worker 1 and Worker 2.",
        rule: "Ingress Load Balancing",
        why: "Automated endpoint routing balances client traffic seamlessly across newly scaled pod instances.",
        codeLine: 3,
        messages: ingressMsg,
        states: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'LEADER'],
        actualCount: 4,
        actionText: "Ingress endpoints updated across 4 active Pods",
        actor: "IngressController"
      });

      if (simulateCrash) {
        // STEP 4: Pod Failure Injection
        pushStep({
          title: "Pod Failure Injection: Pod 2 Crashes on Worker 1",
          explanation: "Pod 2 encounters an unhandled runtime error and crashes. Replica count drops to Actual (3) < Desired (4).",
          rule: "Pod Failure Detection",
          why: "Kubelet health probes detect pod container crash and notify the Control Plane ReplicaSet controller.",
          codeLine: 4,
          states: ['ACTIVE', 'CRASHED', 'ACTIVE', 'ACTIVE'],
          actualCount: 3,
          actionText: "Pod 2 crashed on Worker 1! Actual (3) < Desired (4)",
          actor: "Worker 1"
        });

        // STEP 5: Self-Healing Reconciliation
        const healMsg = [{ from: "ControlPlane", to: "Worker2", label: "Provision Replacement Pod 5", type: "request" }];
        pushStep({
          title: "Self-Healing Triggered: Replacement Pod 5 Provisioned",
          explanation: "ReplicaSet Controller detects state mismatch (Actual 3 < Desired 4). Kube-Scheduler automatically provisions replacement Pod 5 on Worker Node 2!",
          rule: "Self-Healing Reconciliation",
          why: "Kubernetes automatically replaces failed or evicted pods to guarantee persistent high availability.",
          codeLine: 4,
          messages: healMsg,
          states: ['LEADER', 'CRASHED', 'LEADER', 'ACTIVE'],
          actualCount: 4,
          actionText: "Self-healing provisioned replacement Pod 5 to restore desired 4 replicas",
          actor: "ReplicaSetController",
          target: "Worker 2"
        });
      }
    }

    return stepList;
  }, [cpuLoad, simulateCrash]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Kubernetes Cluster Topology (Control Plane - Worker Nodes - Ingress)
                </h3>
                <p className="text-[11px] text-blue-400 font-mono mt-0.5">
                  {sim.activeState.k8sInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["ControlPlane", "Worker1"], ["ControlPlane", "Worker2"], ["Ingress", "Worker1"], ["Ingress", "Worker2"]]}
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
          <CodePanel codeLines={K8S_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Kubernetes Load & Self-Healing Controls
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Simulated CPU Load:</span>
                <span className="font-mono text-cyan-400 font-bold">{cpuLoad}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={cpuLoad}
                onChange={(e) => setCpuLoad(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                <span>Low (20% - Normal)</span>
                <span>Spike (&gt;50% - HPA Scale)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Pod Self-Healing Scenario:</label>
              <button
                onClick={() => setSimulateCrash(!simulateCrash)}
                className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                  simulateCrash
                    ? "bg-red-600/30 border-red-500 text-red-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {simulateCrash
                  ? "Simulate Pod Failure (Demonstrate K8s Self-Healing)"
                  : "Normal Operation (No Pod Crash)"}
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
