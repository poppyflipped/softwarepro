<template>
  <div>
  <main class="max-w-[1440px] mx-auto px-8 pt-8">
    <!-- 测评分类 -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-8">测评分类</h2>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="(assessment, index) in assessments" :key="index" class="assessment-card bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div class="mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <i :class="assessment.iconClass + ' text-primary text-xl'"></i>
          </div>
          <h3 class="text-lg font-bold mb-2">{{ assessment.title }}</h3>
          <p class="text-sm text-gray-500 mb-4">{{ assessment.description }}</p>
          <div class="flex items-center text-sm text-gray-400">
            <span class="flex items-center"><i class="far fa-clock mr-1"></i>{{ assessment.time }}</span>
            <span class="flex items-center ml-4"><i class="far fa-file-alt mr-1"></i>{{ assessment.questions }}题</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 个人测评数据 -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-8">个人测评数据</h2>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="(data, index) in personalData" :key="index" class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div class="text-3xl font-bold text-primary mb-2">{{ data.value }}</div>
          <div class="text-sm text-gray-500">{{ data.label }}</div>
        </div>
      </div>
    </section>

    <!-- 推荐测评 -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold">推荐测评</h2>
        <button class="text-primary hover:text-primary/80">查看全部<i class="fas fa-angle-right ml-2"></i></button>
      </div>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="(recommendation, index) in recommendations" :key="index" class="assessment-card bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="h-40 bg-gray-100">
            <img :src="recommendation.image" :alt="recommendation.title" class="w-full h-full object-cover">
          </div>
          <div class="p-4">
            <h3 class="font-bold mb-2">{{ recommendation.title }}</h3>
            <div class="flex items-center justify-between text-sm mb-3">
              <span class="text-primary bg-primary/10 px-2 py-1 rounded">{{ recommendation.level }}</span>
              <span class="text-gray-400">{{ recommendation.participants }} 人参与</span>
            </div>
            <button class="w-full bg-primary text-white py-2 rounded-button hover:bg-primary/90">开始测评</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 历史测评记录 -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-8">历史测评记录</h2>
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">测评名称</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">完成时间</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">得分</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">正确率</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(record, index) in historyRecords" :key="index">
              <td class="px-6 py-4 text-sm text-gray-900">{{ record.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ record.time }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ record.score }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ record.accuracy }}%</td>
              <td class="px-6 py-4 text-sm">
                <button class="text-primary hover:text-primary/80">查看详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/userRequest'


// 测评题目数据
const quizItems = ref([])

// 获取测评题目的方法
const fetchQuizQuestions = async () => {
  try {
    const res = await request.get('/api/user/quiz/1')
    console.log("测评题目", res.data)
    quizItems.value = res.data
  } catch (error) {
    console.error('获取测评题目失败', error)
  }
}

// 页面加载时调用
onMounted(() => {
  fetchQuizQuestions()
})
</script>


<style scoped>
  .assessment-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

</style>
