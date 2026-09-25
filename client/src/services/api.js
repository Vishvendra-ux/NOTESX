import axios from 'axios';

export const api = axios.create({ baseURL: '/api', timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const collegeService = { list: (params) => api.get('/colleges', { params }), get: (id) => api.get(`/colleges/${id}`) };
export const authService = { login: (data) => api.post('/auth/login', data), register: (data) => api.post('/auth/register', data), me: () => api.get('/auth/me') };
export const notesService = { list: (params) => api.get('/notes', { params }), get: (id) => api.get(`/notes/${id}`), create: (data) => api.post('/notes', data) };
export const testService = { create: (data) => api.post('/tests', data), get: (id) => api.get(`/tests/${id}`), submit: (id, data) => api.post(`/tests/${id}/submit`, data) };
export const doubtService = { list: (params) => api.get('/doubts', { params }), create: (data) => api.post('/doubts', data) };
export const questionService = { list: (params) => api.get('/questions', { params }), create: (data) => api.post('/questions', data) };
export const contestService = { list: () => api.get('/contests'), get: (id) => api.get(`/contests/${id}`) };
export const userService = { me: () => api.get('/users/me'), profile: (username) => api.get(`/users/${username}`) };
export const aiService = { ask: (data) => api.post('/ai/chat', data) };
