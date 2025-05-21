<template>
  <div>
  <main class="mt-16 container mx-auto px-4 md:px-6">
    <!-- 顶部导航 -->
    <div class="py-8">
      <nav class="flex items-center justify-between border-b border-gray-200 pb-4">
        <div class="flex space-x-6 md:space-x-8">
          <a href="#" class="text-primary font-medium">全部课程</a>
          <a href="#" class="text-gray-600 hover:text-primary">书法课程</a>
          <a href="#" class="text-gray-600 hover:text-primary">国画课程</a>
          <a href="#" class="text-gray-600 hover:text-primary">篆刻课程</a>
          <a href="#" class="text-gray-600 hover:text-primary">茶艺课程</a>
        </div>
        <div class="relative">
          <input type="text" placeholder="搜索课程"
            class="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-primary" />
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </nav>
    </div>

    <!-- 分类筛选 -->
    <div class="py-6">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <span class="text-gray-600">难度：</span>
          <button
            class="px-4 py-1 text-primary border border-primary rounded hover:bg-primary hover:text-white">全部</button>
          <button
            class="px-4 py-1 text-gray-600 border border-gray-200 rounded hover:border-primary hover:text-primary">入门</button>
          <button
            class="px-4 py-1 text-gray-600 border border-gray-200 rounded hover:border-primary hover:text-primary">进阶</button>
          <button
            class="px-4 py-1 text-gray-600 border border-gray-200 rounded hover:border-primary hover:text-primary">高级</button>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600">排序：</span>
          <button class="flex items-center space-x-1 text-primary">
            <span>最新</span>
            <i class="fas fa-chevron-down text-xs"></i>
          </button>
        </div>
      </div>

      <!-- 课程列表 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="course in courses" :key="course.id"
          class="course-card bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="aspect-w-16 aspect-h-9 overflow-hidden">
            <img :src="course.image" :alt="course.title" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-medium mb-2">{{ course.title }}</h3>
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <i class="fas fa-user-tie mr-2"></i>
              <span>{{ course.teacher }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">
                <i class="fas fa-users mr-1"></i>
                <span>{{ course.learners }} 人已学习</span>
              </div>
              <div class="text-primary font-medium">￥{{ course.price }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center mt-12">
        <nav class="flex items-center space-x-2">
          <button
            class="w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-primary hover:text-primary">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="w-10 h-10 flex items-center justify-center rounded-md bg-primary text-white">1</button>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-primary hover:text-primary">2</button>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-primary hover:text-primary">3</button>
          <span class="w-10 h-10 flex items-center justify-center text-gray-600">...</span>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-primary hover:text-primary">8</button>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-primary hover:text-primary">
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>
  </main>
</div>

</template>

<script setup>
import { ref } from 'vue'

const courses = ref([
  {
    id: 1,
    title: '书法基础入门课程',
    image: 'https://ai-public.mastergo.com/ai/img_res/1b0add38f1f5b1494a1281db202b2c33.jpg',
    teacher: '王大师',
    learners: 2345,
    price: 299
  },
  {
    id: 2,
    title: '山水画技法精讲',
    image: 'https://ai-public.mastergo.com/ai/img_res/a8796244e51e5c387b31c068d2cbf3a6.jpg',
    teacher: '李老师',
    learners: 1876,
    price: 399
  },
  {
    id: 3,
    title: '篆刻艺术进阶班',
    image: 'https://ai-public.mastergo.com/ai/img_res/dfc5af13a9555ac2072889e0ced01f89.jpg',
    teacher: '张教授',
    learners: 986,
    price: 599
  },
  {
    id: 4,
    title: '茶艺文化精品课',
    image: 'https://ai-public.mastergo.com/ai/img_res/a2508a80d534caec700348cbd8e87cf8.jpg',
    teacher: '陈老师',
    learners: 1234,
    price: 499
  },
  {
    id: 5,
    title: '花鸟画技法提升',
    image: 'https://ai-public.mastergo.com/ai/img_res/85afd0ff2d141d19906f4d18f87e50f5.jpg',
    teacher: '周教授',
    learners: 756,
    price: 459
  },
  {
    id: 6,
    title: '瓷器彩绘艺术',
    image: 'https://ai-public.mastergo.com/ai/img_res/2badff912b7cc6bbcdebe8c832b6d5a6.jpg',
    teacher: '赵大师',
    learners: 543,
    price: 699
  },
  {
    id: 7,
    title: '传统剪纸艺术',
    image: 'https://ai-public.mastergo.com/ai/img_res/0877f52f3b1e6c29ba4677a8a971510e.jpg',
    teacher: '刘老师',
    learners: 432,
    price: 299
  },
  {
    id: 8,
    title: '中国结艺基础班',
    image: 'https://ai-public.mastergo.com/ai/img_res/579489952b4b55ff3232ef1c77668b7a.jpg',
    teacher: '孙老师',
    learners: 321,
    price: 259
  }
])
</script>

<style scoped>
.container {
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
}

.course-card {
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
