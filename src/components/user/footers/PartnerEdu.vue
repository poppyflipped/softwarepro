<template>
  <div class="partner-page">
    <div class="page-header">
      <h1>📚 教育机构合作</h1>
      <p>
        平台与全国多所高校、研究院建立战略合作，联合开设非遗课程、开展学术研究、举办非遗体验活动，培养新一代非遗数字化人才。
      </p>
    </div>

    <div class="partner-grid">
      <div class="partner-card" v-for="school in schools" :key="school.id">
        <div class="card-header">
          <h3>{{ school.name }}</h3>
        </div>
        <p class="desc">{{ school.desc }}</p>
        <div class="tags">
          <span v-for="tag in school.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <div class="footer-note">
      📖 期待更多高校加入非遗数字化阵营，共创未来！
    </div>
  </div>
</template>

<script>
export default {
  name: 'EduOrg',
  data() {
    return {
      schools: [
        {
          id: 1,
          name: '北京大学艺术学院',
          desc: '开设“数字非遗导论”课程，开展数字影像非遗纪录片制作。',
          tags: ['课程共建', '纪录片拍摄', '数字非遗']
        },
        {
          id: 2,
          name: '中央美术学院',
          desc: '共同举办“非遗数字艺术节”，探索传统工艺与数字视觉融合表现。',
          tags: ['数字艺术', '展览活动', '跨媒介创作']
        },
        {
          id: 3,
          name: '中国传媒大学',
          desc: '联合开发非遗虚拟互动体验项目，应用VR/AR技术讲述非遗故事。',
          tags: ['虚拟体验', 'VR/AR', '交互设计']
        },
        {
          id: 4,
          name: '四川美术学院',
          desc: '策划“非遗插画创作工作坊”，创新诠释传统图案文化内涵。',
          tags: ['插画设计', '青年共创', '艺术工作坊']
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

.partner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.partner-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.partner-card:hover {
  background: linear-gradient(to right, #fff, #fef2f2);
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(185, 28, 28, 0.15);
}

.card-header h3 {
  font-size: 22px;
  color: #B91C1C;
  margin-bottom: 12px;
}

.desc {
  font-size: 15px;
  color: #555;
  line-height: 1.7;
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
