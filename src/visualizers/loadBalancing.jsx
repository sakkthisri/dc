import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const LOAD_BALANCING_PSEUDOCODE = [
  "// Load Balancing Routing Algorithms",
  "1. Round Robin: Send request i to Server (i mod N)",
  "2. Weighted Round Robin: Route requests according to server capacity weights (e.g. S1: 50%, S2: 30%, S3: 20%)",
  "3. Least Connections: Route incoming request to server with fewest active connections",
  "4. Random: Route request randomly across healthy backend servers",
  "5. Health Monitoring: Automatically divert traffic from failing backend servers"
];

export function LoadBalancingVisualizer() {
  const [algo, setAlgo] = useState("ROUND_ROBIN");

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 180 }, // Ingress Load Balancer
      { x: 400, y: 80 },  // Server 1
      { x: 400, y: 180 }, // Server 2
      { x: 400, y: 280 }  // Server 3
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['ROUTER', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
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
          { id: "LB", label: "Load Balancer", x: positions[0].x, y: positions[0].y, status: states[0], role: 'ROUTER' },
          { id: "S1", label: "Server 1 (Active: 12)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'PRIMARY' },
          { id: "S2", label: "Server 2 (Active: 4)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'REPLICA' },
          { id: "S3", label: "Server 3 (Active: 8)", x: positions[3].x, y: positions[3].y, status: states[3], role: 'NODE' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        lbInfo: `Algorithm: ${algo} | Active Servers: 3 | Distribution Target: Balanced Throughput`
      });
    };

    // STEP 0: Cluster Ready
    pushStep({
      title: "Load Balancer Routing Engine Ready",
      explanation: `Ingress Load Balancer initialized using ${algo} algorithm. Backend pool: Server 1, Server 2, Server 3.`,
      rule: "Load Balancing Architecture",
      why: "Load balancing distributes incoming traffic across multiple servers to prevent individual node saturation.",
      codeLine: 1,
      actionText: `Load Balancer active (${algo})`,
      actor: "LB"
    });

    // STEP 1: Request 1 Routing
    const req1Msg = [{ from: "LB", to: "S1", label: "Request #101", type: "request" }];
    pushStep({
      title: "Request #101 -> Routed to Server 1",
      explanation: algo === "LEAST_CONN"
        ? "Least Connections algorithm selects Server 2 (lowest active connections = 4)."
        : `Load Balancer routes Request #101 to Server 1 via ${algo}.`,
      rule: `${algo} Routing Rule`,
      why: "Ensures no single server bears excess connection burden.",
      codeLine: algo === "ROUND_ROBIN" ? 1 : 3,
      messages: req1Msg,
      states: ['ROUTER', 'LEADER', 'ACTIVE', 'ACTIVE'],
      actionText: "Request #101 routed to Server 1",
      actor: "LB",
      target: "S1"
    });

    // STEP 2: Request 2 Routing
    const req2Msg = [{ from: "LB", to: "S2", label: "Request #102", type: "request" }];
    pushStep({
      title: "Request #102 -> Routed to Server 2",
      explanation: `Load Balancer advances index and routes Request #102 to Server 2 via ${algo}.`,
      rule: "Sequential Distribution",
      why: "Evens out request load over consecutive time windows.",
      codeLine: 1,
      messages: req2Msg,
      states: ['ROUTER', 'ACTIVE', 'LEADER', 'ACTIVE'],
      actionText: "Request #102 routed to Server 2",
      actor: "LB",
      target: "S2"
    });

    // STEP 3: Request 3 Routing
    const req3Msg = [{ from: "LB", to: "S3", label: "Request #103", type: "request" }];
    pushStep({
      title: "Request #103 -> Routed to Server 3",
      explanation: `Load Balancer routes Request #103 to Server 3 via ${algo}.`,
      rule: "Pool Completion",
      why: "Completes one full rotation cycle across all backend instances.",
      codeLine: 1,
      messages: req3Msg,
      states: ['ROUTER', 'ACTIVE', 'ACTIVE', 'LEADER'],
      actionText: "Request #103 routed to Server 3",
      actor: "LB",
      target: "S3"
    });

    return stepList;
  }, [algo]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Load Balancer Traffic Distribution Engine
                </h3>
                <p className="text-[11px] text-green-400 font-mono mt-0.5">
                  {sim.activeState.lbInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["LB", "S1"], ["LB", "S2"], ["LB", "S3"]]}
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
          <CodePanel codeLines={LOAD_BALANCING_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Load Balancer Controls
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Routing Algorithm Strategy:</label>
              <select
                value={algo}
                onChange={(e) => setAlgo(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="ROUND_ROBIN">Round Robin (Equal Sequential Routing)</option>
                <option value="WEIGHTED">Weighted Round Robin (Capacity Weighted)</option>
                <option value="LEAST_CONN">Least Connections (Lowest Active Connections)</option>
                <option value="RANDOM">Random Selection</option>
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
