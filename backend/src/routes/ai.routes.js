import { Router } from 'express';
import { aiLimiter } from '../middlewares/rateLimiter.js';
import {
  generateSummary,
  enhanceBullets,
  suggestSkills,
  generateKeywords,
  generateCoverLetter,
  atsScore,
} from '../controllers/ai.controller.js';

const router = Router();

// All AI routes share the strict rate limiter (30 req / 15 min)
router.use(aiLimiter);

// POST /api/ai/summary        — generate professional summary (tab: "summary")
router.post('/summary', generateSummary);

// POST /api/ai/enhance        — enhance experience bullets (tab: "enhance")
router.post('/enhance', enhanceBullets);

// POST /api/ai/skills         — suggest skills (tab: "skills")
router.post('/skills', suggestSkills);

// POST /api/ai/keywords       — extract ATS keywords (tab: "keywords")
router.post('/keywords', generateKeywords);

// POST /api/ai/cover-letter   — generate cover letter (tab: "cover")
router.post('/cover-letter', generateCoverLetter);

// POST /api/ai/ats-score      — compute ATS score (tab: "score")
router.post('/ats-score', atsScore);

export default router;
