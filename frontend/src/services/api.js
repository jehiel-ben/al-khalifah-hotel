import axios from 'axios';

// URL de base du backend Express
const API_BASE = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les erreurs (utile pour le debug)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== ROOM TYPES ====================
export const roomTypesApi = {
  getAll: () => api.get('/room-types'),
  getById: (id) => api.get(`/room-types/${id}`),
  create: (data) => api.post('/room-types', data),
  update: (id, data) => api.put(`/room-types/${id}`, data),
  delete: (id) => api.delete(`/room-types/${id}`),
};

// ==================== ROOMS ====================
export const roomsApi = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  getAvailable: (checkIn, checkOut) =>
    api.get('/rooms/available', { params: { check_in: checkIn, check_out: checkOut } }),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// ==================== SERVICES ====================
export const servicesApi = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// ==================== RESERVATIONS ====================
export const reservationsApi = {
  getAll: (params) => api.get('/reservations', { params }),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  delete: (id) => api.delete(`/reservations/${id}`),
};

// ==================== PAYMENTS ====================
export const paymentsApi = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
};

// ==================== STATS ====================
export const statsApi = {
  getDashboard: () => api.get('/stats/dashboard'),
};

export default api;