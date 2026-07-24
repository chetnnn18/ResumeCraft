import { Router } from 'express';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} from '../controllers/resume.controller.js';

const router = Router();

// GET  /api/resumes?ownerId=<uuid>    — list all resumes for an owner
router.get('/', getResumes);

// POST /api/resumes                   — create new resume
router.post('/', createResume);

// GET  /api/resumes/:id               — get single resume
router.get('/:id', getResume);

// PUT  /api/resumes/:id               — full update (auto-save target)
router.put('/:id', updateResume);

// DELETE /api/resumes/:id             — delete resume
router.delete('/:id', deleteResume);

// POST /api/resumes/:id/duplicate     — clone resume
router.post('/:id/duplicate', duplicateResume);

export default router;
