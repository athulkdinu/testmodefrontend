import { commonAPI } from "./commonAPI";
import SERVERURL from "./serverURL";

// Register
export const registerAPI = async (user) => {
    return await commonAPI("POST", `${SERVERURL}/api/auth/register`, user, "");
}

// Login
export const loginAPI = async (user) => {
    return await commonAPI("POST", `${SERVERURL}/api/auth/login`, user, "");
}

// Admin: Get All Users
export const getAllUsersAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/admin/users`, "", reqHeader);
}

// Admin: Add User
export const addUserAPI = async (user, reqHeader) => {
    return await commonAPI("POST", `${SERVERURL}/api/admin/users`, user, reqHeader);
}

// Admin: Delete User
export const deleteUserAPI = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${SERVERURL}/api/admin/users/${id}`, {}, reqHeader);
}

// Admin/Public: Get All Doctors
export const getAllDoctorsAPI = async () => {
    // Public? If protected, add header arg
    return await commonAPI("GET", `${SERVERURL}/api/doctors`, "", "");
}

// Admin: Add Doctor
export const addDoctorAPI = async (doctor, reqHeader) => {
    return await commonAPI("POST", `${SERVERURL}/api/doctors`, doctor, reqHeader);
}

// Admin: Delete Doctor
export const deleteDoctorAPI = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${SERVERURL}/api/doctors/${id}`, {}, reqHeader);
}

// Appointments: Get
export const getAppointmentsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/appointments`, "", reqHeader);
}

// Appointments: Book
export const bookAppointmentAPI = async (appointment, reqHeader) => {
    return await commonAPI("POST", `${SERVERURL}/api/appointments`, appointment, reqHeader);
}

// Appointments: Update/Cancel
export const updateAppointmentAPI = async (id, data, reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/appointments/${id}`, data, reqHeader);
}

// Medicines: Get
export const getMedicinesAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/medicines`, "", reqHeader);
}

// Medicines: Add
export const addMedicineAPI = async (medicine, reqHeader) => {
    return await commonAPI("POST", `${SERVERURL}/api/medicines`, medicine, reqHeader);
}

// Records: Get
export const getRecordsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/records`, "", reqHeader);
}

// Records: Add
export const addRecordAPI = async (record, reqHeader) => {
    return await commonAPI("POST", `${SERVERURL}/api/records`, record, reqHeader);
}

// Doctor Notes: Get
export const getDoctorNotesAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/doctor_notes`, "", reqHeader);
}

// Doctor Notes: Add
export const addDoctorNoteAPI = async (note, reqHeader) => {
    return await commonAPI("POST", `${SERVERURL}/api/doctor_notes`, note, reqHeader);
}

// Medicines: Update
export const updateMedicineAPI = async (id, medicine, reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/medicines/${id}`, medicine, reqHeader);
}

// Medicines: Delete
export const deleteMedicineAPI = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${SERVERURL}/api/medicines/${id}`, {}, reqHeader);
}

// Records: Update
export const updateRecordAPI = async (id, record, reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/records/${id}`, record, reqHeader);
}

// Records: Delete
export const deleteRecordAPI = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${SERVERURL}/api/records/${id}`, {}, reqHeader);
}

// Records: Download
export const downloadRecordAPI = async (id, reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/records/${id}/download`, "", reqHeader);
}

// Appointments: Approve
export const approveAppointmentAPI = async (id, reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/appointments/${id}/approve`, {}, reqHeader);
}

// Appointments: Reject
export const rejectAppointmentAPI = async (id, reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/appointments/${id}/reject`, {}, reqHeader);
}

// Profile: Get
export const getProfileAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/profile`, "", reqHeader);
}

// Profile: Update
export const updateProfileAPI = async (profile, reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/profile`, profile, reqHeader);
}

// Profile: Update Doctor Profile
export const updateDoctorProfileAPI = async (profile, reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/profile/doctor`, profile, reqHeader);
}

// Dashboard: Patient
export const getPatientDashboardAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/dashboard/patient`, "", reqHeader);
}

// Dashboard: Doctor
export const getDoctorDashboardAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/dashboard/doctor`, "", reqHeader);
}

// Dashboard: Admin
export const getAdminDashboardAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/dashboard/admin`, "", reqHeader);
}

// Health Insights: Get
export const getHealthInsightsAPI = async (type, reqHeader) => {
    const url = type ? `${SERVERURL}/api/health-insights?type=${type}` : `${SERVERURL}/api/health-insights`;
    return await commonAPI("GET", url, "", reqHeader);
}

// Health Insights: Add
export const addHealthInsightAPI = async (insight, reqHeader) => {
    return await commonAPI("POST", `${SERVERURL}/api/health-insights`, insight, reqHeader);
}

// Health Insights: BMI Tracker
export const getBMITrackerAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/health-insights/bmi`, "", reqHeader);
}

// Health Insights: Blood Pressure
export const getBloodPressureAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/health-insights/blood-pressure`, "", reqHeader);
}

// Health Insights: Appointment Stats
export const getAppointmentStatsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/health-insights/appointment-stats`, "", reqHeader);
}

// Notifications: Get
export const getNotificationsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/notifications`, "", reqHeader);
}

// Notifications: Mark as Read
export const markNotificationReadAPI = async (id, reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/notifications/${id}/read`, {}, reqHeader);
}

// Notifications: Mark All as Read
export const markAllNotificationsReadAPI = async (reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/notifications/read-all`, {}, reqHeader);
}

// Notifications: Delete
export const deleteNotificationAPI = async (id, reqHeader) => {
    return await commonAPI("DELETE", `${SERVERURL}/api/notifications/${id}`, {}, reqHeader);
}

// Analytics: Get System Analytics
export const getAnalyticsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/analytics`, "", reqHeader);
}

// Doctor Notes: Update
export const updateDoctorNoteAPI = async (id, note, reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/doctor_notes/${id}`, note, reqHeader);
}

// Doctor Notes: Get Patient Notes
export const getPatientNotesAPI = async (patientId, reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/doctor_notes/patient/${patientId}`, "", reqHeader);
}

// Records: Get Patient Records (Doctor)
export const getPatientRecordsAPI = async (patientId, reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/records/patient/${patientId}`, "", reqHeader);
}

// Admin: Update Doctor
export const updateDoctorAPI = async (id, doctor, reqHeader) => {
    return await commonAPI("PUT", `${SERVERURL}/api/doctors/${id}`, doctor, reqHeader);
}

// Doctor: Get Doctor's Patients
export const getDoctorPatientsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVERURL}/api/doctors/patients`, "", reqHeader);
}