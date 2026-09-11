export const UNITS = [
  {
    id: "unit-1",
    unitNumber: 1,
    title: "Introduction",
    shortTitle: "Introduction & Fundamentals",
    description: "Foundations of distributed systems, architectural models, time and global state, inter-process communication, coordination, mutual exclusion, and message queuing.",
    periods: 15,
    icon: "Network",
    color: "from-blue-500 to-cyan-500",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  {
    id: "unit-2",
    unitNumber: 2,
    title: "Distributed Management and Fault Tolerance",
    shortTitle: "Management & Fault Tolerance",
    description: "Distributed file systems, shared memory, resource management, fault tolerance techniques, distributed databases, consistency models, two-phase commits, NoSQL, and blockchain.",
    periods: 15,
    icon: "ShieldCheck",
    color: "from-emerald-500 to-teal-500",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  {
    id: "unit-3",
    unitNumber: 3,
    title: "Computation of Distributed Systems and Emerging Trends",
    shortTitle: "Computation & Emerging Trends",
    description: "Parallel computing models (MapReduce, Spark, Flink), cloud architectures, container orchestration with Docker & Kubernetes, edge computing, IoT, serverless, mobile, and satellite systems.",
    periods: 15,
    icon: "Cpu",
    color: "from-indigo-500 to-violet-500",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
  }
];

export const getUnitById = (id) => UNITS.find(u => u.id === id);
