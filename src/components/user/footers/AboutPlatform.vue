<template>
  <div class="platform-wrapper">
    <div class="platform-header">
      <h1>平台简介</h1>
      <p>传承经典 · 数字赋能 · 文化共创</p>
    </div>

    <div class="platform-section" v-for="(section, index) in sections" :key="index">
      <h2>{{ section.icon }} {{ section.title }}</h2>
      <p v-if="section.desc">{{ section.desc }}</p>
      <ul v-if="section.list">
        <li v-for="(item, i) in section.list" :key="i">{{ item }}</li>
      </ul>
    </div>

    <div class="contact-card">
      <h2>📞 联系我们</h2>
      <p>合作、投稿、反馈欢迎通过【联系我们】页面留言，或邮件至：</p>
      <a href="mailto:heritage@platform.com" class="email-link">heritage@platform.com</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPlatform',
  data() {
    return {
      sections: [
        {
          icon: '🌟',
          title: '平台定位',
          desc: '本平台聚焦非遗文化的数字化保存、传播与教育，面向文化爱好者、非遗传承人及高校师生，提供全方位、沉浸式、互动性强的非遗文化学习体验。'
        },
        {
          icon: '📌',
          title: '核心功能',
          list: [
            '精品课程：多形式课程，名师指导，沉浸学习。',
            '数字博物馆：虚拟 3D 漫游，尽览非遗瑰宝。',
            '学习任务：每日任务+徽章激励，点燃学习热情。',
            '互动社区：交流分享、作品展示、文化碰撞。',
            '名师团队：国家级非遗传承人+高校专家，保障专业权威。'
          ]
        },
        {
          icon: '🎯',
          title: '平台愿景',
          desc: '通过数字化技术让非遗文化“活”起来，让更多人了解、参与、喜爱、传承非遗，共筑中华文化精神家园。'
        }
      ]
    }
  }
}
</script>

<style scoped>
.platform-wrapper {
  padding: 60px 20px;
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  color: #333;
  font-family: 'Helvetica Neue', 'PingFang SC', sans-serif;
  animation: fadeIn 0.8s ease;
}

.platform-header {
  text-align: center;
  margin-bottom: 50px;
}

.platform-header h1 {
  font-size: 46px;
  color: #B91C1C;
  margin-bottom: 12px;
  position: relative;
  animation: slideIn 0.6s ease;
}

.platform-header h1::after {
  content: '';
  display: block;
  width: 90px;
  height: 4px;
  margin: 14px auto 0;
  background: linear-gradient(to right, #B91C1C, #f87171);
  border-radius: 2px;
}

.platform-header p {
  font-size: 20px;
  color: #666;
  margin-top: 10px;
}

.platform-section {
  margin-bottom: 50px;
  padding: 30px;
  border-radius: 14px;
  background: #fafafa;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.platform-section:hover {
  background: linear-gradient(135deg, #fff, #fef2f2);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(185, 28, 28, 0.15);
}

.platform-section h2 {
  font-size: 26px;
  color: #B91C1C;
  margin-bottom: 16px;
  border-left: 6px solid #B91C1C;
  padding-left: 14px;
}

.platform-section p {
  font-size: 16px;
  line-height: 1.85;
  margin-bottom: 14px;
  color: #444;
}

.platform-section ul {
  padding-left: 24px;
}

.platform-section li {
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 1.75;
  position: relative;
  padding-left: 28px;
  transition: color 0.3s;
  cursor: pointer;
}

.platform-section li::before {
  content: "✔️";
  position: absolute;
  left: 0;
  top: 2px;
  font-size: 18px;
  color: #B91C1C;
  transition: transform 0.3s;
}

.platform-section li:hover {
  color: #B91C1C;
}

.platform-section li:hover::before {
  transform: scale(1.2) rotate(10deg);
}

.contact-card {
  text-align: center;
  padding: 30px;
  background: linear-gradient(to right, #fee2e2, #fecaca);
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  color: #B91C1C;
  animation: fadeIn 0.9s ease;
}

.contact-card h2 {
  font-size: 26px;
  margin-bottom: 14px;
}

.contact-card p {
  font-size: 16px;
  margin-bottom: 8px;
  color: #a94442;
}

.email-link {
  display: inline-block;
  margin-top: 6px;
  font-size: 18px;
  font-weight: bold;
  color: #B91C1C;
  text-decoration: none;
  transition: color 0.3s;
}

.email-link:hover {
  color: #7f1d1d;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
