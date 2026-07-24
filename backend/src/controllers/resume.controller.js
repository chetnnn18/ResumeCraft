import Resume from '../models/Resume.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Strips Mongoose internals from the response so the frontend
 * receives a plain object matching the shape of SAMPLE_RESUME.
 */
const toClient = (doc) => doc.toObject({ versionKey: false });

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /api/resumes?ownerId=<uuid>
 * Returns all resumes for a given owner, sorted newest first.
 */
export const getResumes = asyncHandler(async (req, res) => {
  const { ownerId } = req.query;

  if (!ownerId) {
    throw new AppError('ownerId query parameter is required.', 400);
  }

  const resumes = await Resume.find({ ownerId })
    .sort({ updatedAt: -1 })
    .lean();

  res.json({ success: true, data: resumes });
});

/**
 * GET /api/resumes/:id
 * Returns a single resume by its MongoDB _id.
 */
export const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    throw new AppError('Resume not found.', 404);
  }

  res.json({ success: true, data: toClient(resume) });
});

/**
 * POST /api/resumes
 * Creates a new resume.
 * Body must include ownerId; all resume fields are optional (defaults apply).
 */
export const createResume = asyncHandler(async (req, res) => {
  const { ownerId, title, ...resumeData } = req.body;

  if (!ownerId) {
    throw new AppError('ownerId is required to create a resume.', 400);
  }

  const resume = await Resume.create({ ownerId, title, ...resumeData });

  res.status(201).json({ success: true, data: toClient(resume) });
});

/**
 * PUT /api/resumes/:id
 * Full update — replaces all resume fields.
 * This is called by the auto-save debounce in ResumeContext.
 */
export const updateResume = asyncHandler(async (req, res) => {
  // Prevent ownerId from being overwritten via body
  const { ownerId, _id, createdAt, updatedAt, ...updateData } = req.body;

  const resume = await Resume.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!resume) {
    throw new AppError('Resume not found.', 404);
  }

  res.json({ success: true, data: toClient(resume) });
});

/**
 * DELETE /api/resumes/:id
 * Deletes a resume by _id.
 */
export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findByIdAndDelete(req.params.id);

  if (!resume) {
    throw new AppError('Resume not found.', 404);
  }

  res.json({ success: true, message: 'Resume deleted successfully.' });
});

/**
 * POST /api/resumes/:id/duplicate
 * Clones an existing resume and returns the new copy.
 */
export const duplicateResume = asyncHandler(async (req, res) => {
  const original = await Resume.findById(req.params.id);

  if (!original) {
    throw new AppError('Resume not found.', 404);
  }

  const { _id, createdAt, updatedAt, ...data } = toClient(original);

  const copy = await Resume.create({
    ...data,
    title: `${data.title || 'Resume'} (Copy)`,
  });

  res.status(201).json({ success: true, data: toClient(copy) });
});
