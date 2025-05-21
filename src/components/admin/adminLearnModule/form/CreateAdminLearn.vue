<template>
    <el-dialog v-model="dialogVisible" title="创建学习模块">
        <el-form :model="moduleForm" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="模块标题" prop="title">
                <el-input v-model="moduleForm.title" placeholder="请输入模块标题"></el-input>
            </el-form-item>

            <el-form-item label="模块描述" prop="description">
                <el-input type="textarea" v-model="moduleForm.description" :rows="4" placeholder="请输入模块描述"></el-input>
            </el-form-item>

            <el-form-item label="封面图片URL" prop="cover_image_url">
                <el-input v-model="moduleForm.cover_image_url" placeholder="请输入封面图片URL"></el-input>
            </el-form-item>

            <el-form-item label="难度等级" prop="level">
                <el-radio-group v-model="moduleForm.level">
                    <el-radio value="BASIC">基础</el-radio>
                    <el-radio value="INTERMEDIATE">中级</el-radio>
                    <el-radio value="ADVANCED">高级</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="推荐状态" prop="is_recommended">
                <el-switch v-model="moduleForm.is_recommended" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>

            <el-form-item label="作者" prop="author">
                <el-input v-model="moduleForm.author" placeholder="请输入作者"></el-input>
            </el-form-item>

            <el-form-item label="审核状态" prop="review_status">
                <el-select v-model="moduleForm.review_status" placeholder="请选择审核状态">
                    <el-option label="待审核" value="PENDING"></el-option>
                    <el-option label="已通过" value="APPROVED"></el-option>
                    <el-option label="已拒绝" value="REJECTED"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所属机构" prop="organization_id">
                <el-input v-model.number="moduleForm.organization_id" placeholder="请输入机构ID"></el-input>
            </el-form-item>
        </el-form>

        
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive,defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';

const dialogVisible = ref(false);
const formRef = ref(null);
const emit = defineEmits(['update:modelValue', 'success', 'close'])

// 表单数据
const moduleForm = reactive({
    title: '',
    description: '',
    cover_image_url: '',
    is_recommended: false,
    level: 'BASIC',
    author: '',
    review_status: 'PENDING',
    organization_id: null
});

// 表单验证规则
const rules = reactive({
    title: [
        { required: true, message: '请输入模块标题', trigger: 'blur' },
        { min: 2, max: 50, message: '标题长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    level: [
        { required: true, message: '请选择难度等级', trigger: 'change' }
    ]
});
const handleClose = () => {
    emit('update:modelValue', false)
    emit('close')
}


// 提交表单
const submitForm = async () => {
    if (!formRef.value) return;

    formRef.value.validate(async (valid) => {
        if (!valid) return;

        try {
            // 发送创建请求
            const response = await request.post('/api/admin/learning_module', moduleForm);

            // 处理成功响应
            ElMessage.success('学习模块创建成功');
            dialogVisible.value = false;

            console.log(response);
            // 刷新模块列表（调用之前定义的 fetchModules 函数）
            // fetchModules();
            emit('success');
            handleClose()

        } catch (error) {
            // 处理错误
            if (error.response?.status === 400) {
                // 处理参数验证错误
                const errors = error.response.data.detail;
                if (errors) {
                    ElMessage.error(`参数错误: ${errors.map(e => e.msg).join('; ')}`);
                } else {
                    ElMessage.error('参数格式不正确');
                }
            } else {
                ElMessage.error('创建学习模块失败，请重试');
            }
        }
    });
};
</script>