<template>
  <div>

    <main class="pt-4">
      <!-- Hero Section -->
      <section class="relative h-[480px] bg-cover bg-center"
        :style="{ backgroundImage: 'url(\'https://ai-public.mastergo.com/ai/img_res/fbbd0d316c9818f2f10c0494ccec0e81.jpg\')' }">
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div class="max-w-[1440px] mx-auto px-8 h-full flex items-center">
          <div class="max-w-xl text-white relative z-10">
            <h1 class="text-5xl font-bold mb-6">传统文化艺术展</h1>
            <p class="text-lg mb-8 opacity-90">探索中华五千年文明，感受传统文化魅力。本次展览集中展示书法、国画、陶瓷、青铜器等传统艺术精品，带您领略东方艺术之美。</p>
            <button
              class="!rounded-button bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-medium">立即预约参观</button>
          </div>
        </div>
      </section>

      <!-- 展览分类 -->
      <section class="max-w-[1440px] mx-auto px-8 py-12">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold">展览分类</h2>
          <div class="flex space-x-8">
            <span v-for="(category, index) in categories" :key="index"
              :class="['category-item', { active: activeCategory === category }]" @click="setActiveCategory(category)">
              {{ category }}
            </span>
          </div>
        </div>

        <!-- 展览项目 -->
        <div class="grid grid-cols-3 gap-8">
          <div v-for="(exhibition, index) in exhibitions" :key="index"
            class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div class="h-[240px] overflow-hidden">
              <img :src="exhibition.image" class="w-full h-full object-cover" :alt="exhibition.title" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ exhibition.title }}</h3>
              <p class="text-gray-600 mb-4">展出时间：{{ exhibition.date }}</p>
              <div class="flex items-center justify-between">
                <span class="text-primary">{{ exhibition.price }}</span>
                <button class="!rounded-button bg-primary hover:bg-primary/90 text-white px-6 py-2">预约参观</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 精品展览推荐 -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-[1440px] mx-auto px-8">
          <h2 class="text-2xl font-bold mb-12">精品展览推荐</h2>
          <div class="grid grid-cols-2 gap-8">
            <div v-for="(recommendation, index) in recommendations" :key="index"
              class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="h-[360px] overflow-hidden">
                <img :src="recommendation.image" class="w-full h-full object-cover" :alt="recommendation.title" />
              </div>
              <div class="p-8">
                <h3 class="text-2xl font-bold mb-4">{{ recommendation.title }}</h3>
                <p class="text-gray-600 mb-6">{{ recommendation.description }}</p>
                <button class="!rounded-button bg-primary hover:bg-primary/90 text-white px-8 py-3">了解更多</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 展览数据 -->
      <section class="bg-gray-50 py-16">
        <div class="max-w-[1440px] mx-auto px-8">
          <div class="text-center">
            <h2 class="text-2xl font-bold mb-12">展览数据</h2>
            <div class="grid grid-cols-4 gap-8">
              <div>
                <div class="text-4xl font-bold text-primary mb-2">126</div>
                <div class="text-gray-600">在展展览</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-primary mb-2">85,632</div>
                <div class="text-gray-600">月访问人次</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-primary mb-2">1,260</div>
                <div class="text-gray-600">藏品总数</div>
              </div>
              <div>
                <div class="text-4xl font-bold text-primary mb-2">15</div>
                <div class="text-gray-600">展厅数量</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>

</template>

<script>
export default {
  data() {
    return {
      activeCategory: '实物展览',
      categories: ['实物展览', '数字展览', '特色展览', '临时展览'],
      exhibitions: [
        {
          title: '翰墨丹青 - 当代书法展',
          date: '2024.01.15 - 2024.03.15',
          price: '免费参观',
          image: 'https://ai-public.mastergo.com/ai/img_res/d97df69d52a70999cb09ee2ee0b887f1.jpg',
        },
        {
          title: '青铜时代 - 文物特展',
          date: '2024.02.01 - 2024.04.30',
          price: '￥68',
          image: 'https://ai-public.mastergo.com/ai/img_res/0230b2b128cf85a8aa630d0554fe60f4.jpg',
        },
        {
          title: '千年瓷韵 - 景德镇瓷器展',
          date: '2024.03.01 - 2024.05.31',
          price: '￥88',
          image: 'https://ai-public.mastergo.com/ai/img_res/1cbdd71d8334d246d4ac04115df0d52c.jpg',
        },
      ],
      recommendations: [
        {
          title: '山水丹青 - 当代国画名家作品展',
          description: '集结当代最具代表性的国画大师作品，展现传统山水画的现代魅力。',
          image: 'https://ai-public.mastergo.com/ai/img_res/9278b92b2aed0a9069d594d550d1f77b.jpg',
        },
        {
          title: '玉润华夏 - 古代玉器珍品展',
          description: '精选历代玉器精品，展现中国玉文化的发展历程。',
          image: 'https://ai-public.mastergo.com/ai/img_res/81032d8dab146db50b24750a59850577.jpg',
        },
      ],
    };
  },
  methods: {
    setActiveCategory(category) {
      this.activeCategory = category;
    },
  },
};
</script>

<style scoped>
.category-item {
  position: relative;
  cursor: pointer;
}

.category-item.active {
  color: #C41E3A;
}

.category-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background-color: #C41E3A;
}
</style>
