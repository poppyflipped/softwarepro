<template>
  <div class="quiz-page">
    <h2>📝 测评题目</h2>

    <div v-for="item in quizItems" :key="item.id" class="quiz-item">
      <p>{{ item.question }} ({{ item.points }}分)</p>

      <!-- 单选 / 判断题 -->
      <div v-if="item.type === 'SINGLE' || item.type === 'TRUE_FALSE'">
        <label v-for="option in item.options" :key="option.id">
          <input
            type="radio"
            :name="'quiz_' + item.id"
            :value="option.id"
            v-model="userAnswers[item.id]"
          />
          {{ option.content }}
        </label>
      </div>

      <!-- 多选题 -->
      <div v-else-if="item.type === 'MULTIPLE'">
        <label v-for="option in item.options" :key="option.id">
          <input
            type="checkbox"
            :value="option.id"
            v-model="userAnswers[item.id]"
          />
          {{ option.content }}
        </label>
      </div>

    </div>

    <button @click="submitAnswers">提交测评</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request' // 你的封装axios

// 测评题目
const quizItems = ref([])

// 用户答案
// 单选/判断题：单个id， 多选题：数组
const userAnswers = ref({})

// 获取测评题目
const fetchQuizQuestions = async () => {
  try {
    const res = await request.post('/api/user/quiz/start', {
      source_type: 'web',
      source_id: 123,
      limit: 5
    })
    console.log('测评题目', res.data)
    quizItems.value = res.data

    // 初始化答案结构
    res.data.forEach(item => {
      if (item.type === 'MULTIPLE') {
        userAnswers.value[item.id] = []
      } else {
        userAnswers.value[item.id] = null
      }
    })

  } catch (error) {
    console.error('获取测评题目失败', error)
  }
}

// 提交答案
const submitAnswers = async () => {
  // 构造提交数据
  const answers = quizItems.value.map(item => {
    const answer = userAnswers.value[item.id]
    let optionIds = []

    if (item.type === 'SINGLE' || item.type === 'TRUE_FALSE') {
      optionIds = answer !== null ? [answer] : []
    } else if (item.type === 'MULTIPLE') {
      optionIds = answer
    }

    return {
      quiz_id: item.id,
      option_ids: optionIds,
      duration: 0 // 暂时写0，后续可加计时功能
    }
  })

  console.log('准备提交的数据：', answers)

  // 调接口提交
  try {
    const res = await request.post('/api/user/quiz_record/submit', {
      source_type: 'web',
      source_id: 123,
      answers
    })

    console.log('提交成功！', res.data)
    alert('提交成功！')

  } catch (error) {
    console.error('提交测评失败', error)
  }
}

// 页面加载时拉题目
onMounted(() => {
  fetchQuizQuestions()
})
</script>

<style scoped>
.quiz-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.quiz-item {
  margin-bottom: 20px;
}
</style>
