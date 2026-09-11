import { LamportClockVisualizer } from './lamportClock';
import { VectorClockVisualizer } from './vectorClock';
import { BullyElectionVisualizer } from './bullyElection';
import { RingElectionVisualizer } from './ringElection';
import { MutualExclusionVisualizer } from './mutualExclusion';
import { ChandyLamportVisualizer } from './chandyLamport';
import { RpcVisualizer } from './rpcVisualizer';
import { MessagePassingVisualizer } from './messagePassing';

// Phase 3 Visualizers
import { PaxosConsensusVisualizer } from './paxosConsensus';
import { RaftConsensusVisualizer } from './raftConsensus';
import { CapTheoremVisualizer } from './capTheorem';
import { TwoPhaseCommitVisualizer } from './twoPhaseCommit';
import { ThreePhaseCommitVisualizer } from './threePhaseCommit';
import { HdfsReplicationVisualizer } from './hdfsReplication';
import { CassandraHashingVisualizer } from './cassandraHashing';
import { MongoShardingVisualizer } from './mongoSharding';
import { MapReduceVisualizer } from './mapReduce';
import { SparkDagVisualizer } from './sparkDag';
import { KubernetesScalingVisualizer } from './kubernetesScaling';

// Phase 4 Visualizers
import { RmiVisualizer } from './rmiVisualizer';
import { MulticastBroadcastVisualizer } from './multicastBroadcast';
import { FailureDetectionVisualizer } from './failureDetection';
import { ReplicationFaultToleranceVisualizer } from './replicationFaultTolerance';
import { DistributedRecoveryVisualizer } from './distributedRecovery';
import { ConsistencyModelsVisualizer } from './consistencyModels';
import { DistributedSharedMemoryVisualizer } from './distributedSharedMemory';
import { LoadBalancingVisualizer } from './loadBalancing';
import { ResourceAllocationVisualizer } from './resourceAllocation';
import { DistributedSchedulingVisualizer } from './distributedScheduling';
import { DataFragmentationVisualizer } from './dataFragmentation';
import { DataReplicationVisualizer } from './dataReplication';
import { DistributedDataWarehouseVisualizer } from './distributedDataWarehouse';
import { DistributedDataMiningVisualizer } from './distributedDataMining';
import { BlockchainVisualizer } from './blockchainVisualizer';
import { AuthSecurityVisualizer } from './authSecurity';
import { CloudModelsVisualizer } from './cloudModels';
import { ContainerizationDockerVisualizer } from './containerizationDocker';
import { EdgeIotVisualizer } from './edgeIot';
import { ServerlessMobileVisualizer } from './serverlessMobile';
import { SatelliteComputingVisualizer } from './satelliteComputing';

export const VISUALIZER_REGISTRY = {
  // Phase 2 Visualizers
  'lamport-logical-clock': LamportClockVisualizer,
  'logical-clocks': LamportClockVisualizer,
  'vector-clocks': VectorClockVisualizer,
  'causality': VectorClockVisualizer,
  'election-algorithms': BullyElectionVisualizer,
  'bully-election': BullyElectionVisualizer,
  'ring-election': RingElectionVisualizer,
  'distributed-mutual-exclusion': MutualExclusionVisualizer,
  'snapshot-algorithms': ChandyLamportVisualizer,
  'chandy-lamport': ChandyLamportVisualizer,
  'global-state': ChandyLamportVisualizer,
  'rpc': RpcVisualizer,
  'client-server': RpcVisualizer,
  'message-passing': MessagePassingVisualizer,
  'peer-to-peer': MessagePassingVisualizer,

  // Phase 3 Visualizers
  'paxos-consensus': PaxosConsensusVisualizer,
  'raft-consensus': RaftConsensusVisualizer,
  'cap-theorem': CapTheoremVisualizer,
  'two-phase-commit': TwoPhaseCommitVisualizer,
  'three-phase-commit': ThreePhaseCommitVisualizer,
  'hdfs': HdfsReplicationVisualizer,
  'distributed-file-systems': HdfsReplicationVisualizer,
  'nfs': HdfsReplicationVisualizer,
  'cassandra': CassandraHashingVisualizer,
  'redis': CassandraHashingVisualizer,
  'mongodb': MongoShardingVisualizer,
  'distributed-databases': MongoShardingVisualizer,
  'nosql-databases': MongoShardingVisualizer,
  'mapreduce': MapReduceVisualizer,
  'mapreduce-word-count': MapReduceVisualizer,
  'spark-dag': SparkDagVisualizer,
  'apache-spark': SparkDagVisualizer,
  'rdd': SparkDagVisualizer,
  'kubernetes': KubernetesScalingVisualizer,
  'kubernetes-pods': KubernetesScalingVisualizer,
  'kubernetes-scaling': KubernetesScalingVisualizer,
  'kubernetes-self-healing': KubernetesScalingVisualizer,

  // Phase 4 Visualizers
  'rmi': RmiVisualizer,
  'multicast': MulticastBroadcastVisualizer,
  'broadcast': MulticastBroadcastVisualizer,
  'reliable-multicast': MulticastBroadcastVisualizer,
  'failure-detection': FailureDetectionVisualizer,
  'failure-models': FailureDetectionVisualizer,
  'replication': ReplicationFaultToleranceVisualizer,
  'reliability': ReplicationFaultToleranceVisualizer,
  'availability': ReplicationFaultToleranceVisualizer,
  'recovery': DistributedRecoveryVisualizer,
  'acid-properties': ConsistencyModelsVisualizer,
  'eventual-consistency': ConsistencyModelsVisualizer,
  'dsm': DistributedSharedMemoryVisualizer,
  'load-balancing': LoadBalancingVisualizer,
  'resource-allocation': ResourceAllocationVisualizer,
  'resource-sharing': ResourceAllocationVisualizer,
  'distributed-scheduling': DistributedSchedulingVisualizer,
  'data-fragmentation': DataFragmentationVisualizer,
  'data-replication': DataReplicationVisualizer,
  'distributed-data-warehousing': DistributedDataWarehouseVisualizer,
  'distributed-data-mining': DistributedDataMiningVisualizer,
  'blockchain': BlockchainVisualizer,
  'distributed-ledger': BlockchainVisualizer,
  'authentication': AuthSecurityVisualizer,
  'authorization': AuthSecurityVisualizer,
  'encryption': AuthSecurityVisualizer,
  'secure-communication': AuthSecurityVisualizer,
  'cloud-computing': CloudModelsVisualizer,
  'cloud-service-models': CloudModelsVisualizer,
  'cloud-deployment-models': CloudModelsVisualizer,
  'aws-platform': CloudModelsVisualizer,
  'azure-platform': CloudModelsVisualizer,
  'gcp-platform': CloudModelsVisualizer,
  'containerization': ContainerizationDockerVisualizer,
  'docker': ContainerizationDockerVisualizer,
  'docker-image-to-container': ContainerizationDockerVisualizer,
  'edge-computing': EdgeIotVisualizer,
  'edge-vs-cloud': EdgeIotVisualizer,
  'iot-architecture': EdgeIotVisualizer,
  'iot-data-processing': EdgeIotVisualizer,
  'serverless-computing': ServerlessMobileVisualizer,
  'serverless-function-execution': ServerlessMobileVisualizer,
  'serverless-scaling': ServerlessMobileVisualizer,
  'mobile-computing': ServerlessMobileVisualizer,
  'mobile-handoff': ServerlessMobileVisualizer,
  'satellite-computing': SatelliteComputingVisualizer,
  'satellite-communication-delay': SatelliteComputingVisualizer
};

export const getVisualizerComponent = (moduleId) => {
  return VISUALIZER_REGISTRY[moduleId] || null;
};
