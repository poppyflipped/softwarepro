<template>
    <div class="quiz-template-management">
        <!-- 标题和创建按钮 -->
        <div class="page-header">
            <h2 class="page-title">测评报告模板管理</h2>
            <el-button type="primary" @click="showCreateDialog">创建模板</el-button>
        </div>

        <!-- 模板列表 -->
        <el-table
            :data="templates"
            :loading="loading"
            border
            fit
            highlight-current-row
            stripe
        >
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="模板名称" width="180" />
            <el-table-column prop="code" label="模板代码" width="180" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="is_active" label="状态" width="100">
                <template #default="scope">
                    <el-tag :type="scope.row.is_active ? 'success' : 'info'">
                        {{ scope.row.is_active ? '启用' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="180">
                <template #default="scope">
                    {{ formatDateTime(scope.row.create_time) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                    <el-button type="primary" link @click="showEditDialog(scope.row)">编辑</el-button>
                    <el-button type="danger" link @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top: 15px; text-align: right"
        />

        <!-- 创建/编辑对话框 -->
        <el-dialog
            v-model="dialogVisible"
            :title="isEdit ? '编辑模板' : '创建模板'"
            width="600px"
        >
            <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="100px"
            >
                <el-form-item label="模板名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入模板名称" />
                </el-form-item>
                <el-form-item label="模板代码" prop="code" v-if="!isEdit">
                    <el-input v-model="formData.code" placeholder="请输入模板代码" />
                </el-form-item>
                <el-form-item label="类型" prop="type" v-if="!isEdit">
                    <el-select v-model="formData.type" placeholder="请选择类型">
                        <el-option label="模块" value="MODULE" />
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input
                        v-model="formData.description"
                        type="textarea"
                        rows="3"
                        placeholder="请输入模板描述"
                    />
                </el-form-item>
                <el-form-item label="模板内容" prop="content">
                    <el-input
                        v-model="formData.content"
                        type="textarea"
                        rows="10"
                        placeholder="请输入模板内容"
                    />
                </el-form-item>
                <el-form-item label="状态" prop="is_active" v-if="isEdit">
                    <el-switch v-model="formData.is_active" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';

// 状态变量
const loading = ref(false);
const templates = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref(null);

// 表单数据
const formData = ref({
    name: '',
    code: '',
    type: 'MODULE',
    content: '',
    description: '',
    is_active: true
});

// 表单验证规则
const formRules = {
    name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入模板代码', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    content: [{ required: true, message: '请输入模板内容', trigger: 'blur' }],
    description: [{ required: true, message: '请输入模板描述', trigger: 'blur' }]
};

// 格式化日期时间
const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
};

// 加载模板列表
const loadTemplates = async () => {
    try {
        loading.value = true;
        const params = {
            skip: (currentPage.value - 1) * pageSize.value,
            limit: pageSize.value,
        };
        const { data, headers } = await request.get('/api/admin/quiz_template/', { params });
        templates.value = data;
        total.value = Number(headers['x-total-count']) || data.length;
    } catch (error) {
        if(error.response.status!==403){
            ElMessage.error('加载模板列表失败：' + error.message);
            console.error('加载失败:', error);
        }
    } finally {
        loading.value = false;
    }
};

// 显示创建对话框
const showCreateDialog = () => {
    isEdit.value = false;
    formData.value = {
        name: '',
        code: '',
        type: 'MODULE',
        content: '',
        description: '',
        is_active: true
    };
    dialogVisible.value = true;
};

// 显示编辑对话框
const showEditDialog = async (row) => {
    try {
        const { data } = await request.get(`/api/admin/quiz_template/${row.id}`);
        isEdit.value = true;
        formData.value = { ...data };
        dialogVisible.value = true;
    } catch (error) {
        ElMessage.error('加载模板详情失败：' + error.message);
    }
};

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return;
    
    await formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                if (isEdit.value) {
                    await request.put(`/api/admin/quiz_template/${formData.value.id}`, formData.value);
                    ElMessage.success('更新成功');
                } else {
                    await request.post('/api/admin/quiz_template/', formData.value);
                    ElMessage.success('创建成功');
                }
                dialogVisible.value = false;
                loadTemplates();
            } catch (error) {
                ElMessage.error(isEdit.value ? '更新失败' : '创建失败');
            }
        }
    });
};

// 删除模板
const handleDelete = async (id) => {
    try {
        await ElMessageBox.confirm('确定要删除这个模板吗？', '提示', {
            type: 'warning'
        });
        await request.delete(`/api/admin/quiz_template/${id}`);
        ElMessage.success('删除成功');
        loadTemplates();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败：' + error.message);
        }
    }
};

// 分页处理
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1;
    loadTemplates();
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    loadTemplates();
};

// 组件挂载时加载数据
onMounted(() => {
    loadTemplates();
});
</script>

<style scoped>
.quiz-template-management {
    margin-left: 256px;
    padding: 24px;
    background-color: #fff;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.page-title {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
}

:deep(.el-tag) {
    width: 60px;
    text-align: center;
}
</style> 