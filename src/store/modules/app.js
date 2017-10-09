/**
 * @desc App's global data
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

const SET_ROUTES = 'SET_ROUTES'
const SET_ASIDE_COLLAPSE = 'SET_ASIDE_COLLAPSE'

export const state = {
  routes: [],
  asideCollapse: false
}

export const getters = {
  routes: state => state.routes,
  asideCollapse: state => state.asideCollapse
}

export const mutations = {
  [SET_ROUTES]: (state, routes = []) => {
    state.routes = routes
  },
  [SET_ASIDE_COLLAPSE]: (state, status = false) => {
    state.asideCollapse = status
  }
}
