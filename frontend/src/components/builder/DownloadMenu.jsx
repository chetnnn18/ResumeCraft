import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Check, FileType2, Loader2 } from "lucide-react";
import { Button } from "../ui/primitives";
import { printResume } from "../../utils/printResume";

export default function DownloadMenu() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("idle"); // idle | progress | done
  const [progress, setProgress] = useState(0);

  const start = (type) => {
    setOpen(false);
    setState("progress");
    setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          setState("done");
          setTimeout(() => printResume(), 300);
          setTimeout(() => setState("idle"), 2600);
          return 100;
        }
        return p + 8;
      });
    }, 80);
  };

  return (
    <div className="relative">
      <Button size="sm" onClick={() => setOpen((v) => !v)} disabled={state === "progress"}>
        {state === "progress" ? <Loader2 size={16} className="animate-spin" /> : state === "done" ? <Check size={16} /> : <Download size={16} />}
        {state === "progress" ? `${progress}%` : state === "done" ? "Ready!" : "Download"}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white p-2 shadow-xl"
            >
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink-3">Export as</p>
              <button onClick={() => start("pdf")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-brand-50 cursor-pointer">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-500"><FileType2 size={16} /></span>
                PDF Document
              </button>
              <button onClick={() => start("print")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-brand-50 cursor-pointer">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600"><FileText size={16} /></span>
                Print Version
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
