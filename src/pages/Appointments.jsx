import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import { useAppContext } from "../context/AppContext";
import { getAllDoctorsAPI, getAppointmentsAPI, bookAppointmentAPI } from "../services/allAPI";

const Appointments = () => {
  const { user } = useAppContext();
  const [doctorDirectory, setDoctorDirectory] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    reason: "",
    type: "in-person",
  });

  const [message, setMessage] = useState("");

  // Fetch Doctors and Appointments on load
  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      // getAllDoctorsAPI is a public endpoint, no auth needed
      const result = await getAllDoctorsAPI();
      if (result && result.status === 200) {
        const doctors = await result.json();
        if (Array.isArray(doctors)) {
          setDoctorDirectory(doctors);
          // Set default doctor if list not empty
          if (doctors.length > 0 && !formData.doctor) {
            setFormData(prev => ({ ...prev, doctor: doctors[0].id })) // Store ID!
          }
        }
      } else {
        console.error("Failed to fetch doctors:", result);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchAppointments = async () => {
    if (!user || !user.token) return;
    const reqHeader = {
      "Authorization": `Bearer ${user.token}`
    };
    try {
      const result = await getAppointmentsAPI(reqHeader);
      if (result.status === 200) {
        const appointments = await result.json();
        setAppointments(appointments);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      setMessage("Please login first");
      return;
    }

    const reqHeader = {
      "Authorization": `Bearer ${user.token}`
    };

    // Prepare data. userController/appointmentController expects 'doctorId'
    // formData.doctor should be the ID from the select value.
    const reqBody = {
      doctorId: formData.doctor,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      type: formData.type
    }

    try {
      const result = await bookAppointmentAPI(reqBody, reqHeader);
      if (result.status === 201) {
        setMessage("Appointment saved successfully!");
        fetchAppointments(); // Refresh list
        setFormData({
          doctor: doctorDirectory[0]?.id || "",
          date: "",
          time: "",
          reason: "",
          type: "in-person",
        });
      } else {
        console.log(result);
        setMessage(result.response?.data?.message || "Failed to book");
      }
    } catch (err) {
      console.error("Booking Error:", err);
      setMessage("Error booking appointment");
    }

    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Book Appointment */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-secondary">
            Book an Appointment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {/* Select Doctor */}
            <div>
              <label className="text-sm text-gray-600 font-medium">Doctor</label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2"
              >
                {/* Fallback if no doctors */}
                {doctorDirectory.length === 0 && <option>Loading...</option>}

                {doctorDirectory.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} – {doc.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Date + Time */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-gray-600 font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  value={formData.date}
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Time</label>
                <input
                  type="time"
                  name="time"
                  onChange={handleChange}
                  value={formData.time}
                  className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2"
                  required
                />
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Appointment Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2"
              >
                <option value="in-person">In-Person</option>
                <option value="video">Video Consultation</option>
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Reason for Visit
              </label>
              <textarea
                name="reason"
                rows={3}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe your issue..."
                className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-3 rounded-full hover:bg-secondary"
            >
              Save Appointment
            </button>
          </form>

          {message && (
            <p className="mt-4 bg-accent/40 text-secondary px-4 py-2 rounded-xl text-sm">
              {message}
            </p>
          )}
        </div>

        {/* Appointment List */}
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-secondary mb-4">
            My Appointments
          </h2>

          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt._id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <p className="text-secondary font-medium text-lg">
                    {apt.doctorId ? apt.doctorId.name : "Doctor"} {/* Handled populated field */}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {apt.date} | Time: {apt.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    Type: {apt.type === "video" ? "Video" : "In-Person"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <span className="capitalize">{apt.status}</span>
                  </p>
                  {apt.reason && (
                    <p className="text-xs text-gray-500 mt-2">{apt.reason}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">
              No appointments booked yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
