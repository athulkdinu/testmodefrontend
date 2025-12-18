import { FiCalendar, FiClipboard, FiFileText, FiLayers, FiVideo } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';

const links = [
  { to: '/doctor/appointments', label: 'Appointments', icon: <FiCalendar /> },
  { to: '/doctor/patients', label: 'Patient Records', icon: <FiClipboard /> },
  { to: '/doctor/notes', label: 'Diagnosis Notes', icon: <FiFileText /> },
  { to: '/doctor/schedule', label: 'Schedule', icon: <FiLayers /> },
  { to: '/doctor/video-consultation', label: 'Video Consultation', icon: <FiVideo /> },
];

const DoctorDashboard = () => {
  const { appointments, doctorNotes, user } = useAppContext();

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments
    .filter(apt => apt.date === today && apt.status !== 'cancelled')
    .slice(0, 3);
  const recentNotes = doctorNotes.slice(-2).reverse();

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar title="Doctor Console" links={links} />

      <div className="space-y-8">
        <BackButton />

        {/* Quick Actions */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <a
            href="/doctor/appointments"
            className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <FiCalendar className="text-xl text-blue-600" />
              <h3 className="font-semibold text-blue-800">Appointments</h3>
            </div>
            <p className="text-sm text-blue-700">View and manage today’s consultations</p>
          </a>

          <a
            href="/doctor/patients"
            className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <FiClipboard className="text-xl text-green-600" />
              <h3 className="font-semibold text-green-800">Patient Records</h3>
            </div>
            <p className="text-sm text-green-700">Check medical history & updates</p>
          </a>

          <a
            href="/doctor/notes"
            className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <FiFileText className="text-xl text-purple-600" />
              <h3 className="font-semibold text-purple-800">Diagnosis Notes</h3>
            </div>
            <p className="text-sm text-purple-700">Review or add diagnosis reports</p>
          </a>

          <a
            href="/doctor/schedule"
            className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <FiLayers className="text-xl text-orange-600" />
              <h3 className="font-semibold text-orange-800">Schedule</h3>
            </div>
            <p className="text-sm text-orange-700">Manage weekly schedule</p>
          </a>

          <a
            href="/doctor/video-consultation"
            className="p-5 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl border border-cyan-200 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <FiVideo className="text-xl text-cyan-600" />
              <h3 className="font-semibold text-cyan-800">Video Consultation</h3>
            </div>
            <p className="text-sm text-cyan-700">Start live video checkup</p>
          </a>
        </section>

        {/* Today’s Appointments */}
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-secondary mb-3">Today's Appointments</h3>

          {todaysAppointments.length > 0 ? (
            <ul className="space-y-3">
              {todaysAppointments.map((apt) => (
                <li key={apt._id || apt.id} className="p-4 rounded-xl bg-surface">
                  <p className="font-semibold text-secondary">
                    {apt.patientId?.name || 'Patient'} - {apt.reason || 'Consultation'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {apt.date} — {apt.time}
                  </p>
                  <p className="text-xs text-gray-400 capitalize mt-1">
                    Status: {apt.status} | Type: {apt.type || 'in-person'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No scheduled appointments today.</p>
          )}
        </section>

        {/* Recent Notes */}
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-secondary mb-3">Recent Diagnosis Notes</h3>

          {recentNotes.length > 0 ? (
            <ul className="space-y-3">
              {recentNotes.map((note) => (
                <li key={note._id || note.id} className="p-4 rounded-xl bg-surface">
                  <p className="font-semibold text-secondary">
                    {note.patientId?.name || 'Patient'}
                  </p>
                  {note.diagnosis && (
                    <p className="text-xs text-primary mt-1">Diagnosis: {note.diagnosis}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">{note.note}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(note.updatedAt || note.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No notes added yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
