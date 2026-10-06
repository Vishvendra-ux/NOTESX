import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Route-level code splitting: each page ships as its own chunk so the initial
// bundle stays small. MainLayout keeps the shared shell; <Suspense> in
// MainLayout shows a loader while a chunk loads.
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Colleges = lazy(() => import('./pages/Colleges'));
const CollegeCommunity = lazy(() => import('./pages/CollegeCommunity'));
const Notes = lazy(() => import('./pages/Notes'));
const Gate = lazy(() => import('./pages/Gate'));
const Doubts = lazy(() => import('./pages/Doubts'));
const Contests = lazy(() => import('./pages/Contests'));
const Profile = lazy(() => import('./pages/Profile'));
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage'));
const Roadmaps = lazy(() => import('./pages/Roadmaps'));
const Jobs = lazy(() => import('./pages/Jobs'));
const BuildTogether = lazy(() => import('./pages/BuildTogether'));
const ProjectWorkspace = lazy(() => import('./pages/ProjectWorkspace'));
const Games = lazy(() => import('./pages/Games'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Must be logged in) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/roadmaps" element={<Roadmaps />} />
              <Route path="/roadmaps/:id" element={<Roadmaps />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<Jobs />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/colleges/:id" element={<CollegeCommunity />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:id" element={<Notes />} />
              <Route path="/notes/upload" element={<Notes />} />
              <Route path="/gate" element={<Gate />} />
              <Route path="/gate/questions" element={<Gate />} />
              <Route path="/gate/tests" element={<Gate />} />
              <Route path="/gate/tests/create" element={<Gate />} />
              <Route path="/gate/tests/:id" element={<Gate />} />
              <Route path="/gate/tests/:id/result" element={<Gate />} />
              <Route path="/doubts" element={<Doubts />} />
              <Route path="/doubts/:id" element={<Doubts />} />
              <Route path="/doubts/ask" element={<Doubts />} />
              <Route path="/contests" element={<Contests />} />
              <Route path="/contests/:id" element={<Contests />} />
              <Route path="/leaderboard" element={<Contests />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/settings" element={<Profile />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/build-together" element={<BuildTogether />} />
              <Route path="/build-together/:id/workspace" element={<ProjectWorkspace />} />
              <Route path="/buildtogether" element={<BuildTogether />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:gameId" element={<Games />} />
              <Route path="/admin" element={<Dashboard />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
