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
  }
]

export const asyncRoutes = [
  {
    path: '/',
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
      },
      {
        path: 'exceed',
        name: 'exceed',
        component: () => import('@/views/waybill/exceed'),
        meta: { title: '超区运单', icon: 'table', key: 'waybill:exceed' }
      },
      {
        path: 'deliver',
        name: 'deliver',
        component: () => import('@/views/waybill/deliver'),
        meta: { title: '发货统计', icon: 'table', key: 'waybill:deliver' }
      },
      {
        path: 'deliverDetail',
        name: 'deliverDetail',
        component: () => import('@/views/waybill/deliverDetail'),
        meta: { title: '发货单明细', icon: 'table', key: 'waybill:deliverDetail' }
      },
      {
        path: 'deliverRepeat',
        name: 'deliverRepeat',
        component: () => import('@/views/waybill/deliverRepeat'),
        meta: { title: '发货重复运单', icon: 'table', key: 'waybill:deliverRepeat' }
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
  // {
  //   path: '/order-process',
  //   component: Layout,
  //   meta: { title: '退款订单处理', icon: 'form', key: 'order-process' },
  //   children: [
  //     {
  //       path: '',
  //       name: 'order-process',
  //       component: () => import('@/views/order-process/index'),
  //       meta: { title: '退款订单', icon: 'form', key: 'order-process:index' }
  //     },
  //     {
  //       path: 'todo',
  //       name: 'order-process-todo',
  //       component: () => import('@/views/order-process/todo'),
  //       meta: { title: '待处理', icon: 'form', key: 'order-process:todo' }
  //     },
  //     {
  //       path: 'finish',
  //       name: 'order-process-finish',
  //       component: () => import('@/views/order-process/finish'),
  //       meta: { title: '已处理', icon: 'table', key: 'order-process:finish' }
  //     }
  //   ]
  // },
  {
    path: '/order',
    component: Layout,
    meta: { title: '订单管理', icon: 'form', key: 'order' },
    children: [
      {
        path: '',
        name: 'order',
        component: () => import('@/views/order/index'),
        meta: { title: '订单管理', icon: 'form', key: 'order:index' }
      },
      {
        path: 'repeat',
        name: 'repeat',
        component: () => import('@/views/order/repeat'),
        meta: { title: '重复单', icon: 'form', key: 'order:repeat' }
      },
      {
        path: 'multi',
        name: 'multi',
        component: () => import('@/views/order/multi'),
        meta: { title: '多台订单', icon: 'form', key: 'order:multi' }
      },
      {
        path: 'scalp',
        name: 'scalp',
        component: () => import('@/views/order/scalp'),
        meta: { title: '刷单订单', icon: 'form', key: 'order:scalp' }
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
    meta: { title: '统计报表', icon: 'table', key: 'succreport' },
    children: [
      {
        path: '',
        name: 'succreport',
        component: () => import('@/views/succreport/index'),
        meta: { title: '成功率统计', icon: 'table', key: 'succreport:index' }
      },
      {
        path: 'profit',
        name: 'profit',
        component: () => import('@/views/succreport/profit'),
        meta: { title: '利润报表', icon: 'table', key: 'succreport:profit' }
      },
      {
        path: 'deliver',
        name: 'deliver',
        component: () => import('@/views/succreport/deliver'),
        meta: { title: '发货统计', icon: 'table', key: 'succreport:deliver' }
      }
    ]
  },
  {
    path: '/stock',
    component: Layout,
    meta: { title: '库存管理', icon: 'table', key: 'stock' },
    children: [
      {
        path: '',
        name: 'stock',
        component: () => import('@/views/stock/index'),
        meta: { title: '库存管理', icon: 'table', key: 'stock:index' }
      },
      {
        path: 'overtime',
        name: 'overtime',
        component: () => import('@/views/stock/overtime'),
        meta: { title: '超时运单', icon: 'table', key: 'stock:overtime' }
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/views/stock/goods'),
        meta: { title: '商品管理', icon: 'table', key: 'stock:goods' }
      },
      {
        path: 'refund',
        name: 'refund',
        component: () => import('@/views/stock/refund'),
        meta: { title: '退货扫码', icon: 'table', key: 'stock:refund' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', icon: 'table', key: 'system' },
    children: [
      {
        path: 'sms',
        name: 'sms',
        component: () => import('@/views/system/sms'),
        meta: { title: '短信模板管理', icon: 'form', key: 'system:sms' }
      },
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
