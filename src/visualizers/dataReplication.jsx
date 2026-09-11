import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const DATA_REPLICATION_PSEUDOCODE = [
  "// Multi-Master / Master-Slave Database Data Replication",
  "1. Master Node receives Write transaction T1",
  "2. Master appends write to local binary log (binlog)",
  "3. Async Replication Stream:",
  "   - Master streams binlog events to Read Replicas (Replica 1, Replica 2)",
  "   - Replicas apply binlog events to local database engine",
  "4. Replication Lag Monitoring:",
  "   - Replica 2 experiences 500ms network lag -> temporary stale read window",
  "   - Replicas catch up & align log sequence numbers (LSN)"
];

export function DataReplicationVisualizer() {
  const [lagSimulated, setLagSimulated] = useState(true);

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 180 }, // Primary Database
      { x: 340, y: 100 }, // Replica 1 (Low Lag)
      { x: 340, y: 260 }  // Replica 2 (High Lag)
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['PRIMARY', 'LEADER', 'REPLICA'],
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
          { id: "Primary", label: "Primary DB (Binlog LSN=500)", x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "Rep1", label: "Replica 1 (LSN=500)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'LEADER' },
          { id: "Rep2", label: lagSimulated ? "Replica 2 (Lag LSN=480)" : "Replica 2 (LSN=500)", x: positions[2].x, y: positions[2].y, status: states[2], role: lagSimulated ? 'CRASHED' : 'REPLICA' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        repInfo: `Primary LSN: 500 | Replica 1 Lag: 0ms | Replica 2 Lag: ${lagSimulated ? '500ms (Stale Window)' : '0ms'}`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "Data Replication Pipeline Active",
      explanation: "Primary Database processes incoming transactional writes and maintains binary change log (binlog).",
      rule: "Binlog Streaming",
      why: "Change data capture (CDC) streaming allows replicas to stay synchronized asynchronously.",
      codeLine: 1,
      actionText: "Primary database streaming binlog to Replicas",
      actor: "Primary"
    });

    // STEP 1: Binlog Stream
    const streamMsgs = [
      { from: "Primary", to: "Rep1", label: "Binlog LSN=500", type: "request" },
      { from: "Primary", to: "Rep2", label: lagSimulated ? "Binlog (Delayed)" : "Binlog LSN=500", type: "request" }
    ];

    pushStep({
      title: "Binlog Event Streaming to Replicas",
      explanation: lagSimulated
        ? "Primary streams binlog events. Replica 1 applies update immediately (LSN=500). Replica 2 experiences network delay (LSN=480)."
        : "Primary streams binlog events. Both Replica 1 and Replica 2 apply updates synchronously (LSN=500).",
      rule: "Replication Lag",
      why: "Network congestion or heavy read loads on replicas create replication lag windows.",
      codeLine: 3,
      messages: streamMsgs,
      states: ['PRIMARY', 'LEADER', lagSimulated ? 'PROMISE' : 'LEADER'],
      actionText: lagSimulated ? "Replica 2 lagging behind Primary LSN" : "Both replicas synchronized to LSN=500",
      actor: "Primary",
      target: "Replicas"
    });

    return stepList;
  }, [lagSimulated]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Database Data Replication & Binlog Lag Monitoring
                </h3>
                <p className="text-[11px] text-green-400 font-mono mt-0.5">
                  {sim.activeState.repInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Primary", "Rep1"], ["Primary", "Rep2"]]}
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
          <CodePanel codeLines={DATA_REPLICATION_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Replication Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Replica Lag Simulation:</label>
              <button
                onClick={() => setLagSimulated(!lagSimulated)}
                className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                  lagSimulated
                    ? "bg-amber-600/30 border-amber-500 text-amber-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {lagSimulated ? "Simulating Replica 2 Network Lag (LSN 480 < 500)" : "No Replication Lag (In-Sync)"}
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
