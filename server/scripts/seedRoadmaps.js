const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const Roadmap = require('../models/Roadmap');

const roadmapsData = [
  {
    slug: 'ai-ml-engineer',
    title: 'Artificial Intelligence & Machine Learning',
    subtitle: 'From Mathematics & Python to LLMs, PyTorch, RAG & Production MLOps',
    description: 'Master the end-to-end journey of an AI/ML Engineer. Learn mathematical foundations, classical machine learning with Scikit-learn, deep learning with PyTorch, transformers & generative AI, and deploying scalable models to production.',
    category: 'AI & Data Science',
    difficulty: 'Intermediate',
    estimatedDuration: '5-7 Months',
    icon: 'BrainCircuit',
    color: 'from-purple-600 via-indigo-600 to-blue-600',
    tags: ['Python', 'PyTorch', 'Mathematics', 'Deep Learning', 'LLMs', 'MLOps', 'Transformers'],
    careerPaths: ['Machine Learning Engineer', 'AI Research Scientist', 'GenAI Application Developer', 'Data Scientist'],
    salaryRange: '₹12 LPA - ₹35+ LPA',
    prerequisites: ['Basic Python programming', 'High-school calculus & linear algebra'],
    featured: true,
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: Mathematical Foundations & Python for Data Science',
        description: 'Establish the core mathematical intuition and data wrangling capabilities required for ML.',
        level: 'Fundamentals',
        nodes: [
          {
            id: 'node-linear-algebra',
            title: 'Linear Algebra & Matrix Operations',
            description: 'Vectors, matrices, dot products, eigenvalues, eigenvectors, matrix factorization (SVD), and geometric transformations in high-dimensional space.',
            importance: 'Crucial',
            skills: ['Matrix Multiplication', 'Eigenvalues & Eigenvectors', 'Singular Value Decomposition (SVD)', 'Vector Spaces'],
            resources: [
              { title: '3Blue1Brown - Essence of Linear Algebra', type: 'Video', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', isFree: true },
              { title: 'MIT 18.06 Linear Algebra by Gilbert Strang', type: 'Course', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/', isFree: true }
            ],
            projects: [
              { title: 'Image Compression using SVD', description: 'Compress and reconstruct high-resolution images by retaining top k singular values using pure NumPy.', difficulty: 'Beginner', techStack: ['Python', 'NumPy', 'Matplotlib'] }
            ]
          },
          {
            id: 'node-calculus-stats',
            title: 'Multivariate Calculus, Probability & Statistics',
            description: 'Partial derivatives, gradients, chain rule, Hessian matrix, probability distributions, Bayes theorem, expectation, variance, and hypothesis testing.',
            importance: 'Crucial',
            skills: ['Gradient Calculation', 'Chain Rule', 'Probability Distributions', 'Bayes Theorem', 'Maximum Likelihood Estimation'],
            resources: [
              { title: 'Khan Academy Multivariable Calculus', type: 'Course', url: 'https://www.khanacademy.org/math/multivariable-calculus', isFree: true },
              { title: 'StatQuest with Josh Starmer', type: 'Video', url: 'https://statquest.org/', isFree: true }
            ],
            projects: [
              { title: 'Gradient Descent Visualizer', description: 'Implement 2D and 3D gradient descent optimization algorithms from scratch without ML libraries.', difficulty: 'Beginner', techStack: ['Python', 'NumPy', 'Plotly'] }
            ]
          },
          {
            id: 'node-numpy-pandas',
            title: 'NumPy, Pandas & Data Manipulation',
            description: 'Vectorized computing with NumPy broadcasting, slicing, Pandas DataFrames, handling missing values, aggregations, merging, and exploratory data analysis (EDA).',
            importance: 'Crucial',
            skills: ['NumPy Broadcasting', 'Pandas GroupBy & Aggregations', 'Vectorized Operations', 'Data Cleaning'],
            resources: [
              { title: 'Official NumPy Documentation', type: 'Documentation', url: 'https://numpy.org/doc/stable/', isFree: true },
              { title: '10 Minutes to Pandas', type: 'Documentation', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', isFree: true }
            ],
            projects: [
              { title: 'Comprehensive Real Estate EDA & Insights Dashboard', description: 'Analyze housing market datasets, clean missing data, detect outliers, and generate distribution visualizations.', difficulty: 'Beginner', techStack: ['Pandas', 'NumPy', 'Seaborn'] }
            ]
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'Stage 2: Classical Machine Learning & Feature Engineering',
        description: 'Master supervised, unsupervised algorithms, model evaluation, and feature engineering.',
        level: 'Core Engineering',
        nodes: [
          {
            id: 'node-supervised-learning',
            title: 'Supervised Learning Algorithms',
            description: 'Linear & Logistic Regression, Decision Trees, Random Forests, Support Vector Machines (SVM), and Gradient Boosted Trees (XGBoost, LightGBM).',
            importance: 'Crucial',
            skills: ['Linear/Logistic Regression', 'Decision Trees & Ensembles', 'XGBoost', 'Loss Functions & Regularization (L1/L2)'],
            resources: [
              { title: 'Scikit-Learn Machine Learning in Python', type: 'Documentation', url: 'https://scikit-learn.org/stable/', isFree: true },
              { title: 'Andrew Ng Machine Learning Specialization', type: 'Course', url: 'https://www.coursera.org/specializations/machine-learning-introduction', isFree: true }
            ],
            projects: [
              { title: 'End-to-End Loan Default Prediction System', description: 'Build an end-to-end classification pipeline with feature scaling, hyperparameter tuning via Optuna, and ROC-AUC evaluation.', difficulty: 'Intermediate', techStack: ['Scikit-Learn', 'XGBoost', 'Optuna'] }
            ]
          },
          {
            id: 'node-unsupervised-eval',
            title: 'Unsupervised Learning & Model Evaluation Metrics',
            description: 'K-Means clustering, Hierarchical clustering, PCA, t-SNE, Cross-validation (K-Fold), Precision/Recall, F1-score, Confusion Matrix, and Bias-Variance tradeoff.',
            importance: 'Crucial',
            skills: ['K-Means & DBSCAN', 'PCA Dimensionality Reduction', 'Stratified K-Fold', 'Precision-Recall Curves'],
            resources: [
              { title: 'Cross-Validation & Metrics in Scikit-Learn', type: 'Documentation', url: 'https://scikit-learn.org/stable/modules/cross_validation.html', isFree: true }
            ],
            projects: [
              { title: 'Customer Segmentation with PCA & K-Means', description: 'Cluster e-commerce consumers based on purchase history and visualize segmentation clusters in reduced 2D/3D space.', difficulty: 'Intermediate', techStack: ['Scikit-Learn', 'PCA', 'Matplotlib'] }
            ]
          }
        ]
      },
      {
        id: 'stage-3',
        title: 'Stage 3: Deep Learning & Neural Architectures with PyTorch',
        description: 'Understand artificial neural networks, backpropagation, convolutional networks, and sequence models using PyTorch.',
        level: 'Advanced',
        nodes: [
          {
            id: 'node-neural-networks-pytorch',
            title: 'Deep Neural Networks & PyTorch Fundamentals',
            description: 'Perceptrons, Multilayer Perceptrons (MLPs), activation functions (ReLU, GELU), backpropagation derivation, optimizers (AdamW, SGD with momentum), and PyTorch Tensors & Autograd.',
            importance: 'Crucial',
            skills: ['PyTorch nn.Module', 'Autograd & Backpropagation', 'Activation Functions', 'Optimizers & Learning Rate Schedulers'],
            resources: [
              { title: 'PyTorch Official 60-Minute Blitz', type: 'Documentation', url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html', isFree: true },
              { title: 'Fast.ai Practical Deep Learning for Coders', type: 'Course', url: 'https://course.fast.ai/', isFree: true }
            ],
            projects: [
              { title: 'Handwritten Equation Solver from Scratch', description: 'Train an MLP and CNN using custom PyTorch datasets and DataLoader with tensorboard monitoring.', difficulty: 'Intermediate', techStack: ['PyTorch', 'Torchvision', 'TensorBoard'] }
            ]
          },
          {
            id: 'node-cnn-cv',
            title: 'Computer Vision & Convolutional Neural Networks (CNNs)',
            description: 'Convolution kernels, pooling, padding, ResNet architectures, transfer learning, data augmentation, object detection fundamentals (YOLO).',
            importance: 'Recommended',
            skills: ['Convolution Operations', 'ResNet & Residual Connections', 'Transfer Learning', 'Data Augmentation'],
            resources: [
              { title: 'Stanford CS231n: Deep Learning for Computer Vision', type: 'Course', url: 'http://cs231n.stanford.edu/', isFree: true }
            ],
            projects: [
              { title: 'Medical Skin Lesion Diagnostic Classifier', description: 'Fine-tune a pretrained ResNet-50 / EfficientNet on medical imaging data with Grad-CAM explainability heatmaps.', difficulty: 'Advanced', techStack: ['PyTorch', 'ResNet', 'Grad-CAM', 'OpenCV'] }
            ]
          }
        ]
      },
      {
        id: 'stage-4',
        title: 'Stage 4: Modern Generative AI, Transformers & RAG',
        description: 'Master attention mechanisms, transformer architectures, large language models, vector databases, and Retrieval-Augmented Generation.',
        level: 'State of the Art',
        nodes: [
          {
            id: 'node-transformers-llms',
            title: 'Transformers & Large Language Models (LLMs)',
            description: 'Self-attention, multi-head attention, positional encoding, BERT vs GPT architecture, tokenization (BPE), Hugging Face Transformers library, and parameter-efficient fine-tuning (LoRA / QLoRA).',
            importance: 'Crucial',
            skills: ['Self-Attention Mechanism', 'Hugging Face Transformers', 'Tokenization', 'LoRA & PEFT Fine-Tuning'],
            resources: [
              { title: 'Attention Is All You Need Paper Walkthrough', type: 'Video', url: 'https://www.youtube.com/watch?v=iDulhoQ2pro', isFree: true },
              { title: 'Hugging Face NLP Course', type: 'Course', url: 'https://huggingface.co/learn/nlp-course', isFree: true }
            ],
            projects: [
              { title: 'Domain-Specific LLM Fine-Tuning with QLoRA', description: 'Fine-tune an open-weights model (Llama-3 or Mistral-7B) on custom medical or technical documentation.', difficulty: 'Advanced', techStack: ['PyTorch', 'Hugging Face', 'BitsAndBytes', 'PEFT'] }
            ]
          },
          {
            id: 'node-rag-vector-db',
            title: 'Retrieval-Augmented Generation (RAG) & Vector Databases',
            description: 'Embedding models, vector search, Cosine similarity, Vector databases (Pinecone, ChromaDB, Qdrant), hybrid search, chunking strategies, and LangChain/LlamaIndex pipelines.',
            importance: 'Crucial',
            skills: ['Vector Embeddings', 'ChromaDB / Pinecone', 'Semantic Chunking', 'Hybrid Search & Reranking', 'LangChain / LlamaIndex'],
            resources: [
              { title: 'Pinecone Vector Database Architecture Guide', type: 'Article', url: 'https://www.pinecone.io/learn/vector-database/', isFree: true },
              { title: 'DeepLearning.AI - Building Systems with the ChatGPT API', type: 'Course', url: 'https://www.deeplearning.ai/', isFree: true }
            ],
            projects: [
              { title: 'Enterprise Codebase & Documentation RAG Agent', description: 'Build a multi-document RAG assistant with semantic caching, metadata filtering, and citation verification.', difficulty: 'Advanced', techStack: ['Python', 'FastAPI', 'ChromaDB', 'LangChain', 'OpenAI/Gemini API'] }
            ]
          }
        ]
      },
      {
        id: 'stage-5',
        title: 'Stage 5: Production MLOps, Model Serving & Deployment',
        description: 'Take models from Jupyter notebooks into production with high-throughput inference APIs, Docker, and observability.',
        level: 'Production',
        nodes: [
          {
            id: 'node-serving-docker',
            title: 'Model Serving with FastAPI, ONNX & Docker',
            description: 'High-throughput async inference endpoints using FastAPI, ONNX runtime optimization, model quantization, containerization with Docker, and GPU acceleration.',
            importance: 'Crucial',
            skills: ['FastAPI Asynchronous Serving', 'ONNX Runtime Optimization', 'Docker Containerization', 'Model Quantization (INT8/FP16)'],
            resources: [
              { title: 'FastAPI High Performance Web API Framework', type: 'Documentation', url: 'https://fastapi.tiangolo.com/', isFree: true },
              { title: 'ONNX Runtime Documentation', type: 'Documentation', url: 'https://onnxruntime.ai/', isFree: true }
            ],
            projects: [
              { title: 'Production Real-time ML Inference Microservice', description: 'Dockerized microservice serving quantized models with Redis request caching, prometheus metrics, and batching.', difficulty: 'Advanced', techStack: ['FastAPI', 'Docker', 'Redis', 'ONNX', 'Prometheus'] }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    subtitle: 'HTML5, Modern CSS, TypeScript, React 19, Next.js & Web Performance',
    description: 'Master the art of building responsive, accessible, high-performance web applications. Covers modern JavaScript/TypeScript, React architecture, Next.js server components, styling ecosystems, and web vitals optimization.',
    category: 'Web Development',
    difficulty: 'Beginner Friendly',
    estimatedDuration: '4-6 Months',
    icon: 'Layout',
    color: 'from-blue-600 via-cyan-500 to-teal-500',
    tags: ['HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Vite'],
    careerPaths: ['Frontend Engineer', 'UI/UX Engineer', 'React Developer', 'Full Stack Engineer'],
    salaryRange: '₹7 LPA - ₹28+ LPA',
    prerequisites: ['Basic computer literacy', 'Desire to build visually appealing digital products'],
    featured: true,
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: Web Foundations & Semantic Architecture',
        description: 'Understand how the browser renders web pages, HTML5 semantic elements, and modern CSS layout engines.',
        level: 'Fundamentals',
        nodes: [
          {
            id: 'node-html5-semantic',
            title: 'Semantic HTML5 & Accessibility (a11y)',
            description: 'Semantic tags (article, section, nav, header), ARIA roles, accessible forms, keyboard navigation, tap targets, and WCAG compliance.',
            importance: 'Crucial',
            skills: ['Semantic Markup', 'ARIA Attributes', 'Screen Reader Accessibility', 'Keyboard Navigation'],
            resources: [
              { title: 'MDN Web Docs: HTML Semantics', type: 'Documentation', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics', isFree: true },
              { title: 'web.dev Accessibility Guide', type: 'Article', url: 'https://web.dev/learn/accessibility/', isFree: true }
            ],
            projects: [
              { title: 'Fully Accessible University Portal Landing Page', description: 'Build an accessible, responsive portal passing WCAG AA standard with zero lighthouse accessibility errors.', difficulty: 'Beginner', techStack: ['HTML5', 'CSS3'] }
            ]
          },
          {
            id: 'node-css3-layouts',
            title: 'Modern CSS3: Flexbox, Grid & Responsive Design',
            description: 'CSS box model, specificity, Flexbox alignment, CSS Grid 2D layouts, media queries, CSS variables, transitions, and modern animations.',
            importance: 'Crucial',
            skills: ['CSS Flexbox', 'CSS Grid', 'Media Queries & Breakpoints', 'CSS Custom Properties (Variables)', 'Keyframe Animations'],
            resources: [
              { title: 'A Complete Guide to Flexbox (CSS-Tricks)', type: 'Article', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', isFree: true },
              { title: 'A Complete Guide to CSS Grid', type: 'Article', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', isFree: true }
            ],
            projects: [
              { title: 'Responsive E-Commerce Catalog Grid with Filters', description: 'Create an e-commerce layout that smoothly adapts from mobile 1-column to desktop 4-column responsive grid with animated filters.', difficulty: 'Beginner', techStack: ['HTML5', 'Modern CSS3'] }
            ]
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'Stage 2: Modern JavaScript (ES6+) & TypeScript',
        description: 'Master asynchronous programming, the event loop, closures, DOM manipulation, and static typing with TypeScript.',
        level: 'Core Programming',
        nodes: [
          {
            id: 'node-js-core',
            title: 'JavaScript Deep Dive & Asynchronous Mechanics',
            description: 'Scopes, closures, execution context, prototypes, promises, async/await, fetch API, event bubbling/capturing, and the browser event loop (microtasks vs macrotasks).',
            importance: 'Crucial',
            skills: ['Promises & Async/Await', 'Closures & Scopes', 'Event Loop & Concurrency', 'Array Methods (map, filter, reduce)', 'DOM Manipulation'],
            resources: [
              { title: 'JavaScript.info - The Modern JavaScript Tutorial', type: 'Documentation', url: 'https://javascript.info/', isFree: true },
              { title: 'You Don\'t Know JS (Book Series)', type: 'Book', url: 'https://github.com/getify/You-Dont-Know-JS', isFree: true }
            ],
            projects: [
              { title: 'Real-time Stock & Crypto Market Tracker', description: 'Fetch live market prices via WebSocket/REST, calculate rolling metrics, and render interactive Canvas/SVG charts without external libraries.', difficulty: 'Intermediate', techStack: ['Vanilla JavaScript', 'WebSockets', 'Chart.js'] }
            ]
          },
          {
            id: 'node-typescript',
            title: 'TypeScript for Scalable Applications',
            description: 'Type annotations, interfaces, types vs interfaces, generics, utility types (Pick, Omit, Partial), union & intersection types, and tsconfig optimization.',
            importance: 'Crucial',
            skills: ['Interfaces & Type Aliases', 'Generics', 'Utility Types', 'Strict Type Checking', 'TypeScript with DOM APIs'],
            resources: [
              { title: 'Official TypeScript Handbook', type: 'Documentation', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', isFree: true },
              { title: 'Matt Pocock - Total TypeScript Tutorials', type: 'Video', url: 'https://www.totaltypescript.com/', isFree: true }
            ],
            projects: [
              { title: 'Type-Safe Task Management Kanban Engine', description: 'Build an interactive Kanban board with strict drag-and-drop state validation and immutable operations.', difficulty: 'Intermediate', techStack: ['TypeScript', 'HTML5 Drag & Drop'] }
            ]
          }
        ]
      },
      {
        id: 'stage-3',
        title: 'Stage 3: React 19 Ecosystem & State Management',
        description: 'Master component architecture, hooks, rendering lifecycle, performance tuning, and global state.',
        level: 'Framework Mastery',
        nodes: [
          {
            id: 'node-react-core',
            title: 'React Components, Hooks & Architecture',
            description: 'JSX, component decomposition, props, useState, useEffect, useMemo, useCallback, useRef, custom hooks, and React 19 features (use, actions).',
            importance: 'Crucial',
            skills: ['Custom Hooks', 'Re-render Optimization', 'useMemo & useCallback', 'useRef & DOM Access', 'Context API'],
            resources: [
              { title: 'Official React Documentation (react.dev)', type: 'Documentation', url: 'https://react.dev/', isFree: true }
            ],
            projects: [
              { title: 'Music Streaming Web Player with Visualizer', description: 'Build a Spotify-like web player with audio API integration, play queue management, persistent playback, and custom slider hooks.', difficulty: 'Intermediate', techStack: ['React', 'TypeScript', 'Web Audio API', 'Tailwind CSS'] }
            ]
          },
          {
            id: 'node-state-styling',
            title: 'State Management & Tailwind CSS Ecosystem',
            description: 'Zustand, TanStack Query (React Query) for server state caching, Tailwind CSS utility-first workflow, Radix UI primitives, and Lucide icons.',
            importance: 'Crucial',
            skills: ['Zustand State Stores', 'TanStack Query (React Query)', 'Tailwind CSS', 'Accessible Component Primitives (Radix/Headless UI)'],
            resources: [
              { title: 'Tailwind CSS Official Documentation', type: 'Documentation', url: 'https://tailwindcss.com/docs', isFree: true },
              { title: 'TanStack Query (React Query) Guides', type: 'Documentation', url: 'https://tanstack.com/query/latest', isFree: true }
            ],
            projects: [
              { title: 'SaaS Analytics Dashboard with Infinite Queries', description: 'Build a data-dense analytics suite with cached queries, optimistic mutations, skeleton loaders, and dark mode toggling.', difficulty: 'Advanced', techStack: ['React', 'Zustand', 'TanStack Query', 'Tailwind CSS'] }
            ]
          }
        ]
      },
      {
        id: 'stage-4',
        title: 'Stage 4: Next.js Full Stack & Production Performance',
        description: 'Server-Side Rendering (SSR), Server Components (RSC), App Router, SEO, and Core Web Vitals.',
        level: 'Production',
        nodes: [
          {
            id: 'node-nextjs-rsc',
            title: 'Next.js App Router & Server Components',
            description: 'Server Components vs Client Components, nested layouts, Server Actions, Dynamic routing, API routes, middleware, and incremental static regeneration (ISR).',
            importance: 'Crucial',
            skills: ['React Server Components (RSC)', 'Server Actions', 'Dynamic Routing', 'Image & Font Optimization', 'Edge Middleware'],
            resources: [
              { title: 'Next.js Official Learn Course', type: 'Course', url: 'https://nextjs.org/learn', isFree: true }
            ],
            projects: [
              { title: 'Modern Dev Community Platform with SSR & Markdown', description: 'Develop an engineering blog and discussion forum with server-rendered articles, syntax highlighting, and server action upvotes.', difficulty: 'Advanced', techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Prisma/PostgreSQL'] }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    subtitle: 'Node.js, Go/Python, Relational & NoSQL Databases, System Design & APIs',
    description: 'Build robust, highly scalable server-side systems. Learn API design (REST/GraphQL/gRPC), relational and NoSQL databases, caching, authentication security, microservices architecture, and cloud deployment.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    estimatedDuration: '5-7 Months',
    icon: 'Server',
    color: 'from-emerald-600 via-teal-600 to-cyan-600',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'System Design'],
    careerPaths: ['Backend Engineer', 'API Architect', 'Distributed Systems Engineer', 'Software Development Engineer (SDE)'],
    salaryRange: '₹8 LPA - ₹32+ LPA',
    prerequisites: ['Basic programming logic in JavaScript, Python, or Java'],
    featured: true,
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: Server Runtimes, APIs & Protocols',
        description: 'Understand HTTP protocols, RESTful guidelines, asynchronous I/O, and server architectures.',
        level: 'Fundamentals',
        nodes: [
          {
            id: 'node-http-rest',
            title: 'HTTP/HTTPS Protocols & RESTful API Design',
            description: 'HTTP methods, status codes, headers, cookies, sessions, query params, pagination, idempotent operations, and OpenAPI/Swagger documentation.',
            importance: 'Crucial',
            skills: ['HTTP Request/Response Lifecycle', 'REST Principles', 'Status Codes & Headers', 'API Versioning & Documentation'],
            resources: [
              { title: 'MDN HTTP Overview', type: 'Documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', isFree: true },
              { title: 'RESTful API Design Best Practices', type: 'Article', url: 'https://restfulapi.net/', isFree: true }
            ],
            projects: [
              { title: 'RESTful Course Enrollment & Grade Management API', description: 'Develop a clean REST API with filtering, pagination, request validation, and comprehensive Swagger OpenAPI docs.', difficulty: 'Beginner', techStack: ['Node.js', 'Express', 'Swagger'] }
            ]
          },
          {
            id: 'node-nodejs-architecture',
            title: 'Node.js Runtime & Event-Driven Architecture',
            description: 'V8 engine, Libuv event loop, worker threads, streams, buffers, file system operations, and error handling middleware.',
            importance: 'Crucial',
            skills: ['Event Loop & Libuv', 'Node.js Streams & Buffers', 'Express Middleware Pipeline', 'Clustering & Child Processes'],
            resources: [
              { title: 'Node.js Official Documentation', type: 'Documentation', url: 'https://nodejs.org/docs/latest/api/', isFree: true }
            ],
            projects: [
              { title: 'High-Concurrency File Chunk Uploader & Streaming API', description: 'Stream multi-gigabyte video files with pause/resume support and chunked storage without exhausting server RAM.', difficulty: 'Intermediate', techStack: ['Node.js', 'Express', 'Multer', 'Streams'] }
            ]
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'Stage 2: Relational Databases, NoSQL & Query Optimization',
        description: 'Design normalized schemas, master SQL queries, ACID transactions, and NoSQL document stores.',
        level: 'Database Engineering',
        nodes: [
          {
            id: 'node-postgresql-sql',
            title: 'Relational Databases (PostgreSQL / MySQL)',
            description: 'DDL/DML, Primary/Foreign keys, Normalization (1NF to BCNF), Joins, Indexes (B-Tree, GIN, Hash), EXPLAIN ANALYZE query profiling, and ACID transactions.',
            importance: 'Crucial',
            skills: ['Advanced SQL Joins & Subqueries', 'Indexing Strategies (B-Trees)', 'ACID Transactions & Isolation Levels', 'Connection Pooling'],
            resources: [
              { title: 'PostgreSQL Official Tutorial', type: 'Documentation', url: 'https://www.postgresql.org/docs/current/tutorial.html', isFree: true },
              { title: 'Use The Index, Luke! A Guide to Database Performance', type: 'Book', url: 'https://use-the-index-luke.com/', isFree: true }
            ],
            projects: [
              { title: 'Banking Transaction Engine with Concurrent Isolation', description: 'Design a financial ledger enforcing strict atomic balance deductions, deadlock avoidance, and row-level locking.', difficulty: 'Advanced', techStack: ['PostgreSQL', 'Node.js/Prisma', 'Docker'] }
            ]
          },
          {
            id: 'node-mongodb-nosql',
            title: 'NoSQL & Document Databases (MongoDB)',
            description: 'Document models, embedded vs referenced relations, Aggregation pipeline (match, group, lookup, unwind), compound indexes, and Mongoose ORM.',
            importance: 'Recommended',
            skills: ['MongoDB Aggregation Framework', 'Compound & TTL Indexes', 'Schema Design Patterns', 'Sharding & Replication Concepts'],
            resources: [
              { title: 'MongoDB University Courses', type: 'Course', url: 'https://learn.mongodb.com/', isFree: true }
            ],
            projects: [
              { title: 'Real-time Social Activity Feed with Aggregations', description: 'Create a social feed with complex multi-stage aggregations for user mentions, hashtags, and followers.', difficulty: 'Intermediate', techStack: ['MongoDB', 'Mongoose', 'Express'] }
            ]
          }
        ]
      },
      {
        id: 'stage-3',
        title: 'Stage 3: Authentication, Security & High-Performance Caching',
        description: 'Secure APIs with JWT/OAuth2 and accelerate database reads using Redis in-memory caching.',
        level: 'Security & Speed',
        nodes: [
          {
            id: 'node-auth-security',
            title: 'Authentication, Authorization & OWASP Security',
            description: 'JWT (Access & Refresh tokens), Password hashing (bcrypt/argon2), OAuth 2.0 / OpenID Connect, Role-Based Access Control (RBAC), CORS, CSRF, and Rate Limiting.',
            importance: 'Crucial',
            skills: ['JWT Refresh Token Rotation', 'OAuth 2.0 Social Login', 'RBAC Middleware', 'Rate Limiting (Token Bucket / Leaky Bucket)', 'OWASP Top 10 Mitigation'],
            resources: [
              { title: 'OWASP API Security Top 10', type: 'Article', url: 'https://owasp.org/www-project-api-security/', isFree: true }
            ],
            projects: [
              { title: 'Zero-Trust Enterprise Auth Gateway', description: 'Build an authentication microservice featuring device fingerprinting, refresh token rotation, and brute-force IP rate limiting.', difficulty: 'Advanced', techStack: ['Node.js', 'JWT', 'Redis', 'Bcrypt'] }
            ]
          },
          {
            id: 'node-redis-caching',
            title: 'In-Memory Data Stores & Redis Caching',
            description: 'Redis data structures (strings, hashes, lists, sets, sorted sets), Cache-Aside pattern, Write-Through, Cache invalidation strategies, and distributed locking.',
            importance: 'Crucial',
            skills: ['Cache Invalidation', 'Redis Sorted Sets (ZSET)', 'Distributed Locks (Redlock)', 'Pub/Sub Messaging'],
            resources: [
              { title: 'Redis University - Introduction to Redis Data Structures', type: 'Course', url: 'https://university.redis.com/', isFree: true }
            ],
            projects: [
              { title: 'Real-time Competitive Gaming Leaderboard', description: 'Maintain real-time rankings of 100,000+ players using Redis Sorted Sets with instant rank lookups in O(log N).', difficulty: 'Intermediate', techStack: ['Redis', 'Node.js', 'WebSockets'] }
            ]
          }
        ]
      },
      {
        id: 'stage-4',
        title: 'Stage 4: Distributed Systems & System Design',
        description: 'Scale architectures to millions of users with message queues, microservices, and load balancing.',
        level: 'High Scale Architecture',
        nodes: [
          {
            id: 'node-message-queues',
            title: 'Message Queues & Event-Driven Architecture (Kafka / RabbitMQ)',
            description: 'Asynchronous task workers, Producer-Consumer pattern, Message brokers (Kafka topics, partitions, consumer groups vs RabbitMQ exchanges), and dead-letter queues.',
            importance: 'Crucial',
            skills: ['Apache Kafka / RabbitMQ', 'Event-Driven Microservices', 'Idempotent Consumers', 'Dead Letter Queues (DLQ)'],
            resources: [
              { title: 'Confluent Kafka Fundamentals', type: 'Documentation', url: 'https://developer.confluent.io/', isFree: true }
            ],
            projects: [
              { title: 'Event-Driven Order Processing & Notification Pipeline', description: 'Decouple checkout, inventory deduction, payment processing, and email notifications using asynchronous event queues.', difficulty: 'Advanced', techStack: ['Node.js', 'RabbitMQ/Kafka', 'Docker', 'PostgreSQL'] }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: 'devops-cloud-engineer',
    title: 'DevOps & Cloud Engineer',
    subtitle: 'Linux, Docker, Kubernetes, CI/CD, Terraform & Cloud Architecture (AWS/GCP)',
    description: 'Learn how to automate, containerize, orchestrate, and monitor cloud-native infrastructure. Covers Linux sysadmin fundamentals, Docker containers, Kubernetes clusters, Infrastructure as Code, and CI/CD pipelines.',
    category: 'Cloud & DevOps',
    difficulty: 'Advanced',
    estimatedDuration: '5-8 Months',
    icon: 'Cloud',
    color: 'from-orange-500 via-amber-500 to-yellow-500',
    tags: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Monitoring'],
    careerPaths: ['DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Cloud Solutions Architect', 'Platform Engineer'],
    salaryRange: '₹10 LPA - ₹38+ LPA',
    prerequisites: ['Basic command line familiarity', 'Basic networking understanding'],
    featured: true,
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: Linux Administration, Bash & Computer Networking',
        description: 'Linux file system, permissions, systemd processes, SSH keys, TCP/IP, DNS, and reverse proxies.',
        level: 'System Fundamentals',
        nodes: [
          {
            id: 'node-linux-bash',
            title: 'Linux CLI, Permissions & Shell Scripting',
            description: 'Shell navigation, user permissions (chmod/chown), process monitoring (top, htop, systemctl), cron jobs, and Bash automation scripts.',
            importance: 'Crucial',
            skills: ['Bash Scripting', 'Linux Process Management', 'File Permissions & ACLs', 'SSH Key Authentication'],
            resources: [
              { title: 'Linux Journey - Free Interactive Guide', type: 'Course', url: 'https://linuxjourney.com/', isFree: true }
            ],
            projects: [
              { title: 'Automated Server Health & Log Rotation Daemon', description: 'Write a robust Bash utility that monitors disk/CPU usage, archives old logs, and triggers Slack alerts when thresholds breach.', difficulty: 'Beginner', techStack: ['Bash', 'Linux', 'Cron', 'cURL'] }
            ]
          },
          {
            id: 'node-networking-nginx',
            title: 'Networking Protocols & Nginx Reverse Proxy',
            description: 'DNS records (A, CNAME, MX), OSI model, TCP vs UDP, SSL/TLS certificates with Let\'s Encrypt, and configuring Nginx as a reverse proxy & load balancer.',
            importance: 'Crucial',
            skills: ['TCP/IP & DNS Configuration', 'SSL/TLS & Certbot', 'Nginx Reverse Proxy & SSL Termination', 'Load Balancing Algorithms'],
            resources: [
              { title: 'Nginx Beginner\'s Guide', type: 'Documentation', url: 'https://nginx.org/en/docs/beginners_guide.html', isFree: true }
            ],
            projects: [
              { title: 'High-Availability Reverse Proxy Cluster with SSL', description: 'Configure an Nginx reverse proxy with round-robin load balancing, rate limiting, and automated SSL certificate renewal.', difficulty: 'Intermediate', techStack: ['Nginx', 'OpenSSL', 'Certbot', 'Linux'] }
            ]
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'Stage 2: Containerization with Docker & Multi-Stage Builds',
        description: 'Master containerization concepts, Dockerfile optimization, multi-stage builds, and Docker Compose orchestration.',
        level: 'Containers',
        nodes: [
          {
            id: 'node-docker-mastery',
            title: 'Docker Architecture & Image Optimization',
            description: 'Images vs Containers, Dockerfile instructions, layer caching, multi-stage builds, volumes for persistence, bridge networks, and Docker Compose.',
            importance: 'Crucial',
            skills: ['Dockerfile Best Practices', 'Multi-Stage Builds', 'Docker Compose', 'Volume & Network Management'],
            resources: [
              { title: 'Docker Official Get Started Tutorial', type: 'Documentation', url: 'https://docs.docker.com/get-started/', isFree: true }
            ],
            projects: [
              { title: 'Multi-Service Containerized Web Stack', description: 'Containerize a React frontend, Node/Express API, Redis cache, and PostgreSQL DB with isolated networking and healthchecks.', difficulty: 'Intermediate', techStack: ['Docker', 'Docker Compose', 'Node.js', 'PostgreSQL'] }
            ]
          }
        ]
      },
      {
        id: 'stage-3',
        title: 'Stage 3: Kubernetes Orchestration & Cloud Infrastructure',
        description: 'Deploy, scale, and manage containerized applications across resilient Kubernetes clusters.',
        level: 'Cloud Native',
        nodes: [
          {
            id: 'node-kubernetes-k8s',
            title: 'Kubernetes (K8s) Cluster Architecture',
            description: 'Control plane vs worker nodes, Pods, Deployments, ReplicaSets, Services (ClusterIP, NodePort, LoadBalancer), ConfigMaps, Secrets, and Ingress controllers.',
            importance: 'Crucial',
            skills: ['Kubernetes Manifests (YAML)', 'Deployments & Rolling Updates', 'Ingress & Service Routing', 'PersistentVolumes (PV/PVC)'],
            resources: [
              { title: 'Kubernetes Official Documentation', type: 'Documentation', url: 'https://kubernetes.io/docs/home/', isFree: true },
              { title: 'KubeAcademy by VMware', type: 'Course', url: 'https://kube.academy/', isFree: true }
            ],
            projects: [
              { title: 'Zero-Downtime Microservices Deployment on Minikube/K8s', description: 'Deploy an auto-scaling application on Kubernetes with horizontal pod autoscaler (HPA), readiness probes, and ingress routing.', difficulty: 'Advanced', techStack: ['Kubernetes', 'Minikube', 'Helm', 'YAML'] }
            ]
          },
          {
            id: 'node-terraform-iac',
            title: 'Infrastructure as Code (IaC) with Terraform',
            description: 'Declarative cloud provisioning, providers, state management, remote backends (S3/DynamoDB), modules, and drift detection.',
            importance: 'Crucial',
            skills: ['Terraform HCL Syntax', 'State Management & Locking', 'Reusable Cloud Modules', 'Plan & Apply Workflows'],
            resources: [
              { title: 'HashiCorp Terraform Tutorials', type: 'Documentation', url: 'https://developer.hashicorp.com/terraform/tutorials', isFree: true }
            ],
            projects: [
              { title: 'Automated Multi-AZ AWS VPC & EKS Cluster via Terraform', description: 'Provision an entire production VPC with public/private subnets, NAT gateways, and an EKS cluster with 1 command.', difficulty: 'Advanced', techStack: ['Terraform', 'AWS', 'EKS'] }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: 'dsa-system-design',
    title: 'Data Structures, Algorithms & System Design',
    subtitle: 'From Big-O & Core LeetCode Patterns to High-Level Scalability for Top Product Companies',
    description: 'The proven blueprint for cracking technical interviews at Google, Microsoft, Amazon, and tier-1 product startups. Master algorithmic problem-solving patterns and high-scale distributed system design.',
    category: 'Core CS & Placement',
    difficulty: 'Intermediate',
    estimatedDuration: '4-6 Months',
    icon: 'Binary',
    color: 'from-rose-600 via-pink-600 to-purple-600',
    tags: ['DSA', 'LeetCode', 'System Design', 'Algorithms', 'High Level Design', 'Interview Prep'],
    careerPaths: ['Software Development Engineer (SDE 1 & 2)', 'Member of Technical Staff (MTS)', 'Systems Engineer'],
    salaryRange: '₹14 LPA - ₹45+ LPA',
    prerequisites: ['Proficiency in C++, Java, or Python'],
    featured: true,
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: Algorithmic Foundations & Core Linear Data Structures',
        description: 'Time & space complexity analysis (Big-O), Arrays, Strings, Two Pointers, and Sliding Window.',
        level: 'Core Patterns',
        nodes: [
          {
            id: 'node-big-o-arrays',
            title: 'Big-O Analysis, Two Pointers & Sliding Window',
            description: 'Time and space complexity proofs, prefix sums, two-pointer technique, fast and slow pointers, and dynamic-size sliding windows.',
            importance: 'Crucial',
            skills: ['Asymptotic Analysis (Big-O)', 'Two Pointers Technique', 'Sliding Window Pattern', 'Prefix Sums'],
            resources: [
              { title: 'NeetCode 150 - Curated Coding Patterns', type: 'Course', url: 'https://neetcode.io/practice', isFree: true }
            ],
            projects: [
              { title: 'Algorithmic Visualizer for Sorting & Search', description: 'Build an interactive web visualizer illustrating QuickSort, MergeSort, and Binary Search step-by-step.', difficulty: 'Beginner', techStack: ['JavaScript/React', 'Algorithms'] }
            ]
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'Stage 2: Trees, Graphs & Dynamic Programming',
        description: 'Recursion, Binary Search Trees, Graph traversals (BFS/DFS), Dijkstra, and memoization/tabulation.',
        level: 'Advanced Algorithms',
        nodes: [
          {
            id: 'node-trees-graphs',
            title: 'Binary Trees, BSTs & Graph Algorithms',
            description: 'Tree traversals (inorder, preorder, postorder, level-order), Lowest Common Ancestor (LCA), Graph BFS/DFS, Cycle detection, Topological sort, and Dijkstra\'s shortest path.',
            importance: 'Crucial',
            skills: ['BFS & DFS Traversals', 'Topological Sort (Kahn\'s Algorithm)', 'Dijkstra\'s Shortest Path', 'Disjoint Set Union (DSU)'],
            resources: [
              { title: 'Striver\'s SDE Sheet & Graph Series', type: 'Course', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', isFree: true }
            ],
            projects: [
              { title: 'Metro Route & Shortest Path Navigation Engine', description: 'Implement Dijkstra and A* pathfinding on a real-world city subway transit network with interchange penalties.', difficulty: 'Intermediate', techStack: ['C++/Java', 'Graph Algorithms'] }
            ]
          },
          {
            id: 'node-dynamic-programming',
            title: 'Dynamic Programming (1D, 2D & Knapsack Patterns)',
            description: 'Overlapping subproblems, optimal substructure, 0/1 Knapsack, Longest Common Subsequence (LCS), Longest Increasing Subsequence (LIS), and DP on Trees.',
            importance: 'Crucial',
            skills: ['Memoization vs Tabulation', '0/1 Knapsack Pattern', 'LCS & Edit Distance', 'State Transition Formulation'],
            resources: [
              { title: 'MIT 6.006 Dynamic Programming Lectures by Erik Demaine', type: 'Video', url: 'https://www.youtube.com/playlist?list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb', isFree: true }
            ],
            projects: [
              { title: 'DNA Sequence Alignment Tool (Needleman-Wunsch Algorithm)', description: 'Implement genomic alignment using 2D dynamic programming with customizable gap and mismatch penalties.', difficulty: 'Advanced', techStack: ['Python', 'Dynamic Programming'] }
            ]
          }
        ]
      },
      {
        id: 'stage-3',
        title: 'Stage 3: High-Level System Design (HLD)',
        description: 'Design systems that scale to 10M+ users: Load balancing, Caching, Database sharding, CAP theorem, and Rate limiting.',
        level: 'Architecture',
        nodes: [
          {
            id: 'node-hld-principles',
            title: 'High-Level System Design & Architecture Patterns',
            description: 'CAP Theorem, horizontal vs vertical scaling, CDN, reverse proxies, database replication & consistent hashing, message queues, and API gateways.',
            importance: 'Crucial',
            skills: ['Consistent Hashing', 'Database Sharding & Read Replicas', 'CAP Theorem Tradeoffs', 'CDN & Edge Caching'],
            resources: [
              { title: 'System Design Primer by Donne Martin', type: 'GitHub', url: 'https://github.com/donnemartin/system-design-primer', isFree: true },
              { title: 'Designing Data-Intensive Applications (Book Summary)', type: 'Book', url: 'https://dataintensive.net/', isFree: false }
            ],
            projects: [
              { title: 'Design a Scalable URL Shortener (TinyURL) Architecture', description: 'Draw end-to-end architecture diagrams, calculate QPS, storage estimation, base62 encoding, and Redis caching layers.', difficulty: 'Advanced', techStack: ['System Architecture', 'Redis', 'PostgreSQL'] }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: 'cybersecurity-engineer',
    title: 'Cybersecurity & Ethical Hacking',
    subtitle: 'Network Security, Web Application Penetration Testing, Cryptography & SOC Operations',
    description: 'Learn how to secure digital infrastructure and identify vulnerabilities. Covers networking defenses, Linux privilege escalation, OWASP Top 10 web vulnerabilities, Burp Suite, cryptography, and digital forensics.',
    category: 'Cybersecurity',
    difficulty: 'Intermediate',
    estimatedDuration: '6-8 Months',
    icon: 'Shield',
    color: 'from-red-600 via-rose-600 to-amber-600',
    tags: ['Cybersecurity', 'Ethical Hacking', 'Penetration Testing', 'Network Security', 'Cryptography', 'Linux'],
    careerPaths: ['Security Analyst', 'Penetration Tester (Ethical Hacker)', 'SOC Analyst', 'Application Security Engineer'],
    salaryRange: '₹8 LPA - ₹30+ LPA',
    prerequisites: ['Understanding of computer networks (TCP/IP)', 'Linux command line basics'],
    featured: false,
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: Networking & Security Foundations',
        description: 'Wireshark packet analysis, port scanning, firewalls, and cryptographic protocols.',
        level: 'Fundamentals',
        nodes: [
          {
            id: 'node-network-sec',
            title: 'Network Analysis, Nmap & Wireshark',
            description: 'Packet inspection with Wireshark, active reconnaissance with Nmap, ARP spoofing detection, DNS poisoning, and firewall configuration (iptables/ufw).',
            importance: 'Crucial',
            skills: ['Wireshark Packet Analysis', 'Nmap Port Scanning', 'Firewall Rules Configuration', 'TCP Handshake & Flag Inspection'],
            resources: [
              { title: 'TryHackMe - Pre Security Pathway', type: 'Course', url: 'https://tryhackme.com/', isFree: true }
            ],
            projects: [
              { title: 'Intrusion Detection & Port Scan Detector', description: 'Build a Python packet sniffer using Scapy that flags suspicious SYN flood attacks and rapid port scanning.', difficulty: 'Intermediate', techStack: ['Python', 'Scapy', 'Networking'] }
            ]
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'Stage 2: Web Application Penetration Testing & OWASP Top 10',
        description: 'Exploit and defend against SQL Injection, XSS, CSRF, SSRF, and Broken Access Control.',
        level: 'Penetration Testing',
        nodes: [
          {
            id: 'node-web-pentest',
            title: 'OWASP Top 10 & Burp Suite Testing',
            description: 'HTTP request interception with Burp Suite, SQL Injection (Blind/Union), Cross-Site Scripting (Reflected/Stored/DOM), SSRF, and IDOR vulnerabilities.',
            importance: 'Crucial',
            skills: ['Burp Suite Proxy & Repeater', 'SQL Injection Testing & Remediation', 'XSS Exploitation & CSP', 'IDOR & Broken Access Control'],
            resources: [
              { title: 'PortSwigger Web Security Academy', type: 'Course', url: 'https://portswigger.net/web-security', isFree: true }
            ],
            projects: [
              { title: 'Vulnerable Lab Security Audit & Remediation Report', description: 'Perform an ethical penetration test on an intentionally vulnerable web application and generate a standard CVE-style remediation report.', difficulty: 'Advanced', techStack: ['Burp Suite', 'OWASP ZAP', 'SQLMap'] }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: 'data-engineer',
    title: 'Data Engineer',
    subtitle: 'SQL, Python, Apache Spark, Data Pipelines, Kafka, dbt & Cloud Data Warehouses',
    description: 'Transform raw data into trusted, analytics-ready pipelines at scale. Master distributed processing with PySpark, orchestration with Apache Airflow, streaming with Kafka, and modern cloud warehouses like Snowflake and BigQuery.',
    category: 'AI & Data Science',
    difficulty: 'Intermediate',
    estimatedDuration: '5-7 Months',
    icon: 'Database',
    color: 'from-amber-600 via-yellow-600 to-orange-600',
    tags: ['Data Engineering', 'SQL', 'PySpark', 'Airflow', 'Kafka', 'BigQuery', 'dbt'],
    careerPaths: ['Data Engineer', 'Big Data Developer', 'Analytics Engineer', 'Data Platform Engineer'],
    salaryRange: '₹9 LPA - ₹32+ LPA',
    prerequisites: ['Python basics', 'Basic SQL queries'],
    featured: false,
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: Advanced SQL & Data Modeling',
        description: 'Window functions, dimensional modeling (Star vs Snowflake schema), and query optimization.',
        level: 'Fundamentals',
        nodes: [
          {
            id: 'node-adv-sql',
            title: 'Advanced SQL & Dimensional Modeling',
            description: 'Window functions (ROW_NUMBER, RANK, LEAD, LAG), CTEs, Fact vs Dimension tables, Star schema design, and Slowly Changing Dimensions (SCD Type 1 & 2).',
            importance: 'Crucial',
            skills: ['SQL Window Functions', 'Star & Snowflake Schemas', 'Fact & Dimension Tables', 'Slowly Changing Dimensions (SCD)'],
            resources: [
              { title: 'The Data Warehouse Toolkit by Ralph Kimball', type: 'Book', url: 'https://www.kimballgroup.com/', isFree: false }
            ],
            projects: [
              { title: 'E-Commerce Dimensional Data Warehouse Schema', description: 'Design a complete Star Schema for order analytics with fact sales, customer dimensions, and automated ETL staging.', difficulty: 'Intermediate', techStack: ['PostgreSQL', 'SQL'] }
            ]
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'Stage 2: Distributed Computing with Apache Spark & Orchestration',
        description: 'Process terabytes of data using PySpark and orchestrate scheduled pipelines with Apache Airflow.',
        level: 'Big Data Processing',
        nodes: [
          {
            id: 'node-spark-airflow',
            title: 'PySpark & Apache Airflow Orchestration',
            description: 'Spark RDDs, DataFrames, Catalyst optimizer, partitioning strategies, DAG authoring in Airflow, backfilling, and error retries.',
            importance: 'Crucial',
            skills: ['PySpark DataFrame API', 'Spark Partitioning & Shuffling', 'Airflow DAG Design', 'Data Pipeline Monitoring'],
            resources: [
              { title: 'Apache Spark Official Programming Guide', type: 'Documentation', url: 'https://spark.apache.org/docs/latest/sql-programming-guide.html', isFree: true }
            ],
            projects: [
              { title: 'Automated Global Weather & Flight Delay Batch Pipeline', description: 'Author an Airflow DAG that fetches hourly public flight datasets, computes delays in PySpark, and writes to Parquet files.', difficulty: 'Advanced', techStack: ['PySpark', 'Apache Airflow', 'Docker'] }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: 'android-mobile-developer',
    title: 'Android & Mobile App Developer',
    subtitle: 'Kotlin, Jetpack Compose, MVVM Architecture, Coroutines, Room DB & Play Store Release',
    description: 'Build native, modern Android applications with Google\'s official declarative UI toolkit (Jetpack Compose), asynchronous Kotlin Coroutines, MVVM clean architecture, and REST API integration.',
    category: 'Mobile & Software',
    difficulty: 'Beginner Friendly',
    estimatedDuration: '4-6 Months',
    icon: 'Smartphone',
    color: 'from-emerald-500 via-green-600 to-teal-700',
    tags: ['Android', 'Kotlin', 'Jetpack Compose', 'MVVM', 'Coroutines', 'Mobile Apps'],
    careerPaths: ['Android Developer', 'Mobile Software Engineer', 'Kotlin App Developer'],
    salaryRange: '₹7 LPA - ₹26+ LPA',
    prerequisites: ['Basic object-oriented programming in Java or Kotlin'],
    featured: false,
    stages: [
      {
        id: 'stage-1',
        title: 'Stage 1: Kotlin Programming & Declarative UI with Jetpack Compose',
        description: 'Kotlin syntax, lambdas, null safety, composable functions, modifiers, state hoisting, and Material Design 3.',
        level: 'Fundamentals',
        nodes: [
          {
            id: 'node-kotlin-compose',
            title: 'Kotlin Fundamentals & Jetpack Compose UI',
            description: 'Kotlin null safety, extension functions, data classes, composable functions (Row, Column, Box, LazyColumn), remember, and mutableStateOf.',
            importance: 'Crucial',
            skills: ['Kotlin Null Safety', 'Jetpack Compose UI', 'State Hoisting & Recomposition', 'Material 3 Theming'],
            resources: [
              { title: 'Android Developers - Jetpack Compose Pathway', type: 'Course', url: 'https://developer.android.com/courses/jetpack-compose/course', isFree: true }
            ],
            projects: [
              { title: 'Crypto Wallet & Portfolio Tracker App', description: 'Build an Android app with dark mode, interactive LazyColumn lists, custom animated charts, and state hoisting.', difficulty: 'Beginner', techStack: ['Kotlin', 'Jetpack Compose', 'Material 3'] }
            ]
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'Stage 2: Architecture (MVVM), Coroutines & Room Database',
        description: 'Asynchronous Coroutines, Flow, Retrofit HTTP client, Room SQLite ORM, and dependency injection with Hilt.',
        level: 'Production Architecture',
        nodes: [
          {
            id: 'node-mvvm-hilt',
            title: 'MVVM Clean Architecture, Coroutines & Room DB',
            description: 'ViewModel, LiveData/StateFlow, Kotlin Coroutines, Retrofit REST client, Room database for offline caching, and Dagger Hilt for dependency injection.',
            importance: 'Crucial',
            skills: ['MVVM Pattern', 'Kotlin Coroutines & StateFlow', 'Room Database Caching', 'Retrofit API Integration'],
            resources: [
              { title: 'Android Developers Guide to App Architecture', type: 'Documentation', url: 'https://developer.android.com/topic/architecture', isFree: true }
            ],
            projects: [
              { title: 'Offline-First News & Article Reader App', description: 'Implement offline-first caching using Room DB, automated sync with REST APIs via Retrofit, and search filtering.', difficulty: 'Intermediate', techStack: ['Kotlin', 'Compose', 'Room DB', 'Retrofit', 'Coroutines'] }
            ]
          }
        ]
      }
    ]
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notesx';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Roadmap Seeding...');

    for (const r of roadmapsData) {
      await Roadmap.findOneAndUpdate(
        { slug: r.slug },
        r,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ Seeded Roadmap: ${r.title} (${r.slug})`);
    }

    console.log(`\n🎉 Successfully seeded ${roadmapsData.length} industry-standard engineering roadmaps!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed roadmaps:', err);
    process.exit(1);
  }
}

seed();
