<template>
  <div class="partner-page">
    <div class="page-header">
      <h1>👑 非遗传承人合作</h1>
      <p>
        我们携手国家级、省市级非遗传承人，联合开发精品课程、展演活动与传承计划，助力非遗技艺世代相传、焕发新生。
      </p>
    </div>

    <div class="inheritor-grid">
      <div class="inheritor-card" v-for="person in inheritors" :key="person.id">
        <div class="card-header">
          <h3>{{ person.name }}</h3>
          <p class="title">{{ person.title }}</p>
        </div>
        <p class="skill">擅长技艺：{{ person.skill }}</p>
        <div class="tags">
          <span v-for="tag in person.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <div class="footer-note">
      🎭 非遗匠心，代代相承，欢迎更多传承人携手共创！
    </div>
  </div>
</template>

<script>
export default {
  name: 'PartnerInheritor',
  data() {
    return {
      inheritors: [
        {
          id: 1,
          name: '张文清',
          title: '国家级剪纸非遗传承人',
          skill: '传统吉祥剪纸、生肖窗花',
          tags: ['线上课程', '展览活动', '非遗工坊']
        },
        {
          id: 2,
          name: '李鸣远',
          title: '京剧脸谱非遗技艺传承人',
          skill: '京剧脸谱绘制、表演妆容设计',
          tags: ['短视频共创', '非遗体验营', '公益讲座']
        },
        {
          id: 3,
          name: '王素芳',
          title: '苏绣国家级非遗代表性传承人',
          skill: '苏绣人物肖像、双面绣',
          tags: ['定制作品', '展览策划', '技艺传承班']
        }
      ]
    }
  }
}
</script>

<style scoped>
.partner-page {
  padding: 60px 24px;
  max-width: 1100px;
  margin: 0 auto;
  font-family: 'PingFang SC', 'Helvetica Neue', sans-serif;
  animation: fadeIn 0.8s ease;
  color: #333;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  font-size: 42px;
  color: #B91C1C;
  margin-bottom: 16px;
}

.page-header p {
  font-size: 18px;
  line-height: 1.8;
  color: #555;
  max-width: 800px;
  margin: 0 auto;
}

.inheritor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.inheritor-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.inheritor-card:hover {
  background: linear-gradient(to right, #fff, #fef2f2);
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(185, 28, 28, 0.15);
}

.card-header h3 {
  font-size: 22px;
  color: #B91C1C;
  margin-bottom: 6px;
}

.card-header .title {
  font-size: 15px;
  color: #666;
  margin-bottom: 14px;
}

.skill {
  font-size: 15px;
  color: #555;
  margin-bottom: 16px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #FECACA;
  color: #B91C1C;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  transition: all 0.3s;
}

.tag:hover {
  background: #B91C1C;
  color: #fff;
}

.footer-note {
  text-align: center;
  margin-top: 60px;
  font-size: 16px;
  color: #666;
  animation: fadeIn 1.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
