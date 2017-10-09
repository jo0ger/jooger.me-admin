/**
 * @desc Router routes
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

import Login from '@/views/Login/index'

export default [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      hidden: true,
      fullscreen: true
    }
  }
]
