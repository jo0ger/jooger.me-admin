/**
 * @desc 登录用户module
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

export const state = {
  info: {},
  token: null
}

export const getters = {
  info: state => state.info,
  isLogin: state => !!state.token
}
