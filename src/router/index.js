/**
 * @desc Router entry
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
import routes from './routes'
import { isType } from '@/utils'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes,
  linkActiveClass: 'active'
})

export default router

export {
  routes
}

export const composeWithStore = store => {
  router.beforeEach(async (to, from, next) => {
    const _next = (config) => {
      if (config !== false) {
        // TODO: 页面切换显示页面Loading
        // AppLoadingBar.start()
      }
      store.commit('app/SET_ACTION_BUTTON_VISIBLE', Object.assign({}, to.meta ? to.meta.action : null))
      next(config)
    }

    if (!store.getters['auth/isLogin']) {
      await store.dispatch('auth/getInfo')
    }

    if (store.getters['auth/isLogin']) {
      // 已登录
      if (to.name === 'Login') {
        // 已登录 && To login page
        Message.info('已登录')
        if (from.name) {
          // 从别的页面通过路由跳转（浏览器前进后退）
          return _next(false)
        } else {
          // 直接从地址栏输入/login回车跳转
          return _next({ name: 'Home' })
        }
      }
    } else {
      // 未登录
      if (to.name !== 'Login') {
        if (from.name) {
          Message.warning('请先登录')
        }
        if (from.name === 'Login') {
          return _next(false)
        }
        const query = {}
        if (to.name) {
          query.redirect_uri_name = to.name
        }
        if (Object.keys(to.params).length) {
          query.redirect_params = JSON.stringify(to.params)
        }
        if (Object.keys(to.query).length) {
          query.redirect_query = JSON.stringify(to.query)
        }
        return _next({ name: 'Login', query })
      }
    }

    if (!store.getters['app/routes'].length) {
      store.commit('app/SET_ROUTES', routes)
    }
    _next()
  })

  router.afterEach((to, from) => {
    // TODO: 页面切换结束隐藏页面Loading
    // AppLoadingBar.finish()
    // ActionButtons组件适配
    const toAction = to.meta && to.meta.action ? to.meta.action : {}
    const fromAction = from.meta && from.meta.action ? from.meta.action : {}
    const action = {}
    for (let key in fromAction) {
      if (toAction.hasOwnProperty(key)) {
        action[key] = toAction[key]
      } else {
        if (isType(fromAction[key], 'Boolean')) {
          action[key] = !fromAction[key]
        }
      }
    }
    store.commit('app/SET_ACTION_BUTTON_VISIBLE', action)
  })
}
