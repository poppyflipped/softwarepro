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
            v-model="query.createTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          ></el-date-picker>
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="query.keyword"
            placeholder="搜索操作人/模块"
            @keyup.enter="handleFilter"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 日志列表 -->
    <el-table
      :data="logs.items"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      @row-click="handleRowClick"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="200">
        <template #default="scope">
          <span>{{ formatDate(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
      <el-table-column prop="module" label="操作模块" width="180"></el-table-column>
      <el-table-column prop="action" label="操作类型" width="120">
        <template #default="scope">
          <el-tag :type="getActionType(scope.row.action)">{{ scope.row.action }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="操作描述" min-width="300"></el-table-column>
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
  </div>
</template>

<script setup>
import { ref, reactive,watch, onMounted } from 'vue';
import { ElMessage, ElTableColumn } from 'element-plus';
import request from '@/utils/request'; // 管理端请求实例

// 查询参数
const query = reactive({
  page: 1,
  limit: 20,
  keyword: '',
  create_time_start: null,
  create_time_end: null,
});

// 日志数据
const logs = reactive({
  total: 0,
  items: []
});

onMounted(() => {
    fetchLogs();
});
// 日期范围处理
const createTimeRange = ref(null);
watch(createTimeRange, (newVal) => {
  if (newVal && newVal.length === 2) {
    query.create_time_start = newVal[0];
    query.create_time_end = newVal[1];
  } else {
    query.create_time_start = null;
    query.create_time_end = null;
  }
}, { immediate: true });

// 加载日志列表
const fetchLogs = async () => {
  try {
    const params = {
      skip: (query.page - 1) * query.limit,
      limit: query.limit,
      ...query
    };
    const response = await request.get('/api/admin/system_log', { params });
    logs.total = response.data.total;
    logs.items = response.data.items.map(item => ({
      ...item,
      create_time: new Date(item.create_time)
    }));
  } catch (error) {
    
        ElMessage.error('加载日志失败');
        console.error(error);
   
  }
};

// 筛选日志
const handleFilter = () => {
  query.page = 1;
  fetchLogs();
};

// 重置筛选条件
const resetFilter = () => {
  Object.assign(query, {
    page: 1,
    keyword: '',
    create_time_start: null,
    create_time_end: null,
  });
  createTimeRange.value = null;
  fetchLogs();
};

// 分页处理
const handlePageSizeChange = (size) => {
  query.limit = size;
  fetchLogs();
};

const handlePageChange = (page) => {
  query.page = page;
  fetchLogs();
};

// 格式化时间
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString();
};

// 操作类型标签样式
const getActionType = (action) => {
  const typeMap = {
    CREATE: 'success',
    UPDATE: 'warning',
    DELETE: 'danger',
    LOGIN: 'info'
  };
  return typeMap[action] || 'primary';
};



// 行点击事件
const handleRowClick = (row) => {
  console.log('查看日志详情:', row);
};

// 表格行样式
const tableRowClassName = ({ row }) => {
  if (row.action === 'DELETE') return 'warning-row';
  return '';
};
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
  background-color: #fff9eb !important;
}
</style>