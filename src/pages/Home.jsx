import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Network, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Cpu, 
  Activity, 
  CheckCircle
} from 'lucide-react';
import { UNITS } from '../data/units';
import { MODULES, getFeaturedModules } from '../data/modules';
import { UnitCard } from '../components/units/UnitCard';
import { ModuleCard } from '../components/modules/ModuleCard';
import { Button } from '../components/ui/Button';

export function Home() {
  const canvasRef = useRef(null);
  const featuredModules = getFeaturedModules();

  // Network background canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create network nodes
    const nodeCount = Math.min(Math.floor(width / 35), 30);
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 2,
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Packet transmissions
    const packets = [];
    const createPacket = () => {
      if (nodes.length < 2) return;
      const fromIdx = Math.floor(Math.random() * nodes.length);
      let toIdx = Math.floor(Math.random() * nodes.length);
      while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * nodes.length);

      packets.push({
        from: nodes[fromIdx],
        to: nodes[toIdx],
        progress: 0,
        speed: 0.015 + Math.random() * 0.02
      });
    };

    const interval = setInterval(createPacket, 1200);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw packets
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const px = pkt.from.x + (pkt.to.x - pkt.from.x) * pkt.progress;
        const py = pkt.from.y + (pkt.to.y - pkt.from.y) * pkt.progress;

        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw & update nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulse += 0.03;

        ctx.fillStyle = '#3b82f6';
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="space-y-16 py-6 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[500px] flex items-center justify-center px-4 sm:px-6 overflow-hidden rounded-3xl mx-4 sm:mx-6 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950 border border-gray-800/80 dark:from-gray-900 dark:border-gray-800 light:from-blue-50/50 light:via-white light:to-white light:border-gray-200 shadow-2xl">
        
        {/* Canvas animation container */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60" 
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center py-16 sm:py-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Distributed Systems Learning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-gray-100 dark:text-gray-100 light:text-gray-900 tracking-tight leading-tight">
            DISTRIBUTED COMPUTING <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              VISUALIZER
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-400 dark:text-gray-400 light:text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Learn distributed systems through interactive visualizations. Master Lamport clocks, consensus algorithms, vector causality, two-phase commits, and container orchestration.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/revision">
              <Button 
                variant="accent" 
                size="lg"
                icon={Sparkles}
                className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold border-none shadow-lg shadow-rose-600/30"
              >
                Start High-Priority Revision
              </Button>
            </Link>

            <Button 
              variant="secondary" 
              size="lg"
              icon={ArrowRight}
              onClick={() => {
                const el = document.getElementById('featured-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Visualizers
            </Button>

            <Button 
              variant="secondary" 
              size="lg"
              icon={BookOpen}
              onClick={() => {
                const el = document.getElementById('units-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Browse Syllabus
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 1: Explore Distributed Computing (3 Units) */}
      <section id="units-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 mb-2">
            Explore Distributed Computing
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
            Structured according to the official 45-period Distributed Computing syllabus across 3 core units.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {UNITS.map(unit => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      </section>

      {/* SECTION 2: Featured Visualizers */}
      <section id="featured-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Core Syllabus Algorithms</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900">
              Featured Visualizers
            </h2>
          </div>
          <Link 
            to="/category/time-global-states" 
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredModules.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      {/* SECTION 3: Learn by Visualization */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gray-900/60 border border-gray-800 dark:bg-gray-900/60 dark:border-gray-800 light:bg-white light:border-gray-200 light:shadow-lg">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 mb-2">
              Learn by Visualization
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
              Transform abstract distributed systems theories into intuitive step-by-step visual models.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-gray-950/60 border border-gray-800/80 dark:bg-gray-950/60 dark:border-gray-800/80 light:bg-gray-50 light:border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 text-base mb-2">
                Understand Complex Algorithms
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed">
                Step through multi-node execution states, inspect variable changes, and trace message timelines visually.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-950/60 border border-gray-800/80 dark:bg-gray-950/60 dark:border-gray-800/80 light:bg-gray-50 light:border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 text-base mb-2">
                See Distributed Communication
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed">
                Watch RPC calls, packet exchanges, message queue bindings, and socket channels operate live across networks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-950/60 border border-gray-800/80 dark:bg-gray-950/60 dark:border-gray-800/80 light:bg-gray-50 light:border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 text-base mb-2">
                Experiment with System Failures
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed">
                Inject node crashes, network partitions, and packet dropouts to observe automatic failover and consensus recovery.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-950/60 border border-gray-800/80 dark:bg-gray-950/60 dark:border-gray-800/80 light:bg-gray-50 light:border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-100 dark:text-gray-100 light:text-gray-900 text-base mb-2">
                Learn Step-by-Step
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed">
                Control simulation play rates, pause at key invariants, inspect event logs, and review theoretical principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Data-Driven Exam Priority Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/40 dark:bg-rose-950/20 dark:border-rose-800/40 light:bg-rose-50 light:border-rose-200">
            <div className="text-3xl sm:text-4xl font-black text-rose-400 mb-1">
              {MODULES.filter(m => m.examPriority === 'high').length}
            </div>
            <div className="text-xs font-bold text-rose-300 dark:text-rose-300 light:text-rose-700 uppercase tracking-wider">
              🔴 High Priority
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Core Exam Focus Topics</div>
          </div>

          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/40 dark:bg-amber-950/20 dark:border-amber-800/40 light:bg-amber-50 light:border-amber-200">
            <div className="text-3xl sm:text-4xl font-black text-amber-400 mb-1">
              {MODULES.filter(m => m.examPriority === 'medium').length}
            </div>
            <div className="text-xs font-bold text-amber-300 dark:text-amber-300 light:text-amber-700 uppercase tracking-wider">
              🟠 Medium Priority
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Standard Syllabus Topics</div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 dark:bg-emerald-950/20 dark:border-emerald-800/40 light:bg-emerald-50 light:border-emerald-200">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">
              {MODULES.filter(m => m.examPriority === 'low').length}
            </div>
            <div className="text-xs font-bold text-emerald-300 dark:text-emerald-300 light:text-emerald-700 uppercase tracking-wider">
              🟢 Low Priority
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Specialized & Elective Topics</div>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800 dark:bg-gray-900/40 dark:border-gray-800 light:bg-white light:border-gray-200">
            <div className="text-3xl sm:text-4xl font-black text-indigo-400 mb-1">{MODULES.length}</div>
            <div className="text-xs font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700">Total Syllabus Topics</div>
            <div className="text-[10px] text-gray-500 mt-1">100% Complete Theory</div>
          </div>
        </div>
      </section>

    </div>
  );
}
