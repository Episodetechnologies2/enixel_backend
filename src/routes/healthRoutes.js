import express from 'express';

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Enixel backend is running'
  });
});

export default router;
