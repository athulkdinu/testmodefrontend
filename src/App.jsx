import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import IncomingCallNotification from './components/IncomingCallNotification';
import { useAppContext } from './context/AppContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import Appointments from './pages/Appointments';
import MedicineTracker from './pages/MedicineTracker';
import HealthRecords from './pages/HealthRecords';
import Profile from './pages/Profile';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import PatientRecords from './pages/PatientRecords';
import DoctorNotes from './pages/DoctorNotes';
import DoctorSchedule from './pages/DoctorSchedule';
import DoctorVideoConsultation from './pages/DoctorVideoConsultation';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminDoctorManagement from './pages/AdminDoctorManagement';
import AdminReports from './pages/AdminReports';
import VideoConsultation from './pages/VideoConsultation';
import Newlogin from './pages/Newlogin';
import VideoCall from './pages/VideoCall'; // New Agora Page
// Lightweight role-based route guard that checks for authentication + role.
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

const App = () => {
  const location = useLocation();
  const { user } = useAppContext();

  // Hide navbar on landing, login, and register pages
  const hideNavbar = ['/', '/login', '/register'].includes(location.pathname);
  const showNavbar = !hideNavbar && user;

  return (
    <div className="min-h-screen bg-surface text-ink">
      {showNavbar && <Navbar />}
      <IncomingCallNotification />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/newlogin" element={<Newlogin />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute roles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute roles={['patient']}>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicine-tracker"
            element={
              <ProtectedRoute roles={['patient']}>
                <MedicineTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/records"
            element={
              <ProtectedRoute roles={['patient']}>
                <HealthRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/video-consultation"
            element={
              <ProtectedRoute roles={['patient']}>
                <VideoConsultation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={['patient']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute roles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute roles={['doctor']}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute roles={['doctor']}>
                <PatientRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/notes"
            element={
              <ProtectedRoute roles={['doctor']}>
                <DoctorNotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/schedule"
            element={
              <ProtectedRoute roles={['doctor']}>
                <DoctorSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/video-consultation"
            element={
              <ProtectedRoute roles={['doctor']}>
                <DoctorVideoConsultation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminUserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDoctorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            }
          />

          {/* Generic Agora Video Call - Admin not allowed */}
          <Route
            path="/video-call"
            element={
              <ProtectedRoute roles={['patient', 'doctor']}>
                <VideoCall />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

