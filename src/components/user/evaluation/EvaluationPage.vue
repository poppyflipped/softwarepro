<template>
  <div class="evaluation-wrapper">
    <h1 class="title">📊 测评中心</h1>
    <div class="nav-bar">
      <router-link to="/evaluation/quiz" active-class="active">在线测评</router-link>
      <router-link to="/evaluation/records" active-class="active">答题记录</router-link>
      <router-link to="/evaluation/report" active-class="active">测评报告</router-link>
      <router-link to="/evaluation/wrongbook" active-class="active">错题本</router-link>
    </div>

    <div class="router-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.evaluation-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  color: #B91C1C;
  margin-bottom: 30px;
}

.nav-bar {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.nav-bar a {
  padding: 12px 20px;
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.nav-bar a.active {
  color: #B91C1C;
  border-bottom: 2px solid #B91C1C;
}

.router-view {
  padding: 20px 0;
}
</style>
