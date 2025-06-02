<template>
    <div class="quiz-management">
        <!-- 筛选区域 -->
        <div class="filter-section">
            <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                <el-form-item label="模块">
                    <el-input v-model="filterForm.module_id" placeholder="模块 ID" />
                </el-form-item>
                <el-form-item label="知识点">
                    <el-input v-model="filterForm.knowledge_id" placeholder="知识点 ID" />
                </el-form-item>
                <el-form-item label="题目类型">
                    <el-select v-model="filterForm.type" placeholder="选择题目类型" clearable>
                        <el-option label="单选题" value="SINGLE" />
                        <el-option label="多选题" value="MULTIPLE" />
                        <el-option label="判断题" value="TRUE_FALSE" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadQuizzes">查询</el-button>
                    <el-button @click="resetFilter">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
            <el-button type="primary" @click="showCreateModal">新建题目</el-button>
        </div>

        <!-- 题目列表 -->
        <el-table
            :data="quizzes"
            :loading="loading"
            border
            fit
            highlight-current-row
            stripe
        >
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="type" label="题目类型" width="100" >
                <template #default="scope">
                    {{ typeMap[scope.row.type] || '未知类型' }}
                </template>
            </el-table-column>
            <el-table-column prop="question" label="题目内容" show-overflow-tooltip />
            <el-table-column prop="points" label="分值" width="80" />
            <el-table-column prop="knowledge_id" label="知识点" width="100" />
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
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

        <!-- 创建/编辑模态框 -->
        <el-dialog
            v-model="modalVisible"
            title="新建题目"
            width="800px"
            @close="handleModalCancel"
            @open="handleModalOpen" 
        >
            <!-- 使用 v-if 确保表单在模态框打开后渲染 -->
            <el-form 
                v-if="modalVisible"
                :model="quizForm" 
                :rules="rules" 
                ref="quizFormRef" 
                label-width="100px"
            >
                <el-form-item label="题目类型" prop="type">
                    <el-select v-model="quizForm.type" placeholder="请选择题目类型">
                        <el-option label="单选题" value="SINGLE" />
                        <el-option label="多选题" value="MULTIPLE" />
                        <el-option label="判断题" value="TRUE_FALSE" />
                    </el-select>
                </el-form-item>
                
                <el-form-item label="题目内容" prop="question">
                    <el-input type="textarea" :rows="4" v-model="quizForm.question" placeholder="请输入题目内容" />
                </el-form-item>

                <el-form-item label="分值" prop="points">
                    <el-input-number v-model="quizForm.points" :min="0" placeholder="请输入分值" />
                </el-form-item>

                <el-form-item label="知识点" prop="knowledge_id">
                    <!-- 从 el-input-number 改为 el-input -->
                    <el-input v-model="quizForm.knowledge_id" placeholder="请输入知识点ID" />
                </el-form-item>

                <el-form-item label="选项" prop="options">
                    <div v-for="(option, index) in quizForm.options" :key="index" class="option-item">
                        <el-input
                            v-model="option.content"
                            placeholder="选项内容"
                            style="width: calc(100% - 180px); margin-right: 10px"
                        />
                        <el-checkbox
                            v-model="option.is_correct"
                            style="margin-right: 10px"
                        >
                            正确答案
                        </el-checkbox>
                        <el-button
                            type="danger"
                            size="small"
                            @click="removeOption(index)"
                        >
                            删除
                        </el-button>
                    </div>
                    <el-button 
                        type="dashed" 
                        size="small" 
                        @click="addOption" 
                        style="width: 100%; margin-top: 10px"
                    >
                        <i class="el-icon-plus"></i> 添加选项
                    </el-button>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleModalCancel">取消</el-button>
                    <el-button 
                        type="primary" 
                        @click="handleModalOk"
                    >
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';

// 状态管理
const loading = ref(false);
const quizzes = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const modalVisible = ref(false);
const modalMode = ref('create');
const currentQuizId = ref(null);
const quizFormRef = ref(null); // 表单引用

// 筛选表单数据
const filterForm = reactive({
    module_id: null,
    knowledge_id: null,
    type: null,
});

const typeMap = {
  SINGLE: '单选',
  MULTIPLE: '多选',
  TRUE_FALSE: '判断',
};

// 题目表单数据（初始化选项和知识点ID）
const quizForm = reactive({
    type: 'SINGLE',
    question: '',
    points: 0,
    knowledge_id: 0, // 初始化数字类型
    options: [{ content: '', is_correct: false }], // 默认一个选项
});

// 表单验证规则
const rules = reactive({
    type: [{ required: true, message: '请选择题目类型', trigger: 'change' }],
    question: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
    points: [{ required: true, message: '请输入分值', trigger: 'blur' }],
    knowledge_id: [{ required: true, message: '请输入知识点ID', trigger: 'blur' }],
    options: [
        {
            required: true,
            message: '至少需要一个选项',
            trigger: 'change',
            validator: (rule, value) => value.length > 0,
        },
        {
            validator: (rule, value, callback) => {
                // 获取当前题目类型
                const quizType = quizForm.type;
                const hasEmptyContent = value.some(option => !option.content);
                
                if (hasEmptyContent) {
                    callback(new Error('选项内容不能为空'));
                    return;
                }

                const correctAnswers = value.filter(option => option.is_correct);

                if (quizType === 'SINGLE' && correctAnswers.length !== 1) {
                    callback(new Error('单选题必须有且仅有一个正确答案'));
                } else if (quizType === 'MULTIPLE' && correctAnswers.length === 0) {
                    callback(new Error('多选题至少需要一个正确答案'));
                } else if (quizType === 'BOOLEAN' && value.length !== 2) {
                    callback(new Error('判断题必须有两个选项'));
                } else if (quizType === 'BOOLEAN' && correctAnswers.length !== 1) {
                    callback(new Error('判断题必须有且仅有一个正确答案'));
                } else {
                    callback();
                }
            },
            trigger: 'change',
        },
    ],
});

// 模态框打开时的回调（确保表单渲染完成）
const handleModalOpen = () => {
    nextTick(() => {
        
    });
};

// 获取题目列表
const loadQuizzes = async () => {
    try {
        loading.value = true;
        const params = {
            skip: (currentPage.value - 1) * pageSize.value,
            limit: pageSize.value,
            ...filterForm,
        };
        const { data, headers } = await request.get('/api/admin/quiz/', { params });
        quizzes.value = data;
        total.value = Number(headers['x-total-count']) || data.length;
    } catch (error) {
        if(error.response.status!==403){
            ElMessage.error('加载题目列表失败：' + error.message);
            console.error('请求失败:', error);
        }
    } finally {
        loading.value = false;
    }
};

// 创建题目（包含nextTick和空值校验）
const createQuiz = async () => {
    if (!modalVisible.value) return; // 确保模态框可见
    await nextTick(); // 等待表单渲染完成

    if (!quizFormRef.value) {
        ElMessage.error('表单初始化失败，请重试');
        return;
    }

    try {
        const isValid = await quizFormRef.value.validate();
        if (!isValid) return;

        await request.post('/api/admin/quiz/', quizForm);
        ElMessage.success('题目创建成功');
        loadQuizzes();
        modalVisible.value = false;
    } catch (error) {
        const errorMsg = error.response?.data?.detail?.[0]?.msg || '创建失败，请检查输入';
        ElMessage.error(errorMsg);
        console.error('创建失败:', error);
    }
};

// 更新题目
const updateQuiz = async () => {
    if (!modalVisible.value) return;
    await nextTick();

    if (!quizFormRef.value) {
        ElMessage.error('表单初始化失败，请重试');
        return;
    }

    try {
        const isValid = await quizFormRef.value.validate();
        if (!isValid) return;

        await request.put(`/api/admin/quiz/${currentQuizId.value}/`, quizForm);
        ElMessage.success('题目更新成功');
        loadQuizzes();
        modalVisible.value = false;
    } catch (error) {
        const errorMsg = error.response?.data?.detail?.[0]?.msg || '更新失败，请检查输入';
        ElMessage.error(errorMsg);
        console.error('更新失败:', error);
    }
};

// 删除题目
const deleteQuiz = async (id) => {
    try {
        await request.delete(`/api/admin/quiz/${id}/`);
        ElMessage.success('题目删除成功');
        loadQuizzes();
    } catch (error) {
        ElMessage.error('删除失败：' + error.message);
        console.error('删除失败详细信息:', error);
    }
};

// 分页处理
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1;
    loadQuizzes();
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    loadQuizzes();
};

// 重置筛选条件
const resetFilter = () => {
    Object.keys(filterForm).forEach(key => {
        filterForm[key] = null;
    });
    loadQuizzes();
};

// 监听题目类型变化
const handleTypeChange = () => {
    if (quizForm.type === 'TRUE_FALSE') {
        // 判断题固定为两个选项：是和否
        quizForm.options = [
            { content: '是', is_correct: false },
            { content: '否', is_correct: false }
        ];
    } else if (quizForm.options.length === 0) {
        // 其他题型如果没有选项，添加一个默认选项
        quizForm.options = [{ content: '', is_correct: false }];
    }
};

// 显示创建模态框
const showCreateModal = () => {
    modalMode.value = 'create';
    currentQuizId.value = null;
    Object.assign(quizForm, {
        type: 'SINGLE',
        question: '',
        points: 0,
        knowledge_id: 0,
        options: [{ content: '', is_correct: false }],
    });
    modalVisible.value = true;
};

// 编辑题目
const handleEdit = (record) => {
    modalMode.value = 'edit';
    currentQuizId.value = record.id;
    Object.assign(quizForm, record);
    modalVisible.value = true;
};

// 删除确认
const handleDelete = (id) => {
    ElMessageBox.confirm(
        '确定要删除这道题目吗？删除后不可恢复',
        '警告',
        {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'error',
        }
    ).then(() => {
        deleteQuiz(id);
    }).catch(() => {
        ElMessage.info('已取消删除');
    });
};

// 模态框确定按钮处理
const handleModalOk = () => {
    if (modalMode.value === 'create') {
        createQuiz();
    } else {
        updateQuiz();
    }
};

// 模态框取消按钮处理
const handleModalCancel = () => {
    modalVisible.value = false;
    quizForm.options = []; // 取消时清空选项
};

// 添加选项
const addOption = () => {
    if (quizForm.type === 'TRUE_FALSE') {
        ElMessage.warning('判断题只能有两个选项');
        return;
    }
    quizForm.options.push({
        content: '',
        is_correct: false,
    });
};

// 删除选项
const removeOption = (index) => {
    if (quizForm.type === 'TRUE_FALSE') {
        ElMessage.warning('判断题的选项不能删除');
        return;
    }
    if (quizForm.options.length > 1) {
        quizForm.options.splice(index, 1);
    } else {
        ElMessage.warning('至少需要保留一个选项');
    }
};

// 监听题目类型变化
watch(() => quizForm.type, handleTypeChange);

onMounted(() => {
    loadQuizzes();
});
</script>

<style scoped>
.quiz-management {
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

.action-buttons {
    margin-bottom: 16px;
}
.el-select {
    width: 150px; /* 调整为合适的宽度值 */
}
.el-table {
    margin-top: 16px;
}

.option-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.el-input {
    flex-grow: 1;
}

.el-form-item__error {
    color: #f5222d;
    font-size: 0.9em;
    margin-top: 4px;
}
</style>