import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vyaapari-api.onrender.com',
});

// 🔄 DYNAMIC INTERCEPTOR: Runs right before every single network request
api.interceptors.request.use(
  (config) => {
    // 🧠 FIXED: Syncing key target directly with your specific 'vyaapari_token' setup!
    const token = localStorage.getItem('vyaapari_token');
    if (token) {
      const cleanToken = token.trim();
      config.headers['Authorization'] = `Bearer ${cleanToken}`;
      config.headers['X-User-Email'] = cleanToken; 
    } else {
      delete config.headers['Authorization'];
      delete config.headers['X-User-Email'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;