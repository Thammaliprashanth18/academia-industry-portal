const pool = require('../config/db');

// Get All Skills
const getAllSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM skills WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY name ASC';

    const [skills] = await pool.query(query, params);

    // Get categories list
    const [categories] = await pool.query('SELECT DISTINCT category FROM skills ORDER BY category ASC');

    return res.json({
      success: true,
      data: skills,
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch skills.', error: error.message });
  }
};

module.exports = {
  getAllSkills
};
