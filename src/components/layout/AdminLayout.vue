<template>
<div class="admin-layout">
    <!-- 侧边栏（根据路由 meta 控制显示） -->
    <div v-if="showNav"
        class="admin-sidebar bg-gray-800 text-white w-64 h-screen fixed left-0 top-0 overflow-y-auto">
        <div class="p-6 border-b border-gray-700">
            <h2 class="text-xl font-bold">管理后台</h2>
        </div>

        <nav class="py-4">
            <ul>
                <li>
                    <router-link to="/admin/adminUser" 
                        class="flex items-center px-6 py-3 hover:bg-gray-700 transition"
                        :class="{ 'text-red-500': $route.path === '/admin/adminUser' }"
                        exact-active-class="text-red-500">
                        <i class="fas fa-user-cog mr-3"></i> <!-- 管理员管理：用户齿轮图标 -->
                        <span>管理员管理</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/admin/static" 
                        class="flex items-center px-6 py-3 hover:bg-gray-700 transition"
                        :class="isActiveExact('/admin/static')">
                        <i class="fas fa-book-open mr-3"></i> <!-- 知识管理：打开的书籍图标 -->
                        <span>知识管理</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/admin/learn" 
                        class="flex items-center px-6 py-3 hover:bg-gray-700 transition"
                        :class="isActiveExact('/admin/learn')">
                        <i class="fas fa-shield-alt mr-3"></i> <!-- 权限管理：盾牌图标 -->
                        <span>学习模块管理</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/admin/log" 
                        class="flex items-center px-6 py-3 hover:bg-gray-700 transition"
                        :class="isActiveExact('/admin/log')">
                        <i class="fas fa-shield-alt mr-3"></i> <!-- 权限管理：盾牌图标 -->
                        <span>日志</span>
                    </router-link>
                </li>
            </ul>
        </nav>
    </div>

    <!-- ml-64 适配侧边栏宽度，避免遮挡 -->
    <router-view />
</div>
</template>

<script>
export default {
    computed: {
        showNav() {
            return this.$route.meta.ifshow !== false;
        },
    },
    methods: {
        isActiveExact(path) {
            return this.$route.path === path ? "text-red-500" : "text-white";
        },
        isActiveParent(path) {
            return this.$route.matched.some((record) => record.path === path)
                ? "text-red-500"
                : "text-white";
        },
    },
};
</script>