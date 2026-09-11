import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const DSM_PSEUDOCODE = [
  "// Distributed Shared Memory (DSM) Cache Coherence",
  "1. Read Operation:",
  "   - Node A reads Page P1: Cache Hit in local memory -> return value",
  "2. Write Operation & Invalidation Broadcast:",
  "   - Node A writes to Page P1 (Page P1 = 99)",
  "   - DSM Directory sends INVALIDATE(P1) to all nodes caching Page P1 (Node B, Node C)",
  "   - Node B & Node C evict/invalidate local cached Page P1",
  "3. Subsequent Read on Remote Node:",
  "   - Node B reads Page P1: Cache Miss -> fetches updated Page P1 from Node A"
];

export function DistributedSharedMemoryVisualizer() {
  const [writeVal, setWriteVal] = useState("99");

  const steps = useMemo(() => {
    const positions = [
      { x: 320, y: 80 },  // DSM Directory Master
      { x: 120, y: 260 }, // Node A (Writer)
      { x: 320, y: 260 }, // Node B (Reader)
      { x: 520, y: 260 }  // Node C (Reader)
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['NAMENODE', 'PRIMARY', 'REPLICA', 'REPLICA'],
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
          type: actionText.includes("INVALIDATE") ? "CRASH" : "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "Dir", label: "DSM Directory", x: positions[0].x, y: positions[0].y, status: states[0], role: 'NAMENODE' },
          { id: "NodeA", label: "Node A (Page P1=10)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'PRIMARY' },
          { id: "NodeB", label: "Node B (Page P1=10)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'REPLICA' },
          { id: "NodeC", label: "Node C (Page P1=10)", x: positions[3].x, y: positions[3].y, status: states[3], role: 'REPLICA' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        dsmInfo: `Page P1 Shared Memory | Write Value: ${writeVal} | Cache Coherence Protocol: Write-Invalidate`
      });
    };

    // STEP 0: Shared Cache State
    pushStep({
      title: "Shared Memory Directory Initialized",
      explanation: "Page P1 (value=10) cached across Node A, Node B, and Node C. DSM Directory tracks shared ownership.",
      rule: "DSM Shared State",
      why: "DSM gives cluster nodes the abstraction of a single unified virtual memory space over physical network channels.",
      codeLine: 1,
      actionText: "Page P1 cached across Node A, B, C",
      actor: "Directory"
    });

    // STEP 1: Write to Local Page
    const writeMsg = [{ from: "NodeA", to: "Dir", label: `Write P1 = ${writeVal}`, type: "request" }];
    pushStep({
      title: `Node A Mutates Page P1 = ${writeVal}`,
      explanation: `Node A updates local cache Page P1 to ${writeVal} and requests write permission from DSM Directory.`,
      rule: "Write Request",
      why: "Write operations must acquire exclusive page modification rights to enforce cache consistency.",
      codeLine: 2,
      messages: writeMsg,
      states: ['NAMENODE', 'LEADER', 'REPLICA', 'REPLICA'],
      actionText: `Node A updated local Page P1 = ${writeVal}`,
      actor: "Node A",
      target: "Directory"
    });

    // STEP 2: Directory Invalidation Broadcast
    const invMsgs = [
      { from: "Dir", to: "NodeB", label: "INVALIDATE(P1)", type: "request" },
      { from: "Dir", to: "NodeC", label: "INVALIDATE(P1)", type: "request" }
    ];

    pushStep({
      title: "DSM Directory Broadcasts Invalidation",
      explanation: "DSM Directory broadcasts INVALIDATE(P1) to Node B and Node C to flush stale cached copies.",
      rule: "Write-Invalidate Protocol",
      why: "Invalidating cached copies prevents other nodes from reading stale memory locations.",
      codeLine: 3,
      messages: invMsgs,
      states: ['LEADER', 'LEADER', 'CRASHED', 'CRASHED'],
      actionText: "Directory invalidated cached Page P1 on Node B & C",
      actor: "Directory",
      target: "Node B, C"
    });

    // STEP 3: Remote Node Fetch (Cache Miss)
    const fetchMsgs = [
      { from: "NodeB", to: "NodeA", label: "FETCH_PAGE(P1)", type: "request" },
      { from: "NodeA", to: "NodeB", label: `PAGE_DATA(${writeVal})`, type: "response" }
    ];

    pushStep({
      title: `Node B Read Request: Cache Miss -> Fetches P1=${writeVal} from Node A`,
      explanation: `Node B reads Page P1. Local cache is invalid (Cache Miss). Node B fetches updated Page P1=${writeVal} directly from Node A.`,
      rule: "Page Fault & Fetch",
      why: "Guarantees linearizable cache coherence across distributed virtual memory.",
      codeLine: 4,
      messages: fetchMsgs,
      states: ['NAMENODE', 'LEADER', 'LEADER', 'CRASHED'],
      actionText: `Node B fetched fresh Page P1=${writeVal} from Node A`,
      actor: "Node B",
      target: "Node A"
    });

    return stepList;
  }, [writeVal]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Distributed Shared Memory (DSM) Cache Coherence
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  {sim.activeState.dsmInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Dir", "NodeA"], ["Dir", "NodeB"], ["Dir", "NodeC"], ["NodeA", "NodeB"]]}
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
          <CodePanel codeLines={DSM_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              DSM Memory Controls
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Write Page Value (Node A):</label>
              <input
                type="number"
                value={writeVal}
                onChange={(e) => setWriteVal(e.target.value)}
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
