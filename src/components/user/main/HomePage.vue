<template>
  <div>
    <main class="pt-20 min-h-screen bg-gray-50">
      <!-- Hero 区 -->
      <section class="hero-section h-[400px] relative flex items-center justify-center text-center px-6">
        <div class="max-w-3xl text-gray-800 hero-content">
          <h1 class="text-5xl font-bold mb-6 font-xingkai hero-title">
            传承千年文化，探索非遗之美
          </h1>
          <p class="text-lg mb-8 leading-relaxed hero-subtitle">
            通过数字化学习平台，体验传统文化魅力，从书法、戏曲到工艺技艺，轻松传承非物质文化遗产。
          </p>
          <button
            @click="$router.push('/knowledge')"
            class="!rounded-button bg-primary text-white px-10 py-3 text-lg hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            立即开始学习
          </button>
        </div>
      </section>

      <!-- 三大模块入口 -->
      <section class="py-20 container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center mb-16">首页模块</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- 知识中心 -->
          <div
            @click="$router.push('/knowledge')"
            class="cursor-pointer bg-white rounded-lg shadow-md p-8 flex flex-col items-center hover:shadow-xl transition"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2907/2907994.png"
              alt="知识中心"
              class="mb-6 module-icon"
            />
            <h3 class="text-2xl font-semibold mb-4">知识中心</h3>
            <p class="text-gray-600 mb-6 text-center">
              系统学习非遗文化知识，涵盖诗词、工艺、节庆等内容。
            </p>
            <button class="!rounded-button bg-primary text-white px-6 py-2 hover:bg-red-700 transition-colors whitespace-nowrap">
              进入知识中心
            </button>
          </div>

          <!-- 在线测评 -->
          <div
            @click="$router.push('/evaluation')"
            class="cursor-pointer bg-white rounded-lg shadow-md p-8 flex flex-col items-center hover:shadow-xl transition"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/469/469452.png"
              alt="在线测评"
              class="mb-6 module-icon"
            />
            <h3 class="text-2xl font-semibold mb-4">在线测评</h3>
            <p class="text-gray-600 mb-6 text-center">
              通过测验巩固知识，检测学习成果，获得积分与奖励。
            </p>
            <button class="!rounded-button bg-primary text-white px-6 py-2 hover:bg-red-700 transition-colors whitespace-nowrap">
              开始测评
            </button>
          </div>

          <!-- 个人中心 -->
          <div
            @click="$router.push('/info')"
            class="cursor-pointer bg-white rounded-lg shadow-md p-8 flex flex-col items-center hover:shadow-xl transition"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
              alt="个人中心"
              class="mb-6 module-icon"
            />
            <h3 class="text-2xl font-semibold mb-4">个人中心</h3>
            <p class="text-gray-600 mb-6 text-center">
              查看学习进度，管理账户信息，领取奖励证书。
            </p>
            <button class="!rounded-button bg-primary text-white px-6 py-2 hover:bg-red-700 transition-colors whitespace-nowrap">
              进入个人中心
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.hero-section {
  background-image: url("https://ai-public.mastergo.com/ai/img_res/f94038737d06208db9cda281ddcc1d0d.jpg");
  background-size: cover;
  background-position: center;
}
.font-xingkai {
  font-family: "STXingkai", "行楷", cursive;
}
button:hover {
  background-color: #e53e3e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.hero-content {
  position: relative;
  top: -30px;
  right: -60px;
}
/* 新增：模块图片大小控制 */
.module-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
}
</style>
