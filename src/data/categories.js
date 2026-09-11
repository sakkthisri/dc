export const CATEGORIES = [
  // UNIT 1
  {
    id: "ds-fundamentals",
    categoryNumber: 1,
    unitId: "unit-1",
    title: "Distributed Systems Fundamentals",
    description: "Core concepts, motivations, transparency types, scalability, and foundational challenges of distributed computing.",
    icon: "Boxes"
  },
  {
    id: "architectural-models",
    categoryNumber: 2,
    unitId: "unit-1",
    title: "Architectural Models",
    description: "System structures including Client-Server, Peer-to-Peer (P2P), and Hybrid distributed architectures.",
    icon: "Network"
  },
  {
    id: "time-global-states",
    categoryNumber: 3,
    unitId: "unit-1",
    title: "Time and Global States",
    description: "Physical and logical clocks, Lamport timestamps, Vector clocks, causality tracking, and Chandy-Lamport snapshot algorithms.",
    icon: "Clock"
  },
  {
    id: "ipc",
    categoryNumber: 4,
    unitId: "unit-1",
    title: "Inter-Process Communication",
    description: "Low-level and high-level messaging: Sockets, RPC (Remote Procedure Call), RMI, Multicast, and Broadcast protocols.",
    icon: "Send"
  },
  {
    id: "coordination-agreement",
    categoryNumber: 5,
    unitId: "unit-1",
    title: "Coordination and Agreement",
    description: "Distributed consensus algorithms (Paxos, Raft) and leader election protocols (Bully algorithm, Ring algorithm).",
    icon: "Users"
  },
  {
    id: "mutual-exclusion",
    categoryNumber: 6,
    unitId: "unit-1",
    title: "Distributed Mutual Exclusion",
    description: "Ricart-Agrawala, Maekawa, and token-ring algorithms for managing shared critical sections across nodes.",
    icon: "Lock"
  },
  {
    id: "middleware-queuing",
    categoryNumber: 7,
    unitId: "unit-1",
    title: "Middleware and Message Queuing",
    description: "Asynchronous communication, message brokers, enterprise middleware, RabbitMQ, and Apache Kafka.",
    icon: "Layers"
  },

  // UNIT 2
  {
    id: "dfs",
    categoryNumber: 8,
    unitId: "unit-2",
    title: "Distributed File Systems",
    description: "Design principles, file access models, caching, NFS (Network File System), and HDFS (Hadoop Distributed File System).",
    icon: "FolderTree"
  },
  {
    id: "dsm",
    categoryNumber: 9,
    unitId: "unit-2",
    title: "Distributed Shared Memory",
    description: "Abstraction of a single virtual memory address space across physically separate distributed compute nodes.",
    icon: "HardDrive"
  },
  {
    id: "resource-management",
    categoryNumber: 10,
    unitId: "unit-2",
    title: "Resource Management",
    description: "Load balancing strategies, dynamic scheduling, and optimal resource allocation in cluster environments.",
    icon: "Cpu"
  },
  {
    id: "fault-tolerance",
    categoryNumber: 11,
    unitId: "unit-2",
    title: "Fault Tolerance",
    description: "Failure detection, crash/byzantine failure models, active/passive replication, rollback recovery, and self-healing.",
    icon: "ShieldAlert"
  },
  {
    id: "distributed-databases",
    categoryNumber: 12,
    unitId: "unit-2",
    title: "Distributed Databases",
    description: "Data partitioning, horizontal/vertical fragmentation, query processing, and distributed catalog management.",
    icon: "Database"
  },
  {
    id: "consistency-models",
    categoryNumber: 13,
    unitId: "unit-2",
    title: "Consistency Models",
    description: "Strict, sequential, causal, eventual consistency, linearizability, and the foundational CAP Theorem trade-offs.",
    icon: "GitCommit"
  },
  {
    id: "distributed-transactions",
    categoryNumber: 14,
    unitId: "unit-2",
    title: "Distributed Transactions",
    description: "ACID guarantees across nodes, Two-Phase Commit (2PC), Three-Phase Commit (3PC), and Saga pattern.",
    icon: "ArrowRightLeft"
  },
  {
    id: "nosql-databases",
    categoryNumber: 15,
    unitId: "unit-2",
    title: "NoSQL Databases",
    description: "Key-value stores (Redis), Document stores (MongoDB), and Wide-column stores (Apache Cassandra).",
    icon: "Server"
  },
  {
    id: "warehousing-mining",
    categoryNumber: 16,
    unitId: "unit-2",
    title: "Data Warehousing and Data Mining",
    description: "OLAP architectures, ETL pipelines, and parallel pattern discovery algorithms across big data clusters.",
    icon: "PieChart"
  },
  {
    id: "ledger-blockchain",
    categoryNumber: 17,
    unitId: "unit-2",
    title: "Distributed Ledger and Blockchain",
    description: "Decentralized ledgers, cryptographic hashing, Proof-of-Work, Proof-of-Stake, and Byzantine Agreement.",
    icon: "Link"
  },

  // UNIT 3
  {
    id: "programming-models",
    categoryNumber: 18,
    unitId: "unit-3",
    title: "Distributed Programming Models",
    description: "Batch processing with MapReduce, resilient distributed datasets (RDDs) in Apache Spark, and Apache Flink stream processing.",
    icon: "Code"
  },
  {
    id: "cloud-computing",
    categoryNumber: 19,
    unitId: "unit-3",
    title: "Cloud Computing",
    description: "Infrastructure virtualization, IaaS, PaaS, SaaS service models, and Public/Private/Hybrid deployment paradigms.",
    icon: "Cloud"
  },
  {
    id: "cloud-platforms",
    categoryNumber: 20,
    unitId: "unit-3",
    title: "Cloud Platforms",
    description: "Architectural comparison and infrastructure services across AWS, Microsoft Azure, and Google Cloud Platform (GCP).",
    icon: "Globe"
  },
  {
    id: "containerization-orchestration",
    categoryNumber: 21,
    unitId: "unit-3",
    title: "Containerization and Orchestration",
    description: "Docker container runtime, image layering, Kubernetes pods, auto-scaling, horizontal pod autoscalers, and self-healing.",
    icon: "Box"
  },
  {
    id: "edge-iot",
    categoryNumber: 22,
    unitId: "unit-3",
    title: "Edge Computing and IoT",
    description: "Low-latency processing at the network edge, IoT fog computing layers, and sensor data aggregation pipelines.",
    icon: "Activity"
  },
  {
    id: "security-distributed",
    categoryNumber: 23,
    unitId: "unit-3",
    title: "Security in Distributed Systems",
    description: "Authentication, authorization, asymmetric encryption, TLS/SSL, Kerberos, and secure inter-node communication.",
    icon: "Key"
  },
  {
    id: "serverless-computing",
    categoryNumber: 24,
    unitId: "unit-3",
    title: "Serverless Computing",
    description: "Function-as-a-Service (FaaS), event-driven execution, zero-scale idle, and automatic micro-scaling patterns.",
    icon: "Zap"
  },
  {
    id: "mobile-computing",
    categoryNumber: 25,
    unitId: "unit-3",
    title: "Mobile Computing",
    description: "Disconnected operation, location transparency, mobile handoff algorithms, and adaptive network bandwidth control.",
    icon: "Smartphone"
  },
  {
    id: "satellite-systems",
    categoryNumber: 26,
    unitId: "unit-3",
    title: "Satellite Systems",
    description: "Low Earth Orbit (LEO) satellite constellations, high propagation delay management, and inter-satellite routing.",
    icon: "Radio"
  }
];

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id);
export const getCategoriesByUnit = (unitId) => CATEGORIES.filter(c => c.unitId === unitId);
