<template>
  <div class="main-adminUser">
    <div class="admin-list-container">
      <div class="mb-4 flex justify-between items-center">
        <h3 class="text-xl font-bold">管理员列表</h3>
        <div class="flex gap-2">
          <el-button 
            type="primary" 
            size="small" 
            @click="disableDialog"
          >
            <i class="el-icon-plus"></i> 禁用管理员
          </el-button>
          <el-button 
            type="primary" 
            size="small" 
            @click="openCreateDialog"
          >
            <i class="el-icon-plus"></i> 添加管理员
          </el-button>
        </div>
      </div>

      <el-table 
        :data="adminList" 
        stripe 
        border 
        size="small"
        @row-click="handleRowClick"
        @sort-change="handleSortChange"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="username" label="用户名" sortable />
        <el-table-column prop="name" label="姓名" sortable />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="sex" label="性别" width="80" />
        <el-table-column :formatter="formatRole" label="角色" width="100" />
        <el-table-column :formatter="formatStatus" label="状态" width="100" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small"
              @click="handleEditAdmin(scope.row)"
            >
              <i class="el-icon-edit"></i> 编辑
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="handleDeleteAdmin(scope.row)"
            >
              <i class="el-icon-delete"></i> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-500">
          共 {{ total }} 条记录
        </div>
        <el-pagination
          background
          layout="prev, pager, next, jumper, sizes"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          :current-page="currentPage"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 创建管理员对话框 -->
      <CreateAdminForm
        v-model="createDialogVisible"
        :formData="createFormData"
        @success="fetchAdmins"
      />

      <DisableAdminForm
        v-model="disableDialogVisible"
        :formData="disableFormData"
        @success="fetchAdmins"
        />

      <!-- 编辑管理员对话框 -->
      <EditAdminForm
        v-model="editDialogVisible"
        :formData="editFormData"
        @success="fetchAdmins"
        @close="editDialogVisible = false"
      />


      <!-- 删除确认对话框 -->
      <el-dialog
        v-if="deleteDialogVisible" 
        title="确认删除"
        width="30%"
        :before-close="handleDeleteClose"
      >
        <template #content>
          <p>确定要删除管理员 {{ deleteAdminName }} 吗？</p>
        </template>
        <template #footer>
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button 
            type="danger" 
            @click="confirmDeleteAdmin"
            :loading="deleteLoading"
          >
            确认删除
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import CreateAdminForm from './form/CreateAdminForm.vue';
import EditAdminForm from './form/EditAdminForm.vue';
import DisableAdminForm from './form/DisableAdminForm.vue'
// 数据状态
const adminList = ref([]);
const total = ref(0);
const currentPage = ref(1);
const limit = ref(20);
const searchQuery = ref('');
const sortField = ref('');
const sortOrder = ref('');
const disableDialogVisible=ref(false);
const createDialogVisible = ref(false);
const editDialogVisible = ref(false);
const createFormData = ref({
  username: '',
  name: '',
  phone: '',
  password:'',
  sex: '男',
  role_id: 2,
  status:'',
  id_number: '',
  organization_id: null
});
const editFormData = ref({});
const deleteDialogVisible = ref(false);
const deleteAdminId = ref(null);
const deleteAdminName = ref('');
const deleteLoading = ref(false);

// 角色选项
const roleOptions = ref([
  { id: 1, name: '超级管理员' },
  { id: 2, name: '普通管理员' },
  { id: 3, name: '内容审核员' }
]);

// 生命周期钩子
onMounted(() => {
    const token = localStorage.getItem('admin_token');
    console.log('mounted 时 admin_token:', token);
    if (token) {
      fetchAdmins();

    } else {
      setTimeout(() => {
          fetchAdmins();
      }, 300);
    }
});

// 行点击事件
const handleRowClick = (row) => {
  console.log('行点击事件:', row);
  // 其他业务逻辑
};

// 获取管理员列表
const fetchAdmins = async () => {
  try {
    const params = {
      skip: (currentPage.value - 1) * limit.value,
      limit: limit.value,
      search: searchQuery.value,
    };

    if (sortField.value) {
      params.sort = sortField.value;
      params.order = sortOrder.value === 'ascending' ? 'asc' : 'desc';
    }

    const { data, headers } = await request.get('/api/admin/manage/', { params });
    adminList.value = data;
    total.value = Number(headers['x-total-count']) || data.length;
  } catch (error) {
    // if(error.response.status===403){
    //   ElMessage.error("您没有使用这项功能的权限");
    // }else{
      if(error.response.status!==403){
      console.error('获取管理员列表失败:', error);
      ElMessage.error('获取管理员列表失败，请重试');
    }
    
  }
};

// 格式化角色显示
const formatRole = (row) => {
  return roleOptions.value.find((r) => r.id === row.role_id)?.name || '未知';
};

// 格式化状态显示
const formatStatus = (row) => {
  console.log(row.status);
  return row.status === 'ENABLED' ? '启用' : '禁用';
};

// 分页相关事件处理
const handleSizeChange = (newSize) => {
  limit.value = newSize;
  currentPage.value = 1;
  fetchAdmins();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchAdmins();
};

// 排序事件处理
const handleSortChange = ({ prop, order }) => {
  sortField.value = prop;
  sortOrder.value = order;
  fetchAdmins();
};

// 打开创建管理员对话框
const openCreateDialog = () => {
  createDialogVisible.value = true;
};

const disableDialog=()=>{
    disableDialogVisible.value = true;
}

// 打开编辑管理员对话框
const handleEditAdmin = (row) => {
  editDialogVisible.value = true;
  editFormData.value = { ...row };
};

// 确认删除管理员
const confirmDeleteAdmin = async () => {
  deleteLoading.value = true;

  try {
    await request.delete(`/api/admin/manage/${deleteAdminId.value}`);
    ElMessage.success('管理员删除成功');
    deleteDialogVisible.value = false;
    fetchAdmins();
  } catch (error) {
    console.error('删除管理员失败:', error);
    ElMessage.error('删除管理员失败，请重试');
  } finally {
    deleteLoading.value = false;
  }
};

// 关闭删除对话框
const handleDeleteClose = () => {
  deleteDialogVisible.value = false;
};
</script>

<style scoped>
.main-adminUser {
  margin-left: 256px; /* 适配侧边栏宽度 */
  margin-top: 20px;
}

.admin-list-container {
  padding: 20px;
  min-height: calc(100vh - 64px); /* 适配头部导航栏 */
}

.el-table .cell {
  padding: 12px 8px;
  font-size: 0.925rem;
}

.el-pagination {
  margin-top: 20px;
  font-size: 0.925rem;
}

.el-dialog {
  z-index: 9999 !important;
}

.el-dialog__header {
  padding: 20px;
}

.el-dialog__body {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 16px;
}

.el-input__inner, .el-select__inner {
  height: 36px;
}
</style>