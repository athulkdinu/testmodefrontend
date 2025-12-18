import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';
import { getDoctorPatientsAPI, getPatientRecordsAPI, getPatientNotesAPI } from '../services/allAPI';

const PatientRecords = () => {
  const { user } = useAppContext();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientNotes, setPatientNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, [user]);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientData(selectedPatient);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    if (!user || !user.token) return;
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await getDoctorPatientsAPI(reqHeader);
      if (result.status === 200) {
        const patientList = await result.json();
        setPatients(patientList);
        if (patientList.length > 0 && !selectedPatient) {
          setSelectedPatient(patientList[0]._id || patientList[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientData = async (patientId) => {
    if (!user || !user.token) return;
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      
      // Fetch patient records
      const recordsResult = await getPatientRecordsAPI(patientId, reqHeader);
      if (recordsResult.status === 200) {
        const records = await recordsResult.json();
        setPatientRecords(records);
      }

      // Fetch patient notes
      const notesResult = await getPatientNotesAPI(patientId, reqHeader);
      if (notesResult.status === 200) {
        const notes = await notesResult.json();
        setPatientNotes(notes);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const currentPatient = patients.find(p => (p._id || p.id) === selectedPatient);

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h2 className="text-2xl font-semibold text-secondary">Patient Medical Records</h2>
        
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading patients...</p>
        ) : (
          <>
            {/* Patient Selector */}
            <div className="mt-4">
              <label className="text-sm text-gray-600 mb-2 block">Select Patient</label>
              <select
                value={selectedPatient || ''}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Patient --</option>
                {patients.map((patient) => (
                  <option key={patient._id || patient.id} value={patient._id || patient.id}>
                    {patient.name} ({patient.email})
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && currentPatient && (
              <div className="mt-6 space-y-6">
                {/* Patient Info */}
                <div className="bg-surface rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-secondary">{currentPatient.name}</h3>
                  <p className="text-sm text-gray-600">{currentPatient.email}</p>
                  {currentPatient.phone && (
                    <p className="text-sm text-gray-600">Phone: {currentPatient.phone}</p>
                  )}
                </div>

                {/* Health Records */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-3">Health Records ({patientRecords.length})</h3>
                  {patientRecords.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {patientRecords.map((record) => (
                        <div
                          key={record._id || record.id}
                          className="rounded-xl border border-gray-200 p-4 bg-white"
                        >
                          <p className="font-semibold text-secondary">{record.filename}</p>
                          <p className="text-sm text-gray-600 capitalize">{record.category}</p>
                          <p className="text-xs text-gray-400 mt-1">{record.date}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No health records found</p>
                  )}
                </div>

                {/* Diagnosis Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-3">Diagnosis Notes ({patientNotes.length})</h3>
                  {patientNotes.length > 0 ? (
                    <div className="space-y-3">
                      {patientNotes.map((note) => (
                        <div
                          key={note._id || note.id}
                          className="rounded-xl border border-gray-200 p-4 bg-white"
                        >
                          {note.diagnosis && (
                            <p className="text-sm font-semibold text-primary mb-1">
                              Diagnosis: {note.diagnosis}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">{note.note}</p>
                          {note.prescription && (
                            <p className="text-xs text-blue-700 mt-2">
                              Prescription: {note.prescription}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(note.createdAt || note.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No diagnosis notes found</p>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <Link
                    to="/doctor/notes"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary text-sm"
                  >
                    Add Diagnosis Note
                  </Link>
                </div>
              </div>
            )}

            {!selectedPatient && patients.length === 0 && (
              <p className="col-span-full text-center py-10 text-gray-500">
                No patients found
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientRecords;
