<template>
    <div class="main-content">
        <div class="operation-header">
            <h1>知识管理系统</h1>
            <div class="header-actions">
                <el-button type="primary" @click="handleCreateItem">创建知识条目</el-button>
            </div>
        </div>

        <!-- 知识条目列表 -->
        <div v-if="currentView === 'list'" class="item-list">
            <el-table :data="items" style="width: 100%" @row-click="handleItemClick">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="title" label="标题" min-width="100"></el-table-column>
                <el-table-column prop="category" label="类别" min-width="100"></el-table-column>
                <el-table-column label="状态" min-width="100">
                    <template #default="scope">
                        <span>{{ scope.row.status === 'DRAFT' ? '草稿' : '已发布' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="author" label="作者" min-width="100"></el-table-column>
                <el-table-column label="推荐" min-width="80">
                    <template #default="scope">
                        <el-tag :type="scope.row.is_recommended ? 'success' : 'info'">
                            {{ scope.row.is_recommended ? '是' : '否' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200">
                    <template #default="scope">
                        <el-button size="small" @click="handleSpeficItem(scope.row.id)">查看详情</el-button>
                        <el-button size="small" @click="handleEditItem(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDeleteItem(scope.row.id)">删除</el-button>
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
                    <el-input type="textarea" v-model="formData.content" rows="4"></el-input>
                </el-form-item>
                <el-form-item label="摘要" prop="summary">
                    <el-input type="textarea" v-model="formData.summary" rows="2"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="formData.author"></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="category">
                    <el-select v-model="formData.category" placeholder="请选择类别">
                        <el-option label="诗歌" value="POETRY"></el-option>
                        <el-option label="节日" value="FESTIVAL"></el-option>
                        <el-option label="习俗" value="CUSTOM"></el-option>
                        <el-option label="人物" value="FIGURE"></el-option>
                        <el-option label="技艺" value="CRAFT"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出处" prop="source">
                    <el-input v-model="formData.source"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="formData.status">
                        <el-option label="草稿" value="DRAFT"></el-option>
                        <el-option label="已发布" value="PUBLISHED"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签" prop="tags">
                    <el-select 
                        v-model="formData.tags" 
                        multiple 
                        filterable 
                        allow-create 
                        default-first-option
                        placeholder="请选择或输入标签"
                        @create="handleTagCreate"
                    >
                        <el-option
                            v-for="tag in tagOptions"
                            :key="tag"
                            :label="tag"
                            :value="tag"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间" prop="publish_time">
                    <el-date-picker v-model="formData.publish_time" type="datetime" placeholder="选择发布时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="是否推荐" prop="is_recommended">
                    <el-switch v-model="formData.is_recommended"></el-switch>
                </el-form-item>
            </el-form>

            <!-- 媒体上传模块 -->
            <div class="media-upload">
                <h3>上传媒体资源</h3>
                <el-upload 
                    class="upload-demo" 
                    :action="`http://1.15.229.186/api/admin/knowledge/${formData.id}/upload`"
                    :data="{ type: 'IMAGE' }" 
                    :on-success="handleMediaUploadSuccess" 
                    :on-error="handleUploadError" 
                    :before-upload="beforeUpload"
                    :disabled="!formData.id || uploadLoading"
                    :headers="headers"
                    multiple
                    :auto-upload="true" 
                    ref="uploadRef" 
                    >
                    <el-button 
                        size="small" 
                        type="primary" 
                        :disabled="!formData.id || uploadLoading"
                    >
                        {{ formData.id ? '点击上传' : '请先保存知识条目' }}
                    </el-button>
                </el-upload>
                <div class="upload-list">
                    <div v-for="(media, index) in formData.media" :key="index" class="media-item">
                        <el-image :src="media.url" :preview-src-list="[media.url]"></el-image>
                        <div class="media-actions">
                            <el-button type="text" @click="handleSetCover(media)" v-if="media.type === 'IMAGE'">
                                {{ formData.cover_image_url === media.url ? '当前封面' : '设为封面' }}
                            </el-button>
                            <el-button type="text" @click="handleDeleteMedia(media.id)">删除</el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 按钮组 -->
            <div class="form-actions">
                <el-button @click="handleCancelForm">取消</el-button>
                <el-button type="primary" @click="handleSubmitForm">
                    {{ formData.id ? '更新' : '创建' }}
                </el-button>
            </div>
        </div>

        <!-- 详情视图 -->
        <div v-if="currentView === 'detail'" class="item-detail">
            <div class="detail-header">
                <h2>{{ detailItem.title }}</h2>
                <div class="detail-actions">
                    <el-button v-if="detailItem.status === 'DRAFT'" type="success" @click="handleReviewItem">发布</el-button>
                    <el-button type="danger" @click="handleDeleteDetailItem">删除</el-button>
                    <el-button type="plain" @click="handleCancelForm">返回</el-button>
                </div>
            </div>

            <div class="detail-content">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="类别">{{ detailItem.category }}</el-descriptions-item>
                    <el-descriptions-item label="状态">{{ detailItem.status === 'DRAFT' ? '草稿' : '已发布' }}</el-descriptions-item>
                    <el-descriptions-item label="作者">{{ detailItem.author }}</el-descriptions-item>
                    <el-descriptions-item label="出处">{{ detailItem.source }}</el-descriptions-item>
                    <el-descriptions-item label="发布时间">{{ detailItem.publish_time }}</el-descriptions-item>
                    <el-descriptions-item label="是否推荐">{{ detailItem.is_recommended ? '是' : '否' }}</el-descriptions-item>
                    <el-descriptions-item label="标签" :span="2">
                        <el-tag v-for="tag in detailItem.tags" :key="tag" style="margin-right: 5px">{{ tag }}</el-tag>
                    </el-descriptions-item>
                </el-descriptions>

                <div class="detail-text">
                    <h3>摘要</h3>
                    <p>{{ detailItem.summary }}</p>
                    <h3>内容详情</h3>
                    <p>{{ detailItem.content }}</p>
                </div>

                <div class="media-preview">
                    <h3>媒体资源</h3>
                    <div class="media-list">
                      <div 
                        v-for="media in detailItem.media" 
                        :key="media.id" 
                        class="media-item1"
                      >
                        <!-- 媒体容器包裹图片/视频 -->
                        <div class="media-container1">
                          <el-image 
                            :src="media.url" 
                            :preview-src-list="[media.url]"
                            class="media-content1"
                          ></el-image>
                        </div>
                        <div class="media-info">
                   
                          <el-tag size="small" v-if="detailItem.cover_image_url === media.url">封面图</el-tag>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, reactive, onMounted,computed  } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/utils/request';

export default {
    setup() {
        const uploadRef = ref(null); // 添加在 setup 顶部
        const selectedMediaType = ref('IMAGE');
        const uploadLoading = ref(false);
        const uploadProgress = ref(0);

         // 请求头（携带Token）
        const headers = computed(() => {
            const token = localStorage.getItem('admin_token');
            if (!token) return {}; // 无 token 时不发送认证头
            return {
                Authorization: `Bearer ${token}`
            };
        });
        // 视图状态
        const currentView = ref('list');

        // 表格数据
        const items = ref([]);
        const isDataLoaded = ref(false); // 数据加载标记
        
        // 标签选项
        const tagOptions = ref([]);

        // 表单相关
        const formRef = ref(null);
        const formData = reactive({
            id: null,
            title: '',
            content: '',
            author: '',
            status: 'DRAFT',
            category: 'POETRY',
            source: '',
            cover_image_url: '',
            tags: [],
            summary: '',
            publish_time: '',
            is_recommended: false,
            media: []
        });
        const detailItem = ref({
            id: null,
            title: '',
            content: '',
            category: 'POETRY',
            status: 'DRAFT',
            author: '',
            source: '',
            cover_image_url: '',
            tags: [],
            summary: '',
            publish_time: '',
            is_recommended: false,
            create_time: '',
            update_time: '',
            media: []
        });
        const formRules = reactive({
            title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
            content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
        });

        // 获取所有已使用的标签
        const fetchTags = () => {
            const uniqueTags = new Set();
            items.value.forEach(item => {
                if (item.tags && Array.isArray(item.tags)) {
                    item.tags.forEach(tag => uniqueTags.add(tag));
                }
            });
            tagOptions.value = Array.from(uniqueTags);
        };
        // 获取数据
        const fetchItems = async (forceRefresh = false) => {
            if (!forceRefresh && isDataLoaded.value) return;

            try {
                const response = await request.get('/api/admin/knowledge/');
                items.value = response.data;
                isDataLoaded.value = true;
                // 获取标签
                fetchTags();
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
            // 确保有标签选项可选
            fetchTags();
        };


        const handleMediaUpload = async () => {
            if (!formData.id) {
                ElMessage.warning('请先保存知识条目');
                return;
            }

            const files = uploadRef.value?.files;
            if (!files || files.length === 0) {
                ElMessage.warning('请选择要上传的文件');
                return;
            }
        };

        const handleDeleteDetailItem = () => {
            handleDeleteItem(detailItem.value.id);
            currentView.value = 'list';
        };
        // 编辑知识条目（直接从本地items读取数据，不调用后端）
        const handleEditItem = async (itemId) => {
            currentView.value = 'form';
            const item = items.value.find(item => item.id === itemId);
            
            if (item) {
                // 使用本地数据填充表单
                Object.assign(formData, {
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    status: item.status,
                    category: item.category,
                    source: item.source,
                    author: item.author,
                    cover_image_url: item.cover_image_url,
                    tags: item.tags || [],
                    summary: item.summary,
                    publish_time: item.publish_time,
                    is_recommended: item.is_recommended
                });

                // 获取媒体资源列表
                formData.media = await fetchItemMedia(item.id);
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

        // 设置封面图
        const handleSetCover = (media) => {
            if (media.type === 'IMAGE') {
                formData.cover_image_url = media.url;
            }
        };

        // 删除媒体资源
        const handleDeleteMedia = async (mediaId) => {
            try {
                await ElMessageBox.confirm('确定要删除该媒体资源吗？', '警告');
                await request.delete(`/api/admin/knowledge/media/${mediaId}`);
                
                // 更新本地数据
                if (currentView.value === 'form') {
                    formData.media = formData.media.filter(media => media.id !== mediaId);
                    // 如果删除的是封面图，清空封面图URL
                    const deletedMedia = formData.media.find(m => m.id === mediaId);
                    if (deletedMedia && formData.cover_image_url === deletedMedia.url) {
                        formData.cover_image_url = '';
                    }
                } else if (currentView.value === 'detail') {
                    detailItem.value.media = detailItem.value.media.filter(media => media.id !== mediaId);
                }
                
                ElMessage.success('媒体删除成功');
            } catch (error) {
                if (error !== 'cancel') {
                    ElMessage.error('删除失败');
                }
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
            Object.assign(formData, {
                id: null,
                title: '',
                content: '',
                status: 'DRAFT',
                category: 'POETRY',
                source: '',
                author: '',
                cover_image_url: '',
                tags: [],
                summary: '',
                publish_time: '',
                is_recommended: false,
                media: []
            });
        };

        // 媒体上传
        const beforeUpload = (file) => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            
            if (!isImage && !isVideo) {
                ElMessage.error('请上传图片或视频文件');
                return false;
            }

            // 设置上传类型
            selectedMediaType.value = isImage ? 'IMAGE' : 'VIDEO';

            // 限制文件大小（图片10MB，视频100MB）
            const maxSize = isImage ? 10 : 100; // MB
            if (file.size / 1024 / 1024 > maxSize) {
                ElMessage.error(`文件大小不能超过${maxSize}MB`);
                return false;
            }

            return true;
        };

        // 上传进度处理
        const handleUploadProgress = (event) => {
            if (event.total) {
                uploadProgress.value = (event.loaded / event.total) * 100;
            }
        };

        // 上传成功处理
        const handleMediaUploadSuccess = async (response, file) => {
            uploadLoading.value = false;
            uploadProgress.value = 0;

            if (response && response.url) {
                const newMedia = {
                    id: response.id || Date.now(),
                    type: selectedMediaType.value,
                    url: response.url,
                    file_name: file.name
                };
                
                formData.media.push(newMedia);

                // 自动设置封面（仅图片）
                if (selectedMediaType.value === 'IMAGE' && !formData.cover_image_url) {
                    formData.cover_image_url = response.url;
                }

                ElMessage.success(`上传${selectedMediaType.value === 'IMAGE' ? '图片' : '视频'}成功`);
            } else {
                ElMessage.error('上传失败，响应格式不正确');
            }
        };

        // 上传错误处理
        const handleUploadError = (error) => {
            uploadLoading.value = false;
            uploadProgress.value = 0;
            
            let errorMessage = '上传失败';
            if (error.response) {
                if (error.response.status === 422) {
                    errorMessage = '文件验证失败，请检查文件格式和大小';
                } else {
                    errorMessage = error.response.data?.detail || '上传失败，请重试';
                }
            }
            
            ElMessage.error(errorMessage);
            console.error('Upload error:', error);
        };

        // 获取视频预览图（示例逻辑，实际需后端支持）
        const getVideoPoster = (url) => {
        return selectedMediaType.value === 'VIDEO' 
            ? `${url}?t=0.1` // 临时预览图逻辑
            : '';
        };

        // 获取媒体列表
        const fetchItemMedia = async (itemId) => {
            try {
                const response = await request.get(`/api/admin/knowledge/${itemId}/media`);
                return response.data;
            } catch (error) {
                ElMessage.error('获取媒体资源失败');
                return [];
            }
        };

        // 处理新标签创建
        const handleTagCreate = (newTag) => {
            if (newTag && !tagOptions.value.includes(newTag)) {
                tagOptions.value.push(newTag);
            }
        };

        return {
            currentView,
            items,
            formRef,
            formData,
            formRules,
            detailItem,
            tagOptions,
            handleTagCreate,
            handleSpeficItem,
            handleReviewItem,
            handleDeleteDetailItem,
            handleDeleteMedia,
            handleCreateItem,
            handleEditItem,
            handleDeleteItem,
            handleSubmitForm,
            handleCancelForm,
            handleSetCover,
            selectedMediaType,
            uploadLoading,
            uploadProgress,
            headers,
            beforeUpload,
            handleUploadProgress,
            handleMediaUploadSuccess,
            handleUploadError,
            getVideoPoster,
            handleMediaUpload,
            fetchItemMedia, 
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
.media-upload {
    margin-top: 20px;
    padding: 20px;
  }
  
  .mb-3 {
    margin-bottom: 10px;
  }
  
  .progress-bar {
    margin: 10px 0;
    height: 4px;
  }
  
  .media-item {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;
  }
  
  .media-item:hover {
    transform: translateY(-2px);
  }
  
  .media-preview {
    height: auto;
    overflow: hidden;
    position: relative;
  }
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .media-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .media-item:hover .media-actions {
    opacity: 1;
  }
  
  .media-info {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    font-size: 12px;
    color: #666;
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
.item-form,
.item-detail {
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.media-item {
    position: relative;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: hidden;
}

.media-item .el-image {
    width: 100%;
    height: 150px;
    display: block;
}
.media-container1 {
    width: 100%;
    /* 取消固定比例，让内容自动撑开容器 */
  }
  
  .media-content1 {
    width: 100%;
    display: block; /* 让图片/视频成为块级元素 */
  }
  
  .media-item1 {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 200px; /* 设置最小高度防止内容过多时挤压布局 */
  }
.media-actions,
.media-info {
    padding: 8px;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
}

.media-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
}

.media-item:hover .media-actions {
    display: flex;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
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
    padding-top: 20px;
}

.detail-text h3 {
    margin: 20px 0 10px;
    color: #303133;
    font-size: 16px;
}

.detail-text p {
    margin: 0;
    color: #606266;
    line-height: 1.8;
}

.media-preview {
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    background: #f9fafc;
}

.media-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

:deep(.el-descriptions) {
    margin: 20px 0;
}

:deep(.el-descriptions__cell) {
    padding: 12px 20px;
}

</style>