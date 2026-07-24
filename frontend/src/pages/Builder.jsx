import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Check, Loader2, ZoomIn, ZoomOut, Eye, X } from "lucide-react";
import { Logo } from "../components/landing/Navbar";
import Sidebar from "../components/builder/Sidebar";
import FormSections from "../components/builder/FormSections";
import DownloadMenu from "../components/builder/DownloadMenu";
import ResumePreview from "../components/resume/ResumePreview";
import AIAssistant from "../components/ai/AIAssistant";
import { Button } from "../components/ui/primitives";
import { useResume } from "../context/ResumeContext";
import { cn } from "../utils/cn";

function SaveBadge() {
  const { saved } = useResume();
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold", saved ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
      {saved ? <Check size={13} /> : <Loader2 size={13} className="animate-spin" />}
      {saved ? "Saved" : "Saving…"}
    </span>
  );
}

function PreviewPane({ zoom }) {
  const { resume } = useResume();
  return (
    <div className="flex justify-center">
      <div
        className="w-full max-w-[460px] origin-top overflow-hidden rounded-xl border border-[rgba(17,20,57,0.1)] bg-white shadow-[0_30px_60px_-25px_rgba(17,20,57,0.3)]"
        style={{ transform: `scale(${zoom})` }}
      >
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}

export default function Builder({ onExit }) {
  const [active, setActive] = useState("personal");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTab, setAiTab] = useState("summary");
  const [zoom, setZoom] = useState(1);
  const [mobilePreview, setMobilePreview] = useState(false);

  const openAI = (tab) => {
    setAiTab(tab);
    setAiOpen(true);
  };

  return (
    <div className="flex h-screen flex-col bg-lilac">
      {/* top bar */}
      <header className="no-print z-20 flex shrink-0 items-center justify-between gap-3 border-b border-[rgba(17,20,57,0.08)] bg-white/80 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="grid h-9 w-9 place-items-center rounded-xl text-ink-2 transition hover:bg-black/5 cursor-pointer" aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div className="hidden sm:block"><Logo /></div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <SaveBadge />
          <Button variant="soft" size="sm" onClick={() => openAI("summary")} className="hidden sm:inline-flex">
            <Sparkles size={15} /> AI Assistant
          </Button>
          <button onClick={() => setMobilePreview(true)} className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600 lg:hidden cursor-pointer" aria-label="Preview">
            <Eye size={17} />
          </button>
          <DownloadMenu />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* sidebar */}
        <aside className="no-print w-full shrink-0 border-b border-[rgba(17,20,57,0.08)] bg-white/60 lg:w-60 lg:border-b-0 lg:border-r">
          <div className="lg:sticky lg:top-0">
            <Sidebar active={active} onChange={setActive} />
            <div className="hidden px-4 pb-4 lg:block">
              <button onClick={() => openAI("score")} className="w-full rounded-2xl bg-gradient-to-br from-[#111439] via-[#312e81] to-[#4338ca] p-4 text-left text-white shadow-glow transition hover:scale-[1.02] cursor-pointer">
                <Sparkles size={18} />
                <p className="mt-2 text-sm font-bold">Check ATS Score</p>
                <p className="mt-0.5 text-xs text-white/70">See how your resume ranks</p>
              </button>
            </div>
          </div>
        </aside>

        {/* form */}
        <main className="no-print min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:max-w-xl">
          <AnimatePresence mode="wait">
            <FormSections key={active} active={active} onAI={openAI} />
          </AnimatePresence>
        </main>

        {/* preview (desktop) */}
        <section className="hidden min-w-0 flex-1 overflow-y-auto bg-gradient-to-b from-slate-100 to-lilac p-8 lg:block">
          <div className="no-print mb-4 flex items-center justify-center gap-2">
            <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink-2 shadow-sm hover:text-ink cursor-pointer"><ZoomOut size={15} /></button>
            <span className="w-12 text-center text-xs font-semibold text-ink-2">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))} className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink-2 shadow-sm hover:text-ink cursor-pointer"><ZoomIn size={15} /></button>
          </div>
          <PreviewPane zoom={zoom} />
        </section>
      </div>

      {/* preview (mobile drawer) */}
      <AnimatePresence>
        {mobilePreview && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm cursor-default" onClick={() => setMobilePreview(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }} className="absolute inset-x-0 bottom-0 top-12 overflow-y-auto rounded-t-3xl bg-gradient-to-b from-slate-100 to-lilac p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-bold text-ink">Live Preview</p>
                <button onClick={() => setMobilePreview(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-white text-ink-2 cursor-pointer"><X size={18} /></button>
              </div>
              <PreviewPane zoom={1} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} initialTab={aiTab} />
    </div>
  );
}
