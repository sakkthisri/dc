import React from 'react';
import { Network } from 'lucide-react';
import { Breadcrumb } from '../components/ui/Breadcrumb';

export function About() {
  const breadcrumbItems = [{ label: 'About Project' }];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Banner */}
      <div className="space-y-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg">
            <Network className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-100 dark:text-gray-100 light:text-gray-900 tracking-tight">
              About Distributed Computing Visualizer
            </h1>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mt-0.5">
              Educational Platform Foundation
            </p>
          </div>
        </div>
      </div>

      {/* Official Mission Statement Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-gray-200 dark:text-gray-200 light:text-gray-800 leading-relaxed text-sm sm:text-base">
        <p className="font-medium">
          Distributed Computing Visualizer is an educational platform designed to help students understand distributed systems, algorithms, architectures, communication protocols, fault tolerance, distributed databases, cloud technologies and emerging distributed computing concepts through interactive visualization.
        </p>
      </div>

      {/* Syllabus Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">
          Syllabus Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 dark:bg-gray-900 dark:border-gray-800 light:bg-white light:border-gray-200">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Unit 1</div>
            <h3 className="font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 text-lg mb-2">
              Introduction & Fundamentals
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed mb-4">
              Covers core distributed systems goals, architectural models (client-server, P2P, hybrid), physical and logical clocks (Lamport, Vector), IPC, Paxos/Raft consensus, mutual exclusion, and message queuing (RabbitMQ, Kafka).
            </p>
            <div className="text-[11px] font-semibold text-gray-400">15 Periods • 7 Categories</div>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 dark:bg-gray-900 dark:border-gray-800 light:bg-white light:border-gray-200">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Unit 2</div>
            <h3 className="font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 text-lg mb-2">
              Management & Fault Tolerance
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed mb-4">
              Explores DFS (HDFS, NFS), Distributed Shared Memory, resource scheduling, load balancing, fault tolerance models, CAP theorem, ACID, 2PC/3PC transactions, NoSQL stores, and Blockchain consensus.
            </p>
            <div className="text-[11px] font-semibold text-gray-400">15 Periods • 10 Categories</div>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 dark:bg-gray-900 dark:border-gray-800 light:bg-white light:border-gray-200">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Unit 3</div>
            <h3 className="font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 text-lg mb-2">
              Computation & Emerging Trends
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed mb-4">
              Presents MapReduce, Spark, Flink, cloud infrastructure (AWS, Azure, GCP), Docker containerization, Kubernetes orchestration, Edge/IoT streaming, distributed security (mTLS), serverless, and satellite networks.
            </p>
            <div className="text-[11px] font-semibold text-gray-400">15 Periods • 9 Categories</div>
          </div>
        </div>
      </div>

      {/* Platform Features Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">
          Core Platform Principles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400 leading-relaxed">
          <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 dark:bg-gray-900/60 light:bg-gray-50">
            <h4 className="font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 text-sm mb-1">
              Centralized & Data-Driven
            </h4>
            <p>
              Built around a single authoritative syllabus data structure separating content definitions from UI views for modularity and effortless visualizer additions.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 dark:bg-gray-900/60 light:bg-gray-50">
            <h4 className="font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 text-sm mb-1">
              Visualizer-Ready Shell Architecture
            </h4>
            <p>
              Standardized 4-pane visualizer viewport (`VisualizerLayout`) providing dedicated zones for theory, simulation canvas, parameter sliders, and step timeline controls.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 dark:bg-gray-900/60 light:bg-gray-50">
            <h4 className="font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 text-sm mb-1">
              Responsive & Themeable
            </h4>
            <p>
              Optimized for desktop, tablet, and mobile viewing with persistent Dark/Light mode theme switching adhering to modern web standards.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 dark:bg-gray-900/60 light:bg-gray-50">
            <h4 className="font-bold text-gray-200 dark:text-gray-200 light:text-gray-800 text-sm mb-1">
              Instant Global Search & Filtering
            </h4>
            <p>
              Real-time search across all titles, descriptions, categories, units, and tags alongside multi-attribute exam priority and category filters.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
