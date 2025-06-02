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
        }
    },


    {
        path: '/evaluation',
        component: () => import('@/components/user/evaluation/EvaluationPage.vue'),
        meta: {
            layout: 'user',
            showNavFooter: true
        },
        children: [{
                path: 'quiz', // 在线测评
                component: () => import('@/components/user/evaluation/QuizPage.vue'),
                meta: {
                    title: '在线测评'
                }
            },
            {
                path: 'records', // 答题记录
                component: () => import('@/components/user/evaluation/RecordsPage.vue'),
                meta: {
                    title: '答题记录'
                }
            },
            {
                path: 'report', // 测评报告
                component: () => import('@/components/user/evaluation/ReportPage.vue'),
                meta: {
                    title: '测评报告'
                }
            },
            {
                path: 'wrongbook', // 错题本
                component: () => import('@/components/user/evaluation/WrongBookPage.vue'),
                meta: {
                    title: '错题本'
                }
            }
        ]
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