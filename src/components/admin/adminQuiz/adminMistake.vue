<template>
    <div class="mistake-management">
        <!-- 筛选区域 -->
        <div class="filter-section">
            <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                <el-form-item label="用户ID">
                    <el-input v-model="filterForm.user_id" placeholder="用户 ID" />
                </el-form-item>
                <el-form-item label="知识点">
                    <el-input v-model="filterForm.knowledge_id" placeholder="知识点 ID" />
                </el-form-item>
                <el-form-item label="题目ID">
                    <el-input v-model="filterForm.quiz_id" placeholder="题目 ID" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadMistakes">查询</el-button>
                    <el-button @click="resetFilter">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 错题列表 -->
        <el-table
            :data="mistakes"
            :loading="loading"
            border
            fit
            highlight-current-row
            stripe
            style="width: 100%; min-width: 800px" 
        >
            <el-table-column prop="id" label="ID"  />
            <el-table-column prop="user_id" label="用户ID"  />
            <el-table-column prop="quiz_id" label="题目ID"/>
            <el-table-column prop="knowledge_id" label="知识点ID" />
            <el-table-column prop="wrong_count" label="错误次数"  />
            <el-table-column prop="last_wrong_time" label="最后错误时间" >
                <template #default="scope">
                    {{ formatDateTime(scope.row.last_wrong_time) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template #default="scope">
                    <div class="button-group" style="display: flex; gap: 8px; align-items: flex-start;">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="handleDeleteMistake(scope.row.id)"
                        >
                            删除记录
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="handleDeleteUserMistakes(scope.row.user_id)"
                        >
                            删除用户所有记录
                        </el-button>
                    </div>
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
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';

// 状态管理
const loading = ref(false);
const mistakes = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

// 筛选表单数据
const filterForm = reactive({
    user_id: null,
    knowledge_id: null,
    quiz_id: null,
});

// 格式化日期时间
const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
};

// 获取错题列表
const loadMistakes = async () => {
    try {
        loading.value = true;
        const params = {
            skip: (currentPage.value - 1) * pageSize.value,
            limit: pageSize.value,
            ...filterForm,
        };
        const { data, headers } = await request.get('/api/admin/quiz_mistake/', { params });
        mistakes.value = data;
        total.value = Number(headers['x-total-count']) || data.length;
    } catch (error) {
        ElMessage.error('加载错题列表失败');
        console.error('请求失败:', error);
    } finally {
        loading.value = false;
    }
};

// 删除单个错题记录
const handleDeleteMistake = (mistakeId) => {
    ElMessageBox.confirm(
        '确定要删除这条错题记录吗？删除后不可恢复',
        '警告',
        {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        try {
            await request.delete(`/api/admin/quiz_mistake/${mistakeId}/`);
            ElMessage.success('错题记录删除成功');
            loadMistakes();
        } catch (error) {
            ElMessage.error('删除失败：' + error.message);
        }
    }).catch(() => {
        ElMessage.info('已取消删除');
    });
};

// 删除用户所有错题记录
const handleDeleteUserMistakes = (userId) => {
    ElMessageBox.confirm(
        '确定要删除该用户的所有错题记录吗？删除后不可恢复',
        '警告',
        {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        try {
            await request.delete(`/api/admin/quiz_mistake/user/${userId}/`);
            ElMessage.success('用户错题记录删除成功');
            loadMistakes();
        } catch (error) {
            ElMessage.error('删除失败：' + error.message);
        }
    }).catch(() => {
        ElMessage.info('已取消删除');
    });
};

// 分页处理
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1;
    loadMistakes();
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    loadMistakes();
};

// 重置筛选条件
const resetFilter = () => {
    Object.keys(filterForm).forEach(key => {
        filterForm[key] = null;
    });
    loadMistakes();
};

onMounted(() => {
    loadMistakes();
});
</script>

<style scoped>
.mistake-management {
    margin-left: 256px;
    padding: 24px;
    background-color: #fff;
}

.filter-section {
    margin-bottom: 24px;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.el-table {
    margin-top: 16px;
}

.el-button + .el-button {
    margin-left: 8px;
}
</style> 