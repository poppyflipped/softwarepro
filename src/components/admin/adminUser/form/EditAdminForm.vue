<template>
    <el-dialog v-model="visible" title="编辑管理员" width="500px" @close="handleClose">
        <el-form :model="localFormData" label-width="100px">
        <el-form-item label="姓名"><el-input v-model="localFormData.name" /></el-form-item>
        <el-form-item label="用户名"><el-input v-model="localFormData.username" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="localFormData.phone" /></el-form-item>
        <el-form-item label="性别">
            <el-select v-model="localFormData.sex">
            <el-option label="男" value="MALE" />
            <el-option label="女" value="FEMALE" />
            </el-select>
        </el-form-item>
        <el-form-item label="身份证号"><el-input v-model="localFormData.id_number" /></el-form-item>
        <el-form-item label="状态">
            <el-select 
            v-model="localFormData.status" 
            placeholder="请选择状态" 
            clearable
            :rules="[
                { required: true, message: 请选择状态, trigger: change },
            ]"
            >
            <el-option 
                v-for="role in statusOptions" 
                :key="role.value" 
                :label="role.label" 
                :value="role.value"
            />
            </el-select>
        </el-form-item>
        <el-form-item label="角色">
            <el-select 
            v-model="localFormData.role_id" 
            placeholder="请选择角色" 
            clearable
            :rules="[
                { required: true, message: 请选择角色, trigger: change },
            ]"
            >
            <el-option 
                v-for="role in roleOptions" 
                :key="role.value" 
                :label="role.label" 
                :value="role.value"
            />
            </el-select>
        </el-form-item>
        <el-form-item label="组织ID"><el-input-number v-model="localFormData.organization_id" :min="1" /></el-form-item>
        </el-form>
        <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const props = defineProps({
    modelValue: Boolean,
    formData: Object
})
const emit = defineEmits(['update:modelValue', 'success', 'close'])

const visible = ref(false)

const localFormData = reactive({
    id: null,
    name: '',
    username: '',
    phone: '',
    sex: '',
    id_number: '',
    status:'ENABLED',
    role_id: 1,
    organization_id: 1
})
const roleOptions = ref([
    { label: '超级管理员', value: 1 },
    { label: '普通管理员', value: 2 },
    { label: '内容审核员', value: 3 },
]);

const statusOptions = ref([
    { label: '启用', value: 'ENABLED' },
    { label: '禁用', value: 'DISABLED' },
]);
watch(() => props.modelValue, (val) => {
    visible.value = val
    if (val && props.formData) {
        Object.assign(localFormData, props.formData)
    }
})

const handleClose = () => {
    emit('update:modelValue', false)
    emit('close')
}

const submit = async () => {
    try {
        await request.put(`/api/admin/manage/${localFormData.id}`, localFormData)
        ElMessage.success('管理员更新成功')
        if (localFormData.id) {
            await request.delete(`/api/admin/permission/cache/${localFormData.id}`);
            // ElMessage.info('权限缓存已清除，下次登录时生效');
        }
        emit('success')
        handleClose()
    } catch (err) {
        ElMessage.error('更新失败')
    }
}
</script>
