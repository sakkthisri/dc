export const LEARNING_PATHS = [
  {
    id: "path-unit-1",
    title: "Unit 1: Fundamentals, Time & Coordination",
    unitId: "unit-1",
    description: "Master the building blocks of distributed systems: architectural models, logical clocks, global snapshots, and consensus coordination algorithms.",
    level: "High Priority Exam Track",
    estimatedHours: "15 Periods",
    icon: "Clock",
    modules: [
      { id: "client-server", title: "Client-Server Architecture", required: true },
      { id: "peer-to-peer", title: "Peer-to-Peer Architecture", required: true },
      { id: "message-passing", title: "Message Passing IPC", required: true },
      { id: "rpc", title: "Remote Procedure Call (RPC)", required: true },
      { id: "rmi", title: "Remote Method Invocation (RMI)", required: true },
      { id: "logical-clocks", title: "Lamport Logical Clocks", required: true },
      { id: "vector-clocks", title: "Vector Clocks & Causality", required: true },
      { id: "global-state", title: "Chandy-Lamport Global Snapshots", required: true },
      { id: "election-algorithms", title: "Bully Leader Election", required: true },
      { id: "ring-election", title: "Ring Leader Election", required: true },
      { id: "distributed-mutual-exclusion", title: "Distributed Mutual Exclusion", required: true },
      { id: "paxos-consensus", title: "Paxos Consensus Protocol", required: true },
      { id: "raft-consensus", title: "Raft Consensus Protocol", required: true }
    ]
  },
  {
    id: "path-unit-2",
    title: "Unit 2: Storage, Databases, Fault Tolerance & Ledgers",
    unitId: "unit-2",
    description: "Explore fault-tolerant distributed storage, consistent hash rings, database sharding, transaction commit protocols, and blockchain consensus.",
    level: "High Priority Exam Track",
    estimatedHours: "15 Periods",
    icon: "Database",
    modules: [
      { id: "hdfs", title: "HDFS Block Replication & Recovery", required: true },
      { id: "dsm", title: "Distributed Shared Memory (DSM)", required: true },
      { id: "load-balancing", title: "Load Balancing Routing Strategies", required: true },
      { id: "resource-allocation", title: "Resource Allocation Engine", required: true },
      { id: "distributed-scheduling", title: "Work-Stealing Scheduling", required: true },
      { id: "failure-detection", title: "Heartbeat Failure Detectors", required: true },
      { id: "replication", title: "Replication & Automated Failover", required: true },
      { id: "recovery", title: "State Recovery & WAL Log Replay", required: true },
      { id: "cap-theorem", title: "CAP Theorem Network Partitioning", required: true },
      { id: "eventual-consistency", title: "Consistency Models & Lag", required: true },
      { id: "two-phase-commit", title: "Two-Phase Commit (2PC)", required: true },
      { id: "three-phase-commit", title: "Three-Phase Commit (3PC)", required: true },
      { id: "data-fragmentation", title: "Database Data Fragmentation", required: true },
      { id: "cassandra", title: "Cassandra Consistent Hash Ring", required: true },
      { id: "mongodb", title: "MongoDB Sharding & Balancer", required: true },
      { id: "distributed-data-warehousing", title: "Distributed Data Warehousing & ETL", required: true },
      { id: "distributed-data-mining", title: "Distributed Mining & Parameter Server", required: true },
      { id: "blockchain", title: "Blockchain Proof-of-Work Consensus", required: true }
    ]
  },
  {
    id: "path-unit-3",
    title: "Unit 3: Compute, Cloud, Containers, Edge & Emerging Systems",
    unitId: "unit-3",
    description: "Understand parallel batch processing, DAG lineage graphs, cloud service models, container orchestration, edge computing, serverless, and satellite delay.",
    level: "High Priority Exam Track",
    estimatedHours: "15 Periods",
    icon: "Server",
    modules: [
      { id: "mapreduce", title: "MapReduce Paradigm & Word Count", required: true },
      { id: "spark-dag", title: "Apache Spark RDD Lineage & DAG", required: true },
      { id: "cloud-computing", title: "Cloud Service Models (IaaS, PaaS, SaaS)", required: true },
      { id: "docker", title: "Docker Containerization & Image Layers", required: true },
      { id: "kubernetes", title: "Kubernetes HPA Scaling & Self-Healing", required: true },
      { id: "edge-computing", title: "Edge Computing vs Cloud Latency", required: true },
      { id: "authentication", title: "Distributed Security (JWT, RBAC, mTLS)", required: true },
      { id: "serverless-computing", title: "Serverless FaaS Cold Starts vs Warm", required: true },
      { id: "satellite-computing", title: "Satellite Orbital Propagation Delay", required: true }
    ]
  }
];
