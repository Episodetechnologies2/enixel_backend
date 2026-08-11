import db from '../config/db.js';

/**
 * Get all categories
 * GET /api/categories
 */
export const getCategories = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT name FROM categories ORDER BY id ASC');
    res.json(rows.map(r => r.name));
  } catch (err) {
    console.error('DATABASE ERROR on GET /api/categories:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

/**
 * Add a new category
 * POST /api/categories
 */
export const addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  const cleanName = name.trim();
  try {
    const [rows] = await db.execute('SELECT * FROM categories WHERE name = ?', [cleanName]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    await db.execute('INSERT INTO categories (name) VALUES (?)', [cleanName]);
    const [allCats] = await db.execute('SELECT name FROM categories ORDER BY id ASC');
    res.json({ success: true, categories: allCats.map(r => r.name) });
  } catch (err) {
    console.error('DATABASE ERROR on POST /api/categories:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

/**
 * Delete a category
 * DELETE /api/categories
 */
export const deleteCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  const cleanName = name.trim();
  try {
    await db.execute('DELETE FROM categories WHERE name = ?', [cleanName]);
    const [allCats] = await db.execute('SELECT name FROM categories ORDER BY id ASC');
    res.json({ success: true, categories: allCats.map(r => r.name) });
  } catch (err) {
    console.error('DATABASE ERROR on DELETE /api/categories:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};
