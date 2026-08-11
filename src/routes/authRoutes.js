import express from 'express';
import { login, changePassword } from '../controllers/authController.js';

const router = express.Router();

// POST /api/login
router.post('/login', login);

// POST /api/settings/password
router.post('/settings/password', changePassword);

export default router;
