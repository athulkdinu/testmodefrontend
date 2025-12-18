import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import BackButton from "../components/BackButton";
import { getDoctorPatientsAPI } from "../services/allAPI";

const DoctorNotes = () => {
  const { doctorNotes, addDoctorNote, user } = useAppContext();
  const [patients, setPatients] = useState([]);

  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    note: "",
    prescription: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    if (!user || !user.token) return;
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await getDoctorPatientsAPI(reqHeader);
      if (result.status === 200) {
        const patientsList = await result.json();
        setPatients(patientsList);
        if (patientsList.length > 0) {
          setFormData(prev => ({ ...prev, patientId: patientsList[0]._id || patientsList[0].id }));
        }
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.note) {
      alert("Please select a patient and enter notes");
      return;
    }
    await addDoctorNote(formData);
    setFormData(prev => ({ ...prev, diagnosis: "", note: "", prescription: "" }));
  };

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---- Form ---- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow"
        >
          <h2 className="text-xl font-semibold text-secondary">
            Add Doctor Notes
          </h2>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-600">Patient</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="w-full mt-2 border px-3 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Diagnosis</label>
              <input
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Enter diagnosis"
                className="w-full mt-2 border px-3 py-2 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Clinical Notes</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={4}
                placeholder="Enter notes..."
                className="w-full mt-2 border px-3 py-2 rounded-lg focus:outline-none focus:border-primary"
                required
              ></textarea>
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Prescription (Optional)
              </label>
              <textarea
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
                rows={2}
                placeholder="Prescribed medications..."
                className="w-full mt-2 border px-3 py-2 rounded-lg focus:outline-none focus:border-primary"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-primary text-white py-2 rounded-full font-medium hover:bg-secondary"
          >
            Save Note
          </button>
        </form>

        {/* ---- Notes List ---- */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-secondary mb-4">
            Saved Notes
          </h2>

          {doctorNotes.length > 0 ? (
            <ul className="space-y-4 text-sm">
              {doctorNotes.map((note) => {
                const noteId = note._id || note.id;
                return (
                  <li
                    key={noteId}
                    className="border rounded-lg p-4"
                  >
                    <p className="font-semibold text-secondary">
                      {note.patientId?.name || 'Patient'}
                    </p>

                    {note.diagnosis && (
                      <p className="text-xs text-primary mt-1">
                        Diagnosis: {note.diagnosis}
                      </p>
                    )}

                    <p className="text-gray-600 mt-2">{note.note}</p>

                    {note.prescription && (
                      <p className="text-xs text-blue-700 mt-2">
                        Prescription: {note.prescription}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(note.updatedAt || note.createdAt || Date.now()).toLocaleString()}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-6">
              No notes available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorNotes;
