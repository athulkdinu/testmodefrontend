import { useState, useMemo, useRef, useEffect } from "react";
import { FiPhoneIncoming, FiVideo, FiWifi, FiMic, FiMonitor } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useAppContext } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";

const VideoConsultation = () => {
  // default to empty arrays in case context doesn't provide values yet
  const { doctorDirectory = [], medicines = [], records = [], user } = useAppContext();
  const { initiateCall } = useSocket();
  const navigate = useNavigate();

  const [selectedDoctor, setSelectedDoctor] = useState(doctorDirectory[0]?.id || "");
  const [meetingReason, setMeetingReason] = useState("Routine follow-up");
  const [connectionStatus, setConnectionStatus] = useState("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const intervalRef = useRef(null);

  const doctor = useMemo(
    () => doctorDirectory.find((d) => d.id === selectedDoctor),
    [selectedDoctor, doctorDirectory]
  );

  // cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleJoin = () => {
    if (!selectedDoctor) return; // guard: nothing selected
    setConnectionStatus("connecting");

    setTimeout(() => {
      setConnectionStatus("in-call");

      // start timer and store ref so we can clear later
      intervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }, 1200);
  };

  const handleEnd = () => {
    setConnectionStatus("ended");
    setCallDuration(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* MAIN VIDEO AREA */}
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-secondary">
            {doctor?.name || "Select a doctor"}
          </h2>
          <p className="text-sm text-gray-500">{doctor?.specialty || ""}</p>

          {/* VIDEO BOX */}
          <div className="mt-6 h-64 rounded-3xl bg-slate-200 flex items-center justify-center text-center p-4">
            {connectionStatus === "in-call" ? (
              <div>
                <FiMonitor className="text-5xl text-secondary mx-auto" />
                <p className="mt-2 font-semibold">Connected</p>
                <p className="text-sm text-gray-600">Duration: {formatTime(callDuration)}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Mic: {micMuted ? "Off" : "On"} · Cam: {videoOff ? "Off" : "On"}
                </p>
              </div>
            ) : connectionStatus === "connecting" ? (
              <div>
                <FiWifi className="text-5xl text-secondary animate-pulse mx-auto" />
                <p className="mt-2">Connecting...</p>
              </div>
            ) : (
              <div>
                <FiVideo className="text-5xl text-secondary mx-auto" />
                <p className="mt-2 font-semibold">Ready to join?</p>
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {connectionStatus === "in-call" ? (
              <>
                <button
                  type="button"
                  onClick={() => setMicMuted((v) => !v)}
                  className="rounded-xl bg-gray-100 py-3 font-medium hover:bg-gray-200"
                >
                  <FiMic className="inline-block mr-2" />
                  {micMuted ? "Unmute" : "Mute"}
                </button>

                <button
                  type="button"
                  onClick={() => setVideoOff((v) => !v)}
                  className="rounded-xl bg-gray-100 py-3 font-medium hover:bg-gray-200"
                >
                  <FiVideo className="inline-block mr-2" />
                  {videoOff ? "Turn Camera On" : "Turn Camera Off"}
                </button>

                <button
                  type="button"
                  onClick={handleEnd}
                  className="col-span-2 rounded-xl bg-red-100 py-3 font-medium text-red-600 hover:bg-red-200"
                >
                  <FiPhoneIncoming className="inline-block mr-2" /> End Call
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedDoctor) return;
                    const doctor = doctorDirectory.find(d => d.id === selectedDoctor);
                    if (!doctor) return;
                    
                    // Create a unique channel name for this patient-doctor pair
                    // Format: patient-{patientId}-doctor-{doctorId}
                    // IMPORTANT: Use String() to ensure consistent formatting
                    const patientId = String(user?.id || user?._id || 'patient');
                    const doctorUserId = String(doctor.userId || doctor.id);
                    const channelName = `patient-${patientId}-doctor-${doctorUserId}`;
                    
                    console.log('Patient initiating call:');
                    console.log('  Patient ID:', patientId);
                    console.log('  Doctor User ID:', doctorUserId);
                    console.log('  Channel Name:', channelName);
                    
                    // Send call notification to doctor via Socket.IO
                    if (doctorUserId && initiateCall) {
                      initiateCall(
                        doctorUserId,
                        channelName,
                        user?.name || 'Patient',
                        'patient-to-doctor'
                      );
                    }
                    
                    // Navigate to video call with channel and participant name
                    navigate(`/video-call?channel=${channelName}&name=${doctor.name || 'Doctor'}`);
                  }}
                  disabled={!selectedDoctor}
                  className="rounded-full bg-primary py-3 font-semibold text-white hover:bg-secondary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FiPhoneIncoming className="inline-block mr-2" />
                  Start Video Call
                </button>

                <button
                  type="button"
                  className="rounded-full border py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </button>
              </>
            )}
          </div>
        </section>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {/* DOCTOR & REASON */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h3 className="text-lg font-semibold text-secondary">Visit Details</h3>

            <label className="block text-sm mt-4">Doctor</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="mt-2 w-full border rounded-xl px-4 py-3 focus:border-primary"
            >
              <option value="">-- Select Doctor --</option>
              {Array.isArray(doctorDirectory) &&
                doctorDirectory.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} · {d.specialty}
                  </option>
                ))}
            </select>

            <label className="block text-sm mt-4">Reason</label>
            <textarea
              rows={3}
              value={meetingReason}
              onChange={(e) => setMeetingReason(e.target.value)}
              className="mt-2 w-full border rounded-xl px-4 py-3 focus:border-primary"
            />

            <p className="text-sm mt-4 bg-surface rounded-xl px-4 py-2 text-secondary">
              Next Available: <strong>{doctor?.nextSlot || "—"}</strong>
            </p>
          </div>

          {/* QUICK ACCESS */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h3 className="text-lg font-semibold text-secondary mb-3">Quick Access</h3>

            <div className="text-sm space-y-3">
              <div>
                <p className="font-medium">Medicines</p>
                <p className="text-xs text-gray-600">{medicines.length} tracked</p>
                <Link to="/medicine-tracker" className="text-primary text-xs hover:underline">
                  View →
                </Link>
              </div>

              <div>
                <p className="font-medium">Health Records</p>
                <p className="text-xs text-gray-600">{records.length} available</p>
                <Link to="/records" className="text-primary text-xs hover:underline">
                  View →
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VideoConsultation;
