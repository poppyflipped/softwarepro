<template>
    <el-dialog v-model="visible" title="编辑管理员" width="500px" @close="handleClose">
        <el-form :model="role_id" label-width="100px">
        <el-form-item label="角色">
            <el-select 
            v-model="role_id" 
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
        </el-form>
        <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'


const emit = defineEmits(['update:modelValue', 'success', 'close'])

const visible = ref(false)
const role_id=null;
const roleOptions = ref([
    { label: '超级管理员', value: 1 },
    { label: '普通管理员', value: 2 },
    { label: '内容审核员', value: 3 },
]);


const handleClose = () => {
    emit('update:modelValue', false)
    emit('close')
}

const submit = async () => {
    try {
        await request.put(`/api/admin/manage/disable_by_role/${role_id}`)
        ElMessage.success('管理员禁用成功')
        emit('success')
        handleClose()
    } catch (err) {
        ElMessage.error('禁用失败')
    }
}
</script>
