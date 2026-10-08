import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ==========================================
// 1. AUTH APIS
// ==========================================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (passwords) => api.put('/auth/update-password', passwords)
};

// ==========================================
// 2. STUDENT APIS
// ==========================================
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (profileData) => api.put('/students/profile', profileData),
  uploadResume: (formData) => api.post('/students/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadAvatar: (formData) => api.post('/students/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSkills: () => api.get('/students/skills'),
  addSkill: (skillData) => api.post('/students/skills', skillData),
  removeSkill: (skillId) => api.delete(`/students/skills/${skillId}`),
  getDashboard: () => api.get('/students/dashboard'),
  getSkillGap: () => api.get('/students/skill-gap'),
  addEducation: (edu) => api.post('/students/education', edu),
  deleteEducation: (id) => api.delete(`/students/education/${id}`),
  addProject: (proj) => api.post('/students/projects', proj),
  deleteProject: (id) => api.delete(`/students/projects/${id}`),
  addCertification: (cert) => api.post('/students/certifications', cert),
  deleteCertification: (id) => api.delete(`/students/certifications/${id}`)
};

// ==========================================
// 3. COMPANY APIS
// ==========================================
export const companyAPI = {
  getProfile: () => api.get('/companies/profile'),
  updateProfile: (profileData) => api.put('/companies/profile', profileData),
  uploadLogo: (formData) => api.post('/companies/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getDashboardStats: () => api.get('/companies/dashboard-stats'),
  getApplicants: (params) => api.get('/companies/applicants', { params }),
  getMatchedStudents: (params) => api.get('/companies/matched-students', { params })
};

// ==========================================
// 4. INTERNSHIP APIS
// ==========================================
export const internshipAPI = {
  getAll: (params) => api.get('/internships', { params }),
  getById: (id) => api.get(`/internships/${id}`),
  getCompanyInternships: () => api.get('/internships/company'),
  create: (data) => api.post('/internships', data),
  update: (id, data) => api.put(`/internships/${id}`, data),
  delete: (id) => api.delete(`/internships/${id}`)
};

// ==========================================
// 5. JOB APIS
// ==========================================
export const jobAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getCompanyJobs: () => api.get('/jobs/company'),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`)
};

// ==========================================
// 6. APPLICATION APIS
// ==========================================
export const applicationAPI = {
  apply: (data) => api.post('/applications/apply', data),
  getMyApplications: (params) => api.get('/applications/my-applications', { params }),
  updateStatus: (id, statusData) => api.put(`/applications/${id}/status`, statusData),
  withdraw: (id) => api.delete(`/applications/${id}`)
};

// ==========================================
// 7. ADMIN APIS
// ==========================================
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getCompanies: () => api.get('/admin/companies'),
  verifyCompany: (id, verification_status) => api.put(`/admin/companies/${id}/verify`, { verification_status }),
  getSkills: () => api.get('/admin/skills'),
  addSkill: (skill) => api.post('/admin/skills', skill),
  deleteSkill: (id) => api.delete(`/admin/skills/${id}`)
};

// ==========================================
// 8. SKILL APIS
// ==========================================
export const skillAPI = {
  getAll: (params) => api.get('/skills', { params })
};

// ==========================================
// 9. NOTIFICATION APIS
// ==========================================
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read')
};

export default api;