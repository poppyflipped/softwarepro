<template>
  <div class="quiz-page">
    <h2 class="title">📝 测评题目</h2>

    <div v-for="item in quizItems" :key="item.id" class="quiz-item">
      <div class="quiz-header">
        <span class="quiz-title">{{ item.question }}</span>
        <span class="quiz-points">({{ item.points }}分)</span>
      </div>

      <!-- 单选 / 判断题 -->
      <div v-if="item.type === 'SINGLE' || item.type === 'TRUE_FALSE'" class="option-list">
        <label v-for="option in item.options" :key="option.id" class="option-item">
          <input
            type="radio"
            :name="'quiz_' + item.id"
            :value="option.id"
            v-model="userAnswers[item.id]"
            @change="recordDuration(item.id)"
          />
          <span>{{ option.content }}</span>
        </label>
      </div>

      <!-- 多选题 -->
      <div v-else-if="item.type === 'MULTIPLE'" class="option-list">
        <label v-for="option in item.options" :key="option.id" class="option-item">
          <input
            type="checkbox"
            :value="option.id"
            v-model="userAnswers[item.id]"
            @change="recordDuration(item.id)"
          />
          <span>{{ option.content }}</span>
        </label>
      </div>
    </div>

    <button class="submit-btn" @click="submitAnswers">📤 提交测评</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

// 测评题目
const quizItems = ref([])

// 用户答案
const userAnswers = ref({})

// 每题开始答题的时间戳
const startTimes = ref({})

// 每题用时（单位：秒）
const durations = ref({})

// 获取测评题目
const fetchQuizQuestions = async () => {
  try {
    const res = await request.post('/api/user/quiz/start', {
      source_type: 'web',
      source_id: 123,
      limit: 5
    })
    quizItems.value = res.data

    // 初始化答案和时间结构
    res.data.forEach(item => {
      if (item.type === 'MULTIPLE') {
        userAnswers.value[item.id] = []
      } else {
        userAnswers.value[item.id] = null
      }
      startTimes.value[item.id] = Date.now() // 每题开始时间
      durations.value[item.id] = 0
    })
  } catch (error) {
    console.error('获取测评题目失败', error)
  }
}

// 记录答题用时（每次选择算一次）
const recordDuration = (quizId) => {
  const now = Date.now()
  const duration = Math.floor((now - startTimes.value[quizId]) / 1000) // 秒
  durations.value[quizId] = duration
}

// 提交答案
const submitAnswers = async () => {
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
      duration: durations.value[item.id]
    }
  })

  try {
    const res = await request.post('/api/user/quiz_record/submit', {
      source_type: 'web',
      source_id: 123,
      answers
    })

    console.log('提交成功', res.data)
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
  max-width: 820px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  color: #B91C1C;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
}

.quiz-item {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  margin-bottom: 20px;
  background: #fff7f7;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.quiz-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.quiz-points {
  color: #B91C1C;
  font-size: 14px;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.option-item input {
  cursor: pointer;
}

.submit-btn {
  display: block;
  margin: 30px auto 0;
  padding: 12px 32px;
  background-color: #B91C1C;
  color: #fff;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.submit-btn:hover {
  background-color: #a31616;
}
</style>
