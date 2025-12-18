import { useState, useEffect } from 'react';
import { FiBarChart2, FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiActivity } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';
import DashboardCard from '../components/DashboardCard';
import { useAppContext } from '../context/AppContext';
import { getAdminDashboardAPI } from '../services/allAPI';

const links = [
  { to: '/admin/users', label: 'Manage Users', icon: <FiUsers /> },
  { to: '/admin/doctors', label: 'Manage Doctors', icon: <FiBriefcase /> },
  { to: '/admin/reports', label: 'Reports & Analytics', icon: <FiBarChart2 /> },
];

const AdminDashboard = () => {
  const { adminUsers, adminDoctors, user } = useAppContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user || !user.token) return;
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await getAdminDashboardAPI(reqHeader);
      if (result.status === 200) {
        const data = await result.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Sidebar title="Admin Control" links={links} />
        <div className="space-y-8">
          <BackButton />
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar title="Admin Control" links={links} />

      <div className="space-y-8">
        <BackButton />

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Admin'}!</h1>
          <p className="text-white/90">Manage your healthcare system efficiently</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {dashboardData?.totalPatients || adminUsers.length}
                </p>
              </div>
              <div className="bg-blue-200 rounded-full p-4">
                <FiUsers className="text-2xl text-blue-700" />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-3">Active users in system</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Total Doctors</p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {dashboardData?.totalDoctors || adminDoctors.length}
                </p>
              </div>
              <div className="bg-green-200 rounded-full p-4">
                <FiBriefcase className="text-2xl text-green-700" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-3">Verified medical professionals</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Appointments Today</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {dashboardData?.appointmentsToday || 0}
                </p>
              </div>
              <div className="bg-purple-200 rounded-full p-4">
                <FiCalendar className="text-2xl text-purple-700" />
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-3">Scheduled for today</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">System Health</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">98%</p>
              </div>
              <div className="bg-orange-200 rounded-full p-4">
                <FiActivity className="text-2xl text-orange-700" />
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-3">All systems operational</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <DashboardCard
            title="User Management"
            description={`${adminUsers.length} active users`}
            icon={<FiUsers className="text-3xl" />}
            to="/admin/users"
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200"
          />
          <DashboardCard
            title="Doctor Management"
            description={`${adminDoctors.length} verified doctors`}
            icon={<FiBriefcase className="text-3xl" />}
            to="/admin/doctors"
            className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200"
          />
          <DashboardCard
            title="Reports & Analytics"
            description="View system reports"
            icon={<FiBarChart2 className="text-3xl" />}
            to="/admin/reports"
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200"
          />
        </div>

        {/* Recent Activity Chart */}
        {dashboardData?.appointmentsPerWeek && dashboardData.appointmentsPerWeek.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FiTrendingUp className="text-2xl text-primary" />
              <h2 className="text-xl font-bold text-secondary">Appointments Trend (Last 7 Days)</h2>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {dashboardData.appointmentsPerWeek.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 rounded-lg p-3 mb-2">
                    <p className="text-2xl font-bold text-primary">{day.count}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
