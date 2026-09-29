// Comprehensive Curated Roadmaps Inspired by roadmap.sh
// Covering High-Demand Roles and Technologies for College Students & Engineers

const moreRoadmapsData = [
  // 1. Full Stack Developer (Role-based)
  {
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    subtitle: 'From Frontend UI & Responsive Design to Scalable Backends, Cloud Deployments & Security',
    description: 'Master the end-to-end journey of a modern Full Stack Engineer. Learn how to architect both client and server applications, integrate modern databases (PostgreSQL & MongoDB), build secure authentication systems, dockerize apps, and ship production-grade code with automated CI/CD pipelines.',
    category: 'Web Development',
    roadmapType: 'Role-based',
    difficulty: 'Intermediate',
    estimatedDuration: '6-9 Months',
    icon: 'Layers',
    color: 'from-emerald-600 via-teal-600 to-cyan-600',
    tags: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Next.js', 'REST API', 'Tailwind CSS'],
    careerPaths: ['Full Stack Software Engineer', 'MERN / PERN Developer', 'Product Engineer', 'Tech Lead'],
    salaryRange: '₹10 LPA - ₹30+ LPA',
    prerequisites: ['Basic programming logic', 'Fundamental understanding of internet protocols (HTTP/DNS)'],
    featured: true,
    stages: [
      {
        id: 'fs-stage-1',
        title: 'Stage 1: Modern Client-Side Engineering & TypeScript',
        description: 'Build responsive, accessible, and high-performance user interfaces with React and TypeScript.',
        level: 'Frontend Core',
        nodes: [
          {
            id: 'node-fs-html-css-ts',
            title: 'Semantic HTML5, Modern CSS & TypeScript Essentials',
            description: 'Semantic accessibility (ARIA, SEO), CSS Grid, Flexbox, Tailwind CSS, and strict TypeScript types, interfaces, generics, and union types.',
            importance: 'Crucial',
            skills: ['Semantic HTML5', 'Tailwind CSS', 'TypeScript Interfaces & Generics', 'Responsive Layouts'],
            resources: [
              { title: 'MDN Web Docs - HTML & CSS', type: 'Documentation', url: 'https://developer.mozilla.org/en-US/docs/Learn', isFree: true },
              { title: 'TypeScript Handbook - Official Docs', type: 'Documentation', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', isFree: true }
            ],
            projects: [
              { title: 'Interactive Multi-Step Form with Zod Validation', description: 'Build an accessible multi-step form with dynamic fields, real-time validation, and typed state management.', difficulty: 'Beginner', techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Zod'] }
            ]
          },
          {
            id: 'node-fs-react-core',
            title: 'React 19 Component Architecture & Client State',
            description: 'Component lifecycles, hooks (useState, useEffect, useMemo, useCallback), context API, custom hooks, and client-side routing.',
            importance: 'Crucial',
            skills: ['React Hooks', 'Custom Hooks', 'Component Lifecycle', 'React Router'],
            resources: [
              { title: 'Official React Documentation (react.dev)', type: 'Documentation', url: 'https://react.dev/learn', isFree: true },
              { title: 'freeCodeCamp React Course for Beginners', type: 'Video', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', isFree: true }
            ],
            projects: [
              { title: 'Kanban Board with Drag & Drop', description: 'Create a Trello clone with draggable task cards, swimlanes, local state persistence, and keyboard accessibility.', difficulty: 'Intermediate', techStack: ['React', 'TypeScript', '@dnd-kit/core'] }
            ]
          }
        ]
      },
      {
        id: 'fs-stage-2',
        title: 'Stage 2: Server-Side Architecture & RESTful APIs',
        description: 'Design robust, modular backends with Node.js, Express, or Fastify.',
        level: 'Backend Core',
        nodes: [
          {
            id: 'node-fs-nodejs-express',
            title: 'Node.js Runtime & Express / Fastify Framework',
            description: 'Event-driven architecture, middleware chains, RESTful API conventions, request sanitization, Zod validation, and structured error handling.',
            importance: 'Crucial',
            skills: ['Express.js / Fastify', 'Middleware Architecture', 'REST Conventions', 'Error Handling'],
            resources: [
              { title: 'Node.js Official Documentation', type: 'Documentation', url: 'https://nodejs.org/docs/latest/api/', isFree: true },
              { title: 'Express.js Guide', type: 'Documentation', url: 'https://expressjs.com/en/guide/routing.html', isFree: true }
            ],
            projects: [
              { title: 'Multi-Tenant E-Commerce REST API', description: 'Develop a RESTful API with pagination, sorting, search filters, rate limiting, and automated Swagger/OpenAPI docs.', difficulty: 'Intermediate', techStack: ['Node.js', 'Express', 'Zod', 'Swagger'] }
            ]
          },
          {
            id: 'node-fs-auth-security',
            title: 'Authentication, Authorization & Web Security',
            description: 'Session vs Token authentication (JWT), Refresh token rotation, HTTP-only cookies, OAuth 2.0 (Google/GitHub), CORS, CSRF, and OWASP Top 10 defenses.',
            importance: 'Crucial',
            skills: ['JWT & Refresh Tokens', 'OAuth 2.0', 'CORS & CSRF Prevention', 'Argon2/Bcrypt Password Hashing'],
            resources: [
              { title: 'OWASP Top 10 Security Guide', type: 'Documentation', url: 'https://owasp.org/www-project-top-ten/', isFree: true }
            ],
            projects: [
              { title: 'Secure Auth Service with 2FA & OAuth', description: 'Build an authentication microservice with JWTs in secure cookies, password reset via email, and TOTP two-factor authentication.', difficulty: 'Intermediate', techStack: ['Node.js', 'TypeScript', 'Speakeasy', 'JWT'] }
            ]
          }
        ]
      },
      {
        id: 'fs-stage-3',
        title: 'Stage 3: Databases, Caching & ORMs',
        description: 'Model relational and document data, optimize queries, and accelerate reads with Redis.',
        level: 'Data Architecture',
        nodes: [
          {
            id: 'node-fs-sql-prisma',
            title: 'PostgreSQL & Modern ORMs (Prisma / Drizzle)',
            description: 'Relational database schema design, foreign keys, composite indexes, migrations, joins, transactions, and type-safe querying with Prisma or Drizzle ORM.',
            importance: 'Crucial',
            skills: ['PostgreSQL', 'Prisma ORM', 'Database Migrations', 'Transactions & Indexes'],
            resources: [
              { title: 'PostgreSQL Official Documentation', type: 'Documentation', url: 'https://www.postgresql.org/docs/', isFree: true },
              { title: 'Prisma Getting Started Guide', type: 'Documentation', url: 'https://www.prisma.io/docs/getting-started', isFree: true }
            ],
            projects: [
              { title: 'SaaS Billing & Subscription Data Layer', description: 'Design a PostgreSQL schema with ACID transactions for handling subscription tiers, invoicing, and usage quotas.', difficulty: 'Intermediate', techStack: ['PostgreSQL', 'Prisma', 'Docker'] }
            ]
          },
          {
            id: 'node-fs-redis-caching',
            title: 'Redis Caching & Background Queues',
            description: 'In-memory key-value caching, cache-aside pattern, TTL expiration, cache invalidation strategies, and background job processing with BullMQ.',
            importance: 'Recommended',
            skills: ['Redis Caching', 'Cache Invalidation', 'BullMQ Background Jobs', 'Rate Limiting'],
            resources: [
              { title: 'Redis University - Redis for Developers', type: 'Course', url: 'https://university.redis.com/', isFree: true }
            ],
            projects: [
              { title: 'High-Throughput Analytics Cache & Notification Queue', description: 'Implement Redis caching to reduce database read load by 80% and process async email jobs with BullMQ.', difficulty: 'Intermediate', techStack: ['Redis', 'BullMQ', 'Node.js'] }
            ]
          }
        ]
      },
      {
        id: 'fs-stage-4',
        title: 'Stage 4: Cloud, Containers & Production Deployment',
        description: 'Package applications into Docker containers and deploy with CI/CD automation.',
        level: 'DevOps & Production',
        nodes: [
          {
            id: 'node-fs-docker-cicd',
            title: 'Docker Containerization & GitHub Actions CI/CD',
            description: 'Writing multi-stage Dockerfiles for frontend and backend, Docker Compose for local development, and GitHub Actions workflows for automated testing and deployment.',
            importance: 'Crucial',
            skills: ['Docker', 'Multi-Stage Builds', 'Docker Compose', 'GitHub Actions CI/CD'],
            resources: [
              { title: 'Docker Official Get Started Tutorial', type: 'Documentation', url: 'https://docs.docker.com/get-started/', isFree: true },
              { title: 'GitHub Actions Documentation', type: 'Documentation', url: 'https://docs.github.com/en/actions', isFree: true }
            ],
            projects: [
              { title: 'Fully Automated Full-Stack Production Pipeline', description: 'Containerize client, API, PostgreSQL, and Redis with health checks and configure GitHub Actions for zero-downtime deployment.', difficulty: 'Advanced', techStack: ['Docker', 'Docker Compose', 'GitHub Actions', 'AWS / DigitalOcean'] }
            ]
          }
        ]
      }
    ]
  },

  // 2. React Developer (Skill-based)
  {
    slug: 'react-developer',
    title: 'React Developer',
    subtitle: 'Component Architecture, Hooks, State Management, Next.js App Router & Performance',
    description: 'The definitive roadmap for modern React engineers. Transition from core JSX fundamentals and custom hooks to scalable state management with Zustand, server cache with TanStack Query, and full-stack React with Next.js 15 App Router and React Server Components.',
    category: 'Web Development',
    roadmapType: 'Skill-based',
    difficulty: 'Beginner Friendly',
    estimatedDuration: '3-5 Months',
    icon: 'Sparkles',
    color: 'from-cyan-500 via-blue-600 to-indigo-600',
    tags: ['React', 'JSX', 'Hooks', 'Next.js', 'Zustand', 'TanStack Query', 'TypeScript', 'Tailwind'],
    careerPaths: ['Frontend React Engineer', 'UI/UX Developer', 'Next.js Specialist', 'Web Application Architect'],
    salaryRange: '₹8 LPA - ₹24+ LPA',
    prerequisites: ['HTML/CSS fundamentals', 'Solid JavaScript ES6+ (destructuring, arrow functions, promises)'],
    featured: true,
    stages: [
      {
        id: 'react-stage-1',
        title: 'Stage 1: React Fundamentals & Modern JSX',
        description: 'Grasp the component model, JSX syntax, reconciliation, and the Virtual DOM.',
        level: 'Fundamentals',
        nodes: [
          {
            id: 'node-react-jsx-props',
            title: 'Components, JSX, Props & Conditional Rendering',
            description: 'Understanding functional components, pure functions in React, immutable props, children props, conditional rendering operators, and rendering lists with keys.',
            importance: 'Crucial',
            skills: ['Functional Components', 'JSX Rules', 'Props Passing & Destructuring', 'Key Reconciliation'],
            resources: [
              { title: 'react.dev - Describing the UI', type: 'Documentation', url: 'https://react.dev/learn/describing-the-ui', isFree: true }
            ],
            projects: [
              { title: 'Interactive Product Catalog with Filtering', description: 'Render a list of dynamic products with search filter, badge categories, and price sort without external libraries.', difficulty: 'Beginner', techStack: ['React', 'Tailwind CSS'] }
            ]
          },
          {
            id: 'node-react-core-hooks',
            title: 'Core Hooks: useState & useEffect Deep Dive',
            description: 'State as a snapshot, updater functions, state lifting, useEffect dependency array rules, cleanup functions, and avoiding common useEffect anti-patterns.',
            importance: 'Crucial',
            skills: ['useState Batching', 'useEffect Lifecycle', 'Cleanup Functions', 'Lifting State Up'],
            resources: [
              { title: 'react.dev - You Might Not Need an Effect', type: 'Documentation', url: 'https://react.dev/learn/you-might-not-need-an-effect', isFree: true }
            ],
            projects: [
              { title: 'Real-Time Currency Converter & Stock Ticker', description: 'Fetch live rates from a public API, debounce input changes, and handle abort controller cleanup on unmount.', difficulty: 'Beginner', techStack: ['React', 'Fetch API', 'AbortController'] }
            ]
          }
        ]
      },
      {
        id: 'react-stage-2',
        title: 'Stage 2: Advanced Hooks & Custom Hooks',
        description: 'Master memory optimization and encapsulate reusable component behaviors.',
        level: 'Intermediate',
        nodes: [
          {
            id: 'node-react-perf-hooks',
            title: 'useMemo, useCallback & useRef',
            description: 'Preventing unnecessary component re-renders, referential equality, caching expensive computations with useMemo, persisting mutable values without re-renders using useRef, and DOM manipulation.',
            importance: 'Crucial',
            skills: ['useMemo', 'useCallback', 'useRef', 'React.memo Profiling'],
            resources: [
              { title: 'React Documentation - Performance Optimization', type: 'Documentation', url: 'https://react.dev/reference/react/useMemo', isFree: true }
            ],
            projects: [
              { title: 'Infinite Scroll Media Grid with Virtualization', description: 'Implement an intersection observer custom hook with useRef to trigger infinite pagination smoothly.', difficulty: 'Intermediate', techStack: ['React', 'IntersectionObserver', 'useCallback'] }
            ]
          },
          {
            id: 'node-react-custom-hooks',
            title: 'Custom Hooks Architecture & Composition',
            description: 'Extracting stateful business logic into reusable custom hooks (useLocalStorage, useDebounce, useMediaQuery, useWindowSize).',
            importance: 'Crucial',
            skills: ['Custom Hooks Design', 'Hook Composition', 'Encapsulation'],
            resources: [
              { title: 'useHooks - Reusable React Hooks Library', type: 'Documentation', url: 'https://usehooks.com/', isFree: true }
            ],
            projects: [
              { title: 'Collection of 8 Production-Ready Custom Hooks', description: 'Build and unit-test custom hooks for window size, dark mode, debounce, local storage, and keyboard shortcuts.', difficulty: 'Intermediate', techStack: ['React', 'TypeScript', 'Vitest'] }
            ]
          }
        ]
      },
      {
        id: 'react-stage-3',
        title: 'Stage 3: State Management & Server Cache',
        description: 'Coordinate global UI state and handle asynchronous server data fetching elegantly.',
        level: 'State Architecture',
        nodes: [
          {
            id: 'node-react-tanstack-query',
            title: 'TanStack Query (React Query) v5',
            description: 'Declarative asynchronous state management, stale-while-revalidate, automatic retries, window refocus refetching, pagination, infinite queries, and optimistic updates.',
            importance: 'Crucial',
            skills: ['TanStack Query', 'Optimistic UI Updates', 'Cache Invalidation', 'Mutation Handlers'],
            resources: [
              { title: 'TanStack Query Official Docs', type: 'Documentation', url: 'https://tanstack.com/query/latest/docs/framework/react/overview', isFree: true }
            ],
            projects: [
              { title: 'Full-Featured GitHub Repository Explorer', description: 'Explore repositories, issues, and star counts with automatic caching, pagination, and instant optimistic starring.', difficulty: 'Intermediate', techStack: ['React', 'TanStack Query', 'Tailwind'] }
            ]
          },
          {
            id: 'node-react-zustand',
            title: 'Lightweight Global State with Zustand',
            description: 'Minimalist state stores without boilerplate, selector subscriptions to eliminate re-renders, middleware for persistence, and devtools integration.',
            importance: 'Recommended',
            skills: ['Zustand Stores', 'State Selectors', 'LocalStorage Persistence Middleware'],
            resources: [
              { title: 'Zustand GitHub Documentation', type: 'Documentation', url: 'https://github.com/pmndrs/zustand', isFree: true }
            ],
            projects: [
              { title: 'Audio Player / Podcast Station with Persistent State', description: 'Global audio player that persists playback position, current track, volume, and playlist across route transitions.', difficulty: 'Intermediate', techStack: ['React', 'Zustand', 'HTML5 Audio'] }
            ]
          }
        ]
      },
      {
        id: 'react-stage-4',
        title: 'Stage 4: Meta-Frameworks & Next.js 15 App Router',
        description: 'Server-side rendering, React Server Components, and full-stack React architecture.',
        level: 'Production & Meta-Frameworks',
        nodes: [
          {
            id: 'node-react-nextjs-app-router',
            title: 'Next.js App Router, Server Components & Server Actions',
            description: 'File-system based routing, Server vs Client components boundaries, Streaming with Suspense, dynamic route segments, and mutating data with Server Actions.',
            importance: 'Crucial',
            skills: ['Next.js 15 App Router', 'React Server Components (RSC)', 'Server Actions', 'Streaming & Suspense'],
            resources: [
              { title: 'Next.js Official Documentation', type: 'Documentation', url: 'https://nextjs.org/docs', isFree: true }
            ],
            projects: [
              { title: 'Modern Dev Blog with Server Components & MDX', description: 'Build an ultra-fast blog with Next.js App Router, server-rendered MDX markdown, dynamic OpenGraph image generation, and search.', difficulty: 'Advanced', techStack: ['Next.js 15', 'React Server Components', 'Tailwind', 'MDX'] }
            ]
          }
        ]
      }
    ]
  },

  // 3. Node.js Backend Developer (Skill-based)
  {
    slug: 'nodejs-developer',
    title: 'Node.js Backend Developer',
    subtitle: 'Event Loop, Streams, Express/Fastify, Microservices, Worker Threads & Scalability',
    description: 'Master the server-side JavaScript runtime. Dive into the event loop phases, buffer manipulations, streaming large datasets, structuring enterprise REST & GraphQL microservices, caching with Redis, and scaling Node.js applications with clustering and worker threads.',
    category: 'Web Development',
    roadmapType: 'Skill-based',
    difficulty: 'Intermediate',
    estimatedDuration: '4-6 Months',
    icon: 'Server',
    color: 'from-emerald-600 to-green-700',
    tags: ['Node.js', 'Express', 'Fastify', 'Event Loop', 'Streams', 'WebSockets', 'BullMQ', 'Redis'],
    careerPaths: ['Backend Node.js Engineer', 'API Platform Developer', 'Microservices Architect'],
    salaryRange: '₹9 LPA - ₹28+ LPA',
    prerequisites: ['Proficiency in modern JavaScript / TypeScript', 'Basic asynchronous programming knowledge'],
    featured: false,
    stages: [
      {
        id: 'node-stage-1',
        title: 'Stage 1: Node.js Internals & Core Runtime',
        description: 'Understand how Node.js executes code under the hood using V8 and Libuv.',
        level: 'Internals',
        nodes: [
          {
            id: 'node-core-event-loop',
            title: 'The Node.js Event Loop & Asynchronous Architecture',
            description: 'Phases of the event loop (Timers, Pending Callbacks, Poll, Check, Close), microtasks queue (process.nextTick vs Promise.then), and preventing blocking of the main thread.',
            importance: 'Crucial',
            skills: ['Event Loop Phases', 'process.nextTick', 'Libuv Thread Pool', 'Non-blocking I/O'],
            resources: [
              { title: 'Node.js Event Loop Guide', type: 'Documentation', url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick', isFree: true }
            ],
            projects: [
              { title: 'Event Loop Profiler & Benchmark Script', description: 'Write scripts that demonstrate event loop phase ordering, execution latency, and thread pool exhaustion.', difficulty: 'Intermediate', techStack: ['Node.js', 'Performance Hooks'] }
            ]
          },
          {
            id: 'node-core-buffers-streams',
            title: 'Buffers, Streams & File System (fs/promises)',
            description: 'Handling binary data with Buffers, Readable, Writable, Duplex, and Transform streams, stream backpressure, and piping gigabyte-scale files with minimal memory usage.',
            importance: 'Crucial',
            skills: ['Node.js Streams', 'Stream Backpressure', 'Buffers & Encoding', 'Pipeline API'],
            resources: [
              { title: 'Node.js Streams Documentation', type: 'Documentation', url: 'https://nodejs.org/api/stream.html', isFree: true }
            ],
            projects: [
              { title: 'High-Speed CSV / Log File Stream Processor', description: 'Process and transform a 2GB log file line-by-line, computing aggregations and writing outputs using under 50MB of RAM.', difficulty: 'Intermediate', techStack: ['Node.js', 'Streams', 'Pipeline'] }
            ]
          }
        ]
      },
      {
        id: 'node-stage-2',
        title: 'Stage 2: Enterprise API Frameworks & Security',
        description: 'Build robust web APIs using Fastify and Express with validation and security hardening.',
        level: 'APIs & Security',
        nodes: [
          {
            id: 'node-fastify-apis',
            title: 'High-Performance APIs with Fastify & Zod',
            description: 'Fastify schema compilation with JSON Schema/Zod, encapsulation with plugins, hooks (onRequest, preHandler), fast serialization, and custom logger integration.',
            importance: 'Crucial',
            skills: ['Fastify Framework', 'Fastify Plugins', 'JSON Schema Validation', 'Pino Logging'],
            resources: [
              { title: 'Fastify Documentation', type: 'Documentation', url: 'https://fastify.dev/docs/latest/', isFree: true }
            ],
            projects: [
              { title: 'Blazing Fast Microservice with Fastify & Swagger', description: 'Construct a microservice achieving 30,000+ req/sec with auto-generated OpenAPI documentation and schema validation.', difficulty: 'Intermediate', techStack: ['Fastify', 'Zod', 'Pino'] }
            ]
          }
        ]
      },
      {
        id: 'node-stage-3',
        title: 'Stage 3: Multi-Threading, Clustering & Scaling',
        description: 'Maximize multi-core CPU utilization and handle concurrent load.',
        level: 'Scaling',
        nodes: [
          {
            id: 'node-scaling-workers',
            title: 'Cluster Module & Worker Threads',
            description: 'Forking multiple Node.js worker processes across CPU cores, zero-downtime reloads, offloading CPU-intensive cryptography or image processing to Worker Threads.',
            importance: 'Crucial',
            skills: ['Node.js Cluster', 'Worker Threads', 'Inter-Process Communication (IPC)', 'PM2'],
            resources: [
              { title: 'Node.js Worker Threads API', type: 'Documentation', url: 'https://nodejs.org/api/worker_threads.html', isFree: true }
            ],
            projects: [
              { title: 'Parallel Thumbnail & Video Transcoder Worker Pool', description: 'A background worker pool that distributes image compression jobs across available CPU cores via worker threads.', difficulty: 'Advanced', techStack: ['Node.js', 'Worker Threads', 'Sharp'] }
            ]
          }
        ]
      }
    ]
  },

  // 4. Python Developer (Skill-based)
  {
    slug: 'python-developer',
    title: 'Python Developer',
    subtitle: 'Core Python, Asyncio, FastAPI, SQLAlchemy, Testing & Production Web Systems',
    description: 'The roadmap for modern professional Python development. Transition from clean syntax, type hinting, and object-oriented patterns to high-throughput asynchronous web APIs with FastAPI, database modeling with SQLAlchemy 2.0, automated testing with Pytest, and package management with Poetry.',
    category: 'Languages & Frameworks',
    roadmapType: 'Skill-based',
    difficulty: 'Beginner Friendly',
    estimatedDuration: '4-6 Months',
    icon: 'Terminal',
    color: 'from-blue-600 via-yellow-500 to-amber-600',
    tags: ['Python', 'FastAPI', 'Django', 'Asyncio', 'SQLAlchemy', 'Pytest', 'Poetry', 'Pydantic'],
    careerPaths: ['Python Backend Engineer', 'Full Stack Python Developer', 'Automation Engineer', 'Data & Backend Specialist'],
    salaryRange: '₹8 LPA - ₹25+ LPA',
    prerequisites: ['Basic programming syntax in any language'],
    featured: true,
    stages: [
      {
        id: 'py-stage-1',
        title: 'Stage 1: Idiomatic Python & Modern Syntax',
        description: 'Master advanced Python constructs, type hinting, and object-oriented patterns.',
        level: 'Language Mastery',
        nodes: [
          {
            id: 'node-py-advanced-syntax',
            title: 'Type Hints, Dunder Methods & Metaprogramming',
            description: 'Type annotations with typing module (Union, Optional, Callable), static type checking with mypy, magic/dunder methods (__repr__, __enter__, __iter__), decorators, and generators.',
            importance: 'Crucial',
            skills: ['Mypy Type Checking', 'Python Decorators', 'Generators & Yield', 'Context Managers'],
            resources: [
              { title: 'Python Official Tutorial', type: 'Documentation', url: 'https://docs.python.org/3/tutorial/', isFree: true },
              { title: 'Fluent Python by Luciano Ramalho', type: 'Book', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', isFree: false }
            ],
            projects: [
              { title: 'Custom Cache & Execution Time Decorator Suite', description: 'Write an extensible decorator library for memoization, rate-limiting, and timing with strict type hints.', difficulty: 'Beginner', techStack: ['Python 3.12', 'functools', 'mypy'] }
            ]
          }
        ]
      },
      {
        id: 'py-stage-2',
        title: 'Stage 2: Asynchronous Programming with Asyncio',
        description: 'Understand non-blocking concurrency, coroutines, and event loops in Python.',
        level: 'Concurrency',
        nodes: [
          {
            id: 'node-py-asyncio',
            title: 'Coroutines, Tasks & asyncio Event Loop',
            description: 'Writing non-blocking async code, asyncio.gather, asyncio.wait, asyncio semaphores for rate limiting, and distinguishing I/O-bound async from CPU-bound multiprocessing.',
            importance: 'Crucial',
            skills: ['async / await', 'asyncio.gather', 'Semaphores', 'Async HTTP with httpx/aiohttp'],
            resources: [
              { title: 'Python Asyncio Documentation', type: 'Documentation', url: 'https://docs.python.org/3/library/asyncio.html', isFree: true }
            ],
            projects: [
              { title: 'Concurrent Web Scraper & Price Monitor', description: 'Scrape 1,000 product pages concurrently using httpx and BeautifulSoup while honoring rate limits using an asyncio Semaphore.', difficulty: 'Intermediate', techStack: ['Python', 'asyncio', 'httpx', 'BeautifulSoup4'] }
            ]
          }
        ]
      },
      {
        id: 'py-stage-3',
        title: 'Stage 3: Modern Web APIs with FastAPI & SQLAlchemy',
        description: 'Architect lightning-fast RESTful APIs with automated OpenAPI documentation.',
        level: 'Web Frameworks',
        nodes: [
          {
            id: 'node-py-fastapi-sqlalchemy',
            title: 'FastAPI, Pydantic v2 & SQLAlchemy 2.0',
            description: 'Declarative request validation with Pydantic, dependency injection in FastAPI, async database sessions with SQLAlchemy 2.0, and migrations using Alembic.',
            importance: 'Crucial',
            skills: ['FastAPI Routing', 'Pydantic Models', 'SQLAlchemy 2.0 Async', 'Alembic Migrations'],
            resources: [
              { title: 'FastAPI Official Documentation', type: 'Documentation', url: 'https://fastapi.tiangolo.com/', isFree: true }
            ],
            projects: [
              { title: 'Production Issue Tracker REST API', description: 'Full REST API with JWT authentication, role-based access control, async PostgreSQL persistence, and Alembic migrations.', difficulty: 'Intermediate', techStack: ['FastAPI', 'Pydantic', 'SQLAlchemy', 'PostgreSQL'] }
            ]
          }
        ]
      },
      {
        id: 'py-stage-4',
        title: 'Stage 4: Testing & Packaging',
        description: 'Deliver reliable, maintainable code with automated tests and modern dependency tools.',
        level: 'Quality & Delivery',
        nodes: [
          {
            id: 'node-py-pytest-poetry',
            title: 'Pytest Fixtures, Mocking & Poetry Package Management',
            description: 'Test-driven development with Pytest, parameterized tests, monkeypatching, mock databases, coverage reports, and managing virtual environments with Poetry.',
            importance: 'Crucial',
            skills: ['Pytest Fixtures', 'Mocking & Patching', 'Poetry Dependency Management', 'Coverage.py'],
            resources: [
              { title: 'Pytest Documentation', type: 'Documentation', url: 'https://docs.pytest.org/en/latest/', isFree: true }
            ],
            projects: [
              { title: 'Fully Tested Open-Source Python Package', description: 'Build and publish a reusable utility library with 95%+ test coverage, automated GitHub Actions workflow, and Poetry packaging.', difficulty: 'Intermediate', techStack: ['Python', 'Pytest', 'Poetry', 'GitHub Actions'] }
            ]
          }
        ]
      }
    ]
  },

  // 5. Java & Spring Boot Developer (Skill-based)
  {
    slug: 'java-spring-boot',
    title: 'Java & Spring Boot Developer',
    subtitle: 'Java 21 LTS, Spring Boot 3, Spring Data JPA, Hibernate, Spring Security & Microservices',
    description: 'The premier enterprise roadmap. Master modern Java (Virtual Threads, Pattern Matching, Records), Spring Boot 3 dependency injection, database persistence with JPA/Hibernate, Spring Security authentication, and event-driven microservices with Kafka.',
    category: 'Languages & Frameworks',
    roadmapType: 'Skill-based',
    difficulty: 'Intermediate',
    estimatedDuration: '5-7 Months',
    icon: 'Box',
    color: 'from-red-600 via-orange-600 to-amber-600',
    tags: ['Java 21', 'Spring Boot 3', 'Hibernate', 'Spring Security', 'Kafka', 'Microservices', 'Maven', 'Docker'],
    careerPaths: ['Enterprise Java Developer', 'Spring Boot Backend Engineer', 'Banking & Fintech Systems Engineer'],
    salaryRange: '₹10 LPA - ₹30+ LPA',
    prerequisites: ['Object-Oriented Programming (OOP) concepts'],
    featured: true,
    stages: [
      {
        id: 'java-stage-1',
        title: 'Stage 1: Modern Java (Java 17/21 LTS) & JVM Core',
        description: 'Leverage the latest LTS features of Java and understand JVM memory management.',
        level: 'Java Foundations',
        nodes: [
          {
            id: 'node-java-modern-features',
            title: 'Java 21 Language Features & Virtual Threads (Project Loom)',
            description: 'Records, sealed classes, pattern matching for switch, text blocks, Streams API, and lightweight Virtual Threads for high-throughput concurrent I/O.',
            importance: 'Crucial',
            skills: ['Java Virtual Threads', 'Records & Sealed Classes', 'Streams & Lambdas', 'JVM Garbage Collection'],
            resources: [
              { title: 'Dev.java - Official Java Portal', type: 'Documentation', url: 'https://dev.java/', isFree: true }
            ],
            projects: [
              { title: 'High-Concurrency File Crawler with Virtual Threads', description: 'Crawl and parse 10,000 files concurrently using Java 21 Virtual Threads and compare memory usage with standard platform threads.', difficulty: 'Intermediate', techStack: ['Java 21', 'Virtual Threads'] }
            ]
          }
        ]
      },
      {
        id: 'java-stage-2',
        title: 'Stage 2: Spring Boot 3 Framework & Data Persistence',
        description: 'Build enterprise-grade REST APIs backed by Spring Data JPA and Hibernate.',
        level: 'Spring Boot Core',
        nodes: [
          {
            id: 'node-java-spring-core-jpa',
            title: 'Spring Boot 3, Spring Data JPA & Hibernate',
            description: 'Inversion of Control (IoC), Dependency Injection, @RestController, request validation, Spring Data repository patterns, handling Hibernate N+1 query issues, and database migrations with Flyway.',
            importance: 'Crucial',
            skills: ['Spring Boot 3', 'Spring Data JPA', 'Hibernate Query Optimization', 'Flyway Migrations'],
            resources: [
              { title: 'Spring Guides - Building a RESTful Web Service', type: 'Documentation', url: 'https://spring.io/guides/gs/rest-service/', isFree: true }
            ],
            projects: [
              { title: 'Enterprise Banking Ledger API', description: 'Implement an account transfer service with ACID transactions, optimistic locking (@Version), and audit logging.', difficulty: 'Intermediate', techStack: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Flyway'] }
            ]
          }
        ]
      },
      {
        id: 'java-stage-3',
        title: 'Stage 3: Enterprise Security & Microservices with Kafka',
        description: 'Secure APIs with Spring Security and decouple services via Apache Kafka.',
        level: 'Security & Microservices',
        nodes: [
          {
            id: 'node-java-security-kafka',
            title: 'Spring Security 6, JWT Authentication & Apache Kafka',
            description: 'SecurityFilterChain configuration, stateless JWT authentication, role-based authorization, producing and consuming event messages with Apache Kafka, and circuit breakers with Resilience4j.',
            importance: 'Crucial',
            skills: ['Spring Security 6', 'JWT Authentication', 'Apache Kafka Producers & Consumers', 'Resilience4j'],
            resources: [
              { title: 'Baeldung Spring Boot Tutorials', type: 'Article', url: 'https://www.baeldung.com/spring-boot', isFree: true }
            ],
            projects: [
              { title: 'Distributed Order & Inventory Microservice System', description: 'Two independent Spring Boot microservices communicating order events over Apache Kafka with retry topics and DLQ.', difficulty: 'Advanced', techStack: ['Spring Boot 3', 'Apache Kafka', 'Docker', 'PostgreSQL'] }
            ]
          }
        ]
      }
    ]
  },

  // 6. Go / Golang Developer (Skill-based)
  {
    slug: 'golang-developer',
    title: 'Go / Golang Developer',
    subtitle: 'Concurrency, Goroutines, Channels, Gin/Chi, gRPC, Protobuf & Cloud-Native Services',
    description: 'Learn the language of cloud infrastructure and high-performance microservices. Master Go syntax, pointers, lightweight concurrency with Goroutines and Channels, building blazing-fast HTTP services with Gin and Chi, and microservices with gRPC and Protocol Buffers.',
    category: 'Languages & Frameworks',
    roadmapType: 'Skill-based',
    difficulty: 'Intermediate',
    estimatedDuration: '4-5 Months',
    icon: 'Zap',
    color: 'from-cyan-500 via-teal-500 to-blue-600',
    tags: ['Go', 'Golang', 'Goroutines', 'Channels', 'gRPC', 'Protobuf', 'Gin', 'Docker', 'Microservices'],
    careerPaths: ['Golang Backend Engineer', 'Cloud Infrastructure Developer', 'Distributed Systems Engineer'],
    salaryRange: '₹12 LPA - ₹32+ LPA',
    prerequisites: ['Familiarity with basic programming logic and terminal commands'],
    featured: true,
    stages: [
      {
        id: 'go-stage-1',
        title: 'Stage 1: Go Language Core & Memory Model',
        description: 'Understand Go syntax, value vs reference semantics, and explicit error handling.',
        level: 'Language Core',
        nodes: [
          {
            id: 'node-go-syntax-pointers',
            title: 'Go Types, Pointers, Structs & Interfaces',
            description: 'Primitive types, slices and arrays, pointers and memory addresses, structs and methods, interface composition, and Go idiomatic error handling (if err != nil).',
            importance: 'Crucial',
            skills: ['Pointers & Slices', 'Structs & Methods', 'Interface Polymorphism', 'Error Wrapping'],
            resources: [
              { title: 'A Tour of Go - Official Interactive Tutorial', type: 'Documentation', url: 'https://go.dev/tour/', isFree: true },
              { title: 'Effective Go Guide', type: 'Documentation', url: 'https://go.dev/doc/effective_go', isFree: true }
            ],
            projects: [
              { title: 'High-Performance In-Memory Key-Value Store', description: 'Build an in-memory key-value cache with TTL expiration, thread-safety, and a command-line interface in pure Go.', difficulty: 'Beginner', techStack: ['Go', 'sync.RWMutex'] }
            ]
          }
        ]
      },
      {
        id: 'go-stage-2',
        title: 'Stage 2: Concurrency with Goroutines & Channels',
        description: 'Write safe, concurrent systems using Go channels and sync primitives.',
        level: 'Concurrency',
        nodes: [
          {
            id: 'node-go-concurrency',
            title: 'Goroutines, Channels, Select & Context',
            description: 'Spawning lightweight goroutines, buffered vs unbuffered channels, select statement, sync.WaitGroup, sync.Mutex, and propagating cancellation and timeouts using context.Context.',
            importance: 'Crucial',
            skills: ['Goroutines', 'Channels & Multiplexing', 'context.Context', 'Race Condition Detection (go run -race)'],
            resources: [
              { title: 'Go Concurrency Patterns (Rob Pike)', type: 'Video', url: 'https://www.youtube.com/watch?v=f6kdp27TYZs', isFree: true }
            ],
            projects: [
              { title: 'Concurrent URL Health Checker & Load Tester', description: 'Tool that pings thousands of endpoints concurrently with configurable worker pool size, timeout controls, and latency histogram.', difficulty: 'Intermediate', techStack: ['Go', 'Channels', 'Worker Pool'] }
            ]
          }
        ]
      },
      {
        id: 'go-stage-3',
        title: 'Stage 3: High-Performance Web Services & gRPC',
        description: 'Build fast REST APIs and ultra-low latency gRPC services.',
        level: 'APIs & Microservices',
        nodes: [
          {
            id: 'node-go-grpc-gin',
            title: 'REST APIs (Gin/Chi) & gRPC with Protocol Buffers',
            description: 'Building REST endpoints with Gin/Chi, PostgreSQL interaction with pgx/sqlx, defining service contracts with Protocol Buffers (.proto), and implementing unary and streaming gRPC servers.',
            importance: 'Crucial',
            skills: ['Gin / Chi Framework', 'pgx PostgreSQL Driver', 'Protocol Buffers', 'gRPC Client & Server'],
            resources: [
              { title: 'gRPC Go Quick Start Guide', type: 'Documentation', url: 'https://grpc.io/docs/languages/go/quickstart/', isFree: true }
            ],
            projects: [
              { title: 'Real-Time Telemetry gRPC Service', description: 'Stream system sensor metrics over bi-directional gRPC streams to a Go collector service storing data in PostgreSQL.', difficulty: 'Advanced', techStack: ['Go', 'gRPC', 'Protobuf', 'PostgreSQL', 'Docker'] }
            ]
          }
        ]
      }
    ]
  },

  // 7. Rust Systems Developer (Skill-based)
  {
    slug: 'rust-developer',
    title: 'Rust Systems Developer',
    subtitle: 'Ownership, Borrowing, Lifetimes, Tokio Async, Axum Web, Systems & WebAssembly',
    description: 'Master memory safety without a garbage collector. Dive deep into Rust’s ownership and borrow checker model, pattern matching, error handling with Result, high-performance async runtimes with Tokio, and building blazingly fast backend systems and WebAssembly modules.',
    category: 'Languages & Frameworks',
    roadmapType: 'Skill-based',
    difficulty: 'Advanced',
    estimatedDuration: '5-8 Months',
    icon: 'Cpu',
    color: 'from-amber-600 via-orange-700 to-rose-700',
    tags: ['Rust', 'Tokio', 'Axum', 'Ownership', 'Lifetimes', 'WebAssembly', 'Cargo', 'Systems Programming'],
    careerPaths: ['Rust Systems Engineer', 'High-Performance Backend Developer', 'Blockchain Protocol Developer', 'WASM Engineer'],
    salaryRange: '₹14 LPA - ₹38+ LPA',
    prerequisites: ['Prior programming experience in C, C++, Java, or Go recommended'],
    featured: true,
    stages: [
      {
        id: 'rust-stage-1',
        title: 'Stage 1: The Rust Mindset: Ownership & Borrowing',
        description: 'Understand how Rust guarantees memory safety at compile time without a garbage collector.',
        level: 'Core Memory Model',
        nodes: [
          {
            id: 'node-rust-ownership',
            title: 'Ownership, References, Borrowing & Lifetimes',
            description: 'Move semantics, stack vs heap allocation, mutable and immutable borrowing rules, slices, string types (String vs &str), and explicit lifetime annotations.',
            importance: 'Crucial',
            skills: ['Rust Ownership Rules', 'Borrow Checker', 'Lifetimes Basics', 'Zero-Cost Abstractions'],
            resources: [
              { title: 'The Rust Programming Language Book', type: 'Book', url: 'https://doc.rust-lang.org/book/', isFree: true },
              { title: 'Rustlings - Small Exercises to Learn Rust', type: 'GitHub', url: 'https://github.com/rust-lang/rustlings', isFree: true }
            ],
            projects: [
              { title: 'Command-Line Grep Tool (minigrep)', description: 'Build an ultra-fast text search CLI in Rust that searches files with case-sensitivity flags and clean error handling.', difficulty: 'Beginner', techStack: ['Rust', 'Cargo', 'std::env'] }
            ]
          }
        ]
      },
      {
        id: 'rust-stage-2',
        title: 'Stage 2: Type System, Traits & Asynchronous Tokio',
        description: 'Harness expressive traits, pattern matching, and the asynchronous Tokio runtime.',
        level: 'Async Rust & Web',
        nodes: [
          {
            id: 'node-rust-tokio-axum',
            title: 'Async Rust with Tokio & Web APIs with Axum',
            description: 'Enums and pattern matching, Result and Option types, error handling with anyhow/thiserror, Tokio async runtime, and building fast web APIs using Axum.',
            importance: 'Crucial',
            skills: ['Tokio Async Runtime', 'Axum Web Framework', 'SQLx Compile-Time Checked SQL', 'Traits & Generics'],
            resources: [
              { title: 'Tokio Official Tutorial', type: 'Documentation', url: 'https://tokio.rs/tokio/tutorial', isFree: true },
              { title: 'Axum Framework GitHub & Guides', type: 'Documentation', url: 'https://github.com/tokio-rs/axum', isFree: true }
            ],
            projects: [
              { title: 'High-Performance URL Shortener Microservice', description: 'Build a production microservice with Axum, async SQLx queries checked at compile time, and Redis caching.', difficulty: 'Advanced', techStack: ['Rust', 'Tokio', 'Axum', 'SQLx', 'PostgreSQL'] }
            ]
          }
        ]
      }
    ]
  },

  // 8. iOS & Swift Developer (Role-based)
  {
    slug: 'ios-developer',
    title: 'iOS & Swift Developer',
    subtitle: 'Swift 6, SwiftUI, SwiftData, MVVM Architecture, URLSession & App Store Deployment',
    description: 'Build native, fluid iOS applications for Apple devices. Master Swift language modern concurrency (async/await), declarative UI with SwiftUI, data persistence with SwiftData, native hardware APIs, MVVM architecture, and App Store guidelines.',
    category: 'Mobile & Software',
    roadmapType: 'Role-based',
    difficulty: 'Intermediate',
    estimatedDuration: '5-7 Months',
    icon: 'Smartphone',
    color: 'from-orange-500 via-pink-600 to-rose-600',
    tags: ['Swift', 'SwiftUI', 'iOS', 'Xcode', 'SwiftData', 'MVVM', 'Combine', 'App Store'],
    careerPaths: ['iOS Application Developer', 'Mobile Software Engineer', 'Apple Platform Architect'],
    salaryRange: '₹10 LPA - ₹28+ LPA',
    prerequisites: ['Basic object-oriented programming knowledge', 'Access to macOS with Xcode'],
    featured: false,
    stages: [
      {
        id: 'ios-stage-1',
        title: 'Stage 1: Swift Language & Modern Concurrency',
        description: 'Master Swift syntax, memory management with ARC, and async/await.',
        level: 'Swift Core',
        nodes: [
          {
            id: 'node-ios-swift-core',
            title: 'Swift 6 Fundamentals, Optionals & Structured Concurrency',
            description: 'Type safety, optionals, optional binding, guard statements, structs vs classes, protocols and extensions, and async/await with Actors for thread safety.',
            importance: 'Crucial',
            skills: ['Swift 6', 'Optionals & Guard', 'Protocols & Extensions', 'Structured Concurrency (async/await)'],
            resources: [
              { title: 'Apple Swift Documentation', type: 'Documentation', url: 'https://docs.swift.org/swift-book/', isFree: true },
              { title: '100 Days of SwiftUI by Paul Hudson', type: 'Course', url: 'https://www.hackingwithswift.com/100/swiftui', isFree: true }
            ],
            projects: [
              { title: 'Habit Tracker App with SwiftData', description: 'Build an offline-first iOS habit tracking application with streak calculation, local notifications, and SwiftData persistence.', difficulty: 'Intermediate', techStack: ['Swift', 'SwiftUI', 'SwiftData'] }
            ]
          }
        ]
      },
      {
        id: 'ios-stage-2',
        title: 'Stage 2: Declarative UI with SwiftUI & Networking',
        description: 'Design beautiful iOS interfaces with animations and live API data.',
        level: 'SwiftUI & App Store',
        nodes: [
          {
            id: 'node-ios-swiftui-network',
            title: 'SwiftUI Views, Modifiers, URLSession & MVVM',
            description: 'Layout containers (VStack, HStack, LazyVGrid), @State and @Observable macro, URLSession network requests, JSON decoding with Codable, and navigation with NavigationStack.',
            importance: 'Crucial',
            skills: ['SwiftUI Layouts', '@Observable Macro', 'URLSession & Codable', 'MVVM Architecture'],
            resources: [
              { title: 'Apple Developer Tutorials - SwiftUI', type: 'Documentation', url: 'https://developer.apple.com/tutorials/swiftui', isFree: true }
            ],
            projects: [
              { title: 'Movie Discovery App with Trakt/TMDB API', description: 'An iOS app with search debouncing, detail sheets, hero animations, offline watchlist persistence, and unit tests.', difficulty: 'Intermediate', techStack: ['Swift', 'SwiftUI', 'URLSession', 'XCTest'] }
            ]
          }
        ]
      }
    ]
  },

  // 9. Flutter Developer (Skill-based)
  {
    slug: 'flutter-developer',
    title: 'Flutter Cross-Platform Developer',
    subtitle: 'Dart 3, Widget Tree, Riverpod/Bloc, REST APIs, Hive Persistence & Multi-Platform Publishing',
    description: 'Ship native applications to Android, iOS, Web, and Desktop from a single Dart codebase. Master the Flutter rendering engine, responsive layouts, scalable state management with Riverpod, offline data synchronization, and animations.',
    category: 'Mobile & Software',
    roadmapType: 'Skill-based',
    difficulty: 'Beginner Friendly',
    estimatedDuration: '4-6 Months',
    icon: 'Smartphone',
    color: 'from-sky-400 via-blue-500 to-indigo-600',
    tags: ['Flutter', 'Dart', 'Riverpod', 'Bloc', 'Cross-Platform', 'Mobile', 'Firebase', 'REST API'],
    careerPaths: ['Flutter Mobile Developer', 'Cross-Platform App Engineer', 'Mobile Frontend Specialist'],
    salaryRange: '₹8 LPA - ₹24+ LPA',
    prerequisites: ['Basic object-oriented programming concepts'],
    featured: false,
    stages: [
      {
        id: 'flutter-stage-1',
        title: 'Stage 1: Dart 3 Language & Flutter Widget Tree',
        description: 'Master Dart 3 null safety, pattern matching, and Flutter UI components.',
        level: 'UI & Layouts',
        nodes: [
          {
            id: 'node-flutter-widgets',
            title: 'Stateless/Stateful Widgets, Layouts & Theming',
            description: 'Understanding the widget tree, Element tree and RenderObject, rows, columns, stacks, responsive layouts with LayoutBuilder, and Material 3 theming.',
            importance: 'Crucial',
            skills: ['Flutter Widgets', 'Stateless vs Stateful', 'Material 3', 'Responsive Layouts'],
            resources: [
              { title: 'Flutter Official Documentation', type: 'Documentation', url: 'https://docs.flutter.dev/', isFree: true }
            ],
            projects: [
              { title: 'Campus Food Delivery & Dining Menu UI', description: 'Pixel-perfect multi-screen food delivery mobile UI with custom animations and cart drawer.', difficulty: 'Beginner', techStack: ['Flutter', 'Dart'] }
            ]
          }
        ]
      },
      {
        id: 'flutter-stage-2',
        title: 'Stage 2: State Management with Riverpod & Networking',
        description: 'Architect scalable Flutter apps using modern state management and REST APIs.',
        level: 'Architecture',
        nodes: [
          {
            id: 'node-flutter-riverpod-dio',
            title: 'Riverpod 2.0, Dio HTTP Client & Local Caching',
            description: 'Provider types (FutureProvider, NotifierProvider), AsyncValue handling, error states, HTTP requests with Dio, interceptors, and local persistence with Hive.',
            importance: 'Crucial',
            skills: ['Riverpod 2.0', 'Dio HTTP Client', 'Hive Local Storage', 'Repository Pattern'],
            resources: [
              { title: 'Riverpod Documentation', type: 'Documentation', url: 'https://riverpod.dev/', isFree: true }
            ],
            projects: [
              { title: 'Crypto Portfolio Tracker with Live WebSockets', description: 'Cross-platform app tracking real-time crypto prices, offline watchlists, and price alerts using Riverpod and WebSockets.', difficulty: 'Intermediate', techStack: ['Flutter', 'Riverpod', 'Dio', 'Hive'] }
            ]
          }
        ]
      }
    ]
  },

  // 10. Data Analyst (Role-based)
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    subtitle: 'SQL for Analytics, Excel Modeling, Tableau/PowerBI, Python Pandas & Business Insights',
    description: 'Transform raw enterprise data into actionable business strategy. Master complex SQL queries (Window functions, CTEs), data visualization with Tableau and Power BI, exploratory data analysis with Python Pandas, and statistical experimentation / A/B testing.',
    category: 'AI & Data Science',
    roadmapType: 'Role-based',
    difficulty: 'Beginner Friendly',
    estimatedDuration: '3-5 Months',
    icon: 'Database',
    color: 'from-teal-600 via-cyan-600 to-blue-600',
    tags: ['SQL', 'Excel', 'Tableau', 'Power BI', 'Python', 'Pandas', 'Statistics', 'A/B Testing'],
    careerPaths: ['Business Data Analyst', 'Product Analytics Specialist', 'BI Engineer', 'Data Operations Analyst'],
    salaryRange: '₹7 LPA - ₹20+ LPA',
    prerequisites: ['Basic familiarity with mathematics and spreadsheets'],
    featured: true,
    stages: [
      {
        id: 'da-stage-1',
        title: 'Stage 1: Spreadsheet Modeling & Advanced SQL',
        description: 'Wrangle data using enterprise Excel tools and write high-performance analytical SQL.',
        level: 'Core Analytics',
        nodes: [
          {
            id: 'node-da-sql-analytics',
            title: 'Advanced SQL: Window Functions, CTEs & Aggregations',
            description: 'Window functions (ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, running totals), Common Table Expressions (CTEs), multi-table joins, subqueries, and date-time arithmetic.',
            importance: 'Crucial',
            skills: ['SQL Window Functions', 'CTEs', 'Complex Joins', 'Cohort Analysis'],
            resources: [
              { title: 'Mode Analytics SQL Tutorial', type: 'Documentation', url: 'https://mode.com/sql-tutorial/', isFree: true }
            ],
            projects: [
              { title: 'E-Commerce User Retention & Cohort Analysis in SQL', description: 'Write SQL queries to analyze user cohort retention rates, monthly churn, and customer lifetime value (LTV).', difficulty: 'Intermediate', techStack: ['PostgreSQL', 'SQL'] }
            ]
          }
        ]
      },
      {
        id: 'da-stage-2',
        title: 'Stage 2: BI Visualization & Statistical Experimentation',
        description: 'Build executive dashboards with Tableau/Power BI and analyze A/B tests with Python.',
        level: 'Visualization & Stats',
        nodes: [
          {
            id: 'node-da-bi-python',
            title: 'Tableau / Power BI Dashboards & Python EDA',
            description: 'Designing interactive KPI dashboards, DAX measures, automated data refreshes, and using Python (Pandas, Seaborn) to conduct hypothesis testing and evaluate A/B test lift.',
            importance: 'Crucial',
            skills: ['Tableau / Power BI', 'DAX Measures', 'Python Pandas EDA', 'A/B Testing Hypothesis Testing'],
            resources: [
              { title: 'Tableau Free Training Videos', type: 'Video', url: 'https://www.tableau.com/learn/training', isFree: true }
            ],
            projects: [
              { title: 'SaaS Executive Metrics Dashboard & A/B Test Report', description: 'An interactive Tableau dashboard visualizing MRR, churn, and conversion funnel, accompanied by a statistical A/B test analysis in Python.', difficulty: 'Intermediate', techStack: ['Tableau', 'Python', 'Pandas', 'Statsmodels'] }
            ]
          }
        ]
      }
    ]
  },

  // 11. QA & Test Automation Engineer (Role-based)
  {
    slug: 'qa-automation-engineer',
    title: 'QA & Test Automation Engineer',
    subtitle: 'Testing Pyramids, Playwright, Cypress, API Testing, k6 Performance & CI/CD Quality Gates',
    description: 'Ensure zero-defect software releases. Master the full test automation lifecycle: end-to-end browser automation with Playwright and Cypress, API contract testing with Postman/Newman, load testing with k6, and embedding automated test suites into GitHub Actions CI/CD pipelines.',
    category: 'Core CS & Placement',
    roadmapType: 'Role-based',
    difficulty: 'Beginner Friendly',
    estimatedDuration: '4-5 Months',
    icon: 'Shield',
    color: 'from-emerald-600 via-green-600 to-teal-700',
    tags: ['Playwright', 'Cypress', 'Selenium', 'Postman', 'k6', 'Jest', 'CI/CD', 'Test Automation'],
    careerPaths: ['QA Automation Engineer', 'Software Development Engineer in Test (SDET)', 'Quality Assurance Lead'],
    salaryRange: '₹7 LPA - ₹22+ LPA',
    prerequisites: ['Basic JavaScript or Python syntax'],
    featured: false,
    stages: [
      {
        id: 'qa-stage-1',
        title: 'Stage 1: Testing Theory & End-to-End Automation with Playwright',
        description: 'Understand testing pyramids and automate web applications with modern Playwright.',
        level: 'E2E Testing',
        nodes: [
          {
            id: 'node-qa-playwright',
            title: 'Modern Web Automation with Playwright & Page Object Model',
            description: 'Automating Chromium, Firefox, and WebKit browsers, reliable locators, auto-waiting, visual regression testing, network interception, and Page Object Model (POM) pattern.',
            importance: 'Crucial',
            skills: ['Playwright', 'Page Object Model', 'Visual Regression', 'Network Mocking'],
            resources: [
              { title: 'Playwright Official Documentation', type: 'Documentation', url: 'https://playwright.dev/docs/intro', isFree: true }
            ],
            projects: [
              { title: 'End-to-End Test Suite for E-Commerce Checkout', description: 'Write automated tests verifying user authentication, adding items to cart, checkout validation, and edge-case handling in parallel.', difficulty: 'Intermediate', techStack: ['Playwright', 'TypeScript'] }
            ]
          }
        ]
      },
      {
        id: 'qa-stage-2',
        title: 'Stage 2: API Automation & Load Testing in CI/CD',
        description: 'Test backend APIs and verify system resilience under high concurrent traffic.',
        level: 'API & Performance',
        nodes: [
          {
            id: 'node-qa-api-k6',
            title: 'API Testing with Postman/Newman & Load Testing with k6',
            description: 'REST API assertion scripts, JSON schema validation, running test suites in headless CI via Newman, and writing distributed load testing scripts in k6 to measure p95/p99 response times.',
            importance: 'Crucial',
            skills: ['Postman & Newman', 'k6 Load Testing', 'GitHub Actions Test Automation', 'SLA Verification'],
            resources: [
              { title: 'k6 Load Testing Documentation', type: 'Documentation', url: 'https://k6.io/docs/', isFree: true }
            ],
            projects: [
              { title: 'Automated CI/CD Quality Gate with k6 & Playwright', description: 'Configure a GitHub Actions pipeline that blocks merges if API latency exceeds 200ms or if end-to-end tests fail.', difficulty: 'Intermediate', techStack: ['k6', 'Playwright', 'GitHub Actions'] }
            ]
          }
        ]
      }
    ]
  },

  // 12. System Design & Distributed Systems (Skill-based)
  {
    slug: 'system-design-distributed-systems',
    title: 'System Design & Distributed Systems',
    subtitle: 'Scalability, Caching, Load Balancing, Database Sharding, Event-Driven Kafka & High Availability',
    description: 'Learn how to architect internet-scale platforms serving hundreds of millions of users (like Netflix, Uber, and WhatsApp). Master horizontal scaling, reverse proxies, distributed caching, database replication, CAP theorem, message queues, rate limiters, and microservice resilience patterns.',
    category: 'Core CS & Placement',
    roadmapType: 'Skill-based',
    difficulty: 'Advanced',
    estimatedDuration: '4-6 Months',
    icon: 'Binary',
    color: 'from-blue-700 via-indigo-700 to-purple-800',
    tags: ['System Design', 'Distributed Systems', 'Kafka', 'Redis', 'Microservices', 'Load Balancing', 'Sharding', 'CAP Theorem'],
    careerPaths: ['Senior Software Engineer', 'System Architect', 'Distributed Systems Engineer', 'Staff Engineer'],
    salaryRange: '₹18 LPA - ₹45+ LPA',
    prerequisites: ['Solid understanding of web backends and databases'],
    featured: true,
    stages: [
      {
        id: 'sd-stage-1',
        title: 'Stage 1: Scalability Foundations & Architectural Patterns',
        description: 'Deconstruct load balancing, proxy layers, caching tiers, and database bottlenecks.',
        level: 'Scalability Foundations',
        nodes: [
          {
            id: 'node-sd-caching-proxies',
            title: 'Load Balancing, Reverse Proxies & Distributed Caching',
            description: 'Layer 4 vs Layer 7 load balancing (Consistent Hashing), CDN edge caching, Redis caching strategies (Cache-Aside, Write-Through, Write-Behind), and solving the Thundering Herd problem.',
            importance: 'Crucial',
            skills: ['Consistent Hashing', 'Reverse Proxies (Nginx)', 'Redis Cache Strategies', 'Thundering Herd Mitigation'],
            resources: [
              { title: 'System Design Primer by Donne Martin', type: 'GitHub', url: 'https://github.com/donnemartin/system-design-primer', isFree: true }
            ],
            projects: [
              { title: 'Consistent Hashing Load Balancer Simulator', description: 'Implement consistent hashing with virtual nodes in code to balance traffic across dynamically resizing server clusters.', difficulty: 'Intermediate', techStack: ['Python / Go', 'Algorithms'] }
            ]
          }
        ]
      },
      {
        id: 'sd-stage-2',
        title: 'Stage 2: Distributed Data & Messaging Systems',
        description: 'Handle partitioning, replication, distributed consensus, and event streaming.',
        level: 'Distributed Architecture',
        nodes: [
          {
            id: 'node-sd-sharding-kafka',
            title: 'Database Sharding, CAP Theorem & Apache Kafka',
            description: 'Horizontal database sharding, master-slave vs master-master replication, CAP & PACELC theorems, eventual consistency, Kafka partition balancing, and distributed rate limiting (Token Bucket).',
            importance: 'Crucial',
            skills: ['Database Sharding', 'CAP & PACELC Theorems', 'Event Streaming with Kafka', 'Distributed Rate Limiting'],
            resources: [
              { title: 'Designing Data-Intensive Applications by Martin Kleppmann', type: 'Book', url: 'https://dataintensive.net/', isFree: false }
            ],
            projects: [
              { title: 'Architecture Blueprint: Scalable URL Shortener or Twitter Clone', description: 'Produce complete architectural diagrams, capacity estimation calculations, database schemas, and API contracts.', difficulty: 'Advanced', techStack: ['System Architecture', 'Mermaid.js', 'Capacity Estimation'] }
            ]
          }
        ]
      }
    ]
  },

  // 13. Docker & Kubernetes (Skill-based)
  {
    slug: 'docker-kubernetes',
    title: 'Docker & Kubernetes (Containerization)',
    subtitle: 'Linux Containers, Multi-Stage Dockerfiles, Pods, Deployments, Services, Helm & GitOps',
    description: 'The industry-standard containerization and orchestration curriculum. Go from understanding Linux namespaces and cgroups to writing production-optimized multi-stage Dockerfiles, orchestrating multi-service stacks with Docker Compose, and deploying auto-scaling Kubernetes clusters with Helm and ArgoCD.',
    category: 'Cloud & DevOps',
    roadmapType: 'Skill-based',
    difficulty: 'Intermediate',
    estimatedDuration: '4-6 Months',
    icon: 'Cloud',
    color: 'from-blue-600 via-sky-600 to-indigo-600',
    tags: ['Docker', 'Kubernetes', 'Helm', 'ArgoCD', 'Containers', 'DevOps', 'Microservices', 'Linux'],
    careerPaths: ['DevOps Engineer', 'Kubernetes Administrator (CKA)', 'Platform Engineer', 'Cloud Infrastructure Architect'],
    salaryRange: '₹12 LPA - ₹32+ LPA',
    prerequisites: ['Basic Linux terminal command knowledge'],
    featured: true,
    stages: [
      {
        id: 'k8s-stage-1',
        title: 'Stage 1: Container Mechanics & Production Docker',
        description: 'Understand how containers isolate processes and build lightweight, secure images.',
        level: 'Containers',
        nodes: [
          {
            id: 'node-k8s-docker-core',
            title: 'Linux Namespaces, Multi-Stage Builds & Compose',
            description: 'Linux isolation mechanics (namespaces, cgroups), writing multi-stage Dockerfiles that shrink images from 1GB to 50MB, security scanning with Trivy, and orchestrating multi-container stacks with Docker Compose.',
            importance: 'Crucial',
            skills: ['Docker Multi-Stage Builds', 'Docker Compose', 'Security Hardening', 'Volume Persistence'],
            resources: [
              { title: 'Docker Official Documentation', type: 'Documentation', url: 'https://docs.docker.com/', isFree: true }
            ],
            projects: [
              { title: 'Multi-Tier Microservice Dockerization with Compose', description: 'Containerize a React frontend, Node.js API, PostgreSQL database, and Redis cache with health checks and restart policies.', difficulty: 'Beginner', techStack: ['Docker', 'Docker Compose'] }
            ]
          }
        ]
      },
      {
        id: 'k8s-stage-2',
        title: 'Stage 2: Kubernetes Orchestration & GitOps Deployment',
        description: 'Deploy, auto-scale, and manage resilient applications on Kubernetes.',
        level: 'Kubernetes & GitOps',
        nodes: [
          {
            id: 'node-k8s-core-orchestration',
            title: 'Pods, Deployments, Services, Ingress & Helm Charts',
            description: 'Kubernetes control plane architecture, Deployments with rolling updates, Services (ClusterIP, NodePort), Ingress controllers, ConfigMaps, Secrets, PersistentVolumes, and templating with Helm.',
            importance: 'Crucial',
            skills: ['Kubernetes Manifests', 'Pods & Deployments', 'Ingress & TLS', 'Helm Package Manager'],
            resources: [
              { title: 'Kubernetes Official Documentation', type: 'Documentation', url: 'https://kubernetes.io/docs/home/', isFree: true }
            ],
            projects: [
              { title: 'Production Helm Chart & GitOps Pipeline with ArgoCD', description: 'Package an application into a custom Helm chart with horizontal pod autoscaling (HPA) and deploy via GitOps using ArgoCD.', difficulty: 'Advanced', techStack: ['Kubernetes', 'Helm', 'ArgoCD', 'Minikube / Kind'] }
            ]
          }
        ]
      }
    ]
  },

  // 14. Prompt Engineering & Generative AI (Skill-based)
  {
    slug: 'prompt-engineering-genai',
    title: 'Prompt Engineering & Generative AI',
    subtitle: 'LLM Mechanics, Advanced Prompting, Vector DBs, RAG Architectures, AI Agents & LangChain',
    description: 'Master the cutting edge of AI engineering. Learn how Large Language Models work under the hood, craft prompt techniques (Chain-of-Thought, ReAct, Few-Shot), integrate vector databases (Pinecone, Chroma), build production Retrieval-Augmented Generation (RAG) pipelines, and deploy autonomous AI agents with LangChain and LlamaIndex.',
    category: 'AI & Data Science',
    roadmapType: 'Skill-based',
    difficulty: 'Beginner Friendly',
    estimatedDuration: '3-5 Months',
    icon: 'BrainCircuit',
    color: 'from-purple-600 via-pink-600 to-rose-600',
    tags: ['LLM', 'Prompt Engineering', 'RAG', 'Vector Database', 'LangChain', 'LlamaIndex', 'OpenAI', 'Gemini'],
    careerPaths: ['Generative AI Engineer', 'AI Solutions Architect', 'Prompt Engineer', 'AI Application Developer'],
    salaryRange: '₹12 LPA - ₹35+ LPA',
    prerequisites: ['Basic Python or JavaScript programming skills'],
    featured: true,
    stages: [
      {
        id: 'genai-stage-1',
        title: 'Stage 1: Foundation Models & Prompt Engineering Techniques',
        description: 'Understand tokens, context windows, and advanced structured prompting patterns.',
        level: 'Prompt Foundations',
        nodes: [
          {
            id: 'node-genai-prompting',
            title: 'Tokens, Context Windows, Few-Shot & Chain-of-Thought',
            description: 'How autoregressive transformers generate tokens, temperature and top-p sampling, system prompt design, Few-Shot in-context learning, Chain-of-Thought (CoT), and ReAct prompting.',
            importance: 'Crucial',
            skills: ['Few-Shot Prompting', 'Chain-of-Thought (CoT)', 'ReAct Framework', 'Function / Tool Calling'],
            resources: [
              { title: 'Learn Prompting - Free Open Source Course', type: 'Course', url: 'https://learnprompting.org/', isFree: true },
              { title: 'Google DeepMind Prompt Engineering Guide', type: 'Documentation', url: 'https://ai.google.dev/gemini-api/docs/prompting-strategies', isFree: true }
            ],
            projects: [
              { title: 'Structured Data Extraction Agent with Tool Calling', description: 'Build an automated pipeline that ingests unstructured PDF contracts and outputs strictly typed JSON schemas using LLM function calling.', difficulty: 'Beginner', techStack: ['Python', 'OpenAI / Gemini API', 'Pydantic'] }
            ]
          }
        ]
      },
      {
        id: 'genai-stage-2',
        title: 'Stage 2: Retrieval-Augmented Generation (RAG) & Vector Databases',
        description: 'Ground LLMs in enterprise data using dense embeddings and semantic search.',
        level: 'RAG & Vector Search',
        nodes: [
          {
            id: 'node-genai-rag-vectordb',
            title: 'Vector Embeddings, Chunking Strategies & Vector DBs (Chroma/Pinecone)',
            description: 'Semantic vector representations, document chunking (recursive, semantic, windowing), vector similarity metrics (Cosine, Dot Product), indexing with HNSW, and hybrid search (BM25 + Dense).',
            importance: 'Crucial',
            skills: ['Dense Vector Embeddings', 'Chunking Strategies', 'ChromaDB / Pinecone', 'Hybrid Search & Reranking'],
            resources: [
              { title: 'Pinecone Learning Center - What is Vector Search?', type: 'Documentation', url: 'https://www.pinecone.io/learn/vector-search-basics/', isFree: true }
            ],
            projects: [
              { title: 'Enterprise Documentation Q&A Bot with Citations', description: 'Full RAG system that indexes technical documentation into a vector database, searches top chunks, and generates cited answers.', difficulty: 'Intermediate', techStack: ['Python', 'LangChain', 'ChromaDB', 'Gemini / OpenAI API'] }
            ]
          }
        ]
      },
      {
        id: 'genai-stage-3',
        title: 'Stage 3: Autonomous AI Agents & Production Evaluation',
        description: 'Build multi-turn agents capable of tool usage, web browsing, and code execution.',
        level: 'Agents & Eval',
        nodes: [
          {
            id: 'node-genai-agents-eval',
            title: 'AI Agents (LangChain/LlamaIndex) & RAG Evaluation (RAGAS)',
            description: 'Multi-agent collaboration, memory persistence (short-term vs episodic), guardrails (NeMo Guardrails, Llama Guard), and benchmarking hallucination rates with the RAGAS evaluation framework.',
            importance: 'Crucial',
            skills: ['AI Agents Architecture', 'Memory & State Graphs', 'LLM Guardrails', 'RAGAS Evaluation Framework'],
            resources: [
              { title: 'LangChain Official Documentation', type: 'Documentation', url: 'https://python.langchain.com/docs/get_started/introduction', isFree: true }
            ],
            projects: [
              { title: 'Autonomous Market Research Agent with Web Browsing', description: 'An agent that searches live financial news, verifies citations, executes Python calculations, and generates a structured PDF brief.', difficulty: 'Advanced', techStack: ['LangGraph', 'Python', 'DuckDuckGo API', 'RAGAS'] }
            ]
          }
        ]
      }
    ]
  },

  // 15. PostgreSQL & Database Administrator (Skill-based)
  {
    slug: 'postgresql-dba',
    title: 'PostgreSQL & Database Administrator',
    subtitle: 'Relational Modeling, Indexing Internals, EXPLAIN ANALYZE, MVCC, Replication & High Availability',
    description: 'The comprehensive database engineering blueprint. Master relational database theory, write high-performance SQL with window functions and CTEs, understand B-Tree, GIN, and GiST indexing internals, optimize slow queries with EXPLAIN ANALYZE, handle transactions and locks, and configure streaming replication with PgBouncer.',
    category: 'Databases & Architecture',
    roadmapType: 'Skill-based',
    difficulty: 'Intermediate',
    estimatedDuration: '4-6 Months',
    icon: 'Database',
    color: 'from-indigo-600 via-blue-600 to-cyan-700',
    tags: ['PostgreSQL', 'SQL', 'Indexing', 'Query Optimization', 'MVCC', 'Replication', 'PgBouncer', 'Database Design'],
    careerPaths: ['Database Administrator (DBA)', 'Database Engineer', 'Backend Platform Architect', 'Data Infrastructure Engineer'],
    salaryRange: '₹11 LPA - ₹30+ LPA',
    prerequisites: ['Basic SQL queries (SELECT, INSERT, UPDATE, DELETE)'],
    featured: false,
    stages: [
      {
        id: 'pg-stage-1',
        title: 'Stage 1: Indexing Internals & Query Execution Plans',
        description: 'Understand how PostgreSQL stores pages on disk and executes queries.',
        level: 'Query Optimization',
        nodes: [
          {
            id: 'node-pg-indexing-explain',
            title: 'B-Tree, GIN & GiST Indexes & EXPLAIN ANALYZE',
            description: 'Page layout on disk, B-Tree index traversal, GIN indexes for full-text search and JSONB, reading EXPLAIN (ANALYZE, BUFFERS) execution plans, sequential scans vs index scans, and heap fetches.',
            importance: 'Crucial',
            skills: ['EXPLAIN ANALYZE Interpretation', 'B-Tree & GIN Indexes', 'Index-Only Scans', 'JSONB Querying'],
            resources: [
              { title: 'Use The Index, Luke! - Guide to Database Performance', type: 'Documentation', url: 'https://use-the-index-luke.com/', isFree: true }
            ],
            projects: [
              { title: 'Query Tuning Benchmark: 100x Speedup on 10M Row Table', description: 'Analyze slow queries on a 10-million row dataset, create appropriate composite and partial indexes, and document execution plan improvements.', difficulty: 'Intermediate', techStack: ['PostgreSQL', 'Docker', 'pgbench'] }
            ]
          }
        ]
      },
      {
        id: 'pg-stage-2',
        title: 'Stage 2: Transactions, MVCC, Replication & Connection Pooling',
        description: 'Guarantee data integrity under heavy concurrent write loads.',
        level: 'High Availability',
        nodes: [
          {
            id: 'node-pg-mvcc-replication',
            title: 'MVCC, VACUUM, Streaming Replication & PgBouncer',
            description: 'Multi-Version Concurrency Control (MVCC), transaction isolation levels (Read Committed vs Serializable), VACUUM and dead tuples, WAL archiving, physical streaming replication, and PgBouncer connection pooling.',
            importance: 'Crucial',
            skills: ['MVCC & VACUUM Tuning', 'Streaming Replication', 'PgBouncer Connection Pooling', 'WAL Archiving'],
            resources: [
              { title: 'PostgreSQL Official Documentation on High Availability', type: 'Documentation', url: 'https://www.postgresql.org/docs/current/high-availability.html', isFree: true }
            ],
            projects: [
              { title: 'High-Availability PostgreSQL Cluster with Primary-Replica & PgBouncer', description: 'Deploy a replicated PostgreSQL setup using Docker with automatic read-replica routing and PgBouncer connection pooling.', difficulty: 'Advanced', techStack: ['PostgreSQL', 'PgBouncer', 'Docker Compose'] }
            ]
          }
        ]
      }
    ]
  },

  // 16. Blockchain & Web3 Developer (Role-based)
  {
    slug: 'blockchain-web3',
    title: 'Blockchain & Web3 Developer',
    subtitle: 'Cryptography, Ethereum & EVM, Solidity Smart Contracts, Foundry, Hardhat & DApps',
    description: 'Build decentralized, tamper-proof applications on the Ethereum blockchain. Learn asymmetric cryptography, consensus algorithms, write and audit Solidity smart contracts (ERC-20, ERC-721 NFTs), test contracts with Foundry and Hardhat, and connect smart contracts to React frontends using Ethers.js and Wagmi.',
    category: 'Core CS & Placement',
    roadmapType: 'Role-based',
    difficulty: 'Intermediate',
    estimatedDuration: '5-7 Months',
    icon: 'Binary',
    color: 'from-violet-600 via-purple-600 to-indigo-700',
    tags: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3', 'Foundry', 'Hardhat', 'Ethers.js', 'DeFi'],
    careerPaths: ['Smart Contract Developer', 'Web3 Full Stack Engineer', 'Blockchain Security Auditor', 'DeFi Protocol Engineer'],
    salaryRange: '₹12 LPA - ₹36+ LPA',
    prerequisites: ['Basic understanding of JavaScript and object-oriented programming'],
    featured: false,
    stages: [
      {
        id: 'web3-stage-1',
        title: 'Stage 1: Cryptography & Solidity Smart Contracts',
        description: 'Understand blockchain mechanics and write verified smart contracts.',
        level: 'Smart Contracts',
        nodes: [
          {
            id: 'node-web3-solidity-core',
            title: 'Ethereum Virtual Machine (EVM), Solidity & OpenZeppelin',
            description: 'Gas economics, EVM storage vs memory, writing Solidity contracts, function visibility, modifiers, events, and implementing standard ERC-20 and ERC-721 token standards with OpenZeppelin.',
            importance: 'Crucial',
            skills: ['Solidity Programming', 'EVM Gas Optimization', 'ERC-20 & ERC-721 Standards', 'OpenZeppelin Contracts'],
            resources: [
              { title: 'Solidity Official Documentation', type: 'Documentation', url: 'https://docs.soliditylang.org/', isFree: true },
              { title: 'CryptoZombies - Interactive Solidity School', type: 'Course', url: 'https://cryptozombies.io/', isFree: true }
            ],
            projects: [
              { title: 'Decentralized Crowdfunding Smart Contract (Kickstarter on Chain)', description: 'Write and test a crowdfunding smart contract with milestone disbursements, contributor refunds, and deadline enforcement in Solidity.', difficulty: 'Intermediate', techStack: ['Solidity', 'Foundry', 'OpenZeppelin'] }
            ]
          }
        ]
      },
      {
        id: 'web3-stage-2',
        title: 'Stage 2: Professional Testing with Foundry & DApp Frontend',
        description: 'Test contracts with fuzzing and connect them to React web applications.',
        level: 'Foundry & DApps',
        nodes: [
          {
            id: 'node-web3-foundry-dapp',
            title: 'Foundry Testing (Fuzzing) & DApp Frontend with Wagmi / Viem',
            description: 'Writing fast unit and invariant fuzz tests in pure Solidity with Foundry, deploying to testnets (Sepolia), and building a modern React interface with Wagmi, Viem, and RainbowKit.',
            importance: 'Crucial',
            skills: ['Foundry Forge & Cast', 'Fuzz Testing', 'Wagmi & Viem', 'MetaMask / WalletConnect Integration'],
            resources: [
              { title: 'Foundry Book Documentation', type: 'Documentation', url: 'https://book.getfoundry.sh/', isFree: true }
            ],
            projects: [
              { title: 'Full-Stack Decentralized Voting / Governance DApp', description: 'End-to-end decentralized governance platform where token holders create proposals, vote with signature verification, and execute results.', difficulty: 'Advanced', techStack: ['Solidity', 'Foundry', 'React', 'Wagmi', 'Tailwind'] }
            ]
          }
        ]
      }
    ]
  }
];

module.exports = moreRoadmapsData;
