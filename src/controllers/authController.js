import db from '../config/db.js';

/**
 * Handle admin login request
 * POST /api/login
 */
export const login = async (req, res) => {
  const { username, password } = req.body;
  const cleanUsername = username ? username.trim() : '';
  const cleanPassword = password ? password.trim() : '';

  try {
    const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [cleanUsername]);
    
    if (rows.length > 0 && rows[0].password === cleanPassword) {
      // Return success along with user details
      res.json({ 
        success: true, 
        message: 'Login successful',
        token: 'enixel-cms-session-token-2026',
        user: {
          id: rows[0].id,
          username: rows[0].username,
          name: rows[0].name,
          role: rows[0].role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('DATABASE ERROR on POST /api/login:', err);
    res.status(500).json({ success: false, error: 'Database error: ' + err.message });
  }
};

/**
 * Update password settings
 * POST /api/settings/password
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const cleanCurrent = currentPassword ? currentPassword.trim() : '';
  const cleanNew = newPassword ? newPassword.trim() : '';

  if (!cleanCurrent || !cleanNew) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  try {
    const [rows] = await db.execute('SELECT password FROM admins WHERE id = 1');
    if (rows.length === 0 || rows[0].password !== cleanCurrent) {
      return res.status(400).json({ error: 'Current password does not match' });
    }

    await db.execute('UPDATE admins SET password = ? WHERE id = 1', [cleanNew]);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('DATABASE ERROR on POST /api/settings/password:', err);
    res.status(500).json({ success: false, error: 'Database error: ' + err.message });
  }
};
