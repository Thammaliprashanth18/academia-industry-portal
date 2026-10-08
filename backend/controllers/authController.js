const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Helper to sign JWT token
const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET || 'academia_industry_secure_jwt_token_secret_2026',
    { expiresIn: '7d' }
  );
};

// 1. Register User (Student or Company)
const register = async (req, res) => {
  try {
    const { name, email, password, role, company_name, college } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required.'
      });
    }

    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either student or company.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default avatar
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&size=150`;

    // Insert user
    const [userResult] = await pool.query(
      'INSERT INTO users (name, email, password, role, status, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, role, 'active', defaultAvatar]
    );

    const userId = userResult.insertId;

    // Create corresponding student or company profile
    if (role === 'student') {
      await pool.query(
        'INSERT INTO students (user_id, college) VALUES (?, ?)',
        [userId, college || null]
      );
    } else if (role === 'company') {
      await pool.query(
        'INSERT INTO companies (user_id, company_name, contact_email, verification_status) VALUES (?, ?, ?, ?)',
        [userId, company_name || name, email.toLowerCase().trim(), 'verified']
      );
    }

    const token = signToken({ id: userId, email: email.toLowerCase().trim(), role, name });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: userId,
        name,
        email: email.toLowerCase().trim(),
        role,
        avatar_url: defaultAvatar
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.',
      error: error.message
    });
  }
};

// 2. Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const [users] = await pool.query(
      'SELECT id, name, email, password, role, status, avatar_url FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = users[0];

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact administrator.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Fetch related profile ID
    let profileData = {};
    if (user.role === 'student') {
      const [students] = await pool.query('SELECT * FROM students WHERE user_id = ?', [user.id]);
      if (students.length > 0) {
        profileData = students[0];
      }
    } else if (user.role === 'company') {
      const [companies] = await pool.query('SELECT * FROM companies WHERE user_id = ?', [user.id]);
      if (companies.length > 0) {
        profileData = companies[0];
      }
    }

    const token = signToken(user);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        profile: profileData
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
      error: error.message
    });
  }
};

// 3. Get Authenticated User Details (Me)
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await pool.query(
      'SELECT id, name, email, role, status, avatar_url, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = users[0];
    let profile = null;

    if (user.role === 'student') {
      const [students] = await pool.query('SELECT * FROM students WHERE user_id = ?', [user.id]);
      if (students.length > 0) {
        profile = students[0];
        // Fetch student skills
        const [skills] = await pool.query(`
          SELECT s.id, s.name, s.category, ss.proficiency 
          FROM student_skills ss
          JOIN skills s ON ss.skill_id = s.id
          WHERE ss.student_id = ?
        `, [profile.id]);
        profile.skills = skills;
      }
    } else if (user.role === 'company') {
      const [companies] = await pool.query('SELECT * FROM companies WHERE user_id = ?', [user.id]);
      if (companies.length > 0) {
        profile = companies[0];
      }
    }

    return res.json({
      success: true,
      user: {
        ...user,
        profile
      }
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user data.',
      error: error.message
    });
  }
};

// 4. Update Password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.'
      });
    }

    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    return res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    console.error('Update Password Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update password.',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updatePassword
};
