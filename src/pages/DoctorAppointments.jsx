import { useState } from "react";
import BackButton from "../components/BackButton";
import { useAppContext } from "../context/AppContext";
import { approveAppointmentAPI, rejectAppointmentAPI } from "../services/allAPI";

const DoctorAppointments = () => {
  const { appointments, user } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [processing, setProcessing] = useState({});

  const handleApprove = async (appointmentId) => {
    if (!user || !user.token) return;
    setProcessing({ ...processing, [appointmentId]: 'approving' });
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await approveAppointmentAPI(appointmentId, reqHeader);
      if (result.status === 200) {
        // Context will refresh automatically
        window.location.reload(); // Quick refresh
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
    } finally {
      setProcessing({ ...processing, [appointmentId]: null });
    }
  };

  const handleReject = async (appointmentId) => {
    if (!user || !user.token) return;
    setProcessing({ ...processing, [appointmentId]: 'rejecting' });
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await rejectAppointmentAPI(appointmentId, reqHeader);
      if (result.status === 200) {
        window.location.reload(); // Quick refresh
      }
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    } finally {
      setProcessing({ ...processing, [appointmentId]: null });
    }
  };

  const filteredAppointments = appointments.filter(
    (apt) =>
      (apt.patientId?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.reason || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="rounded-3xl bg-white p-6 shadow-card">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-secondary mb-4">
          Doctor Appointments
        </h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:border-primary"
        />

        {/* Appointments List */}
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt._id}
                className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                <p className="text-secondary font-medium text-lg">
                  {apt.reason || "General Consultation"}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Patient:</span> {apt.patientId ? apt.patientId.name : "Unknown"}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span> {apt.date}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Time:</span> {apt.time}
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span>{" "}
                  {apt.type === "video" ? "Video" : "In-Person"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Status:</span> <span className="capitalize">{apt.status}</span>
                </p>
                
                {apt.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApprove(apt._id)}
                      disabled={processing[apt._id]}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                    >
                      {processing[apt._id] === 'approving' ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(apt._id)}
                      disabled={processing[apt._id]}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
                    >
                      {processing[apt._id] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No appointments found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
