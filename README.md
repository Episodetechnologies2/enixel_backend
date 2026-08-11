# Enixel Backend

This is the standalone Node.js Express backend project for the Enixel website. It provides API endpoints for CMS administration, projects, categories, and profiles, and connects directly to the MySQL database.

## Directory Structure

```
enixel_backend/
├── src/
│   ├── config/          # Connection settings (e.g. database connection pool)
│   │   └── db.js
│   ├── controllers/     # Route request handlers
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── profileController.js
│   │   └── projectController.js
│   ├── routes/          # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── profileRoutes.js
│   │   └── projectRoutes.js
│   ├── middleware/      # Global or route-specific middlewares (e.g. Multer)
│   │   └── upload.js
│   ├── utils/           # Shared helper functions
│   │   └── helpers.js
│   ├── app.js           # App configuration and route bindings
│   └── server.js        # Main starting point (listens on PORT)
├── .env                 # Secret environment variables (ignored in Git)
├── .env.example         # Template for environment configuration
├── .gitignore           # File/folder patterns to exclude from Git
└── package.json         # Dependencies and start scripts
```

## Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in the MySQL database credentials.

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

## Key API Endpoints

- **Health Check**: `GET /api/health`
- **Authentication**: `POST /api/login`
- **Profile**: `GET /api/profile`, `PUT /api/profile`
- **Projects**: `GET /api/projects`, `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`
- **Categories**: `GET /api/categories`, `POST /api/categories`, `DELETE /api/categories`
