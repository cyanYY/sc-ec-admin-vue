import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-STAFF-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['STAFF','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('@/views/index/index'),
        meta: { title: '欢迎页', icon: 'dashboard' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/dashboard',
    component: Layout,
    meta: { title: '首页', icon: 'dashboard', key: 'dashboard' },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard', key: 'dashboard' }
      }
    ]
  },
  {
    path: '/waybill',
    component: Layout,
    meta: { title: '运单管理', icon: 'table', key: 'waybill' },
    children: [
      {
        path: '',
        name: 'waybill',
        component: () => import('@/views/waybill/index'),
        meta: { title: '运单管理', icon: 'table', key: 'waybill' }
      }
    ]
  },
  {
    path: '/exception',
    component: Layout,
    meta: { title: '异常运单处理', icon: 'form', key: 'exception' },
    children: [
      {
        path: '',
        name: 'exception',
        component: () => import('@/views/exception/index'),
        meta: { title: '异常运单', icon: 'form', key: 'exception' }
      },
      {
        path: 'todo',
        name: 'todo',
        component: () => import('@/views/exception/todo'),
        meta: { title: '待处理', icon: 'form', key: 'exception:todo' }
      },
      {
        path: 'finish',
        name: 'finish',
        component: () => import('@/views/exception/finish'),
        meta: { title: '已处理', icon: 'table', key: 'exception:finish' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    meta: { title: '订单管理', icon: 'form', key: 'order' },
    children: [
      {
        path: '',
        name: 'order',
        component: () => import('@/views/order/index'),
        meta: { title: '订单管理', icon: 'form', key: 'order' }
      }
    ]
  },
  {
    path: '/receivable',
    component: Layout,
    meta: { title: '应收款运单', icon: 'table', key: 'receivable' },
    children: [
      {
        path: '',
        name: 'receivable',
        component: () => import('@/views/receivable/index'),
        meta: { title: '应收款运单', icon: 'table', key: 'receivable' }
      }
    ]
  },
  // {
  //   path: '/bill',
  //   component: Layout,
  //   meta: { title: '京东账单', icon: 'table', key: 'bill' },
  //   children: [
  //     {
  //       path: '',
  //       name: 'bill',
  //       component: () => import('@/views/bill/index'),
  //       meta: { title: '京东账单', icon: 'table', key: 'bill' }
  //     }
  //   ]
  // },
  {
    path: '/succreport',
    component: Layout,
    meta: { title: '成功率统计', icon: 'table', key: 'succreport' },
    children: [
      {
        path: '',
        name: 'succreport',
        component: () => import('@/views/succreport/index'),
        meta: { title: '成功率统计', icon: 'table', key: 'succreport' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', icon: 'table', key: 'system' },
    children: [
      {
        path: '',
        name: 'system',
        component: () => import('@/views/system/index'),
        meta: { title: '用户管理', icon: 'form', key: 'system' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理', icon: 'form', key: 'system:role' }
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/system/resource'),
        meta: { title: '资源管理', icon: 'form', key: 'system:resource' }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    base: process.env.VUE_APP_ROUTE_PATH,
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
