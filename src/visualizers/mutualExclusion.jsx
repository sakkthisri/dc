import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { calculateLinearPositions, calculateRingPositions } from '../utils/simulationUtils';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';
import { Lock } from 'lucide-react';

const PSEUDOCODE_MAP = {
  centralized: [
    "// Centralized Mutual Exclusion",
    "1. Process P_i sends REQUEST msg to Coordinator",
    "2. Coordinator checks lock status:",
    "   - If FREE: Coordinator grants lock (GRANT msg to P_i)",
    "   - If BUSY: Queue P_i request",
    "3. P_i enters Critical Section (CS)",
    "4. P_i finishes CS -> sends RELEASE msg to Coordinator",
    "5. Coordinator grants lock to next queued process"
  ],
  ricartAgrawala: [
    "// Ricart-Agrawala Algorithm (Permission Based)",
    "1. P_i increments clock T_i and sends REQUEST(T_i, i) to ALL processes",
    "2. Upon receiving REQUEST(T_j, j) from P_j:",
    "   - If P_i is NOT in CS and does NOT want CS: Send REPLY immediately",
    "   - If P_i is IN CS: Defer REPLY until P_i exits CS",
    "   - If P_i also REQUESTING: Compare timestamps (T_i, i) vs (T_j, j):",
    "         If (T_j, j) < (T_i, i): Send REPLY immediately",
    "         Else: Defer REPLY",
    "3. P_i enters CS when REPLY received from ALL (N-1) processes",
    "4. Upon exiting CS: Send deferred REPLYs to all queued processes"
  ],
  tokenRing: [
    "// Token Ring Mutual Exclusion",
    "1. Logical ring topology: P_1 -> P_2 -> ... -> P_N -> P_1",
    "2. Single TOKEN circulates continuously around ring",
    "3. On receiving TOKEN:",
    "   - If process P_i NEEDS Critical Section:",
    "         P_i retains TOKEN and enters CS",
    "         Upon finishing CS, P_i passes TOKEN to successor",
    "   - Else: Pass TOKEN immediately to successor"
  ]
};

export function MutualExclusionVisualizer() {
  const [mode, setMode] = useState('centralized');
  const nodeCount = 4;

  const steps = useMemo(() => {
    const stepList = [];
    const recordedEvents = [];

    const pNames = Array.from({ length: nodeCount }, (_, i) => `P${i + 1}`);

    const pushStep = (positions, nodesState, messages = [], title, explanation, rule, why, codeLine, actionText = "", actor = "") => {
      if (actionText) {
        recordedEvents.push({
          action: actionText,
          from: actor,
          type: actionText.includes("CRITICAL SECTION") ? "LEADER" : actionText.includes("REQUEST") ? "ELECTION" : "LOCAL_EVENT"
        });
      }

      stepList.push({
        nodes: nodesState.map((n, idx) => ({
          ...n,
          x: positions[idx].x,
          y: positions[idx].y
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

    if (mode === 'centralized') {
      const positions = calculateLinearPositions(nodeCount + 1, 640, 320);
      const coordPos = { x: 320, y: 70 };

      const allNodes = [
        { id: 'Coord', label: 'Coordinator', x: coordPos.x, y: coordPos.y, status: 'LEADER', isLeader: true },
        ...pNames.map((name, i) => ({
          id: name,
          label: name,
          x: positions[i].x,
          y: 240,
          status: 'RELEASED'
        }))
      ];

      // STEP 0
      pushStep(
        [coordPos, ...positions.slice(0, nodeCount)],
        allNodes,
        [],
        "Centralized Mutual Exclusion Ready",
        "Coordinator node controls exclusive access to the Critical Section.",
        "Single Coordinator Lock Spec",
        "Only one process may hold the lock granted by the central coordinator.",
        1,
        "System initialized with Coordinator lock free"
      );

      // STEP 1: P1 requests CS
      const state1 = allNodes.map(n => n.id === 'P1' ? { ...n, status: 'REQUESTING' } : n);
      pushStep(
        [coordPos, ...positions.slice(0, nodeCount)],
        state1,
        [{ id: 'r1', from: 'P1', to: 'Coord', label: 'REQUEST', progress: 0.5 }],
        "P1 Requests Critical Section Access",
        "P1 sends a REQUEST message to the Coordinator.",
        "send(REQUEST) to Coordinator",
        "P1 must wait for an explicit GRANT token from the Coordinator before touching shared state.",
        2,
        "P1 sends REQUEST to Coordinator",
        "P1"
      );

      // STEP 2: Coordinator grants P1
      const state2 = allNodes.map(n => n.id === 'P1' ? { ...n, status: 'IN_CRITICAL_SECTION' } : n);
      pushStep(
        [coordPos, ...positions.slice(0, nodeCount)],
        state2,
        [{ id: 'g1', from: 'Coord', to: 'P1', label: 'GRANT', type: 'COORDINATOR', progress: 0.9 }],
        "Coordinator Grants Lock to P1 — P1 Enters CS!",
        "Coordinator confirms Critical Section is free and sends GRANT to P1. P1 enters Critical Section.",
        "Lock Granted -> P1 in CS",
        "Mutual exclusion invariant active: ONLY P1 can modify shared resources right now.",
        4,
        "Coordinator grants lock -> P1 IN CRITICAL SECTION",
        "P1"
      );

      // STEP 3: P3 requests while P1 is in CS
      const state3 = allNodes.map(n => {
        if (n.id === 'P1') return { ...n, status: 'IN_CRITICAL_SECTION' };
        if (n.id === 'P3') return { ...n, status: 'WAITING' };
        return n;
      });
      pushStep(
        [coordPos, ...positions.slice(0, nodeCount)],
        state3,
        [{ id: 'r3', from: 'P3', to: 'Coord', label: 'REQUEST', progress: 0.5 }],
        "P3 Requests CS Access (Queued by Coordinator)",
        "P3 sends REQUEST. Because P1 is in CS, Coordinator queues P3 and forces P3 to WAIT.",
        "CS Busy -> Queue P3",
        "Centralized coordinator prevents concurrent entry by queueing incoming requests.",
        3,
        "P3 requests CS -> Queued by Coordinator",
        "P3"
      );

      // STEP 4: P1 releases CS
      const state4 = allNodes.map(n => {
        if (n.id === 'P1') return { ...n, status: 'RELEASED' };
        if (n.id === 'P3') return { ...n, status: 'WAITING' };
        return n;
      });
      pushStep(
        [coordPos, ...positions.slice(0, nodeCount)],
        state4,
        [{ id: 'rel1', from: 'P1', to: 'Coord', label: 'RELEASE', progress: 0.7 }],
        "P1 Exits CS & Sends RELEASE to Coordinator",
        "P1 finishes critical work and notifies the Coordinator that the lock is free.",
        "send(RELEASE) -> Lock Freed",
        "Releasing the lock notifies the coordinator to pop the next queued request.",
        5,
        "P1 exits CS and releases lock",
        "P1"
      );

      // STEP 5: Coordinator grants queued P3
      const state5 = allNodes.map(n => {
        if (n.id === 'P3') return { ...n, status: 'IN_CRITICAL_SECTION' };
        return { ...n, status: 'RELEASED' };
      });
      pushStep(
        [coordPos, ...positions.slice(0, nodeCount)],
        state5,
        [{ id: 'g3', from: 'Coord', to: 'P3', label: 'GRANT', type: 'COORDINATOR', progress: 0.9 }],
        "Coordinator Grants Queued Lock to P3!",
        "Coordinator pops P3 from queue and sends GRANT. P3 enters Critical Section.",
        "Pop Queue -> GRANT to P3",
        "Mutual exclusion guaranteed sequentially across all process requests.",
        6,
        "Coordinator grants lock to P3 -> P3 IN CRITICAL SECTION",
        "P3"
      );

    } else if (mode === 'ricartAgrawala') {
      const positions = calculateLinearPositions(nodeCount, 640, 320);
      const baseNodes = pNames.map((name, i) => ({
        id: name,
        label: name,
        x: positions[i].x,
        y: positions[i].y,
        clock: 0,
        status: 'RELEASED'
      }));

      // STEP 0
      pushStep(
        positions,
        baseNodes,
        [],
        "Ricart-Agrawala Permission-Based Algorithm",
        "No central coordinator! Processes obtain permission by requesting quorums from ALL other processes.",
        "Ricart-Agrawala Init",
        "Uses Lamport timestamped REQUESTs to resolve conflicting critical section attempts.",
        1,
        "Ricart-Agrawala initialized"
      );

      // STEP 1: P2 requests CS
      const s1 = baseNodes.map(n => n.id === 'P2' ? { ...n, clock: 5, status: 'REQUESTING' } : n);
      const reqMsgs1 = pNames.filter(n => n !== 'P2').map((target, idx) => ({
        id: `ra1_${idx}`,
        from: 'P2',
        to: target,
        label: 'REQ (T=5)',
        type: 'ELECTION',
        progress: 0.5
      }));

      pushStep(
        positions,
        s1,
        reqMsgs1,
        "P2 Requests CS with Timestamp T=5",
        "P2 sets timestamp T=5 and broadcasts REQUEST(T=5) to all other processes.",
        "V_2 = V_2 + 1; Broadcast REQUEST(T_i, i)",
        "Every process evaluates P2's request timestamp against their own local request state.",
        1,
        "P2 broadcasts REQUEST(T=5) to all processes",
        "P2"
      );

      // STEP 2: All nodes reply -> P2 enters CS
      const s2 = baseNodes.map(n => n.id === 'P2' ? { ...n, clock: 5, status: 'IN_CRITICAL_SECTION' } : n);
      const replyMsgs1 = pNames.filter(n => n !== 'P2').map((src, idx) => ({
        id: `rep1_${idx}`,
        from: src,
        to: 'P2',
        label: 'REPLY',
        type: 'COORDINATOR',
        progress: 0.8
      }));

      pushStep(
        positions,
        s2,
        replyMsgs1,
        "All Processes Reply OK -> P2 Enters Critical Section!",
        "P2 receives (N-1) REPLY messages and immediately enters Critical Section.",
        "Received (N-1) REPLYs -> Enter CS",
        "No process contested P2's timestamp T=5.",
        3,
        "P2 receives all REPLYs -> IN CRITICAL SECTION",
        "P2"
      );

    } else {
      // Token Ring mode
      const positions = calculateRingPositions(nodeCount, 640, 320);
      const ringNodes = pNames.map((name, i) => ({
        id: name,
        label: name,
        x: positions[i].x,
        y: positions[i].y,
        status: i === 0 ? 'IN_CRITICAL_SECTION' : 'RELEASED'
      }));

      pushStep(
        positions,
        ringNodes,
        [{ id: 'tok1', from: 'P1', to: 'P2', label: 'TOKEN', type: 'TOKEN', progress: 0.5 }],
        "Token Ring Mutual Exclusion",
        "A single TOKEN token circulates around the logical ring P1 -> P2 -> P3 -> P4 -> P1.",
        "Circulate TOKEN around ring",
        "Only the process currently holding the TOKEN is authorized to enter the Critical Section.",
        2,
        "P1 holds TOKEN and enters CS",
        "P1"
      );

      const ringNodes2 = pNames.map((name, i) => ({
        id: name,
        label: name,
        x: positions[i].x,
        y: positions[i].y,
        status: i === 2 ? 'IN_CRITICAL_SECTION' : 'RELEASED'
      }));

      pushStep(
        positions,
        ringNodes2,
        [{ id: 'tok2', from: 'P2', to: 'P3', label: 'TOKEN', type: 'TOKEN', progress: 0.8 }],
        "P1 Releases TOKEN -> Passed to P3 -> P3 Enters CS!",
        "P1 finishes CS and passes TOKEN along ring to P3. P3 enters Critical Section.",
        "Pass TOKEN to successor",
        "Mutual exclusion guaranteed by single physical token invariant.",
        3,
        "TOKEN passed to P3 -> P3 IN CRITICAL SECTION",
        "P3"
      );
    }

    return stepList;
  }, [mode, nodeCount]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      {/* Algorithm Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-gray-900 border border-gray-800">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Mutual Exclusion Strategy:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('centralized')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'centralized' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            Centralized Coordinator
          </button>
          <button
            onClick={() => setMode('ricartAgrawala')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'ricartAgrawala' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            Ricart-Agrawala (Distributed)
          </button>
          <button
            onClick={() => setMode('tokenRing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'tokenRing' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            Token Ring
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col dark:bg-gray-900/90 dark:border-gray-800 light:bg-white light:border-gray-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 light:border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Critical Section Lock Execution View
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
          <CodePanel codeLines={PSEUDOCODE_MAP[mode]} activeLine={sim.activeState.codeLine} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExplanationPanel activeState={sim.activeState} />
        <EventLog events={sim.activeState.events || []} currentStep={sim.currentStep} />
      </div>
    </div>
  );
}
