// utils/request-admin.js（管理端请求）
import axios from 'axios';
import router from '@/router';
import { ElMessage } from 'element-plus';
const service = axios.create({
  baseURL: 'http://1.15.229.186',
  timeout: 10000
});

// 请求拦截器 - 只注入管理端Token
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      console.log('管理端请求携带的 Token:', token);
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('管理端请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 新增403处理逻辑
service.interceptors.response.use(
  response => response,
  async error => {
    const { response } = error;
    
    // // ✅ 处理403权限错误
    if (response?.status === 403) {
      ElMessage.error('权限不足，您没有访问该页面的权限');
      // 可选：跳转到权限提示页或首页
      // return Promise.reject(error); // 终止请求处理链
    }

    // 处理401未认证错误（保持不变）
    else if (response?.status === 401) {
      localStorage.removeItem('admin_token');
      await router.push('/admin/login');
      return Promise.reject(error);
    }

    // 其他错误处理（如500、404等）
    else if (response) {
      ElMessage.error(`请求失败：${response.status} ${response.statusText}`);
    } else {
      ElMessage.error('网络连接失败，请检查服务器或网络');
    }
    
    return Promise.reject(error);
  }
);

export default service;
// import axios from 'axios'
// import router from '@/router'
// const service = axios.create({
//   baseURL: 'http://1.15.229.186',
//   timeout: 10000
// })
// // 请求拦截器
// service.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('access_token');
//     const admintoken = localStorage.getItem('admin_token');

    
//     if (token) {
//       // 注意：必须以 "Bearer " 开头（有空格）
//       console.log('请求携带的 Token:', token); 
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     if (admintoken) {
//       // 注意：必须以 "Bearer " 开头（有空格）
//       console.log('请求携带的Admin  Token:', admintoken); 

//       config.headers['Authorization'] = `Bearer ${admintoken}`;
//     }
//     return config;
//   },
//   error => {
//     console.error('请求拦截器错误:', error);
//     return Promise.reject(error);
//   }
// );

// // utils/request.js（响应拦截器）
// service.interceptors.response.use(
//   response => response,
//   async error => {
//     const { response, config } = error;
    
//     // 处理 401 未认证错误
//     if (response?.status === 401) {
//       let targetLoginPath = '/admin/login'; // 默认跳转管理端（可根据业务调整）
      
//       // 1. 从当前路由元信息获取端类型（适用于页面路由跳转）
//       const currentRouteType = router.currentRoute.value.meta.type;
      
//       // 2. 从请求配置中获取端类型（适用于直接 API 请求）
//       const requestRouteType = config?.meta?.type;
      
//       // 优先使用请求配置中的端类型，其次使用当前路由的端类型
//       const routeType = requestRouteType || currentRouteType;
      
//       if (routeType === 'user') {
//         targetLoginPath = '/login'; // 用户端登录页路径
//       } else if (routeType === 'admin') {
//         targetLoginPath = '/admin/login'; // 管理端登录页路径
//       }

//       // 清除 Token 并跳转
//       localStorage.removeItem('access_token');
//       await router.push(targetLoginPath);
//     }

//     return Promise.reject(error);
//   }
// );

// export default service