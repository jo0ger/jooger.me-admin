/**
 * @desc App's global data
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

const SET_ROUTES = 'SET_ROUTES'

export const state = {
  routes: []
}

export const getters = {
  routes: state => state.routes
}

export const mutations = {
  [SET_ROUTES]: (state, routes = []) => {
    state.routes = routes
  }
}
