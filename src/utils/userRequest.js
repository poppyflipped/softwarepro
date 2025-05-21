// utils/request-user.js（用户端请求）
import axios from 'axios';
import router from '@/router';

const service = axios.create({
  baseURL: 'http://1.15.229.186',
  timeout: 10000
});

// 请求拦截器 - 只注入用户端Token
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('用户端请求携带的 Token:', token);
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('用户端请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 用户端401处理
service.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      await router.push('/login'); // 跳转到用户登录页
    }
    return Promise.reject(error);
  }
);

export default service;