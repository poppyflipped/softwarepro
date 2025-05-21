<template>
    <div class="main-content">
        <div class="operation-header">
            <h1>知识管理系统</h1>
            <div class="header-actions">
                <el-button type="primary" @click="handleCreateItem">创建知识条目</el-button>
            </div>
        </div>

        <!-- 知识条目列表（使用v-if避免组件销毁） -->
        <div v-if="currentView === 'list'" class="item-list">
            <el-table :data="items" style="width: 100%" @row-click="handleItemClick">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="title" label="标题" min-width="100"></el-table-column>
                <el-table-column prop="category" label="类别" min-width="100"></el-table-column>
                <el-table-column label="状态" min-width="100">
                    <template #default="scope">
                        <span>{{ scope.row.status === 'pending' ? '待审核' : '已发布' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="author" label="作者" min-width="100"></el-table-column>
                <el-table-column label="操作" min-width="200">
                    <template #default="scope">
                        <el-button size="small" @click="handleSpeficItem(scope.row.id)">查看详情</el-button>
                        <el-button size="small" @click="handleEditItem(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDeleteItem(scope.row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 创建/编辑表单 -->
        <div v-if="currentView === 'form'" class="item-form">
            <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formData.title"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" v-model="formData.content"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="formData.author"></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="category">
                    <el-select v-model="formData.category" placeholder="请选择类别">
                        <el-option label="诗歌" value="POETRY"></el-option>
                        <el-option label="散文" value="PROSE"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出处" prop="source">
                    <el-input v-model="formData.source"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="formData.status">
                        <el-option label="待审核" value="pending"></el-option>
                        <el-option label="已发布" value="published"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <!-- 按钮组 -->
            <div class="form-actions">
                <el-form-item>
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 30px;">
                        <el-button @click="handleCancelForm">取消</el-button>
                        <el-button type="primary" @click="handleSubmitForm">
                            {{ formData.id ? '更新' : '创建' }}
                        </el-button>
                    </div>
                </el-form-item>
            </div>

            <!-- 媒体上传模块 -->
            <div class="media-upload">
                <h3>上传媒体资源</h3>
                <el-upload class="upload-demo" :action="`/api/admin/knowledge/${formData.id}/upload`"
                    :data="{ type: 'IMAGE' }" 
                    :on-success="handleMediaUploadSuccess" :on-error="handleUploadError" :before-upload="beforeUpload"
                    multiple>
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <div class="upload-list">
                    <el-image v-for="(media, index) in formData.mediaList" :key="index" :src="media.url"
                        style="margin-right: 10px" :preview-src-list="[media.url]"></el-image>
                </div>
            </div>

            
        </div>


        <div v-if="currentView === 'detail'" class="item-detail">
        <div class="detail-header">
            <h2>{{ detailItem.title }}</h2>
            <div class="detail-actions">
            <el-button v-if="detailItem.status==='pending'" type="success" @click="handleReviewItem">发布</el-button>
            <el-button type="danger" @click="handleDeleteDetailItem">删除</el-button>
            <el-button type="plain" @click="handleCancelForm">返回</el-button>

            </div>
        </div>

        <div class="detail-content">
            <el-row>
            <el-col :span="6">类别：{{ detailItem.category }}</el-col>
            <el-col :span="6">状态：{{ detailItem.status === 'pending' ? '待审核' : '已发布' }}</el-col>
            <el-col :span="6">作者：{{ detailItem.author }}</el-col>
            <el-col :span="6">出处：{{ detailItem.source }}</el-col>
            <el-col :span="6">发布时间：{{detailItem.publicTime}}</el-col>
            </el-row>

            <div class="detail-text">
            <h3>内容详情</h3>
            <p>{{ detailItem.content }}</p>
            </div>

            <div class="media-preview">
            <h3>媒体资源</h3>
            <div class="media-list">
                <el-image
                v-for="media in detailItem.mediaList"
                :key="media.id"
                :src="media.url"
                style="margin-right: 10px"
                :preview-src-list="[media.url]"
                @click="handleDeleteMedia(media.id)"
                ></el-image>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';

export default {
    setup() {
        // 视图状态
        const currentView = ref('list');

        // 表格数据
        const items = ref([]);
        const isDataLoaded = ref(false); // 数据加载标记

        // 表单相关
        const formRef = ref(null);
        const formData = reactive({
            id: null,
            title: '',
            content: '',
            author:'',
            status: 'pending',
            category: 'POETRY',
            source: '',
            mediaList: []
        });
        const detailItem = ref({
            id: null,
            title: '',
            content: '',
            category: 'POETRY',
            status: 'pending',
            author: '',
            source: '',
            publicTime:'',
            mediaList: []
        });
        const formRules = reactive({
            title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
            content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
        });

        // 获取数据
        const fetchItems = async (forceRefresh = false) => {
            if (!forceRefresh && isDataLoaded.value) return; // 避免重复请求

            try {
                const response = await request.get('/api/admin/knowledge/');
                items.value = response.data;
                isDataLoaded.value = true;
                console.log(items);
            } catch (error) {
                if(error.response.status===403){
                    ElMessage.error("您没有使用这项功能的权限");
                }else{
                    ElMessage.error('获取知识列表失败');

                }
            }
        };

        // 生命周期：初始化加载数据
        onMounted(() => {
            fetchItems();
        });

        // 创建/编辑相关
        const handleCreateItem = () => {
            currentView.value = 'form';
            resetForm();
            formRef.value = null; 
        };

        const handleDeleteDetailItem = () => {
            handleDeleteItem(detailItem.value.id);
            currentView.value = 'list';
        };
        // 编辑知识条目（直接从本地items读取数据，不调用后端）
        const handleEditItem = (itemId) => {
            currentView.value = 'form';
            console.log(itemId);
            // 从本地items中查找数据
            const item = items.value.find(item => item.id === itemId);
            
            if (item) {
                // 使用本地数据填充表单
                formData.id = item.id;
                formData.title = item.title;
                formData.content = item.content;
                formData.status = item.status;
                formData.category = item.category;
                formData.source = item.source;
                formData.publicTime=item.publicTime;
                formData.mediaList = item.mediaList || [];
            } else {
                ElMessage.error('知识条目不存在');
            }
        };

        const handleCancelForm = () => {
            // 延迟切换视图，给组件足够的时间完成销毁
            setTimeout(() => {
                currentView.value = 'list';
                resetForm();
            }, 100);
        };  
        const handleSpeficItem=(itemId)=>{
            currentView.value = 'detail';
            const item = items.value.find(item => item.id === itemId);
            
            if (!item) {
                ElMessage.error('知识条目不存在');
                return;
            }

            // 填充详情数据（包括媒体资源）
            detailItem.value = {
                ...item,
                mediaList: item.mediaList || [] // 从本地数据获取媒体列表
            };
            };

            // 审批操作
            const handleReviewItem = async () => {
            if (!detailItem.value.id) return;
            
            try {
                await request.post(`/api/admin/knowledge/${detailItem.value.id}/review`);
                ElMessage.success('审批成功');
                currentView.value = 'list';
                fetchItems(true); // 刷新列表
            } catch (error) {
                ElMessage.error('审批失败');
            }
            };
        // 删除
        const handleDeleteItem = async (itemId) => {
            await ElMessageBox.confirm('确定要删除该知识条目吗？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            });

            try {
                await request.delete(`/api/admin/knowledge/${itemId}`);
                ElMessage.success('删除成功');
                fetchItems(true); // 强制刷新数据
            } catch (error) {
                ElMessage.error('删除失败');
            }
        };

        // 删除媒体资源
        const handleDeleteMedia = async (mediaId) => {
            await ElMessageBox.confirm('确定要删除该媒体资源吗？', '警告');
            
            try {
                await request.delete(`/api/admin/knowledge/media/${mediaId}`);
                ElMessage.success('媒体删除成功');
                detailItem.value.mediaList = detailItem.value.mediaList.filter(
                media => media.id !== mediaId
                );
            } catch (error) {
                ElMessage.error('删除失败');
            }
        };

        // 提交表单
        const handleSubmitForm = async () => {
            if (!formRef.value) return;

            try {
                await formRef.value.validate();
                const response = formData.id
                    ? await request.patch(`/api/admin/knowledge/${formData.id}`, formData)
                    : await request.post('/api/admin/knowledge', formData);
                console.log(response);
                ElMessage.success(formData.id ? '更新成功' : '创建成功');
                currentView.value = 'list';
                fetchItems(true); // 提交后刷新数据
                resetForm();
            } catch (error) {
                ElMessage.error('操作失败');
                console.error(error);
            }
        };

        // 重置表单
        const resetForm = () => {
            formData.id = null;
            formData.title = '';
            formData.content = '';
            formData.status = 'pending';
            formData.category = 'POETRY';
            formData.source = '';
            formData.mediaList = [];
        };

        // 媒体上传
        const beforeUpload = (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                ElMessage.error('只能上传图片资源');
                return false;
            }
            return true;
        };

        const handleMediaUploadSuccess = (response) => {
            formData.mediaList.push({ url: response.url, id: response.id });
        };

        const handleUploadError = () => {
            ElMessage.error('媒体上传失败');
        };

        return {
            currentView,
            items,
            formRef,
            formData,
            formRules,
            detailItem,
            handleSpeficItem,
            handleReviewItem,
            handleDeleteDetailItem,
            handleDeleteMedia,
            handleCreateItem,
            handleEditItem,
            handleDeleteItem,
            handleSubmitForm,
            beforeUpload,
            handleCancelForm,
            handleMediaUploadSuccess,
            handleUploadError
        };
    }
}
</script>

<style scoped>
.main-content {
    margin-left: 256px;
    padding: 20px;
    min-height: calc(100vh - 64px);
}

.operation-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.header-actions {
    display: flex;
    gap: 10px;
}

.item-list,
.item-form {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}

.media-upload {
    margin-top: 30px;
    padding: 20px;
    border: 1px dashed #e4e7ed;
    border-radius: 8px;
    background: #f9fafc;
}

.upload-list {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
}

.el-image {
    width: 150px;
    height: 100px;
    object-fit: cover;
}

.el-table {
    margin-top: 20px;
    border-radius: 8px;
    overflow: hidden;
}
.item-detail {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-actions {
  display: flex;
  gap: 10px;
}

.detail-content {
  line-height: 1.8;
  color: #333;
}

.detail-text {
  margin: 30px 0;
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
}

.media-preview {
  padding: 20px;
  border: 1px dashed #e4e7ed;
  border-radius: 8px;
  margin-top: 30px;
}

.media-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}
</style>