import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Live from './pages/Live';
import Placement from './pages/Placement';
import Assessments from './pages/Assessments';
import TestSession from './pages/TestSession';
import DashboardIndex from './dashboards/DashboardIndex';
import About from './pages/About';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';

const AppContent = () => {
  const location = useLocation();
  const isAuthOrDashboard = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/login');

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary font-sans selection:bg-primary/30">
      {!isAuthOrDashboard && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/live" element={<Live />} />
          <Route path="/placement" element={<Placement />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/test/:id" element={<TestSession />} />
          <Route path="/about" element={<About />} />
          {/* Specific Role Logins */}
          <Route path="/login/superadmin" element={<Login role="superAdmin" />} />
          <Route path="/login/admin" element={<Login role="collegeAdmin" />} />
          <Route path="/login/faculty" element={<Login role="faculty" />} />
          <Route path="/login/student" element={<Login role="student" />} />
          <Route path="/login/placement" element={<Login role="placement" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardIndex />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<DashboardIndex />} />
        </Routes>
      </main>
      {!isAuthOrDashboard && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
