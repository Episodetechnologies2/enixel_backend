import express from 'express';
import { getCategories, addCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

// GET /api/categories
router.get('/', getCategories);

// POST /api/categories
router.post('/', addCategory);

// DELETE /api/categories
router.delete('/', deleteCategory);

export default router;
