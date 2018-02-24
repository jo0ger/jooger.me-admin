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
const BlogArticleDetail = () => import(/* webpackChunkName: "BlogArticleDetail" */ '@/views/Blog/ArticleDetail')
const BlogArticleCreate = () => import(/* webpackChunkName: "BlogArticleCreate" */ '@/views/Blog/ArticleCreate')
const BlogCategories = () => import(/* webpackChunkName: "BlogCategories" */ '@/views/Blog/Categories')
const BlogTags = () => import(/* webpackChunkName: "BlogTags" */ '@/views/Blog/Tags')
const Setting = () => import(/* webpackChunkName: "Setting" */ '@/views/Setting')
const Auth = () => import(/* webpackChunkName: "Auth" */ '@/views/Auth')
const Moment = () => import(/* webpackChunkName: "Moment" */ '@/views/Moment')

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
    path: '/moments',
    name: 'Moments',
    component: Moment,
    meta: {
      title: '个人动态',
      icon: 'moment',
      action: {
        create: true
      }
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
          icon: 'article',
          action: {
            create: true
          }
        }
      },
      {
        path: 'articles/create',
        name: 'Blog-ArticleCreate',
        component: BlogArticleCreate,
        meta: {
          title: '新建文章',
          icon: 'article-create',
          hidden: true
        }
      },
      {
        path: 'articles/:articleId',
        name: 'Blog-ArticleDetail',
        component: BlogArticleDetail,
        meta: {
          title: '文章详情',
          icon: 'article-detail',
          hidden: true,
          action: {
            create: true,
            comment: true
          }
        }
      },
      {
        path: 'category',
        name: 'Blog-BlogCategories',
        component: BlogCategories,
        meta: {
          title: '分类',
          icon: 'category',
          action: {
            create: true
          }
        }
      },
      {
        path: 'tag',
        name: 'Blog-Tags',
        component: BlogTags,
        meta: {
          title: '标签',
          icon: 'tag',
          action: {
            create: true
          }
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
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: {
      title: '个人信息',
      icon: 'user-info',
      hidden: true
    }
  },
  {
    path: '*',
    name: 'PageNotFound',
    redirect: {
      name: 'Page404'
    },
    meta: {
      hidden: true
    }
  }
]
