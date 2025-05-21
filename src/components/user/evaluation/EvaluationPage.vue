<template>
  <div>
  <main class="max-w-[1440px] mx-auto px-8 pt-8">
    <!-- 测评分类 -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-8">测评分类</h2>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="(assessment, index) in assessments" :key="index" class="assessment-card bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div class="mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <i :class="assessment.iconClass + ' text-primary text-xl'"></i>
          </div>
          <h3 class="text-lg font-bold mb-2">{{ assessment.title }}</h3>
          <p class="text-sm text-gray-500 mb-4">{{ assessment.description }}</p>
          <div class="flex items-center text-sm text-gray-400">
            <span class="flex items-center"><i class="far fa-clock mr-1"></i>{{ assessment.time }}</span>
            <span class="flex items-center ml-4"><i class="far fa-file-alt mr-1"></i>{{ assessment.questions }}题</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 个人测评数据 -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-8">个人测评数据</h2>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="(data, index) in personalData" :key="index" class="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div class="text-3xl font-bold text-primary mb-2">{{ data.value }}</div>
          <div class="text-sm text-gray-500">{{ data.label }}</div>
        </div>
      </div>
    </section>

    <!-- 推荐测评 -->
    <section class="mb-12">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold">推荐测评</h2>
        <button class="text-primary hover:text-primary/80">查看全部<i class="fas fa-angle-right ml-2"></i></button>
      </div>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="(recommendation, index) in recommendations" :key="index" class="assessment-card bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="h-40 bg-gray-100">
            <img :src="recommendation.image" :alt="recommendation.title" class="w-full h-full object-cover">
          </div>
          <div class="p-4">
            <h3 class="font-bold mb-2">{{ recommendation.title }}</h3>
            <div class="flex items-center justify-between text-sm mb-3">
              <span class="text-primary bg-primary/10 px-2 py-1 rounded">{{ recommendation.level }}</span>
              <span class="text-gray-400">{{ recommendation.participants }} 人参与</span>
            </div>
            <button class="w-full bg-primary text-white py-2 rounded-button hover:bg-primary/90">开始测评</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 历史测评记录 -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-8">历史测评记录</h2>
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">测评名称</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">完成时间</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">得分</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">正确率</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(record, index) in historyRecords" :key="index">
              <td class="px-6 py-4 text-sm text-gray-900">{{ record.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ record.time }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ record.score }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ record.accuracy }}%</td>
              <td class="px-6 py-4 text-sm">
                <button class="text-primary hover:text-primary/80">查看详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
    
  </div>
</template>

<script>
export default {
  name: "OnlineAssessment",

  data() {
    return {
      assessments: [
        {
          title: "基础知识测评",
          description: "考察传统文化基础知识掌握程度",
          time: "30分钟",
          questions: 50,
          iconClass: "fas fa-book"
        },
        {
          title: "技能水平测评",
          description: "评估书法绘画等传统技艺水平",
          time: "45分钟",
          questions: 30,
          iconClass: "fas fa-paint-brush"
        },
        {
          title: "综合能力测评",
          description: "全方位评估文化素养与理解能力",
          time: "60分钟",
          questions: 80,
          iconClass: "fas fa-brain"
        },
        {
          title: "等级认证测评",
          description: "专业资格等级认证考核评估",
          time: "90分钟",
          questions: 100,
          iconClass: "fas fa-trophy"
        }
      ],
      personalData: [
        { value: 126, label: "已完成测评" },
        { value: "85%", label: "平均正确率" },
        { value: 1280, label: "累计测评时长(分钟)" },
        { value: 15, label: "获得勋章" }
      ],
      recommendations: [
        {
          title: "书法基础入门测评",
          level: "初级",
          participants: "12,345",
          image: "https://ai-public.mastergo.com/ai/img_res/9e223c1df4925ca9d95c2d6893ae15b2.jpg"
        },
        {
          title: "茶艺文化鉴赏测评",
          level: "中级",
          participants: "8,756",
          image: "https://ai-public.mastergo.com/ai/img_res/26b9f6c4fedf164f3a20536b99027ef2.jpg"
        },
        {
          title: "国画技法提升测评",
          level: "高级",
          participants: "6,234",
          image: "https://ai-public.mastergo.com/ai/img_res/773076af409a74d1776d387c9d233e47.jpg"
        },
        {
          title: "古典音律理论测评",
          level: "专业",
          participants: "4,567",
          image: "https://ai-public.mastergo.com/ai/img_res/0f31c65b9b82c9dba1372bd73ceec328.jpg"
        }
      ],
      historyRecords: [
        { name: "书法基础入门测评", time: "2023-12-20 14:30", score: 92, accuracy: 92 },
        { name: "茶艺文化鉴赏测评", time: "2023-12-18 10:15", score: 88, accuracy: 88 },
        { name: "国画技法提升测评", time: "2023-12-15 16:45", score: 95, accuracy: 95 },
        { name: "古典音律理论测评", time: "2023-12-12 09:30", score: 85, accuracy: 85 }
      ]
    };
  }
};
</script>

<style scoped>
  .assessment-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

</style>
