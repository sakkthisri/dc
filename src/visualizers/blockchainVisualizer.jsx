import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const BLOCKCHAIN_PSEUDOCODE = [
  "// Educational Blockchain & Proof-of-Work Engine",
  "1. Create Transaction: Tx = { from: 'Alice', to: 'Bob', amount: 10 }",
  "2. Proof-of-Work Mining (Nonce Search):",
  "   - Find Nonce such that SHA256(PrevHash + TxData + Nonce) starts with '00'",
  "3. Block Generation:",
  "   - Block_#2 = { Index: 2, Nonce: 4821, PrevHash: '00a1f9...', Hash: '003b8e...' }",
  "4. Network Gossip & Validation:",
  "   - Broadcast Block_#2 to Nodes N1, N2, N3, N4",
  "   - Nodes verify Hash link & append Block to local Ledger"
];

export function BlockchainVisualizer() {
  const [tamperBlock, setTamperBlock] = useState(false);

  const steps = useMemo(() => {
    const positions = [
      { x: 120, y: 180 }, // Miner Node N1
      { x: 320, y: 100 }, // Node N2
      { x: 320, y: 260 }, // Node N3
      { x: 520, y: 180 }  // Node N4
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['PRIMARY', 'REPLICA', 'REPLICA', 'REPLICA'],
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
          type: actionText.includes("INVALID") ? "CRASH" : "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "N1", label: "Node N1 (Miner)", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "N2", label: "Node N2 (Validator)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'REPLICA' },
          { id: "N3", label: "Node N3 (Validator)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'REPLICA' },
          { id: "N4", label: "Node N4 (Validator)", x: positions[3].x, y: positions[3].y, status: states[3], role: 'REPLICA' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        chainInfo: `Chain Status: ${tamperBlock ? 'TAMPERED (Hash Mismatch!)' : 'VALID'} | Current Block #2 Hash: 003b8e... | Nonce: 4821`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "Blockchain Genesis Block #1 Initialized",
      explanation: "All nodes hold synchronized copies of Genesis Block #1 (Hash: 0000a1...).",
      rule: "Ledger Initialization",
      why: "Blockchains maintain immutability via cryptographic hash pointers linking sequential blocks.",
      codeLine: 1,
      actionText: "Genesis block #1 synchronized across nodes",
      actor: "N1"
    });

    // STEP 1: Transaction Creation & Mining
    pushStep({
      title: "Transaction Broadcast & Proof-of-Work Mining",
      explanation: "Miner N1 batches pending transactions and calculates SHA-256 hash by iterating Nonce values until Hash starts with '00'.",
      rule: "Proof-of-Work (PoW)",
      why: "PoW makes block creation computationally expensive, preventing spam and double-spend attacks.",
      codeLine: 2,
      states: ['LEADER', 'REPLICA', 'REPLICA', 'REPLICA'],
      actionText: "Miner N1 solved Proof-of-Work (Nonce 4821)",
      actor: "N1"
    });

    // STEP 2: Block Propagation
    const blockMsgs = [
      { from: "N1", to: "N2", label: "Block #2 (Hash: 003b8e)", type: "request" },
      { from: "N1", to: "N3", label: "Block #2 (Hash: 003b8e)", type: "request" }
    ];

    pushStep({
      title: "Block #2 Gossip Broadcast to Peer Nodes",
      explanation: "Miner N1 broadcasts newly mined Block #2 to network peers N2 and N3.",
      rule: "Peer-to-Peer Propagation",
      why: "Gossip protocol propagates newly mined blocks rapidly across peer-to-peer networks.",
      codeLine: 4,
      messages: blockMsgs,
      states: ['LEADER', 'PROMISE', 'PROMISE', 'REPLICA'],
      actionText: "N1 broadcasted Block #2 to N2 & N3",
      actor: "N1",
      target: "N2, N3"
    });

    if (tamperBlock) {
      // STEP 3: Tamper Detection
      pushStep({
        title: "TAMPER DETECTED! Hash Mismatch Rejected",
        explanation: "A malicious actor modified data inside Block #1. Hash calculation changes completely! Cryptographic link to Block #2 breaks; peer nodes REJECT invalid chain.",
        rule: "Immutability Rule",
        why: "Any data alteration changes the block hash, invalidating all subsequent hash pointers in the blockchain.",
        codeLine: 4,
        states: ['CRASHED', 'CRASHED', 'CRASHED', 'CRASHED'],
        actionText: "TAMPER DETECTED! Hash mismatch -> Chain REJECTED",
        actor: "Validator"
      });
    } else {
      // STEP 3: Successful Validation
      const validMsgs = [{ from: "N2", to: "N4", label: "Block #2 Validated", type: "response" }];
      pushStep({
        title: "Block #2 Verified & Appended to Local Ledgers",
        explanation: "Peer nodes verify SHA-256 hash pointer and append Block #2 to local immutable ledgers.",
        rule: "Chain Validation",
        why: "Consensus achieved across all nodes without a centralized master server.",
        codeLine: 4,
        messages: validMsgs,
        states: ['LEADER', 'LEADER', 'LEADER', 'LEADER'],
        actionText: "Block #2 verified and appended to all ledgers",
        actor: "N2",
        target: "N4"
      });
    }

    return stepList;
  }, [tamperBlock]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Blockchain Proof-of-Work & Hash Validation Engine
                </h3>
                <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                  {sim.activeState.chainInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["N1", "N2"], ["N1", "N3"], ["N2", "N4"], ["N3", "N4"]]}
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
          <CodePanel codeLines={BLOCKCHAIN_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Blockchain Security Tamper Injection
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Block Data Security State:</label>
              <button
                onClick={() => setTamperBlock(!tamperBlock)}
                className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                  tamperBlock
                    ? "bg-red-600/30 border-red-500 text-red-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {tamperBlock ? "Simulate Data Tamper (Invalidate Hash Link)" : "Block Data Untampered (Valid Chain)"}
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
