const pool = require('../config/db');
const { calculateSkillMatch } = require('../utils/skillMatcher');

// Helper to get student ID from user ID
const getStudentId = async (userId) => {
  const [rows] = await pool.query('SELECT id FROM students WHERE user_id = ?', [userId]);
  if (rows.length === 0) {
    const [result] = await pool.query('INSERT INTO students (user_id) VALUES (?)', [userId]);
    return result.insertId;
  }
  return rows[0].id;
};

// 1. Get Complete Student Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [studentRows] = await pool.query(`
      SELECT s.*, u.name, u.email, u.avatar_url, u.status as account_status, u.created_at as joined_at
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.user_id = ?
    `, [userId]);

    if (studentRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const student = studentRows[0];

    // Fetch skills
    const [skills] = await pool.query(`
      SELECT s.id, s.name, s.category, ss.proficiency, ss.created_at as added_at
      FROM student_skills ss
      JOIN skills s ON ss.skill_id = s.id
      WHERE ss.student_id = ?
      ORDER BY s.name ASC
    `, [student.id]);

    // Fetch education
    const [education] = await pool.query(`
      SELECT * FROM education WHERE student_id = ? ORDER BY start_year DESC
    `, [student.id]);

    // Fetch projects
    const [projects] = await pool.query(`
      SELECT * FROM projects WHERE student_id = ? ORDER BY id DESC
    `, [student.id]);

    // Fetch certifications
    const [certifications] = await pool.query(`
      SELECT * FROM certifications WHERE student_id = ? ORDER BY id DESC
    `, [student.id]);

    // Calculate profile completion percentage
    let completedFields = 0;
    const totalFields = 9;
    if (student.name) completedFields++;
    if (student.phone) completedFields++;
    if (student.college) completedFields++;
    if (student.degree) completedFields++;
    if (student.branch) completedFields++;
    if (student.cgpa) completedFields++;
    if (student.bio) completedFields++;
    if (student.resume_url) completedFields++;
    if (skills.length > 0) completedFields++;

    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    return res.json({
      success: true,
      data: {
        ...student,
        skills,
        education,
        projects,
        certifications,
        completionPercentage
      }
    });
  } catch (error) {
    console.error('Get Student Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch student profile.', error: error.message });
  }
};

// 2. Update Student Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = await getStudentId(userId);
    const {
      name,
      phone,
      college,
      degree,
      branch,
      graduation_year,
      cgpa,
      location,
      bio,
      github_url,
      linkedin_url
    } = req.body;

    // Update name in users table
    if (name) {
      await pool.query('UPDATE users SET name = ? WHERE id = ?', [name.trim(), userId]);
    }

    // Update students table
    await pool.query(`
      UPDATE students SET
        phone = ?,
        college = ?,
        degree = ?,
        branch = ?,
        graduation_year = ?,
        cgpa = ?,
        location = ?,
        bio = ?,
        github_url = ?,
        linkedin_url = ?
      WHERE id = ?
    `, [
      phone || null,
      college || null,
      degree || null,
      branch || null,
      graduation_year ? parseInt(graduation_year, 10) : null,
      cgpa ? parseFloat(cgpa) : null,
      location || null,
      bio || null,
      github_url || null,
      linkedin_url || null,
      studentId
    ]);

    return res.json({
      success: true,
      message: 'Profile updated successfully!'
    });
  } catch (error) {
    console.error('Update Student Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  }
};

// 3. Upload Resume
const uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = await getStudentId(userId);

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume file uploaded.' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    await pool.query('UPDATE students SET resume_url = ? WHERE id = ?', [resumeUrl, studentId]);

    return res.json({
      success: true,
      message: 'Resume uploaded successfully!',
      resumeUrl
    });
  } catch (error) {
    console.error('Upload Resume Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload resume.', error: error.message });
  }
};

// 4. Upload Avatar
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const avatarUrl = `/uploads/images/${req.file.filename}`;

    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, userId]);

    return res.json({
      success: true,
      message: 'Profile picture updated successfully!',
      avatarUrl
    });
  } catch (error) {
    console.error('Upload Avatar Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload avatar.', error: error.message });
  }
};

// 5. Skills Management
const getSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = await getStudentId(userId);

    const [skills] = await pool.query(`
      SELECT s.id, s.name, s.category, ss.proficiency, ss.created_at as added_at
      FROM student_skills ss
      JOIN skills s ON ss.skill_id = s.id
      WHERE ss.student_id = ?
      ORDER BY s.name ASC
    `, [studentId]);

    return res.json({ success: true, data: skills });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch skills.', error: error.message });
  }
};

const addSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = await getStudentId(userId);
    const { skill_id, skill_name, proficiency = 'Intermediate' } = req.body;

    let targetSkillId = skill_id;

    // If skill_name is given and no ID, look up or create in skills catalog
    if (!targetSkillId && skill_name) {
      const [existing] = await pool.query('SELECT id FROM skills WHERE LOWER(name) = ?', [skill_name.trim().toLowerCase()]);
      if (existing.length > 0) {
        targetSkillId = existing[0].id;
      } else {
        const [inserted] = await pool.query('INSERT INTO skills (name, category) VALUES (?, ?)', [skill_name.trim(), 'Technical']);
        targetSkillId = inserted.insertId;
      }
    }

    if (!targetSkillId) {
      return res.status(400).json({ success: false, message: 'Skill identifier is required.' });
    }

    // Upsert into student_skills
    await pool.query(`
      INSERT INTO student_skills (student_id, skill_id, proficiency)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE proficiency = VALUES(proficiency)
    `, [studentId, targetSkillId, proficiency]);

    return res.json({
      success: true,
      message: 'Skill added to profile successfully.'
    });
  } catch (error) {
    console.error('Add Skill Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add skill.', error: error.message });
  }
};

const removeSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = await getStudentId(userId);
    const { skillId } = req.params;

    await pool.query('DELETE FROM student_skills WHERE student_id = ? AND skill_id = ?', [studentId, skillId]);

    return res.json({ success: true, message: 'Skill removed from profile.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to remove skill.', error: error.message });
  }
};

// 6. Education Management
const addEducation = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);
    const { institution, degree, field_of_study, start_year, end_year, score_or_grade } = req.body;

    if (!institution || !degree || !start_year) {
      return res.status(400).json({ success: false, message: 'Institution, degree, and start year are required.' });
    }

    const [result] = await pool.query(`
      INSERT INTO education (student_id, institution, degree, field_of_study, start_year, end_year, score_or_grade)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [studentId, institution, degree, field_of_study || null, start_year, end_year || null, score_or_grade || null]);

    return res.status(201).json({ success: true, message: 'Education added.', id: result.insertId });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add education.', error: error.message });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);
    const { id } = req.params;
    await pool.query('DELETE FROM education WHERE id = ? AND student_id = ?', [id, studentId]);
    return res.json({ success: true, message: 'Education deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete education.', error: error.message });
  }
};

// 7. Projects Management
const addProject = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);
    const { title, description, technologies, project_url, github_repo } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Project title is required.' });
    }

    const [result] = await pool.query(`
      INSERT INTO projects (student_id, title, description, technologies, project_url, github_repo)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [studentId, title, description || null, technologies || null, project_url || null, github_repo || null]);

    return res.status(201).json({ success: true, message: 'Project added.', id: result.insertId });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add project.', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);
    const { id } = req.params;
    await pool.query('DELETE FROM projects WHERE id = ? AND student_id = ?', [id, studentId]);
    return res.json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete project.', error: error.message });
  }
};

// 8. Certifications Management
const addCertification = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);
    const { title, issuing_organization, issue_date, expiration_date, credential_id, credential_url } = req.body;

    if (!title || !issuing_organization) {
      return res.status(400).json({ success: false, message: 'Title and issuing organization are required.' });
    }

    const [result] = await pool.query(`
      INSERT INTO certifications (student_id, title, issuing_organization, issue_date, expiration_date, credential_id, credential_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [studentId, title, issuing_organization, issue_date || null, expiration_date || null, credential_id || null, credential_url || null]);

    return res.status(201).json({ success: true, message: 'Certification added.', id: result.insertId });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add certification.', error: error.message });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);
    const { id } = req.params;
    await pool.query('DELETE FROM certifications WHERE id = ? AND student_id = ?', [id, studentId]);
    return res.json({ success: true, message: 'Certification deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete certification.', error: error.message });
  }
};

// 9. Student Dashboard Overview
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = await getStudentId(userId);

    // 1. Get Application Stats
    const [appStats] = await pool.query(`
      SELECT 
        COUNT(*) as totalApplications,
        SUM(CASE WHEN status = 'Applied' THEN 1 ELSE 0 END) as pendingCount,
        SUM(CASE WHEN status = 'Under Review' THEN 1 ELSE 0 END) as underReviewCount,
        SUM(CASE WHEN status = 'Shortlisted' THEN 1 ELSE 0 END) as shortlistedCount,
        SUM(CASE WHEN status = 'Interview' THEN 1 ELSE 0 END) as interviewCount,
        SUM(CASE WHEN status = 'Selected' THEN 1 ELSE 0 END) as selectedCount,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejectedCount
      FROM applications
      WHERE student_id = ?
    `, [studentId]);

    // 2. Fetch Recent Applications
    const [recentApplications] = await pool.query(`
      SELECT 
        a.id, a.opportunity_type, a.opportunity_id, a.status, a.applied_at, a.updated_at, a.feedback,
        CASE 
          WHEN a.opportunity_type = 'internship' THEN i.title
          ELSE j.title
        END as title,
        CASE 
          WHEN a.opportunity_type = 'internship' THEN c1.company_name
          ELSE c2.company_name
        END as company_name,
        CASE 
          WHEN a.opportunity_type = 'internship' THEN c1.logo_url
          ELSE c2.logo_url
        END as company_logo
      FROM applications a
      LEFT JOIN internships i ON a.opportunity_type = 'internship' AND a.opportunity_id = i.id
      LEFT JOIN companies c1 ON i.company_id = c1.id
      LEFT JOIN jobs j ON a.opportunity_type = 'job' AND a.opportunity_id = j.id
      LEFT JOIN companies c2 ON j.company_id = c2.id
      WHERE a.student_id = ?
      ORDER BY a.applied_at DESC
      LIMIT 5
    `, [studentId]);

    // 3. Get Student Skills
    const [studentSkills] = await pool.query(`
      SELECT s.name 
      FROM student_skills ss
      JOIN skills s ON ss.skill_id = s.id
      WHERE ss.student_id = ?
    `, [studentId]);
    const studentSkillNames = studentSkills.map(s => s.name);

    // 4. Fetch Active Internships for Recommendation with Skill Match
    const [internships] = await pool.query(`
      SELECT i.*, c.company_name, c.logo_url as company_logo,
             GROUP_CONCAT(s.name SEPARATOR ',') as required_skills
      FROM internships i
      JOIN companies c ON i.company_id = c.id
      LEFT JOIN internship_skills isk ON i.id = isk.internship_id
      LEFT JOIN skills s ON isk.skill_id = s.id
      WHERE i.status = 'active'
      GROUP BY i.id
    `);

    const recommendedInternships = internships.map(item => {
      const reqSkills = item.required_skills ? item.required_skills.split(',') : [];
      const match = calculateSkillMatch(studentSkillNames, reqSkills);
      return {
        ...item,
        skillsList: reqSkills,
        skillMatch: match
      };
    })
    .sort((a, b) => b.skillMatch.matchPercentage - a.skillMatch.matchPercentage)
    .slice(0, 4);

    // 5. Fetch Active Jobs for Recommendation
    const [jobs] = await pool.query(`
      SELECT j.*, c.company_name, c.logo_url as company_logo,
             GROUP_CONCAT(s.name SEPARATOR ',') as required_skills
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      LEFT JOIN job_skills jsk ON j.id = jsk.job_id
      LEFT JOIN skills s ON jsk.skill_id = s.id
      WHERE j.status = 'active'
      GROUP BY j.id
    `);

    const recommendedJobs = jobs.map(item => {
      const reqSkills = item.required_skills ? item.required_skills.split(',') : [];
      const match = calculateSkillMatch(studentSkillNames, reqSkills);
      return {
        ...item,
        skillsList: reqSkills,
        skillMatch: match
      };
    })
    .sort((a, b) => b.skillMatch.matchPercentage - a.skillMatch.matchPercentage)
    .slice(0, 4);

    return res.json({
      success: true,
      data: {
        stats: appStats[0],
        recentApplications,
        recommendedInternships,
        recommendedJobs,
        totalSkillsAdded: studentSkillNames.length
      }
    });
  } catch (error) {
    console.error('Student Dashboard Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load dashboard.', error: error.message });
  }
};

// 10. Skill Gap Analysis
const getSkillGap = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);

    // Get student's current skills
    const [studentSkills] = await pool.query(`
      SELECT s.id, s.name, s.category, ss.proficiency
      FROM student_skills ss
      JOIN skills s ON ss.skill_id = s.id
      WHERE ss.student_id = ?
    `, [studentId]);

    const studentSkillNames = new Set(studentSkills.map(s => s.name.toLowerCase()));

    // Get all skills demanded in active internships & jobs
    const [demandedSkills] = await pool.query(`
      SELECT s.id, s.name, s.category, COUNT(*) as demand_count
      FROM (
        SELECT skill_id FROM internship_skills
        UNION ALL
        SELECT skill_id FROM job_skills
      ) combined
      JOIN skills s ON combined.skill_id = s.id
      GROUP BY s.id
      ORDER BY demand_count DESC
    `);

    const analysis = demandedSkills.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      demandCount: s.demand_count,
      hasSkill: studentSkillNames.has(s.name.toLowerCase()),
      proficiency: studentSkills.find(sk => sk.name.toLowerCase() === s.name.toLowerCase())?.proficiency || null
    }));

    const topMissingInDemand = analysis.filter(a => !a.hasSkill).slice(0, 8);
    const masteredSkills = analysis.filter(a => a.hasSkill);

    return res.json({
      success: true,
      data: {
        totalIndustrySkillsAnalyzed: demandedSkills.length,
        studentSkillsCount: studentSkills.length,
        topMissingInDemand,
        masteredSkills,
        allSkillsAnalysis: analysis
      }
    });
  } catch (error) {
    console.error('Skill Gap Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to analyze skill gap.', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  uploadAvatar,
  getSkills,
  addSkill,
  removeSkill,
  addEducation,
  deleteEducation,
  addProject,
  deleteProject,
  addCertification,
  deleteCertification,
  getDashboard,
  getSkillGap
};
