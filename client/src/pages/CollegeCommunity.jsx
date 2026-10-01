import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Users, BookOpen, MessageSquare, Trophy, 
  Plus, Check, Share2, Flame, Search, Filter, Calendar, Award, 
  FileText, ExternalLink, ArrowRight, UserPlus, Sparkles, MessageCircle, RefreshCw,
  HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2, ThumbsUp, Trash2, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const fallbackColleges = {
  'gla': {
    id: 'gla',
    name: 'GLA University',
    location: 'Mathura, Uttar Pradesh',
    website: 'https://www.gla.ac.in',
    established: '1998',
    students: '12,400',
    notesCount: '2,340',
    doubtsCount: '890',
    rank: '#4 in UP',
    initial: 'G',
    color: 'from-indigo-600 via-blue-600 to-cyan-500',
    bannerImage: '/colleges/gla.webp',
    description: 'Premier private university in Mathura, UP. Renowned for Computer Science Engineering, High placement records, and vibrant student developer communities.',
    courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'BCA', 'MCA', 'MBA'],
    departments: [
      { name: 'Computer Science & Engineering', students: '4.2K', head: 'Dr. Anand Sharma' },
      { name: 'Electronics & Communication', students: '2.1K', head: 'Dr. R. K. Singh' },
      { name: 'Management Studies', students: '1.8K', head: 'Dr. Neeru Jaswal' },
    ]
  },
  'iit-delhi': {
    id: 'iit-delhi',
    name: 'Indian Institute of Technology Delhi',
    location: 'Hauz Khas, New Delhi',
    website: 'https://home.iitd.ac.in',
    established: '1961',
    students: '10,800',
    notesCount: '5,820',
    doubtsCount: '2,410',
    rank: '#2 in India',
    initial: 'I',
    color: 'from-emerald-600 via-teal-600 to-cyan-600',
    bannerImage: '/colleges/iit-delhi.jpg',
    description: 'Institute of National Importance. India\'s top engineering institute leading in research, artificial intelligence, and startup incubations.',
    courses: ['B.Tech CSE', 'B.Tech EE', 'B.Tech AI & Data Science', 'M.Tech', 'Ph.D'],
    departments: [
      { name: 'Computer Science & Engineering', students: '1.2K', head: 'Prof. Prem Kalra' },
      { name: 'Electrical Engineering', students: '1.5K', head: 'Prof. Jayadeva' },
    ]
  },
  'dtu': {
    id: 'dtu',
    name: 'Delhi Technological University',
    location: 'Rohini, New Delhi',
    website: 'http://dtu.ac.in',
    established: '1941',
    students: '15,100',
    notesCount: '3,160',
    doubtsCount: '1,280',
    rank: '#8 in India',
    initial: 'D',
    color: 'from-violet-600 via-purple-600 to-indigo-600',
    bannerImage: '/colleges/dtu.jpg',
    description: 'Formerly DCE (Delhi College of Engineering). Legendary legacy institution known for engineering excellence and competitive programming culture.',
    courses: ['B.Tech Software Eng.', 'B.Tech CSE', 'B.Tech IT', 'B.Tech ECE'],
    departments: [
      { name: 'Software Engineering', students: '2.4K', head: 'Dr. Ruchika Malhotra' },
      { name: 'Computer Science', students: '3.1K', head: 'Dr. Rajni Jindal' },
    ]
  },
  'aktu': {
    id: 'aktu',
    name: 'Dr. A.P.J. Abdul Kalam Technical University',
    location: 'Lucknow, Uttar Pradesh',
    website: 'https://aktu.ac.in',
    established: '2000',
    students: '400K',
    notesCount: '8,420',
    doubtsCount: '3,890',
    rank: '#1 State Tech Univ',
    initial: 'A',
    color: 'from-orange-600 via-amber-600 to-red-600',
    bannerImage: '/colleges/aktu.jpg',
    description: 'Premier technical university of Uttar Pradesh affiliating 700+ engineering and management colleges.',
    courses: ['B.Tech CSE', 'B.Tech IT', 'B.Tech ECE', 'BCA', 'MCA'],
    departments: [
      { name: 'Computer Science & Engineering', students: '80K', head: 'Dr. V. K. Pathak' },
      { name: 'Electronics Engineering', students: '45K', head: 'Dr. M. K. Dutta' },
    ]
  },
  'iit-bombay': {
    id: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay',
    location: 'Powai, Mumbai',
    website: 'https://www.iitb.ac.in',
    established: '1958',
    students: '11,200',
    notesCount: '6,140',
    doubtsCount: '2,920',
    rank: '#1 in India (QS World)',
    initial: 'I',
    color: 'from-sky-600 via-blue-600 to-indigo-700',
    bannerImage: '/colleges/iit-bombay.jpg',
    description: 'Premier technological and research university located along the scenic Powai Lake in Mumbai.',
    courses: ['B.Tech CSE', 'B.Tech Electrical', 'B.Tech Mechanical', 'M.Tech', 'Ph.D'],
    departments: [
      { name: 'Computer Science & Engineering', students: '1.4K', head: 'Prof. Varsha Apte' },
      { name: 'Electrical Engineering', students: '1.6K', head: 'Prof. Kishore Chatterjee' },
    ]
  },
  'vit': {
    id: 'vit',
    name: 'Vellore Institute of Technology',
    location: 'Vellore, Tamil Nadu',
    website: 'https://vit.ac.in',
    established: '1984',
    students: '34,000',
    notesCount: '4,980',
    doubtsCount: '2,150',
    rank: '#8 University in India',
    initial: 'V',
    color: 'from-cyan-600 via-blue-600 to-indigo-700',
    bannerImage: '/colleges/vit.jpg',
    description: 'Massive modern private institution renowned for state-of-the-art labs, tech fests, and high placements.',
    courses: ['B.Tech CSE', 'B.Tech IT', 'B.Tech AI', 'MCA', 'Integrated M.Tech'],
    departments: [
      { name: 'School of Computer Science', students: '9.2K', head: 'Dr. Saravanan R.' },
      { name: 'School of Electronics', students: '4.8K', head: 'Dr. Sivanantha Raja' },
    ]
  },
  'bits': {
    id: 'bits',
    name: 'BITS Pilani',
    location: 'Pilani, Rajasthan',
    website: 'https://www.bits-pilani.ac.in',
    established: '1964',
    students: '6,500',
    notesCount: '3,720',
    doubtsCount: '1,640',
    rank: '#1 Private Tech Institute',
    initial: 'B',
    color: 'from-rose-600 via-pink-600 to-purple-600',
    bannerImage: '/colleges/bits.jpg',
    description: 'Iconic merit-based university renowned for no-attendance policy, startup culture, and top-tier alumni.',
    courses: ['B.E. Computer Science', 'B.E. Electronics', 'M.Sc Dual Degree', 'Ph.D'],
    departments: [
      { name: 'Computer Science & IS', students: '1.1K', head: 'Prof. Shan Balasubramaniam' },
      { name: 'Electrical & Electronics', students: '1.3K', head: 'Prof. Navneet Gupta' },
    ]
  },
  'nit-trichy': {
    id: 'nit-trichy',
    name: 'National Institute of Technology Tiruchirappalli',
    location: 'Tiruchirappalli, Tamil Nadu',
    website: 'https://www.nitt.edu',
    established: '1964',
    students: '7,800',
    notesCount: '2,860',
    doubtsCount: '1,120',
    rank: '#1 NIT in India',
    initial: 'N',
    color: 'from-amber-600 via-orange-600 to-rose-600',
    bannerImage: '/colleges/nit-trichy.png',
    description: 'Consistently ranked the #1 NIT in India, recognized for research excellence and national engineering talent.',
    courses: ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'MCA'],
    departments: [
      { name: 'Computer Science & Eng', students: '950', head: 'Dr. S. Mary Saira Bhanu' },
      { name: 'Electronics & Communication', students: '1.1K', head: 'Dr. G. Lakshminarayanan' },
    ]
  },
  'manipal': {
    id: 'manipal',
    name: 'Manipal Institute of Technology',
    location: 'Manipal, Karnataka',
    website: 'https://manipal.edu/mit',
    established: '1957',
    students: '10,200',
    notesCount: '2,940',
    doubtsCount: '1,380',
    rank: '#5 Private Eng College',
    initial: 'M',
    color: 'from-fuchsia-600 via-purple-600 to-indigo-600',
    bannerImage: '/colleges/manipal.jpg',
    description: 'Vibrant coastal college campus celebrated for global alumni, cutting-edge student clubs, and tech incubation.',
    courses: ['B.Tech CSE', 'B.Tech Data Science', 'B.Tech IT', 'M.Tech'],
    departments: [
      { name: 'Computer Science', students: '2.8K', head: 'Dr. Srikanth Prabhu' },
      { name: 'Information & Comm Tech', students: '1.9K', head: 'Dr. Smitha N. Pai' },
    ]
  },
  'iit-kanpur': {
    id: 'iit-kanpur',
    name: 'Indian Institute of Technology Kanpur',
    location: 'Kanpur, Uttar Pradesh',
    website: 'https://www.iitk.ac.in',
    established: '1959',
    students: '8,100',
    notesCount: '4,640',
    doubtsCount: '2,180',
    rank: '#3 in Engineering (NIRF)',
    initial: 'I',
    color: 'from-emerald-600 via-green-600 to-teal-600',
    bannerImage: '/colleges/iit-kanpur.jpg',
    description: 'Pioneer of computer science education in India with sprawling green 1,000-acre residential campus.',
    courses: ['B.Tech CSE', 'B.Tech EE', 'B.Tech Aerospace', 'M.Tech', 'Ph.D'],
    departments: [
      { name: 'Computer Science & Engineering', students: '1.1K', head: 'Prof. Nitin Saxena' },
      { name: 'Electrical Engineering', students: '1.3K', head: 'Prof. Rohit Budhiraja' },
    ]
  },
  'jadavpur': {
    id: 'jadavpur',
    name: 'Jadavpur University',
    location: 'Kolkata, West Bengal',
    website: 'http://www.jaduniv.edu.in',
    established: '1955',
    students: '13,300',
    notesCount: '2,520',
    doubtsCount: '1,050',
    rank: '#4 University in India (NIRF)',
    initial: 'J',
    color: 'from-indigo-600 via-violet-600 to-purple-700',
    bannerImage: '/colleges/jadavpur.jpg',
    description: 'Acclaimed public research university famous for academic rigour, research output, and top return on investment.',
    courses: ['B.E. Computer Science', 'B.E. IT', 'B.E. Electronics', 'MCA'],
    departments: [
      { name: 'Computer Science & Eng', students: '1.5K', head: 'Prof. Ujjwal Maulik' },
      { name: 'Information Technology', students: '1.2K', head: 'Prof. Samiran Chattopadhyay' },
    ]
  },
  'rvce': {
    id: 'rvce',
    name: 'RV College of Engineering',
    location: 'Bengaluru, Karnataka',
    website: 'https://www.rvce.edu.in',
    established: '1963',
    students: '5,600',
    notesCount: '1,840',
    doubtsCount: '810',
    rank: '#1 Autonomous in Bengaluru',
    initial: 'R',
    color: 'from-teal-600 via-emerald-600 to-cyan-600',
    bannerImage: '/colleges/rvce.jpg',
    description: 'Premier private technical institution in India’s Silicon Valley, with deep tech industry ties and coding clubs.',
    courses: ['B.E. CSE', 'B.E. ISE', 'B.E. AI & ML', 'M.Tech'],
    departments: [
      { name: 'Computer Science & Engineering', students: '1.4K', head: 'Dr. Ramakanth Kumar P.' },
      { name: 'Information Science & Eng', students: '1.1K', head: 'Dr. B. M. Sagar' },
    ]
  }
};

const sampleNotes = [
  { id: 1, title: 'Operating Systems - Process Sync & Deadlocks', subject: 'OS', course: 'B.Tech CSE', sem: 'Sem 5', author: 'Aman Verma', rating: 4.9, downloads: '1.2K', likes: 142 },
  { id: 2, title: 'DBMS Normalization & B+ Trees Hand-written Notes', subject: 'DBMS', course: 'B.Tech CSE', sem: 'Sem 4', author: 'Priya Sharma', rating: 4.8, downloads: '980', likes: 98 },
  { id: 3, title: 'Design & Analysis of Algorithms (DAA) GATE Level Notes', subject: 'DAA', course: 'B.Tech CSE', sem: 'Sem 5', author: 'Rahul Gupta', rating: 4.9, downloads: '2.1K', likes: 230 },
  { id: 4, title: 'Compiler Design - Parsing & Syntax Trees', subject: 'CD', course: 'B.Tech CSE', sem: 'Sem 6', author: 'Sneha Patel', rating: 4.7, downloads: '640', likes: 64 },
];

const sampleLeaderboard = [
  { rank: 1, name: 'Aditya Sharma', year: '4th Year CSE', xp: '14,250', badges: ['🔥 42 Day Streak', 'Top Contributor'] },
  { rank: 2, name: 'Ananya Roy', year: '3rd Year CSE', xp: '12,890', badges: ['⚡ 28 Day Streak', 'GATE Prep Specialist'] },
  { rank: 3, name: 'Karan Patel', year: '3rd Year IT', xp: '11,400', badges: ['🎯 Bug Hunter'] },
  { rank: 4, name: 'Simran Kaur', year: '2nd Year CSE', xp: '9,820', badges: ['📚 Notes Hero'] },
];

const initialCampusDoubts = [
  {
    id: 'cd-1',
    author: 'Rohan Mehta',
    role: '2nd Year IT',
    subject: 'Operating Systems',
    title: 'What is the difference between Peterson algorithm and TestAndSet hardware instruction for mutual exclusion?',
    content: 'Can someone explain with a code snippet how TestAndSet achieves process synchronization without race conditions?',
    votes: 18,
    hasUpvoted: false,
    time: '3 hours ago',
    answers: [
      {
        id: 'ans-1',
        author: 'Prof. Jayadeva (Faculty)',
        role: 'Faculty - CSE',
        content: 'TestAndSet is an atomic hardware instruction provided by CPU processors that executes atomically (cannot be interrupted). Peterson algorithm is a software solution for 2 processes using flag and turn variables.',
        isAccepted: true,
        votes: 12,
        hasUpvoted: false,
        time: '2 hours ago'
      }
    ]
  },
  {
    id: 'cd-2',
    author: 'Anjali Srivastava',
    role: '3rd Year CSE',
    subject: 'DBMS',
    title: 'Why do we need 3NF if BCNF is strictly stronger?',
    content: 'In database design, when is it preferred to keep a schema in 3NF instead of decomposing further into BCNF?',
    votes: 24,
    hasUpvoted: false,
    time: '1 day ago',
    answers: [
      {
        id: 'ans-2',
        author: 'Aditya Sharma',
        role: '4th Year CSE',
        content: 'Because BCNF decomposition does NOT always preserve functional dependencies! When dependency preservation is required, 3NF is preferred over BCNF.',
        isAccepted: true,
        votes: 19,
        hasUpvoted: false,
        time: '18 hours ago'
      }
    ]
  }
];

export default function CollegeCommunity() {
  const { id } = useParams();
  const slugOrId = id || 'gla';

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const [college, setCollege] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [isJoined, setIsJoined] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('All');
  
  // Post Feed States
  const [newPostText, setNewPostText] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);

  // Campus Doubts States
  const [campusDoubts, setCampusDoubts] = useState(initialCampusDoubts);
  const [showAskDoubtForm, setShowAskDoubtForm] = useState(false);
  const [doubtTitle, setDoubtTitle] = useState('');
  const [doubtSubject, setDoubtSubject] = useState('Operating Systems');
  const [doubtContent, setDoubtContent] = useState('');
  const [expandedDoubtId, setExpandedDoubtId] = useState(null);
  const [answerInputMap, setAnswerInputMap] = useState({});

  // Fetch College Data & Posts from Backend API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const resCollege = await api.get(`/colleges/community/${slugOrId}`);
        if (isMounted && resCollege.data) {
          setCollege(resCollege.data);
        }
      } catch (err) {
        if (isMounted) {
          setCollege(fallbackColleges[slugOrId] || {
            id: slugOrId,
            name: slugOrId.toUpperCase().replace('-', ' ') + ' Community',
            location: 'India',
            website: 'https://university.edu',
            established: '2000',
            students: '10K+',
            notesCount: '1,500+',
            doubtsCount: '600+',
            rank: '#1 Campus Network',
            initial: slugOrId.charAt(0).toUpperCase(),
            color: 'from-indigo-600 via-blue-600 to-purple-600',
            description: 'Official student community on CampusSphere. Access notes, participate in discussions, solve campus doubts, and compete on the college leaderboard.',
            courses: ['B.Tech CSE', 'B.Tech ECE', 'BCA', 'MCA'],
            departments: [
              { name: 'Department of Computer Science', students: '3K+', head: 'HOD CSE' },
            ]
          });
        }
      }

      try {
        const resPosts = await api.get(`/colleges/community/${slugOrId}/posts`);
        if (isMounted && resPosts.data && resPosts.data.length > 0) {
          setPosts(resPosts.data.map(p => ({ ...p, hasUpvoted: false })));
        } else {
          setPosts([
            { id: 1, author: 'Aman Verma', role: '3rd Year CSE', title: `Mid-Sem Exam Dates Announced!`, content: 'The date sheet for Sem 5 exams is out on the portal. Exams start from Oct 15th.', upvotes: 45, hasUpvoted: false, commentsCount: 18, time: '2 hours ago', tag: 'Announcement' },
            { id: 2, author: 'Neha Dixit', role: '4th Year CSE', title: 'Campus Hackathon 2026 Registration Open - Prize Pool ₹1,50,000!', content: 'Looking for 2 team members proficient in React + Node.js for 36-hr hackathon next weekend.', upvotes: 89, hasUpvoted: false, commentsCount: 32, time: '5 hours ago', tag: 'Hackathon' }
          ]);
        }
      } catch (err) {}

      try {
        const resEvents = await api.get(`/colleges/community/${slugOrId}/events`);
        if (isMounted && resEvents.data && resEvents.data.length > 0) {
          setEvents(resEvents.data);
        } else {
          setEvents([
            { id: 1, title: 'Sem 5 Mid-Term Examinations', date: 'Oct 15 - Oct 18', department: 'Department of CSE & IT' },
            { id: 2, title: 'Campus Hackathon 2026', date: 'Oct 24', department: 'All Departments' }
          ]);
        }
      } catch (err) {}

      if (isMounted) setLoading(false);
    };

    fetchData();
    return () => { isMounted = false; };
  }, [slugOrId]);

  // Handle Post Creation on Feed
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setSubmittingPost(true);
    const postData = {
      title: newPostText.slice(0, 50) + (newPostText.length > 50 ? '...' : ''),
      content: newPostText,
      tag: 'General',
      author: user?.name || 'You (Student)',
    };

    try {
      const res = await api.post(`/colleges/community/${slugOrId}/posts`, postData);
      if (res.data) {
        setPosts([{ ...res.data, hasUpvoted: false }, ...posts]);
      }
    } catch (err) {
      const localPost = {
        _id: Date.now().toString(),
        author: user?.name || 'You (Student)',
        role: user?.role === 'admin' ? 'System Admin' : 'CSE Student',
        title: postData.title,
        content: newPostText,
        upvotes: 1,
        hasUpvoted: false,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        tag: 'General'
      };
      setPosts([localPost, ...posts]);
    }

    setNewPostText('');
    setSubmittingPost(false);
  };

  // ── DELETE POST (Author or Admin Moderation) ──
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    setPosts(prevPosts => prevPosts.filter(p => (p._id !== postId && p.id !== postId)));

    try {
      await api.delete(`/colleges/community/posts/${postId}`);
    } catch (err) {
      console.warn('Backend delete notification handled');
    }
  };

  // ── ADMIN DELETE CAMPUS DOUBT ──
  const handleDeleteDoubt = (doubtId) => {
    if (!window.confirm('Admin Moderation: Are you sure you want to remove this doubt?')) return;
    setCampusDoubts(prevDoubts => prevDoubts.filter(d => (d.id !== doubtId && d._id !== doubtId)));
  };

  // ── ACCURATE TOGGLE UPVOTE FOR FEED POSTS ──
  const handleTogglePostUpvote = async (postId) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p._id === postId || p.id === postId) {
        const isCurrentlyUpvoted = p.hasUpvoted || false;
        return {
          ...p,
          hasUpvoted: !isCurrentlyUpvoted,
          upvotes: isCurrentlyUpvoted ? Math.max(0, (p.upvotes || 1) - 1) : (p.upvotes || 0) + 1
        };
      }
      return p;
    }));

    try {
      await api.post(`/colleges/community/posts/${postId}/upvote`);
    } catch (e) {}
  };

  // ── ACCURATE TOGGLE UPVOTE FOR CAMPUS DOUBTS ──
  const handleToggleDoubtVote = (doubtId) => {
    setCampusDoubts(prevDoubts => prevDoubts.map(d => {
      if (d.id === doubtId || d._id === doubtId) {
        const isCurrentlyUpvoted = d.hasUpvoted || false;
        return {
          ...d,
          hasUpvoted: !isCurrentlyUpvoted,
          votes: isCurrentlyUpvoted ? Math.max(0, (d.votes || 1) - 1) : (d.votes || 0) + 1
        };
      }
      return d;
    }));
  };

  // ── ACCURATE TOGGLE UPVOTE FOR DOUBT ANSWERS ──
  const handleToggleAnswerVote = (doubtId, answerId) => {
    setCampusDoubts(prevDoubts => prevDoubts.map(d => {
      if (d.id === doubtId || d._id === doubtId) {
        const updatedAns = d.answers.map(ans => {
          if (ans.id === answerId || ans._id === answerId) {
            const isCurrentlyUpvoted = ans.hasUpvoted || false;
            return {
              ...ans,
              hasUpvoted: !isCurrentlyUpvoted,
              votes: isCurrentlyUpvoted ? Math.max(0, (ans.votes || 1) - 1) : (ans.votes || 0) + 1
            };
          }
          return ans;
        });
        return { ...d, answers: updatedAns };
      }
      return d;
    }));
  };

  // ── CAMPUS DOUBT SUBMISSION ──
  const handleAskCampusDoubt = (e) => {
    e.preventDefault();
    if (!doubtTitle.trim() || !doubtContent.trim()) return;

    const newDoubt = {
      id: `cd-${Date.now()}`,
      author: user?.name || 'You (Student)',
      role: user?.role === 'admin' ? 'System Admin' : 'CSE Student',
      subject: doubtSubject,
      title: doubtTitle,
      content: doubtContent,
      votes: 1,
      hasUpvoted: true,
      time: 'Just now',
      answers: []
    };

    setCampusDoubts([newDoubt, ...campusDoubts]);
    setDoubtTitle('');
    setDoubtContent('');
    setShowAskDoubtForm(false);
  };

  // ── POST ANSWER TO A CAMPUS DOUBT ──
  const handleAddAnswer = (doubtId) => {
    const text = answerInputMap[doubtId];
    if (!text || !text.trim()) return;

    const newAns = {
      id: `ans-${Date.now()}`,
      author: user?.name || 'You (Student)',
      role: user?.role === 'admin' ? 'System Admin' : 'CSE Student',
      content: text,
      isAccepted: false,
      votes: 1,
      hasUpvoted: true,
      time: 'Just now'
    };

    setCampusDoubts(campusDoubts.map(d => {
      if (d.id === doubtId) {
        return { ...d, answers: [...d.answers, newAns] };
      }
      return d;
    }));

    setAnswerInputMap({ ...answerInputMap, [doubtId]: '' });
  };

  if (loading && !college) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={28} className="animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-600">Loading campus community...</p>
        </div>
      </div>
    );
  }

  const activeCollege = college || fallbackColleges['gla'];
  const stats = activeCollege.stats || { studentCount: '12.4K', notesCount: '2,340', doubtsCount: '890' };

  return (
    <div className="animate-fade-in pb-20">
      {/* Admin Moderation Active Banner */}
      {isAdmin && (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-800 shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-600" />
            <span>Admin Moderation Mode Active — You can delete any post or doubt that is inappropriate or illogical for students.</span>
          </div>
          <span className="rounded-md bg-rose-200/80 px-2 py-0.5 text-[10px] uppercase font-extrabold tracking-wider text-rose-900">
            Admin Privileges
          </span>
        </div>
      )}

      {/* ── College Banner & Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        {/* Banner with College Campus Photo */}
        <div className="h-52 sm:h-64 w-full relative overflow-hidden bg-slate-950">
          <img 
            src={activeCollege.bannerImage || '/colleges/iit-delhi.jpg'} 
            alt={`${activeCollege.name} Campus`} 
            className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/colleges/iit-delhi.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-black/30" />

          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button 
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="flex items-center gap-1.5 rounded-full border border-white/30 bg-black/40 hover:bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition shadow-md"
            >
              <Share2 size={13} /> Share Community
            </button>
          </div>
        </div>

        {/* Info Header */}
        <div className="relative px-6 pb-6 pt-0 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-3 pb-1 mb-6">
            <div className="flex items-end gap-4">
              <div className={`grid h-24 w-24 shrink-0 -mt-14 place-items-center rounded-2xl bg-gradient-to-br ${activeCollege.bannerColor || 'from-indigo-600 to-blue-600'} border-4 border-white text-4xl font-extrabold text-white shadow-xl`}>
                {activeCollege.initial || (activeCollege.name ? activeCollege.name.charAt(0) : 'C')}
              </div>
              <div className="pb-1 pt-1 sm:pt-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 mb-1">
                  <Sparkles size={12} /> {activeCollege.rank || '#1 Campus Network'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {activeCollege.name}
                </h1>
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-0.5">
                  <MapPin size={13} className="text-indigo-600" /> {activeCollege.location}
                  {activeCollege.website && (
                    <a href={activeCollege.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-indigo-600 font-semibold hover:underline ml-2">
                      Official Website <ExternalLink size={11} />
                    </a>
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsJoined(!isJoined)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-sm ${
                  isJoined 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {isJoined ? <><Check size={16} /> Joined Campus</> : <><UserPlus size={16} /> Join Community</>}
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            {activeCollege.description}
          </p>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-100 text-indigo-600"><Users size={18} /></span>
              <div>
                <b className="block text-base font-extrabold text-slate-900">{stats.studentCount || '10K+'}</b>
                <span className="text-xs text-slate-500 font-medium">Campus Members</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-100 text-violet-600"><BookOpen size={18} /></span>
              <div>
                <b className="block text-base font-extrabold text-slate-900">{stats.notesCount || '2,000+'}</b>
                <span className="text-xs text-slate-500 font-medium">Shared Notes</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-600"><MessageSquare size={18} /></span>
              <div>
                <b className="block text-base font-extrabold text-slate-900">{stats.doubtsCount || '800+'}</b>
                <span className="text-xs text-slate-500 font-medium">Doubts Solved</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-100 text-amber-600"><Trophy size={18} /></span>
              <div>
                <b className="block text-base font-extrabold text-slate-900">{activeCollege.rank || '#1 Network'}</b>
                <span className="text-xs text-slate-500 font-medium">State Ranking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Community Navigation Tabs ── */}
      <div className="mt-8 flex items-center justify-between border-b border-slate-200 pb-px overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {[
            { id: 'feed', label: '💬 Discussions & Feed' },
            { id: 'notes', label: '📚 Study Notes' },
            { id: 'doubts', label: '❓ Campus Doubts' },
            { id: 'leaderboard', label: '🏆 Campus Leaderboard' },
            { id: 'courses', label: '🎓 Courses & Depts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="mt-6">

        {/* ── TAB 1: FEED & DISCUSSIONS ── */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Create Post Card */}
              <form onSubmit={handleCreatePost} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'YOU'}
                  </span>
                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder={`Post an announcement, query, or update for ${activeCollege.name} students...`}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-indigo-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">📌 Campus Post</span>
                  <button type="submit" disabled={submittingPost} className="btn-primary py-2 text-xs px-4">
                    {submittingPost ? 'Posting...' : 'Post to Campus'} <Plus size={14} />
                  </button>
                </div>
              </form>

              {/* Feed Posts */}
              <div className="flex flex-col gap-4">
                {posts.map((post) => {
                  const postId = post._id || post.id;
                  const isUpvoted = post.hasUpvoted || false;

                  return (
                    <div key={postId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 transition relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                            {post.author ? post.author.charAt(0) : 'S'}
                          </span>
                          <div>
                            <b className="block text-sm font-bold text-slate-900">{post.author}</b>
                            <span className="text-[11px] text-slate-500">{post.role || 'CSE Student'} · {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : post.time || 'Recently'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                            {post.tag || 'General'}
                          </span>

                          {/* ADMIN DELETE BUTTON */}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeletePost(postId)}
                              className="flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition"
                              title="Delete this post (Admin Moderation)"
                            >
                              <Trash2 size={13} className="text-rose-600" /> Delete (Admin)
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-3 text-base font-bold text-slate-900">{post.title}</h3>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{post.content}</p>

                      <div className="mt-4 flex items-center gap-6 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                        <button 
                          onClick={() => handleTogglePostUpvote(postId)} 
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition border ${
                            isUpvoted 
                              ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-2xs' 
                              : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          <Flame size={15} className={isUpvoted ? 'fill-orange-500 text-orange-500' : 'text-slate-400'} /> 
                          {post.upvotes || 0} {isUpvoted ? 'Upvoted' : 'Upvote'}
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-indigo-600">
                          <MessageSquare size={15} /> {post.commentsCount || 0} Comments
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-600" /> Campus Events
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  {events.map((evt, i) => (
                    <div key={i} className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">{evt.date}</span>
                      <b className="block text-sm font-bold text-slate-900 mt-0.5">{evt.title}</b>
                      <span className="text-xs text-slate-500">{evt.department || 'All Departments'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 size={18} className="text-indigo-600" /> Departments
                </h3>
                <div className="mt-3 flex flex-col divide-y divide-slate-100">
                  {(activeCollege.departments || []).map((dept, i) => (
                    <div key={i} className="py-2.5 first:pt-0 last:pb-0">
                      <b className="block text-xs font-bold text-slate-800">{dept.name}</b>
                      <span className="text-[11px] text-slate-500">{dept.students} Students · Head: {dept.head}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: STUDY NOTES ── */}
        {activeTab === 'notes' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Filter by Course:</span>
                <div className="flex gap-2">
                  {['All', ...(activeCollege.courses || ['B.Tech CSE', 'BCA'])].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCourse(c)}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold border ${
                        selectedCourse === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <Link to="/notes" className="btn-primary text-xs py-2 px-4">
                <Plus size={14} /> Upload Note for {activeCollege.name}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleNotes.map((note) => (
                <div key={note.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 transition">
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><FileText size={20} /></span>
                    <span className="rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">★ {note.rating}</span>
                  </div>
                  <span className="mt-3 inline-block rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">{note.subject} · {note.sem}</span>
                  <h3 className="mt-2 text-base font-bold text-slate-900">{note.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">Uploaded by {note.author} · {note.course}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span>↓ {note.downloads} downloads</span>
                    <Link to="/notes" className="font-bold text-indigo-600 hover:underline">Download →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: CAMPUS DOUBTS (FULLY INLINE ON SAME PAGE) ── */}
        {activeTab === 'doubts' && (
          <div className="flex flex-col gap-6">
            {/* Doubts Header & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle size={18} className="text-indigo-600" /> Campus Doubts Q&A for {activeCollege.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ask batchmates and faculty from {activeCollege.name}. All questions stay inside this campus community.
                </p>
              </div>
              <button 
                onClick={() => setShowAskDoubtForm(!showAskDoubtForm)} 
                className="btn-primary text-xs py-2 px-4 shrink-0 flex items-center gap-1.5"
              >
                {showAskDoubtForm ? 'Cancel Form' : 'Ask Campus Doubt'} <Plus size={14} />
              </button>
            </div>

            {/* Inline Ask Doubt Form (ON SAME PAGE) */}
            {showAskDoubtForm && (
              <form onSubmit={handleAskCampusDoubt} className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 shadow-sm animate-slide-up">
                <h4 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-1.5">
                  <Sparkles size={15} className="text-indigo-600" /> Post a Doubt to {activeCollege.name} Community
                </h4>

                <div className="grid gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Topic</label>
                    <select
                      value={doubtSubject}
                      onChange={(e) => setDoubtSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:border-indigo-600 focus:outline-none"
                    >
                      <option>Operating Systems</option>
                      <option>DBMS</option>
                      <option>Data Structures & Algorithms</option>
                      <option>Computer Networks</option>
                      <option>Compiler Design</option>
                      <option>General Campus Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Doubt Title / Summary</label>
                    <input
                      type="text"
                      value={doubtTitle}
                      onChange={(e) => setDoubtTitle(e.target.value)}
                      placeholder="e.g. How to solve deadlock avoidance problem in Sem 5 assignment?"
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Question & Context</label>
                    <textarea
                      value={doubtContent}
                      onChange={(e) => setDoubtContent(e.target.value)}
                      placeholder="Explain what you have tried or attach your query details here..."
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-indigo-600 focus:outline-none resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAskDoubtForm(false)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs py-1.5 px-4">
                    Submit Campus Doubt <Send size={13} />
                  </button>
                </div>
              </form>
            )}

            {/* Doubts List */}
            <div className="flex flex-col gap-4">
              {campusDoubts.map((doubt) => {
                const doubtId = doubt._id || doubt.id;
                const isExpanded = expandedDoubtId === doubtId;
                const answerText = answerInputMap[doubtId] || '';
                const isDoubtUpvoted = doubt.hasUpvoted || false;

                return (
                  <div key={doubtId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                          {doubt.author.charAt(0)}
                        </span>
                        <div>
                          <b className="block text-xs font-bold text-slate-900">{doubt.author}</b>
                          <span className="text-[10px] text-slate-500">{doubt.role} · {doubt.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                          {doubt.subject}
                        </span>

                        {/* ADMIN DELETE BUTTON */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteDoubt(doubtId)}
                            className="flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100 transition"
                            title="Delete this doubt (Admin Moderation)"
                          >
                            <Trash2 size={12} className="text-rose-600" /> Delete (Admin)
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-900">{doubt.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{doubt.content}</p>

                    {/* Bottom Actions Bar */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 size={15} /> {doubt.answers ? doubt.answers.length : 0} Answers
                        </span>

                        <button 
                          onClick={() => handleToggleDoubtVote(doubtId)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition border ${
                            isDoubtUpvoted
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          <ThumbsUp size={14} className={isDoubtUpvoted ? 'fill-indigo-600 text-indigo-600' : 'text-slate-400'} /> 
                          {doubt.votes} {isDoubtUpvoted ? 'Voted' : 'Vote'}
                        </button>
                      </div>

                      <button
                        onClick={() => setExpandedDoubtId(isExpanded ? null : doubtId)}
                        className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        {isExpanded ? <>Hide Answers <ChevronUp size={14} /></> : <>View & Answer ({doubt.answers ? doubt.answers.length : 0}) <ChevronDown size={14} /></>}
                      </button>
                    </div>

                    {/* Inline Answers Thread */}
                    {isExpanded && (
                      <div className="mt-4 border-t border-slate-100 pt-4 flex flex-col gap-3 animate-fade-in bg-slate-50/70 p-4 rounded-xl">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Campus Discussion & Answers ({doubt.answers.length})
                        </h4>

                        {doubt.answers.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">No answers submitted yet. Be the first student to answer!</p>
                        ) : (
                          doubt.answers.map((ans) => {
                            const ansId = ans._id || ans.id;
                            const isAnsUpvoted = ans.hasUpvoted || false;

                            return (
                              <div key={ansId} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                                      {ans.author.charAt(0)}
                                    </span>
                                    <b className="text-xs font-bold text-slate-800">{ans.author}</b>
                                    <span className="text-[10px] text-slate-500">({ans.role})</span>
                                  </div>
                                  {ans.isAccepted && (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-800">
                                      ✓ Accepted Answer
                                    </span>
                                  )}
                                </div>
                                <p className="mt-2 text-xs text-slate-700 leading-relaxed">{ans.content}</p>
                                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                                  <span>{ans.time}</span>
                                  <button
                                    onClick={() => handleToggleAnswerVote(doubtId, ansId)}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded font-bold transition ${
                                      isAnsUpvoted ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-500'
                                    }`}
                                  >
                                    <ThumbsUp size={11} className={isAnsUpvoted ? 'fill-indigo-600 text-indigo-600' : ''} /> 
                                    {ans.votes} {isAnsUpvoted ? 'Voted' : 'Vote'}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}

                        {/* Inline Answer Submission Form */}
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            value={answerText}
                            onChange={(e) => setAnswerInputMap({ ...answerInputMap, [doubtId]: e.target.value })}
                            placeholder="Write your answer to help your batchmate..."
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddAnswer(doubtId); }}
                          />
                          <button
                            onClick={() => handleAddAnswer(doubtId)}
                            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 shrink-0"
                          >
                            Post Answer <Send size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 4: LEADERBOARD ── */}
        {activeTab === 'leaderboard' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" /> {activeCollege.name} Student Rank List
                </h3>
                <p className="text-xs text-slate-500">Based on problem solving, GATE tests, and study material contributions.</p>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-slate-100">
              {sampleLeaderboard.map((user) => (
                <div key={user.rank} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-extrabold ${
                      user.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      user.rank === 2 ? 'bg-slate-200 text-slate-800' :
                      user.rank === 3 ? 'bg-orange-100 text-orange-800' : 'bg-slate-50 text-slate-600'
                    }`}>
                      #{user.rank}
                    </span>
                    <div>
                      <b className="block text-sm font-bold text-slate-900">{user.name}</b>
                      <span className="text-xs text-slate-500">{user.year}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex gap-1.5">
                      {user.badges.map((b, i) => (
                        <span key={i} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                          {b}
                        </span>
                      ))}
                    </div>
                    <b className="text-sm font-extrabold text-indigo-600">{user.xp} XP</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: COURSES ── */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeCollege.courses || ['B.Tech CSE', 'B.Tech ECE', 'MCA', 'MBA']).map((course, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
                <div>
                  <b className="block text-base font-bold text-slate-900">{course}</b>
                  <span className="text-xs text-slate-500">Degree Program</span>
                </div>
                <Link to="/notes" className="btn-secondary text-xs py-1.5 px-3">
                  View Syllabus & Notes
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
