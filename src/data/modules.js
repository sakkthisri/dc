export const MODULES = [
  // ==================== UNIT 1 MODULES ====================
  // Category 1: Distributed Systems Fundamentals
  {
    id: "ds-introduction",
    title: "Distributed Systems Introduction",
    description: "An overview of distributed computing paradigms, hardware vs. software distribution, and autonomous node collaboration.",
    unit: "unit-1",
    category: "ds-fundamentals",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["fundamentals", "nodes", "overview"],
    icon: "Boxes",
    featured: false,
    learningObjectives: [
      "Define what constitutes a distributed system",
      "Understand node autonomy and communication networks",
      "Compare centralized vs. distributed systems"
    ]
  },
  {
    id: "ds-types",
    title: "Types of Distributed Systems",
    description: "Classification of distributed systems into high-performance compute clusters, grid computing, enterprise information systems, and pervasive systems.",
    unit: "unit-1",
    category: "ds-fundamentals",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["clusters", "grid", "enterprise"],
    icon: "Layers",
    featured: false,
    learningObjectives: [
      "Distinguish Cluster Computing from Grid Computing",
      "Understand Enterprise Application Integration (EAI)",
      "Explore Pervasive and Ubiquitous Computing"
    ]
  },
  {
    id: "ds-goals",
    title: "Distributed System Goals",
    description: "Core objectives including resource accessibility, openness, scalability, transparency, and fault resilience.",
    unit: "unit-1",
    category: "ds-fundamentals",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["goals", "openness", "accessibility"],
    icon: "Target",
    featured: false,
    learningObjectives: [
      "Identify the five primary design goals of distributed systems",
      "Evaluate trade-offs between openness and security",
      "Analyze resource sharing mechanisms"
    ]
  },
  {
    id: "ds-challenges",
    title: "Challenges in Distributed Systems",
    description: "Inherent difficulties: partial failures, non-deterministic latency, lack of global clock, security vulnerabilities, and state synchronization.",
    unit: "unit-1",
    category: "ds-fundamentals",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["latency", "partial-failures", "clocks"],
    icon: "AlertTriangle",
    featured: false,
    learningObjectives: [
      "Analyze the impact of partial failures",
      "Understand the implications of network latency variability",
      "Address state synchronization without shared memory"
    ]
  },
  {
    id: "concurrency",
    title: "Concurrency",
    description: "Simultaneous execution of multiple independent compute tasks across remote nodes and synchronization primitives.",
    unit: "unit-1",
    category: "ds-fundamentals",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["concurrency", "threads", "race-conditions"],
    icon: "GitFork",
    featured: false,
    learningObjectives: [
      "Understand concurrent execution in distributed nodes",
      "Identify race conditions and deadlocks in distributed contexts",
      "Explore non-blocking synchronization strategies"
    ]
  },
  {
    id: "resource-sharing",
    title: "Resource Sharing",
    description: "Mechanisms for safely sharing compute power, storage assets, and peripheral devices across a distributed network.",
    unit: "unit-1",
    category: "ds-fundamentals",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["resources", "allocation", "sharing"],
    icon: "Share2",
    featured: false,
    learningObjectives: [
      "Explore hardware and software resource allocation",
      "Understand client request queuing and authorization",
      "Analyze multi-tenant resource access"
    ]
  },
  {
    id: "scalability",
    title: "Scalability",
    description: "Horizontal vs. vertical scaling strategies, bottleneck analysis, and geographical/administrative scale limits.",
    unit: "unit-1",
    category: "ds-fundamentals",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["scaling", "horizontal", "vertical"],
    icon: "TrendingUp",
    featured: false,
    learningObjectives: [
      "Differentiate scale-up (vertical) vs scale-out (horizontal)",
      "Identify administrative and geographical scale bottlenecks",
      "Design techniques for stateless scaling"
    ]
  },
  {
    id: "transparency",
    title: "Transparency",
    description: "Types of transparency: Access, Location, Migration, Relocation, Replication, Concurrency, and Failure transparency.",
    unit: "unit-1",
    category: "ds-fundamentals",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["transparency", "location", "replication"],
    icon: "Eye",
    featured: false,
    learningObjectives: [
      "Define the 7 primary types of transparency",
      "Assess why 100% transparency is not always desirable",
      "Examine transparency implementation mechanisms"
    ]
  },

  // Category 2: Architectural Models
  {
    id: "client-server",
    title: "Client-Server Architecture",
    description: "Classic multi-tier architecture dividing workloads between service requestors (clients) and service providers (servers).",
    unit: "unit-1",
    category: "architectural-models",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["client", "server", "tiers"],
    icon: "Server",
    featured: false,
    learningObjectives: [
      "Understand 2-tier, 3-tier, and N-tier client-server models",
      "Identify server bottlenecks and single points of failure",
      "Analyze synchronous request-response semantics"
    ]
  },
  {
    id: "peer-to-peer",
    title: "Peer-to-Peer Architecture",
    description: "Decentralized architecture where every participant node acts simultaneously as client and server (servent).",
    unit: "unit-1",
    category: "architectural-models",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["p2p", "decentralized", "dht"],
    icon: "Users",
    featured: false,
    learningObjectives: [
      "Distinguish structured (DHT/Chord) vs unstructured P2P networks",
      "Evaluate routing efficiency and node churn tolerance",
      "Analyze resource discovery protocols"
    ]
  },
  {
    id: "hybrid-architecture",
    title: "Hybrid Architecture",
    description: "Combinations of centralized indexing with decentralized peer data transfers (e.g., BitTorrent tracker models).",
    unit: "unit-1",
    category: "architectural-models",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["hybrid", "bittorrent", "supernodes"],
    icon: "Network",
    featured: false,
    learningObjectives: [
      "Understand supernode topologies",
      "Analyze hybrid search and indexing strategies",
      "Compare hybrid resilience with pure P2P"
    ]
  },

  // Category 3: Time and Global States
  {
    id: "physical-clocks",
    title: "Physical Clocks",
    description: "Physical time synchronization algorithms including Cristian's Algorithm, Berkeley Algorithm, and NTP (Network Time Protocol).",
    unit: "unit-1",
    category: "time-global-states",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["clock", "ntp", "cristian", "berkeley"],
    icon: "Clock",
    featured: false,
    learningObjectives: [
      "Understand clock drift, skew, and offset in quartz oscillators",
      "Visualize Cristian's round-trip delay time sync",
      "Simulate the Berkeley master-slave clock averaging algorithm"
    ]
  },
  {
    id: "logical-clocks",
    title: "Logical Clocks",
    description: "Monotonically increasing event counters for establishing causal order without relying on synchronized physical time.",
    unit: "unit-1",
    category: "time-global-states",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["logical-clock", "timestamps", "events"],
    icon: "Watch",
    featured: false,
    learningObjectives: [
      "Define happens-before relationship (->)",
      "Understand logical clock increment rules",
      "Differentiate physical time from logical causality"
    ]
  },
  {
    id: "lamport-logical-clock",
    title: "Lamport Logical Clock",
    description: "Visualize Lamport timestamp increments on local events and message transmissions to guarantee partial ordering.",
    unit: "unit-1",
    category: "time-global-states",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["clock", "causality", "ordering"],
    icon: "Activity",
    featured: true,
    learningObjectives: [
      "Trace Lamport clock values across distributed timelines",
      "Understand total ordering extensions using process IDs",
      "Analyze event dependency graphs"
    ]
  },
  {
    id: "vector-clocks",
    title: "Vector Clocks",
    description: "An array of logical clocks per process to track full causal history and detect concurrent (un-ordered) events.",
    unit: "unit-1",
    category: "time-global-states",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["vector-clock", "concurrency", "causality"],
    icon: "Cpu",
    featured: true,
    learningObjectives: [
      "Construct and update clock vectors V[i]",
      "Detect concurrent events V(a) || V(b)",
      "Compare vector clock overhead with scalar Lamport clocks"
    ]
  },
  {
    id: "causality",
    title: "Causality",
    description: "Causal precedence relation (Happens-Before relation) and causal message delivery protocols.",
    unit: "unit-1",
    category: "time-global-states",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["causality", "happens-before", "ordering"],
    icon: "GitCommit",
    featured: false,
    learningObjectives: [
      "Formalize Leslie Lamport's happens-before relation",
      "Differentiate causal order from total order",
      "Analyze causal message delivery constraints"
    ]
  },
  {
    id: "global-state",
    title: "Global State",
    description: "Defining consistent global states and cuts across asynchronous distributed systems.",
    unit: "unit-1",
    category: "time-global-states",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["global-state", "consistent-cut", "timeline"],
    icon: "Globe",
    featured: false,
    learningObjectives: [
      "Understand consistent vs inconsistent cuts",
      "Analyze channel states and process states",
      "Evaluate global state predicates"
    ]
  },
  {
    id: "snapshot-algorithms",
    title: "Snapshot Algorithms",
    description: "Chandy-Lamport distributed snapshot algorithm for capturing consistent global states without halting computation.",
    unit: "unit-1",
    category: "time-global-states",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["snapshot", "chandy-lamport", "marker"],
    icon: "Camera",
    featured: false,
    learningObjectives: [
      "Trace marker message propagation in Chandy-Lamport",
      "Capture in-flight network channel states",
      "Reconstruct a consistent global snapshot"
    ]
  },

  // Category 4: Inter-Process Communication
  {
    id: "message-passing",
    title: "Message Passing",
    description: "Synchronous vs. asynchronous message passing primitives, buffering strategies, and socket level communication.",
    unit: "unit-1",
    category: "ipc",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["messaging", "sockets", "buffers"],
    icon: "Mail",
    featured: false,
    learningObjectives: [
      "Compare blocking vs non-blocking IPC",
      "Analyze zero-copy memory buffers",
      "Simulate packet loss and retransmission"
    ]
  },
  {
    id: "rpc",
    title: "RPC (Remote Procedure Call)",
    description: "Abstractions enabling remote function invocation with stubs, marshaling/unmarshaling, and IDL specifications.",
    unit: "unit-1",
    category: "ipc",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["rpc", "stubs", "marshaling"],
    icon: "Code",
    featured: false,
    learningObjectives: [
      "Trace client stub and server stub call flow",
      "Understand data serialization (marshaling)",
      "Explore RPC execution semantics (at-most-once, at-least-once)"
    ]
  },
  {
    id: "rmi",
    title: "RMI (Remote Method Invocation)",
    description: "Object-oriented RPC allowing invocation of methods on remote objects in distributed object systems.",
    unit: "unit-1",
    category: "ipc",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["rmi", "java-rmi", "objects"],
    icon: "FileCode",
    featured: false,
    learningObjectives: [
      "Understand remote object references and registries",
      "Compare object serialization with primitive RPC marshaling",
      "Explore distributed garbage collection (DGC)"
    ]
  },
  {
    id: "multicast",
    title: "Multicast",
    description: "Group communication protocols delivering messages to specific process groups with reliability and ordering guarantees.",
    unit: "unit-1",
    category: "ipc",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["multicast", "group-comm", "reliable-multicast"],
    icon: "Radio",
    featured: false,
    learningObjectives: [
      "Distinguish IP Multicast from Overlay Multicast",
      "Analyze FIFO, Causal, and Atomic multicast ordering",
      "Explore group membership management"
    ]
  },
  {
    id: "broadcast",
    title: "Broadcast",
    description: "Flooding and gossiping protocols for disseminating data messages across all system nodes.",
    unit: "unit-1",
    category: "ipc",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["broadcast", "flooding", "gossip"],
    icon: "Share2",
    featured: false,
    learningObjectives: [
      "Analyze message overhead in network flooding",
      "Simulate epidemic/gossip broadcast propagation",
      "Prevent broadcast storms via tree routing"
    ]
  },

  // Category 5: Coordination and Agreement
  {
    id: "election-algorithms",
    title: "Election Algorithms",
    description: "Leader election protocols: Bully Algorithm and Ring Algorithm for choosing a coordinator node after failures.",
    unit: "unit-1",
    category: "coordination-agreement",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["election", "bully", "ring-election"],
    icon: "Award",
    featured: false,
    learningObjectives: [
      "Simulate Bully Algorithm election upon leader crash",
      "Trace token-ring leader election passings",
      "Evaluate time and message complexity of elections"
    ]
  },
  {
    id: "ring-election",
    title: "Ring Leader Election",
    description: "Logical ring topology leader election passing election messages around active nodes to elect the highest ID leader.",
    unit: "unit-1",
    category: "coordination-agreement",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["election", "ring", "coordination"],
    icon: "RotateCw",
    featured: false,
    learningObjectives: [
      "Simulate token-ring message passing during coordinator failure",
      "Observe active vs non-participant node state changes",
      "Understand O(N) message overhead in ring election"
    ]
  },
  {
    id: "paxos-consensus",
    title: "Paxos Consensus",
    description: "The classic consensus protocol achieving agreement across unreliable networks via Proposers, Acceptors, and Learners.",
    unit: "unit-1",
    category: "coordination-agreement",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["paxos", "consensus", "agreement"],
    icon: "Shield",
    featured: true,
    learningObjectives: [
      "Visualize Phase 1 (Prepare/Promise) and Phase 2 (Accept/Accepted)",
      "Understand quorum intersection and majority voting",
      "Simulate proposer duels and Multi-Paxos optimizations"
    ]
  },
  {
    id: "raft-consensus",
    title: "Raft Consensus",
    description: "An understandable consensus algorithm using Leader Election, Log Replication, and Safety invariants.",
    unit: "unit-1",
    category: "coordination-agreement",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["raft", "consensus", "log-replication"],
    icon: "CheckCircle",
    featured: true,
    learningObjectives: [
      "Observe Leader, Follower, and Candidate state transitions",
      "Trace AppendEntries RPC and log entry commits",
      "Inject network partitions and observe split-brain safety"
    ]
  },

  // Category 6: Distributed Mutual Exclusion
  {
    id: "distributed-mutual-exclusion",
    title: "Distributed Mutual Exclusion Algorithms",
    description: "Ricart-Agrawala timestamp-based algorithm and Maekawa quorum-based mutual exclusion without central lock servers.",
    unit: "unit-1",
    category: "mutual-exclusion",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["mutual-exclusion", "ricart-agrawala", "maekawa"],
    icon: "Lock",
    featured: false,
    learningObjectives: [
      "Compare Centralized, Token-Ring, and Permission-based exclusion",
      "Trace Ricart-Agrawala REQUEST and REPLY timestamps",
      "Analyze deadlock and starvation prevention"
    ]
  },

  // Category 7: Middleware and Message Queuing
  {
    id: "rabbitmq",
    title: "RabbitMQ",
    description: "AMQP-based message broker with Exchanges (Direct, Fanout, Topic, Headers) and Queues for message routing.",
    unit: "unit-1",
    category: "middleware-queuing",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["rabbitmq", "amqp", "queues"],
    icon: "Inbox",
    featured: false,
    learningObjectives: [
      "Visualize message publication to AMQP Exchanges",
      "Trace binding key routing rules to target queues",
      "Understand dead-letter exchanges and consumer acknowledgments"
    ]
  },
  {
    id: "kafka",
    title: "Apache Kafka",
    description: "Distributed event streaming platform using partitioned commit logs, consumer groups, and high-throughput ordering.",
    unit: "unit-1",
    category: "middleware-queuing",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["kafka", "streaming", "partitions"],
    icon: "Layers",
    featured: false,
    learningObjectives: [
      "Understand Topic Partitioning and replica offsets",
      "Trace Consumer Group rebalancing",
      "Examine log retention and zero-copy disk I/O"
    ]
  },


  // ==================== UNIT 2 MODULES ====================
  // Category 8: Distributed File Systems
  {
    id: "distributed-file-systems",
    title: "Distributed File Systems",
    description: "Architecture of network storage systems providing uniform file namespace and transparent remote access.",
    unit: "unit-2",
    category: "dfs",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["dfs", "storage", "namespace"],
    icon: "FolderTree",
    featured: false,
    learningObjectives: [
      "Understand file caching vs direct remote access",
      "Analyze client-side and server-side state maintenance",
      "Compare file locking mechanisms"
    ]
  },
  {
    id: "hdfs",
    title: "HDFS (Hadoop Distributed File System)",
    description: "Master-Worker architecture with NameNode managing metadata and DataNodes storing replicated block data.",
    unit: "unit-2",
    category: "dfs",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["hdfs", "hadoop", "namenode", "datanode"],
    icon: "Database",
    featured: false,
    learningObjectives: [
      "Understand NameNode block mapping metadata",
      "Visualize DataNode block replication pipelines (3x default)",
      "Simulate DataNode heartbeat checks and recovery"
    ]
  },
  {
    id: "nfs",
    title: "NFS (Network File System)",
    description: "Sun Microsystems' RPC-based remote file system enabling transparent file mounting over virtual file systems (VFS).",
    unit: "unit-2",
    category: "dfs",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["nfs", "vfs", "rpc-storage"],
    icon: "HardDrive",
    featured: false,
    learningObjectives: [
      "Understand Virtual File System (VFS) abstractions",
      "Analyze NFS statless RPC operation design",
      "Compare NFS v3 and NFS v4 lease locking"
    ]
  },

  // Category 9: Distributed Shared Memory
  {
    id: "dsm",
    title: "Distributed Shared Memory (DSM)",
    description: "Software and hardware implementations providing virtual shared memory across distributed non-shared memory nodes.",
    unit: "unit-2",
    category: "dsm",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["dsm", "shared-memory", "coherence"],
    icon: "Cpu",
    featured: false,
    learningObjectives: [
      "Understand page-based DSM invalidation vs update protocols",
      "Analyze false sharing phenomena in memory pages",
      "Evaluate memory consistency protocol costs"
    ]
  },

  // Category 10: Resource Management
  {
    id: "load-balancing",
    title: "Load Balancing",
    description: "Algorithms for distributing incoming client traffic (Round Robin, Least Connections, Consistent Hashing) across servers.",
    unit: "unit-2",
    category: "resource-management",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["load-balancer", "hashing", "routing"],
    icon: "Sliders",
    featured: false,
    learningObjectives: [
      "Compare Layer 4 (Transport) and Layer 7 (Application) load balancing",
      "Visualize Consistent Hashing ring placement",
      "Simulate health-check node removals"
    ]
  },
  {
    id: "resource-allocation",
    title: "Resource Allocation",
    description: "Dynamic allocation of CPU, memory, and bandwidth constraints using fair-sharing and dominant resource fairness (DRF).",
    unit: "unit-2",
    category: "resource-management",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["allocation", "drf", "fairness"],
    icon: "PieChart",
    featured: false,
    learningObjectives: [
      "Understand Dominant Resource Fairness (DRF)",
      "Analyze multi-resource bin packing algorithms",
      "Simulate priority preemption"
    ]
  },
  {
    id: "distributed-scheduling",
    title: "Distributed Scheduling",
    description: "Centralized and decentralized task schedulers assigning workload jobs across heterogeneous compute clusters.",
    unit: "unit-2",
    category: "resource-management",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["scheduling", "jobs", "cluster"],
    icon: "Calendar",
    featured: false,
    learningObjectives: [
      "Compare monolithic, two-tier (Mesos), and shared-state schedulers",
      "Evaluate task placement latency vs resource utilization",
      "Simulate gang scheduling"
    ]
  },

  // Category 11: Fault Tolerance
  {
    id: "failure-detection",
    title: "Failure Detection",
    description: "Heartbeat monitors, gossip-based failure detectors, and Phi Accrual failure detection algorithms.",
    unit: "unit-2",
    category: "fault-tolerance",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["heartbeat", "failure-detector", "phi-accrual"],
    icon: "Activity",
    featured: false,
    learningObjectives: [
      "Distinguish accurate vs complete failure detectors",
      "Simulate heartbeat timeout estimation under network jitter",
      "Visualize Phi Accrual probabilistic failure scoring"
    ]
  },
  {
    id: "failure-models",
    title: "Failure Models",
    description: "Hierarchy of failures: Crash-stop, Crash-recovery, Omission failures, Arbitrary/Byzantine failures.",
    unit: "unit-2",
    category: "fault-tolerance",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["failures", "byzantine", "crash-stop"],
    icon: "ShieldAlert",
    featured: false,
    learningObjectives: [
      "Categorize crash, omission, timing, and Byzantine failures",
      "Determine node quorum bounds for failure recovery (2f+1 vs 3f+1)",
      "Analyze masking techniques for unannounced crashes"
    ]
  },
  {
    id: "replication",
    title: "Replication",
    description: "Active replication (State Machine Replication) vs. Passive replication (Primary-Backup) strategies.",
    unit: "unit-2",
    category: "fault-tolerance",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["replication", "primary-backup", "state-machine"],
    icon: "Copy",
    featured: false,
    learningObjectives: [
      "Compare Primary-Backup logging with State Machine Replication",
      "Analyze synchronous vs asynchronous replication delay",
      "Trace failover sequence upon primary crash"
    ]
  },
  {
    id: "recovery",
    title: "Recovery",
    description: "Checkpointing, write-ahead logging (WAL), and message logging for restoring consistent node states after crashes.",
    unit: "unit-2",
    category: "fault-tolerance",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["recovery", "checkpointing", "wal"],
    icon: "RotateCcw",
    featured: false,
    learningObjectives: [
      "Understand coordinated vs uncoordinated checkpointing",
      "Avoid domino effect during backward recovery",
      "Trace Write-Ahead Log (WAL) replay"
    ]
  },
  {
    id: "reliability",
    title: "Reliability",
    description: "Quantifying mean time between failures (MTBF), mean time to repair (MTTR), and reliable delivery protocols.",
    unit: "unit-2",
    category: "fault-tolerance",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["reliability", "mtbf", "mttr"],
    icon: "ShieldCheck",
    featured: false,
    learningObjectives: [
      "Calculate MTBF and MTTR metrics",
      "Analyze end-to-end argument in system reliability",
      "Evaluate redundancy cost trade-offs"
    ]
  },
  {
    id: "availability",
    title: "Availability",
    description: "Measuring system availability (99.999% 'five nines'), SLA constraints, and multi-region failover design.",
    unit: "unit-2",
    category: "fault-tolerance",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["availability", "nines", "sla"],
    icon: "CheckCircle",
    featured: false,
    learningObjectives: [
      "Compute system uptime percentages and downtime budgets",
      "Design multi-datacenter failover routing",
      "Analyze high-availability topologies"
    ]
  },

  // Category 12: Distributed Databases
  {
    id: "distributed-databases",
    title: "Distributed Databases",
    description: "Architectural overview of distributed RDBMS, data fragmentation, horizontal partitioning (sharding), and catalog management.",
    unit: "unit-2",
    category: "distributed-databases",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["databases", "sharding", "fragmentation"],
    icon: "Database",
    featured: false,
    learningObjectives: [
      "Understand Horizontal (Sharding) and Vertical Fragmentation",
      "Trace distributed query optimization and execution trees",
      "Analyze global dictionary and catalog management"
    ]
  },
  {
    id: "data-fragmentation",
    title: "Data Fragmentation",
    description: "Dividing global database tables into horizontal, vertical, or hybrid fragments distributed across nodes.",
    unit: "unit-2",
    category: "distributed-databases",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["fragmentation", "horizontal", "vertical"],
    icon: "Grid",
    featured: false,
    learningObjectives: [
      "Formulate completeness, reconstruction, and disjointness rules",
      "Visualize horizontal predicate partitioning",
      "Reconstruct original tables using joins and unions"
    ]
  },
  {
    id: "data-replication",
    title: "Data Replication",
    description: "Full vs partial data replication strategies for increasing database read throughput and query fault tolerance.",
    unit: "unit-2",
    category: "distributed-databases",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["replication", "db-replication", "read-replicas"],
    icon: "Copy",
    featured: false,
    learningObjectives: [
      "Analyze full table vs selective row replication",
      "Evaluate read replica scalability vs write amplification",
      "Resolve write conflicts in multi-master setups"
    ]
  },

  // Category 13: Consistency Models
  {
    id: "cap-theorem",
    title: "CAP Theorem",
    description: "Eric Brewer's theorem proving a distributed data store can simultaneously provide at most two of: Consistency, Availability, and Partition Tolerance.",
    unit: "unit-2",
    category: "consistency-models",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["cap-theorem", "consistency", "availability", "partition"],
    icon: "Triangle",
    featured: true,
    learningObjectives: [
      "Understand why network partitions (P) are inevitable in real networks",
      "Compare CP systems (HBase, MongoDB) vs AP systems (Cassandra, CouchDB)",
      "Explore PACELC theorem extensions for latency trade-offs"
    ]
  },
  {
    id: "acid-properties",
    title: "ACID Properties",
    description: "Atomicity, Consistency, Isolation, and Durability guarantees extended from single-node to distributed transaction processing.",
    unit: "unit-2",
    category: "consistency-models",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["acid", "transactions", "atomicity"],
    icon: "CheckSquare",
    featured: false,
    learningObjectives: [
      "Understand Distributed Isolation Levels (Read Committed, Snapshot Isolation)",
      "Analyze distributed deadlock detection algorithms",
      "Ensure cross-node durability"
    ]
  },
  {
    id: "eventual-consistency",
    title: "Eventual Consistency",
    description: "Weak consistency model guaranteeing that if no new updates are made, all replicas will eventually converge to the same value.",
    unit: "unit-2",
    category: "consistency-models",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["eventual-consistency", "convergence", "anti-entropy"],
    icon: "GitBranch",
    featured: false,
    learningObjectives: [
      "Understand Read-Repair and Anti-Entropy (Merkle tree) sync",
      "Simulate Last-Write-Wins (LWW) conflict resolution",
      "Analyze Conflict-Free Replicated Data Types (CRDTs)"
    ]
  },

  // Category 14: Distributed Transactions
  {
    id: "two-phase-commit",
    title: "Two-Phase Commit (2PC)",
    description: "Atomic commit protocol ensuring all nodes commit or abort a transaction together via Prepare and Commit phases.",
    unit: "unit-2",
    category: "distributed-transactions",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["2pc", "commit", "coordinator", "atomicity"],
    icon: "ArrowRightLeft",
    featured: true,
    learningObjectives: [
      "Trace Phase 1 (Prepare vote) and Phase 2 (Commit/Abort execution)",
      "Analyze coordinator blocking vulnerability during node crashes",
      "Understand transaction log persistence"
    ]
  },
  {
    id: "three-phase-commit",
    title: "Three-Phase Commit (3PC)",
    description: "Non-blocking commitment protocol introducing a Pre-Commit state to eliminate 2PC blocking during coordinator failures.",
    unit: "unit-2",
    category: "distributed-transactions",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["3pc", "non-blocking", "commit"],
    icon: "GitCommit",
    featured: false,
    learningObjectives: [
      "Trace Can-Commit, Pre-Commit, and Do-Commit state transitions",
      "Understand how timeouts break blocking deadlocks",
      "Evaluate 3PC message latency overhead compared to 2PC"
    ]
  },

  // Category 15: NoSQL Databases
  {
    id: "nosql-databases",
    title: "NoSQL Databases Overview",
    description: "Classification of non-relational distributed databases: Key-Value, Document, Wide-Column, and Graph stores.",
    unit: "unit-2",
    category: "nosql-databases",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["nosql", "key-value", "document", "column"],
    icon: "Server",
    featured: false,
    learningObjectives: [
      "Compare schema-less vs relational data modeling",
      "Understand horizontal partition keys",
      "Select NoSQL data stores based on read/write access patterns"
    ]
  },
  {
    id: "cassandra",
    title: "Apache Cassandra",
    description: "Masterless wide-column distributed database based on Dynamo and Bigtable architecture using consistent hashing rings.",
    unit: "unit-2",
    category: "nosql-databases",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["cassandra", "ring", "gossip", "cql"],
    icon: "Database",
    featured: false,
    learningObjectives: [
      "Visualize token ring partitioning and peer Gossip protocols",
      "Configure Read/Write Tunable Consistency (ONE, QUORUM, ALL)",
      "Trace LSM-tree write path (Memtable -> SSTable)"
    ]
  },
  {
    id: "mongodb",
    title: "MongoDB Distributed Sharding",
    description: "Document-oriented database utilizing Replica Sets for high availability and Sharded Clusters for horizontal scale.",
    unit: "unit-2",
    category: "nosql-databases",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["mongodb", "sharding", "mongos", "bson"],
    icon: "FileText",
    featured: false,
    learningObjectives: [
      "Understand Config Servers, Query Routers (mongos), and Shards",
      "Visualize Range-based vs Hashed Shard Keys",
      "Trace chunk splitting and automated balancing"
    ]
  },
  {
    id: "redis",
    title: "Redis Cluster & In-Memory Data",
    description: "In-memory data structure store supporting high-speed caching, pub/sub, sentinel monitoring, and cluster hash slots.",
    unit: "unit-2",
    category: "nosql-databases",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["redis", "in-memory", "hash-slots", "cache"],
    icon: "Zap",
    featured: false,
    learningObjectives: [
      "Visualize Redis 16384 Hash Slot distribution",
      "Trace Sentinel failover promotion of replica nodes",
      "Analyze sub-millisecond in-memory cache lookups"
    ]
  },

  // Category 16: Data Warehousing and Data Mining
  {
    id: "distributed-data-warehousing",
    title: "Distributed Data Warehousing",
    description: "Massively Parallel Processing (MPP) analytical database architectures, star/snowflake schemas, and columnar storage.",
    unit: "unit-2",
    category: "warehousing-mining",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["data-warehouse", "mpp", "columnar"],
    icon: "PieChart",
    featured: false,
    learningObjectives: [
      "Compare Row-oriented vs Columnar storage formats (Parquet, ORC)",
      "Understand MPP query broadcast and shuffle steps",
      "Design analytical star schemas for parallel aggregation"
    ]
  },
  {
    id: "distributed-data-mining",
    title: "Distributed Data Mining",
    description: "Parallel machine learning algorithms and pattern mining strategies operating over partitioned big data sets.",
    unit: "unit-2",
    category: "warehousing-mining",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["data-mining", "ml", "parallel-clustering"],
    icon: "TrendingUp",
    featured: false,
    learningObjectives: [
      "Understand Parallel Apriori and K-Means clustering",
      "Analyze communication costs during model parameter sync",
      "Explore federated learning privacy guarantees"
    ]
  },

  // Category 17: Distributed Ledger and Blockchain
  {
    id: "distributed-ledger",
    title: "Distributed Ledger Technology",
    description: "Shared, immutable cryptographic ledgers synchronized across peer-to-peer networks without central authorities.",
    unit: "unit-2",
    category: "ledger-blockchain",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["dlt", "ledger", "p2p-sync"],
    icon: "Link",
    featured: false,
    learningObjectives: [
      "Understand append-only distributed state transition logs",
      "Compare permissioned vs permissionless ledgers",
      "Analyze cryptographic hash chain pointers"
    ]
  },
  {
    id: "blockchain",
    title: "Blockchain & Consensus Protocols",
    description: "Structure of blocks, Merkle trees, Proof of Work (PoW), Proof of Stake (PoS), and Byzantine Fault Tolerant agreement.",
    unit: "unit-2",
    category: "ledger-blockchain",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["blockchain", "proof-of-work", "merkle-tree"],
    icon: "Lock",
    featured: false,
    learningObjectives: [
      "Visualize Merkle Tree transaction verification roots",
      "Simulate Proof-of-Work nonce mining difficulty",
      "Trace fork resolution via longest-chain rule"
    ]
  },


  // ==================== UNIT 3 MODULES ====================
  // Category 18: Distributed Programming Models
  {
    id: "mapreduce",
    title: "MapReduce Framework",
    description: "Google's programming model for processing vast data sets with parallel Map, Partition, Shuffle/Sort, and Reduce phases.",
    unit: "unit-3",
    category: "programming-models",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["mapreduce", "hadoop", "batch", "shuffle"],
    icon: "GitMerge",
    featured: true,
    learningObjectives: [
      "Trace key-value transformation in Map and Reduce functions",
      "Visualize the intermediate disk shuffle and sort phase",
      "Understand speculative execution of slow worker tasks"
    ]
  },
  {
    id: "mapreduce-word-count",
    title: "MapReduce Word Count",
    description: "Step-by-step canonical example demonstrating text tokenization, mapping to (word, 1), shuffling by key, and sum reduction.",
    unit: "unit-3",
    category: "programming-models",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["word-count", "mapreduce-demo", "tokens"],
    icon: "FileText",
    featured: false,
    learningObjectives: [
      "Step through line splitting into key-value pairs",
      "Observe partitioner hash assignments to reducers",
      "Calculate final word frequency aggregation"
    ]
  },
  {
    id: "apache-spark",
    title: "Apache Spark Engine",
    description: "In-memory distributed data processing engine offering up to 100x faster execution than disk-bound MapReduce.",
    unit: "unit-3",
    category: "programming-models",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["spark", "in-memory", "driver-executor"],
    icon: "Zap",
    featured: false,
    learningObjectives: [
      "Understand Driver Program, Cluster Manager, and Executors",
      "Analyze lazy evaluation of transformations vs actions",
      "Compare Spark SQL, Streaming, and MLlib modules"
    ]
  },
  {
    id: "rdd",
    title: "Resilient Distributed Datasets (RDD)",
    description: "Fault-tolerant collection of elements that can be operated on in parallel across a cluster with lineage tracking.",
    unit: "unit-3",
    category: "programming-models",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["rdd", "spark", "lineage", "immutable"],
    icon: "Database",
    featured: false,
    learningObjectives: [
      "Understand RDD immutability and partition layouts",
      "Trace RDD Lineage Graph for automatic fault recovery",
      "Distinguish narrow dependencies (map) from wide dependencies (reduceByKey)"
    ]
  },
  {
    id: "spark-dag",
    title: "Spark Directed Acyclic Graph (DAG)",
    description: "Execution planning component converting logical transformation chains into physical stages, tasks, and worker pipelines.",
    unit: "unit-3",
    category: "programming-models",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["dag", "spark-scheduler", "stages"],
    icon: "GitFork",
    featured: false,
    learningObjectives: [
      "Visualize DAG Scheduler stage boundary splits on shuffle dependencies",
      "Trace task submission to worker thread pools",
      "Optimize stage execution plans"
    ]
  },
  {
    id: "apache-flink",
    title: "Apache Flink",
    description: "Stateful stream processing framework providing event-time processing, low latency, and exactly-once state guarantees.",
    unit: "unit-3",
    category: "programming-models",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["flink", "streaming", "event-time", "state"],
    icon: "Activity",
    featured: false,
    learningObjectives: [
      "Compare true stream processing vs micro-batching",
      "Understand Event Time, Ingestion Time, and Processing Time watermarks",
      "Trace Chandy-Lamport checkpointing in Flink state backends"
    ]
  },
  {
    id: "stream-processing",
    title: "Stream Processing Concepts",
    description: "Continuous real-time data ingestion, sliding/tumbling window operations, and late-arriving event handling.",
    unit: "unit-3",
    category: "programming-models",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["streaming", "windows", "watermarks"],
    icon: "Sliders",
    featured: false,
    learningObjectives: [
      "Differentiate Tumbling, Sliding, and Session Windows",
      "Understand Watermarks for handling out-of-order data",
      "Analyze state size management in streaming applications"
    ]
  },

  // Category 19 & 20: Cloud Computing & Cloud Platforms
  {
    id: "cloud-computing",
    title: "Cloud Computing Fundamentals",
    description: "On-demand availability of computer system resources, data storage, and compute power without direct active management.",
    unit: "unit-3",
    category: "cloud-computing",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["cloud", "virtualization", "on-demand"],
    icon: "Cloud",
    featured: false,
    learningObjectives: [
      "Understand NIST definition of cloud computing characteristics",
      "Analyze hypervisor virtualization (KVM, Xen)",
      "Evaluate cost models: Pay-as-you-go vs Reserved"
    ]
  },
  {
    id: "cloud-service-models",
    title: "Cloud Service Models (IaaS, PaaS, SaaS)",
    description: "Service abstraction hierarchy: Infrastructure as a Service, Platform as a Service, and Software as a Service.",
    unit: "unit-3",
    category: "cloud-computing",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["iaas", "paas", "saas", "models"],
    icon: "Layers",
    featured: false,
    learningObjectives: [
      "Map responsibility boundaries between cloud provider and customer",
      "Analyze examples: AWS EC2 (IaaS), Heroku/App Engine (PaaS), Google Workspace (SaaS)",
      "Select service models based on control requirements"
    ]
  },
  {
    id: "cloud-deployment-models",
    title: "Cloud Deployment Models",
    description: "Public, Private, Hybrid, and Multi-Cloud deployment architectures evaluating isolation, compliance, and latency.",
    unit: "unit-3",
    category: "cloud-computing",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["public-cloud", "private-cloud", "hybrid"],
    icon: "Globe",
    featured: false,
    learningObjectives: [
      "Compare security and compliance profiles of Private vs Public clouds",
      "Analyze Hybrid Cloud VPN/DirectConnect inter-cloud bursting",
      "Evaluate multi-cloud vendor lock-in mitigation"
    ]
  },
  {
    id: "aws-platform",
    title: "Amazon Web Services (AWS)",
    description: "Architecture of AWS cloud infrastructure: EC2, S3, VPC, IAM, DynamoDB, and Global Regions/Availability Zones.",
    unit: "unit-3",
    category: "cloud-platforms",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["aws", "ec2", "s3", "vpc"],
    icon: "Cloud",
    featured: false,
    learningObjectives: [
      "Understand AWS Regions, Availability Zones (AZs), and Edge Locations",
      "Trace Virtual Private Cloud (VPC) subnet routing and Security Groups",
      "Examine S3 bucket storage consistency models"
    ]
  },
  {
    id: "azure-platform",
    title: "Microsoft Azure",
    description: "Enterprise cloud platform: Azure VMs, Resource Groups, Azure Active Directory (Entra ID), Blob Storage, and AKS.",
    unit: "unit-3",
    category: "cloud-platforms",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["azure", "entra-id", "resource-groups"],
    icon: "Globe",
    featured: false,
    learningObjectives: [
      "Understand Azure Resource Manager (ARM) template deployments",
      "Analyze Entra ID identity federation",
      "Explore Azure Region Pairs for disaster recovery"
    ]
  },
  {
    id: "gcp-platform",
    title: "Google Cloud Platform (GCP)",
    description: "Google's cloud infrastructure: Compute Engine, BigQuery, GKE, VPC Networks, and Global Fiber Backbone.",
    unit: "unit-3",
    category: "cloud-platforms",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["gcp", "bigquery", "gke", "fiber"],
    icon: "Cpu",
    featured: false,
    learningObjectives: [
      "Understand GCP Global VPC network topology",
      "Analyze BigQuery serverless SQL execution engine (Dremel)",
      "Explore Google Kubernetes Engine (GKE) autopilot"
    ]
  },

  // Category 21: Containerization and Orchestration
  {
    id: "containerization",
    title: "Containerization Fundamentals",
    description: "OS-level virtualization using Linux cgroups and namespaces to isolate application processes efficiently.",
    unit: "unit-3",
    category: "containerization-orchestration",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["containers", "cgroups", "namespaces"],
    icon: "Box",
    featured: false,
    learningObjectives: [
      "Compare Virtual Machines (Hypervisor) vs Containers (Shared OS Kernel)",
      "Understand Linux namespaces (PID, NET, MNT, IPC, UTS)",
      "Analyze cgroups CPU and memory quota limits"
    ]
  },
  {
    id: "docker",
    title: "Docker Platform",
    description: "Docker Engine, Dockerfiles, image union file systems (OverlayFS), and container runtime lifecycle management.",
    unit: "unit-3",
    category: "containerization-orchestration",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["docker", "overlayfs", "dockerfile"],
    icon: "Box",
    featured: false,
    learningObjectives: [
      "Understand Dockerfile multi-stage builds and layer caching",
      "Visualize Overlay2 copy-on-write storage driver",
      "Manage container networks (bridge, host, overlay)"
    ]
  },
  {
    id: "docker-image-to-container",
    title: "Docker Image to Container Lifecycle",
    description: "Interactive visualizer stepping through pulling image layers, creating container file systems, and starting isolated processes.",
    unit: "unit-3",
    category: "containerization-orchestration",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["docker-lifecycle", "image-layers", "runtime"],
    icon: "PlayCircle",
    featured: false,
    learningObjectives: [
      "Inspect OCI Image specifications and manifest JSON",
      "Step through layer extraction and writeable layer mounting",
      "Trace entrypoint execution and signal handling"
    ]
  },
  {
    id: "kubernetes",
    title: "Kubernetes Orchestration Engine",
    description: "Production-grade container orchestration managing automated deployment, scaling, and operation of application containers across worker nodes.",
    unit: "unit-3",
    category: "containerization-orchestration",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["kubernetes", "k8s", "control-plane", "orchestration"],
    icon: "Box",
    featured: true,
    learningObjectives: [
      "Understand K8s Control Plane components (kube-apiserver, etcd, kube-scheduler, controller-manager)",
      "Analyze Worker Node agents (kubelet, kube-proxy, container runtime)",
      "Trace declarative reconciliation loops"
    ]
  },
  {
    id: "kubernetes-pods",
    title: "Kubernetes Pods & Services",
    description: "Smallest deployable units in Kubernetes sharing network IP namespace, storage volumes, and container lifecycle specifications.",
    unit: "unit-3",
    category: "containerization-orchestration",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["k8s-pods", "services", "cluster-ip", "ingress"],
    icon: "Layers",
    featured: false,
    learningObjectives: [
      "Visualize multi-container sidecar Pod patterns",
      "Trace ClusterIP, NodePort, and LoadBalancer routing",
      "Understand Ingress controllers and TLS termination"
    ]
  },
  {
    id: "kubernetes-scaling",
    title: "Kubernetes Scaling & HPA",
    description: "Horizontal Pod Autoscaler (HPA) adjusting pod replica counts automatically based on observed CPU/memory utilization.",
    unit: "unit-3",
    category: "containerization-orchestration",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["k8s-scaling", "hpa", "autoscaling"],
    icon: "TrendingUp",
    featured: false,
    learningObjectives: [
      "Understand HPA target metric calculation loops",
      "Visualize Cluster Autoscaler node pool expansion",
      "Simulate traffic surge pod scaling"
    ]
  },
  {
    id: "kubernetes-self-healing",
    title: "Kubernetes Self-Healing",
    description: "Automated container restarts, liveness/readiness probe failures, node evacuation, and pod rescheduling upon crashes.",
    unit: "unit-3",
    category: "containerization-orchestration",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["self-healing", "probes", "failover"],
    icon: "ShieldCheck",
    featured: false,
    learningObjectives: [
      "Configure Liveness, Readiness, and Startup probes",
      "Observe ReplicaSet replacement of crashed Pods",
      "Trace Node Taints and Tolerations during node eviction"
    ]
  },

  // Category 22: Edge Computing and IoT
  {
    id: "edge-computing",
    title: "Edge Computing Architecture",
    description: "Decentralized computing paradigm bringing computation and data storage closer to location sources where data is needed.",
    unit: "unit-3",
    category: "edge-iot",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["edge", "low-latency", "decentralized"],
    icon: "Activity",
    featured: false,
    learningObjectives: [
      "Understand Cloud-to-Edge latency reduction gains",
      "Analyze bandwidth savings from edge data filtering",
      "Explore edge AI model inference deployments"
    ]
  },
  {
    id: "edge-vs-cloud",
    title: "Edge vs Cloud Computing Trade-offs",
    description: "Comparative visualizer evaluating latency, compute capacity, bandwidth costs, security, and intermittent connectivity.",
    unit: "unit-3",
    category: "edge-iot",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["edge-vs-cloud", "trade-offs", "latency"],
    icon: "ArrowRightLeft",
    featured: false,
    learningObjectives: [
      "Compare millisecond edge response times vs cloud round-trips",
      "Evaluate storage capacity constraints at the edge",
      "Formulate hybrid cloud-edge processing pipelines"
    ]
  },
  {
    id: "iot-architecture",
    title: "IoT Architecture & Protocols",
    description: "Multi-tier IoT networks: Sensors, Edge Gateways, Fog nodes, MQTT brokers, and Cloud analytics engines.",
    unit: "unit-3",
    category: "edge-iot",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["iot", "mqtt", "gateways", "sensors"],
    icon: "Radio",
    featured: false,
    learningObjectives: [
      "Trace lightweight MQTT Publish/Subscribe topic trees",
      "Analyze CoAP (Constrained Application Protocol) UDP framing",
      "Explore IoT Gateway protocol translation"
    ]
  },
  {
    id: "iot-data-processing",
    title: "IoT Stream Data Processing",
    description: "Processing high-frequency time-series telemetry streams from thousands of connected sensor devices in real time.",
    unit: "unit-3",
    category: "edge-iot",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["iot-data", "telemetry", "time-series"],
    icon: "Activity",
    featured: false,
    learningObjectives: [
      "Handle massive sensor ingestion throughput",
      "Apply moving average anomaly detection on streams",
      "Store time-series data in specialized TSDBs (InfluxDB, TimescaleDB)"
    ]
  },

  // Category 23: Security in Distributed Systems
  {
    id: "authentication",
    title: "Distributed Authentication & Single Sign-On",
    description: "Verifying user and service identities across distributed domains using OAuth 2.0, OpenID Connect (OIDC), and SAML 2.0.",
    unit: "unit-3",
    category: "security-distributed",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["auth", "oauth2", "oidc", "sso"],
    icon: "Key",
    featured: false,
    learningObjectives: [
      "Trace OAuth 2.0 Authorization Code flow with PKCE",
      "Inspect JWT (JSON Web Token) signatures and claims",
      "Understand identity provider (IdP) federation"
    ]
  },
  {
    id: "authorization",
    title: "Distributed Authorization Protocols",
    description: "Enforcing access policies across microservices using RBAC (Role-Based Access Control) and ABAC (Attribute-Based Access Control).",
    unit: "unit-3",
    category: "security-distributed",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["authorization", "rbac", "abac", "policies"],
    icon: "Lock",
    featured: false,
    learningObjectives: [
      "Compare RBAC permissions vs fine-grained ABAC attributes",
      "Understand Open Policy Agent (OPA) policy evaluation",
      "Enforce Zero-Trust service-to-service authorization"
    ]
  },
  {
    id: "encryption",
    title: "Data Encryption in Transit & At Rest",
    description: "Cryptographic protection of distributed data using AES-256 symmetric encryption and RSA/ECC asymmetric key pairs.",
    unit: "unit-3",
    category: "security-distributed",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["encryption", "aes", "rsa", "crypto"],
    icon: "Shield",
    featured: false,
    learningObjectives: [
      "Distinguish Symmetric vs Asymmetric encryption performance",
      "Understand Envelope Encryption with Key Management Systems (KMS)",
      "Analyze database column-level encryption"
    ]
  },
  {
    id: "secure-communication",
    title: "Secure Inter-Node Communication (mTLS)",
    description: "Mutual TLS (mTLS) authentication and encrypted tunnels establishing trusted transport channels between microservice nodes.",
    unit: "unit-3",
    category: "security-distributed",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["mtls", "tls", "certificates", "mesh"],
    icon: "ShieldCheck",
    featured: false,
    learningObjectives: [
      "Trace TLS 1.3 Handshake key exchange sequence",
      "Understand Certificate Authority (CA) root chains and revocation lists",
      "Visualize service mesh sidecar mTLS encryption"
    ]
  },

  // Category 24: Serverless Computing
  {
    id: "serverless-computing",
    title: "Serverless Computing Architecture",
    description: "Cloud-native execution model where cloud providers dynamically manage machine resource allocation on demand.",
    unit: "unit-3",
    category: "serverless-computing",
    type: "visualizer",
    status: "available",
    examPriority: "high",
    tags: ["serverless", "faas", "aws-lambda"],
    icon: "Zap",
    featured: false,
    learningObjectives: [
      "Understand event-driven micro-execution paradigms",
      "Analyze pricing models per 100ms execution and memory tier",
      "Evaluate state management externalization to databases"
    ]
  },
  {
    id: "serverless-function-execution",
    title: "Serverless Function Execution Lifecycle",
    description: "Visualizing cold starts vs warm invocation environments, container initialization, and execution context reuse.",
    unit: "unit-3",
    category: "serverless-computing",
    type: "visualizer",
    status: "available",
    examPriority: "medium",
    tags: ["cold-start", "warm-start", "function-lifecycle"],
    icon: "PlayCircle",
    featured: false,
    learningObjectives: [
      "Distinguish Cold Start initialization delay from Warm Start hits",
      "Optimize function package size to reduce latency",
      "Inspect execution environment variable recycling"
    ]
  },
  {
    id: "serverless-scaling",
    title: "Serverless Concurrency & Scaling",
    description: "Instant parallel scaling of function instances matching incoming concurrent request bursts automatically.",
    unit: "unit-3",
    category: "serverless-computing",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["serverless-scaling", "concurrency", "throttling"],
    icon: "TrendingUp",
    featured: false,
    learningObjectives: [
      "Understand Unreserved vs Provisioned Concurrency limits",
      "Observe request throttling under concurrency exhaustion",
      "Analyze downstream database connection pool saturation"
    ]
  },

  // Category 25: Mobile Computing
  {
    id: "mobile-computing",
    title: "Mobile Computing Principles",
    description: "Distributed computing over wireless networks addressing mobility, dynamic network topology, and power constraints.",
    unit: "unit-3",
    category: "mobile-computing",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["mobile", "wireless", "battery-efficiency"],
    icon: "Smartphone",
    featured: false,
    learningObjectives: [
      "Understand energy-aware distributed task offloading",
      "Analyze adaptive bandwidth compression",
      "Manage disconnected client data caching"
    ]
  },
  {
    id: "mobile-handoff",
    title: "Mobile Handoff Algorithms",
    description: "Hard and soft handoff mechanisms maintaining seamless active connections as mobile nodes transition between cell base stations.",
    unit: "unit-3",
    category: "mobile-computing",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["handoff", "cellular", "base-station"],
    icon: "Radio",
    featured: false,
    learningObjectives: [
      "Distinguish Hard Handoff (Break-Before-Make) vs Soft Handoff (Make-Before-Break)",
      "Simulate RSSI (Received Signal Strength Indicator) thresholds",
      "Trace Mobile IP care-of address tunneling"
    ]
  },

  // Category 26: Satellite Systems
  {
    id: "satellite-computing",
    title: "Satellite Computing Constellations",
    description: "Distributed computing across Low Earth Orbit (LEO) satellite networks operating under orbital mechanics and high propagation delays.",
    unit: "unit-3",
    category: "satellite-systems",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["satellite", "leo", "constellation", "space"],
    icon: "Radio",
    featured: false,
    learningObjectives: [
      "Understand LEO vs GEO satellite latency characteristics",
      "Analyze Inter-Satellite Link (ISL) optical mesh routing",
      "Manage intermittent ground station visibility windows"
    ]
  },
  {
    id: "satellite-communication-delay",
    title: "Satellite Communication Propagation Delay",
    description: "Visualizing signal velocity, Doppler shift compensation, and delay-tolerant networking (DTN) protocols for space networks.",
    unit: "unit-3",
    category: "satellite-systems",
    type: "visualizer",
    status: "available",
    examPriority: "low",
    tags: ["propagation-delay", "dtn", "doppler"],
    icon: "Activity",
    featured: false,
    learningObjectives: [
      "Calculate speed-of-light propagation delays across orbital altitudes",
      "Understand Delay-Tolerant Networking (DTN) bundle protocols",
      "Compensate for orbital Doppler frequency shifts"
    ]
  }
];

export const getModuleById = (id) => MODULES.find(m => m.id === id);
export const getModulesByUnit = (unitId) => MODULES.filter(m => m.unit === unitId);
export const getModulesByCategory = (categoryId) => MODULES.filter(m => m.category === categoryId);
export const getFeaturedModules = () => MODULES.filter(m => m.featured);
