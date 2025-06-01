<template>
    <div class="quiz-record-management">
        <!-- 标题 -->
        <h2 class="page-title">答题记录管理</h2>

        <!-- 记录列表 -->
        <el-table
            :data="records"
            :loading="loading"
            border
            fit
            highlight-current-row
            stripe
            style="width: 100%; min-width: 800px" 
        >
            <el-table-column prop="id" label="记录ID" />
            <el-table-column prop="user_id" label="用户ID" />
            <el-table-column prop="source_type" label="来源类型"  />
            <el-table-column prop="source_id" label="来源ID"  />
            <el-table-column prop="score" label="得分" />
            <el-table-column prop="correct_rate" label="正确率" >
                <template #default="scope">
                    {{ (scope.row.correct_rate).toFixed(2) }}%
                </template>
            </el-table-column>
            <el-table-column prop="duration" label="用时(秒)"  />
            <el-table-column prop="submit_time" label="提交时间" >
                <template #default="scope">
                    {{ formatDateTime(scope.row.submit_time) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
                <template #default="scope">
                    <el-button 
                        type="primary" 
                        link
                        @click="showRecordDetail(scope.row.id)"
                    >
                        查看详情
                    </el-button>
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

        <!-- 详情对话框 -->
        <el-dialog
            v-model="detailDialogVisible"
            title="答题记录详情"
            width="800px"
        >
            <div v-if="recordDetail" class="record-detail">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="记录ID">{{ recordDetail.id }}</el-descriptions-item>
                    <el-descriptions-item label="用户ID">{{ recordDetail.user_id }}</el-descriptions-item>
                    <el-descriptions-item label="来源类型">{{ recordDetail.source_type }}</el-descriptions-item>
                    <el-descriptions-item label="来源ID">{{ recordDetail.source_id }}</el-descriptions-item>
                    <el-descriptions-item label="得分">{{ recordDetail.score }}</el-descriptions-item>
                    <el-descriptions-item label="正确率">
                        {{ recordDetail.correct_rate.toFixed(2) }}%
                    </el-descriptions-item>
                    <el-descriptions-item label="用时">{{ recordDetail.duration }}秒</el-descriptions-item>
                    <el-descriptions-item label="提交时间">{{ formatDateTime(recordDetail.submit_time) }}</el-descriptions-item>
                </el-descriptions>

                <div class="answers-section" v-if="recordDetail.answers.length">
                    <h3>答题详情</h3>
                    <el-table :data="recordDetail.answers" border>
                        <el-table-column prop="quiz_id" label="题目ID" width="80" />
                        <el-table-column prop="selected_option_id" label="选择的选项ID" width="120" />
                        <el-table-column prop="is_correct" label="是否正确" width="100">
                            <template #default="scope">
                                <el-tag :type="scope.row.is_correct ? 'success' : 'danger'">
                                    {{ scope.row.is_correct ? '正确' : '错误' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';

// 状态变量
const loading = ref(false);
const records = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const detailDialogVisible = ref(false);
const recordDetail = ref(null);

// 格式化日期时间
const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
};

// 加载记录列表
const loadRecords = async () => {
    try {
        loading.value = true;
        const params = {
            skip: (currentPage.value - 1) * pageSize.value,
            limit: pageSize.value,
        };
        const { data, headers } = await request.get('/api/admin/quiz_record/', { params });
        records.value = data;
        console.log(data);
        total.value = Number(headers['x-total-count']) || data.length;
    } catch (error) {
        ElMessage.error('加载答题记录失败：' + error.message);
        console.error('加载失败:', error);
    } finally {
        loading.value = false;
    }
};

// 查看记录详情
const showRecordDetail = async (recordId) => {
    try {
        const { data } = await request.get(`/api/admin/quiz_record/${recordId}`);
        recordDetail.value = data;
        detailDialogVisible.value = true;
    } catch (error) {
        ElMessage.error('加载记录详情失败：' + error.message);
        console.error('加载详情失败:', error);
    }
};

// 分页处理
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1;
    loadRecords();
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    loadRecords();
};

// 组件挂载时加载数据
onMounted(() => {
    loadRecords();
});
</script>

<style scoped>
.quiz-record-management {
    margin-left: 256px;
    padding: 24px;
    background-color: #fff;
}

.page-title {
    margin-bottom: 24px;
    font-size: 20px;
    font-weight: 500;
}

.record-detail {
    padding: 20px;
}

.answers-section {
    margin-top: 20px;
}

.answers-section h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
}

:deep(.el-descriptions) {
    margin-bottom: 20px;
}

:deep(.el-tag) {
    width: 60px;
    text-align: center;
}
</style> 