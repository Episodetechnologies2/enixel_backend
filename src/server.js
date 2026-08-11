import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 5000;

// Start Express HTTP Server
app.listen(PORT, () => {
  console.log(`CMS Backend Server is running on port ${PORT}`);
});
