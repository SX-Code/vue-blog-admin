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
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    children: [{
      path: 'index',
      name: 'Profile',
      component: () => import('@/views/profile'),
      meta: { title: '个人信息', icon: 'dashboard' }
    }],
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '后台管理系统', icon: 'dashboard' }
    }]
  },

  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/list',
    name: 'Blog',
    meta: { title: '博客管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'ArticleList',
        component: () => import('@/views/blog/list/index'),
        meta: { title: '博客列表', icon: 'list-ul' }
      },
      {
        path: 'create',
        component: () => import('@/views/blog/add/create'),
        name: 'CreateArticle',
        meta: { title: '添加博客', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/blog/add/edit'),
        name: 'EditArticle',
        meta: { title: '编辑博客', noCache: true, activeMenu: '/blog/list' },
        hidden: true
      }
    ]
  },

  {
    path: '/type',
    component: Layout,
    alwaysShow: false,
    children: [
      {
        path: 'index',
        name: 'Type',
        component: () => import('@/views/type/index'),
        meta: { title: '类型管理', icon: 'type' }
      }
    ]
  },
  {
    path: '/tag',
    component: Layout,
    alwaysShow: false,
    children: [
      {
        path: 'index',
        name: 'Tag',
        component: () => import('@/views/tag/index'),
        meta: { title: '标签管理', icon: 'tag' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/SX-Code/vue-blog-admin',
        meta: { title: 'GitHub地址', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  base: '/vue_blog/',
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
