import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiCalendar, FiFolder, FiVideo, FiTrendingUp, FiUser } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';

const links = [
  { to: '/appointments', label: 'Book Appointment', icon: <FiCalendar /> },
  { to: '/medicine-tracker', label: 'Medicine Tracker', icon: <FiBell /> },
  { to: '/records', label: 'Health Records', icon: <FiFolder /> },
  { to: '/video-consultation', label: 'Video Consultation', icon: <FiVideo /> },
  
  { to: '/profile', label: 'Profile', icon: <FiUser /> },
];

const PatientDashboard = () => {
  const { appointments, medicines, records } = useAppContext();

  const upcoming = useMemo(() => {
    return appointments
      .filter((apt) => new Date(`${apt.date} ${apt.time}`) > new Date())
      .slice(0, 3);
  }, [appointments]);

  const stats = useMemo(() => {
    const upcomingApts = appointments.filter((apt) => {
      const aptDate = new Date(`${apt.date} ${apt.time}`);
      return aptDate > new Date();
    }).length;

    return {
      appointments: upcomingApts,
      medicines: medicines.length,
      records: records.length,
    };
  }, [appointments, medicines, records]);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      
      {/* Sidebar */}
      <Sidebar title="Patient Center" links={links} />

      <div className="space-y-8 p-4">
        <BackButton />

        {/* ----- SMALL, SIMPLE STATS SECTION ----- */}
        <section>
          <h2 className="font-bold text-secondary mb-3">Overview</h2>
          <div className="grid gap-3 md:grid-cols-3">
            
            <div className="border rounded-lg p-4 bg-blue-50">
              <p className="text-sm text-blue-700 font-semibold">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-blue-900">{stats.appointments}</p>
            </div>

            <div className="border rounded-lg p-4 bg-green-50">
              <p className="text-sm text-green-700 font-semibold">Active Medicines</p>
              <p className="text-2xl font-bold text-green-900">{stats.medicines}</p>
            </div>

            <div className="border rounded-lg p-4 bg-purple-50">
              <p className="text-sm text-purple-700 font-semibold">Health Records</p>
              <p className="text-2xl font-bold text-purple-900">{stats.records}</p>
            </div>

          </div>
        </section>

        {/* ----- QUICK ACTION LINKS ----- */}
        <section>
          <h2 className="font-bold text-secondary mb-3">Quick Access</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="border rounded-lg p-4 flex gap-3 items-center hover:bg-secondary hover:text-white transition"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ----- UPCOMING APPOINTMENTS ----- */}
        {upcoming.length > 0 && (
          <section>
            <h2 className="font-bold text-secondary mb-3">Upcoming Appointments</h2>
            <ul className="space-y-2">
              {upcoming.map((apt) => (
                <li
                  key={apt._id || apt.id}
                  className="border rounded-lg p-3 bg-white"
                >
                  <p className="font-medium">
                    {apt.doctorId?.name || apt.doctor || 'Doctor'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {apt.date} at {apt.time}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    Status: {apt.status}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ----- RECENT ACTIVITY ----- */}
        <section>
          <h2 className="font-bold text-secondary mb-3">Recent Activity</h2>

          {records.length === 0 && appointments.length === 0 && medicines.length === 0 && (
            <p className="text-gray-500 text-sm">No recent activity.</p>
          )}

          <ul className="space-y-2">
            {records.length > 0 && (
              <li className="border rounded-lg p-3 bg-white text-sm">
                New Record: {records[records.length - 1]?.filename}
              </li>
            )}
            {appointments.length > 0 && (
              <li className="border rounded-lg p-3 bg-white text-sm">
                Appointment with {appointments[appointments.length - 1]?.doctorId?.name || 'Doctor'}
              </li>
            )}
            {medicines.length > 0 && (
              <li className="border rounded-lg p-3 bg-white text-sm">
                Medicine Added: {medicines[medicines.length - 1]?.name}
              </li>
            )}
          </ul>
        </section>

      </div>
    </div>
  );
};

export default PatientDashboard;
