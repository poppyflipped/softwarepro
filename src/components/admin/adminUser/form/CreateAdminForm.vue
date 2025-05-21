<template>
    <el-dialog v-model="visible" title="创建管理员" width="500px" @close="handleClose" >
        <el-form :model="localFormData" label-width="100px" :rules="formRules">
        <el-form-item label="姓名"><el-input v-model="localFormData.name" /></el-form-item>
        <el-form-item label="用户名"><el-input v-model="localFormData.username" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="localFormData.password" show-password /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="localFormData.phone" /></el-form-item>
        <el-form-item label="性别">
            <el-select v-model="localFormData.sex">
            <el-option label="男" value="MALE" />
            <el-option label="女" value="FEMALE" />
            </el-select>
        </el-form-item>
        <el-form-item label="身份证号"><el-input v-model="localFormData.id_number" /></el-form-item>
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
        <el-form-item label="组织ID"><el-input-number v-model.number="localFormData.organization_id" :min="1" /></el-form-item>
        </el-form>
        <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from 'vue'
// import { ElMessage } from 'element-plus'
import request from '@/utils/request'


const formRules = reactive({
    name: [
        { required: true, message: "请输入姓名", trigger: "blur" },
        { min: 2, max: 10, message: "长度在 2-10 位", trigger: "blur" },
    ],
    username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 20, message: "长度在 3-20 位", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 16, message: "密码长度6-16位", trigger: "blur" },
    ],
    phone: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
    ],
    id_number: [
        { required: true, message: "请输入身份证号", trigger: "blur" },
        { pattern: /^\d{17}[\dXx]$/, message: "身份证号格式不正确", trigger: "blur" },
    ],
    role_id: [{ required: true, message: "请选择角色ID", trigger: "change" }],
    organization_id: [{ required: true, message: "请选择组织ID", trigger: "change" }],
});
const props = defineProps({
    modelValue: Boolean
})

const roleOptions = ref([
    { label: '超级管理员', value: 1 },
    { label: '普通管理员', value: 2 },
    { label: '内容审核员', value: 3 },
]);
const emit = defineEmits(['update:modelValue', 'success', 'close'])

const visible = ref(false)

const localFormData = reactive({
    name: '',
    username: '',
    password: '',
    phone: '',
    sex: '',
    id_number: '',
    role_id: 1,
    organization_id: 1
})

const resetForm = () => {
    Object.assign(localFormData, {
        name: '',
        username: '',
        password: '',
        phone: '',
        sex: 'MALE',
        id_number: '',
        role_id: 1,
        organization_id: 1
    })
}

watch(() => props.modelValue, (val) => {
    visible.value = val
    if (val) resetForm()
})

const handleClose = () => {
    emit('update:modelValue', false)
    emit('close')
}
const submit = async () => {
    console.log("请求参数:", localFormData); // 打印请求体
    try {

        const response = await request.post("/api/admin/manage", localFormData, {
        headers: {
            'Content-Type': 'application/json',
        },
        });
        handleClose();
        console.log("响应内容:", response.data); // 打印响应数据
    } catch (error) {
        console.log("完整错误对象:", error); // 包含 response、status、message 等属性
        // 上报日志（可选）
        await reportError(error);
    }
};
</script>
