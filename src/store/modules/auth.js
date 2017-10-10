/**
 * @desc 登录用户module
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

import config from '@/config'
import { api } from '@/service'
import {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem
} from '@/utils'

const LOGIN_REQUEST = 'LOGIN_REQUEST'
const LOGIN_FAILURE = 'LOGIN_FAILURE'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const CLEAR_INFO = 'CLEAR_INFO'
const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
const LOGOUT_FAILURE = 'LOGOUT_FAILURE'
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
const FETCH_INFO_REQUEST = 'FETCH_INFO_REQUEST'
const FETCH_INFO_FAILURE = 'FETCH_INFO_FAILURE'
const FETCH_INFO_SUCCESS = 'FETCH_INFO_SUCCESS'
const EDIT_INFO_REQUEST = 'EDIT_INFO_REQUEST'
const EDIT_INFO_FAILURE = 'EDIT_INFO_FAILURE'
const EDIT_INFO_SUCCESS = 'EDIT_INFO_SUCCESS'

let localAuthInfo = null

try {
  localAuthInfo = JSON.parse(getLocalStorageItem(config.auth.authInfoCacheKey))
} catch (error) {
  localAuthInfo = {}
}

// const getTokenFromLocal = () => getLocalStorageItem(config.auth.authTokenKey)

const getDefaultInfo = () => ({ ...localAuthInfo })

export const state = {
  loading: false,
  info: getDefaultInfo(),
  token: null
}

export const getters = {
  loading: state => state.loading,
  info: state => state.info,
  token: state => state.token,
  isLogin: state => !!state.token
}

export const mutations = {
  [LOGIN_REQUEST]: state => (state.loading = true),
  [LOGIN_FAILURE]: state => (state.loading = false),
  [LOGIN_SUCCESS]: (state, token) => {
    state.loading = false
    state.token = token
  },
  [CLEAR_INFO]: state => {
    state.info = getDefaultInfo()
    state.token = ''
    state.loading = false
  },
  [LOGOUT_REQUEST]: state => (state.loading = true),
  [LOGOUT_FAILURE]: state => (state.loading = false),
  [LOGOUT_SUCCESS]: state => (state.loading = false),
  [FETCH_INFO_REQUEST]: state => (state.loading = true),
  [FETCH_INFO_FAILURE]: state => {
    state.loading = false
    state.token = ''
  },
  [FETCH_INFO_SUCCESS]: (state, { token, info }) => {
    state.loading = false
    state.info = info
    state.token = token
  },
  [EDIT_INFO_REQUEST]: state => (state.loading = true),
  [EDIT_INFO_FAILURE]: state => (state.loading = false),
  [EDIT_INFO_SUCCESS]: (state, data) => {
    state.loading = false
    state.info = data
  }
}

export const actions = {
  async login ({ commit, dispatch, state }, params = {}) {
    if (state.loading) {
      return
    }
    commit(LOGIN_REQUEST)
    const { success, data } = await api.auth.login({ data: params }).catch(err => commit(LOGIN_FAILURE, err))
    if (success) {
      console.log(state)
      commit(LOGIN_SUCCESS, data.token)
      setLocalStorageItem(config.auth.authTokenKey, data.token)
      await dispatch('getInfo')
    } else {
      commit(LOGIN_FAILURE)
    }
    return success
  },
  async logout ({ commit, dispatch, state }, params = {}) {
    if (state.loading) {
      return
    }
    commit(LOGOUT_REQUEST)
    const { success } = await api.auth.logout().catch(err => commit(LOGOUT_FAILURE, err))
    if (success) {
      dispatch('clearAuthInfo')
      commit(LOGOUT_SUCCESS)
    } else {
      commit(LOGOUT_FAILURE)
    }
    return success
  },
  async getInfo ({ commit, state }) {
    if (state.loading) {
      return
    }
    commit(FETCH_INFO_REQUEST)
    const { success, data } = await api.auth.info().catch(err => {
      commit(FETCH_INFO_FAILURE, err)
    })
    if (success) {
      setLocalStorageItem(config.auth.authInfoCacheKey, data.info)
      commit(FETCH_INFO_SUCCESS, data)
    } else {
      commit(FETCH_INFO_FAILURE)
    }
    return success
  },
  async editInfo ({ commit, state }, params = {}) {
    if (state.loading || !state.info._id) {
      return
    }
    commit(EDIT_INFO_REQUEST)
    const { success, data } = await api.user.update(state.info._id)({ data: params }).catch(err => commit(EDIT_INFO_FAILURE, err))
    if (success) {
      commit(EDIT_INFO_SUCCESS, data)
    } else {
      commit(EDIT_INFO_FAILURE)
    }
    return success
  },
  clearAuthInfo ({ commit }) {
    removeLocalStorageItem(config.auth.authTokenKey)
    commit(CLEAR_INFO)
  }
}
