import gemini from '../services/GeminiService.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// ─── AI Controllers ───────────────────────────────────────────────────────────
// Each controller maps to exactly one tab in the existing AIAssistant.jsx UI.
// Return format: { success: true, result: <value> }
// where <value> is:
//   - string  → AIAssistant renders as { type: "text" }
//   - array   → AIAssistant renders as { type: "chips" }
//   - object  → AIAssistant renders as { type: "score" }

/**
 * POST /api/ai/summary
 * Tab: "summary" — generates a professional summary paragraph.
 */
export const generateSummary = asyncHandler(async (req, res) => {
  const { title, experience, skills } = req.body;

  if (!title && !experience?.length && !skills?.length) {
    throw new AppError('At least one of title, experience, or skills is required.', 400);
  }

  const result = await gemini.generateSummary({ title, experience, skills });
  res.json({ success: true, result });
});

/**
 * POST /api/ai/enhance
 * Tab: "enhance" — rewrites experience bullets with action verbs and metrics.
 */
export const enhanceBullets = asyncHandler(async (req, res) => {
  const { bullets, role, company } = req.body;

  const result = await gemini.enhanceBullets({ bullets, role, company });
  res.json({ success: true, result });
});

/**
 * POST /api/ai/skills
 * Tab: "skills" — suggests additional skills for a given job title.
 */
export const suggestSkills = asyncHandler(async (req, res) => {
  const { title, currentSkills } = req.body;

  const result = await gemini.suggestSkills({ title, currentSkills });
  res.json({ success: true, result });
});

/**
 * POST /api/ai/keywords
 * Tab: "keywords" — extracts ATS-optimised keywords from resume content.
 */
export const generateKeywords = asyncHandler(async (req, res) => {
  const { title, summary, experience } = req.body;

  const result = await gemini.generateKeywords({ title, summary, experience });
  res.json({ success: true, result });
});

/**
 * POST /api/ai/cover-letter
 * Tab: "cover" — generates a professional cover letter.
 */
export const generateCoverLetter = asyncHandler(async (req, res) => {
  const { name, title, company } = req.body;

  const result = await gemini.generateCoverLetter({ name, title, company });
  res.json({ success: true, result });
});

/**
 * POST /api/ai/ats-score
 * Tab: "score" — returns ATS compatibility score + improvement tips.
 * Returns { score: number, tips: string[] } matching the existing UI exactly.
 */
export const atsScore = asyncHandler(async (req, res) => {
  const { resume } = req.body;

  if (!resume || typeof resume !== 'object') {
    throw new AppError('Resume object is required.', 400);
  }

  const result = await gemini.atsScore({ resume });
  res.json({ success: true, result });
});
