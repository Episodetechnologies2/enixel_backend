import db from '../config/db.js';

/**
 * Get profile data
 * GET /api/profile
 */
export const getProfile = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT username, name, role, bio, avatar FROM admins WHERE id = 1');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('DATABASE ERROR on GET /api/profile:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
};

/**
 * Update profile data
 * PUT /api/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const updates = [];
    const params = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name.trim());
    }
    if (data.username !== undefined) {
      updates.push('username = ?');
      params.push(data.username.trim());
    }
    if (data.role !== undefined) {
      updates.push('role = ?');
      params.push(data.role.trim());
    }
    if (data.bio !== undefined) {
      updates.push('bio = ?');
      params.push(data.bio.trim());
    }
    if (req.file) {
      updates.push('avatar = ?');
      params.push(`/uploads/${req.file.filename}`);
    }

    if (updates.length > 0) {
      params.push(1); // admin id = 1
      await db.execute(`UPDATE admins SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const [rows] = await db.execute('SELECT username, name, role, bio, avatar FROM admins WHERE id = 1');
    res.json({
      success: true,
      profile: rows[0]
    });
  } catch (parseErr) {
    console.error('DATABASE ERROR on PUT /api/profile:', parseErr);
    res.status(400).json({ error: 'Invalid form data structure or database error: ' + parseErr.message });
  }
};
