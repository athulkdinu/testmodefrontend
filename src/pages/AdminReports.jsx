import { useState, useEffect } from 'react';
import { FiBarChart2, FiTrendingUp, FiUsers, FiBriefcase, FiCalendar, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import ChartComponent from '../components/ChartComponent';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';
import { getAnalyticsAPI } from '../services/allAPI';

const AdminReports = () => {
  const { user } = useAppContext();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user || !user.token) return;
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await getAnalyticsAPI(reqHeader);
      if (result.status === 200) {
        const data = await result.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="bg-white rounded-3xl p-12 shadow-lg text-center">
          <p className="text-red-500">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  const chartData = analytics.appointmentsPerDay || [];
  const statusData = analytics.appointmentsByStatus || {};

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <FiBarChart2 className="text-3xl" />
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-purple-100">System performance and insights</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-200 rounded-full p-3">
              <FiUsers className="text-xl text-blue-700" />
            </div>
            <span className="text-2xl font-bold text-blue-900">{analytics.doctorsCount || 0}</span>
          </div>
          <p className="text-sm font-medium text-blue-700">Total Doctors</p>
          <p className="text-xs text-blue-600 mt-1">Medical professionals</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-200 rounded-full p-3">
              <FiUsers className="text-xl text-green-700" />
            </div>
            <span className="text-2xl font-bold text-green-900">{analytics.patientsCount || 0}</span>
          </div>
          <p className="text-sm font-medium text-green-700">Total Patients</p>
          <p className="text-xs text-green-600 mt-1">Registered users</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-200 rounded-full p-3">
              <FiCalendar className="text-xl text-purple-700" />
            </div>
            <span className="text-2xl font-bold text-purple-900">{analytics.appointmentsPerDay?.reduce((sum, day) => sum + day.count, 0) || 0}</span>
          </div>
          <p className="text-sm font-medium text-purple-700">Appointments (7 Days)</p>
          <p className="text-xs text-purple-600 mt-1">Last week total</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-200 rounded-full p-3">
              <FiTrendingUp className="text-xl text-orange-700" />
            </div>
            <span className="text-2xl font-bold text-orange-900">{statusData.approved || 0}</span>
          </div>
          <p className="text-sm font-medium text-orange-700">Approved</p>
          <p className="text-xs text-orange-600 mt-1">Confirmed appointments</p>
        </div>
      </div>

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <FiTrendingUp className="text-2xl text-primary" />
            <div>
              <h2 className="text-xl font-bold text-secondary">Appointments Trend</h2>
              <p className="text-sm text-gray-500">Last 7 days performance</p>
            </div>
          </div>
          <ChartComponent
            title=""
            subtitle=""
            data={chartData}
            xKey="date"
            lines={[{ dataKey: 'count', color: '#6366F1' }]}
          />
        </div>
      )}

      {/* Status Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
            <FiClock className="text-primary" />
            Appointment Status Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Pending</span>
              </div>
              <span className="text-xl font-bold text-yellow-700">{statusData.pending || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Approved</span>
              </div>
              <span className="text-xl font-bold text-green-700">{statusData.approved || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Rejected</span>
              </div>
              <span className="text-xl font-bold text-red-700">{statusData.rejected || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Completed</span>
              </div>
              <span className="text-xl font-bold text-blue-700">{statusData.completed || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="font-medium text-gray-700">Cancelled</span>
              </div>
              <span className="text-xl font-bold text-gray-700">{statusData.cancelled || 0}</span>
            </div>
          </div>
        </div>

        {/* Top Doctors */}
        {analytics.topDoctors && analytics.topDoctors.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <FiBriefcase className="text-primary" />
              Top Performing Doctors
            </h3>
            <div className="space-y-3">
              {analytics.topDoctors.slice(0, 5).map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-secondary">{doctor.doctorName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{doctor.appointmentCount} appointments</p>
                    </div>
                  </div>
                  <FiCheckCircle className="text-green-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
