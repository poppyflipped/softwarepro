<template>
  <div>
    <div class="bg-gray-50">
      <!-- Hero Section -->
      <section class="hero-section relative">
        <div class="max-w-7xl mx-auto px-4 py-20">
          <div class="max-w-2xl">
            <h1 class="text-4xl font-bold text-black mb-4">探索传统文化之美</h1>
            <p class="text-lg text-black/90 mb-8">参与文化传承任务，获得独特的学习体验，让传统文化焕发新生命</p>
            <button class="bg-primary text-white px-8 py-3 rounded-button hover:bg-primary/90">开始探索</button>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 py-12">
        <!-- 任务分类 -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold mb-8">任务分类</h2>
          <div class="grid grid-cols-4 gap-6">
            <div v-for="category in categories" :key="category.name"
              class="bg-white rounded-lg shadow-sm overflow-hidden">
              <div :style="{ backgroundImage: 'url(' + category.image + ')' }" class="h-48 bg-cover bg-center"></div>
              <div class="p-6">
                <h3 class="text-lg font-medium mb-2">{{ category.name }}</h3>
                <p class="text-gray-600 text-sm mb-4">{{ category.description }}</p>
                <span class="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">{{ category.taskCount }}
                  个任务</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 热门任务 -->
        <section class="mb-16">
          <h2 class="text-2xl font-bold mb-8">热门任务</h2>
          <div class="grid gap-6">
            <div v-for="task in tasks" :key="task.title" class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-medium mb-2">{{ task.title }}</h3>
                  <p class="text-gray-600 text-sm mb-4">{{ task.description }}</p>
                  <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-500">
                      <i class="fas fa-users mr-2"></i>{{ task.participants }} 人参与
                    </span>
                    <span class="text-sm text-gray-500">
                      <i class="fas fa-clock mr-2"></i>剩余 {{ task.remainingDays }} 天
                    </span>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="text-right">
                    <span class="block text-primary font-medium">{{ task.points }}</span>
                    <span class="text-sm text-gray-500">积分奖励</span>
                  </div>
                  <button
                    class="bg-primary text-white px-6 py-2 rounded-button hover:bg-primary/90 whitespace-nowrap">立即参与</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 每周任务榜和个人任务中心 -->
        <section class="grid grid-cols-2 gap-8 mb-16">
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h2 class="text-2xl font-bold mb-6">每周任务榜</h2>
            <div class="space-y-6">
              <div v-for="(ranking, index) in weeklyRankings" :key="index" class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <span :class="index === 0 ? 'text-xl font-bold text-primary' : 'text-xl font-bold text-gray-400'">{{
                    index + 1 }}</span>
                  <div>
                    <h3 class="font-medium">{{ ranking.title }}</h3>
                    <p class="text-sm text-gray-500">完成度 {{ ranking.completion }}%</p>
                  </div>
                </div>
                <span class="text-sm text-primary">{{ ranking.participants }} 人参与</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-8">
            <h2 class="text-2xl font-bold mb-6">个人任务中心</h2>
            <div class="space-y-6">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium">进行中的任务</h3>
                  <span class="text-primary">{{ ongoingTasks }} 个</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full">
                  <div class="h-2 bg-primary rounded-full" :style="{ width: ongoingPercentage + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium">已完成任务</h3>
                  <span class="text-primary">{{ completedTasks }} 个</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full">
                  <div class="h-2 bg-primary rounded-full" :style="{ width: completedPercentage + '%' }"></div>
                </div>
              </div>
              <div class="pt-4">
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <span>累计获得积分</span>
                  <span class="text-xl font-bold text-primary">{{ totalPoints }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      categories: [
        {
          name: "书法练习",
          description: "探索汉字之美，传承书法艺术",
          image: "https://ai-public.mastergo.com/ai/img_res/6054889141a8030baf5792519a29b3fe.jpg",
          taskCount: 138,
        },
        {
          name: "茶艺修习",
          description: "品茗悟道，感受茶道精神",
          image: "https://ai-public.mastergo.com/ai/img_res/a6d9e740090a817f3d331394b411627a.jpg",
          taskCount: 92,
        },
        {
          name: "古乐演奏",
          description: "聆听古韵，感受音乐之美",
          image: "https://ai-public.mastergo.com/ai/img_res/25dbc74c38ac63c9bfd783143fbb12d7.jpg",
          taskCount: 76,
        },
        {
          name: "国画创作",
          description: "丹青妙笔，绘写山水",
          image: "https://ai-public.mastergo.com/ai/img_res/627dea0dfdd995de2c9f6d9f9802020b.jpg",
          taskCount: 105,
        },
      ],
      tasks: [
        {
          title: "「临摹百家姓」书法练习挑战",
          description: "通过临摹百家姓，掌握基本笔画结构，提升书法技艺",
          participants: "2,463",
          remainingDays: 6,
          points: 500,
        },
        {
          title: "「茶道入门」线上品茗课程",
          description: "跟随茶艺大师学习茶道礼仪，体验传统茶文化魅力",
          participants: "1,872",
          remainingDays: 3,
          points: 300,
        },
        {
          title: "「古琴雅韵」在线教学活动",
          description: "零基础学习古琴技艺，感受传统音乐之美",
          participants: "1,256",
          remainingDays: 12,
          points: 400,
        },
      ],
      weeklyRankings: [
        { title: "水墨山水画临摹", completion: 85, participants: "3,245" },
        { title: "篆刻艺术入门", completion: 72, participants: "2,876" },
        { title: "古诗词朗诵", completion: 68, participants: "2,543" },
      ],
      ongoingTasks: 3,
      ongoingPercentage: 60,
      completedTasks: 12,
      completedPercentage: 100,
      totalPoints: 2860,
    };
  },
};
</script>

<style scoped>
.hero-section {
  background-image: url('https://ai-public.mastergo.com/ai/img_res/450272059a429a9b600c7c3f1a37233e.jpg');
  background-size: cover;
  background-position: center;
}
</style>
