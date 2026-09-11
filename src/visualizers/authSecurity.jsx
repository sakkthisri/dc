import React, { useState, useMemo } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import { NodeGraph } from '../components/visualizer/NodeGraph';
import { StepControls } from '../components/visualizer/StepControls';
import { EventLog } from '../components/visualizer/EventLog';
import { ExplanationPanel } from '../components/visualizer/ExplanationPanel';
import { CodePanel } from '../components/visualizer/CodePanel';
import { Legend } from '../components/visualizer/Legend';

const SECURITY_PSEUDOCODE = [
  "// Distributed Authentication, Authorization & TLS Encryption",
  "1. Authentication Phase (Auth Server):",
  "   - Client sends credentials -> Auth Server verifies & issues Signed JWT Token",
  "2. Authorization Phase (Role-Based Access Control):",
  "   - Client requests resource with JWT (Role='ADMIN')",
  "   - Resource Service verifies JWT signature & validates permissions -> Access GRANTED",
  "3. TLS Asymmetric/Symmetric Encryption:",
  "   - Handshake exchanges RSA Public Keys to negotiate AES Session Key",
  "   - Application data encrypted with AES-256 before network transit"
];

export function AuthSecurityVisualizer() {
  const [userRole, setUserRole] = useState("ADMIN"); // "ADMIN" vs "GUEST"

  const steps = useMemo(() => {
    const positions = [
      { x: 100, y: 180 }, // Client App
      { x: 320, y: 100 }, // Auth Server
      { x: 320, y: 260 }, // API Gateway / Firewall
      { x: 520, y: 180 }  // Protected Service
    ];

    const stepList = [];
    const recordedEvents = [];
    const isAuthorized = userRole === "ADMIN";

    const pushStep = ({
      title,
      explanation,
      rule,
      why,
      codeLine,
      states = ['PRIMARY', 'NAMENODE', 'ROUTER', 'LEADER'],
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
          type: actionText.includes("DENIED") ? "CRASH" : "CONSENSUS"
        });
      }

      stepList.push({
        nodes: [
          { id: "Client", label: `Client (${userRole})`, x: positions[0].x, y: positions[0].y, status: states[0], role: 'PRIMARY' },
          { id: "AuthServer", label: "Auth Server (JWT)", x: positions[1].x, y: positions[1].y, status: states[1], role: 'NAMENODE' },
          { id: "Gateway", label: "TLS Gateway", x: positions[2].x, y: positions[2].y, status: states[2], role: 'ROUTER' },
          { id: "Service", label: "Protected Service", x: positions[3].x, y: positions[3].y, status: states[3], role: states[3] === 'CRASHED' ? 'CRASHED' : 'LEADER' }
        ],
        messages,
        events: [...recordedEvents],
        title,
        explanation,
        rule,
        why,
        codeLine,
        secInfo: `Role: ${userRole} | Authentication: Signed JWT | Transmission: TLS 1.3 AES-256 Encrypted`
      });
    };

    // STEP 0: Initial State
    pushStep({
      title: "Distributed Security Infrastructure Active",
      explanation: `Client initialized with role '${userRole}'. TLS 1.3 encryption handshake active on API Gateway.`,
      rule: "Zero Trust Security",
      why: "Zero-trust models authenticate and authorize every individual request across microservice boundaries.",
      codeLine: 1,
      actionText: "Security subsystem ready",
      actor: "AuthServer"
    });

    // STEP 1: Authentication Request
    const authMsgs = [{ from: "Client", to: "AuthServer", label: "LOGIN(user, pass)", type: "request" }];
    pushStep({
      title: "Phase 1: User Authentication & JWT Issuance",
      explanation: `Client authenticates with Auth Server. Auth Server validates credentials and returns signed JWT Token (Role='${userRole}').`,
      rule: "Authentication",
      why: "JWT tokens contain cryptographically signed claims preventing user identity forgery.",
      codeLine: 1,
      messages: authMsgs,
      states: ['PRIMARY', 'LEADER', 'ROUTER', 'LEADER'],
      actionText: `Auth Server issued JWT token for role '${userRole}'`,
      actor: "AuthServer",
      target: "Client"
    });

    // STEP 2: Authorization Request
    const reqMsgs = [{ from: "Client", to: "Gateway", label: `REQ(JWT Role='${userRole}')`, type: "request" }];
    pushStep({
      title: "Phase 2: Authorization & Token Verification",
      explanation: "Client sends encrypted request with JWT token to TLS API Gateway targeting Protected Service endpoint.",
      rule: "Authorization Rules",
      why: "Role-Based Access Control (RBAC) verifies if the token role holds permission for target resources.",
      codeLine: 2,
      messages: reqMsgs,
      states: ['PRIMARY', 'NAMENODE', 'LEADER', 'LEADER'],
      actionText: "Gateway verifying JWT signature & RBAC permissions",
      actor: "Gateway"
    });

    if (isAuthorized) {
      const grantMsgs = [{ from: "Gateway", to: "Service", label: "Forward AES-Encrypted REQ", type: "request" }];
      pushStep({
        title: "Access GRANTED: Encrypted Request Processed",
        explanation: "Role 'ADMIN' holds full access permissions. API Gateway forwards AES-256 encrypted payload to Protected Service.",
        rule: "Access Granted",
        why: "Protects sensitive data from unauthorized eavesdropping or privilege escalation.",
        codeLine: 3,
        messages: grantMsgs,
        states: ['LEADER', 'NAMENODE', 'LEADER', 'LEADER'],
        actionText: "Access GRANTED! Protected service executed request",
        actor: "Service"
      });
    } else {
      const denyMsgs = [{ from: "Gateway", to: "Client", label: "403 Forbidden (Access Denied)", type: "response" }];
      pushStep({
        title: "Access DENIED: HTTP 403 Forbidden",
        explanation: "Role 'GUEST' lacks administrative privileges. API Gateway rejects request and blocks service access.",
        rule: "Access Denied Rule",
        why: "Enforces strict principle of least privilege across distributed boundaries.",
        codeLine: 2,
        messages: denyMsgs,
        states: ['CRASHED', 'NAMENODE', 'LEADER', 'CRASHED'],
        actionText: "Access DENIED! 403 Forbidden returned to Client",
        actor: "Gateway",
        target: "Client"
      });
    }

    return stepList;
  }, [userRole]);

  const sim = useSimulation(steps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Authentication, Authorization & TLS Encryption Visualizer
                </h3>
                <p className="text-[11px] text-green-400 font-mono mt-0.5">
                  {sim.activeState.secInfo}
                </p>
              </div>
              <Legend />
            </div>

            <div className="bg-grid-pattern rounded-lg my-3 border border-gray-800/60">
              <NodeGraph
                nodes={sim.activeState.nodes || []}
                messages={sim.activeState.messages || []}
                connections={[["Client", "AuthServer"], ["Client", "Gateway"], ["Gateway", "Service"]]}
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
          <CodePanel codeLines={SECURITY_PSEUDOCODE} activeLine={sim.activeState.codeLine} />

          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Authorization Role Testing
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">User Authorization Role:</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded p-1.5 text-xs"
              >
                <option value="ADMIN">Role: ADMIN (Full Access - GRANTED)</option>
                <option value="GUEST">Role: GUEST (Restricted Access - DENIED)</option>
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
