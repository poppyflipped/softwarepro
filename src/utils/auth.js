import request from '@/utils/userRequest';

export const getUserInfo = async () => {
    try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        console.log('未找到 Token,用户未登录');
        return null;
    }
    
    // 请求头已在拦截器中统一设置，无需在此重复添加
    const response = await request.get('/api/user/me');
    console.log('获取用户信息成功:', response.data);
    return response.data;
    } catch (error) {
    console.error('获取用户信息失败:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token'); // 清除无效 Token
    }
    return null;
    }
};