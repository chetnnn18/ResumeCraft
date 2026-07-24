import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Play,
  ArrowRight,
  Star,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button, Badge } from "../ui/primitives";
import ResumePreview from "../resume/ResumePreview";
import { SAMPLE_RESUME } from "../../Data";

export default function Hero({ onLaunch }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 18,
  });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      {/* aurora blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-aurora absolute -top-24 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[#4F46E5]/30 blur-[120px]" />
        <div className="animate-aurora absolute top-10 right-1/4 h-[26rem] w-[26rem] rounded-full bg-[#7C3AED]/25 blur-[120px] [animation-delay:-6s]" />
        <div className="animate-aurora absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-[#6366F1]/20 blur-[120px] [animation-delay:-12s]" />
      </div>
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6">
              <Sparkles size={13} className="text-violet-brand" />
              AI-powered resume builder · 2026
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            Build <span className="text-gradient">Job-Winning</span> Resumes
            With AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-2"
          >
            Create ATS-friendly resumes in minutes using intelligent, AI-powered
            suggestions that help you stand out and get hired faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" onClick={onLaunch} className="animate-gradient-x">
              Start Building <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="secondary">
              <Play size={16} className="text-brand-500" /> Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[47, 12, 32, 15, 45].map((n) => (
                <img
                  key={n}
                  src={`https://i.pravatar.cc/80?img=${n}`}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-ink-2">
                <span className="font-semibold text-ink">120,000+</span> resumes
                created
              </p>
            </div>
          </motion.div>
        </div>

        {/* visual */}
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1200 }}
          className="relative"
        >
          <motion.div
            style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="overflow-hidden rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white shadow-[0_40px_80px_-30px_rgba(17,20,57,0.35)]">
              <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-medium text-ink-3">
                  resume — live preview
                </span>
              </div>
              <div className="max-h-[460px] overflow-hidden">
                <ResumePreview resume={SAMPLE_RESUME} />
              </div>
            </div>

            {/* floating cards */}
            <motion.div
              style={{ transform: "translateZ(60px)" }}
              className="animate-float-slow absolute -left-6 top-16 hidden rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white/90 p-3 shadow-xl backdrop-blur sm:block"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">ATS Score</p>
                  <p className="text-[11px] text-emerald-600">
                    98% · Excellent
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ transform: "translateZ(80px)" }}
              className="animate-float-slow absolute -right-4 bottom-20 hidden rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white/90 p-3 shadow-xl backdrop-blur [animation-delay:-3s] sm:block"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-brand">
                  <Zap size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">AI Enhanced</p>
                  <p className="text-[11px] text-ink-3">+12 improvements</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
