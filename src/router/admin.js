export const adminRoutes = [
    {
        path: 'login',
        component: () => import('@/components/admin/login/adminLogin.vue'),
        meta: { layout: 'admin',showNavFooter: false,ifshow:false }
    },
    {
        path: 'adminUser',
        component: () => import('@/components/admin/adminUser/AdminUser.vue'),
        meta: { layout: 'admin',showNavFooter: false, ifshow: true  }
    },
    {
        path: 'learn',
        component: () => import('@/components/admin/adminLearnModule/AdminLearnModule.vue'),
        meta: { layout: 'admin', showNavFooter: false, ifshow: true  }
    },
    {
        path: 'static',
        component: () => import('@/components/admin/adminStatic/adminStatic.vue'),
        meta: { layout: 'admin', showNavFooter: false, ifshow: true  }
    }
    ,
    {
        path: 'log',
        component: () => import('@/components/admin/adminLog/adminLog.vue'),
        meta: { layout: 'admin', showNavFooter: false, ifshow: true  }
    },
    {
        path: 'quiz',
        component: () => import('@/components/admin/adminQuiz/adminManage.vue'),
        meta: { layout: 'admin', showNavFooter: false, ifshow: true  }
    }
    ,
    {
        path: 'quiz-report',
        component: () => import('@/components/admin/adminQuiz/adminReport.vue'),
        meta: { layout: 'admin', showNavFooter: false, ifshow: true  }
    },
    {
        path: 'quiz-record',
        component: () => import('@/components/admin/adminQuiz/adminRecord.vue'),
        meta: { layout: 'admin', showNavFooter: false, ifshow: true  }
    },
    {
        path: 'quiz-mistake',
        component: () => import('@/components/admin/adminQuiz/adminMistake.vue'),
        meta: { layout: 'admin', showNavFooter: false, ifshow: true  }
    },
    {
        path: 'quiz-module',
        component: () => import('@/components/admin/adminQuiz/adminModule.vue'),
        meta: { layout: 'admin', showNavFooter: false, ifshow: true  }
    
    },
    {
        path: 'behavior',
        component: () => import('@/components/admin/adminBehavior/adminBehavior.vue'),
        meta: { layout: 'admin', showNavFooter: false, ifshow: true  }
    }
];
