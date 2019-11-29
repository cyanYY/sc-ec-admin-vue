import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
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
    redirect: 'waybill',
    children: [
      {
        path: 'waybill',
        name: 'waybill',
        component: () => import('@/views/waybill/index'),
        meta: { title: '运单管理', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/exception',
    component: Layout,
    meta: { title: '异常运单处理', icon: 'form' },
    children: [
      {
        path: '',
        name: 'todo',
        component: () => import('@/views/waybill/todo'),
        meta: { title: '待处理', icon: 'form' }
      },
      {
        path: 'finish',
        name: 'finish',
        component: () => import('@/views/waybill/finish'),
        meta: { title: '已处理', icon: 'form' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: '',
        name: 'waybill_order',
        component: () => import('@/views/waybill/order'),
        meta: { title: '订单管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/receivable',
    component: Layout,
    children: [
      {
        path: '',
        name: 'receivable',
        component: () => import('@/views/waybill/receivable'),
        meta: { title: '应收款运单', icon: 'table' }
      }
    ]
  },
  {
    path: '/bill',
    component: Layout,
    children: [
      {
        path: '',
        name: 'bill',
        component: () => import('@/views/waybill/bill'),
        meta: { title: '京东账单', icon: 'table' }
      }
    ]
  },
  {
    path: '/succReport',
    component: Layout,
    children: [
      {
        path: '',
        name: 'succReport',
        component: () => import('@/views/waybill/succReport'),
        meta: { title: '成功率统计', icon: 'form' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
