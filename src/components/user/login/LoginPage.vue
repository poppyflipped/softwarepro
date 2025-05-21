<template>
  <div class="login-container">
    <div class="flex justify-center items-center min-h-screen">
    <div class="w-[460px] bg-white/90 backdrop-blur-md p-10 rounded-xl shadow-lg border border-white/20">
      <div class="text-center mb-8">
        <h1 class="font-['Pacifico'] text-3xl text-primary mb-4">logo</h1>
        <p class="text-secondary text-sm">山水之道，传承千年文脉</p>
      </div>
      
      <div class="mb-6">
        <div class="flex gap-4 mb-6">
          <button 
            class="flex-1 py-2 text-center border-b-2 transition-all duration-300" 
            @click="loginMethod = 'phone'"
            :class="{
              'border-primary text-primary': loginMethod === 'phone',
              'border-gray-200 text-gray-400': loginMethod !== 'phone'
            }"
          >
            手机号登录
          </button>
          <button 
            class="flex-1 py-2 text-center border-b-2 transition-all duration-300" 
            @click="loginMethod = 'email'"
            :class="{
              'border-[#B72C2C] text-[#B72C2C]': loginMethod === 'email',
              'border-gray-200 text-gray-400': loginMethod !== 'email'
            }"
          >
            邮箱登录
          </button>
        </div>
        
        <!-- 手机号登录表单 -->
        <div v-if="loginMethod === 'phone'" class="space-y-4 transition-all duration-300">
          <div class="relative">
            <input v-model="phone" type="text" placeholder="请输入手机号" class="w-full px-4 py-3 border border-gray-200 rounded-button text-sm pl-4 focus:border-primary">
          </div>
          
          <div class="space-y-4">
            
            
            <div class="relative">
              <input 
                :type="isPasswordVisible ? 'text' : 'password'" 
                v-model="password" 
                placeholder="请输入密码" 
                class="w-full px-4 py-3 border border-gray-200 rounded-button text-sm pl-4 focus:border-primary"
              >
              <button 
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" 
                @click="togglePasswordVisibility" 
              >
                {{ isPasswordVisible ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="rememberPassword" type="checkbox" class="w-4 h-4 accent-primary">
              <span class="text-sm text-gray-600">记住密码</span>
            </label>
            <a href="#" class="text-sm text-primary hover:text-primary/80" @click="handleForgotPassword">忘记密码？</a>
          </div>
          
          <button class="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-button" @click="handlePhoneLogin">
            登 录
          </button>
        </div>
        
        <!-- 邮箱登录表单 -->
        <div v-if="loginMethod === 'email'" class="space-y-4 transition-all duration-300">
          <div class="relative">
            <input v-model="email" type="email" placeholder="请输入邮箱" class="w-full px-4 py-3 border border-gray-200 rounded-button text-sm pl-4 focus:border-primary">
          </div>
          
          <div class="relative">
            <input 
              :type="isEmailPasswordVisible ? 'text' : 'password'" 
              v-model="emailPassword" 
              placeholder="请输入密码" 
              class="w-full px-4 py-3 border border-gray-200 rounded-button text-sm pl-4 focus:border-primary"
            >
            <button 
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" 
              @click="toggleEmailPasswordVisibility" 
            >
              {{ isEmailPasswordVisible ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          
          <div class="flex justify-between items-center">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="rememberEmailPassword" type="checkbox" class="w-4 h-4 accent-primary">
              <span class="text-sm text-gray-600">记住密码</span>
            </label>
            <a href="#" class="text-sm text-primary hover:text-primary/80" @click="handleForgotPassword">忘记密码？</a>
          </div>
          
          <button class="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-button" @click="handleEmailLogin">
            登 录
          </button>
        </div>
      </div>
      
      <div class="relative text-center mb-6">
        <div class="absolute left-0 top-1/2 w-full h-px bg-gray-200"></div>
        <span class="relative px-4 bg-white text-sm text-gray-400">其他登录方式</span>
      </div>
      
      <div class="flex justify-center gap-8 mb-8">
        <button @click="handleSocialLogin('weixin')">
          <svg t="1747103788985" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2697" width="43" height="43"><path d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z" fill="#28C445" p-id="2698"></path><path d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z" fill="#28C445" p-id="2699"></path></svg>
        </button>
        <button  @click="handleSocialLogin('qq')">
          <svg t="1747103982995" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3674" width="43" height="43"><path d="M512.268258 64.433103c-247.183323 0-447.569968 200.380501-447.569968 447.563825 0 247.189467 200.385621 447.570992 447.569968 447.570992s447.569968-200.380501 447.569968-447.569968c0-247.184347-200.386645-447.564849-447.569968-447.564849z m252.85872 584.692787c-18.997168 16.287968-43.668709-53.628042-47.2134-42.875198-8.642616 26.161294-12.695154 43.646184-38.148944 72.127602-1.35972 1.521494 29.43056 12.647032 38.148944 36.396051 8.346713 22.756875 24.596797 58.811973-81.725503 70.125906-62.389428 6.635801-107.471099-33.244533-111.964932-32.85648-8.325212 0.734126-4.618747 0-13.568528 0-7.321804 0-7.807126 0.534468-14.69685 0-1.899307-0.140272-22.632985 32.85648-115.364231 32.85648-71.878798 0-90.48177-45.243445-76.032701-70.125906 14.464428-24.877342 38.579999-32.122354 35.176604-36.06636-16.73643-19.39546-28.287904-40.1404-35.176604-58.882621-1.705793-4.666869-3.135137-9.209848-4.262434-13.574672-2.611931-10.008479-22.627866 58.76385-44.111028 42.875198-21.483162-15.883533-19.567472-56.309597-5.659014-95.003248 14.033372-39.006959 49.37687-76.562049 49.771065-84.854496 1.412962-30.849665-3.044011-35.975235 0-44.078263 6.780169-18.149391 15.034732-11.190043 15.034733-20.609788 0-118.64476 88.172909-214.829571 196.933079-214.829571 108.755051 0 196.928984 96.184811 196.928984 214.829571 0 4.554242 11.815637 0 17.474651 20.609788 1.165181 4.256291 1.968931 20.684531 0.58771 44.078263-0.658358 11.238165 29.954789 24.914202 45.777913 84.854496 15.845649 59.945414 0 88.215912-7.909514 95.003248z" fill="#12B7F5" p-id="3675" data-spm-anchor-id="a313x.search_index.0.i2.59253a819hXFLT" class="selected"></path></svg>
        </button>
        
      </div>
      
      <div class="text-center">
          <span class="text-sm text-gray-600">还没有账号？</span>
          <!-- 改为使用 router-link 跳转 -->
          <router-link to="/register" class="text-sm text-primary hover:text-primary/80 ml-2">
            立即注册
          </router-link>
          <span class="text-sm text-gray-400 mx-2">|</span>
          <a href="#" class="text-sm text-primary hover:text-primary/80" @click="handleFindPassword">
            找回密码
          </a>
        </div>
      </div>
    
    <div class="fixed bottom-4 w-full text-center text-sm text-gray-400">
      Copyright © 2024 传统文化学习平台 All Rights Reserved.
    </div>
  </div>
  </div>
</template>

<script setup>
// import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/userRequest' 
// 响应式数据
const loginMethod = ref('phone');
const phone = ref('');
const captcha = ref('');
const password = ref('');
const rememberPassword = ref(false);
const isPasswordVisible = ref(false);

// 邮箱登录相关数据
const email = ref('');
const emailPassword = ref('');
const rememberEmailPassword = ref(false);
const isEmailPasswordVisible = ref(false);
const router = useRouter();
// // 验证码倒计时
// const countdown = ref(0);
// let countdownTimer = null;

// 生命周期钩子
onMounted(() => {
  // 页面加载时恢复记住的密码
  if (localStorage.getItem('rememberPhonePassword') === 'true') {
    phone.value = localStorage.getItem('phone') || '';
    password.value = localStorage.getItem('phonePassword') || '';
    rememberPassword.value = true;
  }
  
  if (localStorage.getItem('rememberEmailPassword') === 'true') {
    email.value = localStorage.getItem('email') || '';
    emailPassword.value = localStorage.getItem('emailPassword') || '';
    rememberEmailPassword.value = true;
  }
  
});

onUnmounted(() => {
  // 组件卸载时清除定时器
  // if (countdownTimer) {
  //   clearInterval(countdownTimer);
  // }
});

// 手机号登录方法
// const getCaptcha = () => {
//   // 手机号格式验证
//   const phoneRegex = /^1[3-9]\d{9}$/;
//   if (!phoneRegex.test(phone.value)) {
//     alert('请输入正确的手机号');
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
  
//   // 实际项目中这里应该发送请求到后端获取验证码
//   console.log('获取验证码，手机号:', phone.value);
// };

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const handlePhoneLogin = async () => {
  // 表单验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone.value)) {
    alert('请输入正确的手机号');
    return;
  }
  
  // if (!captcha.value) {
  //   alert('请输入验证码');
  //   return;
  // }
  
  if (!password.value) {
    alert('请输入密码');
    return;
  }
  
  // 处理记住密码逻辑
  if (rememberPassword.value) {
    localStorage.setItem('rememberPhonePassword', 'true');
    localStorage.setItem('phone', phone.value);
    localStorage.setItem('phonePassword', password.value);
  } else {
    localStorage.removeItem('rememberPhonePassword');
    localStorage.removeItem('phone');
    localStorage.removeItem('phonePassword');
  }

  try{
    const response=await request.post(
      '/api/user/login',{
        phone: phone.value,
        password: password.value
      }
    );
    if (response.status === 200) {
      console.log('登录返回的 Token:', response.data.access_token);
      localStorage.setItem('access_token', response.data.access_token);
      console.log('localStorage 中的 Token:', localStorage.getItem('access_token')); // 检查存储是否成功
    
      router.push('/home');
      // if (typeof getUserInfo === 'function') {
      //   getUserInfo(); // 直接调用
      // } else {
      //   // 或通过路由导航守卫触发
      //   router.afterEach(() => {
      //     // 在主页组件中执行获取用户信息的逻辑
      //     const homeVm = this.$router.currentRoute.value.matched.find(record => record.components.default === HomePage);
      //     if (homeVm) {
      //       homeVm.getUserInfo();
      //     }
      //   });
      // }
    } else {
      alert('登录失败，请重试');
    }
  }catch (error) {
    console.error('登录失败:', error);
    alert('网络请求失败，请检查网络连接');
  } 
  console.log('手机号登录:', {
    phone: phone.value,
    captcha: captcha.value,
    password: password.value,
    rememberPassword: rememberPassword.value
  });
  
  // alert('登录成功！');
};

// 邮箱登录方法
const toggleEmailPasswordVisibility = () => {
  isEmailPasswordVisible.value = !isEmailPasswordVisible.value;
};

const handleEmailLogin = () => {
  // 表单验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    alert('请输入正确的邮箱地址');
    return;
  }
  
  if (!emailPassword.value) {
    alert('请输入密码');
    return;
  }
  
  // 处理记住密码逻辑
  if (rememberEmailPassword.value) {
    localStorage.setItem('rememberEmailPassword', 'true');
    localStorage.setItem('email', email.value);
    localStorage.setItem('emailPassword', emailPassword.value);
  } else {
    localStorage.removeItem('rememberEmailPassword');
    localStorage.removeItem('email');
    localStorage.removeItem('emailPassword');
  }
  
  // 实际项目中这里应该发送登录请求到后端
  console.log('邮箱登录:', {
    email: email.value,
    password: emailPassword.value,
    rememberPassword: rememberEmailPassword.value
  });
  
  // 模拟登录成功
  alert('登录成功！');
};

// 通用方法
const handleForgotPassword = () => {
  console.log('忘记密码');
  // 实际项目中这里应该跳转到找回密码页面
};

const handleSocialLogin = (platform) => {
  console.log('第三方登录，平台:', platform);
  // 实际项目中这里应该跳转到对应平台的登录页面
};



const handleFindPassword = () => {
  console.log('找回密码');
  // 实际项目中这里应该跳转到找回密码页面
};
</script>

<style scoped>
.login-container {
  background-image: url("@/assets/login/loginback.png");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

input:focus {
  outline: none;
  border-color: #B72C2C;
  box-shadow: 0 0 0 2px rgba(183, 44, 44, 0.1);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

button {
  transition: all 0.3s ease;
}

button:hover:not([disabled]) {
  transform: translateY(-2px);
}

button:active:not([disabled]) {
  transform: translateY(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>