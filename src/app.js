import express from 'express';
import cors from 'cors';
import { UPLOADS_DIR } from './middleware/upload.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();

// Configure CORS based on FRONTEND_URL environment variable
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// JSON and URL-encoded body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Register Route Groups
app.use('/api/health', healthRoutes);
app.use('/api', authRoutes); // maps /api/login and /api/settings/password
app.use('/api/profile', profileRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);

// Fallback Route Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error: ' + err.message });
});

export default app;
