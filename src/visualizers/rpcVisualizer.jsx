import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const PSEUDOCODE = [
  "// Remote Procedure Call (RPC) Execution Sequence",
  "",
  "1. Client App invokes remote procedure call: getUserData(id=42)",
  "2. Client Stub marshals parameters into byte packet [RPC_REQ: id=42]",
  "3. Transport layer sends packet over socket connection",
  "4. Server Stub receives byte packet over socket",
  "5. Server Stub unmarshals bytes into native function parameters",
  "6. Server Application executes local function getUserData(42)",
  "7. Server Stub marshals result {status: 200, user: 'Alice'}",
  "8. Transport sends response packet over network",
  "9. Client Stub receives response, unmarshals result, returns to Client App"
];

export function RpcVisualizer() {
  const [funcName, setFuncName] = useState('getUserData');
  const [paramVal, setParamVal] = useState('userId=42');

  const steps = useMemo(() => {
    const nodes = [
      { id: 'Client', label: 'Client App', x: 80, y: 170 },
      { id: 'ClientStub', label: 'Client Stub', x: 230, y: 170 },
      { id: 'Network', label: 'Network Channel', x: 380, y: 170 },
      { id: 'ServerStub', label: 'Server Stub', x: 530, y: 170 },
      { id: 'Server', label: 'Server App', x: 680, y: 170 }
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = (title, explanation, rule, why, codeLine, activeNodes = [], messages = [], actionText = "", actor = "", target = "") => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: actor,
          to: target,
          type: actionText.includes("Marshals") ? "LOCAL_EVENT" : actionText.includes("sends") ? "SEND_MESSAGE" : "RECEIVE_MESSAGE"
        });
      }

      stepList.push({
        nodes: nodes.map(n => ({
          ...n,
          status: activeNodes.includes(n.id) ? 'ACTIVE' : 'IDLE'
        })),
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine
      });
    };

    // STEP 0: Idle
    pushStep(
      "RPC Subsystem Ready",
      "Client App is ready to invoke procedure `" + funcName + "(" + paramVal + ")` on the remote server.",
      "RPC Abstraction Init",
      "RPC makes a remote function call appear syntactically identical to a local function call.",
      1,
      [],
      [],
      "RPC Subsystem initialized"
    );

    // STEP 1: Client Invokes RPC
    pushStep(
      "1. Client App Invokes `" + funcName + "(" + paramVal + ")`",
      "Client App calls local interface stub as if it were a local function call.",
      "result = " + funcName + "(" + paramVal + ")",
      "Client thread blocks and delegates serialization to the Client Stub.",
      1,
      ['Client', 'ClientStub'],
      [{ id: 'r1', from: 'Client', to: 'ClientStub', label: 'Call', progress: 0.8 }],
      "Client App calls stub function " + funcName,
      "Client",
      "ClientStub"
    );

    // STEP 2: Client Stub Marshals Parameters
    pushStep(
      "2. Client Stub Marshals Function & Parameters",
      "Client Stub serializes method name `" + funcName + "` and args `" + paramVal + "` into binary wire format.",
      "wireData = Marshal(" + funcName + ", " + paramVal + ")",
      "Marshaling converts language-specific data structures into architecture-independent byte streams.",
      2,
      ['ClientStub'],
      [],
      "Client Stub marshals arguments into binary wire format",
      "ClientStub"
    );

    // STEP 3: Client Stub Sends Request Packet Across Network
    pushStep(
      "3. Transport Layer Transmits Request Packet",
      "Client Stub writes serialized request buffer over TCP/IP socket network channel.",
      "Socket.send(wireData)",
      "Request traverses routers and switches across the network.",
      3,
      ['ClientStub', 'Network', 'ServerStub'],
      [{ id: 'r2', from: 'ClientStub', to: 'ServerStub', label: 'RPC_REQ', type: 'ELECTION', progress: 0.5 }],
      "Client Stub transmits RPC_REQ packet across network",
      "ClientStub",
      "ServerStub"
    );

    // STEP 4: Server Stub Receives & Unmarshals
    pushStep(
      "4. Server Stub Receives & Unmarshals Request",
      "Server Stub receives byte stream and reconstructs procedure name `" + funcName + "` and argument `" + paramVal + "`.",
      "(fn, args) = Unmarshal(wireData)",
      "Unmarshaling deserializes network bytes back into native server memory objects.",
      5,
      ['ServerStub'],
      [{ id: 'r2', from: 'ClientStub', to: 'ServerStub', label: 'RPC_REQ', type: 'ELECTION', progress: 1.0, status: 'DELIVERED' }],
      "Server Stub unmarshals request arguments",
      "ServerStub"
    );

    // STEP 5: Server App Executes Function
    pushStep(
      "5. Server App Executes Remote Procedure",
      "Server application code executes `" + funcName + "(" + paramVal + ")` and returns result `{status: 200, data: 'OK'}`.",
      "result = ServerImpl." + funcName + "(args)",
      "The actual business logic executes on the server process.",
      6,
      ['ServerStub', 'Server'],
      [{ id: 'r3', from: 'ServerStub', to: 'Server', label: 'Exec', progress: 0.8 }],
      "Server App executes procedure and produces result",
      "Server"
    );

    // STEP 6: Server Stub Marshals Result & Sends Response
    pushStep(
      "6. Server Stub Marshals & Sends Response Packet",
      "Server Stub serializes return values and sends RPC_RESP back across network channel.",
      "send(Marshal(result))",
      "Response packet carries return values back to waiting client stub.",
      7,
      ['ServerStub', 'Network', 'ClientStub'],
      [{ id: 'r4', from: 'ServerStub', to: 'ClientStub', label: 'RPC_RESP', type: 'COORDINATOR', progress: 0.5 }],
      "Server Stub transmits RPC_RESP packet to Client Stub",
      "ServerStub",
      "ClientStub"
    );

    // STEP 7: Client Stub Receives & Returns to Client App
    pushStep(
      "7. Client Stub Unmarshals & Returns to Client App!",
      "Client Stub receives response packet, unmarshals result, unblocks client thread, and returns result to Client App.",
      "return Unmarshal(responseBytes)",
      "RPC lifecycle complete! Client receives result seamlessly as if local.",
      9,
      ['ClientStub', 'Client'],
      [{ id: 'r4', from: 'ServerStub', to: 'ClientStub', label: 'RPC_RESP', type: 'COORDINATOR', progress: 1.0, status: 'DELIVERED' }],
      "Client Stub unmarshals response and returns to Client App",
      "ClientStub",
      "Client"
    );

    return stepList;
  }, [funcName, paramVal]);

  const sim = useSimulation(steps);

  const rpcConnections = [
    { from: 'Client', to: 'ClientStub', directed: true },
    { from: 'ClientStub', to: 'Network', directed: true },
    { from: 'Network', to: 'ServerStub', directed: true },
    { from: 'ServerStub', to: 'Server', directed: true }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 light:border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                RPC Client-Server Stub Lifecycle Pipeline
              </h3>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60 light:border-gray-200">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={rpcConnections}
                showClock={false}
                width={740}
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
          <CodePanel codeLines={PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              RPC Function Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Remote Procedure Name:</label>
              <input
                type="text"
                value={funcName}
                onChange={(e) => setFuncName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Argument String:</label>
              <input
                type="text"
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
