import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { calculateLinearPositions } from '../utils/simulationUtils';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const PSEUDOCODE = [
  "// Inter-Process Communication (IPC) Message Passing",
  "",
  "1. Process A calls send(Process_B, message_payload)",
  "2. OS kernel copies message buffer to network socket queue",
  "3. Packet delivered across channel (Normal, Delayed, or Dropped)",
  "4. Process B calls receive(Process_A)",
  "5. Message payload copied into Process B memory space"
];

export function MessagePassingVisualizer() {
  const nodeCount = 3;
  const [sender, setSender] = useState('P1');
  const [receiver, setReceiver] = useState('P2');
  const [msgContent, setMsgContent] = useState('Hello World');
  const [deliveryMode, setDeliveryMode] = useState('NORMAL'); // 'NORMAL', 'DELAYED', 'DROPPED'

  const steps = useMemo(() => {
    const positions = calculateLinearPositions(nodeCount, 640, 320);
    const pNames = Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`);

    const stepList = [];
    const recordedEvents = [];

    const pushStep = (title, explanation, rule, why, codeLine, activeNodes = [], messages = [], actionText = "") => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: sender,
          to: receiver,
          type: deliveryMode === 'DROPPED' ? 'CRASH' : 'SEND_MESSAGE'
        });
      }

      stepList.push({
        nodes: pNames.map((name, idx) => ({
          id: name,
          label: name,
          x: positions[idx].x,
          y: positions[idx].y,
          status: activeNodes.includes(name) ? 'ACTIVE' : 'IDLE'
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

    // STEP 0: Playground Ready
    pushStep(
      "IPC Message Passing Playground",
      "Processes " + pNames.join(', ') + " ready for inter-process socket communication.",
      "Socket IPC Ready",
      "IPC primitives form the foundational layer for all high-level distributed protocols.",
      1,
      [],
      [],
      "Playground ready"
    );

    // STEP 1: Sender Prepares Message
    pushStep(
      sender + " Prepares Message Buffer: '" + msgContent + "'",
      sender + " constructs message payload '" + msgContent + "' addressed to " + receiver + ".",
      "buffer = create_payload('" + msgContent + "')",
      "Data buffers are allocated in user memory before system call invocation.",
      1,
      [sender],
      [],
      sender + " constructs payload '" + msgContent + "'"
    );

    // STEP 2: Message Transmitted on Network Channel
    const isDrop = deliveryMode === 'DROPPED';
    const isDelay = deliveryMode === 'DELAYED';

    pushStep(
      sender + " Transmits Message Packet to " + receiver,
      sender + " invokes send() system call. Packet travels across network channel (" + deliveryMode + " mode).",
      "send(" + receiver + ", payload, mode=" + deliveryMode + ")",
      isDrop ? "Network dropped the packet due to congestion/fault!" : isDelay ? "Network jitter caused propagation delay." : "Message traveling normally.",
      3,
      [sender, receiver],
      [{
        id: 'user_msg',
        from: sender,
        to: receiver,
        label: msgContent,
        progress: isDrop ? 0.4 : isDelay ? 0.3 : 0.6,
        status: isDrop ? 'DROPPED' : 'IN_FLIGHT'
      }],
      sender + " sends '" + msgContent + "' to " + receiver + " (" + deliveryMode + ")"
    );

    // STEP 3: Delivery / Result
    if (isDrop) {
      pushStep(
        "Packet Dropped by Network!",
        "Message '" + msgContent + "' failed to reach " + receiver + " due to simulated packet loss.",
        "Packet Loss Failure",
        "Unreliable network channels require higher-level retry/ACK protocols.",
        3,
        [sender],
        [{ id: 'user_msg', from: sender, to: receiver, label: 'DROPPED', progress: 0.4, status: 'DROPPED' }],
        "Packet dropped by network!"
      );
    } else {
      pushStep(
        receiver + " Receives Message & Copies into Memory Space!",
        receiver + " receives '" + msgContent + "' from " + sender + " and completes receive() call.",
        "receive(buffer) -> OK",
        "Data payload successfully transferred across process boundary.",
        5,
        [receiver],
        [{ id: 'user_msg', from: sender, to: receiver, label: msgContent, progress: 1.0, status: 'DELIVERED' }],
        receiver + " receives '" + msgContent + "' successfully!"
      );
    }

    return stepList;
  }, [nodeCount, sender, receiver, msgContent, deliveryMode]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 light:border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Interactive IPC Message Passing Playground
              </h3>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60 light:border-gray-200">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[]}
                showClock={false}
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
          <CodePanel codeLines={PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Send Custom Message
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Sender:</label>
                <select
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
                >
                  {Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Receiver:</label>
                <select
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
                >
                  {Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Payload Content:</label>
              <input
                type="text"
                value={msgContent}
                onChange={(e) => setMsgContent(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Network Mode:</label>
              <select
                value={deliveryMode}
                onChange={(e) => setDeliveryMode(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="NORMAL">Normal Delivery</option>
                <option value="DELAYED">Simulate Network Delay</option>
                <option value="DROPPED">Simulate Dropped Packet</option>
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
