const pool = require('../config/db');

// 1. Admin Dashboard Metrics & Analytics
const getDashboardStats = async (req, res) => {
  try {
    const [userCounts] = await pool.query(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as totalStudents,
        SUM(CASE WHEN role = 'company' THEN 1 ELSE 0 END) as totalCompanies,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as totalAdmins,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeUsers
      FROM users
    `);

    const [internshipCounts] = await pool.query(`
      SELECT 
        COUNT(*) as totalInternships,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeInternships
      FROM internships
    `);

    const [jobCounts] = await pool.query(`
      SELECT 
        COUNT(*) as totalJobs,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeJobs
      FROM jobs
    `);

    const [appCounts] = await pool.query(`
      SELECT 
        COUNT(*) as totalApplications,
        SUM(CASE WHEN status = 'Applied' THEN 1 ELSE 0 END) as appliedCount,
        SUM(CASE WHEN status = 'Under Review' THEN 1 ELSE 0 END) as underReviewCount,
        SUM(CASE WHEN status = 'Shortlisted' THEN 1 ELSE 0 END) as shortlistedCount,
        SUM(CASE WHEN status = 'Interview' THEN 1 ELSE 0 END) as interviewCount,
        SUM(CASE WHEN status = 'Selected' THEN 1 ELSE 0 END) as selectedCount,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejectedCount
      FROM applications
    `);

    const [skillCount] = await pool.query('SELECT COUNT(*) as totalSkills FROM skills');

    // Recent 5 Registrations
    const [recentUsers] = await pool.query(`
      SELECT id, name, email, role, status, created_at, avatar_url
      FROM users
      ORDER BY created_at DESC
      LIMIT 6
    `);

    // Top Demanded Skills
    const [topSkills] = await pool.query(`
      SELECT s.name, s.category, COUNT(*) as count
      FROM (
        SELECT skill_id FROM internship_skills
        UNION ALL
        SELECT skill_id FROM job_skills
      ) all_skills
      JOIN skills s ON all_skills.skill_id = s.id
      GROUP BY s.id
      ORDER BY count DESC
      LIMIT 6
    `);

    return res.json({
      success: true,
      data: {
        users: userCounts[0],
        internships: internshipCounts[0],
        jobs: jobCounts[0],
        applications: appCounts[0],
        totalSkills: skillCount[0].totalSkills,
        recentUsers,
        topSkills
      }
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load admin stats.', error: error.message });
  }
};

// 2. Manage Users
const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let query = `
      SELECT u.id, u.name, u.email, u.role, u.status, u.avatar_url, u.created_at,
             s.college, s.branch, s.cgpa,
             c.company_name, c.verification_status
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN companies c ON u.id = c.user_id
      WHERE 1=1
    `;
    const params = [];

    if (role && role !== 'all') {
      query += ' AND u.role = ?';
      params.push(role);
    }
    if (status && status !== 'all') {
      query += ' AND u.status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ? OR c.company_name LIKE ? OR s.college LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY u.created_at DESC';

    const [users] = await pool.query(query, params);
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users.', error: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    return res.json({ success: true, message: `User status changed to ${status}.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user status.', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account.' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user.', error: error.message });
  }
};

// 3. Manage Companies
const getAllCompanies = async (req, res) => {
  try {
    const [companies] = await pool.query(`
      SELECT c.*, u.name as owner_name, u.email as owner_email, u.status as account_status,
             (SELECT COUNT(*) FROM internships WHERE company_id = c.id) as internship_count,
             (SELECT COUNT(*) FROM jobs WHERE company_id = c.id) as job_count
      FROM companies c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);
    return res.json({ success: true, data: companies });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch companies.', error: error.message });
  }
};

const verifyCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { verification_status } = req.body;

    if (!['verified', 'pending', 'rejected'].includes(verification_status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status.' });
    }

    await pool.query('UPDATE companies SET verification_status = ? WHERE id = ?', [verification_status, id]);
    return res.json({ success: true, message: `Company verification updated to ${verification_status}.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update company verification.', error: error.message });
  }
};

// 4. Skills Catalog Management
const manageSkills = async (req, res) => {
  try {
    const [skills] = await pool.query(`
      SELECT s.*, 
        (SELECT COUNT(*) FROM student_skills WHERE skill_id = s.id) as student_count,
        (SELECT COUNT(*) FROM internship_skills WHERE skill_id = s.id) as internship_count,
        (SELECT COUNT(*) FROM job_skills WHERE skill_id = s.id) as job_count
      FROM skills s
      ORDER BY s.name ASC
    `);
    return res.json({ success: true, data: skills });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch skills catalog.', error: error.message });
  }
};

const addSkill = async (req, res) => {
  try {
    const { name, category = 'Technical' } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }

    const [existing] = await pool.query('SELECT id FROM skills WHERE LOWER(name) = ?', [name.trim().toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Skill already exists in catalog.' });
    }

    const [result] = await pool.query('INSERT INTO skills (name, category) VALUES (?, ?)', [name.trim(), category]);
    return res.status(201).json({ success: true, message: 'Skill added to catalog.', skillId: result.insertId });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add skill.', error: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM skills WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Skill deleted from catalog.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete skill.', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllCompanies,
  verifyCompany,
  manageSkills,
  addSkill,
  deleteSkill
};
