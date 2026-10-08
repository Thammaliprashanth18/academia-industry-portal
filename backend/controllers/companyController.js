const pool = require('../config/db');
const { calculateSkillMatch } = require('../utils/skillMatcher');

// Helper to get company ID from user ID
const getCompanyId = async (userId) => {
  const [rows] = await pool.query('SELECT id FROM companies WHERE user_id = ?', [userId]);
  if (rows.length === 0) {
    const [user] = await pool.query('SELECT name, email FROM users WHERE id = ?', [userId]);
    const [result] = await pool.query(
      'INSERT INTO companies (user_id, company_name, contact_email, verification_status) VALUES (?, ?, ?, ?)',
      [userId, user[0]?.name || 'Company', user[0]?.email || '', 'verified']
    );
    return result.insertId;
  }
  return rows[0].id;
};

// 1. Get Company Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(`
      SELECT c.*, u.name as contact_person, u.email as account_email, u.avatar_url
      FROM companies c
      JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Company profile not found.' });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get Company Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch company profile.', error: error.message });
  }
};

// 2. Update Company Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = await getCompanyId(userId);
    const {
      company_name,
      industry_type,
      company_size,
      website,
      location,
      contact_email,
      contact_phone,
      description
    } = req.body;

    await pool.query(`
      UPDATE companies SET
        company_name = ?,
        industry_type = ?,
        company_size = ?,
        website = ?,
        location = ?,
        contact_email = ?,
        contact_phone = ?,
        description = ?
      WHERE id = ?
    `, [
      company_name || 'My Company',
      industry_type || null,
      company_size || null,
      website || null,
      location || null,
      contact_email || null,
      contact_phone || null,
      description || null,
      companyId
    ]);

    return res.json({ success: true, message: 'Company profile updated successfully.' });
  } catch (error) {
    console.error('Update Company Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update company profile.', error: error.message });
  }
};

// 3. Upload Company Logo
const uploadLogo = async (req, res) => {
  try {
    const userId = req.user.id;
    const companyId = await getCompanyId(userId);

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No logo image uploaded.' });
    }

    const logoUrl = `/uploads/images/${req.file.filename}`;
    await pool.query('UPDATE companies SET logo_url = ? WHERE id = ?', [logoUrl, companyId]);
    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [logoUrl, userId]);

    return res.json({ success: true, message: 'Company logo uploaded successfully.', logoUrl });
  } catch (error) {
    console.error('Upload Logo Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload logo.', error: error.message });
  }
};

// 4. Company Dashboard Analytics & Overview
const getDashboardStats = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);

    // Active Internships count
    const [internshipCount] = await pool.query(
      'SELECT COUNT(*) as count FROM internships WHERE company_id = ?',
      [companyId]
    );

    // Active Jobs count
    const [jobCount] = await pool.query(
      'SELECT COUNT(*) as count FROM jobs WHERE company_id = ?',
      [companyId]
    );

    // Total and by-status Applications for this company
    const [appStats] = await pool.query(`
      SELECT 
        COUNT(a.id) as totalApplicants,
        SUM(CASE WHEN a.status = 'Applied' THEN 1 ELSE 0 END) as appliedCount,
        SUM(CASE WHEN a.status = 'Under Review' THEN 1 ELSE 0 END) as underReviewCount,
        SUM(CASE WHEN a.status = 'Shortlisted' THEN 1 ELSE 0 END) as shortlistedCount,
        SUM(CASE WHEN a.status = 'Interview' THEN 1 ELSE 0 END) as interviewCount,
        SUM(CASE WHEN a.status = 'Selected' THEN 1 ELSE 0 END) as selectedCount,
        SUM(CASE WHEN a.status = 'Rejected' THEN 1 ELSE 0 END) as rejectedCount
      FROM applications a
      LEFT JOIN internships i ON a.opportunity_type = 'internship' AND a.opportunity_id = i.id
      LEFT JOIN jobs j ON a.opportunity_type = 'job' AND a.opportunity_id = j.id
      WHERE i.company_id = ? OR j.company_id = ?
    `, [companyId, companyId]);

    // Recent 5 Applications with applicant info
    const [recentApplicants] = await pool.query(`
      SELECT 
        a.id as application_id,
        a.opportunity_type,
        a.opportunity_id,
        a.status,
        a.applied_at,
        a.resume_url,
        a.cover_letter,
        u.name as student_name,
        u.email as student_email,
        u.avatar_url as student_avatar,
        s.id as student_id,
        s.college,
        s.branch,
        s.cgpa,
        s.graduation_year,
        CASE 
          WHEN a.opportunity_type = 'internship' THEN i.title
          ELSE j.title
        END as opportunity_title
      FROM applications a
      JOIN students s ON a.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN internships i ON a.opportunity_type = 'internship' AND a.opportunity_id = i.id
      LEFT JOIN jobs j ON a.opportunity_type = 'job' AND a.opportunity_id = j.id
      WHERE i.company_id = ? OR j.company_id = ?
      ORDER BY a.applied_at DESC
      LIMIT 5
    `, [companyId, companyId]);

    return res.json({
      success: true,
      data: {
        totalInternships: internshipCount[0].count,
        totalJobs: jobCount[0].count,
        applicantStats: appStats[0],
        recentApplicants
      }
    });
  } catch (error) {
    console.error('Company Dashboard Stats Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load company dashboard stats.', error: error.message });
  }
};

// 5. Get All Applicants for Company
const getApplicants = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);
    const { status, opportunityType, opportunityId, search } = req.query;

    let query = `
      SELECT 
        a.id as application_id,
        a.opportunity_type,
        a.opportunity_id,
        a.status,
        a.feedback,
        a.applied_at,
        a.resume_url,
        a.cover_letter,
        u.id as user_id,
        u.name as student_name,
        u.email as student_email,
        u.avatar_url as student_avatar,
        s.id as student_id,
        s.phone,
        s.college,
        s.degree,
        s.branch,
        s.cgpa,
        s.graduation_year,
        s.github_url,
        s.linkedin_url,
        CASE 
          WHEN a.opportunity_type = 'internship' THEN i.title
          ELSE j.title
        END as opportunity_title
      FROM applications a
      JOIN students s ON a.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN internships i ON a.opportunity_type = 'internship' AND a.opportunity_id = i.id
      LEFT JOIN jobs j ON a.opportunity_type = 'job' AND a.opportunity_id = j.id
      WHERE (i.company_id = ? OR j.company_id = ?)
    `;

    const params = [companyId, companyId];

    if (status && status !== 'all') {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (opportunityType && opportunityType !== 'all') {
      query += ' AND a.opportunity_type = ?';
      params.push(opportunityType);
    }

    if (opportunityId) {
      query += ' AND a.opportunity_id = ?';
      params.push(opportunityId);
    }

    if (search) {
      query += ' AND (u.name LIKE ? OR s.college LIKE ? OR s.branch LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY a.applied_at DESC';

    const [applicants] = await pool.query(query, params);

    // Attach student skills and skill match calculation to each applicant
    const enrichedApplicants = await Promise.all(
      applicants.map(async (app) => {
        const [studentSkills] = await pool.query(`
          SELECT s.name, ss.proficiency
          FROM student_skills ss
          JOIN skills s ON ss.skill_id = s.id
          WHERE ss.student_id = ?
        `, [app.student_id]);

        // Get required skills for the opportunity
        let reqSkills = [];
        if (app.opportunity_type === 'internship') {
          const [skills] = await pool.query(`
            SELECT s.name FROM internship_skills isk
            JOIN skills s ON isk.skill_id = s.id
            WHERE isk.internship_id = ?
          `, [app.opportunity_id]);
          reqSkills = skills.map(s => s.name);
        } else {
          const [skills] = await pool.query(`
            SELECT s.name FROM job_skills jsk
            JOIN skills s ON jsk.skill_id = s.id
            WHERE jsk.job_id = ?
          `, [app.opportunity_id]);
          reqSkills = skills.map(s => s.name);
        }

        const studentSkillNames = studentSkills.map(s => s.name);
        const match = calculateSkillMatch(studentSkillNames, reqSkills);

        return {
          ...app,
          skills: studentSkills,
          requiredSkills: reqSkills,
          skillMatch: match
        };
      })
    );

    return res.json({ success: true, data: enrichedApplicants });
  } catch (error) {
    console.error('Get Applicants Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch applicants.', error: error.message });
  }
};

// 6. Matched Students Discovery (Recommend candidate pool for company's postings)
const getMatchedStudents = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);
    const { opportunityType, opportunityId, minMatch = 0 } = req.query;

    // Get company's active internships & jobs
    const [internships] = await pool.query('SELECT id, title FROM internships WHERE company_id = ? AND status = "active"', [companyId]);
    const [jobs] = await pool.query('SELECT id, title FROM jobs WHERE company_id = ? AND status = "active"', [companyId]);

    // Fetch all active students with their skills
    const [students] = await pool.query(`
      SELECT s.id as student_id, s.college, s.degree, s.branch, s.cgpa, s.graduation_year, s.location, s.resume_url,
             u.id as user_id, u.name as student_name, u.email as student_email, u.avatar_url
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE u.status = 'active'
    `);

    // Fetch all skills for each student
    const [allStudentSkills] = await pool.query(`
      SELECT ss.student_id, s.name, ss.proficiency
      FROM student_skills ss
      JOIN skills s ON ss.skill_id = s.id
    `);

    const studentSkillMap = {};
    allStudentSkills.forEach(row => {
      if (!studentSkillMap[row.student_id]) studentSkillMap[row.student_id] = [];
      studentSkillMap[row.student_id].push(row.name);
    });

    // If a specific opportunity is selected, calculate against that; otherwise aggregate across all company requirements
    let targetSkills = [];
    if (opportunityType === 'internship' && opportunityId) {
      const [skills] = await pool.query(`
        SELECT s.name FROM internship_skills isk
        JOIN skills s ON isk.skill_id = s.id
        WHERE isk.internship_id = ?
      `, [opportunityId]);
      targetSkills = skills.map(s => s.name);
    } else if (opportunityType === 'job' && opportunityId) {
      const [skills] = await pool.query(`
        SELECT s.name FROM job_skills jsk
        JOIN skills s ON jsk.skill_id = s.id
        WHERE jsk.job_id = ?
      `, [opportunityId]);
      targetSkills = skills.map(s => s.name);
    } else {
      // Aggregate company's skills from all listings
      const [companySkills] = await pool.query(`
        SELECT DISTINCT s.name FROM skills s
        WHERE s.id IN (
          SELECT skill_id FROM internship_skills isk JOIN internships i ON isk.internship_id = i.id WHERE i.company_id = ?
          UNION
          SELECT skill_id FROM job_skills jsk JOIN jobs j ON jsk.job_id = j.id WHERE j.company_id = ?
        )
      `, [companyId, companyId]);
      targetSkills = companySkills.map(s => s.name);
    }

    const matchedStudents = students.map(st => {
      const sSkills = studentSkillMap[st.student_id] || [];
      const match = calculateSkillMatch(sSkills, targetSkills);
      return {
        ...st,
        skills: sSkills,
        skillMatch: match
      };
    })
    .filter(st => st.skillMatch.matchPercentage >= parseInt(minMatch, 10))
    .sort((a, b) => b.skillMatch.matchPercentage - a.skillMatch.matchPercentage);

    return res.json({
      success: true,
      data: {
        internships,
        jobs,
        targetSkills,
        candidates: matchedStudents
      }
    });
  } catch (error) {
    console.error('Get Matched Students Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch matched students.', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadLogo,
  getDashboardStats,
  getApplicants,
  getMatchedStudents
};
