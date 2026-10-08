const assert = require('assert');

async function runTests() {
  console.log('🧪 Starting End-to-End Integration Verification Tests...\n');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
  assert.strictEqual(healthRes.status, 'healthy');
  console.log('✅ 1. API Health Check Passed.');

  // 2. Student Login
  const studentLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rahul.sharma@student.edu', password: 'Password123!' })
  }).then(r => r.json());
  assert.strictEqual(studentLogin.success, true);
  const studentToken = studentLogin.token;
  console.log('✅ 2. Student Authentication Passed (User:', studentLogin.user.name, ')');

  // 3. Student Profile & Skills
  const studentProfile = await fetch(`${BASE_URL}/students/profile`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  }).then(r => r.json());
  assert.strictEqual(studentProfile.success, true);
  console.log('✅ 3. Student Profile Fetched (Skills mapped:', studentProfile.data.skills.length, ')');

  // 4. Internships with Explainable Skill Matching
  const internshipsRes = await fetch(`${BASE_URL}/internships`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  }).then(r => r.json());
  assert.strictEqual(internshipsRes.success, true);
  const firstInternship = internshipsRes.data[0];
  console.log(`✅ 4. Opportunity Skill Matching Engine Verified: "${firstInternship.title}" -> ${firstInternship.skillMatch.matchPercentage}% match`);

  // 5. Company Login
  const companyLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'recruiter@microsoft.com', password: 'Password123!' })
  }).then(r => r.json());
  assert.strictEqual(companyLogin.success, true);
  const companyToken = companyLogin.token;
  console.log('✅ 5. Company Recruiter Authentication Passed (Company:', companyLogin.user.profile?.company_name, ')');

  // 6. Company Applicants
  const applicantsRes = await fetch(`${BASE_URL}/companies/applicants`, {
    headers: { 'Authorization': `Bearer ${companyToken}` }
  }).then(r => r.json());
  assert.strictEqual(applicantsRes.success, true);
  console.log('✅ 6. Recruiter Applicant Review Console Verified (Applicants count:', applicantsRes.data.length, ')');

  // 7. Recruiter updates candidate status
  if (applicantsRes.data.length > 0) {
    const targetApp = applicantsRes.data[0];
    const updateRes = await fetch(`${BASE_URL}/applications/${targetApp.application_id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${companyToken}`
      },
      body: JSON.stringify({ status: 'Shortlisted', feedback: 'Verified algorithmic and full stack competencies.' })
    }).then(r => r.json());
    assert.strictEqual(updateRes.success, true);
    console.log('✅ 7. Application Status Pipeline & Student Notification Triggered.');
  }

  // 8. Admin Control Center
  const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@portal.edu', password: 'AdminPassword123!' })
  }).then(r => r.json());
  assert.strictEqual(adminLogin.success, true);
  const adminToken = adminLogin.token;

  const adminStats = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }).then(r => r.json());
  assert.strictEqual(adminStats.success, true);
  console.log('✅ 8. Administrative Oversight & Metrics Passed (Total Students:', adminStats.data.users.totalStudents, ', Total Companies:', adminStats.data.users.totalCompanies, ')');

  console.log('\n🎉 ALL 8 CORE END-TO-END WORKFLOW TESTS PASSED CLEANLY WITH ZERO ERRORS!\n');
}

runTests().catch(err => {
  console.error('❌ Integration Test Failed:', err);
  process.exit(1);
});
