<template>
  <div id="app">
    <section ref="section">
      <!-- 新背景图1 -->
      <img src="../../assets/init/bg1.png" alt=""
        id="one">
      <img :style="{ '--i': 1 }" src="../../assets/init/Cloud.png" alt="" id="two">
      <img :style="{ '--i': 2 }" src="../../assets/init/Cloud2.png" alt="" id="two">
      <div id="run"></div>
      <h1 id="text">山水之道，传承千年文脉</h1>
    </section>

    <div class="bodyContainer">
      <div :class="{ hidden: !showBackground }" id="backgroundContainer">
        <!-- 新背景图2 -->
        <img src="../../assets/init/bg2.png"
          alt="Another Background" id="anotherBackground">
        <div>
          <p>山水之道</p>
          <p>&nbsp;&nbsp;--传承千年文脉</p>
        </div>
        <button @click="explore">开始探索</button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      showBackground: false
    };
  },
  methods: {
    explore() {
      window.scrollTo({
        top: 0,
      });
      this.$router.push('/home')
    }
  },

  mounted() {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY || window.pageYOffset;
      this.showBackground = scrollPosition > 500;
    });
  }
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "STXingkai", "行楷", cursive;
}

html,
body {
  min-height: 100%;
}

section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

section::before {
  content: '';
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 1400px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.3) 80%, #000 100%);
  z-index: 100000;
}

section img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

#two {
  z-index: 10;
  animation: animate calc(10s * var(--i)) linear infinite;
}

#text {
  position: relative;
  color: #3d3d3d;
  z-index: 2;
  font-size: 5em;
  text-align: center;
  padding-top: 250px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: "STXingkai", "行楷", cursive;
}

.bodyContainer {
  background-color: #000;
  height: 1000px;
  position: relative;
}

.bodyContainer img {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.bodyContainer div div {
  font-size: 60px;
  position: absolute;
  bottom: 240px;
  right: 30px;
  color: rgba(61, 61, 61, 1);

}

.bodyContainer button {
  position: absolute;
  width: 167px;
  height: 47px;
  border-radius: 10px;
  border: transparent;
  background-color: rgba(150, 166, 185, 0.4);
  bottom: 45px;
  right: 74px;
  font-size: 22px;
  color: rgba(0, 0, 0, 1);
}

.bodyContainer button:hover {
  background-color: #B91C1C;
  color: white;
}

/* animation */

@keyframes animate {
  0% {
    opacity: 0;
    transform: scale(1);
  }

  20%,
  75% {
    opacity: 0.5;
  }

  100% {
    transform: scale(3);
  }
}

/* animation */

.hidden {
  display: none;
}
</style>