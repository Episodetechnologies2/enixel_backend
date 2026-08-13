import db from './db.js';

/**
 * Checks the projects database table structure on startup.
 * Automatically adds the `services` and `status` columns if they are missing
 * (which causes 400 Bad Request errors on project operations in environments
 * with older database schemas).
 */
export const initDbSchema = async () => {
  try {
    console.log('Running database auto-healing schema checks...');
    
    // Check if the projects table exists
    const [tables] = await db.execute("SHOW TABLES LIKE 'projects'");
    if (tables.length === 0) {
      console.warn("Table 'projects' does not exist yet. Please run schema.sql to initialize it.");
      return;
    }

    // Retrieve existing columns in projects table
    const [columns] = await db.execute("SHOW COLUMNS FROM projects");
    const columnNames = columns.map(c => c.Field.toLowerCase());

    // Check and add 'services' column if missing
    if (!columnNames.includes('services')) {
      console.log("Adding missing column 'services' to 'projects' table...");
      await db.execute("ALTER TABLE projects ADD COLUMN services TEXT NULL");
      console.log("Column 'services' added successfully.");
    }

    // Check and add 'status' column if missing
    if (!columnNames.includes('status')) {
      console.log("Adding missing column 'status' to 'projects' table...");
      await db.execute("ALTER TABLE projects ADD COLUMN status VARCHAR(50) DEFAULT 'published'");
      console.log("Column 'status' added successfully.");
    }

    console.log('Database schema check completed successfully.');
  } catch (err) {
    console.error('DATABASE AUTO-HEALING MIGRATION ERROR:', err);
  }
};
