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
                        <i class="fas fa-users-cog mr-3"></i> 
                        <span>管理员管理</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/admin/static" 
                        class="flex items-center px-6 py-3 hover:bg-gray-700 transition"
                        :class="isActiveExact('/admin/static')">
                        <i class="fas fa-graduation-cap mr-3"></i> 
                        <span>知识管理</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/admin/learn" 
                        class="flex items-center px-6 py-3 hover:bg-gray-700 transition"
                        :class="isActiveExact('/admin/learn')">
                        <i class="fas fa-book-reader mr-3"></i> 
                        <span>学习模块管理</span>
                    </router-link>
                </li>
                <li>
                    <div @click="toggleQuizMenu" 
                        class="flex items-center justify-between px-6 py-3 hover:bg-gray-700 transition cursor-pointer"
                        :class="{ 'text-red-500': isQuizMenuActive }">
                        <div class="flex items-center">
                            <i class="fas fa-tasks mr-3"></i>
                            <span>测评管理</span>
                        </div>
                        <i :class="['fas', quizMenuOpen ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
                    </div>
                    <ul v-show="quizMenuOpen" class="bg-gray-900">
                        <li>
                            <router-link to="/admin/quiz" 
                                class="flex items-center px-8 py-2 hover:bg-gray-700 transition"
                                :class="isActiveExact('/admin/quiz')">
                                <i class="fas fa-edit mr-3"></i>
                                <span>测评管理</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/admin/quiz-report" 
                                class="flex items-center px-8 py-2 hover:bg-gray-700 transition"
                                :class="isActiveExact('/admin/quiz-report')">
                                <i class="fas fa-chart-bar mr-3"></i>
                                <span>测评报告</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/admin/quiz-record" 
                                class="flex items-center px-8 py-2 hover:bg-gray-700 transition"
                                :class="isActiveExact('/admin/quiz-record')">
                                <i class="fas fa-history mr-3"></i>
                                <span>答题记录管理</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/admin/quiz-mistake" 
                                class="flex items-center px-8 py-2 hover:bg-gray-700 transition"
                                :class="isActiveExact('/admin/quiz-mistake')">
                                <i class="fas fa-exclamation-triangle mr-3"></i>
                                <span>错题管理</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/admin/quiz-module" 
                                class="flex items-center px-8 py-2 hover:bg-gray-700 transition"
                                :class="isActiveExact('/admin/quiz-module')">
                                <i class="fas fa-cubes mr-3"></i>
                                <span>测评报告模块管理</span>
                            </router-link>
                        </li>
                    </ul>
                </li>
                <li>
                    <router-link to="/admin/behavior" 
                        class="flex items-center px-6 py-3 hover:bg-gray-700 transition"
                        :class="isActiveExact('/admin/behavior')">
                        <i class="fas fa-user-clock mr-3"></i> 
                        <span>用户行为管理</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/admin/log" 
                        class="flex items-center px-6 py-3 hover:bg-gray-700 transition"
                        :class="isActiveExact('/admin/log')">
                        <i class="fas fa-clipboard-list mr-3"></i> 
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
    data() {
        return {
            quizMenuOpen: false
        }
    },
    computed: {
        showNav() {
            return this.$route.meta.ifshow !== false;
        },
        isQuizMenuActive() {
            const quizRoutes = ['/admin/quiz', '/admin/quiz-report', '/admin/quiz-record', '/admin/quiz-mistake', '/admin/quiz-module'];
            return quizRoutes.includes(this.$route.path);
        }
    },
    methods: {
        toggleQuizMenu() {
            this.quizMenuOpen = !this.quizMenuOpen;
        },
        isActiveExact(path) {
            return this.$route.path === path ? "text-red-500" : "text-white";
        },
        isActiveParent(path) {
            return this.$route.matched.some((record) => record.path === path)
                ? "text-red-500"
                : "text-white";
        },
    },
    watch: {
        '$route'() {
            // Open quiz menu if current route is a quiz-related route
            if (this.isQuizMenuActive) {
                this.quizMenuOpen = true;
            }
        }
    }
};
</script>

<style>
.admin-layout .fa-chevron-down,
.admin-layout .fa-chevron-right {
    transition: transform 0.3s ease;
}
</style>