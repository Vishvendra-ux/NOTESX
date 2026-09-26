export const BTECH_CATEGORIES = [
  'All Featured',
  'Computer & AI',
  'Electronics & Electrical',
  'Mechanical & Allied',
  'Civil & Infrastructure',
  'Chemical & Materials',
  'All 47 Branches'
];

export const BTECH_BRANCHES = [
  // ── 1. Computer Science & AI Group ──
  {
    id: 'cse',
    name: 'Computer Science and Engineering',
    shortCode: 'CSE',
    category: 'Computer & AI',
    featured: true,
    color: 'from-blue-600 to-indigo-600',
    iconName: 'Laptop',
    description: 'Core computing, algorithms, systems, compilers, networks, and software architecture.',
    subjects: [
      'Data Structures & Algorithms',
      'Operating Systems',
      'Database Management Systems',
      'Computer Networks',
      'Theory of Computation',
      'Compiler Design',
      'Computer Organization & Architecture',
      'Software Engineering',
      'Discrete Mathematics',
      'Artificial Intelligence',
      'Cyber Security',
      'Cloud Computing'
    ]
  },
  {
    id: 'it',
    name: 'Information Technology',
    shortCode: 'IT',
    category: 'Computer & AI',
    featured: true,
    color: 'from-cyan-600 to-blue-600',
    iconName: 'Globe',
    description: 'Enterprise computing, internet technologies, web engineering, and database systems.',
    subjects: [
      'Web Technologies & Full Stack',
      'Database Systems & Administration',
      'Computer Networks & Security',
      'Information Storage & Management',
      'Object Oriented Programming with Java',
      'Cloud & DevOps Engineering',
      'Mobile Application Development',
      'Data Mining & Warehousing'
    ]
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    shortCode: 'AI',
    category: 'Computer & AI',
    featured: true,
    color: 'from-purple-600 to-indigo-600',
    iconName: 'Brain',
    description: 'Heuristic search, reasoning, autonomous agents, neural models, and cognitive computing.',
    subjects: [
      'Foundations of AI',
      'Search Algorithms & Problem Solving',
      'Knowledge Representation & Logic',
      'Deep Learning & Neural Networks',
      'Natural Language Processing',
      'Computer Vision',
      'Reinforcement Learning',
      'AI Ethics & Explainability'
    ]
  },
  {
    id: 'aiml',
    name: 'Artificial Intelligence and Machine Learning',
    shortCode: 'AIML',
    category: 'Computer & AI',
    featured: true,
    color: 'from-violet-600 to-purple-600',
    iconName: 'Sparkles',
    description: 'Supervised/unsupervised models, computer vision, deep architectures, and predictive analytics.',
    subjects: [
      'Machine Learning Algorithms',
      'Deep Learning Architectures',
      'Supervised & Unsupervised Learning',
      'Natural Language Processing (NLP)',
      'Computer Vision with OpenCV',
      'TensorFlow & PyTorch Mastery',
      'Probabilistic Graphical Models',
      'AI in Robotics'
    ]
  },
  {
    id: 'data-science',
    name: 'Data Science',
    shortCode: 'DS',
    category: 'Computer & AI',
    featured: true,
    color: 'from-emerald-600 to-teal-600',
    iconName: 'Database',
    description: 'Statistical modeling, big data pipelines, visualization, and distributed analytics.',
    subjects: [
      'Statistical Inference for Data Science',
      'Applied Linear Algebra & Calculus',
      'Big Data Analytics (Hadoop & Spark)',
      'Data Wrangling & Visualization',
      'Predictive Modeling & Regression',
      'Time Series Analysis & Forecasting',
      'Business Intelligence & Reporting'
    ]
  },
  {
    id: 'csds',
    name: 'Computer Science and Data Science',
    shortCode: 'CSDS',
    category: 'Computer & AI',
    featured: false,
    color: 'from-teal-600 to-emerald-600',
    iconName: 'BarChart',
    description: 'Synergy of core computer systems engineering and modern large-scale data analytics.',
    subjects: [
      'Data Structures with Python',
      'DBMS & SQL for Analytics',
      'Big Data Engineering',
      'Machine Learning for Data Science',
      'Distributed Data Systems',
      'Data Ethics & Privacy'
    ]
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    shortCode: 'Cyber',
    category: 'Computer & AI',
    featured: true,
    color: 'from-rose-600 to-red-600',
    iconName: 'Shield',
    description: 'Defensive computing, cryptographic protocols, penetration testing, and security auditing.',
    subjects: [
      'Network Security & Cryptography',
      'Ethical Hacking & Penetration Testing',
      'Cyber Forensics & Incident Response',
      'Web Application Security',
      'Malware Analysis & Reverse Engineering',
      'Cloud Security Architecture',
      'Information Security Auditing'
    ]
  },
  {
    id: 'information-security',
    name: 'Information Security',
    shortCode: 'InfoSec',
    category: 'Computer & AI',
    featured: false,
    color: 'from-red-600 to-orange-600',
    iconName: 'Lock',
    description: 'Information risk management, authentication protocols, and enterprise data defense.',
    subjects: [
      'Cryptography & Network Security',
      'Information Risk Management',
      'Access Control & Identity Systems',
      'Database & Endpoint Security',
      'Security Policies & ISO Compliance'
    ]
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    shortCode: 'SE',
    category: 'Computer & AI',
    featured: false,
    color: 'from-indigo-600 to-sky-600',
    iconName: 'Code',
    description: 'SDLC methodologies, design patterns, microservices, testing, and continuous delivery.',
    subjects: [
      'Agile Methodologies & Scrum',
      'Software Architecture & Design Patterns',
      'Software Quality Assurance & Testing',
      'DevOps & CI/CD Pipelines',
      'Requirements Engineering & Modeling'
    ]
  },
  {
    id: 'csit',
    name: 'Computer Science and Information Technology',
    shortCode: 'CSIT',
    category: 'Computer & AI',
    featured: false,
    color: 'from-blue-600 to-teal-600',
    iconName: 'Layers',
    description: 'Integrated studies of computation theory and information system architectures.',
    subjects: [
      'Data Structures & Algorithms',
      'Web & Cloud Architecture',
      'Network Protocols & Admin',
      'Database Engineering',
      'Software Design Patterns'
    ]
  },
  {
    id: 'computer-engineering',
    name: 'Computer Engineering',
    shortCode: 'CE',
    category: 'Computer & AI',
    featured: false,
    color: 'from-sky-600 to-indigo-600',
    iconName: 'Cpu',
    description: 'Hardware-software codesign, microarchitecture, digital logic, and firmware engineering.',
    subjects: [
      'Digital Logic & Microprocessors',
      'Embedded Software Engineering',
      'Computer Architecture & Assembly',
      'Operating Systems Internals',
      'VLSI & Hardware Synthesis'
    ]
  },

  // ── 2. Electronics & Electrical Group ──
  {
    id: 'ece',
    name: 'Electronics and Communication Engineering',
    shortCode: 'ECE',
    category: 'Electronics & Electrical',
    featured: true,
    color: 'from-amber-600 to-orange-600',
    iconName: 'Radio',
    description: 'Telecommunications, signal processing, RF design, VLSI, and embedded hardware.',
    subjects: [
      'Digital Signal Processing (DSP)',
      'Analog & Digital Communication',
      'VLSI Design & Embedded Systems',
      'Signals & Systems',
      'Microprocessors & Microcontrollers (8051/ARM)',
      'Electromagnetic Field Theory',
      'Wireless & Mobile Communication',
      'Control Systems'
    ]
  },
  {
    id: 'ee',
    name: 'Electrical Engineering',
    shortCode: 'EE',
    category: 'Electronics & Electrical',
    featured: true,
    color: 'from-yellow-500 to-amber-600',
    iconName: 'Zap',
    description: 'Power generation, high voltage networks, electrical machines, and drives.',
    subjects: [
      'Electrical Machines I & II',
      'Power Systems Engineering',
      'Control Systems Engineering',
      'Power Electronics & Drives',
      'Circuit Theory & Networks',
      'High Voltage Engineering',
      'Renewable Energy Systems'
    ]
  },
  {
    id: 'eee',
    name: 'Electrical and Electronics Engineering',
    shortCode: 'EEE',
    category: 'Electronics & Electrical',
    featured: false,
    color: 'from-amber-500 to-yellow-600',
    iconName: 'Activity',
    description: 'Comprehensive study of high-power grids combined with low-voltage electronics.',
    subjects: [
      'Electric Circuit Analysis',
      'Power Electronics',
      'Digital Electronics & Logic Design',
      'Electrical Measurement & Instrumentation',
      'Power System Protection',
      'Microcontroller Interfacing'
    ]
  },
  {
    id: 'electronics-engineering',
    name: 'Electronics Engineering',
    shortCode: 'ELE',
    category: 'Electronics & Electrical',
    featured: false,
    color: 'from-orange-500 to-amber-600',
    iconName: 'Cpu',
    description: 'Semiconductor physics, solid-state devices, and analog/digital circuitry.',
    subjects: [
      'Electronic Circuit Analysis',
      'Semiconductor Devices & Physics',
      'Linear Integrated Circuits (Op-Amps)',
      'Microprocessors & Microcontrollers',
      'Analog Communications'
    ]
  },
  {
    id: 'eie',
    name: 'Electronics and Instrumentation Engineering',
    shortCode: 'EIE',
    category: 'Electronics & Electrical',
    featured: false,
    color: 'from-teal-600 to-cyan-600',
    iconName: 'Sliders',
    description: 'Industrial sensors, transducers, automation instruments, and calibration.',
    subjects: [
      'Transducers & Sensors',
      'Industrial Instrumentation',
      'Biomedical Instrumentation',
      'Process Control Systems',
      'Virtual Instrumentation (LabVIEW)'
    ]
  },
  {
    id: 'ice',
    name: 'Instrumentation and Control Engineering',
    shortCode: 'ICE',
    category: 'Electronics & Electrical',
    featured: false,
    color: 'from-cyan-600 to-emerald-600',
    iconName: 'Gauge',
    description: 'Feedback control, PLC/SCADA systems, telemetry, and industrial process loops.',
    subjects: [
      'Control Systems Theory',
      'Process Instrumentation & Control',
      'PLC & SCADA Industrial Systems',
      'Signal Conditioning & Telemetry',
      'Modern Control Engineering'
    ]
  },

  // ── 3. Mechanical & Allied Group ──
  {
    id: 'me',
    name: 'Mechanical Engineering',
    shortCode: 'ME',
    category: 'Mechanical & Allied',
    featured: true,
    color: 'from-slate-700 to-slate-900',
    iconName: 'Cog',
    description: 'Thermodynamics, mechanics of solids, machinery design, fluid dynamics, and manufacturing.',
    subjects: [
      'Engineering Thermodynamics',
      'Fluid Mechanics & Hydraulic Machinery',
      'Strength of Materials (SOM)',
      'Theory of Machines (TOM)',
      'Heat & Mass Transfer',
      'Manufacturing Technology & CNC',
      'Design of Machine Elements',
      'CAD/CAM/CAE'
    ]
  },
  {
    id: 'aerospace',
    name: 'Aerospace Engineering',
    shortCode: 'ASE',
    category: 'Mechanical & Allied',
    featured: true,
    color: 'from-blue-600 to-sky-700',
    iconName: 'Rocket',
    description: 'Atmospheric and space flight, propulsion, orbital mechanics, and avionics.',
    subjects: [
      'Aerodynamics & Compressible Flow',
      'Flight Mechanics & Aircraft Stability',
      'Aerospace Propulsion (Jets & Rockets)',
      'Aircraft Structures & Materials',
      'Space Mechanics & Orbital Dynamics',
      'Avionics & Flight Navigation',
      'Computational Fluid Dynamics (CFD)'
    ]
  },
  {
    id: 'aeronautical',
    name: 'Aeronautical Engineering',
    shortCode: 'ANE',
    category: 'Mechanical & Allied',
    featured: false,
    color: 'from-sky-600 to-blue-600',
    iconName: 'Plane',
    description: 'Aircraft design, sub/supersonic aerodynamics, aero structures, and propulsion.',
    subjects: [
      'Aerodynamics I & II',
      'Aircraft Propulsion Systems',
      'Aeronautical Structures',
      'Flight Dynamics & Control',
      'Aircraft Maintenance & Airworthiness'
    ]
  },
  {
    id: 'automobile',
    name: 'Automobile Engineering',
    shortCode: 'AUE',
    category: 'Mechanical & Allied',
    featured: false,
    color: 'from-red-600 to-rose-700',
    iconName: 'Car',
    description: 'Vehicle dynamics, IC engines, EV drivetrains, transmission, and chassis engineering.',
    subjects: [
      'Automotive Chassis & Suspension',
      'Internal Combustion (IC) Engines',
      'Automotive Transmission & Drivetrain',
      'Electric & Hybrid Vehicles (EV)',
      'Vehicle Dynamics & Crash Safety'
    ]
  },
  {
    id: 'industrial',
    name: 'Industrial Engineering',
    shortCode: 'IE',
    category: 'Mechanical & Allied',
    featured: false,
    color: 'from-zinc-600 to-slate-700',
    iconName: 'Factory',
    description: 'Operations research, ergonomics, supply chains, work-study, and lean production.',
    subjects: [
      'Operations Research & Optimization',
      'Work Study & Ergonomics',
      'Supply Chain Management & Logistics',
      'Quality Control & Six Sigma',
      'Plant Layout & Material Handling'
    ]
  },
  {
    id: 'production',
    name: 'Production Engineering',
    shortCode: 'PE',
    category: 'Mechanical & Allied',
    featured: false,
    color: 'from-neutral-600 to-stone-700',
    iconName: 'Hammer',
    description: 'Metal forming, casting, welding, CNC machining, metrology, and tooling design.',
    subjects: [
      'Metal Cutting & Machine Tools',
      'Tool Design & Metrology',
      'Casting, Welding & Forming Technology',
      'Total Quality Management (TQM)',
      'Computer Integrated Manufacturing'
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing Engineering',
    shortCode: 'MFE',
    category: 'Mechanical & Allied',
    featured: false,
    color: 'from-stone-600 to-zinc-700',
    iconName: 'Settings',
    description: 'Additive manufacturing (3D printing), precision tools, and automated plant lines.',
    subjects: [
      'Advanced Manufacturing Processes',
      'Additive Manufacturing (3D Printing)',
      'Robotics in Manufacturing',
      'CNC Programming & Automation',
      'Precision Engineering'
    ]
  },
  {
    id: 'mechatronics',
    name: 'Mechatronics Engineering',
    shortCode: 'MTE',
    category: 'Mechanical & Allied',
    featured: false,
    color: 'from-indigo-600 to-violet-700',
    iconName: 'Bot',
    description: 'Synergy of mechanics, electronics, microcontrollers, hydraulics, and robotics.',
    subjects: [
      'Sensors & Actuators',
      'Robotics & Control Systems',
      'Microcontrollers & PLC Programming',
      'Hydraulics & Pneumatics',
      'Embedded Systems Design'
    ]
  },
  {
    id: 'robotics-automation',
    name: 'Robotics and Automation',
    shortCode: 'ROBO',
    category: 'Mechanical & Allied',
    featured: true,
    color: 'from-fuchsia-600 to-purple-600',
    iconName: 'Bot',
    description: 'Robot kinematics, industrial automation, vision systems, ROS, and motion planning.',
    subjects: [
      'Robot Kinematics & Dynamics',
      'Industrial Automation & PLC/SCADA',
      'Machine Vision for Robotics',
      'Autonomous Mobile Robots (ROS)',
      'Path Planning & Obstacle Avoidance',
      'Artificial Intelligence in Robotics'
    ]
  },
  {
    id: 'marine',
    name: 'Marine Engineering',
    shortCode: 'MRE',
    category: 'Mechanical & Allied',
    featured: false,
    color: 'from-blue-700 to-cyan-800',
    iconName: 'Ship',
    description: 'Ship propulsion, marine diesel engines, naval architecture, and offshore systems.',
    subjects: [
      'Marine Diesel Engines & Gas Turbines',
      'Naval Architecture & Ship Stability',
      'Marine Auxiliary Machinery',
      'Ship Electrical Systems',
      'Marine Safety & Environmental Protection'
    ]
  },

  // ── 4. Civil & Infrastructure Group ──
  {
    id: 'civil',
    name: 'Civil Engineering',
    shortCode: 'CE',
    category: 'Civil & Infrastructure',
    featured: true,
    color: 'from-emerald-700 to-teal-800',
    iconName: 'Building',
    description: 'Structural mechanics, geotechnical foundations, hydraulics, surveying, and highways.',
    subjects: [
      'Structural Analysis I & II',
      'Soil Mechanics & Geotechnical Engineering',
      'Fluid Mechanics & Open Channel Flow',
      'Concrete Technology & RCC Design',
      'Surveying & Geomatics',
      'Transportation & Highway Engineering',
      'Hydrology & Water Resources'
    ]
  },
  {
    id: 'environmental',
    name: 'Environmental Engineering',
    shortCode: 'EVE',
    category: 'Civil & Infrastructure',
    featured: false,
    color: 'from-green-600 to-emerald-700',
    iconName: 'Leaf',
    description: 'Water treatment, air pollution dispersion, solid waste, and ecological management.',
    subjects: [
      'Water & Wastewater Treatment',
      'Air Pollution Control & Monitoring',
      'Solid & Hazardous Waste Management',
      'Environmental Impact Assessment (EIA)',
      'Environmental Chemistry & Microbiology'
    ]
  },
  {
    id: 'construction',
    name: 'Construction Engineering',
    shortCode: 'CON',
    category: 'Civil & Infrastructure',
    featured: false,
    color: 'from-amber-700 to-yellow-800',
    iconName: 'HardHat',
    description: 'Site management, BIM, equipment logistics, estimation, and structural safety.',
    subjects: [
      'Construction Planning & Scheduling',
      'Heavy Construction Equipment',
      'Advanced Concrete & Steel Construction',
      'BIM (Building Information Modeling)',
      'Contract Laws & Construction Safety'
    ]
  },
  {
    id: 'architectural',
    name: 'Architectural Engineering',
    shortCode: 'ARE',
    category: 'Civil & Infrastructure',
    featured: false,
    color: 'from-violet-700 to-indigo-800',
    iconName: 'Compass',
    description: 'Building HVAC, acoustics, green building envelopes, and lighting integration.',
    subjects: [
      'Building Structures Design & Analysis',
      'HVAC & Building Mechanical Systems',
      'Architectural Acoustics & Lighting',
      'Sustainable Building Design & Green Architecture',
      'Building Utilities & Plumbing'
    ]
  },
  {
    id: 'agricultural',
    name: 'Agricultural Engineering',
    shortCode: 'AGE',
    category: 'Civil & Infrastructure',
    featured: false,
    color: 'from-lime-600 to-green-700',
    iconName: 'Sprout',
    description: 'Farm machinery, soil & water conservation, micro-irrigation, and post-harvesting.',
    subjects: [
      'Farm Machinery & Equipment',
      'Soil & Water Conservation Engineering',
      'Irrigation & Drainage Systems',
      'Post-Harvest Technology & Processing',
      'Dairy & Food Engineering'
    ]
  },
  {
    id: 'mining',
    name: 'Mining Engineering',
    shortCode: 'MNE',
    category: 'Civil & Infrastructure',
    featured: false,
    color: 'from-stone-700 to-zinc-800',
    iconName: 'Mountain',
    description: 'Underground/surface mineral extraction, rock mechanics, blasting, and mine safety.',
    subjects: [
      'Surface Mining Methods',
      'Underground Coal & Metal Mining',
      'Drilling & Blasting Technology',
      'Mine Ventilation & Safety',
      'Rock Mechanics & Ground Control'
    ]
  },

  // ── 5. Chemical & Materials Group ──
  {
    id: 'chemical',
    name: 'Chemical Engineering',
    shortCode: 'CHE',
    category: 'Chemical & Materials',
    featured: true,
    color: 'from-rose-600 to-pink-700',
    iconName: 'FlaskConical',
    description: 'Reaction kinetics, mass/heat transfer, process control, distillation, and refinery plants.',
    subjects: [
      'Chemical Reaction Engineering (CRE)',
      'Mass Transfer Operations',
      'Heat Transfer Operations',
      'Fluid Flow in Chemical Processes',
      'Chemical Engineering Thermodynamics',
      'Process Dynamics & Control',
      'Plant Design & Economics'
    ]
  },
  {
    id: 'biotech',
    name: 'Biotechnology',
    shortCode: 'BT',
    category: 'Chemical & Materials',
    featured: true,
    color: 'from-emerald-500 to-green-600',
    iconName: 'Dna',
    description: 'Recombinant DNA, bioprocess engineering, fermentation, enzymology, and bioinformatics.',
    subjects: [
      'Molecular Biology & Genetic Engineering',
      'Bioprocess Engineering & Fermentation',
      'Immunology & Medical Biotech',
      'Biochemistry & Enzymology',
      'Downstream Processing',
      'Cell Culture Technology'
    ]
  },
  {
    id: 'biomedical',
    name: 'Biomedical Engineering',
    shortCode: 'BME',
    category: 'Chemical & Materials',
    featured: false,
    color: 'from-pink-600 to-rose-600',
    iconName: 'HeartPulse',
    description: 'Medical instrumentation, biosensors, physiological signal capture, and implants.',
    subjects: [
      'Biomedical Instrumentation',
      'Biomechanics & Biomaterials',
      'Medical Imaging Systems (MRI, CT, Ultrasound)',
      'Physiological Signal Processing (ECG/EEG)',
      'Prosthetics & Rehabilitation'
    ]
  },
  {
    id: 'petroleum',
    name: 'Petroleum Engineering',
    shortCode: 'PTE',
    category: 'Chemical & Materials',
    featured: false,
    color: 'from-amber-600 to-red-700',
    iconName: 'Flame',
    description: 'Reservoir simulation, well logging, enhanced oil recovery, and offshore drilling.',
    subjects: [
      'Petroleum Reservoir Engineering',
      'Drilling Engineering & Well Completion',
      'Petroleum Production Operations',
      'Well Logging & Formation Evaluation',
      'Offshore Drilling Technology'
    ]
  },
  {
    id: 'metallurgical',
    name: 'Metallurgical Engineering',
    shortCode: 'MET',
    category: 'Chemical & Materials',
    featured: false,
    color: 'from-orange-700 to-red-800',
    iconName: 'Flame',
    description: 'Pyrometallurgy, phase diagrams, alloy heat treatment, and fracture mechanics.',
    subjects: [
      'Physical Metallurgy & Heat Treatment',
      'Extractive Metallurgy (Iron & Steel)',
      'Thermodynamics of Materials',
      'Mechanical Metallurgy & Fracture',
      'Corrosion & Degradation of Metals'
    ]
  },
  {
    id: 'materials',
    name: 'Materials Engineering',
    shortCode: 'MSE',
    category: 'Chemical & Materials',
    featured: false,
    color: 'from-indigo-500 to-purple-600',
    iconName: 'Boxes',
    description: 'Crystal lattice structures, nanomaterials, composites, and characterization (SEM/XRD).',
    subjects: [
      'Structure & Properties of Materials',
      'Nanomaterials & Nanotechnology',
      'Ceramic & Polymeric Materials',
      'Composite Materials Design',
      'Characterization Techniques (SEM/XRD)'
    ]
  },
  {
    id: 'food-tech',
    name: 'Food Technology',
    shortCode: 'FT',
    category: 'Chemical & Materials',
    featured: false,
    color: 'from-amber-500 to-orange-600',
    iconName: 'Utensils',
    description: 'Microbial preservation, sensory analysis, food chemistry, packaging, and QA regulations.',
    subjects: [
      'Food Microbiology & Safety',
      'Food Processing & Preservation',
      'Food Chemistry & Nutrition',
      'Dairy Technology & Quality Control',
      'Packaging & Food Laws (FSSAI)'
    ]
  },
  {
    id: 'food-engineering',
    name: 'Food Engineering',
    shortCode: 'FE',
    category: 'Chemical & Materials',
    featured: false,
    color: 'from-orange-600 to-amber-700',
    iconName: 'Utensils',
    description: 'Food refrigeration, thermal sterilization, spray drying, and grain processing units.',
    subjects: [
      'Food Plant Utilities & Operations',
      'Thermal Processing of Foods',
      'Refrigeration & Cold Storage',
      'Food Packaging Engineering',
      'Grain Processing Technology'
    ]
  },
  {
    id: 'polymer',
    name: 'Polymer Engineering',
    shortCode: 'PLE',
    category: 'Chemical & Materials',
    featured: false,
    color: 'from-purple-700 to-indigo-800',
    iconName: 'Beaker',
    description: 'Synthetic macromolecules, extrusion, injection moulding, and elastomer formulation.',
    subjects: [
      'Polymer Synthesis & Chemistry',
      'Polymer Processing (Injection/Extrusion)',
      'Rubber & Elastomer Technology',
      'Polymer Testing & Characterization',
      'Mould & Die Design for Plastics'
    ]
  },
  {
    id: 'ceramic',
    name: 'Ceramic Engineering',
    shortCode: 'CRE',
    category: 'Chemical & Materials',
    featured: false,
    color: 'from-teal-700 to-cyan-800',
    iconName: 'Gem',
    description: 'High-temperature refractory linings, glass engineering, and electro-ceramics.',
    subjects: [
      'Traditional & Advanced Ceramics',
      'Glass Science & Technology',
      'Refractories & High-Temp Materials',
      'Electronic & Magnetic Ceramics',
      'Sintering & Microstructure Control'
    ]
  },

  // ── 6. Specialized & Allied Group ──
  {
    id: 'textile',
    name: 'Textile Engineering',
    shortCode: 'TE',
    category: 'Chemical & Materials',
    featured: false,
    color: 'from-pink-600 to-purple-600',
    iconName: 'Shirt',
    description: 'Fiber physics, spinning, weaving, chemical wet processing, and garment mechanics.',
    subjects: [
      'Yarn Manufacturing Technology',
      'Fabric Manufacturing (Weaving & Knitting)',
      'Textile Chemical Processing & Dyeing',
      'Fiber Science & Polymer Physics',
      'Apparel Manufacturing & Quality Control'
    ]
  },
  {
    id: 'printing',
    name: 'Printing Technology',
    shortCode: 'PT',
    category: 'Chemical & Materials',
    featured: false,
    color: 'from-blue-500 to-cyan-600',
    iconName: 'Printer',
    description: 'Gravure, flexography, offset lithography, prepress workflow, and packaging inks.',
    subjects: [
      'Offset Printing Technology',
      'Digital & Flexographic Printing',
      'Graphic Design & Pre-Press Operations',
      'Printing Inks & Substrates',
      'Packaging & Print Finishing Operations'
    ]
  },
  {
    id: 'mining-machinery',
    name: 'Mining Machinery Engineering',
    shortCode: 'MME',
    category: 'Mechanical & Allied',
    featured: false,
    color: 'from-stone-600 to-zinc-800',
    iconName: 'Wrench',
    description: 'Heavy earth movers (HEMM), draglines, haulage winding, and hydraulic drills.',
    subjects: [
      'Heavy Earth Moving Machinery (HEMM)',
      'Mine Haulage & Winding Systems',
      'Hydraulic & Pneumatic Drives in Mines',
      'Maintenance Engineering of Mining Equipment'
    ]
  },
  {
    id: 'fire-safety',
    name: 'Fire and Safety Engineering',
    shortCode: 'FSE',
    category: 'Civil & Infrastructure',
    featured: false,
    color: 'from-red-600 to-amber-600',
    iconName: 'ShieldAlert',
    description: 'Industrial safety, hazard mitigation, fire hydraulics, egress, and disaster response.',
    subjects: [
      'Fire Protection Systems & Hydraulics',
      'Industrial Safety & Hazard Management',
      'Disaster Management & Emergency Response',
      'Chemical Process Safety',
      'Building Codes & Fire Safety Regulations'
    ]
  }
];

export const ALL_BRANCH_NAMES = BTECH_BRANCHES.map(b => b.name);
