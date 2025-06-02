<template>
  <div>
    <h2 class="title">❌ 错题本</h2>

    <div v-if="mistakes.length === 0">暂无错题</div>

    <div v-else>
      <div 
        v-for="mistake in mistakes" 
        :key="mistake.id" 
        class="record-card"
      >
        <div>题目ID：{{ mistake.quiz_id }}</div>
        <div>知识点ID：{{ mistake.knowledge_id }}</div>
        <div>错误次数：{{ mistake.wrong_count }}</div>
        <div>最后出错时间：{{ formatTime(mistake.last_wrong_time) }}</div>

        <div class="btn-group">
          <el-button size="small" type="danger" @click="deleteMistake(mistake.id)">删除</el-button>
          <el-button size="small" @click="viewDetail(mistake.id)">详情</el-button>
        </div>
      </div>
    </div>

    <!-- 错题详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="错题详情"
      width="500px"
    >
      <div v-if="mistakeDetail">
        <p><strong>题目ID：</strong>{{ mistakeDetail.quiz_id }}</p>
        <p><strong>知识点ID：</strong>{{ mistakeDetail.knowledge_id }}</p>
        <p><strong>错误次数：</strong>{{ mistakeDetail.wrong_count }}</p>
        <p><strong>最后出错时间：</strong>{{ formatTime(mistakeDetail.last_wrong_time) }}</p>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/userRequest'
import { ElMessage, ElMessageBox } from 'element-plus'

const mistakes = ref([])
const mistakeDetail = ref(null)
const dialogVisible = ref(false)

const fetchMistakes = async () => {
  try {
    const res = await request.get('/api/user/quiz_mistake/')
    mistakes.value = res.data
  } catch (error) {
    ElMessage.error('获取错题本失败')
  }
}

const viewDetail = async (id) => {
  try {
    const res = await request.get(`/api/user/quiz_mistake/${id}`)
    mistakeDetail.value = res.data
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取错题详情失败')
  }
}

const deleteMistake = (id) => {
  ElMessageBox.confirm('确认要删除这道错题吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await request.delete(`/api/user/quiz_mistake/${id}`)
      ElMessage.success('删除成功')
      fetchMistakes() // 重新刷新列表
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleString()
}

onMounted(() => {
  fetchMistakes()
})
</script>

<style scoped>
.title {
  color: #B91C1C;
  font-size: 22px;
  margin-bottom: 20px;
}

.record-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s;
}
.record-card:hover {
  background: #fdf2f2;
  border-color: #B91C1C;
}

.btn-group {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
