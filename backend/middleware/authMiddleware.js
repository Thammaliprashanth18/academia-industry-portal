const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'academia_industry_secret_key');

    // Fetch user from database
    const [users] = await pool.query(
      'SELECT id, name, email, role, status, avatar_url FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    const user = users[0];

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact the administrator.'
      });
    }

    if (user.role === 'student') {
      const [students] = await pool.query('SELECT id FROM students WHERE user_id = ?', [user.id]);
      if (students.length > 0) {
        user.student_id = students[0].id;
      }
    } else if (user.role === 'company') {
      const [companies] = await pool.query('SELECT id, verification_status FROM companies WHERE user_id = ?', [user.id]);
      if (companies.length > 0) {
        user.company_id = companies[0].id;
        user.verification_status = companies[0].verification_status;
      }
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'academia_industry_secret_key');
      const [users] = await pool.query(
        'SELECT id, name, email, role, status, avatar_url FROM users WHERE id = ?',
        [decoded.id]
      );
      if (users.length > 0 && users[0].status === 'active') {
        const user = users[0];
        if (user.role === 'student') {
          const [students] = await pool.query('SELECT id FROM students WHERE user_id = ?', [user.id]);
          if (students.length > 0) user.student_id = students[0].id;
        } else if (user.role === 'company') {
          const [companies] = await pool.query('SELECT id FROM companies WHERE user_id = ?', [user.id]);
          if (companies.length > 0) user.company_id = companies[0].id;
        }
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore error for optional authentication
  }
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize
};
