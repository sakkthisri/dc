/**
 * Comprehensive Distributed Computing Syllabus Theory Database
 * Provides structured college-level theory, exam focus points (★), and common exam questions for all syllabus modules.
 */

export const MODULE_THEORY = {
  "ds-introduction": {
    overview: "Distributed Systems form the architectural foundation for internet-scale services, cloud computing, and enterprise infrastructure.",
    definition: "A Distributed System is a collection of autonomous computing nodes connected via a network that communicate and coordinate their actions strictly through message passing, appearing to end users as a single coherent system (Tanenbaum & Van Steen).",
    coreConcept: "Core Foundations:\n1. Autonomous Processing Nodes: Each node possesses its own local CPU and memory.\n2. No Shared Physical Memory: Nodes cannot directly read or write to another node's RAM.\n3. Independent Clock Frequencies: Physical clocks drift, creating a lack of global physical time.\n4. Partial Failure Mode: Individual components can crash while the overall system continues executing.",
    architectureOrSteps: "System Components & Interactions:\n• Compute Nodes: Autonomous hosts executing local processes.\n• Interconnect Network: Ethernet, Fiber, or Wireless links with non-deterministic latency.\n• Middleware Layer: Software abstraction providing RPC, serialization, and discovery.\n• Distributed Storage: Replicated file systems, databases, or key-value stores.",
    example: "Real-World Example:\nGoogle Search Engine: A user query arrives at a frontend load balancer, which scatters the query across thousands of index search nodes in parallel, gathers intermediate results, and returns the compiled response within milliseconds.",
    advantages: [
      "Horizontal Scalability: Add commodity nodes incrementally rather than buying expensive mainframes.",
      "Fault Tolerance & High Availability: Redundant nodes take over seamlessly when hardware fails.",
      "Resource Sharing: Enables collaborative sharing of specialized hardware, databases, and compute pipelines."
    ],
    limitations: [
      "Concurrency & Race Conditions: Non-deterministic message delivery ordering.",
      "Network Latency & Partitions: Messages may be delayed, duplicated, or dropped.",
      "Complex Debugging & Monitoring: Lack of global state snapshotting makes root-cause analysis difficult."
    ],
    keyTakeaways: [
      "Distributed systems consist of autonomous nodes communicating via message passing.",
      "No single node has complete or instantaneous knowledge of global system state.",
      "Architectures must handle non-uniform network latency and partial failures."
    ],
    examFocus: [
      "★ Define a Distributed System and state its 4 fundamental properties.",
      "★ Compare Centralized, Parallel, and Distributed computing paradigms.",
      "★ Explain why message passing is mandatory due to lack of shared memory.",
      "★ Describe partial failures and how they differ from total system crashes."
    ],
    commonQuestions: [
      "1. What is a Distributed System? Explain Tanenbaum's definition.",
      "2. Differentiate between Centralized, Parallel, and Distributed Systems.",
      "3. Why is physical clock synchronization difficult in distributed systems?",
      "4. What is a partial failure? Give two real-world examples."
    ]
  },

  "lamport-logical-clock": {
    overview: "In distributed systems without a shared physical clock, Leslie Lamport's Logical Clocks provide a mechanism to order events using monotonically increasing scalar counters.",
    definition: "Lamport's Logical Clock is a scalar algorithm assigning a monotonically increasing integer timestamp L(a) to every event 'a' such that if event 'a' causally precedes event 'b' (a -> b), then L(a) < L(b).",
    coreConcept: "Happened-Before Relation (->):\n1. Process Order: If a and b are events within the same process and a occurs before b, then a -> b.\n2. Message Order: If a is the sending of a message and b is the receipt of that message, then a -> b.\n3. Transitivity: If a -> b and b -> c, then a -> c.",
    architectureOrSteps: "Algorithm Rules:\n• Rule 1 (Local Event): Before process P_i executes an internal event or sends a message, it increments its local clock: L_i = L_i + 1.\n• Rule 2 (Message Send): P_i attaches timestamp L_i to outgoing message m: msg(m, L_i).\n• Rule 3 (Message Receive): When process P_j receives (m, L_msg), it updates its clock: L_j = max(L_j, L_msg) + 1.",
    example: "Example Calculation:\nProcess P1 sends message m1 at L1 = 1.\nProcess P2 receives m1 when its local clock L2 = 0.\nP2 updates: L2 = max(0, 1) + 1 = 2.",
    advantages: [
      "Minimal Overhead: Requires only 1 scalar integer attached per network message.",
      "Total Ordering Tie-Breaking: Can achieve total ordering by suffixing Process ID: (L_a, P_i) < (L_b, P_j).",
      "Simple Implementation: Low CPU and memory requirements."
    ],
    limitations: [
      "Cannot Detect Causality / Concurrency: L(a) < L(b) does NOT imply a -> b (events could be concurrent).",
      "Scalar Limitation: Does not capture causal independence between concurrent processes."
    ],
    keyTakeaways: [
      "Lamport clocks satisfy the Clock Consistency Condition: a -> b => L(a) < L(b).",
      "The converse is NOT true: L(a) < L(b) does NOT prove a -> b.",
      "Tie-breaking using Process IDs creates a total ordering of events."
    ],
    examFocus: [
      "★ State the 3 rules of Lamport's Logical Clock algorithm.",
      "★ Define Leslie Lamport's Happened-Before relation (->).",
      "★ Explain why L(a) < L(b) does NOT imply a -> b with a counterexample.",
      "★ Demonstrate how total ordering is achieved using (Timestamp, Process_ID) tuples."
    ],
    commonQuestions: [
      "1. State and explain Lamport's Clock Consistency Condition.",
      "2. Explain the happened-before relationship defined by Leslie Lamport.",
      "3. Trace Lamport timestamps for a 3-process message exchange diagram.",
      "4. What is the main limitation of Lamport's Logical Clock compared to Vector Clocks?"
    ]
  },

  "vector-clocks": {
    overview: "Vector Clocks extend Lamport's scalar clocks by maintaining an array of process counters, enabling exact causal relationship detection and concurrency identification.",
    definition: "A Vector Clock is an array V of size N (where N is total processes), where V_i[j] represents Process P_i's knowledge of the number of events that have occurred at Process P_j.",
    coreConcept: "Causality & Concurrency Condition:\n• Vector Comparison: V_a <= V_b iff V_a[k] <= V_b[k] for all k in [1..N].\n• Causal Order: Event a happened before b (a -> b) iff V(a) < V(b) (meaning V(a) <= V(b) and V(a) != V(b)).\n• Concurrency: Events a and b are concurrent (a || b) iff neither V(a) <= V(b) nor V(b) <= V(a).",
    architectureOrSteps: "Algorithm Rules:\n1. Initialization: Each process P_i initializes vector V_i = [0, 0, ..., 0].\n2. Local Event / Send: Before P_i executes an event, it increments its own component: V_i[i] = V_i[i] + 1.\n3. Message Send: P_i attaches its full vector V_i to the outgoing message.\n4. Message Receive: On receiving (m, V_msg), P_j updates: V_j[k] = max(V_j[k], V_msg[k]) for all k, then increments V_j[j] = V_j[j] + 1.",
    example: "Example Vector Trace:\n3 Processes [P1, P2, P3]:\n• P1 internal event: V1 = [1, 0, 0].\n• P1 sends m to P2.\n• P2 receives m with V_msg=[1, 0, 0]. P2 updates: V2 = [max(0,1), max(0,0)+1, 0] = [1, 1, 0].",
    advantages: [
      "Exact Causality Tracking: If V(a) < V(b), then a definitely causally preceded b.",
      "Conflict & Concurrency Detection: Identifies concurrent updates in distributed databases (e.g. Amazon DynamoDB)."
    ],
    limitations: [
      "O(N) Bandwidth Overhead: Attaching vector arrays of size N to every message scales poorly as process count N grows.",
      "Storage Overhead: Every node must store N integers."
    ],
    keyTakeaways: [
      "Vector Clocks provide if-and-only-if causal inference: a -> b <=> V(a) < V(b).",
      "Two events are concurrent (a || b) if their vector clocks are un-comparable.",
      "Used extensively in DynamoDB, Riak, CRDTs, and Git conflict resolution."
    ],
    examFocus: [
      "★ Explain how Vector Clocks solve the limitation of Lamport Logical Clocks.",
      "★ Write the Vector Clock update rules for internal events and message receipts.",
      "★ Define the formal condition for two events to be concurrent (a || b).",
      "★ Compare scalar Lamport timestamps vs. vector timestamps in terms of message overhead."
    ],
    commonQuestions: [
      "1. What is a Vector Clock? How does it differ from a Lamport Logical Clock?",
      "2. State the vector update rules executed on message send and receive.",
      "3. Given vector timestamps V(a) = [2, 1, 0] and V(b) = [1, 3, 0], determine if a -> b, b -> a, or a || b.",
      "4. Explain the application of Vector Clocks in Amazon's Dynamo DB."
    ]
  },

  "global-state": {
    overview: "Capturing a consistent global state (snapshot) of a distributed system is essential for checkpointing, deadlocks detection, garbage collection, and failure recovery.",
    definition: "A Global State of a distributed system consists of the local states of all constituent processes plus the states of all communication channels connecting them.",
    coreConcept: "Consistent Cut (Consistent Snapshot):\n• Cut: A slice dividing event histories into PAST and FUTURE.\n• Consistent Cut: A cut C is consistent if for every event e in C, if an event c happened-before e (c -> e), then c is also in C.\n• Inconsistent Cut: Contains an effect without its cause (a message receive is recorded in PAST, but its send event is recorded in FUTURE).",
    architectureOrSteps: "Chandy-Lamport Snapshot Algorithm:\n1. Marker Sending Rule (Initiator P_i):\n   - P_i records its own state.\n   - P_i sends a Special Marker message along all outgoing channels.\n   - P_i begins recording incoming messages on all other incoming channels.\n2. Marker Receiving Rule (Process P_j on receiving Marker via channel C_kj):\n   - If P_j has NOT yet recorded its state:\n     * P_j records its local state.\n     * Marks channel C_kj as EMPTY.\n     * Sends Marker along all outgoing channels.\n     * Begins recording incoming messages on all other channels.\n   - If P_j HAS already recorded its state:\n     * Stops recording messages on channel C_kj.\n     * Sets channel C_kj state as the set of messages received since P_j recorded its state.",
    example: "Example Snapshot Context:\nBank Transfer across 2 accounts (P1=$100, P2=$50). P1 sends $20 to P2.\n• Consistent Snapshot: P1=$80, Channel(P1->P2)=[$20], P2=$50 (Total = $150).\n• Inconsistent Snapshot: P1=$80, Channel=[], P2=$50 (Total = $130 — $20 lost!).",
    advantages: [
      "Non-Intrusive: Does not freeze or disrupt ongoing application computations.",
      "Guarantees Consistent Cut: No phantom messages or causal violations recorded."
    ],
    limitations: [
      "Channel Recording Overhead: Requires recording channel message buffers.",
      "Assumes FIFO Channels: Original Chandy-Lamport requires Reliable FIFO message channels."
    ],
    keyTakeaways: [
      "A consistent snapshot contains all causes of recorded effects.",
      "Chandy-Lamport uses special Markers to delimit process state and channel state.",
      "Non-blocking algorithm that runs concurrently with application messages."
    ],
    examFocus: [
      "★ Define a Cut, a Consistent Cut, and an Inconsistent Cut.",
      "★ State Chandy-Lamport's Marker sending and receiving rules.",
      "★ Explain why FIFO channel ordering is required for Chandy-Lamport.",
      "★ Provide a bank money transfer example demonstrating an inconsistent cut."
    ],
    commonQuestions: [
      "1. What is a Global Snapshot? Why is it important in distributed systems?",
      "2. Differentiate between a Consistent Cut and an Inconsistent Cut with diagrams.",
      "3. Explain the Chandy-Lamport Snapshot Algorithm step-by-step.",
      "4. How does the Chandy-Lamport algorithm record channel state?"
    ]
  },

  "paxos-consensus": {
    overview: "Paxos is the foundational consensus protocol designed by Leslie Lamport to reach agreement among distributed nodes over asynchronous networks with crash-stop failures.",
    definition: "Paxos is a consensus algorithm that guarantees Safety (no two nodes decide different values) and Liveness (eventual agreement) in a network of N processes where up to f = (N-1)/2 nodes can crash.",
    coreConcept: "Three Node Roles:\n1. Proposers: Advocate client values by submitting Proposal Numbers (n, v).\n2. Acceptors: Store accepted proposals and form Quorums (Majority N/2 + 1).\n3. Learners: Learn the agreed consensus value once accepted by a majority quorum.",
    architectureOrSteps: "Two-Phase Protocol Steps:\n• Phase 1a (Prepare): Proposer chooses unique proposal number 'n' and broadcasts Prepare(n) to Acceptors.\n• Phase 1b (Promise): Acceptor receives Prepare(n). If n > highest proposal seen, Acceptor returns Promise(n, max_accepted_n, max_accepted_v) and promises not to accept proposals < n.\n• Phase 2a (Accept Request): If Proposer receives Promises from a Majority Quorum, it selects value 'v' (value of highest proposal in promises, or its own if none) and broadcasts Accept(n, v).\n• Phase 2b (Accepted): If Acceptor receives Accept(n, v), it accepts it unless it already responded to Prepare(n') with n' > n.",
    example: "Example Paxos Run:\n5 Acceptors (Quorum = 3):\n• Proposer P1 sends Prepare(n=101).\n• Acceptors A1, A2, A3 return Promise(101, null, null).\n• P1 sends Accept(101, v='Write-X').\n• A1, A2, A3 accept 'Write-X' -> Consensus Achieved!",
    advantages: [
      "Rigorous Mathematical Correctness: Proven safety invariant under arbitrary delays.",
      "Fault Tolerant: Continues operating as long as a majority quorum is alive."
    ],
    limitations: [
      "Proposer Duels (Livelock): Two proposers continuously preempting each other with higher proposal numbers.",
      "Complex Implementation: High structural complexity when implementing Multi-Paxos."
    ],
    keyTakeaways: [
      "Paxos requires a majority quorum (N/2 + 1) of acceptors.",
      "Operates in two distinct phases: Phase 1 (Prepare/Promise) and Phase 2 (Accept/Accepted).",
      "Forms the theoretical backbone for Zookeeper (ZAB), Google Chubby, and Spanner."
    ],
    examFocus: [
      "★ Explain the 3 roles in Paxos: Proposer, Acceptor, Learner.",
      "★ Detail Phase 1 (Prepare/Promise) and Phase 2 (Accept/Accepted) steps.",
      "★ Show why Quorum Intersection (Majority Overlap) guarantees safety.",
      "★ Describe the Proposer Livelock problem and how randomized backoff resolves it."
    ],
    commonQuestions: [
      "1. What is the Consensus Problem? State the Paxos Consensus Algorithm.",
      "2. Trace Paxos Phase 1 and Phase 2 message flows with a sequence diagram.",
      "3. Explain why Paxos requires a majority quorum of acceptors to operate.",
      "4. What is a Proposer Duel in Paxos? How is it prevented?"
    ]
  },

  "raft-consensus": {
    overview: "Raft was designed by Ongaro & Ousterhout as an alternative to Paxos, prioritizing understandability through explicit leader election, log replication, and strong safety invariants.",
    definition: "Raft is a leader-driven consensus algorithm that decomposes consensus into 3 independent subproblems: Leader Election, Log Replication, and Safety Invariants.",
    coreConcept: "Three Node States:\n1. Leader: Handles all client requests, manages log replication to followers, and sends periodic heartbeats.\n2. Follower: Passive state responding to RPCs from Leader and Candidates.\n3. Candidate: Active state requesting votes during a leader election round.",
    architectureOrSteps: "Raft Operations:\n1. Leader Election:\n   - Follower's election timer expires -> becomes Candidate, increments Term, votes for itself, and broadcasts RequestVote RPC.\n   - Candidate obtaining votes from a majority of nodes becomes Leader.\n2. Log Replication:\n   - Leader receives client command, appends to local log.\n   - Leader broadcasts AppendEntries RPC containing log entry to Followers.\n   - Once majority followers acknowledge log write, Leader commits entry and notifies Followers.",
    example: "Example Raft Term & Failover:\n• Term 1: Leader Node A crashes.\n• Node B election timer expires -> transitions to Candidate (Term 2).\n• Node B receives votes from C and D -> becomes new Leader for Term 2.",
    advantages: [
      "High Understandability: Clear state machine decomposition.",
      "Strong Leader Invariant: Only nodes with up-to-date logs can be elected leader.",
      "Efficient Heartbeats: AppendEntries doubles as heartbeat mechanism."
    ],
    limitations: [
      "Leader Bottleneck: All client write traffic must flow through the single active leader node.",
      "Split-Brain Risk on Bad Quorum: Requires strict majority quorum configurations."
    ],
    keyTakeaways: [
      "Raft divides consensus into Leader Election, Log Replication, and Safety.",
      "Randomized election timers (e.g. 150ms - 300ms) prevent split-vote deadlocks.",
      "Used in industry standard infrastructure including etcd, Consul, CockroachDB, and TiKV."
    ],
    examFocus: [
      "★ Describe Raft's 3 node states: Leader, Follower, Candidate.",
      "★ Explain the AppendEntries RPC parameters and double usage as heartbeat.",
      "★ How do randomized election timers prevent split votes during elections?",
      "★ Explain the Leader Completeness property in Raft."
    ],
    commonQuestions: [
      "1. Explain the Raft Consensus Protocol and its 3 core components.",
      "2. Draw the Raft state transition diagram (Follower -> Candidate -> Leader).",
      "3. Trace the log replication process in Raft when a client submits a command.",
      "4. Compare Raft Consensus with Paxos in terms of understandability and architecture."
    ]
  },

  "two-phase-commit": {
    overview: "Two-Phase Commit (2PC) is an atomic commitment protocol that ensures all distributed database shards either commit or abort a distributed transaction as a single unit.",
    definition: "Two-Phase Commit is an atomic transaction protocol across multiple cohort nodes managed by a central Coordinator node, operating in 2 phases: Prepare (Vote) Phase and Commit Phase.",
    coreConcept: "Atomicity Principle (All-or-Nothing):\nEither 100% of cohort databases commit the transaction changes, or 0% commit (full rollback).",
    architectureOrSteps: "Two-Phase Commit Steps:\n• Phase 1 (Prepare / Voting Phase):\n  1. Coordinator writes 'Prepare' to WAL log and sends PREPARE message to all Cohorts.\n  2. Cohorts execute transaction locally, acquire locks, write undo/redo logs, and reply VOTE_COMMIT or VOTE_ABORT.\n• Phase 2 (Commit / Rollback Phase):\n  3. If ALL cohorts voted VOTE_COMMIT:\n     - Coordinator writes 'Global Commit' to log and sends COMMIT to all cohorts.\n     - Cohorts commit changes, release locks, and send ACK.\n  4. If ANY cohort voted VOTE_ABORT (or timeout):\n     - Coordinator sends GLOBAL_ABORT to all cohorts.\n     - Cohorts rollback local changes using undo logs and release locks.",
    example: "Example Financial Transaction:\nTransfer $500 from Bank A (Cohort 1) to Bank B (Cohort 2).\n• Phase 1: Both Bank A and Bank B lock accounts and vote VOTE_COMMIT.\n• Phase 2: Coordinator issues GLOBAL_COMMIT -> both banks finalize balances.",
    advantages: [
      "Guarantees ACID Atomicity across distributed database nodes.",
      "Simple 2-step voting protocol widely supported by XA/SQL standards."
    ],
    limitations: [
      "Blocking Protocol: If Coordinator crashes after Cohorts vote COMMIT, Cohorts remain blocked with active locks indefinitely.",
      "Performance Overhead: Synchronous multi-round disk log flushes and network message delays."
    ],
    keyTakeaways: [
      "2PC guarantees distributed ACID atomicity.",
      "Phase 1 = Voting Phase; Phase 2 = Execution Phase.",
      "The major weakness of 2PC is that it is a blocking protocol on coordinator failure."
    ],
    examFocus: [
      "★ Trace 2PC Phase 1 (Prepare) and Phase 2 (Commit/Abort) step-by-step.",
      "★ Explain the Blocking Vulnerability of 2PC when the Coordinator crashes.",
      "★ Describe the role of Write-Ahead Logging (WAL) in 2PC recovery.",
      "★ Contrast 2PC with 3PC (Three-Phase Commit)."
    ],
    commonQuestions: [
      "1. Explain the Two-Phase Commit (2PC) protocol with a detailed sequence diagram.",
      "2. What is the blocking problem in 2PC? Under what conditions does it occur?",
      "3. Explain the roles of the Coordinator and Cohort nodes in 2PC.",
      "4. How does 2PC recover from node crashes using local write-ahead logs?"
    ]
  },

  "cap-theorem": {
    overview: "Formulated by Eric Brewer and proven by Seth Gilbert & Nancy Lynch, the CAP Theorem establishes fundamental trade-offs in distributed data store design under network partitions.",
    definition: "The CAP Theorem states that a distributed data store can simultaneously provide at most two of three guarantees: Consistency (C), Availability (A), and Partition Tolerance (P).",
    coreConcept: "The Three Guarantees:\n1. Consistency (C): Every read receives the most recent write or an error (Linearizability).\n2. Availability (A): Every non-failing node returns a non-error response for every request (without guaranteeing latest value).\n3. Partition Tolerance (P): System continues operating despite arbitrary packet loss or network partitions.",
    architectureOrSteps: "Trade-off Invariant (CP vs AP under Partition):\n• Network Partition (P) is inevitable in real physical networks.\n• When a partition occurs between Node 1 and Node 2:\n  - Option CP (Choose Consistency): Block writes on Node 2 because it cannot sync with Node 1 -> Sacrifices Availability.\n  - Option AP (Choose Availability): Accept writes on Node 2 immediately -> Sacrifices Consistency (stale reads).",
    example: "Real-World Classification:\n• CP Systems: Google Spanner, HBase, Redis, MongoDB (in primary failover).\n• AP Systems: Apache Cassandra, Amazon DynamoDB, CouchDB, DNS.",
    advantages: [
      "Provides clear architectural framework for database selection based on application requirements.",
      "Prevents impossible expectations of simultaneous 100% C, A, and P."
    ],
    limitations: [
      "Over-simplification: Real systems trade off latency and consistency even when partitions are absent (PACELC Theorem)."
    ],
    keyTakeaways: [
      "Network Partitions (P) cannot be avoided in distributed networks.",
      "When a partition occurs, system designers MUST choose between CP or AP.",
      "CP = Consistency over Availability; AP = Availability over Consistency."
    ],
    examFocus: [
      "★ Define Consistency, Availability, and Partition Tolerance in Brewer's CAP Theorem.",
      "★ Explain why a distributed system MUST choose between CP and AP during a network partition.",
      "★ Classify Cassandra (AP) vs HBase/Spanner (CP) using the CAP Theorem.",
      "★ State Abadi's PACELC extension of the CAP Theorem."
    ],
    commonQuestions: [
      "1. State and prove Brewer's CAP Theorem for distributed databases.",
      "2. Why is 'CA without P' impossible in real distributed networks?",
      "3. Differentiate between CP and AP systems with concrete database examples.",
      "4. Explain the PACELC theorem and how it extends CAP."
    ]
  },

  "mapreduce": {
    overview: "MapReduce is a software framework popularized by Dean & Ghemawat at Google for processing vast datasets in parallel across large clusters using a split-apply-combine paradigm.",
    definition: "MapReduce is a programming model and processing framework for filtering, transforming, and aggregating large data volumes across distributed nodes using Map() and Reduce() functions.",
    coreConcept: "Processing Pipeline:\n1. Input Splitting: Splitting massive HDFS files into 64MB/128MB Input Splits.\n2. Map Phase: Worker nodes process input records -> emit (key, value) pairs.\n3. Shuffle & Sort Phase: Network redistribution grouping all intermediate values matching key 'k' to the same Reducer node.\n4. Reduce Phase: Reducer aggregates all values associated with key 'k' -> outputs final result.",
    architectureOrSteps: "Execution Steps:\n• Master Node: Assigns Map and Reduce tasks to Worker nodes based on data locality.\n• Map Tasks: Read HDFS block locally, apply map(k1, v1) -> emit list(k2, v2).\n• Intermediate Storage: Map outputs written to local disk.\n• Shuffle Phase: Reducers fetch key partitions over HTTP, sort keys.\n• Reduce Tasks: Apply reduce(k2, list(v2)) -> write final output to HDFS.",
    example: "Word Count Example:\nInput Text: 'hadoop mapreduce hadoop'\n• Map Output: ('hadoop', 1), ('mapreduce', 1), ('hadoop', 1)\n• Shuffle: 'hadoop' -> [1, 1], 'mapreduce' -> [1]\n• Reduce Output: ('hadoop', 2), ('mapreduce', 1).",
    advantages: [
      "Automatic Parallelization: Hides underlying socket, threading, and locking complexities.",
      "Fault Tolerance: Automatic re-execution of failed Map/Reduce tasks on healthy nodes.",
      "Data Locality Optimization: Schedules map tasks directly on nodes hosting the target HDFS data blocks."
    ],
    limitations: [
      "High Disk I/O Latency: Writes intermediate results to disk after Map and Reduce phases.",
      "Unsuitable for Iterative Algorithms: Poor performance for Machine Learning or Graph algorithms needing repeated iterations."
    ],
    keyTakeaways: [
      "MapReduce operates in 4 main phases: Split -> Map -> Shuffle & Sort -> Reduce.",
      "Data Locality schedules compute where data resides to minimize WAN traffic.",
      "Succeeded by in-memory processing frameworks like Apache Spark."
    ],
    examFocus: [
      "★ Explain the 4 phases of MapReduce: Input Split, Map, Shuffle & Sort, Reduce.",
      "★ Trace the MapReduce Word Count algorithm with an example dataset.",
      "★ How does MapReduce achieve fault tolerance for failed worker tasks?",
      "★ Define Data Locality in MapReduce task scheduling."
    ],
    commonQuestions: [
      "1. Explain the MapReduce programming model and architecture with a diagram.",
      "2. Trace the step-by-step MapReduce execution for a Word Count problem.",
      "3. Explain the Shuffle and Sort phase in MapReduce.",
      "4. What are the limitations of MapReduce compared to Apache Spark?"
    ]
  },

  "docker": {
    overview: "Docker revolutionized containerization by using Linux kernel primitives to package application code, dependencies, and environment binaries into lightweight, portable container images.",
    definition: "Docker is an open-source containerization platform that leverages Linux Namespaces and Control Groups (cgroups) to isolate software processes into self-contained runtime environments called Containers.",
    coreConcept: "Core Primitives:\n1. Namespaces: Provide process isolation (PID, NET, IPC, MNT, UTS namespaces).\n2. Control Groups (cgroups): Limit and allocate resource usage (CPU, Memory, Disk I/O).\n3. Layered Union File System (Overlay2): Read-only image layers stacked with a writable container layer.",
    architectureOrSteps: "Docker Components & Workflow:\n• Dockerfile: Text file containing build instructions (FROM, RUN, COPY, CMD).\n• Docker Image: Immutable, layered read-only template built from Dockerfile.\n• Docker Container: Executable runtime instance created from a Docker Image.\n• Docker Daemon (dockerd): Background service managing images, containers, networks, and volumes.\n• Docker Registry (Docker Hub): Centralized repository for uploading and downloading images.",
    example: "Example Docker Workflow:\n1. Developer writes `Dockerfile` for Node.js app.\n2. Command `docker build -t app:v1 .` builds layered image.\n3. Command `docker run -p 8080:8080 app:v1` instantiates container.",
    advantages: [
      "Lightweight: Shares host OS kernel; boots in milliseconds with megabyte-scale RAM usage.",
      "Consistency: Eliminates 'works on my machine' environmental disparities.",
      "Portability: Runs identically on developer laptops, bare-metal servers, and cloud instances."
    ],
    limitations: [
      "Kernel Sharing: Shares host kernel; does not provide strict hardware-level isolation like VMs.",
      "Linux Kernel Dependency: Requires Linux kernel primitives (or VM wrappers on Windows/macOS)."
    ],
    keyTakeaways: [
      "Docker containers use OS-level virtualization via Linux Namespaces and cgroups.",
      "Docker images consist of read-only stacked layers created via Union File Systems.",
      "Containers boot in milliseconds compared to minutes for hardware Virtual Machines."
    ],
    examFocus: [
      "★ Explain how Linux Namespaces and cgroups enable container isolation in Docker.",
      "★ Differentiate between a Docker Image and a Docker Container.",
      "★ Compare Virtual Machines (Hypervisor) vs. Docker Containers in terms of memory footprint, boot time, and kernel isolation.",
      "★ Describe the layered Union File System structure in Docker images."
    ],
    commonQuestions: [
      "1. What is Docker? Explain the concepts of Containers, Images, and Dockerfiles.",
      "2. Differentiate between Virtual Machines and Docker Containers with a architecture diagram.",
      "3. Explain the roles of Linux Namespaces and cgroups in containerization.",
      "4. Write a sample Dockerfile for a web application and explain its directives."
    ]
  },

  "kubernetes": {
    overview: "Kubernetes (K8s) is an open-source container orchestration engine originally developed by Google (Borg) for automating deployment, scaling, networking, and management of containerized workloads.",
    definition: "Kubernetes is a production-grade cluster orchestration system that declaratively manages containerized applications across a pool of worker nodes with automated scaling, self-healing, and service discovery.",
    coreConcept: "Control Plane & Worker Node Architecture:\n• Control Plane Components:\n  - kube-apiserver: Central REST API gateway.\n  - etcd: Distributed key-value store maintaining cluster state.\n  - kube-scheduler: Assigns unscheduled Pods to suitable worker nodes.\n  - kube-controller-manager: Runs controllers (Deployment, ReplicaSet, Node controllers).\n• Worker Node Components:\n  - kubelet: Node agent ensuring containers in Pod specs are running.\n  - kube-proxy: Manages network routing rules and load balancing.\n  - Container Runtime: Engine executing containers (containerd, CRI-O).",
    architectureOrSteps: "Core Abstractions:\n1. Pod: Smallest deployable unit containing one or more co-located containers.\n2. Deployment: Declarative spec managing ReplicaSets and rolling updates.\n3. Service: Stable virtual IP and DNS name balancing traffic across Pod replicas.\n4. Horizontal Pod Autoscaler (HPA): Dynamically scales pod count based on CPU/RAM metrics.",
    example: "Self-Healing Scenario:\n1. Pod 'web-7f8d' crashes on Worker Node 2.\n2. Kubelet detects process termination.\n3. ReplicaSet controller notes active count (2) < desired count (3).\n4. Scheduler assigns new Pod replacement onto healthy Worker Node 1.",
    advantages: [
      "Automated Self-Healing: Replaces failed containers, reschedules dead node pods.",
      "Horizontal Scaling: HPA scales pod replicas up/down based on traffic load.",
      "Zero-Downtime Rolling Updates: Progressively updates pod container versions without downtime."
    ],
    limitations: [
      "High Complexity: Steep learning curve for cluster configuration and maintenance.",
      "Resource Overhead: Control plane components require dedicated compute nodes."
    ],
    keyTakeaways: [
      "Kubernetes uses a Control Plane (API Server, etcd, Scheduler) + Worker Nodes (Kubelet, Kube-Proxy).",
      "Pods are the atomic deployable units in Kubernetes.",
      "Declarative state management automatically reconciles actual state to desired state."
    ],
    examFocus: [
      "★ Draw and explain the Kubernetes Control Plane and Worker Node architecture.",
      "★ Define Pod, Service, Deployment, and ReplicaSet in Kubernetes.",
      "★ Explain how Kubernetes performs Self-Healing when a worker node crashes.",
      "★ Describe Horizontal Pod Autoscaling (HPA) and Rolling Updates."
    ],
    commonQuestions: [
      "1. Explain the architecture of Kubernetes with a neat diagram.",
      "2. What is a Pod in Kubernetes? How does it differ from a Docker Container?",
      "3. Explain the role of etcd and kube-apiserver in the Kubernetes Control Plane.",
      "4. How does Kubernetes achieve self-healing and zero-downtime rolling updates?"
    ]
  }
};

/**
 * Helper function to retrieve theory for a module ID with dynamic fallback generation.
 */
export function getModuleTheory(module) {
  const moduleId = typeof module === 'string' ? module : module?.id;
  
  if (MODULE_THEORY[moduleId]) {
    return MODULE_THEORY[moduleId];
  }

  // Dynamic fallback theory generator for remaining topics
  const title = typeof module === 'object' ? module.title : moduleId;
  const desc = typeof module === 'object' ? module.description : 'Syllabus topic in Distributed Computing.';

  return {
    overview: `${title} is a key topic in distributed systems engineering. ${desc}`,
    definition: `${title} refers to the distributed computing principles, protocols, and architectural models governing ${title.toLowerCase()}.`,
    coreConcept: `Core Concepts:\n1. Distributed Coordination: Synchronizing execution state across remote network nodes.\n2. Message Interchange: Communicating parameters and payload data via network sockets.\n3. Fault Resilience: Maintaining operation despite node crashes or packet loss.\n4. Scalability Invariants: Sustaining throughput as node count grows.`,
    architectureOrSteps: `Architecture & Execution Flow:\n• Step 1: Process initialization and network binding.\n• Step 2: Protocol handshake and parameter exchange.\n• Step 3: Concurrent execution and local state computation.\n• Step 4: Output aggregation and state synchronization.`,
    example: `Practical Application:\nIn enterprise distributed systems, ${title} is utilized to ensure deterministic execution, high availability, and resource efficiency across clustered environments.`,
    advantages: [
      "Improved System Scalability: Distributes compute or storage workload across multiple physical nodes.",
      "Fault Tolerance: Prevents single points of failure through redundancy.",
      "Modularity: Decouples components into independently deployable software services."
    ],
    limitations: [
      "Network Latency: Subject to network propagation delays and bandwidth bounds.",
      "Coordination Overhead: Requires message exchanges to maintain global consistency."
    ],
    keyTakeaways: [
      `${title} plays an integral role in distributed coordination and architecture.`,
      "System design must balance performance, consistency, and network overhead.",
      "Proper fault handling is required to manage partial node failures."
    ],
    examFocus: [
      `★ Understand the fundamental definition and purpose of ${title}.`,
      `★ Identify the key architectural components and communication flow of ${title}.`,
      `★ Evaluate the primary advantages and performance trade-offs associated with ${title}.`
    ],
    commonQuestions: [
      `1. What is ${title}? Explain its core purpose in distributed systems.`,
      `2. Explain the step-by-step working of ${title} with a neat block diagram.`,
      `3. What are the key advantages and limitations of ${title}?`,
      `4. Discuss the exam-relevant trade-offs between performance and consistency in ${title}.`
    ]
  };
}

export default MODULE_THEORY;
