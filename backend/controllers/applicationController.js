const pool = require('../config/db');

// Helper to get student ID from user ID
const getStudentId = async (userId) => {
  const [rows] = await pool.query('SELECT id FROM students WHERE user_id = ?', [userId]);
  if (rows.length === 0) {
    const [res] = await pool.query('INSERT INTO students (user_id) VALUES (?)', [userId]);
    return res.insertId;
  }
  return rows[0].id;
};

// 1. Submit Application (Student)
const applyToOpportunity = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);
    const { opportunityType, opportunityId, coverLetter, resumeUrl } = req.body;

    if (!opportunityType || !opportunityId) {
      return res.status(400).json({
        success: false,
        message: 'Opportunity type and opportunity ID are required.'
      });
    }

    if (!['internship', 'job'].includes(opportunityType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid opportunity type. Must be internship or job.'
      });
    }

    // Check if already applied
    const [existing] = await pool.query(`
      SELECT id FROM applications 
      WHERE student_id = ? AND opportunity_type = ? AND opportunity_id = ?
    `, [studentId, opportunityType, opportunityId]);

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this opportunity.'
      });
    }

    // Get student's current resume if not explicitly passed
    let finalResumeUrl = resumeUrl;
    if (!finalResumeUrl) {
      const [st] = await pool.query('SELECT resume_url FROM students WHERE id = ?', [studentId]);
      finalResumeUrl = st[0]?.resume_url || null;
    }

    // Insert Application
    const [result] = await pool.query(`
      INSERT INTO applications (student_id, opportunity_type, opportunity_id, resume_url, cover_letter, status)
      VALUES (?, ?, ?, ?, ?, 'Applied')
    `, [studentId, opportunityType, opportunityId, finalResumeUrl, coverLetter || null]);

    // Send notification to Company
    let companyUserId = null;
    let title = '';
    if (opportunityType === 'internship') {
      const [rows] = await pool.query(`
        SELECT c.user_id, i.title FROM internships i JOIN companies c ON i.company_id = c.id WHERE i.id = ?
      `, [opportunityId]);
      if (rows.length > 0) {
        companyUserId = rows[0].user_id;
        title = rows[0].title;
      }
    } else {
      const [rows] = await pool.query(`
        SELECT c.user_id, j.title FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.id = ?
      `, [opportunityId]);
      if (rows.length > 0) {
        companyUserId = rows[0].user_id;
        title = rows[0].title;
      }
    }

    if (companyUserId) {
      await pool.query(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, ?, ?, 'application', '/company/applications')
      `, [
        companyUserId,
        `New Application: ${title}`,
        `${req.user.name} submitted an application for ${title}.`
      ]);
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: result.insertId
    });
  } catch (error) {
    console.error('Apply Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit application.', error: error.message });
  }
};

// 2. Get Student's Applications
const getMyApplications = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);
    const { status, type } = req.query;

    let query = `
      SELECT 
        a.id,
        a.opportunity_type,
        a.opportunity_id,
        a.status,
        a.feedback,
        a.applied_at,
        a.updated_at,
        a.resume_url,
        a.cover_letter,
        CASE 
          WHEN a.opportunity_type = 'internship' THEN i.title
          ELSE j.title
        END as title,
        CASE 
          WHEN a.opportunity_type = 'internship' THEN i.location
          ELSE j.location
        END as location,
        CASE 
          WHEN a.opportunity_type = 'internship' THEN i.work_mode
          ELSE j.work_mode
        END as work_mode,
        CASE 
          WHEN a.opportunity_type = 'internship' THEN i.stipend
          ELSE j.salary_package
        END as compensation,
        CASE 
          WHEN a.opportunity_type = 'internship' THEN i.deadline
          ELSE j.deadline
        END as deadline,
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
    `;

    const params = [studentId];

    if (status && status !== 'all') {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (type && type !== 'all') {
      query += ' AND a.opportunity_type = ?';
      params.push(type);
    }

    query += ' ORDER BY a.applied_at DESC';

    const [rows] = await pool.query(query, params);

    return res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Get My Applications Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch applications.', error: error.message });
  }
};

// 3. Update Application Status (Company / Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Fetch application with student and opportunity details
    const [apps] = await pool.query(`
      SELECT a.*, s.user_id as student_user_id,
        CASE WHEN a.opportunity_type = 'internship' THEN i.title ELSE j.title END as title,
        CASE WHEN a.opportunity_type = 'internship' THEN c1.company_name ELSE c2.company_name END as company_name
      FROM applications a
      JOIN students s ON a.student_id = s.id
      LEFT JOIN internships i ON a.opportunity_type = 'internship' AND a.opportunity_id = i.id
      LEFT JOIN companies c1 ON i.company_id = c1.id
      LEFT JOIN jobs j ON a.opportunity_type = 'job' AND a.opportunity_id = j.id
      LEFT JOIN companies c2 ON j.company_id = c2.id
      WHERE a.id = ?
    `, [id]);

    if (apps.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const app = apps[0];

    await pool.query(`
      UPDATE applications 
      SET status = ?, feedback = COALESCE(?, feedback), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, feedback || null, id]);

    // Send Notification to student
    if (app.student_user_id) {
      let notifTitle = `Application Status Updated: ${status}`;
      let notifMessage = `Your application for "${app.title}" at ${app.company_name} is now marked as "${status}".`;
      if (feedback) {
        notifMessage += ` Recruiter notes: "${feedback}"`;
      }

      await pool.query(`
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, ?, ?, 'status_update', '/student/applications')
      `, [app.student_user_id, notifTitle, notifMessage]);
    }

    return res.json({
      success: true,
      message: `Application status updated to ${status}.`
    });
  } catch (error) {
    console.error('Update Application Status Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update application status.', error: error.message });
  }
};

// 4. Withdraw Application (Student)
const withdrawApplication = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM applications WHERE id = ? AND student_id = ?', [id, studentId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized.' });
    }

    await pool.query('DELETE FROM applications WHERE id = ?', [id]);

    return res.json({ success: true, message: 'Application withdrawn successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to withdraw application.', error: error.message });
  }
};

module.exports = {
  applyToOpportunity,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication
};
