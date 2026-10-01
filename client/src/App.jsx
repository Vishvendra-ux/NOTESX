import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Colleges from './pages/Colleges';
import CollegeCommunity from './pages/CollegeCommunity';
import Notes from './pages/Notes';
import Gate from './pages/Gate';
import Doubts from './pages/Doubts';
import Contests from './pages/Contests';
import Profile from './pages/Profile';
import AIAssistantPage from './pages/AIAssistantPage';
import Roadmaps from './pages/Roadmaps';
import Jobs from './pages/Jobs';
import BuildTogether from './pages/BuildTogether';

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
              <Route path="/buildtogether" element={<BuildTogether />} />
              <Route path="/admin" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
