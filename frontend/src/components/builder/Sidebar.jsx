import { motion } from "framer-motion";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Zap,
  FolderGit2,
  Award,
  Languages,
  Users,
  Settings,
} from "lucide-react";
import { SECTION_LIST } from "../../Data";
import { cn } from "../../utils/cn";

const ICONS = {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Zap,
  FolderGit2,
  Award,
  Languages,
  Users,
  Settings,
};

export default function Sidebar({ active, onChange }) {
  return (
    <nav className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-4">
      {SECTION_LIST.map((s) => {
        const Icon = ICONS[s.icon];
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={cn(
              "relative flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition lg:w-full cursor-pointer",
              isActive
                ? "text-white"
                : "text-ink-2 hover:bg-black/5 hover:text-ink",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="sidebar-active"
                className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] shadow-lg shadow-brand-500/30"
                transition={{ type: "spring", damping: 24, stiffness: 320 }}
              />
            )}
            <Icon size={17} className="shrink-0" />
            <span className="whitespace-nowrap">{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
