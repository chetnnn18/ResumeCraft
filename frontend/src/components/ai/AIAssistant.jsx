import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  FileText,
  Zap,
  Gauge,
  Tags,
  Mail,
} from "lucide-react";
import { useResume } from "../../context/ResumeContext";
import api from "../../services/api";
import { Button } from "../ui/primitives";
import { cn } from "../../utils/cn";

const TABS = [
  { id: "summary", label: "Summary", icon: FileText },
  { id: "enhance", label: "Enhancer", icon: Wand2 },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "score", label: "ATS Score", icon: Gauge },
  { id: "keywords", label: "Keywords", icon: Tags },
  { id: "cover", label: "Cover Letter", icon: Mail },
];

export default function AIAssistant({ open, onClose, initialTab = "summary" }) {
  const { resume, setField } = useResume();
  const [tab, setTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setResult(null);
    }
  }, [open, initialTab]);

  useEffect(() => setResult(null), [tab]);

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      let out;

      if (tab === "summary") {
        const { data } = await api.post("/ai/summary", {
          title: resume.personal.title,
          experience: resume.experience,
          skills: resume.skills,
        });
        out = { type: "text", value: data.result };

      } else if (tab === "enhance") {
        const { data } = await api.post("/ai/enhance", {
          bullets: resume.experience?.[0]?.bullets,
          role:    resume.experience?.[0]?.role,
          company: resume.experience?.[0]?.company,
        });
        out = { type: "text", value: data.result };

      } else if (tab === "skills") {
        const { data } = await api.post("/ai/skills", {
          title:         resume.personal.title,
          currentSkills: resume.skills,
        });
        out = { type: "chips", value: data.result };

      } else if (tab === "score") {
        const { data } = await api.post("/ai/ats-score", { resume });
        out = { type: "score", value: data.result };

      } else if (tab === "keywords") {
        const { data } = await api.post("/ai/keywords", {
          title:      resume.personal.title,
          summary:    resume.summary,
          experience: resume.experience,
        });
        out = { type: "chips", value: data.result };

      } else if (tab === "cover") {
        const { data } = await api.post("/ai/cover-letter", {
          name:    resume.personal.fullName,
          title:   resume.personal.title,
          company: "the company",
        });
        out = { type: "text", value: data.result };
      }

      setResult(out);
    } catch (err) {
      // Show error in the existing result text area — no UI changes needed
      setResult({
        type: "text",
        value: `Error: ${err.message || "AI request failed. Please try again."}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const apply = () => {
    if (!result) return;
    if (tab === "summary") setField("summary", result.value);
    else if (tab === "enhance" && resume.experience?.[0]) {
      const next = [...resume.experience];
      next[0] = { ...next[0], bullets: result.value };
      setField("experience", next);
    } else if (tab === "skills" || tab === "keywords") {
      const existing = resume.skills.map((s) => s.name.toLowerCase());
      const additions = result.value
        .filter((n) => !existing.includes(n.toLowerCase()))
        .map((n) => ({ id: Math.random().toString(36).slice(2, 9), name: n }));
      setField("skills", [...resume.skills, ...additions]);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm cursor-default"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-[rgba(17,20,57,0.08)] bg-white shadow-2xl sm:rounded-3xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-brand-50 to-violet-50 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white">
                  <Sparkles size={18} />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-ink">
                    AI Assistant
                  </p>
                  <p className="text-xs text-ink-3">
                    Generate & enhance with AI
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-xl text-ink-2 transition hover:bg-black/5 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* tabs */}
            <div className="flex gap-1.5 overflow-x-auto border-b border-slate-100 px-4 py-3">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition cursor-pointer",
                    tab === t.id
                      ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow"
                      : "text-ink-2 hover:bg-black/5",
                  )}
                >
                  <t.icon size={14} /> {t.label}
                </button>
              ))}
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-4 rounded-2xl border border-slate-100 bg-lilac p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-3">
                  Context
                </p>
                <p className="mt-1 text-sm text-ink">
                  {resume.personal.title || "Your role"} ·{" "}
                  {resume.personal.fullName || "You"}
                </p>
              </div>

              {!result && !loading && (
                <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-8 text-center">
                  <Sparkles className="mx-auto text-brand-500" size={28} />
                  <p className="mt-3 text-sm font-semibold text-ink">
                    Ready to generate
                  </p>
                  <p className="mt-1 text-sm text-ink-2">
                    Click generate and let AI craft tailored content for you.
                  </p>
                </div>
              )}

              {loading && (
                <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-violet-50 p-8 text-center">
                  <div className="flex justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-2.5 w-2.5 rounded-full bg-brand-500"
                        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm font-medium text-brand-600">
                    AI is thinking…
                  </p>
                  <div className="mx-auto mt-4 max-w-xs space-y-2">
                    {[1, 0.85, 0.7].map((w, i) => (
                      <div
                        key={i}
                        className="relative h-3 overflow-hidden rounded-full bg-white"
                        style={{ width: `${w * 100}%` }}
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand-200 to-transparent [animation:shimmer_1.4s_infinite]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {result.type === "text" && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                        {result.value}
                      </p>
                    </div>
                  )}
                  {result.type === "chips" && (
                    <div className="flex flex-wrap gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                      {result.value.map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  {result.type === "score" && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                      <div className="flex items-center gap-5">
                        <div className="relative grid h-24 w-24 place-items-center">
                          <svg className="h-24 w-24 -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              fill="none"
                              stroke="#e2e8f0"
                              strokeWidth="8"
                            />
                            <motion.circle
                              cx="48"
                              cy="48"
                              r="40"
                              fill="none"
                              stroke="url(#g)"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 40}
                              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                              animate={{
                                strokeDashoffset:
                                  2 *
                                  Math.PI *
                                  40 *
                                  (1 - result.value.score / 100),
                              }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                            <defs>
                              <linearGradient
                                id="g"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#4F46E5" />
                                <stop offset="100%" stopColor="#7C3AED" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="absolute text-2xl font-extrabold text-ink">
                            {result.value.score}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-ink">
                            ATS Compatibility
                          </p>
                          <p className="text-sm text-ink-2">
                            {result.value.score >= 80
                              ? "Excellent — your resume is highly optimized."
                              : "Good — a few tweaks will boost your score."}
                          </p>
                        </div>
                      </div>
                      {result.value.tips.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {result.value.tips.map((t) => (
                            <li
                              key={t}
                              className="flex gap-2 text-sm text-ink-2"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-lilac px-5 py-4">
              <div className="flex gap-2">
                {result && result.type !== "score" && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        copy(
                          Array.isArray(result.value)
                            ? result.value.join(", ")
                            : result.value,
                        )
                      }
                    >
                      {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={run}>
                      <RefreshCw size={15} /> Regenerate
                    </Button>
                  </>
                )}
              </div>
              {result &&
              tab !== "score" &&
              tab !== "keywords" &&
              tab !== "cover" ? (
                <Button size="sm" onClick={apply}>
                  Apply to resume
                </Button>
              ) : result && tab === "keywords" ? (
                <Button size="sm" onClick={apply}>
                  Add to skills
                </Button>
              ) : (
                <Button size="sm" onClick={run} disabled={loading}>
                  <Sparkles size={15} /> {loading ? "Generating…" : "Generate"}
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
