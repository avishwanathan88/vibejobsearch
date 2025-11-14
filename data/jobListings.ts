import { JobPosting } from '../types';

export const jobListings: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA',
    type: 'Full-time',
    remote: true,
    salary: '$140,000 - $180,000',
    description: `Join our dynamic team at TechFlow Solutions, where innovation meets execution. We're seeking a Senior Full Stack Developer to lead the development of our next-generation SaaS platform that serves over 100,000 users globally.

As a Senior Full Stack Developer, you'll be responsible for architecting scalable solutions, mentoring junior developers, and working closely with product managers to deliver features that directly impact our bottom line. You'll have the opportunity to work with cutting-edge technologies and shape the technical direction of our products.

Our ideal candidate thrives in a fast-paced environment, has a passion for clean code, and believes in the power of continuous learning. We offer competitive compensation, equity participation, and a comprehensive benefits package including health, dental, vision, and unlimited PTO.`,
    requirements: [
      '5+ years of experience with React, Node.js, and TypeScript',
      'Experience with cloud platforms (AWS, GCP, or Azure)',
      'Strong understanding of database design and optimization',
      'Experience with microservices architecture',
      'Knowledge of DevOps practices and CI/CD pipelines',
      'Excellent communication and leadership skills'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      '401(k) with company matching',
      'Professional development budget',
      'Remote-first culture'
    ],
    tags: ['react', 'nodejs', 'typescript', 'aws', 'senior'],
    postedDate: '2024-11-10',
    applicationDeadline: '2024-12-15'
  },
  {
    id: '2',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations Inc.',
    location: 'New York, NY',
    type: 'Full-time',
    remote: false,
    salary: '$160,000 - $220,000',
    description: `AI Innovations Inc. is at the forefront of artificial intelligence research and development. We're looking for a talented Machine Learning Engineer to join our core AI team and help build the next generation of intelligent systems.

You'll be working on cutting-edge ML models that power our recommendation systems, natural language processing capabilities, and computer vision applications. This role offers the unique opportunity to work with petabytes of data and deploy models that serve millions of users daily.

Our team values collaboration, innovation, and technical excellence. You'll work alongside some of the brightest minds in AI and have access to state-of-the-art computing resources, including our dedicated GPU clusters and cloud infrastructure.`,
    requirements: [
      'Masters or PhD in Computer Science, Machine Learning, or related field',
      '3+ years of experience with Python, TensorFlow/PyTorch',
      'Strong background in deep learning and neural networks',
      'Experience with large-scale data processing (Spark, Hadoop)',
      'Knowledge of MLOps and model deployment practices',
      'Published research or significant contributions to open source ML projects'
    ],
    benefits: [
      'Top-tier compensation package',
      'Research publication opportunities',
      'Access to cutting-edge hardware',
      'Conference attendance budget',
      'Comprehensive health benefits',
      'Stock options'
    ],
    tags: ['python', 'tensorflow', 'pytorch', 'mlops', 'ai'],
    postedDate: '2024-11-08',
    applicationDeadline: '2024-12-20'
  },
  {
    id: '3',
    title: 'Frontend Developer (React)',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    type: 'Full-time',
    remote: true,
    salary: '$95,000 - $130,000',
    description: `StartupXYZ is a rapidly growing fintech startup that's revolutionizing how people manage their personal finances. We're seeking a passionate Frontend Developer to help us build beautiful, intuitive user interfaces that make financial planning accessible to everyone.

As a Frontend Developer at StartupXYZ, you'll be responsible for creating responsive, accessible web applications using React and modern frontend technologies. You'll collaborate closely with our design team to implement pixel-perfect UIs and work with our backend engineers to integrate with our APIs.

This is an excellent opportunity for a mid-level developer looking to take the next step in their career. You'll have significant ownership over frontend architecture decisions and the chance to mentor junior team members as we scale our engineering organization.`,
    requirements: [
      '3+ years of professional React development experience',
      'Proficiency in JavaScript/TypeScript, HTML5, and CSS3',
      'Experience with state management libraries (Redux, Zustand, etc.)',
      'Knowledge of modern build tools (Webpack, Vite, etc.)',
      'Understanding of responsive design and cross-browser compatibility',
      'Experience with testing frameworks (Jest, React Testing Library)'
    ],
    benefits: [
      'Competitive salary with equity upside',
      'Flexible working hours',
      'Health and wellness stipend',
      'Learning and development budget',
      'Team retreats and social events',
      'Latest MacBook Pro and equipment'
    ],
    tags: ['react', 'javascript', 'typescript', 'frontend', 'fintech'],
    postedDate: '2024-11-12',
    applicationDeadline: '2024-12-10'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudScale Systems',
    location: 'Seattle, WA',
    type: 'Full-time',
    remote: true,
    salary: '$130,000 - $170,000',
    description: `CloudScale Systems provides enterprise cloud infrastructure solutions to Fortune 500 companies. We're looking for an experienced DevOps Engineer to join our platform team and help us scale our infrastructure to support millions of transactions per day.

In this role, you'll be responsible for designing and maintaining our Kubernetes-based infrastructure, implementing CI/CD pipelines, and ensuring our systems maintain 99.99% uptime. You'll work with cutting-edge technologies and have the opportunity to solve complex infrastructure challenges at scale.

Our ideal candidate has a strong background in both development and operations, with experience in containerization, infrastructure as code, and cloud-native technologies. You should be comfortable working in a fast-paced environment where reliability and performance are critical.`,
    requirements: [
      '4+ years of experience with Kubernetes and Docker',
      'Strong knowledge of AWS, GCP, or Azure cloud platforms',
      'Experience with Infrastructure as Code (Terraform, CloudFormation)',
      'Proficiency in scripting languages (Python, Bash, Go)',
      'Knowledge of monitoring and observability tools (Prometheus, Grafana, ELK)',
      'Experience with CI/CD tools (Jenkins, GitLab CI, GitHub Actions)'
    ],
    benefits: [
      'Competitive salary and performance bonuses',
      'Comprehensive health, dental, and vision coverage',
      'Flexible PTO policy',
      '401(k) with generous company matching',
      'Professional certification reimbursement',
      'Home office setup allowance'
    ],
    tags: ['kubernetes', 'docker', 'aws', 'terraform', 'devops'],
    postedDate: '2024-11-09',
    applicationDeadline: '2024-12-18'
  },
  {
    id: '5',
    title: 'Mobile App Developer (React Native)',
    company: 'MobileFirst Studios',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    remote: false,
    salary: '$110,000 - $150,000',
    description: `MobileFirst Studios is a leading mobile app development agency that creates award-winning applications for clients ranging from startups to enterprise companies. We're seeking a talented React Native Developer to join our growing team of mobile experts.

As a React Native Developer, you'll work on diverse projects spanning multiple industries including healthcare, e-commerce, entertainment, and social media. You'll have the opportunity to work with the latest mobile technologies and contribute to apps that reach millions of users worldwide.

Our studio culture emphasizes creativity, technical excellence, and continuous learning. We provide a collaborative environment where you can grow your skills while working on cutting-edge mobile experiences. You'll work alongside experienced designers, project managers, and fellow developers to deliver exceptional mobile applications.`,
    requirements: [
      '3+ years of React Native development experience',
      'Strong proficiency in JavaScript/TypeScript',
      'Experience with native iOS and Android development concepts',
      'Knowledge of mobile app deployment processes (App Store, Google Play)',
      'Experience with Redux or other state management solutions',
      'Understanding of mobile UI/UX best practices'
    ],
    benefits: [
      'Competitive salary with performance reviews',
      'Creative and collaborative work environment',
      'Professional development opportunities',
      'Health insurance and wellness programs',
      'Catered lunches and team events',
      'Latest development hardware and software'
    ],
    tags: ['react-native', 'mobile', 'javascript', 'typescript', 'ios', 'android'],
    postedDate: '2024-11-11',
    applicationDeadline: '2024-12-12'
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'DataDriven Analytics',
    location: 'Boston, MA',
    type: 'Full-time',
    remote: true,
    salary: '$120,000 - $165,000',
    description: `DataDriven Analytics helps companies make better decisions through advanced analytics and machine learning. We're looking for a Data Scientist to join our consulting team and work on diverse projects across multiple industries.

As a Data Scientist, you'll work directly with clients to understand their business challenges, analyze complex datasets, and build predictive models that drive real business value. You'll have the opportunity to work with Fortune 500 companies and cutting-edge startups, tackling problems in areas like customer segmentation, fraud detection, and demand forecasting.

This role is perfect for someone who enjoys the variety of consulting work and wants to make a direct impact on business outcomes. You'll work with a team of experienced data scientists and engineers while having significant autonomy over your projects and methodologies.`,
    requirements: [
      'Masters or PhD in Statistics, Mathematics, Computer Science, or related field',
      '3+ years of experience in data science and analytics',
      'Proficiency in Python, R, and SQL',
      'Experience with machine learning frameworks (scikit-learn, pandas, numpy)',
      'Strong statistical analysis and data visualization skills',
      'Excellent communication skills for client presentations'
    ],
    benefits: [
      'Competitive salary and annual bonuses',
      'Client project diversity and learning opportunities',
      'Flexible work arrangements',
      'Professional development and conference attendance',
      'Comprehensive benefits package',
      'Collaborative and supportive team environment'
    ],
    tags: ['python', 'r', 'sql', 'machine-learning', 'statistics', 'data-science'],
    postedDate: '2024-11-07',
    applicationDeadline: '2024-12-14'
  },
  {
    id: '7',
    title: 'Backend Engineer (Go)',
    company: 'MicroServices Corp',
    location: 'Denver, CO',
    type: 'Full-time',
    remote: true,
    salary: '$125,000 - $160,000',
    description: `MicroServices Corp specializes in building scalable backend systems for high-growth companies. We're seeking a Backend Engineer with strong Go experience to join our core platform team and help architect the next generation of our microservices infrastructure.

You'll be working on systems that handle millions of requests per day, designing APIs that power mobile and web applications, and building the infrastructure that enables our clients to scale their businesses. This role offers the opportunity to work with modern technologies and solve complex distributed systems challenges.

Our engineering culture values code quality, system reliability, and continuous improvement. You'll work in a collaborative environment with experienced engineers who are passionate about building robust, scalable systems. We believe in giving engineers ownership over their work and the autonomy to make technical decisions.`,
    requirements: [
      '4+ years of backend development experience',
      'Strong proficiency in Go programming language',
      'Experience with microservices architecture and RESTful APIs',
      'Knowledge of database systems (PostgreSQL, MongoDB, Redis)',
      'Experience with message queues and distributed systems',
      'Understanding of containerization and orchestration (Docker, Kubernetes)'
    ],
    benefits: [
      'Competitive compensation package',
      'Stock options with high growth potential',
      'Fully remote work environment',
      'Annual company retreats',
      'Learning stipend for books and courses',
      'Top-tier health and dental coverage'
    ],
    tags: ['go', 'microservices', 'backend', 'api', 'distributed-systems'],
    postedDate: '2024-11-06',
    applicationDeadline: '2024-12-16'
  },
  {
    id: '8',
    title: 'UI/UX Designer & Frontend Developer',
    company: 'DesignTech Studio',
    location: 'Portland, OR',
    type: 'Full-time',
    remote: false,
    salary: '$105,000 - $140,000',
    description: `DesignTech Studio is an award-winning digital agency that creates beautiful, user-centered digital experiences. We're looking for a unique hybrid role - a UI/UX Designer who can also implement their designs in code, bridging the gap between design and development.

In this role, you'll be responsible for the entire design-to-implementation pipeline: conducting user research, creating wireframes and prototypes, designing beautiful interfaces, and then bringing those designs to life with clean, maintainable code. You'll work on projects ranging from startup MVPs to enterprise redesigns.

This is an ideal position for a creative professional who enjoys both the strategic thinking of UX design and the technical challenge of frontend development. You'll work closely with our clients to understand their users' needs and create solutions that are both beautiful and functional.`,
    requirements: [
      '3+ years of UI/UX design experience',
      '2+ years of frontend development experience (HTML, CSS, JavaScript)',
      'Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)',
      'Experience with React or Vue.js frameworks',
      'Strong portfolio demonstrating both design and development skills',
      'Understanding of user research methodologies and usability testing'
    ],
    benefits: [
      'Competitive salary with project bonuses',
      'Creative freedom and diverse project portfolio',
      'Professional development and design conference attendance',
      'Modern office with latest design and development tools',
      'Health benefits and wellness programs',
      'Collaborative and inspiring work environment'
    ],
    tags: ['ui-ux', 'design', 'frontend', 'react', 'figma', 'user-research'],
    postedDate: '2024-11-13',
    applicationDeadline: '2024-12-08'
  },
  {
    id: '9',
    title: 'Security Engineer',
    company: 'CyberShield Technologies',
    location: 'Washington, DC',
    type: 'Full-time',
    remote: true,
    salary: '$145,000 - $190,000',
    description: `CyberShield Technologies is a leading cybersecurity firm that protects critical infrastructure for government agencies and Fortune 500 companies. We're seeking a Security Engineer to join our threat detection and response team.

As a Security Engineer, you'll be responsible for designing and implementing security controls, conducting vulnerability assessments, and responding to security incidents. You'll work with cutting-edge security tools and technologies while helping protect some of the world's most sensitive systems and data.

This role offers the opportunity to work on challenging security problems with real-world impact. You'll be part of a team of security experts who are passionate about staying ahead of emerging threats and building robust defenses against sophisticated adversaries.`,
    requirements: [
      '4+ years of experience in cybersecurity or related field',
      'Strong knowledge of security frameworks (NIST, ISO 27001, SOC 2)',
      'Experience with security tools (SIEM, vulnerability scanners, penetration testing)',
      'Understanding of network security, encryption, and secure coding practices',
      'Relevant certifications (CISSP, CISM, CEH, or similar)',
      'Experience with cloud security (AWS, Azure, GCP)'
    ],
    benefits: [
      'Top-tier compensation and security clearance bonuses',
      'Comprehensive health, dental, and vision coverage',
      'Professional certification reimbursement',
      'Flexible work arrangements and unlimited PTO',
      'Security conference attendance and training opportunities',
      'Cutting-edge security tools and technologies'
    ],
    tags: ['security', 'cybersecurity', 'penetration-testing', 'aws', 'compliance'],
    postedDate: '2024-11-05',
    applicationDeadline: '2024-12-22'
  },
  {
    id: '10',
    title: 'Junior Software Developer',
    company: 'GrowthPath Technologies',
    location: 'Chicago, IL',
    type: 'Full-time',
    remote: true,
    salary: '$70,000 - $90,000',
    description: `GrowthPath Technologies is a fast-growing SaaS company that builds productivity tools for small and medium businesses. We're looking for a Junior Software Developer to join our engineering team and grow their career in a supportive, learning-focused environment.

This is an excellent opportunity for a recent graduate or career changer to gain hands-on experience with modern web technologies while working on products that help thousands of businesses operate more efficiently. You'll work closely with senior engineers who are committed to mentoring and helping you develop your technical skills.

Our engineering culture emphasizes continuous learning, code quality, and collaboration. You'll have the opportunity to work on both frontend and backend features, participate in code reviews, and contribute to architectural decisions as you grow in your role. We believe in promoting from within and providing clear career advancement paths.`,
    requirements: [
      'Bachelors degree in Computer Science or related field, or equivalent experience',
      '0-2 years of professional software development experience',
      'Basic knowledge of web technologies (HTML, CSS, JavaScript)',
      'Familiarity with at least one programming language (Python, Java, JavaScript)',
      'Understanding of version control systems (Git)',
      'Strong problem-solving skills and eagerness to learn'
    ],
    benefits: [
      'Competitive entry-level salary with regular reviews',
      'Mentorship program with senior engineers',
      'Learning and development budget',
      'Health, dental, and vision insurance',
      'Flexible work hours and remote-friendly culture',
      'Career advancement opportunities'
    ],
    tags: ['junior', 'entry-level', 'javascript', 'python', 'mentorship', 'saas'],
    postedDate: '2024-11-14',
    applicationDeadline: '2024-12-30'
  }
];
