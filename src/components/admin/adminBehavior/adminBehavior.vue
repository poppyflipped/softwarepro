<template>
<div class="admin-behavior">
    <div class="mb-4 flex justify-between items-center">
        <h3 class="text-xl font-bold">用户行为管理</h3>
    
        <!-- 用户选择 -->
        <div class="user-select">
        <el-input
            v-model="userId"
            placeholder="请输入用户ID"
            type="number"
            style="width: 200px"
            @change="handleUserChange"
        />
        </div>
    </div>

    <!-- 行为类型标签页 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
    <!-- 搜索历史 -->
    <el-tab-pane label="搜索历史" name="search">
        <div class="search-filters">
        <el-form :inline="true" :model="searchFilters">
            <el-form-item label="模块">
            <el-input v-model="searchFilters.module" placeholder="请输入模块"></el-input>
            </el-form-item>
            <el-form-item label="关键词">
            <el-input v-model="searchFilters.keyword" placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-form-item label="时间范围">
            <el-date-picker
                v-model="searchFilters.timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
            />
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="searchHistories">查询</el-button>
            </el-form-item>
        </el-form>
        </div>
        <el-table :data="searchHistories" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="keyword" label="关键词" width="150" />
        <el-table-column prop="search_time" label="搜索时间" width="180" />
        <el-table-column prop="device" label="设备" width="120" />
        <el-table-column prop="ip_address" label="IP地址" width="140" />
        <el-table-column label="操作" width="100">
            <template #default="scope">
            <el-button
                type="danger"
                size="small"
                @click="deleteSearchHistory(scope.row.id)"
            >删除</el-button>
            </template>
        </el-table-column>
        </el-table>
    </el-tab-pane>

    <!-- 浏览历史 -->
    <el-tab-pane label="浏览历史" name="browse">
        <el-table :data="browseHistories" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="content_type" label="内容类型" width="120" />
        <el-table-column prop="content_id" label="内容ID" width="100" />
        <el-table-column prop="browse_time" label="浏览时间" width="180" />
        <el-table-column prop="duration" label="浏览时长(秒)" width="120" />
        <el-table-column prop="device" label="设备" width="120" />
        <el-table-column prop="ip_address" label="IP地址" width="140" />
        <el-table-column label="操作" width="100">
            <template #default="scope">
            <el-button
                type="danger"
                size="small"
                @click="deleteBrowseHistory(scope.row.id)"
            >删除</el-button>
            </template>
        </el-table-column>
        </el-table>
    </el-tab-pane>

    <!-- 收藏记录 -->
    <el-tab-pane label="收藏记录" name="favorites">
        <el-table :data="favorites" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="content_type" label="内容类型" width="120" />
        <el-table-column prop="content_id" label="内容ID" width="100" />
        <el-table-column prop="favorite_time" label="收藏时间" width="180" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="100">
            <template #default="scope">
            <el-button
                type="danger"
                size="small"
                @click="deleteFavorite(scope.row.id)"
            >删除</el-button>
            </template>
        </el-table-column>
        </el-table>
    </el-tab-pane>

    <!-- 积分记录 -->
    <el-tab-pane label="积分记录" name="points">
        <div class="points-header">
        <el-button type="primary" @click="showAdjustPointsDialog">调整积分</el-button>
        </div>
        <el-table :data="pointLogs" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="change_amount" label="变更数量" width="120" />
        <el-table-column prop="source" label="来源" width="120" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="create_time" label="创建时间" width="180" />
        <el-table-column prop="operator_id" label="操作人ID" width="100" />
        </el-table>
    </el-tab-pane>
    </el-tabs>

    <!-- 积分调整对话框 -->
    <el-dialog
    v-model="adjustPointsDialogVisible"
    title="调整积分"
    width="500px"
    >
    <el-form :model="adjustPointsForm" label-width="100px">
        <el-form-item label="变更数量">
        <el-input-number v-model="adjustPointsForm.change_amount" :step="1" />
        </el-form-item>
        <el-form-item label="来源">
        <el-input v-model="adjustPointsForm.source" />
        </el-form-item>
        <el-form-item label="备注">
        <el-input
            v-model="adjustPointsForm.remark"
            type="textarea"
            rows="3"
        />
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
        <el-button @click="adjustPointsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdjustPoints">确定</el-button>
        </span>
    </template>
    </el-dialog>
</div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
name: 'AdminBehavior',
setup() {
    const userId = ref('')
    const activeTab = ref('search')
    const searchHistories = ref([])
    const browseHistories = ref([])
    const favorites = ref([])
    const pointLogs = ref([])
    const adjustPointsDialogVisible = ref(false)

    const searchFilters = reactive({
    module: '',
    keyword: '',
    timeRange: []
    })

    const adjustPointsForm = reactive({
    change_amount: 0,
    source: '',
    remark: ''
    })

    // 用户ID变更处理
    const handleUserChange = async () => {
    if (userId.value) {
        await loadCurrentTabData()
    }
    }

    // 标签页切换处理
    const handleTabClick = async () => {
    await loadCurrentTabData()
    }

    // 加载当前标签页数据
    const loadCurrentTabData = async () => {
    if (!userId.value) return

    try {
        switch (activeTab.value) {
        case 'search':
            await loadSearchHistories()
            break
        case 'browse':
            await loadBrowseHistories()
            break
        case 'favorites':
            await loadFavorites()
            break
        case 'points':
            await loadPointLogs()
            break
        }
    } catch (error) {
        ElMessage.error('数据加载失败')
        console.error(error)
    }
    }

    // 搜索历史相关方法
    const loadSearchHistories = async () => {
    const params = {
        user_id: userId.value,
        module: searchFilters.module || null,
        keyword: searchFilters.keyword || null,
        start_time: searchFilters.timeRange[0] || null,
        end_time: searchFilters.timeRange[1] || null
    }
    const response = await axios.get('/api/admin/behavior/search-history', { params })
    searchHistories.value = response.data
    }

    const deleteSearchHistory = async (historyId) => {
    try {
        await axios.delete(`/api/admin/behavior/search-history/${historyId}`)
        ElMessage.success('删除成功')
        await loadSearchHistories()
    } catch (error) {
        ElMessage.error('删除失败')
    }
    }

    // 浏览历史相关方法
    const loadBrowseHistories = async () => {
    const response = await axios.get('/api/admin/behavior/browse-history', {
        params: { user_id: userId.value }
    })
    browseHistories.value = response.data
    }

    const deleteBrowseHistory = async (historyId) => {
    try {
        await axios.delete(`/api/admin/behavior/browse-history/${historyId}`)
        ElMessage.success('删除成功')
        await loadBrowseHistories()
    } catch (error) {
        ElMessage.error('删除失败')
    }
    }

    // 收藏记录相关方法
    const loadFavorites = async () => {
    const response = await axios.get('/api/admin/behavior/favorites', {
        params: { user_id: userId.value }
    })
    favorites.value = response.data
    }

    const deleteFavorite = async (favoriteId) => {
    try {
        await axios.delete(`/api/admin/behavior/favorites/${favoriteId}`)
        ElMessage.success('删除成功')
        await loadFavorites()
    } catch (error) {
        ElMessage.error('删除失败')
    }
    }

    // 积分记录相关方法
    const loadPointLogs = async () => {
    const response = await axios.get('/api/admin/behavior/points', {
        params: { user_id: userId.value }
    })
    pointLogs.value = response.data
    }

    const showAdjustPointsDialog = () => {
    adjustPointsForm.change_amount = 0
    adjustPointsForm.source = ''
    adjustPointsForm.remark = ''
    adjustPointsDialogVisible.value = true
    }

    const submitAdjustPoints = async () => {
    try {
        const data = {
        user_id: userId.value,
        ...adjustPointsForm
        }
        await axios.post('/api/admin/behavior/points/adjust', data)
        ElMessage.success('积分调整成功')
        adjustPointsDialogVisible.value = false
        await loadPointLogs()
    } catch (error) {
        ElMessage.error('积分调整失败')
    }
    }

    return {
    userId,
    activeTab,
    searchHistories,
    browseHistories,
    favorites,
    pointLogs,
    searchFilters,
    adjustPointsDialogVisible,
    adjustPointsForm,
    handleUserChange,
    handleTabClick,
    //   searchHistories: loadSearchHistories,
    deleteSearchHistory,
    deleteBrowseHistory,
    deleteFavorite,
    showAdjustPointsDialog,
    submitAdjustPoints
    }
}
}
</script>

<style>
.admin-behavior {
    margin-left: 256px;
padding: 20px;
}

.user-select {
margin-bottom: 20px;
}

.search-filters {
margin-bottom: 20px;
}

.points-header {
margin-bottom: 20px;
}

.el-tabs {
margin-top: 20px;
}

.dialog-footer {
display: flex;
justify-content: flex-end;
gap: 10px;
}
</style>