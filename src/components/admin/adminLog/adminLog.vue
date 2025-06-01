<template>
  <div class="system-log-page">
    <div class="page-header">
      <h1>系统日志管理</h1>
    </div>

    <!-- 查询条件 -->
    <el-card class="filter-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ssZ"
          ></el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="query.keyword"
            placeholder="搜索操作详情"
            @keyup.enter="handleFilter"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="query.action_type" placeholder="操作类型" clearable>
            <el-option
              v-for="(value, key) in actionMap"
              :key="key"
              :label="value.text"
              :value="key"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="danger" @click="openBatchDeleteDialog" v-permission="['system:log:delete']">
            批量删除
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 日志列表 -->
    <el-table
      :data="logs.items"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="create_time" label="操作时间" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" width="150">
        <template #default="scope">
          {{ scope.row.details?.admin_username || '未知用户' }} (ID: {{ scope.row.admin_user_id }})
        </template>
      </el-table-column>
      <el-table-column label="操作对象" width="180">
        <template #default="scope">
          {{ getTargetType(scope.row.target_type) }} (ID: {{ scope.row.target_id }})
        </template>
      </el-table-column>
      <el-table-column label="操作类型" width="120">
        <template #default="scope">
          <el-tag :type="getActionType(scope.row.action_type)">
            {{ getActionText(scope.row.action_type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作详情" min-width="300">
        <template #default="scope">
          <div>
            <span>操作详情：{{ scope.row.details?.action_detail ?? '无详情信息' }}</span>
            <div v-if="scope.row.action_type === 'UPDATE'">
              更新字段：{{ scope.row.details?.updated_fields?.join('、') ?? '无' }}
            </div>
            <div v-if="scope.row.action_type === 'CREATE'">
              创建内容：{{ JSON.stringify(scope.row.details?.created_data ?? {}, null, 2) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button type="text" @click.stop="handleViewDetail(scope.row)">查看</el-button>
          <el-button type="text" class="delete-btn" @click.stop="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :total="logs.total"
      :current-page="query.page"
      :page-size="query.limit"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>

    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="日志详情"
      width="50%"
      destroy-on-close
    >
      <div v-if="currentLog" class="log-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="操作时间">
            <span class="detail-value">{{ formatDate(currentLog.create_time) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="操作人">
            <span class="detail-value">{{ currentLog.details?.admin_username || '未知用户' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="操作类型">
            <el-tag :type="getActionType(currentLog.action_type)">
              {{ getActionText(currentLog.action_type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作对象">
            <span class="detail-value">{{ getTargetType(currentLog.target_type) }} (ID: {{ currentLog.target_id }})</span>
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">
            <span class="detail-value">{{ currentLog.ip_address || '未记录' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="详细信息" :span="2">
            <pre class="detail-json">{{ JSON.stringify(currentLog.details || {}, null, 2) }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 批量删除条件对话框 -->
    <el-dialog
      v-model="batchDeleteVisible"
      title="批量删除日志"
      width="350px"
      @close="resetBatchForm"
    >
      <el-form :model="batchForm" label-width="100px">
        <el-form-item label="操作类型">
          <el-select
            v-model="batchForm.action_type"
            placeholder="请选择操作类型"
            clearable
          >
            <el-option
              v-for="(item, key) in actionMap"
              :key="key"
              :label="item.text"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="管理员ID">
          <el-input
            v-model.number="batchForm.admin_user_id"
            placeholder="请输入管理员ID"
            type="number"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="batchDeleteVisible = false">取消</el-button>
        <el-button type="danger" @click="handleBatchDelete">确认删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';

// 查询参数
const query = reactive({
  page: 1,
  limit: 20,
  keyword: '',
  start_time: null,
  end_time: null,
  admin_user_id: null,
  action_type: null
});

// 日志数据
const logs = reactive({
  total: 0,
  items: []
});

// 日期范围选择
const dateRange = ref(null);

// 详情对话框
const detailDialogVisible = ref(false);
const currentLog = ref(null);

// 批量删除对话框
const batchDeleteVisible = ref(false);
const batchForm = reactive({
  action_type: null,
  admin_user_id: null
});

// 操作类型映射
const actionMap = {
  CREATE: { text: '创建', type: 'success' },
  UPDATE: { text: '更新', type: 'warning' },
  DELETE: { text: '删除', type: 'danger' },
  VIEW: { text: '查看', type: 'info' },
  UPLOAD: { text: '上传', type: 'primary' },
  REVIEW: { text: '审核', type: 'warning' },
  LOGIN: { text: '登录', type: 'primary' },
  CLEAR_CACHE: { text: '清除缓存', type: 'primary' },
  BULK_OPERATION: { text: '批量操作', type: 'primary' },
  ADJUST_POINTS: { text: '调整积分', type: 'primary' },
  REFRESH_PERMISSION: { text: '刷新权限', type: 'primary' },
  OTHER: { text: '其他', type: 'info' }
};

// 目标类型映射
const targetTypeMap = {
  ADMIN_USER: '管理员',
  ROLE: '角色',
  MODULE: '学习模块',
  PERMISSION: '权限',
  KNOWLEDGE: '知识模块',
  QUIZ: '测评模块',
  MEDIA: '媒体资源',
  USER: '用户',
  OTHER: '其他'
};

onMounted(() => {
  fetchLogs();
});

// 监听日期范围变化
watch(dateRange, (newVal) => {
  if (newVal && newVal.length === 2) {
    query.start_time = newVal[0].toISOString();
    query.end_time = newVal[1].toISOString();
  } else {
    query.start_time = null;
    query.end_time = null;
  }
}, { immediate: true });

// 加载日志列表
const fetchLogs = async () => {
  try {
    const skip = (query.page - 1) * query.limit;
    
    const params = {
      skip,
      limit: query.limit,
      keyword: query.keyword,
      start_time: query.start_time,
      end_time: query.end_time,
      admin_user_id: query.admin_user_id,
      action_type: query.action_type
    };

    // 过滤空值参数
    Object.keys(params).forEach(key => 
      (params[key] === null || params[key] === '') && delete params[key]
    );
    
    const response = await request.get('/api/admin/system_log/', { params });
    
    logs.total = response.data.total;
    logs.items = response.data.items.map(item => ({
      ...item,
      create_time: new Date(item.create_time),
      details: item.details || {}
    }));
  } catch (error) {
    ElMessage.error('加载日志失败');
    console.error('获取日志数据失败:', error);
  }
};

// 筛选日志
const handleFilter = () => {
  query.page = 1; // 重置为第一页
  fetchLogs();
};

// 重置筛选条件
const resetFilter = () => {
  Object.assign(query, {
    page: 1,
    limit: 20,
    keyword: '',
    start_time: null,
    end_time: null,
    admin_user_id: null,
    action_type: null
  });
  dateRange.value = null;
  fetchLogs();
};

// 分页处理
const handlePageSizeChange = (size) => {
  query.limit = size;
  query.page = 1;
  fetchLogs();
};

const handlePageChange = (page) => {
  query.page = page;
  fetchLogs();
};

// 时间格式化
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 获取操作类型标签
const getActionType = (action) => actionMap[action]?.type || 'info';
const getActionText = (action) => actionMap[action]?.text || '未知操作';
const getTargetType = (type) => targetTypeMap[type] || type || '未知对象';

// 查看详情
const handleViewDetail = (row) => {
  currentLog.value = row;
  detailDialogVisible.value = true;
};

// 删除单条日志
const handleDelete = async (row) => {
  try {
    const confirmResult = await ElMessageBox.confirm(
      `确定要删除这条日志吗？\n操作人：${row.details?.admin_username || '未知用户'}\n操作时间：${formatDate(row.create_time)}`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    if (confirmResult === 'confirm') {
      await request.delete(`/api/admin/system_log/${row.id}`);
      ElMessage.success('删除成功');
      fetchLogs();
    }
  } catch (error) {
    if (error.code !== 'cancel') {
      ElMessage.error('删除失败');
      console.error('删除日志失败:', error);
    }
  }
};

// 打开批量删除对话框
const openBatchDeleteDialog = () => {
  resetBatchForm();
  batchDeleteVisible.value = true;
};

// 重置批量删除表单
const resetBatchForm = () => {
  batchForm.action_type = null;
  batchForm.admin_user_id = null;
};

// 处理批量删除
const handleBatchDelete = async () => {
  try {
    // 校验参数
    const params = validateBatchParams();
    if (!params) return;

    // 构建确认消息
    const message = buildConfirmMessage(params);
    
    // 二次确认
    const confirmResult = await ElMessageBox.confirm(
      message,
      '确认批量删除',
      {
        type: 'warning',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger'
      }
    );

    if (confirmResult !== 'confirm') return;

    // 执行批量删除
    await request.delete('/api/admin/system_log/', { params });
    
    ElMessage.success('批量删除成功');
    batchDeleteVisible.value = false;
    fetchLogs(); // 刷新列表
  } catch (error) {
    if (error.code !== 'cancel') {
      ElMessage.error('操作失败：' + (error.response?.data?.detail || '请检查网络'));
      console.error('批量删除错误:', error);
    }
  }
};

// 校验批量删除参数
const validateBatchParams = () => {
  const params = {};

  // 操作类型校验
  if (batchForm.action_type) {
    const validTypes = Object.keys(actionMap);
    if (!validTypes.includes(batchForm.action_type)) {
      ElMessage.error('无效的操作类型');
      return null;
    }
    params.action_type = batchForm.action_type;
  }

  // 管理员ID校验
  if (batchForm.admin_user_id !== null) {
    if (!Number.isInteger(batchForm.admin_user_id) || batchForm.admin_user_id <= 0) {
      ElMessage.error('管理员ID必须为正整数');
      return null;
    }
    params.admin_user_id = batchForm.admin_user_id;
  }

  // 至少需要一个筛选条件
  if (Object.keys(params).length === 0) {
    ElMessage.warning('请至少选择一个筛选条件');
    return null;
  }

  return params;
};

// 构建确认消息
const buildConfirmMessage = (params) => {
  const conditions = [];
  
  if (params.action_type) {
    conditions.push(`操作类型：${actionMap[params.action_type].text}`);
  }
  
  if (params.admin_user_id !== undefined) {
    conditions.push(`管理员ID：${params.admin_user_id}`);
  }
  
  const conditionText = conditions.join('，');
  return `确定要删除符合以下条件的日志吗？\n${conditionText}\n\n此操作不可恢复！`;
};

// 表格行样式
const tableRowClassName = ({ row }) => row.action_type === 'DELETE' ? 'warning-row' : '';
</script>

<style scoped>
.system-log-page {
  margin-left: 256px;
  padding: 20px;
  background-color: #f5f7fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

.el-table {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.el-pagination {
  margin-top: 30px;
  text-align: right;
}

.warning-row {
  background-color: #fff8e6 !important;
}

.el-tag {
  margin-right: 5px;
  font-weight: 500;
}

.delete-btn {
  color: #f56c6c;
}

.log-detail {
  padding: 20px;
}

.detail-value {
  font-weight: 500;
  margin-right: 5px;
}

.detail-json {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 5px;
  white-space: pre-wrap;
  word-break: break-all;
}

.el-descriptions {
  border-collapse: separate;
  border-spacing: 0 10px;
}
</style>