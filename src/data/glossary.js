export const GLOSSARY_TERMS = [
  {
    id: "cap-theorem",
    term: "CAP Theorem (Brewer's Theorem)",
    definition: "A fundamental principle stating that a distributed data store can simultaneously provide at most two out of three guarantees: Consistency, Availability, and Partition Tolerance.",
    category: "Consistency & Storage",
    relatedModuleId: "cap-theorem"
  },
  {
    id: "consensus",
    term: "Consensus",
    definition: "The problem of reaching agreement among a set of distributed processes on a single data value or state, even in the presence of node failures or network delays.",
    category: "Coordination",
    relatedModuleId: "paxos-consensus"
  },
  {
    id: "causal-ordering",
    term: "Causal Ordering",
    definition: "An event ordering relationship guaranteeing that if an event e1 causally influences event e2 (happens-before), then e1 is processed before e2 across all processes.",
    category: "Time & Causality",
    relatedModuleId: "vector-clocks"
  },
  {
    id: "fault-tolerance",
    term: "Fault Tolerance",
    definition: "The capability of a distributed system to continue operating properly without interruption in the event of hardware, software, or network failures.",
    category: "Fault Tolerance",
    relatedModuleId: "replication"
  },
  {
    id: "lamport-clock",
    term: "Lamport Logical Clock",
    definition: "A scalar integer counter assigned to events in a distributed system to establish partial ordering based on Lamport's happens-before relation (->).",
    category: "Time & Causality",
    relatedModuleId: "lamport-logical-clock"
  },
  {
    id: "vector-clock",
    term: "Vector Clock",
    definition: "An array of logical clocks maintained by each process to track full causal history and distinguish causally dependent events from concurrent events.",
    category: "Time & Causality",
    relatedModuleId: "vector-clocks"
  },
  {
    id: "quorum",
    term: "Quorum",
    definition: "The minimum number of participating nodes that must agree before a distributed read, write, or consensus operation is declared successful.",
    category: "Consensus & Storage",
    relatedModuleId: "paxos-consensus"
  },
  {
    id: "replication",
    term: "Replication",
    definition: "The practice of storing multiple copies of the same data across different physical nodes to ensure fault tolerance, reliability, and high availability.",
    category: "Storage",
    relatedModuleId: "replication"
  },
  {
    id: "rpc",
    term: "Remote Procedure Call (RPC)",
    definition: "A communication protocol that allows a computer program to cause a subroutine to execute in another address space (on another computer) without the programmer explicitly coding details for remote interaction.",
    category: "Communication",
    relatedModuleId: "rpc"
  },
  {
    id: "rmi",
    term: "Remote Method Invocation (RMI)",
    definition: "An object-oriented API in Java that enables an object residing in one JVM to invoke methods on an object residing in another JVM.",
    category: "Communication",
    relatedModuleId: "rmi"
  },
  {
    id: "dsm",
    term: "Distributed Shared Memory (DSM)",
    definition: "An architectural model where physically separated memory modules across networked machines present the abstraction of a single unified virtual address space.",
    category: "Storage & Memory",
    relatedModuleId: "dsm"
  },
  {
    id: "hdfs",
    term: "HDFS (Hadoop Distributed File System)",
    definition: "A distributed, scalable, and portable file system designed to store massive datasets across commodity hardware clusters with 3x pipeline block replication.",
    category: "Big Data Storage",
    relatedModuleId: "hdfs"
  },
  {
    id: "mapreduce",
    term: "MapReduce",
    definition: "A software framework for processing vast amounts of data in parallel on large clusters of commodity hardware via Map, Shuffle, and Reduce phases.",
    category: "Parallel Compute",
    relatedModuleId: "mapreduce"
  },
  {
    id: "rdd",
    term: "Resilient Distributed Dataset (RDD)",
    definition: "The fundamental data abstraction in Apache Spark—an immutable, fault-tolerant collection of elements that can be operated on in parallel with lineage tracking.",
    category: "Parallel Compute",
    relatedModuleId: "spark-dag"
  },
  {
    id: "blockchain",
    term: "Blockchain",
    definition: "A decentralized, distributed, and public digital ledger consisting of cryptographically linked blocks validated via consensus mechanisms like Proof-of-Work.",
    category: "Distributed Ledgers",
    relatedModuleId: "blockchain"
  },
  {
    id: "kubernetes",
    term: "Kubernetes (K8s)",
    definition: "An open-source container orchestration platform for automating application deployment, scaling, and self-healing pod management.",
    category: "Container Orchestration",
    relatedModuleId: "kubernetes"
  },
  {
    id: "edge-computing",
    term: "Edge Computing",
    definition: "A distributed computing paradigm that brings computation and data storage closer to the location where it is needed (IoT devices, cell towers) to improve response times and save bandwidth.",
    category: "Edge & Cloud",
    relatedModuleId: "edge-computing"
  },
  {
    id: "serverless",
    term: "Serverless Computing (FaaS)",
    definition: "A cloud execution model where the cloud provider dynamically manages the allocation and provisioning of servers, executing code in response to events.",
    category: "Cloud & Edge",
    relatedModuleId: "serverless-computing"
  }
];
