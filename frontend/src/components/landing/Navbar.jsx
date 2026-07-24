import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/primitives";
import { cn } from "../../utils/cn";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 cursor-pointer">
      <img
        src="/logo.png"
        alt="AI ResumeCraft logo"
        className="h-9 w-9 rounded-xl object-cover shadow-[0_8px_20px_-6px_rgba(79,70,229,0.6)]"
      />
      <span className="text-lg font-extrabold tracking-tight text-ink">
        AI Resum<span className="text-gradient">eCraft</span>
      </span>
    </a>
  );
}

export default function Navbar({ onLaunch }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6",
          scrolled &&
            "mx-3 rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white/70 px-4 py-2 shadow-[0_8px_30px_-12px_rgba(17,20,57,0.18)] backdrop-blur-xl sm:mx-auto",
        )}
      >
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-black/5 hover:text-ink cursor-pointer"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" onClick={onLaunch}>
            Login
          </Button>
          <Button size="sm" onClick={onLaunch}>
            Get Started
          </Button>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(17,20,57,0.08)] bg-white/70 text-ink md:hidden cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-3 mt-2 overflow-hidden rounded-2xl border border-[rgba(17,20,57,0.08)] bg-white/90 p-3 shadow-xl backdrop-blur-xl md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-ink-2 hover:bg-black/5 cursor-pointer"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={onLaunch}>
                Login
              </Button>
              <Button size="sm" onClick={onLaunch}>
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
