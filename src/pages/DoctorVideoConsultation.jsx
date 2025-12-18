import { useState, useEffect, useMemo } from 'react';
import { FiPhoneIncoming, FiVideo, FiWifi, FiMonitor } from 'react-icons/fi';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';
import { getDoctorPatientsAPI } from '../services/allAPI';

const DoctorVideoConsultation = () => {
  const { appointments, user } = useAppContext();
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [callInterval, setCallInterval] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const fetchPatients = async () => {
    if (!user || !user.token) return;
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await getDoctorPatientsAPI(reqHeader);
      if (result.status === 200) {
        const patientList = await result.json();
        setPatients(patientList);
        if (patientList.length > 0 && !selectedPatientId) {
          setSelectedPatientId(patientList[0]._id || patientList[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const patient = useMemo(
    () => patients.find((p) => (p._id || p.id) === selectedPatientId),
    [patients, selectedPatientId]
  );

  const upcomingAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter(apt => apt.date >= today && apt.status === 'approved')
      .slice(0, 5);
  }, [appointments]);

  const handleStartCall = () => {
    if (!selectedPatientId) return;
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('in-call');
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      setCallInterval(interval);
    }, 1000);
  };

  const handleEndCall = () => {
    if (callInterval) {
      clearInterval(callInterval);
      setCallInterval(null);
    }
    setConnectionStatus('ended');
    setTimeout(() => {
      setConnectionStatus('idle');
      setCallDuration(0);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* ====== Video Section ====== */}
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-secondary">
            {patient?.name || 'Select Patient'}
          </h2>
          <p className="text-sm text-gray-500">
            {patient?.email || 'Patient Information'}
          </p>
          {patient?.phone && (
            <p className="text-sm text-gray-500">Phone: {patient.phone}</p>
          )}

          <div className="mt-6 h-64 rounded-3xl bg-slate-200 p-6 flex items-center justify-center text-center">
            {connectionStatus === 'in-call' ? (
              <div>
                <FiMonitor className="text-5xl text-secondary mx-auto" />
                <p className="mt-2 font-semibold">In Call</p>
                <p className="text-sm text-gray-600">Time: {formatTime(callDuration)}</p>
              </div>
            ) : connectionStatus === 'connecting' ? (
              <div>
                <FiWifi className="text-5xl text-secondary animate-pulse mx-auto" />
                <p className="mt-2 font-semibold">Connecting...</p>
              </div>
            ) : (
              <div>
                <FiVideo className="text-5xl text-secondary mx-auto" />
                <p className="mt-2 font-semibold">Ready to Start Call</p>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                if (!selectedPatientId) return;
                const selectedPatient = patients.find(p => (p._id || p.id) === selectedPatientId);
                if (!selectedPatient) return;
                
                // Create the same channel name format as patient side
                // Format: patient-{patientId}-doctor-{doctorId}
                const patientId = selectedPatient._id || selectedPatient.id;
                const doctorId = user?.id || user?._id || 'doctor';
                const channelName = `patient-${patientId}-doctor-${doctorId}`;
                
                // Navigate to video call with channel and participant name
                window.location.href = `/video-call?channel=${channelName}&name=${selectedPatient.name || 'Patient'}`;
              }}
              disabled={!selectedPatientId}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-secondary disabled:opacity-60"
            >
              <FiPhoneIncoming /> Start Video Call
            </button>

            <button
              type="button"
              onClick={handleEndCall}
              disabled={connectionStatus !== 'in-call'}
              className="rounded-full border border-red-300 px-6 py-3 font-semibold text-red-500 hover:bg-red-50 disabled:opacity-60"
            >
              End Call
            </button>
          </div>
        </div>

        {/* ====== Sidebar ====== */}
        <aside className="space-y-6">
          {/* Patient Picker */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h3 className="text-xl font-semibold text-secondary">Select Patient</h3>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-primary"
            >
              <option value="">-- Select --</option>
              {patients.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>

            {patient && (
              <div className="mt-4 rounded-2xl bg-surface p-4 text-sm text-gray-600">
                <p><strong>Email:</strong> {patient.email}</p>
                {patient.phone && <p><strong>Phone:</strong> {patient.phone}</p>}
                {patient.address && <p><strong>Address:</strong> {patient.address}</p>}
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h3 className="text-xl font-semibold text-secondary">Upcoming Appointments</h3>
            {upcomingAppointments.length > 0 ? (
              <div className="mt-3 space-y-2">
                {upcomingAppointments.map((apt) => (
                  <div key={apt._id || apt.id} className="text-sm border-b pb-2">
                    <p className="font-medium">{apt.patientId?.name || 'Patient'}</p>
                    <p className="text-gray-600">{apt.date} at {apt.time}</p>
                    <p className="text-xs text-gray-500">{apt.reason || 'Consultation'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No upcoming appointments
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DoctorVideoConsultation;
