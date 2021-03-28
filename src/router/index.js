import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

var router = new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/',
      component: () => import('../components/common/Home.vue'),
      children: [{
          path: '/flightData',
          component: () => import('../components/trainingData/flightData.vue'),
          meta: {
            title: '航班数据'
          }
        },
        {
          path: '/gateData',
          component: () => import('../components/trainingData/gateData.vue'),
          meta: {
            title: '机位数据'
          }
        },
        {
          path: '/limitOfPushback',
          component: () => import('../components/rule/limitOfPushback.vue'),
          meta: {
            title: '同区域滑入推出限制'
          }
        },
        {
          path: '/LimitOfAircraft_type',
          component: () => import('../components/rule/limitOfaircraft.vue'),
          meta: {
            title: '机位机型限制'
          }
        },
        {
          path: '/LimitOfairline',
          component: () => import('../components/rule/limitOfairline.vue'),
          meta: {
            title: '航司机位限制'
          }
        },
        {
          path: '/LimitOfbridge',
          component: () => import('../components/rule/limitOfbridge.vue'),
          meta: {
            title: '航司靠桥率限制'
          }
        },
        {
          path: '/timeParameter',
          component: () => import('../components/rule/timeParameter.vue'),
          meta: {
            title: '时间参数配置'
          }
        },
        {
          path: '/flightPriority',
          component: () => import('../components/rule/flightPriority.vue'),
          meta: {
            title: '航班任务优先级配置'
          }
        },
        {
          path: '/parkinggatePriority',
          component: () => import('../components/rule/parkinggatePriority.vue'),
          meta: {
            title: '机位资源优先级配置'
          }
        },
        {
          path: '/gateAssignments',
          component: () => import('../components/assign/gateAssignments.vue'),
          meta: {
            title: '机位分配'
          }
        },
        {
          path: '/resultDiagnios',
          component: () => import('../components/resultEvalution/resultDiagnios.vue'),
          meta: {
            title: '结果诊断'
          }
        },
        {
          path: '/statistics',
          component: () => import('../components/resultEvalution/statistics.vue'),
          meta: {
            title: '统计数据'
          }
        },
        {
          path: '/uesrsManage',
          component: () => import('../components/uesrsManage/usersManage.vue'),
          meta: {
            title: '用户管理'
          }
        },
      ]
    },
    {
      path: '/login',
      component: () => import( /* webpackChunkName: "login" */ '../components/login/Login.vue'),
      meta: {
        title: '登录'
      }
    },
    // {
    //   path: '*',
    //   redirect: '/404'
    // }
  ]
});

//挂载路由导航守卫-只能从登录也蛮进入系统
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是个函数 表示放行 next()--放行 next('/login)--强制跳转
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

// 把路由对象暴露出去
export default router
