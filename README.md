# Enixel Backend

This is the standalone Node.js Express backend project for the Enixel website. It provides API endpoints for CMS administration, projects, categories, and profiles, and connects directly to the MySQL database.


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
