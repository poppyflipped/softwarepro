<template>
  <div>
  <div class="h-[4px]" id="kong"></div>
  <main class="pt-20">
    <!-- Hero Section -->

    <section class="hero-section h-[600px] relative flex items-center">
      <div class="container mx-auto px-6">
        <div class="max-w-2xl text-gray-800 hero-content">
          <h2 class="text-5xl font-bold mb-6 font-xingkai hero-title">传承千年文化，<br />探索非遗之美</h2>
          <p class="text-lg mb-8 leading-relaxed hero-subtitle">
            通过数字化学习平台，体验传统文化的魅力。从书法、戏曲到工艺技艺，让每个人都能轻松学习和传承非物质文化遗产。
          </p>
          <button class="!rounded-button bg-primary text-white px-8 py-3 text-lg hover:bg-red-700 transition-colors whitespace-nowrap hero-button">开始学习</button>
        </div>
      </div>
    </section>

    <!-- 精品课程推荐 -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold mb-12 text-center">精品课程推荐</h3>
        <div class="grid grid-cols-4 gap-8">
          <div v-for="(course, index) in courses" :key="index" class="course-card bg-white rounded-lg shadow-md overflow-hidden hover:-translate-y-1 transition-all">
            <div class="h-48 overflow-hidden">
              <img :src="course.img" class="w-full h-full object-cover" />
            </div>
            <div class="p-6">
              <div class="flex items-center space-x-2 mb-3">
                <span :class="course.tagClass" class="text-xs px-2 py-1 rounded">{{ course.tag }}</span>
                <span class="text-sm text-gray-500">{{ course.score }} 分</span>
              </div>
              <h4 class="text-lg font-medium mb-2">{{ course.title }}</h4>
              <p class="text-gray-600 text-sm mb-4">{{ course.desc }}</p>
              <div class="flex items-center justify-between">
                <span class="text-primary font-medium">{{ course.price }}</span>
                <span class="text-gray-500 text-sm">{{ course.learners }} 人在学</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 每日学习任务 -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold mb-12 text-center">每日学习任务</h3>
        <div class="grid grid-cols-3 gap-8">
          <div v-for="(task, index) in tasks" :key="index" class="task-card p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-medium">{{ task.title }}</h4>
              <span class="text-primary">{{ task.reward }}</span>
            </div>
            <p class="text-gray-600 mb-4">{{ task.content }}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ task.progress }}</span>
              <button class="!rounded-button bg-primary text-white px-4 py-2 text-sm hover:bg-red-700 transition-colors whitespace-nowrap">
                {{ task.buttonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 沉浸式文化体验 -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold mb-12 text-center">沉浸式文化体验</h3>
        <div class="grid grid-cols-2 gap-8">
          <div v-for="(exp, index) in experiences" :key="index" class="bg-gray-50 rounded-lg p-8">
            <h4 class="text-xl font-medium mb-6">{{ exp.title }}</h4>
            <div class="aspect-video bg-white rounded-lg shadow-inner mb-6">
              <img :src="exp.img" class="w-full h-full object-cover rounded-lg" />
            </div>
            <p class="text-gray-600 mb-4">{{ exp.desc }}</p>
            <button class="!rounded-button bg-primary text-white px-6 py-3 hover:bg-red-700 transition-colors whitespace-nowrap">
              {{ exp.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习进度追踪 -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-6">
        <h3 class="text-3xl font-bold mb-12 text-center">学习进度追踪</h3>
        <div class="bg-white rounded-lg shadow-md p-8">
          <div class="grid grid-cols-4 gap-8 mb-8">
            <div v-for="(item, index) in progress" :key="index" class="text-center">
              <div class="text-3xl font-bold text-primary mb-2">{{ item.value }}</div>
              <div class="text-gray-600">{{ item.label }}</div>
            </div>
          </div>
          <div class="flex justify-center">
            <button class="!rounded-button bg-primary text-white px-8 py-3 hover:bg-red-700 transition-colors whitespace-nowrap">查看详细学习报告</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>
</template>

<script>
// import { useRouter } from 'vue-router'; 
// import axios from 'axios'; 
// import request from '@/utils/request' 
import { getUserInfo } from '@/utils/auth';
export default {
  name: 'HomePage',
  data() {
    return {
      courses: [
        {
          img: 'https://ai-public.mastergo.com/ai/img_res/be49ac7ad939b21c36711d2d03614fa2.jpg',
          tag: '入门',
          tagClass: 'bg-red-50 text-primary',
          score: '4.9',
          title: '零基础书法入门课程',
          desc: '从基本笔画开始，系统掌握书法技巧',
          price: '免费',
          learners: '12,345'
        },

        {
          img: 'https://ai-public.mastergo.com/ai/img_res/eb43bc9afe6bc0798aec17e931de004f.jpg',
          tag: '进阶',
          tagClass: 'bg-blue-50 text-secondary',
          score: '4.8',
          title: '京剧表演艺术精讲',
          desc: '系统学习京剧唱腔和表演技巧',
          price: '¥299',
          learners: '8,756'
        },
        {
          img: 'https://ai-public.mastergo.com/ai/img_res/b9dfd7303642f5b7551f23c223c78a51.jpg',
          tag: '入门',
          tagClass: 'bg-red-50 text-primary',
          score: '4.7',
          title: '传统剪纸艺术入门',
          desc: '掌握基础剪纸技法与图案设计',
          price: '¥199',
          learners: '6,789'
        },
        {
          img: 'https://ai-public.mastergo.com/ai/img_res/1e8e31ba9f115863aea45541af99f03e.jpg',
          tag: '进阶',
          tagClass: 'bg-blue-50 text-secondary',
          score: '4.9',
          title: '传统糕点制作技艺',
          desc: '探索古法糕点的精妙之处',
          price: '¥399',
          learners: '5,432'
        }
      ],
      tasks: [
        { title: '诗词鉴赏', reward: '+10 积分', content: '今日主题：《水调歌头》苏轼', progress: '完成进度：3/5', buttonText: '开始答题' },
        { title: '书法练习', reward: '+15 积分', content: '今日字帖：楷书基本笔画', progress: '已练习：30 分钟', buttonText: '继续练习' },
        { title: '文化知识问答', reward: '+20 积分', content: '今日主题：传统节日习俗', progress: '答对：8/10', buttonText: '继续答题' }
      ],
      experiences: [
        { title: '数字化书法练习', img: 'https://ai-public.mastergo.com/ai/img_res/1084692fcaec049b73700adefcfa6703.jpg', desc: '通过数字化技术，体验传统书法的魅力。配备智能笔压识别，让练习更加精准。', buttonText: '开始练习' },
        { title: '3D 文物展示', img: 'https://ai-public.mastergo.com/ai/img_res/3c205111f664e929185a0766da6eca62.jpg', desc: '360° 全方位观察珍贵文物，了解文物背后的历史故事和文化内涵。', buttonText: '开始体验' }
      ],
      progress: [
        { value: '126', label: '已学课时' },
        { value: '85%', label: '课程完成率' },
        { value: '1,280', label: '获得积分' },
        { value: '15', label: '获得证书' }
      ],
      userInfo:null
    };
  },
  async mounted() {
    await this.fetchUserInfo();
  },
  watch: {
    $route(to) {
      if (to.path === '/home') {
        this.fetchUserInfo();
      }
    }
  },
  methods: {
    async fetchUserInfo() {
      const user = await getUserInfo();
      if (user) {
        this.userInfo = user;
      } else {
        // 未登录或 Token 无效，跳转到登录页
        // this.$router.push('/login');
      }
    }
  }
};
  // onMounted() {
  //   this.fetchUserInfo();
  // },
  // watch: {
  //   $route(to) {
  //     if (to.path === '/home') {
  //       this.fetchUserInfo();
  //     }
  //   }
  // },
//   methods: {
//     async fetchUserInfo() {
//       const user = await getUserInfo();
//       if (user) {
//         this.userInfo = user;
//       } else {
//         // 未登录时跳转到登录页（可选）
//         this.$router.push('/login');
//       }
//     }
//   }
// };
</script>

<style scoped>

.hero-section {
  background-image: url('https://ai-public.mastergo.com/ai/img_res/f94038737d06208db9cda281ddcc1d0d.jpg');
  background-size: cover;
  background-position: center;
}
.font-xingkai {
  font-family: "STXingkai", "行楷", cursive;
}

/* 悬停时的效果 */
button:hover {
  background-color: #e53e3e; /* 背景颜色（悬停时红色） */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 增加阴影 */
}
#kong{
  margin-top:24px;
}

/* 标题、子标题和按钮向右上方调整 */
.hero-content {
  position: relative;
  top: -30px;
  right: -60px;
}

/* 如果需要单独微调每个元素，可以取消下面的注释 */
/* .hero-title {
  margin-bottom: 10px;
}

.hero-subtitle {
  margin-bottom: 15px;
} */
</style>
    