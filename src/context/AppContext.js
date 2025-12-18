import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  loginAPI, registerAPI,
  getAppointmentsAPI, bookAppointmentAPI, updateAppointmentAPI, approveAppointmentAPI, rejectAppointmentAPI,
  getMedicinesAPI, addMedicineAPI, updateMedicineAPI, deleteMedicineAPI,
  getRecordsAPI, addRecordAPI, updateRecordAPI, deleteRecordAPI, downloadRecordAPI, getPatientRecordsAPI,
  getDoctorNotesAPI, addDoctorNoteAPI, updateDoctorNoteAPI, getPatientNotesAPI,
  getAllDoctorsAPI, addDoctorAPI, deleteDoctorAPI, updateDoctorAPI,
  getAllUsersAPI, addUserAPI, deleteUserAPI,
  getProfileAPI, updateProfileAPI, updateDoctorProfileAPI,
  getPatientDashboardAPI, getDoctorDashboardAPI, getAdminDashboardAPI,
  getHealthInsightsAPI, addHealthInsightAPI, getBMITrackerAPI, getBloodPressureAPI, getAppointmentStatsAPI,
  getNotificationsAPI, markNotificationReadAPI, markAllNotificationsReadAPI, deleteNotificationAPI,
  getAnalyticsAPI
} from '../services/allAPI';
import SERVERURL from '../services/serverURL';

// Centralized storage keys
const STORAGE_KEYS = {
  user: 'shms-user',
};

// Helper that safely parses JSON from localStorage.
const getStored = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Failed to parse localStorage key: ${key}`, error);
    return fallback;
  }
};

// Persist only user to localStorage
const persist = (key, data) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStored(STORAGE_KEYS.user, null));

  // Data States
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [records, setRecords] = useState([]);
  const [doctorNotes, setDoctorNotes] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminDoctors, setAdminDoctors] = useState([]);
  const [doctorDirectory, setDoctorDirectory] = useState([]); // Publicly viewable doctors

  // Persist user on change
  useEffect(() => {
    if (user) {
      persist(STORAGE_KEYS.user, user);
      fetchInitialData();
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
      // Clear data on logout
      setAppointments([]);
      setMedicines([]);
      setRecords([]);
      setDoctorNotes([]);
      setAdminUsers([]);
      setAdminDoctors([]);
    }
  }, [user]);

  // Fetch Public Data (Doctors) on mount
  useEffect(() => {
    fetchPublicDoctors();
  }, []);

  const getHeader = () => {
    return user && user.token ? { "Authorization": `Bearer ${user.token}` } : "";
  };

  const fetchPublicDoctors = async () => {
    try {
      const result = await getAllDoctorsAPI();
      if (result && result.status === 200) {
        const doctors = await result.json();
        setDoctorDirectory(Array.isArray(doctors) ? doctors : []);
      }
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  const fetchInitialData = async () => {
    if (!user) return;
    const reqHeader = getHeader();

    try {
      if (user.role === 'patient') {
        const aptResult = await getAppointmentsAPI(reqHeader);
        if (aptResult.status === 200) setAppointments(await aptResult.json());

        const medResult = await getMedicinesAPI(reqHeader);
        if (medResult.status === 200) setMedicines(await medResult.json());

        const recResult = await getRecordsAPI(reqHeader);
        if (recResult.status === 200) setRecords(await recResult.json());

        const noteResult = await getDoctorNotesAPI(reqHeader);
        if (noteResult.status === 200) setDoctorNotes(await noteResult.json());
      }
      else if (user.role === 'admin') {
        const userResult = await getAllUsersAPI(reqHeader);
        if (userResult && userResult.status === 200) {
          const users = await userResult.json();
          setAdminUsers(Array.isArray(users) ? users : []);
        }

        const docResult = await getAllDoctorsAPI(); // Public endpoint
        if (docResult && docResult.status === 200) {
          const doctors = await docResult.json();
          setAdminDoctors(Array.isArray(doctors) ? doctors : []);
        }

        // Fetch appointments for admin dashboard
        const aptResult = await getAppointmentsAPI(reqHeader);
        if (aptResult && aptResult.status === 200) {
          const appointments = await aptResult.json();
          setAppointments(Array.isArray(appointments) ? appointments : []);
        }
      }
      else if (user.role === 'doctor') {
        const aptResult = await getAppointmentsAPI(reqHeader); // Doctor appointments
        if (aptResult.status === 200) setAppointments(await aptResult.json());

        const noteResult = await getDoctorNotesAPI(reqHeader);
        if (noteResult.status === 200) setDoctorNotes(await noteResult.json());
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Auth Functions
  const login = async (formData) => {
    try {
      const result = await loginAPI(formData);
      if (result.status === 200) {
        const userData = await result.json();
        setUser(userData);
        return { success: true };
      } else {
        const err = await result.json();
        return { success: false, message: err.message || "Login failed" };
      }
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => setUser(null);

  const registerPatient = async (formData) => {
    try {
      const result = await registerAPI(formData);
      if (result.status === 201) {
        return { success: true };
      } else {
        // Parse error message if available
        let msg = "Registration failed";
        try {
          const data = await result.json();
          msg = data.message || msg;
        } catch (e) { }
        return { success: false, message: msg };
      }
    } catch (error) {
      console.error("Registration failed", error);
      return { success: false, message: "Network error. Check backend." };
    }
  };

  // Data Actions
  const addAppointment = async (data) => {
    const result = await bookAppointmentAPI(data, getHeader());
    if (result.status === 201) fetchInitialData(); // Refresh or append
  };

  const addMedicine = async (data) => {
    const result = await addMedicineAPI(data, getHeader());
    if (result.status === 201) fetchInitialData();
  };

  const removeMedicine = async (id) => {
    const reqHeader = getHeader();
    try {
      const result = await deleteMedicineAPI(id, reqHeader);
      if (result.status === 200) {
        fetchInitialData(); // Refresh medicines
      }
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  const addRecord = async (data, file) => {
    const reqHeader = getHeader();
    try {
      // If file is provided, use FormData for file upload
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', data.filename || file.name);
        formData.append('date', data.date || new Date().toISOString().split('T')[0]);
        formData.append('category', data.category || 'general');
        if (data.notes) formData.append('notes', data.notes);
        
        // Create custom config for file upload
        const response = await fetch(`${SERVERURL}/api/records`, {
          method: 'POST',
          headers: reqHeader ? { ...reqHeader } : {},
          body: formData
        });
        
        if (response.status === 201) {
          fetchInitialData();
          return { success: true };
        } else {
          const error = await response.json();
          return { success: false, message: error.message };
        }
      } else {
        // Regular JSON request
        const result = await addRecordAPI(data, reqHeader);
        if (result.status === 201) {
          fetchInitialData();
          return { success: true };
        }
      }
    } catch (error) {
      console.error("Error adding record:", error);
      return { success: false, message: "Network error" };
    }
  };

  const addDoctorNote = async (data) => {
    const result = await addDoctorNoteAPI(data, getHeader());
    if (result.status === 201) fetchInitialData();
  };

  const addAdminUser = async (data) => {
    try {
      const result = await addUserAPI(data, getHeader());
      if (result && result.status === 201) {
        await fetchInitialData();
        return { success: true };
      } else {
        const error = await result.json();
        return { success: false, message: error.message || 'Failed to add user' };
      }
    } catch (error) {
      console.error("Error adding user:", error);
      return { success: false, message: 'Network error' };
    }
  };

  const deleteAdminUser = async (id) => {
    try {
      const result = await deleteUserAPI(id, getHeader());
      if (result && result.status === 200) {
        await fetchInitialData();
        return { success: true };
      } else {
        const error = await result.json();
        return { success: false, message: error.message || 'Failed to delete user' };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, message: 'Network error' };
    }
  };

  const addAdminDoctor = async (data) => {
    try {
      const result = await addDoctorAPI(data, getHeader());
      if (result.status === 201) {
        fetchInitialData();
        fetchPublicDoctors();
        return { success: true };
      } else {
        let msg = "Failed to add doctor";
        try { msg = (await result.json()).message; } catch (e) { }
        return { success: false, message: msg };
      }
    } catch (error) {
      console.error("Error adding doctor", error);
      return { success: false, message: "Network error" };
    }
  };

  const deleteAdminDoctor = async (id) => {
    try {
      const result = await deleteDoctorAPI(id, getHeader());
      if (result && result.status === 200) {
        await fetchInitialData();
        await fetchPublicDoctors();
        return { success: true };
      } else {
        const error = await result.json();
        return { success: false, message: error.message || 'Failed to delete doctor' };
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return { success: false, message: 'Network error' };
    }
  };

  // Profile data - will be fetched when needed
  const patientProfile = user ? {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    dateOfBirth: user.dateOfBirth || '',
    gender: user.gender || '',
    contact: user.contact || ''
  } : null;

  const doctorSchedule = []; // Need backend logic
  const insightsData = []; // Need backend analytics
  const adminReportSeries = [];
  const patientRecords = []; // Doctor view of patient records not implemented in my backend strictly yet

  const value = {
    user,
    login,
    logout,
    registerPatient,
    patientProfile,
    appointments,
    addAppointment,
    medicines,
    addMedicine,
    removeMedicine,
    records,
    addRecord,
    doctorNotes,
    addDoctorNote,
    doctorDirectory, // This is the list of doctors for patients to see
    patientRecords,
    doctorSchedule,
    insightsData,
    adminReportSeries,
    adminUsers,
    addAdminUser,
    deleteAdminUser,
    adminDoctors,
    addAdminDoctor,
    deleteAdminDoctor,
  };

  return React.createElement(AppContext.Provider, { value }, children);
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
