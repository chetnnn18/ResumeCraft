import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ResumeProvider } from "./context/ResumeContext";
import Home from "./pages/Home";
import Builder from "./pages/Builder";

export default function App() {
  const [view, setView] = useState("home");

  const launch = () => {
    setView("builder");
    window.scrollTo({ top: 0 });
  };
  const exit = () => setView("home");

  useEffect(() => {
    document.title =
      view === "builder"
        ? "AI ResumeCraft · Resume Builder"
        : "AI ResumeCraft — Build Job-Winning Resumes With AI";
  }, [view]);

  return (
    <ResumeProvider>
      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.4 }}
          >
            <Home onLaunch={launch} />
          </motion.div>
        ) : (
          <motion.div
            key="builder"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
          >
            <Builder onExit={exit} />
          </motion.div>
        )}
      </AnimatePresence>
    </ResumeProvider>
  );
}
