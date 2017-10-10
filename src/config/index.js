/**
 * @desc 配置参数
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

export default {
  auth: {
    authCookieKey: 'jooger.me.sid',
    authTokenKey: 'jooger.me.token',
    authInfoCacheKey: 'jooger.me.info'
  },
  storage: {
    userKey: 'jooger.me.user',
    userLikeKey: 'jooger.me.history'
  },
  service: {
    url: '/',
    method: 'get',
    baseURL: __PROD__ ? 'http://api.jooger.me/api' : 'http://localhost:3001/api',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json'
    },
    withCredentials: true,
    timeout: 120000,
    responseType: 'json'
  }
}
