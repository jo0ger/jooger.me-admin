/**
 * @desc App's global data
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

const SET_ROUTES = 'SET_ROUTES'
const SET_ASIDE_COLLAPSE = 'SET_ASIDE_COLLAPSE'
const SET_ACTION_BUTTON_VISIBLE = 'SET_ACTION_BUTTON_VISIBLE'

const getDefaultButtonVisible = () => ({
  goToTop: false,
  create: false,
  comment: false
})

export const state = {
  routes: [],
  asideCollapse: false,
  actionButtonVisible: getDefaultButtonVisible()
}

export const getters = {
  routes: state => state.routes,
  routesMenu: state => getMenu(state.routes),
  asideCollapse: state => state.asideCollapse,
  actionButtonVisible: state => state.actionButtonVisible
}

export const mutations = {
  [SET_ROUTES]: (state, routes = []) => {
    state.routes = routes
  },
  [SET_ASIDE_COLLAPSE]: (state, status = false) => {
    state.asideCollapse = status
  },
  [SET_ACTION_BUTTON_VISIBLE]: (state, visible = {}) => {
    for (let key in visible) {
      if (state.actionButtonVisible.hasOwnProperty(key)) {
        state.actionButtonVisible[key] = visible[key]
      }
    }
  }
}

function getMenu (routes = []) {
  return routes.map(route => {
    route = Object.assign({}, route)
    if (!route.meta || !route.meta.hidden) {
      if (route.children) {
        route.children = getMenu(route.children)
      }
      return route
    }
    return null
  }).filter(route => !!route)
}
