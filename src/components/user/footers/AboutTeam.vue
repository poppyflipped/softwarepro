<template>
  <div class="about-team">
    <h1>团队成员</h1>
    <div class="team-grid">
      <div
        v-for="member in members"
        :key="member.name"
        class="team-member"
        @click="openModal(member)"
      >
        <div class="img-wrapper">
          <img :src="member.photo" :alt="member.name" />
        </div>
        <h3>{{ member.name }}</h3>
        <p>{{ member.role }}</p>
      </div>
    </div>

    <!-- 弹窗 -->
    <div v-if="selectedMember" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">&times;</button>
        <img :src="selectedMember.photo" :alt="selectedMember.name" />
        <h2>{{ selectedMember.name }}</h2>
        <p class="role">{{ selectedMember.role }}</p>
        <p class="desc">{{ selectedMember.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import lty from '@/assets/team/lty.png'
import lxn from '@/assets/team/lxn.png'
import wyr from '@/assets/team/wyr.png'
import ztt from '@/assets/team/ztt.png'
import njy from '@/assets/team/njy.png'

export default {
  name: 'AboutTeam',
  data() {
    return {
      members: [
        {
          name: '李童瑶',
          role: '后端开发',
          photo: lty,
          desc: '专注后端架构设计与接口开发，热爱算法与开源项目。'
        },
        {
          name: '刘晓楠',
          role: '前端开发',
          photo: lxn,
          desc: '擅长Vue3、动画特效，负责平台前端页面与交互体验。'
        },
        {
          name: '王祎蕊',
          role: '前端开发',
          photo: wyr,
          desc: '致力于打造简洁优雅的用户界面，擅长组件化开发。'
        },
        {
          name: '张甜甜',
          role: 'UI设计师',
          photo: ztt,
          desc: '负责平台整体视觉设计，专注界面美学与用户体验。'
        },
        {
          name: '牛静宇',
          role: 'UI设计师',
          photo: njy,
          desc: '擅长插画与交互动效，参与平台视觉与品牌设计。'
        }
      ],
      selectedMember: null
    }
  },
  methods: {
    openModal(member) {
      this.selectedMember = member
    },
    closeModal() {
      this.selectedMember = null
    }
  }
}
</script>

<style scoped>
.about-team {
  padding: 60px 20px;
  background-color: #f5f7fa;
}

.about-team h1 {
  font-size: 36px;
  text-align: center;
  margin-bottom: 40px;
  color: #333;
  position: relative;
  font-weight: 700;
}

.about-team h1::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #ff7e5f, #feb47b);
  margin: 14px auto 0;
  border-radius: 2px;
}

.team-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: center;
}

.team-member {
  flex: 1 1 200px;
  max-width: 220px;
  text-align: center;
  padding: 24px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.team-member::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, rgba(255, 126, 95, 0.1), rgba(254, 180, 123, 0.1));
  transition: all 0.4s ease;
}

.team-member:hover::before {
  left: 0;
}

.team-member:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
}

.team-member .img-wrapper {
  overflow: hidden;
  border-radius: 12px;
}

.team-member img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 12px;
  transition: all 0.4s ease;
}

.team-member:hover img {
  transform: scale(1.06);
}

.team-member h3 {
  margin: 14px 0 8px;
  font-size: 20px;
  color: #222;
  font-weight: 600;
}

.team-member p {
  color: #666;
  font-size: 14px;
}

/* 宽屏下一行排列 5 个 */
@media (min-width: 1200px) {
  .team-grid {
    flex-wrap: nowrap;
    justify-content: space-between;
  }
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  padding: 36px 24px;
  border-radius: 20px;
  max-width: 520px;
  width: 90%;
  text-align: center;
  position: relative;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.35s ease;
}

.modal-content img {
  width: 220px;
  height: 280px;
  object-fit: cover;
  border-radius: 14px;
  margin: 0 auto 22px;
  display: block;
}

.modal-content h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
  font-weight: 700;
}

.modal-content .role {
  font-size: 18px;
  color: #777;
  margin-bottom: 16px;
}

.modal-content .desc {
  font-size: 16px;
  color: #555;
  line-height: 1.8;
  padding: 0 10px;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 22px;
  font-size: 30px;
  background: none;
  border: none;
  cursor: pointer;
  color: #bbb;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #ff7e5f;
}

/* 弹窗动画 */
@keyframes fadeIn {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
