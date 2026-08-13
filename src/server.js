import 'dotenv/config';
import app from './app.js';
import { initDbSchema } from './config/dbInit.js';

const PORT = process.env.PORT || 5000;

// Initialize Database Schema and start Server
async function startServer() {
  await initDbSchema();
  
  app.listen(PORT, () => {
    console.log(`CMS Backend Server is running on port ${PORT}`);
  });
}

startServer();

