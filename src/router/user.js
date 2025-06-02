export const userRoutes = [{
        path: '/home',
        component: () => import('@/components/user/main/HomePage.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        }
    },
    {
        path: '/knowledge',
        component: () => import('@/components/user/knowledge/KnowledgePage.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        },
        children: [{
                path: '',
                redirect: '/knowledge/1' // 👉 这里就是自动跳转到 /knowledge/1
            },
            {
                path: ':moduleId',
                component: () => import('@/components/user/knowledge/KnowledgeList.vue'),
                meta: {
                    layout: 'user',
                    showNavFooter: true
                }
            }
        ]
    },


    {
        path: '/evaluation',
        component: () => import('@/components/user/evaluation/EvaluationPage.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        }
    },
    {
        path: '/login',
        component: () => import('@/components/user/login/LoginPage.vue'),
        meta: {
            layout: 'user',
            showNavFooter: false
        }
    },
    {
        path: '/register',
        component: () => import('@/components/user/login/RegisterPage.vue'),
        meta: {
            layout: 'user',
            showNavFooter: false
        }
    },
    {
        path: '/info',
        component: () => import('@/components/user/ownMessage/MsgPage.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        }
    },

    {
        path: '/about/platform',
        component: () => import('@/components/user/footers/AboutPlatform.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        }
    },
    {
        path: '/about/team',
        component: () => import('@/components/user/footers/AboutTeam.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        }
    },
    {
        path: '/about/contact',
        component: () => import('@/components/user/footers/AboutContact.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        }
    },
    {
        path: '/partner/culture',
        component: () => import('@/components/user/footers/PartnerCulture.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        }
    },
    {
        path: '/partner/edu',
        component: () => import('@/components/user/footers/PartnerEdu.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        }
    },
    {
        path: '/partner/inheritor',
        component: () => import('@/components/user/footers/PartnerInheritor.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        }
    }
];