export const COMPARISONS = [
  {
    id: "lamport-vs-vector",
    title: "Lamport Logical Clock vs. Vector Clock",
    category: "Time & Causality",
    itemA: {
      name: "Lamport Logical Clock",
      purpose: "Establish partial ordering of events using monotonically increasing scalar integers.",
      architecture: "Single scalar integer L_i per process.",
      executionFlow: "L_i = L_i + 1 on local event; L_i = max(L_i, T) + 1 on message receipt.",
      failureHandling: "Cannot recover lost order; susceptible to silent drift if messages drop.",
      advantages: "Minimal memory overhead (1 integer per process), zero network payload overhead.",
      limitations: "Cannot detect concurrent events (L(a) < L(b) does not imply a -> b).",
      communicationOverhead: "O(1) payload overhead per message.",
      useCases: "Basic event log ordering, mutual exclusion timestamping."
    },
    itemB: {
      name: "Vector Clock",
      purpose: "Track full causal history and explicitly detect concurrent un-ordered events.",
      architecture: "Vector array V_i of size N (total process count).",
      executionFlow: "V_i[i] = V_i[i] + 1 on event; V_i[j] = max(V_i[j], V_msg[j]) on message receipt.",
      failureHandling: "Detects conflicting updates during network partitions.",
      advantages: "Guarantees exact causality detection (V(a) < V(b) iff a -> b).",
      limitations: "O(N) memory and bandwidth overhead per message.",
      communicationOverhead: "O(N) vector array attached to every message.",
      useCases: "Amazon DynamoDB vector clocks, Git commit graph branching, CRDTs."
    }
  },
  {
    id: "bully-vs-ring",
    title: "Bully Election Algorithm vs. Ring Election Algorithm",
    category: "Leader Election",
    itemA: {
      name: "Bully Algorithm",
      purpose: "Elect process with highest ID as coordinator in fully connected networks.",
      architecture: "Fully connected peer-to-peer network.",
      executionFlow: "Initiator sends ELECTION to all higher IDs. If no OK, declares itself COORDINATOR.",
      failureHandling: "Handles multiple process crashes during active election rounds.",
      advantages: "Fast convergence when highest ID node is healthy (O(1) rounds).",
      limitations: "High message complexity in worst case O(N^2).",
      communicationOverhead: "O(N^2) messages when lowest ID initiates election.",
      useCases: "Enterprise cluster management with static process IDs."
    },
    itemB: {
      name: "Ring Algorithm",
      purpose: "Elect highest ID coordinator in circular logical ring topologies.",
      architecture: "Logical unidirectional or bidirectional ring network.",
      executionFlow: "Token containing active ID list passed around ring. Highest ID selected.",
      failureHandling: "Requires ring link repair upon node crash.",
      advantages: "Fixed message complexity O(N) around ring continuum.",
      limitations: "Higher latency due to sequential token passage around ring.",
      communicationOverhead: "O(N) messages per election round.",
      useCases: "Token Ring networks, distributed hash ring coordinator selection."
    }
  },
  {
    id: "paxos-vs-raft",
    title: "Paxos Consensus Protocol vs. Raft Consensus Protocol",
    category: "Consensus",
    itemA: {
      name: "Paxos Consensus",
      purpose: "Achieve majority quorum consensus over unreliable asynchronous networks.",
      architecture: "Proposer, Acceptor, Learner roles.",
      executionFlow: "Phase 1: Prepare/Promise -> Phase 2: AcceptRequest/Accepted -> Commit.",
      failureHandling: "Tolerates minority acceptor crashes (f failures out of 2f+1 nodes).",
      advantages: "Proven mathematical correctness foundation for state machine replication.",
      limitations: "Notoriously difficult to understand and implement in production (Multi-Paxos complexity).",
      communicationOverhead: "2 full network round-trips per consensus decision.",
      useCases: "Google Chubby, Apache Zookeeper (ZAB derivative)."
    },
    itemB: {
      name: "Raft Consensus",
      purpose: "Understandable consensus algorithm with explicit Leader Election and Log Replication.",
      architecture: "Follower, Candidate, Leader states.",
      executionFlow: "Randomized Election Timers -> RequestVote RPC -> AppendEntries Log Replication.",
      failureHandling: "Leader crash triggers instant candidate election round.",
      advantages: "Decomposed into independent sub-problems (Leader Election, Log Replication, Safety).",
      limitations: "Strict single-leader throughput bottleneck for write streams.",
      communicationOverhead: "1 round-trip AppendEntries heartbeat during normal operation.",
      useCases: "etcd, HashiCorp Consul, CockroachDB, TiKV."
    }
  },
  {
    id: "2pc-vs-3pc",
    title: "Two-Phase Commit (2PC) vs. Three-Phase Commit (3PC)",
    category: "Distributed Transactions",
    itemA: {
      name: "Two-Phase Commit (2PC)",
      purpose: "Atomic commitment across multi-database shards.",
      architecture: "Coordinator and Cohort databases.",
      executionFlow: "Phase 1: Prepare (Vote) -> Phase 2: Commit / Abort.",
      failureHandling: "Vulnerable to blocking lockup if Coordinator crashes post-vote.",
      advantages: "Simple 2-step voting protocol with low message overhead.",
      limitations: "Synchronous blocking: cohorts hold locks indefinitely on coordinator failure.",
      communicationOverhead: "2 network round-trips.",
      useCases: "XA Transactions, Relational DB cross-shard commits."
    },
    itemB: {
      name: "Three-Phase Commit (3PC)",
      purpose: "Non-blocking atomic commitment protocol under coordinator failures.",
      architecture: "Coordinator and Cohort databases with PreCommit state.",
      executionFlow: "Phase 1: CanCommit -> Phase 2: PreCommit -> Phase 3: DoCommit.",
      failureHandling: "Cohorts auto-commit on timeout in PreCommit state.",
      advantages: "Eliminates the 2PC blocking vulnerability upon coordinator crash.",
      limitations: "Higher message latency; still vulnerable to network partitions.",
      communicationOverhead: "3 network round-trips.",
      useCases: "Telecom transaction systems, fault-tolerant financial ledgers."
    }
  },
  {
    id: "hdfs-vs-nfs",
    title: "Hadoop Distributed File System (HDFS) vs. Network File System (NFS)",
    category: "Distributed Storage",
    itemA: {
      name: "HDFS",
      purpose: "Write-once, read-many streaming storage for massive big-data analytics.",
      architecture: "NameNode Master + DataNodes.",
      executionFlow: "File split into 128MB blocks -> 3x pipeline replication across racks.",
      failureHandling: "Automated background re-replication on DataNode heartbeat loss.",
      advantages: "Scales to petabytes; high sequential read throughput.",
      limitations: "High latency for small files; no random write support.",
      communicationOverhead: "DataNode heartbeats every 3s + pipeline streaming.",
      useCases: "Hadoop, Spark, Data Lake storage."
    },
    itemB: {
      name: "NFS",
      purpose: "POSIX-compliant remote file access over local area networks.",
      architecture: "Centralized NFS Server + NFS Clients.",
      executionFlow: "Client mounts remote RPC directory -> reads/writes files like local disk.",
      failureHandling: "Server crash blocks client RPC requests until reboot.",
      advantages: "Full POSIX file locking and random write access support.",
      limitations: "Single-server storage capacity bottleneck.",
      communicationOverhead: "Frequent RPC attribute checks.",
      useCases: "Shared Linux home directories, NAS appliances."
    }
  },
  {
    id: "cassandra-vs-mongodb",
    title: "Apache Cassandra vs. MongoDB Sharded Cluster",
    category: "NoSQL Databases",
    itemA: {
      name: "Apache Cassandra",
      purpose: "Masterless Wide-Column NoSQL store with linear write scalability.",
      architecture: "Consistent Hash Ring with Murmur3 tokens.",
      executionFlow: "Client -> Coordinator -> Primary & Successor Replicas (RF=3).",
      failureHandling: "Hinted handoff & read repair during node failure.",
      advantages: "Zero single point of failure; multi-datacenter active-active replication.",
      limitations: "Eventual consistency trade-offs; complex CQL query constraints.",
      communicationOverhead: "Gossip protocol every 1s across ring.",
      useCases: "Time-series data, IoT telemetry, Netflix user history."
    },
    itemB: {
      name: "MongoDB Sharded Cluster",
      purpose: "Document-oriented NoSQL store with flexible JSON/BSON schemas.",
      architecture: "mongos Router + Config Servers + Shard Replica Sets.",
      executionFlow: "mongos queries Config Server metadata -> routes directly to target Shard.",
      failureHandling: "Replica Set auto-failover via Raft-like election.",
      advantages: "Rich query indexing, aggregation pipeline, BSON document modeling.",
      limitations: "Config server metadata dependency; primary node write bottleneck per shard.",
      communicationOverhead: "Config server polling + chunk balancer migration.",
      useCases: "E-commerce catalogs, mobile app backends, content management."
    }
  },
  {
    id: "mapreduce-vs-spark",
    title: "MapReduce vs. Apache Spark DAG",
    category: "Parallel Compute",
    itemA: {
      name: "MapReduce",
      purpose: "Disk-bound batch parallel processing engine.",
      architecture: "Input Splits -> Map -> Shuffle & Sort -> Reduce -> HDFS.",
      executionFlow: "Each phase writes intermediate results back to HDFS disk.",
      failureHandling: "Re-runs failed mapper/reducer tasks on healthy nodes.",
      advantages: "Reliable batch processing for massive datasets exceeding RAM capacity.",
      limitations: "High disk I/O latency; unsuitable for iterative ML algorithms.",
      communicationOverhead: "Heavy disk write + network shuffle.",
      useCases: "Legacy Hadoop batch ETL pipelines."
    },
    itemB: {
      name: "Apache Spark",
      purpose: "In-memory distributed data processing engine with RDD Lineage DAGs.",
      architecture: "Driver -> DAG Scheduler -> Task Scheduler -> Worker Executors.",
      executionFlow: "Transforms RDDs in-memory; executes DAG stages split by shuffle boundaries.",
      failureHandling: "Re-computes lost RDD partitions from lineage graph without restarting job.",
      advantages: "Up to 100x faster than MapReduce for in-memory iterative compute.",
      limitations: "High RAM requirements; potential Out-Of-Memory (OOM) worker crashes.",
      communicationOverhead: "In-memory pipelined execution within Stage.",
      useCases: "Spark SQL, Streaming, MLlib, GraphX."
    }
  },
  {
    id: "vm-vs-docker",
    title: "Virtual Machines (Hypervisor) vs. Docker Containers",
    category: "Containerization",
    itemA: {
      name: "Virtual Machine (VM)",
      purpose: "Hardware virtualization running full guest OS instances.",
      architecture: "Hypervisor (Type 1/2) -> Guest OS -> App Binaries.",
      executionFlow: "Boots complete virtual hardware stack and guest kernel.",
      failureHandling: "VM snapshot restoration.",
      advantages: "Complete hardware-level security isolation.",
      limitations: "Heavy RAM footprint (1-2GB per VM); slow boot times (~30-60s).",
      communicationOverhead: "Virtual NIC driver emulation overhead.",
      useCases: "Multi-tenant cloud infrastructure, running legacy OS versions."
    },
    itemB: {
      name: "Docker Container",
      purpose: "OS-level virtualization sharing host Linux kernel.",
      architecture: "Host OS -> Docker Engine -> Container (App + Libs).",
      executionFlow: "Instantiates isolated process namespaces & cgroups.",
      failureHandling: "Instant container restart via Docker daemon.",
      advantages: "Ultra-lightweight (~50MB RAM footprint); sub-second boot times (~100ms).",
      limitations: "Shares host OS kernel; weaker isolation than hardware VMs.",
      communicationOverhead: "Near-native host network performance.",
      useCases: "Microservices, CI/CD deployment pipelines, cloud-native apps."
    }
  },
  {
    id: "cloud-vs-edge",
    title: "Cloud Computing vs. Edge Computing",
    category: "Cloud & Edge",
    itemA: {
      name: "Cloud Computing",
      purpose: "Centralized data center compute & storage aggregation.",
      architecture: "Hyperscale Central Data Centers (AWS, GCP, Azure).",
      executionFlow: "Client sends requests across WAN to remote cloud data centers.",
      failureHandling: "Multi-zone multi-region redundancy.",
      advantages: "Infinite compute/storage elasticity & deep analytics capabilities.",
      limitations: "High WAN latency (~100-200ms); high network bandwidth costs.",
      communicationOverhead: "Long-haul WAN network traffic.",
      useCases: "Big data analytics, enterprise web apps, central databases."
    },
    itemB: {
      name: "Edge Computing",
      purpose: "Decentralized compute at local network gateways near data sources.",
      architecture: "IoT Gateways, Local Edge Servers, 5G Cell Towers.",
      executionFlow: "Processes telemetry locally at edge node in real-time.",
      failureHandling: "Edge nodes operate autonomously during cloud disconnects.",
      advantages: "Ultra-low latency (~5ms); 95% reduction in WAN bandwidth usage.",
      limitations: "Constrained local compute & storage resources.",
      communicationOverhead: "Short-range local LAN/5G communication.",
      useCases: "Autonomous vehicles, industrial IoT, AR/VR, smart power grids."
    }
  },
  {
    id: "strong-vs-eventual",
    title: "Strong Consistency vs. Eventual Consistency",
    category: "Consistency Models",
    itemA: {
      name: "Strong Consistency (Linearizability)",
      purpose: "Guarantee every read query returns the most recent written value.",
      architecture: "Synchronous blocking locks across all replicas.",
      executionFlow: "Write blocks until 100% of replicas acknowledge local commit.",
      failureHandling: "Sacrifices write availability during network partitions (CP mode).",
      advantages: "Simple programming model; zero stale reads.",
      limitations: "Higher write latency; lower availability during network failures.",
      communicationOverhead: "Synchronous multi-replica locking rounds.",
      useCases: "Financial banking ledgers, inventory counts, authentication tokens."
    },
    itemB: {
      name: "Eventual Consistency",
      purpose: "Maximize write availability by accepting local writes immediately.",
      architecture: "Asynchronous replication with anti-entropy reconciliation.",
      executionFlow: "Write returns OK immediately; updates propagate in background.",
      failureHandling: "Accepts writes on both sides of partition; resolves conflicts on merge.",
      advantages: "Ultra-fast write latency; high availability (AP mode).",
      limitations: "Temporary stale reads until background convergence.",
      communicationOverhead: "Background gossip & vector clock sync.",
      useCases: "Social media feeds, DNS records, shopping cart drafts."
    }
  }
];
