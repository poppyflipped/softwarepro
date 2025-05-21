<template>
  <div class="partner-page">
    <div class="page-header">
      <h1>🎨 文化机构合作</h1>
      <p>我们携手权威文化机构，共同致力于非遗文化的数字化保护、展示与国际传播，推动优秀传统文化焕发新活力。</p>
    </div>

    <div class="partner-grid">
      <div class="partner-card" v-for="item in partners" :key="item.id">
        <div class="card-header">
          <h3>{{ item.name }}</h3>
        </div>
        <p class="desc">{{ item.desc }}</p>
        <div class="tags">
          <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <div class="footer-note">
      🌸 感谢所有合作伙伴的支持！期待未来更多跨界共创~
    </div>
  </div>
</template>

<script>
export default {
  name: 'CultureOrg',
  data() {
    return {
      partners: [
        {
          id: 1,
          name: '国家博物馆',
          desc: '联合举办多场非遗主题数字展览，打造沉浸式文化体验空间，助力非遗文化传承传播。',
          tags: ['数字展览', '文化交流', '展演活动']
        },
        {
          id: 2,
          name: '故宫博物院',
          desc: '开发非遗互动文创产品，推出虚拟导览及数字体验项目，吸引年轻受众关注非遗。',
          tags: ['数字文创', '虚拟漫游', '非遗研学']
        },
        {
          id: 3,
          name: '中国美术馆',
          desc: '联合举办“数字非遗艺术节”，推动传统工艺与现代艺术融合，探索数字媒介创新表达。',
          tags: ['数字艺术', '非遗节', '媒介融合']
        },
        {
          id: 4,
          name: '地方文化馆联盟',
          desc: '搭建区域数字非遗资料库，组织数字化普查、线上展播、非遗主题沙龙等多元活动。',
          tags: ['资料数字化', '线上展播', '文化沙龙']
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
