import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 常规路由
export const routes = [
  {
    path:'',
    redirect:'/login'
  },
  {
    path:'/login', // 登录
    name:'login',
    component: () => import('../view/login/Login.vue')
  }
]
// 权限路由
export const asyncRoutes = [
  {
    path:'/index', // 布局页
    name:'index',
    meta: {
      title: '首页'
    },
    redirect:'/default',
    component:()=>import('../view/home/index.vue'),
    children: [
      {
        path:'/default', // 首页
        meta: {
          title: '首页'
        },
        component: () => import('../view/home/childComps/Default.vue')
      },
      {
        // 导入路由
        path:'/import',
        meta: {
          title: '导入'
        },
        component: () => import ('../view/importInfo/index.vue'),
        children: [
          {
            path:'/importStu', // 导入录取信息
            meta: {
              title: '导入录取信息'
            },
            component: () => import('../view/importInfo/importStu/index.vue')
          },
          {
            path:'/importClass', // 导入班级设置
            meta: {
              title: '导入班级设置'
            },
            component: () => import('../view/importInfo/importClass/index.vue')
          }
        ]
      },
      {
        path:'/find',
        meta: {
          title: '查询'
        },
        component: () => import('../view/findInfo/index.vue'),
        children: [
          {
            path:'/findStu',
            meta: {
              title: '学生信息查询'
            },
            component: () => import('../view/findInfo/findStu/index.vue')
          },
          {
            path:'/findClassDetail',
            meta: {
              title: '查询分班信息'
            },
            component: () => import('../view/findInfo/findClassDetail/index.vue')
          },
          {
            path:'/findAllClassSitu',
            meta: {
              title: '统计分班信息'
            },
            component: () => import('../view/findInfo/findAllClassSitu/index.vue')
          }
        ]
      },
      {
        path:'/create',
        meta: {
          title: '生成'
        },
        component: () => import('../view/create/index.vue'),
        children: [
          {
            path:'/createBook',
            meta: {
              title: '生成录取通知书'
            },
            component: () => import('../view/create/createBook/index.vue')
          }
        ]
      }

    ]
  }
]


const router = new VueRouter({
  routes,
  mode:'history',
})

export default router;