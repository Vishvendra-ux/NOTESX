const mongoose = require('mongoose');
require('dotenv').config();

const College = require('./models/College');
const CommunityPost = require('./models/CommunityPost');
const CampusEvent = require('./models/CampusEvent');

const collegesToSeed = [
  {
    slug: 'gla',
    name: 'GLA University',
    initial: 'G',
    location: 'Mathura, Uttar Pradesh',
    state: 'Uttar Pradesh',
    city: 'Mathura',
    website: 'https://www.gla.ac.in',
    established: '1998',
    rank: '#4 in UP',
    bannerColor: 'from-indigo-600 via-blue-600 to-cyan-500',
    bannerImage: '/colleges/gla.webp',
    description: 'Premier private university in Mathura, UP. Renowned for Computer Science Engineering, High placement records, and vibrant student developer communities.',
    courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'BCA', 'MCA', 'MBA'],
    departments: [
      { name: 'Computer Science & Engineering', students: '4.2K', head: 'Dr. Anand Sharma' },
      { name: 'Electronics & Communication', students: '2.1K', head: 'Dr. R. K. Singh' },
      { name: 'Management Studies', students: '1.8K', head: 'Dr. Neeru Jaswal' },
    ],
    stats: { studentCount: '12.4K', notesCount: '2,340', doubtsCount: '890' }
  },
  {
    slug: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    initial: 'I',
    location: 'Hauz Khas, New Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    website: 'https://home.iitd.ac.in',
    established: '1961',
    rank: '#2 in India',
    bannerColor: 'from-emerald-600 via-teal-600 to-cyan-600',
    bannerImage: '/colleges/iit-delhi.jpg',
    description: 'Institute of National Importance. India\'s top engineering institute leading in research, artificial intelligence, and startup incubations.',
    courses: ['B.Tech CSE', 'B.Tech EE', 'B.Tech AI & Data Science', 'M.Tech', 'Ph.D'],
    departments: [
      { name: 'Computer Science & Engineering', students: '1.2K', head: 'Prof. Prem Kalra' },
      { name: 'Electrical Engineering', students: '1.5K', head: 'Prof. Jayadeva' },
    ],
    stats: { studentCount: '10.8K', notesCount: '5,820', doubtsCount: '2,410' }
  },
  {
    slug: 'dtu',
    name: 'Delhi Technological University',
    initial: 'D',
    location: 'Rohini, New Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    website: 'http://dtu.ac.in',
    established: '1941',
    rank: '#8 in India',
    bannerColor: 'from-violet-600 via-purple-600 to-indigo-600',
    bannerImage: '/colleges/dtu.jpg',
    description: 'Formerly DCE (Delhi College of Engineering). Legendary legacy institution known for engineering excellence and competitive programming culture.',
    courses: ['B.Tech Software Eng.', 'B.Tech CSE', 'B.Tech IT', 'B.Tech ECE'],
    departments: [
      { name: 'Software Engineering', students: '2.4K', head: 'Dr. Ruchika Malhotra' },
      { name: 'Computer Science', students: '3.1K', head: 'Dr. Rajni Jindal' },
    ],
    stats: { studentCount: '15.1K', notesCount: '3,160', doubtsCount: '1,280' }
  },
  {
    slug: 'aktu',
    name: 'Dr. A.P.J. Abdul Kalam Technical University',
    initial: 'A',
    location: 'Lucknow, Uttar Pradesh',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    website: 'https://aktu.ac.in',
    established: '2000',
    rank: '#1 State Tech Univ',
    bannerColor: 'from-orange-600 via-amber-600 to-red-600',
    bannerImage: '/colleges/aktu.jpg',
    description: 'Premier technical university of Uttar Pradesh affiliating 700+ engineering and management colleges.',
    courses: ['B.Tech CSE', 'B.Tech IT', 'B.Tech ECE', 'BCA', 'MCA'],
    departments: [
      { name: 'Computer Science & Engineering', students: '80K', head: 'Dr. V. K. Pathak' },
      { name: 'Electronics Engineering', students: '45K', head: 'Dr. M. K. Dutta' },
    ],
    stats: { studentCount: '400K', notesCount: '8,420', doubtsCount: '3,890' }
  },
  {
    slug: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay',
    initial: 'I',
    location: 'Powai, Mumbai',
    state: 'Maharashtra',
    city: 'Mumbai',
    website: 'https://www.iitb.ac.in',
    established: '1958',
    rank: '#1 in India (QS World)',
    bannerColor: 'from-sky-600 via-blue-600 to-indigo-700',
    bannerImage: '/colleges/iit-bombay.jpg',
    description: 'Premier technological and research university located along the scenic Powai Lake in Mumbai.',
    courses: ['B.Tech CSE', 'B.Tech Electrical', 'B.Tech Mechanical', 'M.Tech', 'Ph.D'],
    departments: [
      { name: 'Computer Science & Engineering', students: '1.4K', head: 'Prof. Varsha Apte' },
      { name: 'Electrical Engineering', students: '1.6K', head: 'Prof. Kishore Chatterjee' },
    ],
    stats: { studentCount: '11.2K', notesCount: '6,140', doubtsCount: '2,920' }
  },
  {
    slug: 'vit',
    name: 'Vellore Institute of Technology',
    initial: 'V',
    location: 'Vellore, Tamil Nadu',
    state: 'Tamil Nadu',
    city: 'Vellore',
    website: 'https://vit.ac.in',
    established: '1984',
    rank: '#8 University in India',
    bannerColor: 'from-cyan-600 via-blue-600 to-indigo-700',
    bannerImage: '/colleges/vit.jpg',
    description: 'Massive modern private institution renowned for state-of-the-art labs, tech fests, and high placements.',
    courses: ['B.Tech CSE', 'B.Tech IT', 'B.Tech AI', 'MCA', 'Integrated M.Tech'],
    departments: [
      { name: 'School of Computer Science', students: '9.2K', head: 'Dr. Saravanan R.' },
      { name: 'School of Electronics', students: '4.8K', head: 'Dr. Sivanantha Raja' },
    ],
    stats: { studentCount: '34K', notesCount: '4,980', doubtsCount: '2,150' }
  },
  {
    slug: 'bits',
    name: 'BITS Pilani',
    initial: 'B',
    location: 'Pilani, Rajasthan',
    state: 'Rajasthan',
    city: 'Pilani',
    website: 'https://www.bits-pilani.ac.in',
    established: '1964',
    rank: '#1 Private Tech Institute',
    bannerColor: 'from-rose-600 via-pink-600 to-purple-600',
    bannerImage: '/colleges/bits.jpg',
    description: 'Iconic merit-based university renowned for no-attendance policy, startup culture, and top-tier alumni.',
    courses: ['B.E. Computer Science', 'B.E. Electronics', 'M.Sc Dual Degree', 'Ph.D'],
    departments: [
      { name: 'Computer Science & IS', students: '1.1K', head: 'Prof. Shan Balasubramaniam' },
      { name: 'Electrical & Electronics', students: '1.3K', head: 'Prof. Navneet Gupta' },
    ],
    stats: { studentCount: '6.5K', notesCount: '3,720', doubtsCount: '1,640' }
  },
  {
    slug: 'nit-trichy',
    name: 'National Institute of Technology Tiruchirappalli',
    initial: 'N',
    location: 'Tiruchirappalli, Tamil Nadu',
    state: 'Tamil Nadu',
    city: 'Tiruchirappalli',
    website: 'https://www.nitt.edu',
    established: '1964',
    rank: '#1 NIT in India',
    bannerColor: 'from-amber-600 via-orange-600 to-rose-600',
    bannerImage: '/colleges/nit-trichy.png',
    description: 'Consistently ranked the #1 NIT in India, recognized for research excellence and national engineering talent.',
    courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'MCA'],
    departments: [
      { name: 'Computer Science & Eng', students: '950', head: 'Dr. S. Mary Saira Bhanu' },
      { name: 'Electronics & Communication', students: '1.1K', head: 'Dr. G. Lakshminarayanan' },
    ],
    stats: { studentCount: '7.8K', notesCount: '2,860', doubtsCount: '1,120' }
  },
  {
    slug: 'manipal',
    name: 'Manipal Institute of Technology',
    initial: 'M',
    location: 'Manipal, Karnataka',
    state: 'Karnataka',
    city: 'Manipal',
    website: 'https://manipal.edu/mit',
    established: '1957',
    rank: '#5 Private Eng College',
    bannerColor: 'from-fuchsia-600 via-purple-600 to-indigo-600',
    bannerImage: '/colleges/manipal.jpg',
    description: 'Vibrant coastal college campus celebrated for global alumni, cutting-edge student clubs, and tech incubation.',
    courses: ['B.Tech CSE', 'B.Tech Data Science', 'B.Tech IT', 'M.Tech'],
    departments: [
      { name: 'Computer Science', students: '2.8K', head: 'Dr. Srikanth Prabhu' },
      { name: 'Information & Comm Tech', students: '1.9K', head: 'Dr. Smitha N. Pai' },
    ],
    stats: { studentCount: '10.2K', notesCount: '2,940', doubtsCount: '1,380' }
  },
  {
    slug: 'iit-kanpur',
    name: 'Indian Institute of Technology Kanpur',
    initial: 'I',
    location: 'Kanpur, Uttar Pradesh',
    state: 'Uttar Pradesh',
    city: 'Kanpur',
    website: 'https://www.iitk.ac.in',
    established: '1959',
    rank: '#3 in Engineering (NIRF)',
    bannerColor: 'from-emerald-600 via-green-600 to-teal-600',
    bannerImage: '/colleges/iit-kanpur.jpg',
    description: 'Pioneer of computer science education in India with sprawling green 1,000-acre residential campus.',
    courses: ['B.Tech CSE', 'B.Tech EE', 'B.Tech Aerospace', 'M.Tech', 'Ph.D'],
    departments: [
      { name: 'Computer Science & Engineering', students: '1.1K', head: 'Prof. Nitin Saxena' },
      { name: 'Electrical Engineering', students: '1.3K', head: 'Prof. Rohit Budhiraja' },
    ],
    stats: { studentCount: '8.1K', notesCount: '4,640', doubtsCount: '2,180' }
  },
  {
    slug: 'jadavpur',
    name: 'Jadavpur University',
    initial: 'J',
    location: 'Kolkata, West Bengal',
    state: 'West Bengal',
    city: 'Kolkata',
    website: 'http://www.jaduniv.edu.in',
    established: '1955',
    rank: '#4 University in India (NIRF)',
    bannerColor: 'from-indigo-600 via-violet-600 to-purple-700',
    bannerImage: '/colleges/jadavpur.jpg',
    description: 'Acclaimed public research university famous for academic rigour, research output, and top return on investment.',
    courses: ['B.E. Computer Science', 'B.E. IT', 'B.E. Electronics', 'MCA'],
    departments: [
      { name: 'Computer Science & Eng', students: '1.5K', head: 'Prof. Ujjwal Maulik' },
      { name: 'Information Technology', students: '1.2K', head: 'Prof. Samiran Chattopadhyay' },
    ],
    stats: { studentCount: '13.3K', notesCount: '2,520', doubtsCount: '1,050' }
  },
  {
    slug: 'rvce',
    name: 'RV College of Engineering',
    initial: 'R',
    location: 'Bengaluru, Karnataka',
    state: 'Karnataka',
    city: 'Bengaluru',
    website: 'https://www.rvce.edu.in',
    established: '1963',
    rank: '#1 Autonomous in Bengaluru',
    bannerColor: 'from-teal-600 via-emerald-600 to-cyan-600',
    bannerImage: '/colleges/rvce.jpg',
    description: 'Premier private technical institution in India’s Silicon Valley, with deep tech industry ties and coding clubs.',
    courses: ['B.E. CSE', 'B.E. ISE', 'B.E. AI & ML', 'M.Tech'],
    departments: [
      { name: 'Computer Science & Engineering', students: '1.4K', head: 'Dr. Ramakanth Kumar P.' },
      { name: 'Information Science & Eng', students: '1.1K', head: 'Dr. B. M. Sagar' },
    ],
    stats: { studentCount: '5.6K', notesCount: '1,840', doubtsCount: '810' }
  }
];

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notesx';
    await mongoose.connect(connStr);
    console.log('MongoDB Connected for seeding community data...');

    for (const data of collegesToSeed) {
      let college = await College.findOne({ slug: data.slug });
      if (!college) {
        college = await College.create(data);
        console.log(`Created college: ${college.name}`);
      } else {
        await College.updateOne({ slug: data.slug }, data);
        console.log(`Updated college: ${college.name}`);
      }

      // Seed Posts if empty for this college
      const postsCount = await CommunityPost.countDocuments({ collegeSlug: data.slug });
      if (postsCount === 0) {
        await CommunityPost.create([
          {
            collegeId: college._id,
            collegeSlug: college.slug,
            author: 'Aman Verma',
            role: '3rd Year CSE',
            title: `Mid-Sem Exam Dates Announced for ${college.name}!`,
            content: 'The date sheet for Sem 5 exams is out on the university portal. Exams start from Oct 15th.',
            tag: 'Announcement',
            upvotes: 45,
            commentsCount: 18
          },
          {
            collegeId: college._id,
            collegeSlug: college.slug,
            author: 'Neha Dixit',
            role: '4th Year CSE',
            title: 'Campus Hackathon 2026 Registration Open - Prize Pool ₹1,50,000!',
            content: 'Looking for 2 team members proficient in React + Node.js for 36-hr hackathon next weekend.',
            tag: 'Hackathon',
            upvotes: 89,
            commentsCount: 32
          }
        ]);
        console.log(`Seeded posts for: ${college.name}`);
      }

      // Seed Events if empty
      const eventsCount = await CampusEvent.countDocuments({ collegeSlug: data.slug });
      if (eventsCount === 0) {
        await CampusEvent.create([
          {
            collegeId: college._id,
            collegeSlug: college.slug,
            title: 'Sem 5 Mid-Term Examinations',
            date: 'Oct 15 - Oct 18',
            department: 'Department of CSE & IT',
            type: 'Exam',
          },
          {
            collegeId: college._id,
            collegeSlug: college.slug,
            title: 'Campus Hackathon 2026',
            date: 'Oct 24',
            department: 'All Departments',
            type: 'Hackathon',
          }
        ]);
        console.log(`Seeded events for: ${college.name}`);
      }
    }

    console.log('Community Data Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding community data:', error);
    process.exit(1);
  }
};

seedData();
