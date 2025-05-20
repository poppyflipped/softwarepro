<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
export default {
  components: {

  },
  data() {
    return {
      isLogin: false,
      username: '张三'
    };
  },
  methods: {
    goLogin() {
      this.$router.push('/login');
    }
  },
  setup() {
    const route = useRoute();
    const showNavAndFooter = computed(() => {
      return route.meta.showNavFooter === undefined || route.meta.showNavFooter;
    });

    onMounted(() => {
      // 这里可以添加一些初始化逻辑，确保route对象已经正确获取
    });

    return {
      showNavAndFooter
    };
  }
};
</script>