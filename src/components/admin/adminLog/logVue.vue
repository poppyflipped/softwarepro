<template>
  <div class="log-container">
    <!-- Search Form -->
    <el-form :model="searchForm" inline class="search-form">
      <el-form-item label="管理员ID">
        <el-input v-model="searchForm.admin_user_id" placeholder="请输入管理员ID" clearable />
      </el-form-item>
      <el-form-item label="操作类型">
        <el-select v-model="searchForm.action_type" placeholder="请选择操作类型" clearable>
          <el-option
            v-for="type in actionTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable />
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DDTHH:mm:ss.SSSZ"
          @change="handleTimeRangeChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
        <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
      </el-form-item>
    </el-form>

    <!-- Data Table -->
    <el-table
      v-loading="loading"
      :data="logList"
      border
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="admin_user_id" label="管理员ID" width="100" />
      <el-table-column prop="action_type" label="操作类型" width="120">
        <template #default="{ row }">
          <el-tag :type="getActionTypeTag(row.action_type)">
            {{ getActionTypeLabel(row.action_type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="target_type" label="目标类型" width="120">
        <template #default="{ row }">
          <el-tag>{{ row.target_type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="target_id" label="目标ID" width="100" />
      <el-table-column prop="ip_address" label="IP地址" width="140" />
      <el-table-column prop="create_time" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="viewDetails(row)">查看</el-button>
          <el-button type="text" class="delete-btn" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- Details Dialog -->
    <el-dialog
      v-model="detailsVisible"
      title="日志详情"
      width="600px"
    >
      <div v-if="currentLog" class="log-details">
        <div class="detail-item">
          <span class="label">ID:</span>
          <span>{{ currentLog.id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">管理员ID:</span>
          <span>{{ currentLog.admin_user_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">操作类型:</span>
          <el-tag :type="getActionTypeTag(currentLog.action_type)">
            {{ getActionTypeLabel(currentLog.action_type) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">目标类型:</span>
          <el-tag>{{ currentLog.target_type }}</el-tag>
        </div>
        <div class="detail-item">
          <span class="label">目标ID:</span>
          <span>{{ currentLog.target_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">IP地址:</span>
          <span>{{ currentLog.ip_address }}</span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间:</span>
          <span>{{ formatDateTime(currentLog.create_time) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">详细信息:</span>
          <pre>{{ JSON.stringify(currentLog.details, null, 2) }}</pre>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import dayjs from 'dayjs'

// Constants
const actionTypes = [
  { value: 'CREATE', label: '创建' },
  { value: 'UPDATE', label: '更新' },
  { value: 'DELETE', label: '删除' },
  { value: 'VIEW', label: '查看' },
  { value: 'UPLOAD', label: '上传' },
  { value: 'REVIEW', label: '审核' },
  { value: 'LOGIN', label: '登录' },
  { value: 'CLEAR_CACHE', label: '清除缓存' },
  { value: 'BULK_OPERATION', label: '批量操作' },
  { value: 'ADJUST_POINTS', label: '调整积分' },
  { value: 'REFRESH_PERMISSION', label: '刷新权限' },
  { value: 'OTHER', label: '其他' }
]

// Data
const loading = ref(false)
const logList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const timeRange = ref([])
const detailsVisible = ref(false)
const currentLog = ref(null)

const searchForm = reactive({
  admin_user_id: '',
  action_type: '',
  keyword: '',
  start_time: '',
  end_time: ''
})

// Methods
const handleTimeRangeChange = (val) => {
  if (val) {
    searchForm.start_time = val[0]
    searchForm.end_time = val[1]
  } else {
    searchForm.start_time = ''
    searchForm.end_time = ''
  }
}

const fetchLogs = async () => {
  try {
    loading.value = true
    const params = {
      skip: (currentPage.value - 1) * pageSize.value,
      limit: pageSize.value,
      ...searchForm
    }
    
    const response = await axios.get('/api/admin/system_log/', { params })
    logList.value = response.data.items
    total.value = response.data.total
  } catch (error) {
    ElMessage.error('获取日志列表失败')
    console.error('Error fetching logs:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchLogs()
}

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  timeRange.value = []
  currentPage.value = 1
  fetchLogs()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchLogs()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchLogs()
}

const viewDetails = async (row) => {
  try {
    const response = await axios.get(`/api/admin/system_log/${row.id}`)
    currentLog.value = response.data
    detailsVisible.value = true
  } catch (error) {
    ElMessage.error('获取日志详情失败')
    console.error('Error fetching log details:', error)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该日志记录吗？', '提示', {
      type: 'warning'
    })
    
    await axios.delete(`/api/admin/system_log/${row.id}`)
    ElMessage.success('删除成功')
    fetchLogs()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('Error deleting log:', error)
    }
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      '确认删除符合当前筛选条件的所有日志记录吗？此操作不可恢复！',
      '警告',
      {
        type: 'warning',
        confirmButtonText: '确定删除',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    const params = {
      admin_user_id: searchForm.admin_user_id || undefined,
      action_type: searchForm.action_type || undefined
    }
    
    await axios.delete('/api/admin/system_log/', { params })
    ElMessage.success('批量删除成功')
    fetchLogs()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('Error batch deleting logs:', error)
    }
  }
}

const getActionTypeTag = (type) => {
  const tagMap = {
    CREATE: 'success',
    UPDATE: 'warning',
    DELETE: 'danger',
    VIEW: 'info',
    UPLOAD: 'success',
    REVIEW: 'warning',
    LOGIN: 'info',
    CLEAR_CACHE: 'warning',
    BULK_OPERATION: 'warning',
    ADJUST_POINTS: 'warning',
    REFRESH_PERMISSION: 'warning',
    OTHER: 'info'
  }
  return tagMap[type] || 'info'
}

const getActionTypeLabel = (type) => {
  const found = actionTypes.find(t => t.value === type)
  return found ? found.label : type
}

const formatDateTime = (datetime) => {
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
}

// Lifecycle
onMounted(() => {
  fetchLogs()
})
</script>

<style scoped>
.log-container {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  color: #f56c6c;
}

.log-details {
  padding: 10px;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-item .label {
  font-weight: bold;
  margin-right: 10px;
  color: #606266;
}

.detail-item pre {
  margin: 10px 0;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
