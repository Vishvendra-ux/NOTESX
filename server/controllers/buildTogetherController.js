const ProjectCollab = require('../models/ProjectCollab');
const User = require('../models/User');

const escapeRegex = (s) => String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Helper to synthesize or ensure bookingSlots exists for any project
function ensureBookingSlots(project) {
  if (Array.isArray(project.bookingSlots) && project.bookingSlots.length > 0) {
    return project.bookingSlots;
  }

  // Synthesize bookingSlots: Slot 1 is always the project creator / lead
  const slots = [
    {
      slotNumber: 1,
      roleTitle: 'Project Pitcher & Lead',
      skillsRequired: ['Vision & Architecture', 'Team Coordination'],
      status: 'reserved',
      filledBy: {
        userId: project.creatorId,
        name: project.creatorName,
        college: project.creatorCollege || 'Campus Dev',
        avatar: project.creatorAvatar || '',
        github: project.creatorGithub || '',
        confirmedAt: project.createdAt || new Date()
      }
    }
  ];

  let currentSlot = 2;
  const nonCreatorMembers = (project.members || []).filter(
    m => m.userId && project.creatorId && m.userId.toString() !== project.creatorId.toString()
  );
  let memberIdx = 0;

  if (Array.isArray(project.rolesNeeded) && project.rolesNeeded.length > 0) {
    project.rolesNeeded.forEach(role => {
      const count = Number(role.count) || 1;
      const filled = Number(role.filled) || 0;
      for (let i = 0; i < count; i++) {
        const isFilled = i < filled;
        const member = isFilled && nonCreatorMembers[memberIdx] ? nonCreatorMembers[memberIdx++] : null;
        slots.push({
          slotNumber: currentSlot++,
          roleTitle: role.roleTitle,
          skillsRequired: Array.isArray(role.skills) ? role.skills : (typeof role.skills === 'string' ? role.skills.split(',').map(s => s.trim()) : []),
          status: isFilled ? 'reserved' : 'available',
          filledBy: isFilled ? {
            userId: member?.userId || null,
            name: member?.name || 'Verified Teammate',
            college: member?.college || 'Engineering Campus',
            avatar: member?.avatar || '',
            github: '',
            confirmedAt: member?.joinedAt || new Date()
          } : null
        });
      }
    });
  } else {
    // Default fallback slots if rolesNeeded was empty
    slots.push(
      {
        slotNumber: 2,
        roleTitle: 'Frontend Engineer',
        skillsRequired: ['React', 'TailwindCSS'],
        status: 'available',
        filledBy: null
      },
      {
        slotNumber: 3,
        roleTitle: 'Backend Developer',
        skillsRequired: ['Node.js', 'Express', 'MongoDB'],
        status: 'available',
        filledBy: null
      }
    );
  }

  return slots;
}

// Seed realistic sample collaboration projects if database is empty
async function seedDefaultProjectsIfEmpty() {
  try {
    const count = await ProjectCollab.countDocuments();
    if (count > 0) return;

    // Find any user to act as creator or create fallback reference
    let defaultUser = await User.findOne();
    const fallbackId = defaultUser ? defaultUser._id : new (require('mongoose').Types.ObjectId)();
    const fallbackName = defaultUser ? defaultUser.name : 'Aarav Sharma';
    const fallbackCollege = defaultUser ? (defaultUser.collegeName || 'GLA University') : 'GLA University';

    const sampleProjects = [
      {
        title: 'DevSync: Realtime Collaborative Code & Whiteboard IDE',
        tagline: 'Google Docs meets VS Code with WebRTC audio & live terminal execution for student hackathons',
        description: 'Building an in-browser pair programming platform optimized for college hackathons. Includes real-time syntax highlighting with Monaco Editor, collaborative code execution via sandboxed Docker containers, and live voice channels so teams do not have to switch between Discord and VS Code.',
        category: 'Web Development',
        targetGoal: 'Hackathon Squad',
        projectStage: 'Prototype / MVP',
        status: 'Looking for Members',
        techStack: ['React', 'Node.js', 'WebRTC', 'Socket.io', 'Docker', 'TailwindCSS'],
        maxTeamSize: 4,
        rolesNeeded: [
          { roleTitle: 'Frontend Architect', count: 1, filled: 0, skills: ['React', 'Monaco Editor', 'Tailwind'] },
          { roleTitle: 'Realtime WebRTC Engineer', count: 1, filled: 1, skills: ['WebRTC', 'Socket.io', 'Node.js'] },
          { roleTitle: 'DevOps & Sandbox Specialist', count: 1, filled: 0, skills: ['Docker', 'AWS', 'Linux'] }
        ],
        creatorId: fallbackId,
        creatorName: fallbackName,
        creatorCollege: fallbackCollege,
        creatorAvatar: '',
        creatorGithub: 'https://github.com/lead-devsync',
        githubUrl: 'https://github.com/collab/devsync-ide',
        communicationChannel: 'Discord',
        communicationLink: 'https://discord.gg/devsync',
        upvotesCount: 14,
        bookingSlots: [
          {
            slotNumber: 1,
            roleTitle: 'Project Pitcher & Lead',
            skillsRequired: ['System Design', 'React Architecture'],
            status: 'reserved',
            filledBy: {
              userId: fallbackId,
              name: fallbackName,
              college: fallbackCollege,
              avatar: '',
              github: 'https://github.com/lead-devsync',
              confirmedAt: new Date(Date.now() - 7 * 86400000)
            }
          },
          {
            slotNumber: 2,
            roleTitle: 'Frontend Architect',
            skillsRequired: ['React', 'Monaco Editor', 'TailwindCSS'],
            status: 'available',
            filledBy: null
          },
          {
            slotNumber: 3,
            roleTitle: 'Realtime WebRTC Engineer',
            skillsRequired: ['WebRTC', 'Socket.io', 'Node.js'],
            status: 'reserved',
            filledBy: {
              name: 'Priya Patel',
              college: 'BITS Pilani',
              avatar: '',
              github: 'https://github.com/priyapatel-dev',
              confirmedAt: new Date(Date.now() - 3 * 86400000)
            }
          },
          {
            slotNumber: 4,
            roleTitle: 'DevOps & Sandbox Specialist',
            skillsRequired: ['Docker', 'AWS', 'Linux Shell'],
            status: 'available',
            filledBy: null
          }
        ],
        members: [
          {
            userId: fallbackId,
            name: fallbackName,
            role: 'Project Pitcher & Lead',
            college: fallbackCollege,
            avatar: '',
            joinedAt: new Date(Date.now() - 7 * 86400000)
          },
          {
            name: 'Priya Patel',
            role: 'Realtime WebRTC Engineer',
            college: 'BITS Pilani',
            avatar: '',
            joinedAt: new Date(Date.now() - 3 * 86400000)
          }
        ]
      },
      {
        title: 'MedScan AI: On-Device Chest X-Ray Triage App',
        tagline: 'Lightweight PyTorch vision model running on mobile for rural clinics without reliable internet',
        description: 'A mobile application that runs an quantized MobileNet/ResNet vision classifier locally on Android and iOS to detect pneumonia, cardiomegaly, and pneumothorax from chest radiograph photos. Aimed as our final year Capstone project with planned submission to international student research symposiums.',
        category: 'AI & Machine Learning',
        targetGoal: 'College Capstone / Final Year',
        projectStage: 'Idea / Planning',
        status: 'Looking for Members',
        techStack: ['Python', 'PyTorch', 'Flutter', 'FastAPI', 'ONNX Runtime'],
        maxTeamSize: 3,
        rolesNeeded: [
          { roleTitle: 'Flutter App Developer', count: 1, filled: 0, skills: ['Flutter', 'Dart', 'Mobile UI'] },
          { roleTitle: 'FastAPI Backend & Cloud Deployer', count: 1, filled: 0, skills: ['FastAPI', 'Docker', 'PostgreSQL'] }
        ],
        creatorId: fallbackId,
        creatorName: 'Rohan Mehra',
        creatorCollege: 'IIT Delhi',
        creatorAvatar: '',
        creatorGithub: 'https://github.com/rohan-ai',
        githubUrl: 'https://github.com/medscan-capstone',
        communicationChannel: 'WhatsApp',
        communicationLink: 'https://chat.whatsapp.com/sample',
        upvotesCount: 22,
        bookingSlots: [
          {
            slotNumber: 1,
            roleTitle: 'Project Pitcher & Lead (ML Research)',
            skillsRequired: ['PyTorch', 'Computer Vision', 'Model Quantization'],
            status: 'reserved',
            filledBy: {
              name: 'Rohan Mehra',
              college: 'IIT Delhi',
              avatar: '',
              github: 'https://github.com/rohan-ai',
              confirmedAt: new Date(Date.now() - 4 * 86400000)
            }
          },
          {
            slotNumber: 2,
            roleTitle: 'Flutter App Developer',
            skillsRequired: ['Flutter', 'Dart', 'State Management'],
            status: 'available',
            filledBy: null
          },
          {
            slotNumber: 3,
            roleTitle: 'FastAPI Backend & Cloud Deployer',
            skillsRequired: ['FastAPI', 'Docker', 'PostgreSQL'],
            status: 'available',
            filledBy: null
          }
        ],
        members: [
          {
            name: 'Rohan Mehra',
            role: 'Project Pitcher & Lead (ML Research)',
            college: 'IIT Delhi',
            avatar: '',
            joinedAt: new Date(Date.now() - 4 * 86400000)
          }
        ]
      },
      {
        title: 'UniSwap: Zero-Commission Campus Marketplace & Textbook Rental',
        tagline: 'Buy, sell, and rent engineering textbooks, drafters, calculators with verified student email OTP',
        description: 'Students spend thousands every semester on books, Lab kits, and calculators that are only used for 4 months. UniSwap creates a hyperlocal marketplace restricted to verified campus students with in-person pickup points across college hostels.',
        category: 'Web Development',
        targetGoal: 'Startup MVP',
        projectStage: 'Active Development',
        status: 'Looking for Members',
        techStack: ['Next.js', 'PostgreSQL', 'Prisma', 'TailwindCSS', 'Stripe/Razorpay'],
        maxTeamSize: 4,
        rolesNeeded: [
          { roleTitle: 'Full-Stack Next.js Developer', count: 1, filled: 0, skills: ['Next.js', 'Prisma', 'TailwindCSS'] },
          { roleTitle: 'React Native Mobile Developer', count: 1, filled: 0, skills: ['React Native', 'Expo'] },
          { roleTitle: 'Campus Outreach & UI/UX Lead', count: 1, filled: 1, skills: ['Figma', 'Product Marketing'] }
        ],
        creatorId: fallbackId,
        creatorName: 'Ananya Sen',
        creatorCollege: 'DTU Delhi',
        creatorAvatar: '',
        creatorGithub: 'https://github.com/ananya-sen',
        githubUrl: 'https://github.com/uniswap-campus/web',
        communicationChannel: 'Discord',
        communicationLink: 'https://discord.gg/uniswap',
        upvotesCount: 19,
        bookingSlots: [
          {
            slotNumber: 1,
            roleTitle: 'Project Pitcher & Lead',
            skillsRequired: ['Product Strategy', 'System Architecture'],
            status: 'reserved',
            filledBy: {
              name: 'Ananya Sen',
              college: 'DTU Delhi',
              avatar: '',
              github: 'https://github.com/ananya-sen',
              confirmedAt: new Date(Date.now() - 10 * 86400000)
            }
          },
          {
            slotNumber: 2,
            roleTitle: 'Full-Stack Next.js Developer',
            skillsRequired: ['Next.js', 'Prisma', 'TailwindCSS'],
            status: 'available',
            filledBy: null
          },
          {
            slotNumber: 3,
            roleTitle: 'React Native Mobile Developer',
            skillsRequired: ['React Native', 'Expo', 'Push Notifications'],
            status: 'available',
            filledBy: null
          },
          {
            slotNumber: 4,
            roleTitle: 'Campus Outreach & UI/UX Lead',
            skillsRequired: ['Figma', 'Product Marketing', 'Growth'],
            status: 'reserved',
            filledBy: {
              name: 'Kabir Verma',
              college: 'VIT Vellore',
              avatar: '',
              github: '',
              confirmedAt: new Date(Date.now() - 2 * 86400000)
            }
          }
        ],
        members: [
          {
            name: 'Ananya Sen',
            role: 'Project Pitcher & Lead',
            college: 'DTU Delhi',
            avatar: '',
            joinedAt: new Date(Date.now() - 10 * 86400000)
          },
          {
            name: 'Kabir Verma',
            role: 'Campus Outreach & UI/UX Lead',
            college: 'VIT Vellore',
            avatar: '',
            joinedAt: new Date(Date.now() - 2 * 86400000)
          }
        ]
      }
    ];

    await ProjectCollab.insertMany(sampleProjects);
    console.log('✅ Seeded default BuildTogether collaboration projects with booking slots');
  } catch (err) {
    console.error('Error seeding BuildTogether sample projects:', err.message);
  }
}

// @desc    List all projects with search, filter, and pagination
// @route   GET /api/build-together
// @access  Public
exports.list = async (req, res, next) => {
  try {
    await seedDefaultProjectsIfEmpty();

    const {
      search = '',
      category,
      targetGoal,
      projectStage,
      status,
      tech,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (search && search.trim()) {
      const s = escapeRegex(search.trim());
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { tagline: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { techStack: { $in: [new RegExp(s, 'i')] } },
        { 'rolesNeeded.roleTitle': { $regex: s, $options: 'i' } },
        { 'bookingSlots.roleTitle': { $regex: s, $options: 'i' } },
        { creatorCollege: { $regex: s, $options: 'i' } }
      ];
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      query.category = category;
    }

    if (targetGoal && targetGoal !== 'All' && targetGoal !== 'All Goals') {
      query.targetGoal = targetGoal;
    }

    if (projectStage && projectStage !== 'All' && projectStage !== 'All Stages') {
      query.projectStage = projectStage;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (tech && tech !== 'All') {
      query.techStack = { $in: [new RegExp(escapeRegex(tech), 'i')] };
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'popular' || sort === 'Most Upvoted') {
      sortObj = { upvotesCount: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortObj = { createdAt: 1 };
    }

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (safePage - 1) * safeLimit;

    const [projects, total] = await Promise.all([
      ProjectCollab.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      ProjectCollab.countDocuments(query)
    ]);

    const userIdStr = req.user ? req.user._id.toString() : null;
    const formatted = projects.map(p => {
      const slots = ensureBookingSlots(p);
      return {
        ...p,
        bookingSlots: slots,
        hasUpvoted: userIdStr ? p.upvotes?.some(id => id.toString() === userIdStr) : false,
        isCreator: userIdStr ? (p.creatorId?.toString() === userIdStr) : false,
        isMember: userIdStr ? p.members?.some(m => m.userId?.toString() === userIdStr) : false,
        hasApplied: userIdStr ? p.applications?.some(a => a.applicantId?.toString() === userIdStr) : false,
        myApplication: userIdStr ? p.applications?.find(a => a.applicantId?.toString() === userIdStr) : null
      };
    });

    res.json({
      projects: formatted,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit) || 1
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details
// @route   GET /api/build-together/:id
// @access  Public
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = id.match(/^[0-9a-fA-F]{24}$/)
      ? await ProjectCollab.findById(id).lean()
      : null;

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const slots = ensureBookingSlots(project);
    const userIdStr = req.user ? req.user._id.toString() : null;

    res.json({
      ...project,
      bookingSlots: slots,
      hasUpvoted: userIdStr ? project.upvotes?.some(id => id.toString() === userIdStr) : false,
      isCreator: userIdStr ? (project.creatorId?.toString() === userIdStr) : false,
      isMember: userIdStr ? project.members?.some(m => m.userId?.toString() === userIdStr) : false,
      hasApplied: userIdStr ? project.applications?.some(a => a.applicantId?.toString() === userIdStr) : false,
      myApplication: userIdStr ? project.applications?.find(a => a.applicantId?.toString() === userIdStr) : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project pitch with auto-generated booking slots
// @route   POST /api/build-together
// @access  Private
exports.create = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to post a project' });
    }

    const {
      title,
      tagline,
      description,
      category,
      targetGoal,
      projectStage,
      techStack,
      rolesNeeded,
      githubUrl,
      demoUrl,
      communicationChannel,
      communicationLink,
      maxTeamSize
    } = req.body;

    if (!title || !tagline || !description) {
      return res.status(400).json({ message: 'Title, tagline, and project description are required.' });
    }

    // Format roles needed
    let parsedRoles = [];
    if (Array.isArray(rolesNeeded)) {
      parsedRoles = rolesNeeded.filter(r => r.roleTitle && r.roleTitle.trim()).map(r => ({
        roleTitle: r.roleTitle.trim(),
        count: Math.max(1, Number(r.count) || 1),
        filled: 0,
        skills: Array.isArray(r.skills)
          ? r.skills
          : (typeof r.skills === 'string' ? r.skills.split(',').map(s => s.trim()).filter(Boolean) : [])
      }));
    }

    if (parsedRoles.length === 0) {
      parsedRoles = [
        { roleTitle: 'Frontend Developer', count: 1, filled: 0, skills: ['React', 'TailwindCSS'] },
        { roleTitle: 'Backend Developer', count: 1, filled: 0, skills: ['Node.js', 'MongoDB'] }
      ];
    }

    // Format tech stack
    let parsedTech = [];
    if (Array.isArray(techStack)) {
      parsedTech = techStack;
    } else if (typeof techStack === 'string') {
      parsedTech = techStack.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Auto-generate Booking Slots like a ticket booking system!
    // Slot 1: Project Pitcher & Lead (Reserved)
    const bookingSlots = [
      {
        slotNumber: 1,
        roleTitle: 'Project Pitcher & Lead',
        skillsRequired: ['Vision & Architecture', 'Team Coordination'],
        status: 'reserved',
        filledBy: {
          userId: req.user._id,
          name: req.user.name,
          college: req.user.collegeName || 'Campus Student',
          avatar: req.user.profilePhoto || '',
          github: req.user.github || '',
          confirmedAt: new Date()
        }
      }
    ];

    let slotCounter = 2;
    parsedRoles.forEach(role => {
      const count = Number(role.count) || 1;
      for (let i = 0; i < count; i++) {
        bookingSlots.push({
          slotNumber: slotCounter++,
          roleTitle: count > 1 ? `${role.roleTitle} (Seat ${i + 1})` : role.roleTitle,
          skillsRequired: Array.isArray(role.skills) ? role.skills : [],
          status: 'available',
          filledBy: null
        });
      }
    });

    const calculatedTeamSize = Math.max(
      bookingSlots.length,
      Number(maxTeamSize) || bookingSlots.length
    );

    const project = await ProjectCollab.create({
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      category: category || 'Web Development',
      targetGoal: targetGoal || 'Hackathon Squad',
      projectStage: projectStage || 'Idea / Planning',
      status: 'Looking for Members',
      techStack: parsedTech,
      rolesNeeded: parsedRoles,
      bookingSlots,
      creatorId: req.user._id,
      creatorName: req.user.name,
      creatorCollege: req.user.collegeName || 'Campus Student',
      creatorAvatar: req.user.profilePhoto || '',
      creatorGithub: req.user.github || '',
      githubUrl: githubUrl || '',
      demoUrl: demoUrl || '',
      communicationChannel: communicationChannel || 'Discord',
      communicationLink: communicationLink || '',
      maxTeamSize: calculatedTeamSize,
      members: [{
        userId: req.user._id,
        name: req.user.name,
        role: 'Project Pitcher & Lead',
        college: req.user.collegeName || 'Campus Student',
        avatar: req.user.profilePhoto || '',
        joinedAt: new Date()
      }],
      upvotes: [req.user._id],
      upvotesCount: 1
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to book a specific collaboration slot
// @route   POST /api/build-together/:id/apply
// @access  Private
exports.apply = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to book a collaboration slot' });
    }

    const { id } = req.params;
    const {
      slotNumber,
      roleApplied,
      applicantPhoneOrContact,
      skillsSummary,
      pitchMessage,
      portfolioOrGithub
    } = req.body;

    if (!roleApplied || !pitchMessage) {
      return res.status(400).json({ message: 'Role applied for and collaboration pitch message are required' });
    }

    const project = await ProjectCollab.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.creatorId.equals(req.user._id)) {
      return res.status(400).json({ message: 'You are the creator of this project. You already occupy Seat #1!' });
    }

    const alreadyMember = project.members.some(m => m.userId && m.userId.equals(req.user._id));
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a confirmed member of this project squad' });
    }

    // Check if user already has a pending application
    const existingPending = project.applications.find(
      a => a.applicantId && a.applicantId.equals(req.user._id) && a.status === 'pending'
    );
    if (existingPending) {
      return res.status(400).json({
        message: 'You already have an active pending seat request for this project awaiting the pitcher’s review.'
      });
    }

    // Ensure bookingSlots exists
    if (!project.bookingSlots || project.bookingSlots.length === 0) {
      project.bookingSlots = ensureBookingSlots(project);
    }

    let targetSlot = null;
    if (slotNumber) {
      targetSlot = project.bookingSlots.find(s => s.slotNumber === Number(slotNumber));
      if (!targetSlot) {
        return res.status(404).json({ message: `Slot #${slotNumber} was not found on this project.` });
      }
      if (targetSlot.status === 'reserved') {
        return res.status(409).json({ message: `Seat #${slotNumber} (${targetSlot.roleTitle}) has already been booked and confirmed.` });
      }
    } else {
      targetSlot = project.bookingSlots.find(
        s => s.status === 'available' && s.roleTitle.toLowerCase().includes(roleApplied.toLowerCase())
      ) || project.bookingSlots.find(s => s.status === 'available');
    }

    project.applications.push({
      slotNumber: targetSlot ? targetSlot.slotNumber : undefined,
      slotRole: targetSlot ? targetSlot.roleTitle : roleApplied.trim(),
      applicantId: req.user._id,
      applicantName: req.user.name,
      applicantCollege: req.user.collegeName || 'Campus Student',
      applicantEmail: req.user.email,
      applicantPhoneOrContact: applicantPhoneOrContact ? applicantPhoneOrContact.trim() : '',
      applicantAvatar: req.user.profilePhoto || '',
      roleApplied: roleApplied.trim(),
      skillsSummary: skillsSummary ? skillsSummary.trim() : '',
      pitchMessage: pitchMessage.trim(),
      portfolioOrGithub: portfolioOrGithub ? portfolioOrGithub.trim() : (req.user.github || ''),
      status: 'pending',
      appliedAt: new Date()
    });

    await project.save();
    res.json({
      message: `Collaboration request for Seat #${targetSlot ? targetSlot.slotNumber : ''} submitted to the pitcher!`,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote a project
// @route   POST /api/build-together/:id/upvote
// @access  Private
exports.toggleUpvote = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;
    const project = await ProjectCollab.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user._id;
    const index = project.upvotes.indexOf(userId);

    if (index === -1) {
      project.upvotes.push(userId);
      project.upvotesCount = (project.upvotesCount || 0) + 1;
    } else {
      project.upvotes.splice(index, 1);
      project.upvotesCount = Math.max(0, (project.upvotesCount || 1) - 1);
    }

    await project.save();
    res.json({ upvotesCount: project.upvotesCount, hasUpvoted: index === -1 });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept or decline an application (Creator only) - fills the seat!
// @route   PATCH /api/build-together/:id/applications/:appId
// @access  Private
exports.manageApplication = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id, appId } = req.params;
    const { action } = req.body; // 'accept' or 'decline'

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ message: 'Action must be accept or decline' });
    }

    const project = await ProjectCollab.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.creatorId.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the project pitcher can review and approve collaborator seat requests' });
    }

    const application = project.applications.id(appId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(409).json({ message: `This application has already been ${application.status}` });
    }

    if (action === 'accept') {
      // Ensure bookingSlots exists
      if (!project.bookingSlots || project.bookingSlots.length === 0) {
        project.bookingSlots = ensureBookingSlots(project);
      }

      // Find the slot to fill
      let slotToFill = null;
      if (application.slotNumber) {
        slotToFill = project.bookingSlots.find(s => s.slotNumber === application.slotNumber);
      }
      if (!slotToFill || slotToFill.status === 'reserved') {
        // Fallback: match by role title or first available slot
        slotToFill = project.bookingSlots.find(
          s => s.status === 'available' && s.roleTitle.toLowerCase().includes(application.roleApplied.toLowerCase())
        ) || project.bookingSlots.find(s => s.status === 'available');
      }

      if (!slotToFill) {
        return res.status(409).json({ message: 'All seats on this project are already filled.' });
      }

      // Mark the slot as reserved / filled with collaborator details!
      slotToFill.status = 'reserved';
      slotToFill.filledBy = {
        userId: application.applicantId,
        name: application.applicantName,
        college: application.applicantCollege || 'Campus Dev',
        avatar: application.applicantAvatar || '',
        github: application.portfolioOrGithub || '',
        confirmedAt: new Date()
      };

      // Add to team members list if not already present
      const alreadyMember = project.members.some(m => m.userId && m.userId.equals(application.applicantId));
      if (!alreadyMember) {
        project.members.push({
          userId: application.applicantId,
          name: application.applicantName,
          role: slotToFill.roleTitle || application.roleApplied,
          college: application.applicantCollege || 'Campus Dev',
          avatar: application.applicantAvatar || '',
          joinedAt: new Date()
        });
      }

      // Increment filled count on matching rolesNeeded entry
      const matchedRole = project.rolesNeeded.find(r =>
        r.roleTitle.toLowerCase().includes(application.roleApplied.toLowerCase()) ||
        application.roleApplied.toLowerCase().includes(r.roleTitle.toLowerCase())
      );
      if (matchedRole) {
        matchedRole.filled = Math.min(matchedRole.count, (matchedRole.filled || 0) + 1);
      }

      application.status = 'accepted';
      application.reviewedAt = new Date();

      // Check if all seats are now filled
      const allSlotsReserved = project.bookingSlots.every(s => s.status === 'reserved');
      const maxTeam = project.maxTeamSize || 4;
      if (allSlotsReserved || project.members.length >= maxTeam) {
        project.status = 'Team Full';
      }
    } else if (action === 'decline') {
      application.status = 'declined';
      application.reviewedAt = new Date();
    }

    await project.save();
    res.json({
      message: action === 'accept'
        ? `Seat #${application.slotNumber || ''} assigned to ${application.applicantName}! Seat is now filled.`
        : `Application from ${application.applicantName} declined.`,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/build-together/:id
// @access  Private (Creator or Admin)
exports.delete = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;
    const project = await ProjectCollab.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.creatorId.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
