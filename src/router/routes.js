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
const BlogArticles = () => import(/* webpackChunkName: "BlogArticles" */ '@/views/Blog/Articles')
const BlogTags = () => import(/* webpackChunkName: "BlogTags" */ '@/views/Blog/Tags')
const Setting = () => import(/* webpackChunkName: "Setting" */ '@/views/Setting')
const Message = () => import(/* webpackChunkName: "Message" */ '@/views/Message')
const Auth = () => import(/* webpackChunkName: "Auth" */ '@/views/Auth')

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
    component: Home,
    meta: {
      title: '首页',
      icon: 'home'
    }
  },
  {
    path: '/blog',
    component: Blog,
    meta: {
      title: '博客',
      icon: 'blog'
    },
    children: [
      {
        path: 'articles',
        name: 'Blog-Articles',
        component: BlogArticles,
        meta: {
          title: '文章',
          icon: 'article'
        }
      },
      {
        path: 'tag',
        name: 'Blog-Tags',
        component: BlogTags,
        meta: {
          title: '标签',
          icon: 'tag'
        }
      }
    ]
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta: {
      title: '全局设置',
      icon: 'setting'
    }
  },
  {
    path: '/message',
    name: 'Message',
    component: Message,
    meta: {
      title: '消息',
      icon: 'message',
      hidden: true
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: {
      title: '个人信息',
      icon: 'auth',
      hidden: true
    }
  }
]
