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
    }
];
