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

// 1. Get All Jobs / Placements
const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      work_mode,
      experience,
      skill,
      sort = 'newest'
    } = req.query;

    let query = `
      SELECT 
        j.*,
        c.company_name,
        c.logo_url as company_logo,
        c.website as company_website,
        c.location as company_location,
        GROUP_CONCAT(s.name SEPARATOR ',') as required_skills,
        (SELECT COUNT(*) FROM applications a WHERE a.opportunity_type = 'job' AND a.opportunity_id = j.id) as applicant_count
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      LEFT JOIN job_skills jsk ON j.id = jsk.job_id
      LEFT JOIN skills s ON jsk.skill_id = s.id
      WHERE j.status = 'active'
    `;

    const params = [];

    if (search) {
      query += ` AND (j.title LIKE ? OR j.description LIKE ? OR c.company_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (location) {
      query += ` AND j.location LIKE ?`;
      params.push(`%${location}%`);
    }

    if (work_mode && work_mode !== 'all') {
      query += ` AND j.work_mode = ?`;
      params.push(work_mode);
    }

    if (experience && experience !== 'all') {
      query += ` AND j.experience LIKE ?`;
      params.push(`%${experience}%`);
    }

    query += ` GROUP BY j.id`;

    if (skill && skill !== 'all') {
      query += ` HAVING FIND_IN_SET(?, required_skills) > 0 OR required_skills LIKE ?`;
      params.push(skill, `%${skill}%`);
    }

    // Sorting
    if (sort === 'deadline') {
      query += ` ORDER BY j.deadline ASC`;
    } else if (sort === 'openings') {
      query += ` ORDER BY j.openings DESC`;
    } else {
      query += ` ORDER BY j.created_at DESC`;
    }

    const [rows] = await pool.query(query, params);

    // Attach student skill matching and application status if student is logged in
    let studentSkillNames = [];
    let appliedJobIds = new Set();

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
          WHERE student_id = ? AND opportunity_type = 'job'
        `, [studentId]);
        apps.forEach(a => appliedJobIds.add(a.opportunity_id));
      }
    }

    const enriched = rows.map(item => {
      const reqSkills = item.required_skills ? item.required_skills.split(',') : [];
      const skillMatch = calculateSkillMatch(studentSkillNames, reqSkills);

      return {
        ...item,
        skillsList: reqSkills,
        hasApplied: appliedJobIds.has(item.id),
        skillMatch
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      data: enriched
    });
  } catch (error) {
    console.error('Get All Jobs Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch jobs.', error: error.message });
  }
};

// 2. Get Single Job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        j.*,
        c.company_name,
        c.logo_url as company_logo,
        c.website as company_website,
        c.location as company_location,
        c.description as company_description,
        c.industry_type as company_industry,
        (SELECT COUNT(*) FROM applications a WHERE a.opportunity_type = 'job' AND a.opportunity_id = j.id) as applicant_count
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    const job = rows[0];

    // Fetch skills
    const [skills] = await pool.query(`
      SELECT s.id, s.name, s.category, jsk.is_required
      FROM job_skills jsk
      JOIN skills s ON jsk.skill_id = s.id
      WHERE jsk.job_id = ?
    `, [id]);

    const reqSkillNames = skills.map(s => s.name);

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
          WHERE student_id = ? AND opportunity_type = 'job' AND opportunity_id = ?
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
        ...job,
        skills,
        skillsList: reqSkillNames,
        hasApplied,
        applicationData,
        skillMatch
      }
    });
  } catch (error) {
    console.error('Get Job By ID Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch job details.', error: error.message });
  }
};

// 3. Create Job (Company)
const createJob = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);
    const {
      title,
      description,
      requirements,
      salary_package,
      location,
      work_mode = 'On-site',
      eligibility,
      experience = 'Freshers (0-1 yrs)',
      openings = 1,
      deadline,
      skills = []
    } = req.body;

    if (!title || !description || !salary_package || !location || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, salary package, location, and application deadline are required.'
      });
    }

    const [result] = await pool.query(`
      INSERT INTO jobs (
        company_id, title, description, requirements, salary_package,
        location, work_mode, eligibility, experience, openings, deadline, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `, [
      companyId,
      title.trim(),
      description.trim(),
      requirements || null,
      salary_package.trim(),
      location.trim(),
      work_mode,
      eligibility || 'All engineering graduates',
      experience,
      parseInt(openings, 10) || 1,
      deadline
    ]);

    const jobId = result.insertId;

    // Attach skills
    if (Array.isArray(skills) && skills.length > 0) {
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
            'INSERT IGNORE INTO job_skills (job_id, skill_id, is_required) VALUES (?, ?, TRUE)',
            [jobId, skillId]
          );
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Placement / Job opportunity posted successfully!',
      jobId
    });
  } catch (error) {
    console.error('Create Job Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create job posting.', error: error.message });
  }
};

// 4. Update Job
const updateJob = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);
    const { id } = req.params;
    const {
      title,
      description,
      requirements,
      salary_package,
      location,
      work_mode,
      eligibility,
      experience,
      openings,
      deadline,
      status,
      skills
    } = req.body;

    const [existing] = await pool.query('SELECT id FROM jobs WHERE id = ? AND company_id = ?', [id, companyId]);
    if (existing.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this job.' });
    }

    await pool.query(`
      UPDATE jobs SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        requirements = COALESCE(?, requirements),
        salary_package = COALESCE(?, salary_package),
        location = COALESCE(?, location),
        work_mode = COALESCE(?, work_mode),
        eligibility = COALESCE(?, eligibility),
        experience = COALESCE(?, experience),
        openings = COALESCE(?, openings),
        deadline = COALESCE(?, deadline),
        status = COALESCE(?, status)
      WHERE id = ?
    `, [
      title, description, requirements, salary_package, location,
      work_mode, eligibility, experience, openings, deadline, status, id
    ]);

    if (Array.isArray(skills)) {
      await pool.query('DELETE FROM job_skills WHERE job_id = ?', [id]);
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
            'INSERT IGNORE INTO job_skills (job_id, skill_id, is_required) VALUES (?, ?, TRUE)',
            [id, skillId]
          );
        }
      }
    }

    return res.json({ success: true, message: 'Job posting updated successfully.' });
  } catch (error) {
    console.error('Update Job Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update job.', error: error.message });
  }
};

// 5. Delete Job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === 'company') {
      const companyId = await getCompanyId(req.user.id);
      const [existing] = await pool.query('SELECT id FROM jobs WHERE id = ? AND company_id = ?', [id, companyId]);
      if (existing.length === 0) {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this job.' });
      }
    }

    await pool.query('DELETE FROM jobs WHERE id = ?', [id]);

    return res.json({ success: true, message: 'Job posting deleted successfully.' });
  } catch (error) {
    console.error('Delete Job Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete job.', error: error.message });
  }
};

// 6. Get Company's Own Jobs
const getCompanyJobs = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);

    const [rows] = await pool.query(`
      SELECT 
        j.*,
        GROUP_CONCAT(s.name SEPARATOR ',') as required_skills,
        COUNT(a.id) as applicant_count,
        SUM(CASE WHEN a.status = 'Selected' THEN 1 ELSE 0 END) as selected_count,
        SUM(CASE WHEN a.status = 'Interview' THEN 1 ELSE 0 END) as interview_count
      FROM jobs j
      LEFT JOIN job_skills jsk ON j.id = jsk.job_id
      LEFT JOIN skills s ON jsk.skill_id = s.id
      LEFT JOIN applications a ON a.opportunity_type = 'job' AND a.opportunity_id = j.id
      WHERE j.company_id = ?
      GROUP BY j.id
      ORDER BY j.created_at DESC
    `, [companyId]);

    const formatted = rows.map(item => ({
      ...item,
      skillsList: item.required_skills ? item.required_skills.split(',') : []
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Get Company Jobs Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch company jobs.', error: error.message });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getCompanyJobs
};
