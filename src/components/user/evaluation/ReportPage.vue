<template>
  <div>
    <h2 class="title">📊 测评报告</h2>

    <div v-if="reports.length === 0">暂无报告</div>

    <div v-else>
      <div 
        v-for="report in reports" 
        :key="report.id" 
        class="record-card" 
        @click="goToDetail(report.id)"
      >
        <div>生成时间：{{ formatTime(report.created_time) }}</div>
        <div>得分：{{ report.total_score }} 分</div>
        <div>正确答题数：{{ report.correct_count }}</div>
        <div>用时：{{ report.total_time }} 秒</div>
      </div>
    </div>

    <!-- 报告详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="测评报告详情"
      width="600px"
    >
      <div v-if="reportDetail">
        <p><strong>来源类型：</strong>{{ reportDetail.source_type }}</p>
        <p><strong>来源 ID：</strong>{{ reportDetail.source_id }}</p>
        <p><strong>总分：</strong>{{ reportDetail.total_score }} 分</p>
        <p><strong>答对题目数：</strong>{{ reportDetail.correct_count }}</p>
        <p><strong>用时：</strong>{{ reportDetail.total_time }} 秒</p>
        <p><strong>建议：</strong>{{ reportDetail.suggestion }}</p>
        
        <el-divider></el-divider>
        <h4>报告内容：</h4>
        <div v-html="reportDetail.rendered_content"></div>
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

const reports = ref([])
const reportDetail = ref(null)
const dialogVisible = ref(false)

const fetchReports = async () => {
  try {
    const res = await request.get('/api/user/quiz_report/')
    reports.value = res.data
  } catch (error) {
    ElMessage.error('获取测评报告失败')
  }
}

const goToDetail = async (id) => {
  try {
    const res = await request.get(`/api/user/quiz_report/${id}`)
    reportDetail.value = res.data
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取测评报告详情失败')
  }
}

const formatTime = (timeStr) => {
  return new Date(timeStr).toLocaleString()
}

onMounted(() => {
  fetchReports()
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
