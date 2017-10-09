/**
 * @desc Router routes
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

import Home from '@/views/Home'
import Login from '@/views/Login'
import PageNotFound from '@/views/Error/404'

const Blog = () => import(/* webpackChunkName: "Blog" */ '@/views/Blog')

export default [
  {
    path: '',
    redirect: {
      name: 'Home'
    },
    meta: {
      hidden: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      hidden: true,
      fullscreen: true
    }
  },
  {
    path: '/404',
    name: 'Page404',
    component: PageNotFound,
    meta: {
      hidden: true,
      fullscreen: true
    }
  },
  {
    path: '/home',
    name: 'Home',
    title: '首页',
    icon: 'home',
    component: Home
  },
  {
    path: '/blog',
    component: Blog,
    meta: {
      title: '博客',
      icon: 'blog',
      hasSubmenu: true
    }
  }
]
