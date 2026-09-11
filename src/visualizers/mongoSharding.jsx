import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const MONGO_PSEUDOCODE = [
  "// MongoDB Sharded Cluster Architecture",
  "1. Application submits query: db.users.find({ zipcode: 90210 })",
  "2. mongos Query Router fetches Shard Key Chunk Ranges from Config Servers:",
  "   - Chunk 1 [00000 .. 49999] -> Shard A",
  "   - Chunk 2 [50000 .. 99999] -> Shard B",
  "3. mongos routes query directly to Shard B (Targeted Routing)",
  "4. Chunk Splitting:",
  "   - When Chunk 1 size > 64MB, Config Server splits into Chunk 1a & Chunk 1b",
  "5. Balancer Migration:",
  "   - Balancer detects Chunk imbalance (Shard A: 8 chunks, Shard B: 2 chunks)",
  "   - Balancer background-migrates Chunk 1b from Shard A to Shard B"
];

export function MongoShardingVisualizer() {
  const [shardingStrategy, setShardingStrategy] = useState("RANGED"); // RANGED vs HASHED
  const [triggerBalancer, setTriggerBalancer] = useState(true);

  const steps = useMemo(() => {
    const positions = [
      { x: 320, y: 70 },  // mongos Query Router
      { x: 140, y: 150 }, // Config Servers
      { x: 180, y: 280 }, // Shard A (Replica Set)
      { x: 460, y: 280 }  // Shard B (Replica Set)
    ];

    const stepList = [];
    const recordedEvents = [];

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
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
          type: actionText.includes("Route") || actionText.includes("Migrate") ? "CONSENSUS" : "SYSTEM"
        });
      }

      stepList.push({
        nodes: [
          { id: "Router", label: "mongos Router", x: positions[0].x, y: positions[0].y, status: states[0], role: 'ROUTER' },
          { id: "Config", label: "Config Servers", x: positions[1].x, y: positions[1].y, status: states[1], role: 'CONFIG' },
          { id: "ShardA", label: "Shard A (Chunks 1..4)", x: positions[2].x, y: positions[2].y, status: states[2], role: 'SHARD' },
          { id: "ShardB", label: "Shard B (Chunks 5..8)", x: positions[3].x, y: positions[3].y, status: states[3], role: 'SHARD' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        mongoInfo: `Strategy: ${shardingStrategy} Sharding | Target Query: { zipcode: 90210 } | Balancer: ${triggerBalancer ? 'Active' : 'Disabled'}`
      });
    };

    // STEP 0: System Topology
    pushStep({
      title: "MongoDB Sharded Cluster Topology",
      explanation: "App sends requests to mongos router, which interfaces with Config Servers to determine document chunk locations.",
      rule: "Sharded Architecture",
      why: "Sharding horizontal scaling distributes data collections across multiple MongoDB Replica Sets.",
      codeLine: 1,
      actionText: "MongoDB Sharded Cluster initialized",
      actor: "Cluster"
    });

    // STEP 1: Query Submission & Metadata Lookup
    const metaMsgs = [
      { from: "Client", to: "Router", label: "find({ zipcode: 90210 })", type: "request" },
      { from: "Router", to: "Config", label: "Get Chunk Range Metadata", type: "request" }
    ];

    pushStep({
      title: "Query Submission & Config Metadata Lookup",
      explanation: `mongos router receives query for zipcode 90210. It queries Config Servers to match 90210 against shard key ranges.`,
      rule: "Routing Lookup",
      why: "Config Servers hold authoritative mapping of chunk ranges to target shards.",
      codeLine: 2,
      messages: metaMsgs,
      states: ['WAITING', 'PROMISE', 'ACTIVE', 'ACTIVE'],
      actionText: "mongos queries Config Server metadata catalog",
      actor: "mongos Router",
      target: "Config Servers"
    });

    // STEP 2: Targeted Query Routing
    const routeMsg = [{ from: "Router", to: "ShardB", label: "Query Shard B (zipcode 90210)", type: "request" }];
    pushStep({
      title: "Targeted Query Routing -> Shard B",
      explanation: "Config Server metadata confirms range [50000..99999] belongs to Shard B. mongos routes query directly to Shard B.",
      rule: "Targeted Routing",
      why: "Sharding prevents scatter-gather queries across the entire cluster by pinpointing target shards directly.",
      codeLine: 3,
      messages: routeMsg,
      states: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'LEADER'],
      actionText: "mongos routes query directly to Shard B",
      actor: "mongos Router",
      target: "Shard B"
    });

    // STEP 3: Chunk Splitting
    const splitMsgs = [{ from: "ShardA", to: "Config", label: "Split Chunk 1 (> 64MB)", type: "request" }];
    pushStep({
      title: "Chunk Splitting on Shard A",
      explanation: "Chunk 1 on Shard A grows past 64MB. Config Server splits Chunk 1 [0..49999] into Chunk 1a [0..24999] and Chunk 1b [25000..49999].",
      rule: "Auto Chunk Splitting",
      why: "Splitting maintains manageable chunk boundaries so data can be rebalanced smoothly across nodes.",
      codeLine: 4,
      messages: splitMsgs,
      states: ['ACTIVE', 'PROMISE', 'PROMISE', 'ACTIVE'],
      actionText: "Config Server splits Chunk 1 on Shard A",
      actor: "Config Server",
      target: "Shard A"
    });

    if (triggerBalancer) {
      // STEP 4: Balancer Chunk Migration
      const migrateMsgs = [{ from: "ShardA", to: "ShardB", label: "Migrate Chunk 1b (Background)", type: "request" }];
      pushStep({
        title: "Cluster Balancer: Migrating Chunk 1b to Shard B",
        explanation: "The MongoDB Balancer detects chunk count imbalance (Shard A has 8 chunks, Shard B has 2 chunks). It background-migrates Chunk 1b from Shard A to Shard B.",
        rule: "Balancer Chunk Migration",
        why: "Automatic chunk migration balances write disk utilization across shards transparently to applications.",
        codeLine: 5,
        messages: migrateMsgs,
        states: ['ACTIVE', 'ACTIVE', 'ELECTION', 'LEADER'],
        actionText: "Balancer migrates Chunk 1b from Shard A to Shard B",
        actor: "Balancer",
        target: "Shard B"
      });

      pushStep({
        title: "Cluster Rebalanced & Metadata Updated",
        explanation: "Chunk 1b migration finishes. Config Server updates metadata catalog: Shard A and Shard B now hold equal chunk weights!",
        rule: "Balanced Cluster",
        why: "Equal chunk distribution prevents write hotspots and maximizes query throughput.",
        codeLine: 5,
        states: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE'],
        actionText: "MongoDB Cluster successfully rebalanced",
        actor: "Cluster"
      });
    }

    return stepList;
  }, [shardingStrategy, triggerBalancer]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  MongoDB Sharded Architecture (mongos - Config - Shards)
                </h3>
                <p className="text-[11px] text-green-400 font-mono mt-0.5">
                  {sim.activeState.mongoInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Router", "Config"], ["Router", "ShardA"], ["Router", "ShardB"], ["Config", "ShardA"], ["Config", "ShardB"]]}
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
          <CodePanel codeLines={MONGO_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              MongoDB Cluster Parameters
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Sharding Strategy:</label>
              <select
                value={shardingStrategy}
                onChange={(e) => setShardingStrategy(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="RANGED">Ranged Sharding (zipcode range [0..99999])</option>
                <option value="HASHED">Hashed Sharding (Murmur3 hash distribution)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Background Balancer Toggle:</label>
              <button
                onClick={() => setTriggerBalancer(!triggerBalancer)}
                className={`w-full py-1.5 px-3 text-xs font-bold rounded border ${
                  triggerBalancer
                    ? "bg-green-600/30 border-green-500 text-green-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {triggerBalancer ? "Balancer Enabled (Auto Chunk Migration)" : "Balancer Disabled"}
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
