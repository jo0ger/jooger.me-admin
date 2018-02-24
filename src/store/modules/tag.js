/**
 * @desc Tag store module
 * @author Jooger <zzy1198258955@163.com>
 * @date 10 Oct 2017
 */

'use strict'

import { api } from '@/service'

const FETCH_LIST_REQUEST = 'FETCH_lIST_REQUEST'
const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS'
const FETCH_LIST_FAILURE = 'FETCH_LIST_FAILURE'
const FETCH_ITEM_REQUEST = 'FETCH_ITEM_REQUEST'
const FETCH_ITEM_SUCCESS = 'FETCH_ITEM_SUCCESS'
const FETCH_ITEM_FAILURE = 'FETCH_ITEM_FAILURE'
const EDIT_ITEM_REQUEST = 'EDIT_ITEM_REQUEST'
const EDIT_ITEM_SUCCESS = 'EDIT_ITEM_SUCCESS'
const EDIT_ITEM_FAILURE = 'EDIT_ITEM_FAILURE'
const DELETE_ITEM_REQUEST = 'FETCH_LIST_REQUEST'
const DELETE_ITEM_SUCCESS = 'DELETE_ITEM_SUCCESS'
const DELETE_ITEM_FAILURE = 'DELETE_ITEM_FAILURE'
const CREATE_ITEM_REQUEST = 'CREATE_ITEM_REQUEST'
const CREATE_ITEM_FAILURE = 'CREATE_ITEM_FAILURE'
const CREATE_ITEM_SUCCESS = 'CREATE_ITEM_SUCCESS'

export const state = {
  list: {
    fetching: false,
    deleting: false,
    creating: false,
    data: []
  },
  detail: {
    fetching: false,
    editing: false,
    data: null
  }
}

export const getters = {
  list: state => state.list.data,
  listFetching: state => state.list.fetching,
  listDeleting: state => state.list.deleting,
  listCreating: state => state.list.creating,
  detailEditing: state => state.detail.editing,
  detailFetching: state => state.detail.fetching
}

export const mutations = {
  [FETCH_LIST_REQUEST]: state => (state.list.fetching = true),
  [FETCH_LIST_FAILURE]: state => (state.list.fetching = false),
  [FETCH_LIST_SUCCESS] (state, list) {
    state.list.fetching = false
    state.list.data = list
  },
  [EDIT_ITEM_REQUEST]: state => (state.detail.editing = true),
  [EDIT_ITEM_FAILURE]: state => (state.detail.editing = false),
  [EDIT_ITEM_SUCCESS]: (state, data) => {
    state.detail.editing = false
    const index = state.list.data.findIndex(item => item._id === data._id)
    data = Object.assign({}, state.list.data[index], data)
    if (state.detail) {
      state.detail.data = data
    }
    if (index > -1) {
      state.list.data.splice(index, 1, data)
    }
  },
  [DELETE_ITEM_REQUEST]: state => (state.list.deleting = true),
  [DELETE_ITEM_FAILURE]: state => (state.list.deleting = false),
  [DELETE_ITEM_SUCCESS]: (state, id) => {
    state.list.deleting = false
    const index = state.list.data.findIndex(item => item._id === id)
    if (index > -1) {
      state.list.data.splice(index, 1)
    }
    if (state.detail.data && state.detail.data._id === id) {
      state.detail = {
        fetching: false,
        editing: false,
        data: null
      }
    }
  },
  [CREATE_ITEM_REQUEST]: state => (state.list.creating = true),
  [CREATE_ITEM_FAILURE]: state => (state.list.creating = false),
  [CREATE_ITEM_SUCCESS]: (state, data) => {
    state.list.creating = false
    state.list.data.unshift(Object.assign(data, {
      count: 0
    }))
  }
}

export const actions = {
  async fetchList ({ commit, state }, params = {}) {
    if (state.list.fetching) {
      return
    }
    commit(FETCH_LIST_REQUEST)
    const { success, data } = await api.tag.list({ params }).catch(err => ((commit([FETCH_LIST_FAILURE], err), {})))
    if (success) {
      commit(FETCH_LIST_SUCCESS, data)
    } else {
      commit(FETCH_LIST_FAILURE)
    }
  },
  async fetchDetail ({ commit, state }, id) {
    if (state.list.fetching) {
      return
    }
    commit(FETCH_ITEM_REQUEST)
    const { success, data } = await api.tag.detail(id)().catch(err => ((commit([FETCH_ITEM_FAILURE], err), {})))
    if (success) {
      commit(FETCH_ITEM_SUCCESS, data)
    } else {
      commit(FETCH_ITEM_FAILURE)
    }
  },
  async create ({ commit, state }, params = {}) {
    if (state.list.creating) {
      return
    }
    commit(CREATE_ITEM_REQUEST)
    const { success, data } = await api.tag.create({ data: params }).catch(err => ((commit([CREATE_ITEM_FAILURE], err), {})))
    if (success) {
      commit(CREATE_ITEM_SUCCESS, data)
    } else {
      commit(CREATE_ITEM_FAILURE)
    }
    return success
  },
  async edit ({ commit, state }, { id, model = null }) {
    if (state.list.editing) {
      return
    }
    commit(EDIT_ITEM_REQUEST)
    const { success, data } = await api.tag.update(id)({ data: { ...model } }).catch(err => ((commit([EDIT_ITEM_FAILURE], err), {})))
    if (success) {
      commit(EDIT_ITEM_SUCCESS, data)
    } else {
      commit(EDIT_ITEM_FAILURE)
    }
    return success
  },
  async delete ({ commit, state }, id) {
    if (state.list.deleting) {
      return
    }
    commit(DELETE_ITEM_REQUEST)
    const { success } = await api.tag.delete(id)().catch(err => ((commit([DELETE_ITEM_FAILURE], err), {})))
    if (success) {
      commit(DELETE_ITEM_SUCCESS, id)
    } else {
      commit(DELETE_ITEM_FAILURE)
    }
    return success
  }
}
