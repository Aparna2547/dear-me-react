const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const dailyRoutineApi = {
  getAll: (day) => request(day ? `/routines?day=${encodeURIComponent(day)}` : '/routines', { method: 'GET' }),
  create: (title, description, category, time, reminder, days) =>
    request('/routines', { method: 'POST', body: JSON.stringify({ title, description, category, time, reminder, days }) }),
  update: (id, updates) =>
    request(`/routines/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  toggleComplete: (id, completed) =>
    request(`/routines/${id}`, { method: 'PUT', body: JSON.stringify({ completed }) }),
  remove: (id) => request(`/routines/${id}`, { method: 'DELETE' }),
};

export const authApi = {
  login: (email, password) =>
    request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (name, email, password) =>
    request('/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  resetPassword: (email, newPassword) =>
    request('/reset-password', { method: 'POST', body: JSON.stringify({ email, newPassword }) }),
};

export const routineApi = {
  getAll: (day) => request(day ? `/routines?day=${encodeURIComponent(day)}` : '/routines', { method: 'GET' }),
  create: (title, description, category, time, reminder, days) =>
    request('/routines', { method: 'POST', body: JSON.stringify({ title, description, category, time, reminder, days }) }),
  update: (id, updates) =>
    request(`/routines/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  remove: (id) => request(`/routines/${id}`, { method: 'DELETE' }),
};


export const moneyApi = {
  getAll: () => request('/money-records', { method: 'GET' }),
  create: (record) =>
    request('/money-records', { method: 'POST', body: JSON.stringify(record) }),
  update: (id, updates) =>
    request(`/money-records/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  remove: (id) => request(`/money-records/${id}`, { method: 'DELETE' }),
};


export default request;