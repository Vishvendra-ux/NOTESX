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
export const testService = {
  create: (data) => api.post('/tests', data),
  customize: (data) => api.post('/tests/custom', data),
  get: (id) => api.get(`/tests/${id}`),
  submit: (id, data) => api.post(`/tests/${id}/submit`, data),
};
export const gateService = {
  getProgress: () => api.get('/gate/progress'),
  startTopic: (topicId, subjectId) => api.post(`/gate/topics/${topicId}/start`, { subjectId }),
  completeTopic: (topicId, subjectId) => api.post(`/gate/topics/${topicId}/complete`, { subjectId }),
  reopenTopic: (topicId, subjectId) => api.post(`/gate/topics/${topicId}/reopen`, { subjectId }),
};
export const doubtService = {
  list: (params) => api.get('/doubts', { params }),
  stats: () => api.get('/doubts/stats'),
  get: (id) => api.get(`/doubts/${id}`),
  create: (data) => api.post('/doubts', data),
  delete: (id) => api.delete(`/doubts/${id}`),
  upvote: (id) => api.post(`/doubts/${id}/upvote`),
  downvote: (id) => api.post(`/doubts/${id}/downvote`),
  toggleBookmark: (id) => api.post(`/doubts/${id}/bookmark`),
  acceptAnswer: (doubtId, answerId) => api.post(`/doubts/${doubtId}/accept/${answerId}`),
  getAnswers: (doubtId) => api.get(`/doubts/${doubtId}/answers`),
  createAnswer: (doubtId, data) => api.post(`/doubts/${doubtId}/answers`, data),
  upvoteAnswer: (answerId) => api.post(`/answers/${answerId}/upvote`),
  downvoteAnswer: (answerId) => api.post(`/answers/${answerId}/downvote`),
  deleteAnswer: (answerId) => api.delete(`/answers/${answerId}`),
  getComments: (parentId, onModel) => api.get('/comments', { params: { parentId, onModel } }),
  createComment: (data) => api.post('/comments', data),
};
export const questionService = { list: (params) => api.get('/questions', { params }), create: (data) => api.post('/questions', data) };
export const contestService = { list: () => api.get('/contests'), get: (id) => api.get(`/contests/${id}`) };
export const userService = { me: () => api.get('/users/me'), profile: (username) => api.get(`/users/${username}`) };
export const aiService = { ask: (data) => api.post('/ai/chat', data) };
export const roadmapService = {
  list: (params) => api.get('/roadmaps', { params }),
  categories: () => api.get('/roadmaps/categories'),
  get: (idOrSlug) => api.get(`/roadmaps/${idOrSlug}`),
};
export const jobService = {
  list: (params) => api.get('/jobs', { params }),
  stats: () => api.get('/jobs/stats'),
  get: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  toggleSave: (id) => api.post(`/jobs/${id}/save`),
  apply: (id, data) => api.post(`/jobs/${id}/apply`, data),
  myApplications: () => api.get('/jobs/my/applications'),
};

export const buildTogetherService = {
  list: (params) => api.get('/build-together', { params }),
  get: (id) => api.get(`/build-together/${id}`),
  create: (data) => api.post('/build-together', data),
  apply: (id, data) => api.post(`/build-together/${id}/apply`, data),
  toggleUpvote: (id) => api.post(`/build-together/${id}/upvote`),
  manageApplication: (id, appId, data) => api.patch(`/build-together/${id}/applications/${appId}`, data),
  delete: (id) => api.delete(`/build-together/${id}`),
  getMessages: (id) => api.get(`/build-together/${id}/messages`),
};

export const gameService = {
  getFamousGames: () => api.get('/games/famous'),
  getRooms: (params) => api.get('/games/rooms', { params }),
  createRoom: (data) => api.post('/games/rooms', data),
  joinRoom: (id) => api.post(`/games/rooms/${id}/join`),
  leaveRoom: (id) => api.post(`/games/rooms/${id}/leave`),
  updateRoomStatus: (id, data) => api.patch(`/games/rooms/${id}/status`, data),
  deleteRoom: (id) => api.delete(`/games/rooms/${id}`),
};

