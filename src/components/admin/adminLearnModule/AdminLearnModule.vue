<template>
  <div class="main-learning-module">
    <div class="page-header">
      <h1>学习模块管理</h1>
      <el-button type="primary" @click="handleCreateModule">新增模块</el-button>
    </div>

    <!-- 查询条件 -->
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="query.keyword"
            placeholder="搜索关键词"
            @keyup.enter="handleFilter"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="query.level"
            placeholder="选择难度等级"
            clearable
          >
            <el-option label="基础" value="BASIC"></el-option>
            <el-option label="中级" value="INTERMEDIATE"></el-option>
            <el-option label="高级" value="ADVANCED"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="query.review_status"
            placeholder="审核状态"
            clearable
          >
            <el-option label="待审核" value="PENDING"></el-option>
            <el-option label="已通过" value="APPROVED"></el-option>
            <el-option label="已拒绝" value="REJECTED"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 学习模块列表 -->
    <el-table
      :data="modules.items"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      @row-click="handleRowClick"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="title" label="模块名称" min-width="100"></el-table-column>
      <el-table-column prop="description" label="描述" min-width="150"></el-table-column>
      <el-table-column prop="level" label="难度等级" width="60">
        <template #default="scope">
          <span>{{ getLevelText(scope.row.level) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reviewStatus" label="审核状态" width="120">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.review_status)"
            :closable="false">
              {{ getReviewStatusText(scope.row.review_status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" mini-width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEditModule(scope.row)">编辑</el-button>
          <el-button size="small" type="primary" @click="handleManageKnowledge(scope.row)">知识点</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteModule(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <CreateAdminLearn
      v-model="createVisible"
      :formData="createFormData"
      @success="fetchModules"
    />

    <!-- 编辑组件 -->
    <EditAdminLearn
      v-model="editVisible"
      :formData="currentEditModule"
      @success="handleUpdateModule"
    />

    <!-- 知识点管理对话框 -->
    <el-dialog
      v-model="knowledgeDialogVisible"
      title="管理知识点"
      width="800px"
    >
      <div class="knowledge-management">
        <div class="knowledge-selection">
          <h3>可选知识点</h3>
          <el-input
            v-model="knowledgeSearch"
            placeholder="搜索知识点"
            @input="handleKnowledgeSearch"
            clearable
          ></el-input>
          <el-table
            :data="availableKnowledge"
            style="width: 100%; margin-top: 10px;"
            height="300"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="category" label="分类"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleAddKnowledge([scope.row.id])"
                >添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <template #footer>
        <el-button @click="knowledgeDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 分页组件 -->
    <el-pagination
      :total="modules.total"
      :current-page="query.page"
      :page-size="query.limit"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';
import CreateAdminLearn from './form/CreateAdminLearn.vue';
import EditAdminLearn from './form/EditAdminLearn.vue';
import { ElLoading } from 'element-plus'; 
// 查询参数
const query = reactive({
  page: 1,
  limit: 20,
  keyword: '',
  level: null,
  reviewStatus: null,
  isRecommended: null
});

const createVisible = ref(false);
const editVisible = ref(false);
const currentEditModule = ref({}); // 存储当前编辑的数据

// 模块数据
const modules = reactive({
  total: 0,
  items: []
});

const reviewStatusMap = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝'
};

const statusTypeMap = {
  PENDING: 'info',
  APPROVED: 'success',
  REJECTED: 'danger'
};

const createFormData = ref({
  title: '',
  description: '',
  level: 2,
  is_recommended: '',
  author: '',
  cover_image_url: '',
  review_status: '',
  organization_id: 0
});

// 知识点管理相关
const knowledgeDialogVisible = ref(false);
const knowledgeSearch = ref('');
const availableKnowledge = ref([]);
// const currentKnowledge = ref([]);
const currentModuleId = ref(null);

// 生命周期钩子
onMounted(() => {
  fetchModules();
});

// 获取状态文本
const getReviewStatusText = (status) => reviewStatusMap[status] || '未知';

// 获取状态类型（标签颜色）
const getStatusType = (status) => statusTypeMap[status] || 'primary';

// 加载模块列表
const fetchModules = async () => {
  try {
    const response = await request.get('/api/admin/learning_module/', {
      params: {
        skip: (query.page - 1) * query.limit,
        limit: query.limit,
        ...query
      }
    });
    modules.total = response.data.total;
    modules.items = response.data.items;
    modules.items.forEach(item => {
      console.log('模块的审核状态:', item.review_status); 
    });
    console.log('模块列表数据:', modules.items);
  } catch (error) {
    if(error.response.status!==403){
       ElMessage.error('加载模块列表失败');
      console.error(error);
    }
   
  }
};

// 新增模块
const handleCreateModule = () => {
  createVisible.value = true;
};

// 编辑模块
const handleEditModule = (row) => {
  console.log('编辑模块数据:', row);
  editVisible.value = true;
  currentEditModule.value = { ...row }; // 复制选中的行数据
};

// 更新模块
const handleUpdateModule = async (formData) => {
    let loading; 
  try {
      loading = ElLoading.service({
      lock: true,
      text: '更新模块中...',
      background: 'rgba(0, 0, 0, 0.1)',
    });

    await request.put(`/api/admin/learning_module/${formData.id}`, formData);
    loading.close(); // 关闭加载状态
    ElMessage.success('模块更新成功');
    fetchModules();
    editVisible.value = false;
  } catch (error) {
    loading?.close(); // 确保错误发生时也关闭加载状态
    ElMessage.error('更新失败: ' + error.message);
  }
};

// 删除模块
const handleDeleteModule = async (id) => {
  console.log('进入删除函数，ID:', id);
  
  const confirmMessage = '此操作将永久删除该学习模块，删除后无法恢复。\n是否确认继续？';
  
  try {
    const action = await ElMessageBox.confirm(
      confirmMessage,
      '删除警告',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }
    );

    if (action !== 'confirm') {
      return ElMessage.info('删除已取消');
    }

    await request.delete(`/api/admin/learning_module/${id}`);
    ElMessage.success('学习模块删除成功');
    fetchModules();
  } catch (error) {
    ElMessage.error(`删除失败：${error.message || '服务器请求失败，请重试'}`);
    console.error('删除操作详细错误:', error);
  }
};

// 筛选数据
const handleFilter = () => {
  query.page = 1;
  fetchModules();
};

// 重置筛选条件
const resetFilter = () => {
  Object.assign(query, {
    page: 1,
    keyword: '',
    level: null,
    reviewStatus: null,
    isRecommended: null
  });
  fetchModules();
};

// 分页大小变化
const handlePageSizeChange = (size) => {
  query.limit = size;
  fetchModules();
};

// 页码变化
const handlePageChange = (page) => {
  query.page = page;
  fetchModules();
};

// 难度等级文本映射
const getLevelText = (level) => {
  return {
    BASIC: '基础',
    INTERMEDIATE: '中级',
    ADVANCED: '高级'
  }[level] || '未知';
};

// 定义缺失的方法（避免警告）
const tableRowClassName = () => '';
const handleRowClick = (row) => {
  console.log('点击行:', row);
};

// 打开知识点管理对话框
const handleManageKnowledge = async (row) => {
  currentModuleId.value = row.id;
  knowledgeDialogVisible.value = true;
  await fetchAvailableKnowledge();
};

// 获取可用知识点列表
const fetchAvailableKnowledge = async () => {
  try {
    const response = await request.get('/api/admin/knowledge/');
    availableKnowledge.value = response.data;
  } catch (error) {
    ElMessage.error('获取知识点列表失败');
  }
};



// 添加知识点
const handleAddKnowledge = async (knowledgeIds) => {
  try {
    await request.post(`/api/admin/learning_module/${currentModuleId.value}/add_knowledge`, {
      knowledge_ids: knowledgeIds
    });
    ElMessage.success('添加知识点成功');
    await fetchAvailableKnowledge();
  } catch (error) {
    ElMessage.error('添加知识点失败');
  }
};

// // 移除知识点
// const handleRemoveKnowledge = async (knowledgeIds) => {
//   try {
//     await request.post(`/api/admin/learning_module/${currentModuleId.value}/remove_knowledge`, {
//       knowledge_ids: knowledgeIds
//     });
//     ElMessage.success('移除知识点成功');
//     await fetchAvailableKnowledge();
//   } catch (error) {
//     ElMessage.error('移除知识点失败');
//   }
// };

// 搜索知识点
const handleKnowledgeSearch = () => {
  if (knowledgeSearch.value) {
    availableKnowledge.value = availableKnowledge.value.filter(item =>
      item.title.toLowerCase().includes(knowledgeSearch.value.toLowerCase())
    );
  } else {
    fetchAvailableKnowledge();
  }
};
</script>

<style scoped>
.main-learning-module {
  margin-left: 256px;
  padding: 20px;
  min-height: calc(100vh - 64px);
  background-color: #f5f7fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

.el-table {
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-pagination {
  margin-top: 30px;
  text-align: right;
}

.el-tag {
  margin-right: 5px;
}

.knowledge-management {
  padding: 20px;
}

.knowledge-selection {
  margin-bottom: 20px;
}

.knowledge-selection h3,
.current-knowledge h3 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}
</style>