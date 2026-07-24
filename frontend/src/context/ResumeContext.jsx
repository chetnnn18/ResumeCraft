import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { SAMPLE_RESUME } from "../Data";
import api from "../services/api";

const ResumeContext = createContext(null);

// ─── localStorage keys ────────────────────────────────────────────────────────
const CACHE_KEY  = "resumai:data";      // local cache of resume JSON (fallback)
const OWNER_KEY  = "resumai:ownerId";   // anonymous owner UUID
const RESUME_KEY = "resumai:resumeId";  // MongoDB _id of the active resume

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the stored ownerId, or generates a new UUID and persists it.
 * ownerId is future-proof: when auth is added, it will be swapped for a
 * real User._id without any schema changes in MongoDB.
 */
function getOrCreateOwnerId() {
  let id = localStorage.getItem(OWNER_KEY);
  if (!id) {
    // crypto.randomUUID is available in all modern browsers (2021+)
    id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(OWNER_KEY, id);
  }
  return id;
}

/**
 * Load the initial resume state from the local cache so the UI renders
 * instantly while the API fetch happens in the background.
 */
function loadCachedResume() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore parse errors */
  }
  return SAMPLE_RESUME;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ResumeProvider({ children }) {
  // ── State (interface identical to the original) ───────────────────────────
  const [resume, setResume] = useState(loadCachedResume);
  const [saved, setSaved]   = useState(true);

  // ── New state (internal — not exposed on context) ─────────────────────────
  const [resumeId, setResumeId] = useState(
    () => localStorage.getItem(RESUME_KEY)
  );

  /**
   * isReady: true once the init effect has finished (either API loaded or
   * fell back to cache). The save effect checks this flag so it never fires
   * during the initial API fetch — which would cause a pointless PUT on mount.
   */
  const isReady = useRef(false);

  // ── Init effect — runs once on mount ─────────────────────────────────────
  useEffect(() => {
    const ownerId = getOrCreateOwnerId();

    async function init() {
      try {
        const cachedId = localStorage.getItem(RESUME_KEY);

        if (cachedId) {
          // We know which resume to load — fetch it directly.
          const { data } = await api.get(`/resumes/${cachedId}`);
          setResume(data.data);
          setResumeId(data.data._id);
        } else {
          // No cached resume ID — check if this owner has any saved resumes.
          const { data: listData } = await api.get("/resumes", {
            params: { ownerId },
          });

          if (listData.data.length > 0) {
            // Use the most recently updated resume.
            const latest = listData.data[0];
            setResume(latest);
            setResumeId(latest._id);
            localStorage.setItem(RESUME_KEY, latest._id);
          } else {
            // First-time user — create a resume seeded with SAMPLE_RESUME data.
            const { data: created } = await api.post("/resumes", {
              ...SAMPLE_RESUME,
              ownerId,
              title: "My Resume",
            });
            setResume(created.data);
            setResumeId(created.data._id);
            localStorage.setItem(RESUME_KEY, created.data._id);
          }
        }
      } catch {
        // API is unavailable (backend not running, network error, etc.).
        // The cached resume from loadCachedResume() is already in state — nothing to do.
        // The save effect will keep updating the local cache.
      } finally {
        // Mark as ready AFTER state updates, so the save effect can proceed.
        isReady.current = true;
      }
    }

    init();
  }, []); // runs once on mount

  // ── Auto-save effect — debounced, fires on every resume change ────────────
  useEffect(() => {
    setSaved(false);

    const t = setTimeout(async () => {
      try {
        // Always update the local cache so fallback mode works.
        localStorage.setItem(CACHE_KEY, JSON.stringify(resume));

        // Only call the API once the init phase is complete and we have an ID.
        if (isReady.current && resumeId) {
          await api.put(`/resumes/${resumeId}`, resume);
        }

        setSaved(true);
      } catch {
        // API save failed — cache is already updated, so data is not lost.
        // Show saved anyway so the UX badge doesn't stay in "Saving…" forever.
        setSaved(true);
      }
    }, 600);

    return () => clearTimeout(t);
  }, [resume, resumeId]);

  // ── Methods (identical signatures to the original) ────────────────────────

  const update = useCallback((path, value) => {
    setResume((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  const setField = useCallback((section, value) => {
    setResume((prev) => ({ ...prev, [section]: value }));
  }, []);

  const resetResume = useCallback(() => setResume(SAMPLE_RESUME), []);

  // ── Context value (identical shape to the original) ───────────────────────
  return (
    <ResumeContext.Provider
      value={{ resume, setResume, update, setField, resetResume, saved }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}

const uid = () => Math.random().toString(36).slice(2, 9);
export const newId = uid;
