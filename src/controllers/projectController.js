import db from '../config/db.js';
import { mapRowToProject } from '../utils/helpers.js';

/**
 * Get all projects
 * GET /api/projects
 */
export const getProjects = async (req, res) => {
  try {
    const [projectRows] = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');
    const [relationRows] = await db.execute('SELECT * FROM project_categories');
    
    // Group categories by project_id
    const projectCatsMap = {};
    relationRows.forEach(rel => {
      if (!projectCatsMap[rel.project_id]) {
        projectCatsMap[rel.project_id] = [];
      }
      projectCatsMap[rel.project_id].push(rel.category_name);
    });

    const projects = projectRows.map(row => {
      return mapRowToProject(row, projectCatsMap[row.id] || []);
    });

    res.json(projects);
  } catch (err) {
    console.error('DATABASE ERROR on GET /api/projects:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

/**
 * Get project by ID
 * GET /api/projects/:id
 */
export const getProjectById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const [relationRows] = await db.execute('SELECT category_name FROM project_categories WHERE project_id = ?', [req.params.id]);
    const categories = relationRows.map(r => r.category_name);
    res.json(mapRowToProject(rows[0], categories));
  } catch (err) {
    console.error('DATABASE ERROR on GET /api/projects/:id:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

/**
 * Create a new project
 * POST /api/projects
 */
export const createProject = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    
    // Generate unique ID / Slug
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let id = slug;
    let counter = 1;
    
    const [existing] = await db.execute('SELECT id FROM projects');
    while (existing.some(p => p.id === id)) {
      id = `${slug}-${counter}`;
      counter++;
    }

    // Map uploaded files
    const mainImage = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : '';
    const challengeImage = req.files['challengeImage'] ? `/uploads/${req.files['challengeImage'][0].filename}` : '';
    const strategyImage = req.files['strategyImage'] ? `/uploads/${req.files['strategyImage'][0].filename}` : '';
    const resultsImage = req.files['resultsImage'] ? `/uploads/${req.files['resultsImage'][0].filename}` : '';

    const servicesArray = data.services || [];
    const statusVal = data.status || 'published';

    await db.execute(
      `INSERT INTO projects (
        id, title, tagline, stat, stat_label, stat_detail, image, description,
        client, challenge, challenge_image, strategy, strategy_image, results, results_image,
        testimonial_text, testimonial_author, testimonial_role, services, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        data.tagline || '',
        data.stat || '',
        data.statLabel || '',
        data.statDetail || '',
        mainImage,
        data.description || '',
        data.client || '',
        data.challenge || '',
        challengeImage,
        data.strategy || '',
        strategyImage,
        data.results || '',
        resultsImage,
        data.testimonialText || '',
        data.testimonialAuthor || '',
        data.testimonialRole || '',
        JSON.stringify(servicesArray),
        statusVal
      ]
    );

    // Insert categories
    if (data.categories && data.categories.length > 0) {
      for (const catName of data.categories) {
        await db.execute('INSERT INTO project_categories (project_id, category_name) VALUES (?, ?)', [id, catName]);
      }
    }

    const newProject = mapRowToProject({
      id,
      title: data.title,
      tagline: data.tagline,
      stat: data.stat,
      stat_label: data.statLabel,
      stat_detail: data.statDetail,
      image: mainImage,
      description: data.description,
      client: data.client,
      challenge: data.challenge,
      challenge_image: challengeImage,
      strategy: data.strategy,
      strategy_image: strategyImage,
      results: data.results,
      results_image: resultsImage,
      testimonial_text: data.testimonialText,
      testimonial_author: data.testimonialAuthor,
      testimonial_role: data.testimonialRole,
      services: JSON.stringify(servicesArray),
      status: statusVal
    }, data.categories || []);

    res.status(201).json({ success: true, project: newProject });
  } catch (parseErr) {
    console.error('DATABASE ERROR on POST /api/projects:', parseErr);
    res.status(400).json({ error: 'Invalid form data structure or database error: ' + parseErr.message });
  }
};

/**
 * Update an existing project
 * PUT /api/projects/:id
 */
export const updateProject = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const existingProject = rows[0];

    // Handle file updates (retain old ones if new ones not uploaded)
    const mainImage = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : existingProject.image;
    const challengeImage = req.files['challengeImage'] ? `/uploads/${req.files['challengeImage'][0].filename}` : (existingProject.challenge_image || '');
    const strategyImage = req.files['strategyImage'] ? `/uploads/${req.files['strategyImage'][0].filename}` : (existingProject.strategy_image || '');
    const resultsImage = req.files['resultsImage'] ? `/uploads/${req.files['resultsImage'][0].filename}` : (existingProject.results_image || '');

    const servicesArray = data.services || (existingProject.services ? JSON.parse(existingProject.services) : []);
    const statusVal = data.status || existingProject.status || 'published';

    await db.execute(
      `UPDATE projects SET 
        title = ?, tagline = ?, stat = ?, stat_label = ?, stat_detail = ?, image = ?, description = ?,
        client = ?, challenge = ?, challenge_image = ?, strategy = ?, strategy_image = ?, results = ?, results_image = ?,
        testimonial_text = ?, testimonial_author = ?, testimonial_role = ?, services = ?, status = ?
       WHERE id = ?`,
      [
        data.title || existingProject.title,
        data.tagline !== undefined ? data.tagline : existingProject.tagline,
        data.stat !== undefined ? data.stat : existingProject.stat,
        data.statLabel !== undefined ? data.statLabel : existingProject.stat_label,
        data.statDetail !== undefined ? data.statDetail : existingProject.stat_detail,
        mainImage,
        data.description !== undefined ? data.description : existingProject.description,
        data.client !== undefined ? data.client : existingProject.client,
        data.challenge !== undefined ? data.challenge : existingProject.challenge,
        challengeImage,
        data.strategy !== undefined ? data.strategy : existingProject.strategy,
        strategyImage,
        data.results !== undefined ? data.results : existingProject.results,
        resultsImage,
        data.testimonialText !== undefined ? data.testimonialText : existingProject.testimonial_text,
        data.testimonialAuthor !== undefined ? data.testimonialAuthor : existingProject.testimonial_author,
        data.testimonialRole !== undefined ? data.testimonialRole : existingProject.testimonial_role,
        JSON.stringify(servicesArray),
        statusVal,
        req.params.id
      ]
    );

    // Update categories
    if (data.categories) {
      await db.execute('DELETE FROM project_categories WHERE project_id = ?', [req.params.id]);
      for (const catName of data.categories) {
        await db.execute('INSERT INTO project_categories (project_id, category_name) VALUES (?, ?)', [req.params.id, catName]);
      }
    }

    const [relationRows] = await db.execute('SELECT category_name FROM project_categories WHERE project_id = ?', [req.params.id]);
    const categories = relationRows.map(r => r.category_name);

    const updatedProject = mapRowToProject({
      id: req.params.id,
      title: data.title || existingProject.title,
      tagline: data.tagline !== undefined ? data.tagline : existingProject.tagline,
      stat: data.stat !== undefined ? data.stat : existingProject.stat,
      stat_label: data.statLabel !== undefined ? data.statLabel : existingProject.stat_label,
      stat_detail: data.statDetail !== undefined ? data.statDetail : existingProject.stat_detail,
      image: mainImage,
      description: data.description !== undefined ? data.description : existingProject.description,
      client: data.client !== undefined ? data.client : existingProject.client,
      challenge: data.challenge !== undefined ? data.challenge : existingProject.challenge,
      challenge_image: challengeImage,
      strategy: data.strategy !== undefined ? data.strategy : existingProject.strategy,
      strategy_image: strategyImage,
      results: data.results !== undefined ? data.results : existingProject.results,
      results_image: resultsImage,
      testimonial_text: data.testimonialText !== undefined ? data.testimonialText : existingProject.testimonial_text,
      testimonial_author: data.testimonialAuthor !== undefined ? data.testimonialAuthor : existingProject.testimonial_author,
      testimonial_role: data.testimonialRole !== undefined ? data.testimonialRole : existingProject.testimonial_role,
      services: JSON.stringify(servicesArray),
      status: statusVal
    }, categories);

    res.json({ success: true, project: updatedProject });
  } catch (parseErr) {
    console.error('DATABASE ERROR on PUT /api/projects/:id:', parseErr);
    res.status(400).json({ error: 'Invalid form data structure or database error: ' + parseErr.message });
  }
};

/**
 * Delete a project
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req, res) => {
  try {
    await db.execute('DELETE FROM project_categories WHERE project_id = ?', [req.params.id]);
    const [result] = await db.execute('DELETE FROM projects WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('DATABASE ERROR on DELETE /api/projects/:id:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};
