<template>
  <div>
    <h2 class="title">📖 答题记录</h2>

    <div v-if="records.length === 0">暂无记录</div>

    <div v-else>
      <div 
        v-for="record in records" 
        :key="record.id" 
        class="record-card" 
        @click="goToDetail(record.id)"
      >
        <div>答题时间：{{ formatTime(record.submit_time) }}</div>
        <div>得分：{{ record.score }} 分</div>
        <div>正确率：{{ record.correct_rate }}%</div>
        <div>用时：{{ record.duration }} 秒</div>
      </div>
    </div>

    <!-- 答题详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="答题记录详情"
      width="600px"
    >
      <div v-if="recordDetail">
        <p><strong>记录 ID：</strong>{{ recordDetail.id }}</p>
        <p><strong>来源类型：</strong>{{ recordDetail.source_type }}</p>
        <p><strong>来源 ID：</strong>{{ recordDetail.source_id }}</p>
        <p><strong>得分：</strong>{{ recordDetail.score }} 分</p>
        <p><strong>正确率：</strong>{{ recordDetail.correct_rate }}%</p>
        <p><strong>提交时间：</strong>{{ formatTime(recordDetail.submit_time) }}</p>

        <el-divider></el-divider>
        <h4>答题情况：</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(answer, index) in recordDetail.answers"
            :key="index"
            :color="answer.is_correct ? '#67C23A' : '#F56C6C'"
          >
            题目 ID：{{ answer.quiz_id }} |
            答案：{{ answer.option_ids.join(', ') }} |
            {{ answer.is_correct ? '✔️ 正确' : '❌ 错误' }}
          </el-timeline-item>
        </el-timeline>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const records = ref([])
const recordDetail = ref(null)
const dialogVisible = ref(false)

const fetchRecords = async () => {
  try {
    const res = await request.get('/api/user/quiz_record/')
    records.value = res.data
  } catch (error) {
    console.error('获取答题记录失败', error)
  }
}

const goToDetail = async (id) => {
  try {
    const res = await request.get(`/api/user/quiz_record/${id}`)
    recordDetail.value = res.data
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取答题记录详情失败')
  }
}

const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleString()
}

onMounted(() => {
  fetchRecords()
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
  cursor: pointer;
  transition: all 0.2s;
}
.record-card:hover {
  background: #fdf2f2;
  border-color: #B91C1C;
}
</style>
