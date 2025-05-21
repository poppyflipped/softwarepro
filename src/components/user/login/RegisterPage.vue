<template>
  <div class="register-container">
    <div class="flex justify-center items-center min-h-screen">
      <div class="w-[460px] bg-white/90 backdrop-blur-md p-10 rounded-xl shadow-lg border border-white/20">
        <div class="text-center mb-8">
          <h1 class="font-['Pacifico'] text-3xl text-primary mb-4">logo</h1>
          <p class="text-secondary text-sm">山水之道，传承千年文脉</p>
        </div>

        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-6 text-center">新用户注册</h2>
          <div class="space-y-4">
            <!-- 手机号 -->
            <div class="relative">
              <input
                v-model="form.phone"
                type="text"
                placeholder="请输入手机号"
                class="w-full px-4 py-3 border border-gray-200 rounded-button text-sm"
                :class="{ 'border-primary': phoneError }"
              />
              <i class="fas fa-mobile-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <p v-if="phoneError" class="text-red-500 text-sm absolute left-4 bottom-0">
                {{ phoneErrorMessage }}
              </p>
            </div>

            <!-- 用户名 -->
            <div class="relative">
              <input
                v-model="form.name"
                type="text"
                placeholder="请设置用户名"
                class="w-full px-4 py-3 border border-gray-200 rounded-button text-sm"
                :class="{ 'border-primary': nameError }"
              />
              <i class="fas fa-user absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <p v-if="nameError" class="text-red-500 text-sm absolute left-4 bottom-0">
                用户名需3-20个字符
              </p>
            </div>

            <!-- 密码 -->
            <div class="relative">
              <input
                v-model="form.password"
                :type="isPasswordVisible ? 'text' : 'password'"
                placeholder="请设置密码"
                class="w-full px-4 py-3 border border-gray-200 rounded-button text-sm"
                :class="{ 'border-primary': passwordError }"
              />
              <button 
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" 
                @click="togglePasswordVisibility" 
              >
                {{ isPasswordVisible ? '👁️' : '👁️‍🗨️' }}
              </button>
              <p v-if="passwordError" class="text-red-500 text-sm absolute left-4 bottom-0">
                密码需6-20位字符
              </p>
            </div>

            <!-- 验证码 -->
            <!-- <div class="relative">
              <input
                v-model="form.captcha"
                type="text"
                placeholder="请输入验证码"
                class="w-full px-4 py-3 border border-gray-200 rounded-button text-sm"
                :class="{ 'border-primary': captchaError }"
              />
              <button
                class="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-sm whitespace-nowrap"
                @click="getCaptcha"
                :disabled="countdown > 0"
              >
                {{ countdown > 0 ? `${countdown}s后重试` : "获取验证码" }}
              </button>
              <p v-if="captchaError" class="text-red-500 text-sm absolute left-4 bottom-0">
                请输入6位验证码
              </p>
            </div> -->

            <!-- 协议勾选 -->
            <div class="flex items-center gap-2">
              <input
                v-model="agreed"
                type="checkbox"
                class="w-4 h-4 accent-primary"
                :checked="agreed"
              />
              <span class="text-sm text-gray-600">
                我已阅读并同意
                <a href="#" class="text-primary">服务条款</a>和
                <a href="#" class="text-primary">隐私政策</a>
              </span>
            </div>

            <!-- 注册按钮 -->
            <button
              class="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-button"
              @click="handleRegister"
            >
              {{ isLoading ? "注册中..." : "注 册" }}
            </button>
          </div>
        </div>

        <!-- 跳转登录 -->
        <div class="text-center">
          <span class="text-sm text-gray-600">已有账号？</span>
          <router-link to="/login" class="text-sm text-primary hover:text-primary/80">
            立即登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
// import axios from 'axios'; 
import request from '@/utils/userRequest' 

// 表单数据
const form = ref({
  phone: '',
  name: '',
  password: '',
  // captcha: '',
});

// 响应式状态
const agreed = ref(false);
// const countdown = ref(0);
const isPasswordVisible = ref(false);
const isLoading = ref(false);
const router = useRouter();

// 错误信息
const phoneError = ref(false);
const phoneErrorMessage = ref('');
const nameError = ref(false);
const passwordError = ref(false);
// const captchaError = ref(false);

// 验证码倒计时定时器
// let countdownTimer = null;

// 表单验证
const isFormValid = computed(() => {
  return (
    phoneError.value === false &&
    nameError.value === false &&
    passwordError.value === false &&
    // captchaError.value === false &&
    form.value.phone.length > 0 &&
    form.value.name.length > 0 &&
    form.value.password.length > 0
    // && form.value.captcha.length > 0
  );
});

// 手机号验证
watch(
  () => form.value.phone,
  (val) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!val) {
      phoneError.value = false;
      return;
    }
    phoneError.value = !phoneRegex.test(val);
    phoneErrorMessage.value = phoneError.value ? '请输入正确的11位手机号' : '';
  }
);

// 用户名验证（3-20字符）
watch(
  () => form.value.name,
  (val) => {
    nameError.value = val.length < 3 || val.length > 20;
  }
);

// 密码验证（6-20位）
watch(
  () => form.value.password,
  (val) => {
    passwordError.value = val.length < 6 || val.length > 20;
  }
);

// // 验证码验证（6位数字）
// watch(
//   () => form.value.captcha,
//   (val) => {
//     captchaError.value = val.length !== 6 || isNaN(val);
//   }
// );

// 获取验证码
// const getCaptcha = () => {
//   // 验证手机号格式
//   const phoneRegex = /^1[3-9]\d{9}$/;
//   if (!phoneRegex.test(form.value.phone)) {
//     phoneError.value = true;
//     phoneErrorMessage.value = '请输入正确的11位手机号';
//     return;
//   }

//   // 开始倒计时
//   countdown.value = 60;
//   countdownTimer = setInterval(() => {
//     countdown.value--;
//     if (countdown.value <= 0) {
//       clearInterval(countdownTimer);
//     }
//   }, 1000);

//   // 实际项目中发送获取验证码请求
//   axios
//     .post('http://10.18.39.108:8000/api/send-captcha', { phone: form.value.phone })
//     .then((res) => {
//       if (res.data.code === 200) {
//         console.log('验证码发送成功');
//       } else {
//         alert(res.data.message || '验证码发送失败');
//       }
//     })
//     .catch((error) => {
//       console.error('验证码请求失败:', error);
//       alert('网络请求失败，请重试');
//     });
// };

// 密码显示切换
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// 注册处理
const handleRegister = async () => {
  if (!isFormValid.value || !agreed.value) {
    alert('请检查表单填写是否正确');
    return;
  }

  isLoading.value = true;

  try {
    const response = await request.post(
      '/api/user/register', 
      {
        phone: form.value.phone,
        password: form.value.password,
        name: form.value.name,
        openid: ''
      }
    );

    if (response.status === 200) {
      // 成功逻辑
      const data = response.data;
      // alert('注册成功！');
      router.push('/login'); // 注册成功后跳转登录页

      // 存储用户信息（示例）
      localStorage.setItem('userInfo', JSON.stringify(data));
    } else {
      // 服务器返回非 200 状态码（如 400、422）
      alert(response.data?.message || '注册失败，请重试'); // 添加 ?. 并提供默认值
}
  } catch (error) {
    let errorMessage = '注册失败，请重试';

    // 处理网络错误
    if (error.message === 'Network Error') {
      errorMessage = '网络连接失败，请检查网络';
    } 
    // 处理请求配置错误（如 URL 错误）
    else if (error.config && !error.response) {
      errorMessage = '请求地址错误，请检查接口路径';
    } 
    // 记录原始错误详情（避免控制台报错）
    else {
      console.error('原始错误:', error);
    }

    alert(errorMessage);
  } finally {
    isLoading.value = false;
  }
};


// 清除定时器
onUnmounted(() => {
  // if (countdownTimer) {
  //   clearInterval(countdownTimer);
  // }
});
</script>

<style scoped>
/* 继承登录页样式，新增错误提示样式 */
.register-container {
  background-image: url(~@/assets/login/loginback.png);
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

input:focus {
  outline: none;
  border-color: #B72C2C;
  box-shadow: 0 0 0 2px rgba(183, 44, 44, 0.1);
}

/* 错误提示样式 */
.text-red-500 {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* 按钮加载状态 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>