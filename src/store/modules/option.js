/**
 * @desc Option store module
 * @author Jooger <zzy1198258955@163.com>
 * @date 10 Oct 2017
 */

'use strict'

import { api } from '@/service'

const FETCH_REQUEST = 'FETCH_REQUEST'
const FETCH_FAILURE = 'FETCH_FAILURE'
const FETCH_SUCCESS = 'FETCH_SUCCESS'
const UPDATE_REQUEST = 'UPDATE_REQUEST'
const UPDATE_FAILURE = 'UPDATE_FAILURE'
const UPDATE_SUCCESS = 'UPDATE_SUCCESS'

export const state = {
  fetching: false,
  editing: false,
  data: null
}

export const getters = {
  option: state => state.data,
  fetching: state => state.fetching,
  editing: state => state.editing
}

export const mutations = {
  [FETCH_REQUEST]: state => (state.fetching = true),
  [FETCH_FAILURE]: state => (state.fetching = false),
  [FETCH_SUCCESS]: (state, data) => {
    state.fetching = false
    state.data = data
  },
  [UPDATE_REQUEST]: state => (state.editing = true),
  [UPDATE_FAILURE]: state => (state.editing = false),
  [UPDATE_SUCCESS]: (state, data) => {
    state.editing = false
    state.data = data
  }
}

export const actions = {
  async fetch ({ commit, state }) {
    if (state.fetching) {
      return
    }
    commit(FETCH_REQUEST)
    const { success, data } = await api.option.fetch().catch(err => ((commit(FETCH_FAILURE, err), {})))
    if (success) {
      commit(FETCH_SUCCESS, data)
    } else {
      commit(FETCH_FAILURE)
    }
    return success
  },
  async update ({ commit, state }, params = {}) {
    if (state.editing) {
      return
    }
    commit(UPDATE_REQUEST)
    const { success, data } = await api.option.update({ data: params }).catch(err => ((commit(UPDATE_FAILURE, err), {})))
    if (success) {
      commit(UPDATE_SUCCESS, data)
    } else {
      commit(UPDATE_FAILURE)
    }
    return success
  }
}
