<template>
<div class="admin-login-container">
    <div
        class="flex justify-center items-center min-h-screen bg-[url('@/assets/admin-bg.jpg')] bg-cover bg-no-repeat bg-center">
        <div class="w-[420px] bg-white/95 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20">
            <div class="text-center mb-6">
                <h1 class="font-bold text-2xl text-primary mb-2">管理员登录</h1>
                <p class="text-gray-600 text-sm">请使用专属账号登录</p>
            </div>

            <!-- 登录表单 -->
            <div class="space-y-4">
                <div class="relative">
                    <input v-model="username" type="text" placeholder="请输入管理员账号"
                        class="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-primary"
                        required>
                </div>

                <div class="relative">
                    <input :type="isPasswordVisible ? 'text' : 'password'" v-model="password" placeholder="请输入密码"
                        class="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-primary focus:ring-primary"
                        required>
                    <button class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                        @click="togglePasswordVisibility">
                        {{ isPasswordVisible ? '👁️' : '👁️‍🗨️' }}
                    </button>
                </div>

                <div class="flex justify-between items-center">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input v-model="rememberMe" type="checkbox" class="w-4 h-4 accent-primary">
                        <span class="text-sm text-gray-600">记住密码</span>
                    </label>

                </div>

                <button class="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-md"
                    @click="handleLogin" :disabled="isLoading">
                    {{ isLoading ? '登录中...' : '立即登录' }}
                </button>
            </div>


        </div>
    </div>

    <div class="fixed bottom-4 w-full text-center text-sm text-gray-400">
        Copyright © 2025 管理系统 All Rights Reserved.
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const router = useRouter();

// 响应式数据
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const isPasswordVisible = ref(false);
const isLoading = ref(false);

// 加载时恢复记住的密码
onMounted(() => {
    if (localStorage.getItem('rememberAdmin')) {
        username.value = localStorage.getItem('username') || '';
        rememberMe.value = true;
        password.value = localStorage.getItem('password') || '';
    }
});

// 登录处理
const handleLogin = async () => {
    if (!username.value || !password.value) {
        ElMessage.error('请填写完整登录信息');
        return;
    }

    isLoading.value = true;
    try {
        const response = await request.post('/api/admin/login', {
            username: username.value,
            password: password.value,
        });

        if (response.status === 200) {
            ElMessage.success('登录成功');
            localStorage.setItem('admin_token', response.data.access_token);
            console.log('存储的 Token:', localStorage.getItem('admin_token')); // 检查是否存在
            // 存储用户名
            if (rememberMe.value) {
                localStorage.setItem('username', username.value);
                localStorage.setItem('rememberAdmin', 'true');
            } else {
                localStorage.removeItem('username');
                localStorage.removeItem('rememberAdmin');
            }
            router.push('/admin/adminUser');
        } else {
            ElMessage.error(response.data.msg || '登录失败，请重试');
        }
    } catch (error) {
        console.error('登录请求失败:', error);
        ElMessage.error('登录请求失败');
    } finally {
        isLoading.value = false;
    }
};

// 密码显示切换
const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};


</script>

<style scoped>
.admin-login-container {
    background-image: url("@/assets/login/loginback.png");
    min-height: 100vh;
    background-attachment: fixed;
    background-size: cover;
}

input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

button {
    transition: all 0.3s ease;
    font-weight: 500;
}

button:hover:not([disabled]) {
    transform: translateY(-10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 动画样式 */
.form-container {
    animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>