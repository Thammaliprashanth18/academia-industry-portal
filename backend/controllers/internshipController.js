const pool = require('../config/db');
const { calculateSkillMatch } = require('../utils/skillMatcher');

// Helper to get company ID from user ID
const getCompanyId = async (userId) => {
  const [rows] = await pool.query('SELECT id FROM companies WHERE user_id = ?', [userId]);
  if (rows.length === 0) {
    const [result] = await pool.query('INSERT INTO companies (user_id, company_name) VALUES (?, ?)', [userId, 'Company']);
    return result.insertId;
  }
  return rows[0].id;
};

// 1. Get All Internships (Public / Student) with filters and search
const getAllInternships = async (req, res) => {
  try {
    const {
      search,
      location,
      work_mode,
      duration,
      skill,
      sort = 'newest'
    } = req.query;

    let query = `
      SELECT 
        i.*,
        c.company_name,
        c.logo_url as company_logo,
        c.website as company_website,
        c.location as company_location,
        GROUP_CONCAT(s.name SEPARATOR ',') as required_skills,
        (SELECT COUNT(*) FROM applications a WHERE a.opportunity_type = 'internship' AND a.opportunity_id = i.id) as applicant_count
      FROM internships i
      JOIN companies c ON i.company_id = c.id
      LEFT JOIN internship_skills isk ON i.id = isk.internship_id
      LEFT JOIN skills s ON isk.skill_id = s.id
      WHERE i.status = 'active'
    `;

    const params = [];

    if (search) {
      query += ` AND (i.title LIKE ? OR i.description LIKE ? OR c.company_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (location) {
      query += ` AND i.location LIKE ?`;
      params.push(`%${location}%`);
    }

    if (work_mode && work_mode !== 'all') {
      query += ` AND i.work_mode = ?`;
      params.push(work_mode);
    }

    if (duration && duration !== 'all') {
      query += ` AND i.duration LIKE ?`;
      params.push(`%${duration}%`);
    }

    query += ` GROUP BY i.id`;

    // Filter by skill via HAVING if requested
    if (skill && skill !== 'all') {
      query += ` HAVING FIND_IN_SET(?, required_skills) > 0 OR required_skills LIKE ?`;
      params.push(skill, `%${skill}%`);
    }

    // Sorting
    if (sort === 'deadline') {
      query += ` ORDER BY i.deadline ASC`;
    } else if (sort === 'openings') {
      query += ` ORDER BY i.openings DESC`;
    } else {
      query += ` ORDER BY i.created_at DESC`;
    }

    const [rows] = await pool.query(query, params);

    // If logged in as student, attach skill match % and application status
    let studentSkillNames = [];
    let appliedInternshipIds = new Set();

    if (req.user && req.user.role === 'student') {
      const [students] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
      if (students.length > 0) {
        const studentId = students[0].id;
        const [sSkills] = await pool.query(`
          SELECT s.name FROM student_skills ss
          JOIN skills s ON ss.skill_id = s.id
          WHERE ss.student_id = ?
        `, [studentId]);
        studentSkillNames = sSkills.map(s => s.name);

        const [apps] = await pool.query(`
          SELECT opportunity_id FROM applications
          WHERE student_id = ? AND opportunity_type = 'internship'
        `, [studentId]);
        apps.forEach(a => appliedInternshipIds.add(a.opportunity_id));
      }
    }

    const enriched = rows.map(item => {
      const reqSkills = item.required_skills ? item.required_skills.split(',') : [];
      const skillMatch = calculateSkillMatch(studentSkillNames, reqSkills);

      return {
        ...item,
        skillsList: reqSkills,
        hasApplied: appliedInternshipIds.has(item.id),
        skillMatch
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      data: enriched
    });
  } catch (error) {
    console.error('Get All Internships Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch internships.', error: error.message });
  }
};

// 2. Get Single Internship by ID
const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        i.*,
        c.company_name,
        c.logo_url as company_logo,
        c.website as company_website,
        c.location as company_location,
        c.description as company_description,
        c.industry_type as company_industry,
        (SELECT COUNT(*) FROM applications a WHERE a.opportunity_type = 'internship' AND a.opportunity_id = i.id) as applicant_count
      FROM internships i
      JOIN companies c ON i.company_id = c.id
      WHERE i.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    const internship = rows[0];

    // Fetch required skills
    const [skills] = await pool.query(`
      SELECT s.id, s.name, s.category, isk.is_required
      FROM internship_skills isk
      JOIN skills s ON isk.skill_id = s.id
      WHERE isk.internship_id = ?
    `, [id]);

    const reqSkillNames = skills.map(s => s.name);

    // Check application status and skill match if student
    let hasApplied = false;
    let applicationData = null;
    let skillMatch = calculateSkillMatch([], reqSkillNames);

    if (req.user && req.user.role === 'student') {
      const [students] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
      if (students.length > 0) {
        const studentId = students[0].id;

        const [sSkills] = await pool.query(`
          SELECT s.name FROM student_skills ss
          JOIN skills s ON ss.skill_id = s.id
          WHERE ss.student_id = ?
        `, [studentId]);
        const studentSkillNames = sSkills.map(s => s.name);
        skillMatch = calculateSkillMatch(studentSkillNames, reqSkillNames);

        const [apps] = await pool.query(`
          SELECT * FROM applications
          WHERE student_id = ? AND opportunity_type = 'internship' AND opportunity_id = ?
        `, [studentId, id]);

        if (apps.length > 0) {
          hasApplied = true;
          applicationData = apps[0];
        }
      }
    }

    return res.json({
      success: true,
      data: {
        ...internship,
        skills,
        skillsList: reqSkillNames,
        hasApplied,
        applicationData,
        skillMatch
      }
    });
  } catch (error) {
    console.error('Get Internship By ID Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch internship details.', error: error.message });
  }
};

// 3. Create Internship (Company)
const createInternship = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);
    const {
      title,
      description,
      responsibilities,
      requirements,
      location,
      work_mode = 'Remote',
      duration = '3 Months',
      stipend = 'Unpaid',
      eligibility,
      openings = 1,
      deadline,
      skills = []
    } = req.body;

    if (!title || !description || !location || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, location, and application deadline are required.'
      });
    }

    const [result] = await pool.query(`
      INSERT INTO internships (
        company_id, title, description, responsibilities, requirements, 
        location, work_mode, duration, stipend, eligibility, openings, deadline, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `, [
      companyId,
      title.trim(),
      description.trim(),
      responsibilities || null,
      requirements || null,
      location.trim(),
      work_mode,
      duration,
      stipend,
      eligibility || 'All eligible students',
      parseInt(openings, 10) || 1,
      deadline
    ]);

    const internshipId = result.insertId;

    // Attach skills
    if (Array.isArray(skills) && skills.length > 0) {
      for (const skillItem of skills) {
        let skillId = typeof skillItem === 'object' ? skillItem.id : skillItem;
        const skillName = typeof skillItem === 'object' ? skillItem.name : (typeof skillItem === 'string' ? skillItem : null);

        if (!skillId && skillName) {
          // Find or create
          const [found] = await pool.query('SELECT id FROM skills WHERE LOWER(name) = ?', [skillName.toLowerCase().trim()]);
          if (found.length > 0) {
            skillId = found[0].id;
          } else {
            const [ins] = await pool.query('INSERT INTO skills (name, category) VALUES (?, ?)', [skillName.trim(), 'Technical']);
            skillId = ins.insertId;
          }
        }

        if (skillId) {
          await pool.query(
            'INSERT IGNORE INTO internship_skills (internship_id, skill_id, is_required) VALUES (?, ?, TRUE)',
            [internshipId, skillId]
          );
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Internship posted successfully!',
      internshipId
    });
  } catch (error) {
    console.error('Create Internship Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create internship.', error: error.message });
  }
};

// 4. Update Internship (Company)
const updateInternship = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);
    const { id } = req.params;
    const {
      title,
      description,
      responsibilities,
      requirements,
      location,
      work_mode,
      duration,
      stipend,
      eligibility,
      openings,
      deadline,
      status,
      skills
    } = req.body;

    // Check ownership
    const [existing] = await pool.query('SELECT id FROM internships WHERE id = ? AND company_id = ?', [id, companyId]);
    if (existing.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this internship.' });
    }

    await pool.query(`
      UPDATE internships SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        responsibilities = COALESCE(?, responsibilities),
        requirements = COALESCE(?, requirements),
        location = COALESCE(?, location),
        work_mode = COALESCE(?, work_mode),
        duration = COALESCE(?, duration),
        stipend = COALESCE(?, stipend),
        eligibility = COALESCE(?, eligibility),
        openings = COALESCE(?, openings),
        deadline = COALESCE(?, deadline),
        status = COALESCE(?, status)
      WHERE id = ?
    `, [
      title, description, responsibilities, requirements, location,
      work_mode, duration, stipend, eligibility, openings, deadline, status, id
    ]);

    // Update skills if provided
    if (Array.isArray(skills)) {
      await pool.query('DELETE FROM internship_skills WHERE internship_id = ?', [id]);
      for (const skillItem of skills) {
        let skillId = typeof skillItem === 'object' ? skillItem.id : skillItem;
        const skillName = typeof skillItem === 'object' ? skillItem.name : (typeof skillItem === 'string' ? skillItem : null);

        if (!skillId && skillName) {
          const [found] = await pool.query('SELECT id FROM skills WHERE LOWER(name) = ?', [skillName.toLowerCase().trim()]);
          if (found.length > 0) {
            skillId = found[0].id;
          } else {
            const [ins] = await pool.query('INSERT INTO skills (name, category) VALUES (?, ?)', [skillName.trim(), 'Technical']);
            skillId = ins.insertId;
          }
        }

        if (skillId) {
          await pool.query(
            'INSERT IGNORE INTO internship_skills (internship_id, skill_id, is_required) VALUES (?, ?, TRUE)',
            [id, skillId]
          );
        }
      }
    }

    return res.json({ success: true, message: 'Internship updated successfully.' });
  } catch (error) {
    console.error('Update Internship Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update internship.', error: error.message });
  }
};

// 5. Delete Internship (Company or Admin)
const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === 'company') {
      const companyId = await getCompanyId(req.user.id);
      const [existing] = await pool.query('SELECT id FROM internships WHERE id = ? AND company_id = ?', [id, companyId]);
      if (existing.length === 0) {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this internship.' });
      }
    }

    await pool.query('DELETE FROM internships WHERE id = ?', [id]);

    return res.json({ success: true, message: 'Internship deleted successfully.' });
  } catch (error) {
    console.error('Delete Internship Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete internship.', error: error.message });
  }
};

// 6. Get Company's Own Internships
const getCompanyInternships = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);

    const [rows] = await pool.query(`
      SELECT 
        i.*,
        GROUP_CONCAT(s.name SEPARATOR ',') as required_skills,
        COUNT(a.id) as applicant_count,
        SUM(CASE WHEN a.status = 'Selected' THEN 1 ELSE 0 END) as selected_count,
        SUM(CASE WHEN a.status = 'Interview' THEN 1 ELSE 0 END) as interview_count
      FROM internships i
      LEFT JOIN internship_skills isk ON i.id = isk.internship_id
      LEFT JOIN skills s ON isk.skill_id = s.id
      LEFT JOIN applications a ON a.opportunity_type = 'internship' AND a.opportunity_id = i.id
      WHERE i.company_id = ?
      GROUP BY i.id
      ORDER BY i.created_at DESC
    `, [companyId]);

    const formatted = rows.map(item => ({
      ...item,
      skillsList: item.required_skills ? item.required_skills.split(',') : []
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Get Company Internships Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch company internships.', error: error.message });
  }
};

module.exports = {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  getCompanyInternships
};
