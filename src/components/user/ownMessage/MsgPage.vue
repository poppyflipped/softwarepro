<template>
  <div class="user-info-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb mb-6">
      <router-link to="/home">首页</router-link> / 用户信息
    </div>

    <!-- 用户信息卡片 -->
    <div class="card bg-white rounded-lg shadow-md p-8">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">加载中...</span>
        </div>
      </div>

      <!-- 数据加载完成后显示内容 -->
      <div v-else-if="userInfo" class="opacity-100 transition-opacity duration-300">
        <div class="flex items-center space-x-6 mb-8">
          <!-- 头像上传区域 -->
          <div class="avatar-container">
            <img
              :src="userInfo.avatar || defaultAvatar"
              class="w-24 h-24 rounded-full border-4 border-gray-100"
            >
            <label
              for="avatar-upload"
              class="mt-2 block text-sm text-primary cursor-pointer"
            >
              <i class="fas fa-camera mr-1"></i> 更换头像
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              class="hidden"
              @change="handleAvatarUpload"
            >
          </div>

          <!-- 用户基本信息 -->
          <div>
            <h2 class="text-xl font-bold text-gray-800">{{ userInfo.name || username }}</h2>
            <p class="text-gray-500">用户ID：{{ userInfo.id }}</p>
          </div>
        </div>

        <!-- 信息编辑表单 -->
        <form @submit.prevent="handleUpdateInfo">
            <div style="border:1px solid #e5e7eb;padding:10px">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- 用户名 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">用户名</label>
              <input
                type="text"
                v-model="form.name"
                class="mt-2 block w-full border rounded-md py-2 px-3"
                placeholder="请输入用户名"
                required
              >
            </div>

            <!-- 性别 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">性别</label>
              <select
                v-model="form.sex"
                class="mt-2 block w-full border rounded-md py-2 px-3"
                required
              >
                <option value="UNKNOWN">保密</option>
                <option value="MALE">男</option>
                <option value="FEMALE">女</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            class="w-1/2 bg-primary text-white py-3 rounded-md hover:bg-red-700 transition"
            style="margin-left:85%;width:150px"
            :disabled="isLoading"
        >
            保存修改
        </button>
            </div>
          

          <!-- 手机号（只读） -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700">手机号</label>
            <input
              type="text"
              :value="userInfo.phone || ''"
              class="mt-2 block w-full border rounded-md py-2 px-3 bg-gray-100 cursor-not-allowed"
              readonly
            >
          </div>

          <!-- 修改密码模块 -->
          <div class="mb-6" style="border:1px solid #e5e7eb;padding:10px">
            <h3 class="text-lg font-medium text-gray-700 mb-4">修改密码</h3>
            <div class="grid grid-cols-1 gap-4">
              <!-- 短信验证码（将获取验证码文字放在输入框后面） -->
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700">短信验证码</label>
                <input
                  type="text"
                  v-model="form.code"
                  class="mt-2 block w-full border rounded-md py-2 px-3 pr-32" 
                  placeholder="请输入短信验证码"
                  :disabled="isPasswordLoading || !userInfo.phone"
                >
                <span
                  v-if="userInfo.phone"
                  class="absolute right-3 top-[32px] text-sm text-primary cursor-pointer hover:underline"
                  @click="sendVerificationCode"
                >
                  {{ sendingCode ? '发送中...' : '获取验证码' }}
                </span>
              </div>

              <!-- 新密码 -->
              <div>
                <label class="block text-sm font-medium text-gray-700">新密码</label>
                <input
                    type="password"
                    v-model="form.newPassword"
                    class="mt-2 block w-full border rounded-md py-2 px-3"
                    placeholder="请输入6-16位新密码"
                    :disabled="isPasswordLoading"
                    pattern="^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,16}$"
                    title="密码需包含字母和数字，6-16位"
                >
                </div>
            </div>
            <!-- 修改密码按钮 -->
            <button
                @click="handleChangePassword"
                class="w-1/2 bg-gray-600 text-white py-3 rounded-md hover:bg-gray-700 transition"
                style="margin-top:10px;margin-left:85%;width:150px"
                :disabled="isPasswordLoading || !form.code || !form.newPassword"
            >
                {{ isPasswordLoading ? '修改中...' : '修改密码' }}
            </button>
        </div>

        </form>
        </div>

        <!-- 无数据或加载失败 -->
        <div v-else class="text-center py-12">
        <p class="text-gray-500">加载用户信息失败，请重试</p>
        <button @click="checkLoginStatus" class="mt-4 text-primary">
            <i class="fas fa-refresh mr-1"></i> 刷新
        </button>
        </div>
    </div>
</div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/userRequest';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const router = useRouter();
    const defaultAvatar = 'https://via.placeholder.com/150.png?text=Default+Avatar';
    const userInfo = ref(null);
    const form = reactive({
      name: '',         // 用户名
      sex: 'UNKNOWN',   // 性别
      code: '',         // 短信验证码
      newPassword: '',  // 新密码
    });
    const isLoading = ref(false);           // 页面加载状态
    const isPasswordLoading = ref(false);   // 修改密码加载状态
    const sendingCode = ref(false);         // 发送验证码状态

    // 加载用户信息
    const checkLoginStatus = async () => {
      try {
        isLoading.value = true;
        const res = await request.get('/api/user/me');
        userInfo.value = res.data;
        form.name = res.data.name;
        form.sex = res.data.sex || 'UNKNOWN';
      } catch (error) {
        console.error('获取用户信息失败:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/login');
        }
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(checkLoginStatus);

    // 处理头像上传
    const handleAvatarUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        isLoading.value = true;
        const res = await request.put('/api/user/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        userInfo.value.avatar = res.data.avatar;
        ElMessage.success('头像上传成功');
      } catch (error) {
        console.error('头像上传失败:', error);
        ElMessage.error('上传失败，请检查网络或文件格式');
      } finally {
        isLoading.value = false;
      }
    };

    // 处理基本信息更新
    const handleUpdateInfo = async () => {
      try {
        isLoading.value = true;
        const res = await request.put('/api/user/update', {
          name: form.name,
          sex: form.sex,
        });
        userInfo.value = res.data;
        ElMessage.success('信息更新成功');
      } catch (error) {
        console.error('更新信息失败:', error);
        if (error.response?.status === 422) {
          ElMessage.error('输入格式错误，请检查用户名和性别');
        } else {
          ElMessage.error('更新失败，请重试');
        }
      } finally {
        isLoading.value = false;
      }
    };

    // 发送短信验证码
    const sendVerificationCode = async () => {
      if (!userInfo.value.phone) {
        return ElMessage.error('请先绑定手机号');
      }
      try {
        sendingCode.value = true;
        await request.post('/api/user/send-reset-code', {
          phone: userInfo.value.phone,
          type: 'reset_password', // 验证码类型需与后端约定
        });
        ElMessage.success('验证码已发送，有效期5分钟');
        
        // 添加倒计时逻辑
        let countdown = 60;
        const timer = setInterval(() => {
          countdown--;
          sendingCode.value = `重新发送(${countdown}s)`;
          
          if (countdown <= 0) {
            clearInterval(timer);
            sendingCode.value = false;
          }
        }, 1000);
      } catch (error) {
        console.error('发送验证码失败:', error);
        ElMessage.error('发送失败，请重试');
      } finally {
        // 仅在错误时重置状态，成功时由倒计时控制
        if (!sendingCode.value.includes('重新发送')) {
          sendingCode.value = false;
        }
      }
    };

    // 处理密码修改
    const handleChangePassword = async () => {
      if (!form.code || !form.newPassword) {
        return ElMessage.error('请填写验证码和新密码');
      }
      try {
        isPasswordLoading.value = true;
        const res = await request.post('/api/user/reset-password', {
          phone: userInfo.value.phone,
          code: form.code,
          new_password: form.newPassword,
        });
        console.log(res);
        ElMessage.success('密码修改成功，请重新登录');
        localStorage.removeItem('access_token'); // 清除登录状态
        router.push('/login');
      } catch (error) {
        console.error('修改密码失败:', error);
        if (error.response?.status === 422) {
          const errors = error.response.data.detail;
          errors.forEach((err) => {
            if (err.loc.includes('code')) {
              ElMessage.error('验证码错误或已过期');
            } else if (err.loc.includes('new_password')) {
              ElMessage.error('密码格式不符合要求');
            }
          });
        } else {
          ElMessage.error('修改失败，请重试');
        }
      } finally {
        isPasswordLoading.value = false;
        form.code = '';
        form.newPassword = '';
      }
    };

    return {
      router,
      defaultAvatar,
      userInfo,
      form,
      isLoading,
      isPasswordLoading,
      sendingCode,
      handleAvatarUpload,
      handleUpdateInfo,
      sendVerificationCode,
      handleChangePassword,
      checkLoginStatus,
    };
  },
};
</script>

<style scoped>
.user-info-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.breadcrumb {
  color: #6b7280;
  font-size: 0.875rem;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-container input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 验证码输入框样式 */
.user-info-page .relative {
  position: relative;
}

.user-info-page .absolute {
  right: 1rem;
  top: 2.2rem;
  font-size: 0.875rem;
  color: #3b82f6;
  cursor: pointer;
}

.user-info-page .absolute:hover {
  text-decoration: underline;
}

/* 修改密码模块样式 */
.user-info-page input[type="password"],
.user-info-page input[type="text"] {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #fff;
}

.user-info-page .flex {
  gap: 1.5rem;
  margin-top: 2rem;
}
</style>