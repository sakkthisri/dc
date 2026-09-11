import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const RMI_PSEUDOCODE = [
  "// Remote Method Invocation (RMI) Pipeline",
  "1. Client calls remote object method: service.compute(x=10)",
  "2. Client Stub marshals parameters into byte stream payload",
  "3. RMI Transport Layer sends network request to Remote Server",
  "4. Server Skeleton unmarshals parameters & invokes actual object method",
  "5. Remote Object executes logic -> returns result value (result=100)",
  "6. Server Skeleton marshals return value -> Transport sends reply",
  "7. Client Stub unmarshals return value & delivers result to Client"
];

export function RmiVisualizer() {
  const [paramVal, setParamVal] = useState("10");

  const steps = useMemo(() => {
    const positions = [
      { x: 90, y: 180 },  // Client App
      { x: 220, y: 180 }, // Client Stub
      { x: 360, y: 180 }, // RMI Registry / Network
      { x: 500, y: 180 }, // Server Skeleton
      { x: 620, y: 180 }  // Remote Object
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
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
          { id: "Client", label: "Client App", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "Stub", label: "Client Stub", x: positions[1].x, y: positions[1].y, status: states[1], role: 'NODE' },
          { id: "Network", label: "RMI Transport", x: positions[2].x, y: positions[2].y, status: states[2], role: 'ROUTER' },
          { id: "Skeleton", label: "Server Skeleton", x: positions[3].x, y: positions[3].y, status: states[3], role: 'NODE' },
          { id: "RemoteObj", label: "Remote Object", x: positions[4].x, y: positions[4].y, status: states[4], role: 'LEADER' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        rmiInfo: `Method: compute(${paramVal}) | Architecture: Client -> Stub -> Network -> Skeleton -> Remote Object`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "RMI Initialization",
      explanation: "Client holds a reference proxy (Stub) to a remote object running on a separate JVM.",
      rule: "RMI Proxy Pattern",
      why: "RMI abstracts location transparency so remote methods appear like local function calls.",
      codeLine: 1,
      actionText: `Client calls service.compute(${paramVal})`,
      actor: "Client"
    });

    // STEP 1: Stub Marshalling
    const stubMsg = [{ from: "Client", to: "Stub", label: `compute(${paramVal})`, type: "request" }];
    pushStep({
      title: "Parameter Marshalling",
      explanation: `Client passes parameter x=${paramVal} to Client Stub. Stub serializes method signature and arguments into binary payload.`,
      rule: "Marshalling",
      why: "Marshalling converts language objects into serialized byte streams suitable for network transit.",
      codeLine: 2,
      messages: stubMsg,
      states: ['ACTIVE', 'LEADER', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
      actionText: "Client Stub marshals parameters into byte stream",
      actor: "ClientStub",
      target: "Stub"
    });

    // STEP 2: Network Transport
    const netMsg = [{ from: "Stub", to: "Skeleton", label: `RMI_REQ(compute, arg=${paramVal})`, type: "request" }];
    pushStep({
      title: "Network Request Transit",
      explanation: "RMI Transport Layer transmits serialized request across socket connection to Server Skeleton.",
      rule: "Network Transit",
      why: "Transport layer handles TCP connection establishment and socket streaming.",
      codeLine: 3,
      messages: netMsg,
      states: ['ACTIVE', 'ACTIVE', 'PROMISE', 'ACTIVE', 'ACTIVE'],
      actionText: "RMI request transmitted over network to Server Skeleton",
      actor: "Transport",
      target: "Skeleton"
    });

    // STEP 3: Unmarshalling & Remote Execution
    const skelMsg = [{ from: "Skeleton", to: "RemoteObj", label: `invoke compute(${paramVal})`, type: "request" }];
    pushStep({
      title: "Unmarshalling & Execution",
      explanation: `Server Skeleton unmarshals parameter x=${paramVal} and invokes compute(${paramVal}) on the Remote Object.`,
      rule: "Remote Execution",
      why: "Skeleton handles server-side socket listening and object dispatching.",
      codeLine: 4,
      messages: skelMsg,
      states: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'LEADER', 'LEADER'],
      actionText: "Remote Object executed method -> computed result",
      actor: "RemoteObject",
      target: "RemoteObj"
    });

    // STEP 4: Return Value Response
    const returnVal = Number(paramVal) * Number(paramVal);
    const respMsg = [
      { from: "RemoteObj", to: "Skeleton", label: `return ${returnVal}`, type: "response" },
      { from: "Skeleton", to: "Stub", label: `RMI_RESP(${returnVal})`, type: "response" },
      { from: "Stub", to: "Client", label: `result = ${returnVal}`, type: "response" }
    ];

    pushStep({
      title: "Return Value Unmarshalled & Delivered",
      explanation: `Remote Object returns result=${returnVal}. Skeleton marshals return value, transport sends back, and Stub delivers value to Client.`,
      rule: "RMI Completion",
      why: "Complete bidirectional remote procedure call lifecycle executed seamlessly.",
      codeLine: 7,
      messages: respMsg,
      states: ['LEADER', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'LEADER'],
      actionText: `RMI call complete! Client received result=${returnVal}`,
      actor: "Client"
    });

    return stepList;
  }, [paramVal]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Java RMI / Remote Invocation Architecture
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.rmiInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Client", "Stub"], ["Stub", "Network"], ["Network", "Skeleton"], ["Skeleton", "RemoteObj"]]}
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
          <CodePanel codeLines={RMI_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Method Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Input Value (x):</label>
              <input
                type="number"
                value={paramVal}
                onChange={(e) => setParamVal(e.target.value)}
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
