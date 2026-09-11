export const QUIZZES = {
  "lamport-logical-clock": {
    moduleId: "lamport-logical-clock",
    title: "Lamport Logical Clocks Quiz",
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "What is the update rule for a process L_i upon receiving a message timestamped with T?",
        options: [
          "L_i = L_i + 1",
          "L_i = max(L_i, T) + 1",
          "L_i = T + 1",
          "L_i = min(L_i, T) + 1"
        ],
        correctAnswer: 1,
        explanation: "Lamport's clock update rule specifies that upon receiving a message with timestamp T, a process sets its clock to max(L_i, T) + 1 before processing the event."
      },
      {
        id: "q2",
        type: "tf",
        question: "If Lamport timestamps satisfy L(e1) < L(e2), it ALWAYS implies that e1 happened before e2 (e1 -> e2).",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "False! Lamport clocks guarantee e1 -> e2 implies L(e1) < L(e2), but the reverse is NOT true (scalar Lamport clocks cannot distinguish causally dependent events from concurrent events)."
      },
      {
        id: "q3",
        type: "multi",
        question: "Which of the following events increment a process's local Lamport logical clock? (Select all that apply)",
        options: [
          "Local internal computation events",
          "Sending a message to another process",
          "Receiving a message from another process",
          "Reading physical wall-clock time"
        ],
        correctAnswer: [0, 1, 2],
        explanation: "Every local event (internal execution, sending a message, receiving a message) causes a monotonically increasing clock increment. Reading physical time is not a Lamport event."
      }
    ]
  },
  "vector-clocks": {
    moduleId: "vector-clocks",
    title: "Vector Clocks & Causality Quiz",
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "How do Vector Clocks detect concurrent events (V(a) || V(b))?",
        options: [
          "When all elements of V(a) are strictly less than V(b)",
          "When neither V(a) <= V(b) nor V(b) <= V(a) holds",
          "When the sum of vector V(a) equals vector V(b)",
          "When V(a) and V(b) share the same process ID"
        ],
        correctAnswer: 1,
        explanation: "Concurrent events occur when neither clock vector dominates the other component-wise, meaning V(a) || V(b)."
      },
      {
        id: "q2",
        type: "tf",
        question: "Vector clocks require an array of size N, where N is the total number of processes in the distributed system.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "True! Each process P_i maintains a vector of size N tracking the latest known logical clock values of all N processes."
      }
    ]
  },
  "paxos-consensus": {
    moduleId: "paxos-consensus",
    title: "Paxos Consensus Quiz",
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "What is the minimum quorum size required for a Paxos cluster with N Acceptors?",
        options: [
          "N / 2",
          "Math.floor(N / 2) + 1",
          "N - 1",
          "N"
        ],
        correctAnswer: 1,
        explanation: "Paxos requires a strict majority quorum of (N/2 + 1) acceptors to ensure any two quorums overlap by at least one acceptor."
      },
      {
        id: "q2",
        type: "mcq",
        question: "In Paxos Phase 1b, what does an Acceptor promise upon accepting a PREPARE(n) message?",
        options: [
          "To immediately execute the proposal",
          "Not to accept any future proposal numbered less than n",
          "To reject all proposals from other nodes",
          "To shutdown the cluster"
        ],
        correctAnswer: 1,
        explanation: "Acceptors reply with PROMISE(n), guaranteeing they will reject any future proposals with proposal number < n."
      }
    ]
  },
  "raft-consensus": {
    moduleId: "raft-consensus",
    title: "Raft Consensus Quiz",
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "What triggers a Raft Follower to transition into a Candidate state?",
        options: [
          "Receiving a client write request",
          "Expiration of its randomized election timer without receiving heartbeats",
          "Receiving a RequestVote RPC from a peer",
          "A manual command from the administrator"
        ],
        correctAnswer: 1,
        explanation: "If a follower receives no AppendEntries heartbeats before its election timer expires, it assumes leader failure and transitions to Candidate."
      },
      {
        id: "q2",
        type: "tf",
        question: "Raft allows multiple Leaders to be elected within the same Term.",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "False! Raft enforces the Leader Safety Property: at most one leader can be elected per Term."
      }
    ]
  },
  "cap-theorem": {
    moduleId: "cap-theorem",
    title: "CAP Theorem Quiz",
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "In Brewer's CAP Theorem, what happens during a network partition (P) in a CP system?",
        options: [
          "The system shuts down completely",
          "The minority partition rejects writes (503 Error) to preserve Consistency",
          "All nodes accept writes locally, creating split-brain data divergence",
          "The network automatically repairs itself instantly"
        ],
        correctAnswer: 1,
        explanation: "In CP Mode, isolated minority partitions refuse writes to maintain strict linearizable consistency across active nodes."
      }
    ]
  },
  "two-phase-commit": {
    moduleId: "two-phase-commit",
    title: "Two-Phase Commit (2PC) Quiz",
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "What is the primary vulnerability / limitation of the classic 2PC protocol?",
        options: [
          "It uses too many messages",
          "It is a blocking protocol if the Coordinator crashes post-vote",
          "It does not support SQL databases",
          "It allows split-brain data corruption"
        ],
        correctAnswer: 1,
        explanation: "2PC is blocking: if the Coordinator crashes after cohorts vote PREPARED, cohorts freeze holding database locks indefinitely."
      }
    ]
  }
};
