import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Sparkles,
  Layers,
  Award,
  ExternalLink,
  Code2,
  Database,
  Cloud,
  Cpu
} from 'lucide-react';

const LearningRoadmap = () => {
  const [activeTrack, setActiveTrack] = useState('fullstack');

  const tracks = {
    fullstack: {
      title: 'Full-Stack Software Engineering',
      desc: 'Master frontend architectures, robust REST APIs, SQL databases, and containerized deployment.',
      icon: Code2,
      steps: [
        {
          stage: 'Phase 1: Foundations',
          skills: ['JavaScript ES6+', 'HTML5 & Semantic Structure', 'CSS3 & Modern Tailwind', 'Git & GitHub Workflow'],
          project: 'Responsive Portfolio & Multi-page Interactive Web App',
          certs: 'Meta Certified Front-End Developer'
        },
        {
          stage: 'Phase 2: Modern Frontend',
          skills: ['React.js 19 Component Model', 'State Management & Context API', 'React Router v7', 'Asynchronous API Fetching with Axios'],
          project: 'Real-Time E-Commerce or Task Collaboration Platform',
          certs: 'React Professional Certification'
        },
        {
          stage: 'Phase 3: Backend & Databases',
          skills: ['Node.js Event Loop', 'Express.js Middleware Architecture', 'Relational Schema Design in MySQL', 'JWT Authentication & Security Best Practices'],
          project: 'Full-Stack RESTful API Portal with Role-Based Access Control',
          certs: 'Oracle Certified Professional: MySQL Database'
        },
        {
          stage: 'Phase 4: Cloud & Deployment',
          skills: ['Docker Containerization', 'CI/CD Pipelines (GitHub Actions)', 'AWS / Cloud Hosting Fundamentals', 'API Performance Optimization & Caching'],
          project: 'Microservices Deployment on Cloud Infrastructure',
          certs: 'AWS Certified Solutions Architect Associate'
        }
      ]
    },
    aiml: {
      title: 'AI & Data Science Engineering',
      desc: 'Harness data processing, predictive modeling, deep learning architectures, and modern LLM pipelines.',
      icon: Cpu,
      steps: [
        {
          stage: 'Phase 1: Mathematical Foundations & Python',
          skills: ['Advanced Python for Data Science', 'Linear Algebra & Statistics', 'NumPy, Pandas Data Wrangling', 'Exploratory Data Analysis (EDA)'],
          project: 'Interactive Data Visualizer & Predictive Exploratory Notebook',
          certs: 'Python for Everybody Specialization'
        },
        {
          stage: 'Phase 2: Machine Learning Core',
          skills: ['Scikit-Learn Algorithms', 'Supervised & Unsupervised Learning', 'Model Evaluation & Cross-Validation', 'Hyperparameter Tuning'],
          project: 'Predictive Analytics Dashboard for Industry Datasets',
          certs: 'DeepLearning.AI Machine Learning Specialization'
        },
        {
          stage: 'Phase 3: Deep Learning & Neural Networks',
          skills: ['PyTorch / TensorFlow Architecture', 'Convolutional Networks (CNNs)', 'Transformers & Natural Language Processing (NLP)', 'Hugging Face Ecosystem'],
          project: 'Medical or Financial NLP Diagnostic Classifier',
          certs: 'Deep Learning Specialization (Coursera / Andrew Ng)'
        },
        {
          stage: 'Phase 4: Production MLOps',
          skills: ['FastAPI Inference Endpoints', 'Model Containerization with Docker', 'MLflow Tracking', 'Vector Databases & RAG Pipelines'],
          project: 'End-to-End Enterprise RAG Knowledge Search Bot',
          certs: 'AWS Certified Machine Learning Specialty'
        }
      ]
    },
    cloud: {
      title: 'Cloud & DevOps Engineering',
      desc: 'Build scalable cloud environments, automate infrastructure, manage Kubernetes clusters, and monitor systems.',
      icon: Cloud,
      steps: [
        {
          stage: 'Phase 1: Linux & Systems Basics',
          skills: ['Linux Shell Scripting & Bash', 'Computer Networking (TCP/IP, DNS, SSL)', 'Git Branching Strategies', 'Security Principles'],
          project: 'Automated Server Setup & Log Monitoring Script',
          certs: 'Linux Professional Institute Certification (LPIC-1)'
        },
        {
          stage: 'Phase 2: Containerization & Cloud Infrastructure',
          skills: ['Docker Dockerfile & Multi-stage Builds', 'Docker Compose Orchestration', 'AWS Core Services (EC2, S3, RDS, IAM)', 'Serverless Architecture'],
          project: 'Containerized Microservices Cluster on Cloud',
          certs: 'AWS Certified Cloud Practitioner (CLF-C02)'
        },
        {
          stage: 'Phase 3: Orchestration & Infrastructure as Code',
          skills: ['Kubernetes Deployments & Services', 'Helm Package Manager', 'Terraform Provisioning', 'GitHub Actions Automated CI/CD'],
          project: 'Zero-Downtime Blue-Green Automated Deployment Pipeline',
          certs: 'Certified Kubernetes Administrator (CKA)'
        },
        {
          stage: 'Phase 4: Observability & Production Reliability',
          skills: ['Prometheus & Grafana Metrics Monitoring', 'Log Aggregation (ELK Stack)', 'Chaos Engineering & Fault Tolerance', 'Cost Optimization'],
          project: 'Enterprise Site Reliability & Telemetry Dashboard',
          certs: 'AWS Certified Solutions Architect Associate'
        }
      ]
    }
  };

  const current = tracks[activeTrack];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">Curated Learning Roadmaps</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Industry-aligned milestone paths designed to take you from foundational concepts to production competency
            </p>
          </div>

          {/* Track Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTrack('fullstack')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTrack === 'fullstack' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full-Stack
            </button>
            <button
              onClick={() => setActiveTrack('aiml')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTrack === 'aiml' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI & Data Science
            </button>
            <button
              onClick={() => setActiveTrack('cloud')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTrack === 'cloud' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cloud & DevOps
            </button>
          </div>
        </div>

        {/* Track Banner */}
        <div className="p-6 rounded-2xl bg-indigo-900 text-white shadow-lg flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
            <current.icon className="w-8 h-8 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">{current.title}</h2>
            <p className="text-xs text-indigo-200 mt-1 max-w-2xl leading-relaxed">{current.desc}</p>
          </div>
        </div>

        {/* Milestones Flow */}
        <div className="space-y-4">
          {current.steps.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  0{idx + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-base font-bold text-slate-900">{step.stage}</h3>
                  
                  {/* Skills Grid */}
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Key Competencies</p>
                    <div className="flex flex-wrap gap-2">
                      {step.skills.map((sk, sIdx) => (
                        <span key={sIdx} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hands-on Project & Certification */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">Recommended Portfolio Project</span>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{step.project}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Target Industry Certification</span>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{step.certs}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default LearningRoadmap;