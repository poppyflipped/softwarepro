<template>
  <div class="pt-16">
    <main class="container mx-auto px-4 md:px-6">
      <!-- 顶部搜索 -->
      <div class="py-6">
        <div class="relative w-full md:w-64">
          <input type="text" v-model="searchText" placeholder="搜索知识内容"
            class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none" />
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35M16.65 16.65A7 7 0 1010 3a7 7 0 006.65 13.65z" />
          </svg>
        </div>
      </div>

      <!-- 知识列表展示区 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div v-for="item in paginatedKnowledge" :key="item.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">
          <img :src="item.cover_image_url" alt="" class="w-full h-48 object-cover rounded-t-xl">
          <div class="p-5">
            <h3 class="font-semibold text-lg mb-2 text-gray-800">{{ item.title }}</h3>
            <div class="flex items-center justify-between text-gray-500 text-sm mb-2">
              <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded">{{ item.category }}</span>
              <span>已完成：{{ item.completed ? '是' : '否' }}</span>
            </div>
            <button @click="openDetail(item.id)"
              class="mt-3 w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition">查看详情</button>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="flex justify-center mt-10 space-x-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-4 py-2 rounded-full text-sm transition-all',
            currentPage === page
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-primary hover:text-white'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </main>
  </div>

  <!-- 弹窗 -->
  <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl max-w-3xl w-full h-[80vh] p-6 relative overflow-hidden shadow-lg animate-fade-in">
      <button @click="showDialog = false"
        class="absolute top-4 right-4 text-gray-500 hover:text-black text-3xl leading-none">&times;</button>
      <div class="overflow-y-auto pr-3 h-full custom-scrollbar">
        <h2 class="text-2xl font-bold mb-4">{{ detail.title }}</h2>
        <img :src="detail.cover_image_url" alt="" class="w-full h-64 object-cover rounded mb-4">
        <p class="text-gray-600 mb-2">作者：{{ detail.author }} ｜ 来源：{{ detail.source }}</p>
        <p class="text-gray-500 text-sm mb-4">发布时间：{{ formatDate(detail.publish_time) }}</p>
        <div class="mb-4">
          <span v-for="tag in detail.tags" :key="tag"
            class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded mr-2 text-sm">{{ tag }}</span>
        </div>
        <p class="text-gray-800 leading-relaxed mb-4 whitespace-pre-line">{{ detail.content }}</p>
        <div v-if="detail.media.length" class="mt-4">
          <h3 class="text-lg font-semibold mb-2">相关媒体</h3>
          <div v-for="media in detail.media" :key="media.id" class="mb-3">
            <div v-if="media.type === 'IMAGE'">
              <img :src="media.url" alt="" class="w-full rounded">
            </div>
            <div v-else-if="media.type === 'VIDEO'">
              <video controls class="w-full rounded">
                <source :src="media.url" type="video/mp4">
                您的浏览器不支持视频播放。
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="kong"></div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '@/utils/userRequest'

const knowledgeItems = ref([])
const searchText = ref('')
const currentPage = ref(1)
const pageSize = 6

// 弹窗相关
const showDialog = ref(false)
const detail = ref({
  title: '',
  content: '',
  cover_image_url: '',
  author: '',
  source: '',
  publish_time: '',
  tags: [],
  media: []
})

// 获取所有知识项
const fetchKnowledge = async () => {
  try {
    const res = await request.get('/api/user/knowledge/list')
    console.log("知识中心",res.data)
    knowledgeItems.value = res.data
  } catch (error) {
    console.error('获取知识列表失败', error)
  }
}

// 查看详情
const openDetail = async (id) => {
  try {
    const res = await request.get(`/api/user/knowledge/${id}`)
    detail.value = res.data
    showDialog.value = true
  } catch (error) {
    console.error('获取知识详情失败', error)
  }
}

// 搜索过滤
const filteredKnowledge = computed(() => {
  if (!searchText.value) return knowledgeItems.value
  return knowledgeItems.value.filter(item =>
    item.title.includes(searchText.value)
  )
})

// 分页计算
const totalPages = computed(() =>
  Math.ceil(filteredKnowledge.value.length / pageSize)
)

const paginatedKnowledge = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredKnowledge.value.slice(start, end)
})

// 时间格式化
const formatDate = (str) => {
  if (!str) return ''
  const date = new Date(str)
  return date.toLocaleString()
}

onMounted(() => {
  fetchKnowledge()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

#kong {
  margin-bottom: 36px;
}

/* 弹窗淡入动画 */
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease;
}

/* 美化滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
