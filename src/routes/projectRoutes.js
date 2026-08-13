import express from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/projects
router.get('/', getProjects);

// GET /api/projects/:id
router.get('/:id', getProjectById);

// POST /api/projects (handles multi-image fields)
router.post('/', upload, createProject);

// PUT /api/projects/:id (handles multi-image updates)
router.put('/:id', upload, updateProject);

// DELETE /api/projects/:id
router.delete('/:id', deleteProject);

export default router;
