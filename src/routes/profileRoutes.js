import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { profileUpload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/profile
router.get('/', getProfile);

// PUT /api/profile (handles optional avatar upload)
router.put('/', profileUpload, updateProfile);

export default router;
