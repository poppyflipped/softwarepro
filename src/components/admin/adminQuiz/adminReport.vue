<template>
    <div class="report-management">
        <!-- 筛选区域 -->
        <div class="filter-section">
            <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                <el-form-item label="用户ID">
                    <el-input v-model="filterForm.user_id" placeholder="用户 ID" />
                </el-form-item>
                <el-form-item label="来源类型">
                    <el-select v-model="filterForm.source_type" placeholder="选择来源类型" clearable>
                        <el-option label="知识点" value="KNOWLEDGE" />
                        <el-option label="模块" value="MODULE" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadReports">查询</el-button>
                    <el-button @click="resetFilter">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 报告列表 -->
        <el-table
        :data="reports"
        :loading="loading"
        border
        fit
        highlight-current-row
        stripe
        style="width: 100%; min-width: 900px" 
        >
        <el-table-column prop="id" label="ID" /> 
        <el-table-column prop="user_id" label="用户ID" /> 
        <el-table-column prop="source_type" label="来源类型">
            <template #default="{ row }">
                {{ row.source_type === 'KNOWLEDGE' ? '知识点' : '模块' }}
            </template>
        </el-table-column>
        <el-table-column prop="source_id" label="来源ID" /> 
        <el-table-column prop="total_score" label="总分" />
        <el-table-column prop="correct_count" label="正确数" /> 
        <el-table-column prop="total_time" label="用时(秒)" /> 
        <el-table-column prop="created_time" label="创建时间">
            <template #default="{ row }">
                {{ dayjs(row.created_time).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right"> 
            <template #default="scope">
                <el-button type="text" size="small" @click="showReportDetail(scope.row)">查看详情</el-button>
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
            v-model="detailVisible"
            title="报告详情"
            width="800px"
        >
            <div v-if="currentReport" class="report-detail">
                <div class="detail-item">
                    <span class="label">用户ID：</span>
                    <span>{{ currentReport.user_id }}</span>
                </div>
                <div class="detail-item">
                    <span class="label">来源类型：</span>
                    <span>{{ currentReport.source_type === 'KNOWLEDGE' ? '知识点' : '模块' }}</span>
                </div>
                <div class="detail-item">
                    <span class="label">来源ID：</span>
                    <span>{{ currentReport.source_id }}</span>
                </div>
                <div class="detail-item">
                    <span class="label">总分：</span>
                    <span>{{ currentReport.total_score }}</span>
                </div>
                <div class="detail-item">
                    <span class="label">正确题数：</span>
                    <span>{{ currentReport.correct_count }}</span>
                </div>
                <div class="detail-item">
                    <span class="label">总用时：</span>
                    <span>{{ currentReport.total_time }} 秒</span>
                </div>
                <div class="detail-item">
                    <span class="label">题目ID列表：</span>
                    <span>{{ currentReport.quiz_ids.join(', ') }}</span>
                </div>
                <div class="detail-item">
                    <span class="label">建议：</span>
                    <div class="suggestion">{{ currentReport.suggestion }}</div>
                </div>
                <div class="detail-item">
                    <span class="label">报告内容：</span>
                    <div class="rendered-content" v-html="currentReport.rendered_content"></div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';

// 状态管理
const loading = ref(false);
const reports = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const detailVisible = ref(false);
const currentReport = ref(null);

// 筛选表单数据
const filterForm = reactive({
    user_id: null,
    source_type: null,
});

// 获取报告列表
const loadReports = async () => {
    try {
        loading.value = true;
        const params = {
            skip: (currentPage.value - 1) * pageSize.value,
            limit: pageSize.value,
            ...filterForm,
        };
        const { data, headers } = await request.get('/api/admin/quiz_report/', { params });
        reports.value = data;
        total.value = Number(headers['x-total-count']) || data.length;
    } catch (error) {
        if(error.response.status!==403){
            ElMessage.error('加载报告列表失败：' + error.message);
            console.error('请求失败:', error);
        }
    } finally {
        loading.value = false;
    }
};

// 获取报告详情
const getReportDetail = async (id) => {
    try {
        const { data } = await request.get(`/api/admin/quiz_report/${id}/`);
        currentReport.value = data;
        detailVisible.value = true;
    } catch (error) {
        
        ElMessage.error('获取报告详情失败：' + error.message);
        console.error('获取详情失败:', error);
    }
};

// 显示报告详情
const showReportDetail = (report) => {
    getReportDetail(report.id);
};

// 分页处理
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1;
    loadReports();
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    loadReports();
};

// 重置筛选条件
const resetFilter = () => {
    Object.keys(filterForm).forEach(key => {
        filterForm[key] = null;
    });
    loadReports();
};

onMounted(() => {
    loadReports();
});
</script>

<style scoped>
.report-management {
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

.report-detail {
    padding: 20px;
}

.detail-item {
    margin-bottom: 16px;
}

.detail-item .label {
    font-weight: bold;
    margin-right: 8px;
    color: #606266;
}

.suggestion {
    margin-top: 8px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    white-space: pre-wrap;
}

.rendered-content {
    margin-top: 8px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
}
</style> 