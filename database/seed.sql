-- Academia-Industry Collaboration Portal Seed Data
USE academia_industry;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Insert Skills
INSERT INTO skills (id, name, category) VALUES
(1, 'Python', 'Programming'),
(2, 'Java', 'Programming'),
(3, 'C++', 'Programming'),
(4, 'JavaScript', 'Web Development'),
(5, 'TypeScript', 'Web Development'),
(6, 'React.js', 'Web Development'),
(7, 'Node.js', 'Web Development'),
(8, 'Express.js', 'Web Development'),
(9, 'Tailwind CSS', 'Web Development'),
(10, 'HTML/CSS', 'Web Development'),
(11, 'SQL', 'Database'),
(12, 'MySQL', 'Database'),
(13, 'MongoDB', 'Database'),
(14, 'PostgreSQL', 'Database'),
(15, 'Machine Learning', 'Data Science & AI'),
(16, 'Deep Learning', 'Data Science & AI'),
(17, 'Data Analytics', 'Data Science & AI'),
(18, 'Power BI', 'Data Science & AI'),
(19, 'PyTorch', 'Data Science & AI'),
(20, 'NLP', 'Data Science & AI'),
(21, 'Docker', 'Cloud & DevOps'),
(22, 'Kubernetes', 'Cloud & DevOps'),
(23, 'AWS', 'Cloud & DevOps'),
(24, 'Git & GitHub', 'Tools & DevOps'),
(25, 'REST APIs', 'Web Development'),
(26, 'System Design', 'Core Engineering'),
(27, 'Figma', 'Design & UI/UX')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Users (Password: Password123!, Admin: AdminPassword123!)
INSERT INTO users (id, name, email, password, role, status, avatar_url) VALUES
(1, 'System Administrator', 'admin@portal.edu', '$2b$10$iEp2kNjzusPtv1B6/W2H/.tEt/6zBUePn0uAq6MWkd0aN2MAC5KPG', 'admin', 'active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(2, 'Microsoft Careers', 'recruiter@microsoft.com', '$2b$10$ctyecrA6sAtwVsyk3EH0SeUlMiMaNCy56Y3zkDmLVmdvmf/Gszxiq', 'company', 'active', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'),
(3, 'Google University Programs', 'talent@google.com', '$2b$10$ctyecrA6sAtwVsyk3EH0SeUlMiMaNCy56Y3zkDmLVmdvmf/Gszxiq', 'company', 'active', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150'),
(4, 'Amazon AWS Campus', 'careers@amazon.com', '$2b$10$ctyecrA6sAtwVsyk3EH0SeUlMiMaNCy56Y3zkDmLVmdvmf/Gszxiq', 'company', 'active', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150'),
(5, 'Infosys Innovation Lab', 'campus@infosys.com', '$2b$10$ctyecrA6sAtwVsyk3EH0SeUlMiMaNCy56Y3zkDmLVmdvmf/Gszxiq', 'company', 'active', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150'),
(6, 'Rahul Sharma', 'rahul.sharma@student.edu', '$2b$10$ctyecrA6sAtwVsyk3EH0SeUlMiMaNCy56Y3zkDmLVmdvmf/Gszxiq', 'student', 'active', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'),
(7, 'Priya Patel', 'priya.patel@student.edu', '$2b$10$ctyecrA6sAtwVsyk3EH0SeUlMiMaNCy56Y3zkDmLVmdvmf/Gszxiq', 'student', 'active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
(8, 'Ankit Verma', 'ankit.verma@student.edu', '$2b$10$ctyecrA6sAtwVsyk3EH0SeUlMiMaNCy56Y3zkDmLVmdvmf/Gszxiq', 'student', 'active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
(9, 'Sneha Reddy', 'sneha.reddy@student.edu', '$2b$10$ctyecrA6sAtwVsyk3EH0SeUlMiMaNCy56Y3zkDmLVmdvmf/Gszxiq', 'student', 'active', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150');

-- 3. Insert Companies
INSERT INTO companies (id, user_id, company_name, industry_type, company_size, website, location, contact_email, contact_phone, description, logo_url, verification_status) VALUES
(1, 2, 'Microsoft India', 'Software & Cloud Computing', '10,000+ employees', 'https://microsoft.com', 'Hyderabad, India', 'recruiter@microsoft.com', '+91 40 6694 0000', 'Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Our mission is to empower every person and every organization on the planet to achieve more.', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', 'verified'),
(2, 3, 'Google India', 'Internet & AI Technology', '10,000+ employees', 'https://google.com', 'Bengaluru, India', 'talent@google.com', '+91 80 6721 8000', 'Google is a global technology leader focused on improving the ways people connect with information. We build products that help billions of people globally.', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 'verified'),
(3, 4, 'Amazon Web Services', 'Cloud Infrastructure', '10,000+ employees', 'https://aws.amazon.com', 'Bengaluru, India', 'careers@amazon.com', '+91 80 4103 2000', 'Amazon Web Services (AWS) is the world’s most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally.', 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', 'verified'),
(4, 5, 'Infosys Limited', 'IT Services & Consulting', '10,000+ employees', 'https://infosys.com', 'Pune, India', 'campus@infosys.com', '+91 20 2293 2800', 'Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 50 countries to navigate their digital transformation.', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', 'verified');

-- 4. Insert Students
INSERT INTO students (id, user_id, phone, college, degree, branch, graduation_year, cgpa, location, bio, github_url, linkedin_url, resume_url) VALUES
(1, 6, '+91 98765 43210', 'National Institute of Technology (NIT)', 'B.Tech', 'Computer Science and Engineering', 2026, 8.92, 'Bengaluru, India', 'Passionate full-stack developer with solid foundations in React, Node.js, and SQL. Enthusiastic about distributed systems and cloud architecture.', 'https://github.com/rahulsharma-dev', 'https://linkedin.com/in/rahulsharma-dev', '/uploads/resumes/sample_resume_rahul.pdf'),
(2, 7, '+91 98765 43211', 'Indian Institute of Information Technology (IIIT)', 'B.Tech', 'Information Technology', 2026, 9.20, 'Hyderabad, India', 'AI & Machine Learning enthusiast with experience in Python, PyTorch, and NLP models. Winner of Smart India Hackathon 2025.', 'https://github.com/priyapatel-ai', 'https://linkedin.com/in/priyapatel-ai', '/uploads/resumes/sample_resume_priya.pdf'),
(3, 8, '+91 98765 43212', 'Birla Institute of Technology and Science (BITS)', 'B.E.', 'Computer Science', 2025, 8.54, 'Mumbai, India', 'Backend engineer who loves designing scalable microservices, Dockerization, and cloud deployment pipelines.', 'https://github.com/ankitverma-cloud', 'https://linkedin.com/in/ankitverma-cloud', '/uploads/resumes/sample_resume_ankit.pdf'),
(4, 9, '+91 98765 43213', 'Delhi Technological University (DTU)', 'B.Tech', 'Electronics & Communication', 2026, 8.75, 'Delhi, India', 'Front-end specialist with high design sensibilities in React, Tailwind, and Figma prototyping.', 'https://github.com/snehareddy-ui', 'https://linkedin.com/in/snehareddy-ui', '/uploads/resumes/sample_resume_sneha.pdf');

-- 5. Student Skills
INSERT INTO student_skills (student_id, skill_id, proficiency) VALUES
-- Rahul (Full-Stack CS)
(1, 1, 'Advanced'),     -- Python
(1, 4, 'Expert'),       -- JavaScript
(1, 6, 'Expert'),       -- React.js
(1, 7, 'Advanced'),     -- Node.js
(1, 8, 'Advanced'),     -- Express.js
(1, 9, 'Expert'),       -- Tailwind CSS
(1, 11, 'Advanced'),    -- SQL
(1, 12, 'Advanced'),    -- MySQL
(1, 24, 'Expert'),      -- Git & GitHub
(1, 25, 'Advanced'),    -- REST APIs
-- Priya (AI / Data Science)
(2, 1, 'Expert'),       -- Python
(2, 11, 'Advanced'),    -- SQL
(2, 15, 'Expert'),      -- Machine Learning
(2, 16, 'Advanced'),    -- Deep Learning
(2, 17, 'Expert'),      -- Data Analytics
(2, 18, 'Advanced'),    -- Power BI
(2, 19, 'Advanced'),    -- PyTorch
(2, 20, 'Intermediate'),-- NLP
(2, 24, 'Advanced'),    -- Git & GitHub
-- Ankit (Backend / Cloud)
(3, 2, 'Advanced'),     -- Java
(3, 7, 'Advanced'),     -- Node.js
(3, 11, 'Advanced'),    -- SQL
(3, 14, 'Advanced'),    -- PostgreSQL
(3, 21, 'Advanced'),    -- Docker
(3, 22, 'Intermediate'),-- Kubernetes
(3, 23, 'Advanced'),    -- AWS
(3, 26, 'Intermediate'),-- System Design
-- Sneha (Frontend / Design)
(4, 4, 'Expert'),       -- JavaScript
(4, 5, 'Intermediate'),-- TypeScript
(4, 6, 'Expert'),       -- React.js
(4, 9, 'Expert'),       -- Tailwind CSS
(4, 10, 'Expert'),      -- HTML/CSS
(4, 27, 'Advanced');    -- Figma

-- 6. Student Education Details
INSERT INTO education (student_id, institution, degree, field_of_study, start_year, end_year, score_or_grade) VALUES
(1, 'National Institute of Technology (NIT)', 'Bachelor of Technology', 'Computer Science and Engineering', 2022, 2026, '8.92 CGPA'),
(1, 'Delhi Public School', 'Higher Secondary Education (Class XII)', 'PCM with Computer Science', 2020, 2022, '96.4%'),
(2, 'Indian Institute of Information Technology (IIIT)', 'Bachelor of Technology', 'Information Technology', 2022, 2026, '9.20 CGPA'),
(3, 'Birla Institute of Technology and Science (BITS)', 'Bachelor of Engineering', 'Computer Science', 2021, 2025, '8.54 CGPA'),
(4, 'Delhi Technological University (DTU)', 'Bachelor of Technology', 'Electronics & Communication', 2022, 2026, '8.75 CGPA');

-- 7. Student Certifications
INSERT INTO certifications (student_id, title, issuing_organization, issue_date, expiration_date, credential_id, credential_url) VALUES
(1, 'Meta Certified Front-End Developer', 'Coursera / Meta', '2024-06-15', '2027-06-15', 'META-FE-99824', 'https://coursera.org/verify/META-FE-99824'),
(1, 'AWS Certified Cloud Practitioner', 'Amazon Web Services', '2024-11-20', '2027-11-20', 'AWS-CCP-48201', 'https://aws.amazon.com/verification/AWS-CCP-48201'),
(2, 'Deep Learning Specialization', 'DeepLearning.AI', '2024-08-10', NULL, 'DL-SPEC-77312', 'https://coursera.org/verify/specialization/DL77312'),
(2, 'Microsoft Certified: Azure Data Scientist Associate', 'Microsoft', '2024-12-05', '2026-12-05', 'MS-DS-100-33', 'https://learn.microsoft.com/credentials'),
(3, 'Docker Certified Associate (DCA)', 'Docker Inc.', '2024-05-18', '2026-05-18', 'DOCKER-991284', 'https://docker.com/verify'),
(4, 'Google UX Design Professional Certificate', 'Google', '2024-07-22', NULL, 'GUX-882194', 'https://coursera.org/verify/professional-cert/GUX');

-- 8. Student Projects
INSERT INTO projects (student_id, title, description, technologies, project_url, github_repo) VALUES
(1, 'Collaborative Real-Time Code Editor', 'Built a cloud-based multi-user live coding environment featuring syntax highlighting, operational transformation, and WebSockets.', 'React.js, Node.js, Express, Socket.io, Tailwind CSS', 'https://code-collab-demo.vercel.app', 'https://github.com/rahulsharma-dev/code-collab'),
(1, 'Campus Resource Exchange Platform', 'A centralized marketplace for university students to exchange books, equipment, and peer mentoring sessions.', 'React, Express.js, MySQL, Tailwind CSS', 'https://campus-market.example.com', 'https://github.com/rahulsharma-dev/campus-market'),
(2, 'Automated Medical Diagnostic NLP Classifier', 'Classifies clinical notes and highlights symptom indicators using BioBERT and PyTorch transformer models.', 'Python, PyTorch, Transformers, FastAPI, Docker', 'https://huggingface.co/spaces/med-nlp', 'https://github.com/priyapatel-ai/med-nlp-classifier'),
(3, 'High-Throughput Distributed Rate Limiter', 'Implemented token-bucket and sliding-window rate limiters with Redis and Go/Node.js handling 50k+ req/sec.', 'Node.js, Redis, Docker, System Design', 'https://github.com/ankitverma-cloud/rate-limiter', 'https://github.com/ankitverma-cloud/rate-limiter'),
(4, 'Design System & Component Library for EdTech', 'Crafted an accessible, WCAG 2.1 AA compliant UI kit and component library in React and Tailwind.', 'React.js, Tailwind CSS, Storybook, Figma', 'https://storybook-design.example.com', 'https://github.com/snehareddy-ui/design-system');

-- 9. Internships
INSERT INTO internships (id, company_id, title, description, responsibilities, requirements, location, work_mode, duration, stipend, eligibility, openings, deadline, status) VALUES
(1, 1, 'Full-Stack Software Engineering Intern', 'Join Microsoft Core Services Engineering team to build next-generation enterprise web apps that serve millions of daily active users.', '• Develop high-performance web components using React and Node.js.\n• Collaborate with engineering teams to design clean REST APIs.\n• Write automated unit tests and participate in sprint reviews.', '• Pursuing B.Tech/B.E. in CS/IT or related field.\n• Strong grasp of JavaScript, React.js, and SQL.\n• Solid understanding of Data Structures and Algorithms.', 'Hyderabad, India', 'Hybrid', '6 Months', '₹80,000/month', 'B.Tech/B.E. graduating in 2025 or 2026 with CGPA > 8.0', 5, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 'active'),

(2, 2, 'AI & Machine Learning Research Intern', 'Work directly with Google Research engineers on exploratory ML pipelines, natural language processing, and multimodal foundation models.', '• Train and fine-tune large-scale neural network models using PyTorch.\n• Conduct data cleaning, feature engineering, and statistical evaluations.\n• Present findings to product research teams.', '• Strong proficiency in Python and modern ML frameworks (PyTorch/TensorFlow).\n• Prior experience in Machine Learning, Deep Learning, or NLP projects.\n• Strong math and analytical mindset.', 'Bengaluru, India', 'On-site', '6 Months', '₹1,00,000/month', 'B.Tech/M.Tech in CS/AI/Data Science with CGPA > 8.5', 3, DATE_ADD(CURRENT_DATE, INTERVAL 25 DAY), 'active'),

(3, 3, 'Cloud Solutions & DevOps Intern', 'Collaborate with AWS Solutions Architects to build automated infrastructure-as-code deployments and cloud observability dashboards.', '• Build CI/CD pipelines using Docker and AWS CodePipeline.\n• Assist in architecting scalable serverless solutions on AWS Lambda and ECS.\n• Monitor cloud performance and security baselines.', '• Hands-on familiarity with Docker, Linux, and Cloud fundamentals.\n• Basic knowledge of AWS, Node.js or Python.\n• Passion for cloud reliability and DevOps automation.', 'Bengaluru, India', 'Remote', '3 Months', '₹75,000/month', 'Pre-final and Final year engineering students', 4, DATE_ADD(CURRENT_DATE, INTERVAL 20 DAY), 'active'),

(4, 4, 'Frontend UI/UX Engineering Intern', 'Join Infosys Digital Experience Studios to develop responsive, accessible, and delightful digital experiences for global clients.', '• Translate high-fidelity Figma designs into responsive React components.\n• Optimize web applications for cross-browser speed and usability.\n• Integrate RESTful backend services with frontend state.', '• Good knowledge of HTML, CSS, JavaScript, and React.js.\n• Familiarity with Tailwind CSS or CSS-in-JS.\n• Keen eye for UI aesthetics and UX detail.', 'Pune, India', 'Hybrid', '3 Months', '₹35,000/month', 'Undergraduate students with strong web portfolio', 6, DATE_ADD(CURRENT_DATE, INTERVAL 45 DAY), 'active');

-- 10. Internship Required Skills
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
-- Microsoft SWE Intern (React, Node, SQL, REST APIs, JavaScript)
(1, 4, TRUE),  -- JavaScript
(1, 6, TRUE),  -- React.js
(1, 7, TRUE),  -- Node.js
(1, 11, TRUE), -- SQL
(1, 25, TRUE), -- REST APIs

-- Google AI/ML Intern (Python, ML, Deep Learning, PyTorch, NLP)
(2, 1, TRUE),  -- Python
(2, 15, TRUE), -- Machine Learning
(2, 16, TRUE), -- Deep Learning
(2, 19, TRUE), -- PyTorch
(2, 20, FALSE),-- NLP

-- AWS Cloud Intern (Docker, AWS, Git, System Design, Node.js)
(3, 21, TRUE), -- Docker
(3, 23, TRUE), -- AWS
(3, 24, TRUE), -- Git & GitHub
(3, 7, FALSE), -- Node.js
(3, 22, FALSE),-- Kubernetes

-- Infosys Frontend Intern (JavaScript, React, Tailwind, HTML/CSS, Figma)
(4, 4, TRUE),  -- JavaScript
(4, 6, TRUE),  -- React.js
(4, 9, TRUE),  -- Tailwind CSS
(4, 10, TRUE), -- HTML/CSS
(4, 27, FALSE);-- Figma

-- 11. Jobs / Placement Opportunities
INSERT INTO jobs (id, company_id, title, description, requirements, salary_package, location, work_mode, eligibility, experience, openings, deadline, status) VALUES
(1, 1, 'Associate Software Development Engineer (SDE-1)', 'Drive impactful features across Azure Cloud & Microsoft 365. Work with world-class engineers on scalable software systems.', '• Strong problem solving in Data Structures and Algorithms.\n• Experience with React, Node.js, Python, or Java.\n• Understanding of database design and web microservices.', '₹24 - 32 LPA', 'Hyderabad, India', 'Hybrid', 'B.Tech/M.Tech/MCA Graduating 2025 or 2026', 'Freshers (0-1 yrs)', 8, DATE_ADD(CURRENT_DATE, INTERVAL 40 DAY), 'active'),

(2, 2, 'Junior Data Analyst & Insights Associate', 'Transform petabytes of user behavior and telemetry data into actionable product decisions across Google Workspace and Search.', '• Expert SQL scripting and data wrangling in Python.\n• Proficiency with visualization tools like Power BI or Tableau.\n• Solid understanding of A/B testing and statistics.', '₹18 - 25 LPA', 'Bengaluru, India', 'On-site', 'B.Tech/B.Sc in Statistics, CS, Data Science', 'Freshers (0-1 yrs)', 4, DATE_ADD(CURRENT_DATE, INTERVAL 35 DAY), 'active'),

(3, 3, 'Associate Cloud Infrastructure Engineer', 'Design, build, and support customer-facing AWS cloud architectures, automated DevOps tooling, and resilient serverless workflows.', '• Strong background in Linux, Docker, and AWS foundational services.\n• Scripting skills in Python, Bash, or Node.js.\n• Understanding of networking and CI/CD pipelines.', '₹20 - 28 LPA', 'Bengaluru, India', 'Remote', 'B.Tech/B.E. in CS/IT/ECE', 'Freshers (0-1 yrs)', 6, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 'active'),

(4, 4, 'Full Stack Web Developer', 'Deliver end-to-end web applications for Fortune 500 enterprise clients leveraging modern React and Node.js microservices.', '• Practical proficiency in React.js, Express.js, MySQL, and Tailwind.\n• Experience creating and consuming RESTful APIs.\n• Version control mastery with Git.', '₹8 - 14 LPA', 'Pune, India', 'Hybrid', 'All Engineering graduates with 60%+ in 10th, 12th, and Degree', 'Freshers (0-1 yrs)', 12, DATE_ADD(CURRENT_DATE, INTERVAL 50 DAY), 'active');

-- 12. Job Required Skills
INSERT INTO job_skills (job_id, skill_id, is_required) VALUES
-- Microsoft SDE-1 (JavaScript, React, Node, SQL, Git)
(1, 4, TRUE),
(1, 6, TRUE),
(1, 7, TRUE),
(1, 11, TRUE),
(1, 24, TRUE),

-- Google Junior Data Analyst (Python, SQL, Data Analytics, Power BI, Machine Learning)
(2, 1, TRUE),
(2, 11, TRUE),
(2, 17, TRUE),
(2, 18, TRUE),
(2, 15, FALSE),

-- AWS Cloud Engineer (Docker, AWS, Kubernetes, System Design, Git)
(3, 21, TRUE),
(3, 23, TRUE),
(3, 22, TRUE),
(3, 26, FALSE),
(3, 24, TRUE),

-- Infosys Full Stack (JavaScript, React, Node, Express, MySQL)
(4, 4, TRUE),
(4, 6, TRUE),
(4, 7, TRUE),
(4, 8, TRUE),
(4, 12, TRUE);

-- 13. Applications
INSERT INTO applications (id, student_id, opportunity_type, opportunity_id, resume_url, cover_letter, status, feedback, applied_at) VALUES
(1, 1, 'internship', 1, '/uploads/resumes/sample_resume_rahul.pdf', 'I am deeply interested in contributing to Microsoft Core Services Engineering. My hands-on background in React and Node.js microservices aligns closely with the team goals.', 'Interview', 'Impressive technical profile and strong project portfolio. Scheduled for Round 2 Technical Interview.', DATE_SUB(CURRENT_DATE, INTERVAL 5 DAY)),
(2, 1, 'job', 1, '/uploads/resumes/sample_resume_rahul.pdf', 'Excited about the SDE-1 opportunity at Microsoft. I have strong algorithmic problem solving skills and full stack experience.', 'Shortlisted', 'Profile screened and shortlisted for online assessment.', DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY)),
(3, 2, 'internship', 2, '/uploads/resumes/sample_resume_priya.pdf', 'Passionate about NLP and transformer architectures. My research project in clinical NLP demonstrates my ability to tackle complex ML problems at Google scale.', 'Selected', 'Exceptional performance in ML evaluations and domain interview. Offer letter extended!', DATE_SUB(CURRENT_DATE, INTERVAL 10 DAY)),
(4, 2, 'job', 2, '/uploads/resumes/sample_resume_priya.pdf', 'Applying for Junior Data Analyst role with hands-on experience in SQL, Python analytics, and predictive modeling.', 'Under Review', 'Application under review by hiring manager.', DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY)),
(5, 3, 'internship', 3, '/uploads/resumes/sample_resume_ankit.pdf', 'Enthusiastic about AWS cloud architecture and containerization pipelines.', 'Shortlisted', 'Candidate has strong Docker and AWS credentials. Proceeding to phone screen.', DATE_SUB(CURRENT_DATE, INTERVAL 4 DAY)),
(6, 4, 'internship', 4, '/uploads/resumes/sample_resume_sneha.pdf', 'I love building responsive and pixel-perfect design systems with React and Tailwind CSS.', 'Applied', NULL, DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY));

-- 14. Notifications
INSERT INTO notifications (user_id, title, message, type, is_read, link) VALUES
(6, 'Interview Scheduled: Microsoft SWE Intern', 'Congratulations! Microsoft has shortlisted your profile and scheduled a Round 2 Technical Interview.', 'status_update', FALSE, '/student/applications'),
(6, 'Application Status Update: Microsoft SDE-1', 'Your application for Associate Software Development Engineer (SDE-1) has been Shortlisted.', 'status_update', FALSE, '/student/applications'),
(7, 'Offer Extended! Google AI/ML Intern', 'Congratulations Priya! Google University Programs has selected you for the AI/ML Research Internship.', 'status_update', FALSE, '/student/applications'),
(8, 'Application Shortlisted: AWS Cloud Intern', 'Amazon Web Services has shortlisted your application for Cloud Solutions & DevOps Intern.', 'status_update', FALSE, '/student/applications'),
(2, 'New Application Received', 'Rahul Sharma has applied for Full-Stack Software Engineering Intern with a 100% skill match.', 'application', FALSE, '/company/applications'),
(3, 'New Application Received', 'Priya Patel applied for AI & Machine Learning Research Intern.', 'application', TRUE, '/company/applications');

SET FOREIGN_KEY_CHECKS = 1;
