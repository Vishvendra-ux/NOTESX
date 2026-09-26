import axios from 'axios';

export const api = axios.create({ baseURL: '/api', timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const collegeService = { list: (params) => api.get('/colleges', { params }), get: (id) => api.get(`/colleges/${id}`) };
export const authService = { login: (data) => api.post('/auth/login', data), register: (data) => api.post('/auth/register', data), me: () => api.get('/auth/me') };

export const hierarchyService = {
  getCategories: () => api.get('/course-categories'),
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  getBranches: (params) => api.get('/branches', { params }),
  getBranch: (id) => api.get(`/branches/${id}`),
  getYears: (params) => api.get('/years', { params }),
  getSemesters: (params) => api.get('/semesters', { params }),
  getSubjects: (params) => api.get('/subjects', { params }),
  getSubject: (id) => api.get(`/subjects/${id}`)
};

export const notesService = {
  list: (params) => api.get('/notes', { params }),
  get: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  download: (id) => api.post(`/notes/${id}/download`),
  toggleBookmark: (id) => api.post(`/notes/${id}/bookmark`),
  getBookmarks: () => api.get('/notes/user/bookmarks'),
  report: (id, data) => api.post(`/notes/${id}/report`, data),
  getReviews: (id) => api.get(`/notes/${id}/reviews`),
  addReview: (id, data) => api.post(`/notes/${id}/reviews`, data),
  toggleHelpfulReview: (id, reviewId) => api.post(`/notes/${id}/reviews/${reviewId}/helpful`),
  getContributor: (id) => api.get(`/notes/contributors/${id}`)
};
export const testService = { create: (data) => api.post('/tests', data), get: (id) => api.get(`/tests/${id}`), submit: (id, data) => api.post(`/tests/${id}/submit`, data) };
export const doubtService = { list: (params) => api.get('/doubts', { params }), create: (data) => api.post('/doubts', data) };
export const questionService = { list: (params) => api.get('/questions', { params }), create: (data) => api.post('/questions', data) };
export const contestService = { list: () => api.get('/contests'), get: (id) => api.get(`/contests/${id}`) };
export const userService = { me: () => api.get('/users/me'), profile: (username) => api.get(`/users/${username}`) };
export const aiService = { ask: (data) => api.post('/ai/chat', data) };
