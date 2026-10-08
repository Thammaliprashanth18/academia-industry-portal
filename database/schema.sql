-- Academia-Industry Collaboration Portal Database Schema
-- MySQL 8.0+ compatible

CREATE DATABASE IF NOT EXISTS academia_industry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE academia_industry;

-- Disable foreign key checks for clean teardown/setup
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS certifications;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS job_skills;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS internship_skills;
DROP TABLE IF EXISTS internships;
DROP TABLE IF EXISTS student_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table (Base authentication table for Student, Company, Admin)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'company', 'admin') NOT NULL DEFAULT 'student',
    status ENUM('active', 'pending', 'suspended') NOT NULL DEFAULT 'active',
    avatar_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Students Profile Table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    phone VARCHAR(20) DEFAULT NULL,
    college VARCHAR(255) DEFAULT NULL,
    degree VARCHAR(100) DEFAULT NULL,
    branch VARCHAR(100) DEFAULT NULL,
    graduation_year INT DEFAULT NULL,
    cgpa DECIMAL(3, 2) DEFAULT NULL,
    location VARCHAR(150) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    github_url VARCHAR(255) DEFAULT NULL,
    linkedin_url VARCHAR(255) DEFAULT NULL,
    resume_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_college (college),
    INDEX idx_student_branch (branch)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Companies Profile Table
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    industry_type VARCHAR(100) DEFAULT NULL,
    company_size VARCHAR(50) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    location VARCHAR(150) DEFAULT NULL,
    contact_email VARCHAR(255) DEFAULT NULL,
    contact_phone VARCHAR(20) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    logo_url VARCHAR(500) DEFAULT NULL,
    verification_status ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'verified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_company_name (company_name),
    INDEX idx_company_status (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Skills Catalog Table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL DEFAULT 'Technical',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_skill_name (name),
    INDEX idx_skill_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Student Skills Mapping
CREATE TABLE student_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL DEFAULT 'Intermediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_skill (student_id, skill_id),
    INDEX idx_ss_student (student_id),
    INDEX idx_ss_skill (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Internships Table
CREATE TABLE internships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT DEFAULT NULL,
    requirements TEXT DEFAULT NULL,
    location VARCHAR(150) NOT NULL,
    work_mode ENUM('Remote', 'On-site', 'Hybrid') NOT NULL DEFAULT 'Remote',
    duration VARCHAR(50) NOT NULL DEFAULT '3 Months',
    stipend VARCHAR(100) NOT NULL DEFAULT 'Unpaid',
    eligibility VARCHAR(255) DEFAULT 'Any eligible student',
    openings INT NOT NULL DEFAULT 1,
    deadline DATE NOT NULL,
    status ENUM('active', 'closed', 'draft') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_internship_company (company_id),
    INDEX idx_internship_status (status),
    INDEX idx_internship_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Internship Skills
CREATE TABLE internship_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    internship_id INT NOT NULL,
    skill_id INT NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_internship_skill (internship_id, skill_id),
    INDEX idx_is_internship (internship_id),
    INDEX idx_is_skill (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Jobs / Placement Opportunities Table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT DEFAULT NULL,
    salary_package VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    work_mode ENUM('Remote', 'On-site', 'Hybrid') NOT NULL DEFAULT 'On-site',
    eligibility VARCHAR(255) DEFAULT 'B.Tech/B.E/MCA/M.Tech',
    experience VARCHAR(50) DEFAULT 'Freshers (0-1 yrs)',
    openings INT NOT NULL DEFAULT 1,
    deadline DATE NOT NULL,
    status ENUM('active', 'closed', 'draft') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_job_company (company_id),
    INDEX idx_job_status (status),
    INDEX idx_job_deadline (deadline)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Job Skills
CREATE TABLE job_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    skill_id INT NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_job_skill (job_id, skill_id),
    INDEX idx_js_job (job_id),
    INDEX idx_js_skill (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Applications Table (Supports both Internship and Job applications)
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    opportunity_type ENUM('internship', 'job') NOT NULL,
    opportunity_id INT NOT NULL,
    resume_url VARCHAR(500) DEFAULT NULL,
    cover_letter TEXT DEFAULT NULL,
    status ENUM('Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected') NOT NULL DEFAULT 'Applied',
    feedback TEXT DEFAULT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_opportunity (student_id, opportunity_type, opportunity_id),
    INDEX idx_app_student (student_id),
    INDEX idx_app_type_id (opportunity_type, opportunity_id),
    INDEX idx_app_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Student Education Details
CREATE TABLE education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(100) DEFAULT NULL,
    start_year INT NOT NULL,
    end_year INT DEFAULT NULL,
    score_or_grade VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_edu_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Student Certifications
CREATE TABLE certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date VARCHAR(50) DEFAULT NULL,
    expiration_date VARCHAR(50) DEFAULT NULL,
    credential_id VARCHAR(100) DEFAULT NULL,
    credential_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_cert_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Student Projects
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    technologies VARCHAR(255) DEFAULT NULL,
    project_url VARCHAR(500) DEFAULT NULL,
    github_repo VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_proj_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('application', 'status_update', 'system', 'recommendation') NOT NULL DEFAULT 'system',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id),
    INDEX idx_notif_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
