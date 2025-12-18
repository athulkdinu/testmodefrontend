export const doctorDirectory = [
  { id: 'doc-1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', experience: 12, nextSlot: '2025-11-22 10:30' },
  { id: 'doc-2', name: 'Dr. Michael Thompson', specialty: 'Neurology', experience: 9, nextSlot: '2025-11-22 14:00' },
  { id: 'doc-3', name: 'Dr. Emily Davis', specialty: 'Dermatology', experience: 7, nextSlot: '2025-11-23 09:15' },
  { id: 'doc-4', name: 'Dr. James Wilson', specialty: 'Orthopedics', experience: 11, nextSlot: '2025-11-23 16:45' },
  { id: 'doc-5', name: 'Dr. Maria Rodriguez', specialty: 'Pediatrics', experience: 8, nextSlot: '2025-11-24 11:00' },
  { id: 'doc-6', name: 'Dr. David Brown', specialty: 'Internal Medicine', experience: 15, nextSlot: '2025-11-24 15:30' },
];

export const defaultAppointments = [
  { id: 'apt-1', doctor: 'Dr. Sarah Johnson', date: '2025-11-25', time: '09:00', reason: 'Routine check-up', type: 'in-person', status: 'scheduled' },
  { id: 'apt-2', doctor: 'Dr. Michael Thompson', date: '2025-11-26', time: '14:30', reason: 'Follow-up consultation', type: 'video', status: 'scheduled' },
  { id: 'apt-3', doctor: 'Dr. Emily Davis', date: '2025-11-27', time: '10:15', reason: 'Skin examination', type: 'in-person', status: 'scheduled' },
];

export const defaultMedicines = [
  { id: 'med-1', name: 'Atorvastatin', dosage: '10mg', time: '08:00 AM', frequency: 'daily', notes: 'Take with breakfast' },
  { id: 'med-2', name: 'Metformin', dosage: '500mg', time: '12:00 PM', frequency: 'twice-daily', notes: 'After lunch' },
  { id: 'med-3', name: 'Lisinopril', dosage: '5mg', time: '08:00 PM', frequency: 'daily', notes: 'Before bedtime' },
];

export const defaultRecords = [
  { id: 'rec-1', filename: 'Blood Test Results - November 2025.pdf', date: '2025-11-15', category: 'lab-report', size: '2.4 MB' },
  { id: 'rec-2', filename: 'Chest X-Ray Report.pdf', date: '2025-11-10', category: 'imaging', size: '1.8 MB' },
  { id: 'rec-3', filename: 'Prescription - Dr. Sarah Johnson.pdf', date: '2025-11-05', category: 'prescription', size: '0.5 MB' },
];

export const defaultDoctorNotes = [
  { id: 'note-1', patient: 'aza', note: 'Continue medication, review in 4 weeks. Patient showing good progress.', updated: '2025-11-18', diagnosis: 'Hypertension', prescription: 'Atorvastatin 10mg daily' },
  { id: 'note-2', patient: 'sreelakshmi', note: 'Blood pressure stable. Recommend lifestyle changes and follow-up in 2 weeks.', updated: '2025-11-20', diagnosis: 'Pre-hypertension', prescription: 'Lisinopril 5mg daily' },
  { id: 'note-3', patient: 'Karthik', note: 'Blood sugar levels improving. Continue current treatment plan.', updated: '2025-11-19', diagnosis: 'Type 2 Diabetes', prescription: 'Metformin 500mg twice daily' },
];

export const patientRecords = [
  { id: 'pr-1', name: 'aza', condition: 'Hypertension', lastVisit: '2025-10-30', notes: 'Stable vitals, monitor BP. Patient responding well to medication.' },
  { id: 'pr-2', name: 'sreelakshmi', condition: 'Diabetes', lastVisit: '2025-11-05', notes: 'Blood sugar levels improving. Continue current treatment plan.' },
  { id: 'pr-3', name: 'Karthik ', condition: 'Asthma', lastVisit: '2025-11-10', notes: 'Lung function tests normal. Maintain inhaler usage as prescribed.' },
  { id: 'pr-4', name: 'Nandhana', condition: 'Arthritis', lastVisit: '2025-11-12', notes: 'Joint pain reduced. Physical therapy recommended.' },
  { id: 'pr-5', name: 'Adharsh', condition: 'Migraine', lastVisit: '2025-11-15', notes: 'Headache frequency decreased. Continue preventive medication.' },
];

export const doctorSchedule = [
  { id: 'sch-1', day: 'Monday', slots: ['09:00 AM - aza', '11:00 AM - sreelakshmi', '02:00 PM - Follow-up Consultation'] },
  { id: 'sch-2', day: 'Tuesday', slots: ['10:00 AM - Karthik', '01:30 PM - Nandhana White', '03:00 PM - New Patient'] },
  { id: 'sch-3', day: 'Wednesday', slots: ['09:30 AM - Review Scans', '11:00 AM - Adharsh', '02:30 PM - Surgery Prep'] },
  { id: 'sch-4', day: 'Thursday', slots: ['10:00 AM - Follow-up', '12:00 PM - Consultation', '03:00 PM - Patient Review'] },
  { id: 'sch-5', day: 'Friday', slots: ['08:30 AM - Ward Round', '11:00 AM - Research Sync', '02:00 PM - Team Meeting'] },
];

export const adminUsers = [
  { id: 'usr-1', name: 'aza', role: 'Patient', email: 'aza@email.com' },
  { id: 'usr-2', name: 'sreelakshmi', role: 'Patient', email: 'sreelakshmi@email.com' },
  { id: 'usr-3', name: 'Karthik', role: 'Patient', email: 'Karthik@email.com' },
  { id: 'usr-4', name: 'Nandhana White', role: 'Patient', email: 'Nandhana@email.com' },
  { id: 'usr-5', name: 'Adharsh', role: 'Patient', email: 'amanda.garcia@email.com' },
  { id: 'usr-6', name: 'Matthew Harris', role: 'Patient', email: 'matthew.harris@email.com' },
  { id: 'usr-7', name: 'Jessica Clark', role: 'Patient', email: 'jessica.clark@email.com' },
];

export const adminDoctors = [
  { id: 'adm-doc-1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
  { id: 'adm-doc-2', name: 'Dr. Michael Thompson', specialty: 'Neurology' },
  { id: 'adm-doc-3', name: 'Dr. Emily Davis', specialty: 'Dermatology' },
  { id: 'adm-doc-4', name: 'Dr. James Wilson', specialty: 'Orthopedics' },
  { id: 'adm-doc-5', name: 'Dr. Maria Rodriguez', specialty: 'Pediatrics' },
  { id: 'adm-doc-6', name: 'Dr. David Brown', specialty: 'Internal Medicine' },
];

export const insightsData = [
  { month: 'Jan', bp: 120, glucose: 90 },
  { month: 'Mar', bp: 118, glucose: 95 },
  { month: 'May', bp: 122, glucose: 92 },
  { month: 'Jul', bp: 116, glucose: 88 },
  { month: 'Sep', bp: 119, glucose: 91 },
  { month: 'Nov', bp: 117, glucose: 89 },
];

export const adminReportSeries = [
  { name: 'Appointments', value: 320 },
  { name: 'Active Patients', value: 210 },
  { name: 'Prescriptions', value: 145 },
  { name: 'Diagnostics', value: 98 },
];

