<template>
    <el-dialog
        v-model="visible"
        title="编辑学习模块"
        width="600px"
        @close="handleDialogClose"
    >
        <el-form 
            :model="formState" 
            :rules="formRules" 
            ref="formRef" 
            label-width="120px"
        >
            <!-- 模块名称 -->
            <el-form-item label="模块名称" prop="title">
            <el-input 
                v-model="formState.title" 
                placeholder="请输入模块名称" 
                required
            />
            </el-form-item>

            <!-- 描述 -->
            <el-form-item label="描述" prop="description">
            <el-input 
                v-model="formState.description" 
                type="textarea" 
                :rows="4" 
                placeholder="请输入模块描述"
            />
            </el-form-item>

            <!-- 封面图片URL -->
            <el-form-item label="封面图片" prop="cover_image_url">
                <div class="upload-container">
                    <el-upload
                        class="image-uploader"
                        :show-file-list="false"
                        :before-upload="beforeImageUpload"
                        :http-request="customUpload"
                    >
                        <img
                            v-if="formState.cover_image_url"
                            :src="formState.cover_image_url"
                            class="preview-image"
                        />
                        <el-icon v-else class="upload-icon"><Plus /></el-icon>
                    </el-upload>
                    <div class="upload-tip">点击上传封面图片</div>
                </div>
            </el-form-item>

            <!-- 推荐状态 -->
            <el-form-item label="推荐状态" prop="is_recommended">
            <el-switch 
                v-model="formState.is_recommended" 
                active-text="是" 
                inactive-text="否"
            />
            </el-form-item>

            <!-- 难度等级 -->
            <el-form-item label="难度等级" prop="level">
            <el-select 
                v-model="formState.level" 
                placeholder="请选择难度等级" 
                clearable
                required
            >
                <el-option label="基础" value="BASIC" />
                <el-option label="中级" value="INTERMEDIATE" />
                <el-option label="高级" value="ADVANCED" />
            </el-select>
            </el-form-item>

            <!-- 作者 -->
            <el-form-item label="作者" prop="author">
            <el-input 
                v-model="formState.author" 
                placeholder="请输入作者"
            />
            </el-form-item>

            <!-- 审核状态 -->
            <el-form-item label="审核状态" prop="review_status">
            <el-select 
                v-model="formState.review_status" 
                placeholder="请选择审核状态" 
                clearable
            >
                <el-option label="待审核" value="PENDING" />
                <el-option label="已通过" value="APPROVED" />
                <el-option label="已拒绝" value="REJECTED" />
            </el-select>
            </el-form-item>

            <!-- 所属机构ID -->
            <el-form-item label="所属机构" prop="organization_id">
            <el-input 
                v-model.number="formState.organization_id" 
                placeholder="请输入机构ID"
            />
            </el-form-item>
        </el-form>

        <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button 
            type="primary" 
            @click="handleSubmit"
        >
            保存
        </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch,defineEmits ,defineProps } from 'vue';
import { ElMessage, ElForm } from 'element-plus';
import { computed } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import request from '@/utils/request';

// 接收父组件传递的 props
const props = defineProps(['modelValue', 'formData']);
const emit = defineEmits(['update:modelValue','success']);
const visible = computed({
  get() { return props.modelValue }, // 读取父组件的 modelValue
  set(value) { emit('update:modelValue', value); } // 同步父组件的 modelValue
});


const formState = reactive({
    title: '',
    description: '',
    cover_image_url: '',
    is_recommended: false,
    level: 'BASIC',
    author: '',
    review_status: 'PENDING',
    organization_id: null,
    ...props.formData, 
});


// 表单验证规则
const formRules = reactive({
    title: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
    level: [{ required: true, message: '请选择难度等级', trigger: 'change' }]
})

// 表单引用
const formRef = ref();

watch(() => props.formData, (newData) => {
  if (newData) {
    Object.assign(formState, newData); 
  }
}, { deep: true });

// 关闭对话框
const handleDialogClose = () => {
  emit('update:modelValue', false); // 更新父组件的 visible 状态
//   formRef.value?.resetFields(); // 重置表单
};

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return;

    await formRef.value.validate((valid) => {
        if (valid) {
        emit('success', formState); // 触发成功事件，传递本地数据
        emit('update:modelValue', false); // 关闭对话框
        formRef.value.resetFields(); // 重置表单
        } else {
        ElMessage.error('请检查表单填写是否正确');
        }
    });
};

// 图片上传前的验证
const beforeImageUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
        ElMessage.error('只能上传图片文件!');
        return false;
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!');
        return false;
    }
    return true;
};

// 自定义上传方法
const customUpload = async (options) => {
    try {
        const formData = new FormData();
        formData.append('file', options.file);
        
        const response = await request.post('/api/admin/upload/cover?folder=module_cover', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data && response.data.url) {
            formState.cover_image_url = response.data.url;
            ElMessage.success('图片上传成功');
        }
    } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('图片上传失败');
    }
};
</script>

<style scoped>
.upload-container {
    text-align: center;
}

.image-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    display: inline-block;
}

.image-uploader:hover {
    border-color: #409EFF;
}

.upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-image {
    width: 178px;
    height: 178px;
    object-fit: cover;
}

.upload-tip {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
}
</style>