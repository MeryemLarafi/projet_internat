import axios from 'axios';

// Create axios instance with base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Absence API services
export const absenceService = {
  // Create a new absence request
  createAbsence: async (absenceData) => {
    try {
      const response = await api.post('/absences', absenceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all absence requests with optional filtering
  getAllAbsences: async (filters = {}) => {
    try {
      const response = await api.get('/absences', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single absence request by ID
  getAbsenceById: async (id) => {
    try {
      const response = await api.get(`/absences/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update absence request status
  updateAbsenceStatus: async (id, status) => {
    try {
      const response = await api.patch(`/absences/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all rejected absences (history)
  getAbsenceHistory: async () => {
    try {
      const response = await api.get('/absences/history/rejected');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Restore a rejected absence
  restoreAbsence: async (id) => {
    try {
      const response = await api.patch(`/absences/${id}/restore`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get calendar events (accepted absences)
  getCalendarEvents: async (dateRange = {}) => {
    try {
      const response = await api.get('/absences/calendar/events', { params: dateRange });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update an absence request
  updateAbsence: async (id, absenceData) => {
    try {
      const response = await api.put(`/absences/${id}`, absenceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete an absence request
  deleteAbsence: async (id) => {
    try {
      const response = await api.delete(`/absences/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;
