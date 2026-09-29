const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const Job = require('../models/Job');
const User = require('../models/User');

const jobsData = [
  {
    title: 'Software Engineering Intern (Summer 2025 / 2026)',
    company: 'Google',
    companyLogo: 'https://www.google.com/favicon.ico',
    companyWebsite: 'https://careers.google.com/',
    jobType: 'Internship',
    workplaceType: 'Hybrid',
    location: 'Bengaluru / Hyderabad, India',
    experienceLevel: 'Internship / College Student',
    eligibleBatches: ['2025', '2026', '2027'],
    salary: '₹1,00,000 - ₹1,20,000 / month',
    category: 'Software Engineering',
    skills: ['C++', 'Java', 'Python', 'Data Structures & Algorithms', 'System Design Basics'],
    description: `As a Software Engineering Intern at Google, you will work on our core products and services alongside world-class engineers. You will design, develop, test, deploy, and maintain large-scale software solutions across Google Search, Cloud, YouTube, or Android.

This internship is designed to give you practical, production-level engineering experience with direct mentorship from senior staff engineers.`,
    responsibilities: [
      'Write scalable, clean, and robust code in C++, Java, or Python.',
      'Participate in code reviews, architectural discussions, and technical design documents.',
      'Profile application performance, optimize algorithms, and minimize latency.',
      'Collaborate with cross-functional teams including product managers and UX designers.'
    ],
    requirements: [
      'Currently enrolled in a Bachelor’s or Master’s degree in Computer Science, IT, or related engineering discipline.',
      'Strong grasp of Data Structures and Algorithms with clean problem-solving skills.',
      'Experience with one or more general-purpose programming languages (C++, Java, Python, Go).',
      'Familiarity with Git and modern software development workflows.'
    ],
    perks: [
      'Industry-leading stipend and housing assistance allowance.',
      'Complimentary gourmet meals and micro-kitchen snacks.',
      'Mentorship from senior Google engineers and tech talk access.',
      'High pre-placement offer (PPO) conversion rate for full-time roles.'
    ],
    applyUrl: 'https://careers.google.com/jobs/results/',
    allowDirectApply: true,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Software Engineer - Fresher (Campus Hiring 2025)',
    company: 'Microsoft',
    companyLogo: 'https://www.microsoft.com/favicon.ico',
    companyWebsite: 'https://careers.microsoft.com/',
    jobType: 'Full-time',
    workplaceType: 'Hybrid',
    location: 'Hyderabad / Bengaluru / Noida, India',
    experienceLevel: 'Fresher (0-1 Years)',
    eligibleBatches: ['2024', '2025'],
    salary: '₹16 - ₹24 LPA',
    category: 'Software Engineering',
    skills: ['C#', 'C++', 'Java', 'Azure', 'Data Structures', 'OOP'],
    description: `Microsoft is hiring Software Engineers to build the future of cloud computing, developer platforms, and productivity suites including Microsoft Azure, Microsoft 365, Teams, and AI copilot initiatives.

You will join a fast-paced agile team, shipping software that impacts billions of daily users worldwide.`,
    responsibilities: [
      'Develop cloud services and client applications using C#, C++, or modern web stacks.',
      'Build unit, integration, and stress tests to maintain high software reliability.',
      'Investigate production telemetry, monitor latency, and resolve live site incidents.',
      'Contribute to open-source developer tooling and Azure services.'
    ],
    requirements: [
      'B.Tech / B.E. / M.Tech in Computer Science, Electronics, or allied engineering branch graduating in 2024 or 2025.',
      'Solid foundations in Object-Oriented Programming, Operating Systems, DBMS, and Networking.',
      'Hands-on experience building web, desktop, or cloud applications.',
      'Excellent verbal and written communication skills.'
    ],
    perks: [
      'Comprehensive medical insurance covering employee and dependents.',
      'Annual performance bonus and Microsoft stock awards (RSUs).',
      'Wellness reimbursement allowance and home-office equipment stipend.',
      'Flexible working hours and parental leave.'
    ],
    applyUrl: 'https://careers.microsoft.com/',
    allowDirectApply: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'AI & Machine Learning Intern',
    company: 'Zomato',
    companyLogo: '',
    companyWebsite: 'https://www.zomato.com/',
    jobType: 'Internship',
    workplaceType: 'On-site',
    location: 'Gurugram, Delhi NCR, India',
    experienceLevel: 'Internship / College Student',
    eligibleBatches: ['2025', '2026'],
    salary: '₹60,000 - ₹80,000 / month',
    category: 'AI & Machine Learning',
    skills: ['Python', 'PyTorch', 'Scikit-Learn', 'Transformers', 'Recommendation Systems', 'SQL'],
    description: `Zomato’s Machine Learning and Data Science team powers personalized food recommendations, delivery dispatch optimization, ETA estimations, and search ranking algorithms across millions of transactions every hour.

Join our AI research and applied engineering team to work on large-scale deep learning models for dynamic pricing, route optimization, and generative AI agents.`,
    responsibilities: [
      'Train, fine-tune, and evaluate deep neural networks for recommendation and search ranking.',
      'Perform exploratory data analysis and feature engineering on high-volume clickstream logs.',
      'Build end-to-end inference pipelines using FastAPI and PyTorch.',
      'Conduct A/B test analysis to measure real-world uplift on conversion and dispatch time.'
    ],
    requirements: [
      'Demonstrated expertise in Python and deep learning frameworks (PyTorch or TensorFlow).',
      'Knowledge of classical ML algorithms (XGBoost, Random Forests) and transformer architectures.',
      'Strong mathematical understanding of linear algebra, probability, and optimization.',
      'Kaggle achievements or published projects in NLP/CV/RecSys are a strong plus.'
    ],
    perks: [
      'Competitive monthly stipend and daily gourmet meals on campus.',
      'Mentorship from top ML researchers and Kaggle grandmasters.',
      'Access to GPU clusters (Nvidia A100/H100) for training experiments.',
      'Fast-track PPO conversion based on intern project outcomes.'
    ],
    applyUrl: 'https://www.zomato.com/careers',
    allowDirectApply: true,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Frontend Engineer (React / Next.js) - Fresher / 0-1 Yr',
    company: 'Razorpay',
    companyLogo: '',
    companyWebsite: 'https://razorpay.com/',
    jobType: 'Full-time',
    workplaceType: 'Remote',
    location: 'Remote (India) / Bengaluru',
    experienceLevel: 'Fresher (0-1 Years)',
    eligibleBatches: ['2024', '2025'],
    salary: '₹12 - ₹18 LPA',
    category: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'Web Vitals'],
    description: `Razorpay powers financial infrastructure for millions of businesses across India and Southeast Asia. As a Frontend Engineer, you will craft pixel-perfect, secure, and lightning-fast checkout flows, merchant dashboards, and banking apps.

We value engineering craftsmanship, accessibility, and high performance.`,
    responsibilities: [
      'Build accessible, responsive UI components using React, TypeScript, and Tailwind CSS.',
      'Optimize web checkout SDK to load under 1 second on low-bandwidth 3G mobile networks.',
      'Collaborate with product designers to implement interactive design system components.',
      'Write comprehensive unit tests with Jest and end-to-end tests with Playwright.'
    ],
    requirements: [
      'Strong mastery of JavaScript (ES6+), DOM APIs, CSS Flexbox/Grid, and React.',
      'Solid experience with TypeScript and client state management (Zustand, React Query, or Redux).',
      'Portfolio of impressive personal frontend projects, open-source work, or previous internships.',
      'Deep appreciation for UX micro-interactions and performance metrics.'
    ],
    perks: [
      '100% remote-first policy with co-working space pass options.',
      'Home office setup allowance and annual learning & conference budget.',
      'Premium health insurance for family with mental wellness coverage.',
      'Stock options (ESOPs) with transparent vesting schedule.'
    ],
    applyUrl: 'https://razorpay.com/jobs/',
    allowDirectApply: true,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Associate Backend Engineer (Go / Node.js)',
    company: 'Swiggy',
    companyLogo: '',
    companyWebsite: 'https://www.swiggy.com/',
    jobType: 'Full-time',
    workplaceType: 'Hybrid',
    location: 'Bengaluru, Karnataka, India',
    experienceLevel: 'Fresher (0-1 Years)',
    eligibleBatches: ['2024', '2025'],
    salary: '₹14 - ₹20 LPA',
    category: 'Backend',
    skills: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Microservices'],
    description: `Swiggy is India’s leading on-demand convenience platform. Our distributed backend services handle tens of millions of concurrent requests every day, coordinating hyper-local deliveries across 500+ cities.

You will design scalable APIs, optimize relational/NoSQL databases, and build event-driven microservices that run with sub-millisecond response times.`,
    responsibilities: [
      'Design and implement microservices in Go or Node.js handling high-concurrency order placement.',
      'Optimize database queries in PostgreSQL and write efficient caching layers in Redis.',
      'Integrate message queues using Apache Kafka for real-time asynchronous notifications.',
      'Debug production logs, set up Prometheus/Grafana alerts, and ensure 99.99% system uptime.'
    ],
    requirements: [
      'Strong programming proficiency in Golang, Node.js, or Java.',
      'Sound understanding of RESTful API design, database normalization, and indexing.',
      'Solid grasp of concurrency, goroutines/event loops, and multi-threading.',
      'Bachelor’s in Engineering (CSE/IT/ECE) with 0-1 years of software development experience.'
    ],
    perks: [
      'Flexible hybrid work model and Swiggy food discounts.',
      'Annual equity grant and performance bonus incentives.',
      'Medical insurance for parents and cashless OPD coverage.',
      'Gym membership and wellness credits.'
    ],
    applyUrl: 'https://careers.swiggy.com/',
    allowDirectApply: true,
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Cloud & DevOps Support Associate',
    company: 'Amazon Web Services (AWS)',
    companyLogo: '',
    companyWebsite: 'https://aws.amazon.com/',
    jobType: 'Full-time',
    workplaceType: 'Hybrid',
    location: 'Hyderabad / Bengaluru, India',
    experienceLevel: 'Fresher (0-1 Years)',
    eligibleBatches: ['2024', '2025'],
    salary: '₹13 - ₹19 LPA',
    category: 'DevOps & Cloud',
    skills: ['Linux', 'Networking', 'AWS (EC2, S3, VPC)', 'Bash', 'Docker', 'Python'],
    description: `As a Cloud Support Associate at AWS, you will be the premier technical contact for enterprise customers deploying their mission-critical workloads on Amazon Web Services.

You will troubleshoot complex distributed architecture challenges, optimize cloud infrastructure, and write automation scripts to streamline cloud reliability.`,
    responsibilities: [
      'Diagnose and troubleshoot architecture, networking, and virtualization issues on AWS.',
      'Automate repetitive operational tasks using Python and Bash scripting.',
      'Replicate customer technical issues in sandbox environments and communicate solutions.',
      'Write technical knowledge-base articles and contribute to AWS documentation.'
    ],
    requirements: [
      'Degree in Computer Science, Information Technology, Electronics, or equivalent experience.',
      'In-depth knowledge of Linux system internals, systemd, and Bash scripting.',
      'Solid understanding of networking: TCP/IP, DNS, HTTP/S, SSL/TLS, and routing tables.',
      'AWS Cloud Practitioner or Solutions Architect Associate certification is a plus.'
    ],
    perks: [
      'Amazon Restricted Stock Units (RSUs) and comprehensive health insurance.',
      'Free AWS certification exam vouchers and cloud learning credits.',
      'Shift allowance and transport facilities.',
      'World-class global career mobility within Amazon.'
    ],
    applyUrl: 'https://amazon.jobs/',
    allowDirectApply: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Data Analyst Intern (Product & Growth)',
    company: 'Cred',
    companyLogo: '',
    companyWebsite: 'https://cred.club/',
    jobType: 'Internship',
    workplaceType: 'On-site',
    location: 'Bengaluru, Karnataka, India',
    experienceLevel: 'Internship / College Student',
    eligibleBatches: ['2025', '2026'],
    salary: '₹50,000 - ₹70,000 / month',
    category: 'Data Science & Analytics',
    skills: ['SQL', 'Python', 'Pandas', 'Power BI / Tableau', 'A/B Testing', 'Statistics'],
    description: `CRED is a members-only club that rewards individuals for their financial trustworthiness. Our Product Analytics team uncovers insights that drive user retention, credit card payment behavior, and rewards engagement.

You will write advanced SQL queries, design automated dashboards, and run statistical hypotheses that influence product decisions.`,
    responsibilities: [
      'Write complex analytical SQL queries, CTEs, and window functions on snowflake/BigQuery.',
      'Build automated visualization dashboards in Tableau and Metabase for product teams.',
      'Design and analyze A/B experiments to measure feature adoption and transaction volume.',
      'Perform cohort analysis and funnel drop-off studies to improve conversion metrics.'
    ],
    requirements: [
      'Mastery of SQL queries, joins, aggregations, and window functions.',
      'Proficiency in Python (Pandas, NumPy, Matplotlib) for data exploration.',
      'Strong analytical intuition and knowledge of descriptive and inferential statistics.',
      'Curiosity for consumer psychology, fintech, and product growth.'
    ],
    perks: [
      'High monthly stipend with all meals and barista coffee on house.',
      'Work alongside top product managers, designers, and ex-founders.',
      'Coolest office campus in Indiranagar, Bengaluru.',
      'Full-time PPO opportunities with attractive ESOP packages.'
    ],
    applyUrl: 'https://cred.club/careers',
    allowDirectApply: true,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Full Stack Developer - Fresher',
    company: 'Zerodha',
    companyLogo: '',
    companyWebsite: 'https://zerodha.com/',
    jobType: 'Full-time',
    workplaceType: 'Remote',
    location: 'Remote (India)',
    experienceLevel: 'Fresher (0-1 Years)',
    eligibleBatches: ['2024', '2025', '2026'],
    salary: '₹12 - ₹20 LPA',
    category: 'Software Engineering',
    skills: ['Python', 'Go', 'React', 'Vue', 'PostgreSQL', 'Redis', 'WebSockets'],
    description: `Zerodha is India’s largest retail stockbroker, processing billions of daily transactions with an ultra-lean, open-source-first engineering team.

We believe in writing simple, elegant, high-performance code without unnecessary bloat. If you love building fast web interfaces, reliable microservices, and contributing to open-source software, Zerodha is the place for you.`,
    responsibilities: [
      'Build performant frontend interfaces and real-time streaming order books.',
      'Develop backend services in Python, Go, or Node that interface with financial exchanges.',
      'Maintain high availability and audit trail accuracy across financial ledgers.',
      'Contribute to open-source tools and internal engineering libraries.'
    ],
    requirements: [
      'Passionate about writing clean, readable, dependency-light code.',
      'Strong understanding of web fundamentals, HTTP, WebSockets, and state management.',
      'Proficiency with Python, Go, or JavaScript/TypeScript.',
      'Public GitHub repository or personal projects demonstrating real craftsmanship.'
    ],
    perks: [
      '100% remote working freedom with zero bureaucracy.',
      'Generous profit-sharing bonus and comprehensive healthcare.',
      'Generous annual gadget stipend and book purchase allowance.',
      'No micromanagement — immense ownership of products from day one.'
    ],
    applyUrl: 'https://zerodha.tech/',
    allowDirectApply: true,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notesx';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Job Seeding...');

    // Find an admin user to link as poster
    const adminUser = await User.findOne({ role: 'admin' });
    const posterId = adminUser ? adminUser._id : null;

    for (const j of jobsData) {
      await Job.findOneAndUpdate(
        { title: j.title, company: j.company },
        { ...j, postedBy: posterId },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ Seeded Job: ${j.title} @ ${j.company}`);
    }

    console.log(`\n🎉 Successfully seeded ${jobsData.length} verified fresher & internship opportunities!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed jobs:', err);
    process.exit(1);
  }
}

seed();
