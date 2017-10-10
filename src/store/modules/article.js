/**
 * @desc Article store module
 * @author Jooger <zzy1198258955@163.com>
 * @date 10 Oct 2017
 */

'use strict'

import { api } from '@/service'

const FETCH_LIST_REQUEST = 'FETCH_LIST_REQUEST'
const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS'
const FETCH_LIST_FAILURE = 'FETCH_LIST_FAILURE'
const FETCH_ITEM_REQUEST = 'FETCH_ITEM_REQUEST'
const FETCH_ITEM_SUCCESS = 'FETCH_ITEM_SUCCESS'
const FETCH_ITEM_FAILURE = 'FETCH_ITEM_FAILURE'
const EDIT_ITEM_REQUEST = 'EDIT_ITEM_REQUEST'
const EDIT_ITEM_FAILURE = 'EDIT_ITEM_FAILURE'
const EDIT_ITEM_SUCCESS = 'EDIT_ITEM_SUCCESS'
const CLEAR_DETAIL = 'CLEAR_DETAIL'
const LIKE_ITEM_REQUEST = 'LIKE_ITEM_REQUEST'
const LIKE_ITEM_SUCCESS = 'LIKE_ITEM_SUCCESS'
const LIKE_ITEM_FAILURE = 'LIKE_ITEM_FAILURE'
const CREATE_ITEM_REQUEST = 'CREATE_ITEM_REQUEST'
const CREATE_ITEM_FAILURE = 'CREATE_ITEM_FAILURE'
const CREATE_ITEM_SUCCESS = 'CREATE_ITEM_SUCCESS'
const DELETE_ITEM_REQUEST = 'DELETE_ITEM_REQUEST'
const DELETE_ITEM_FAILURE = 'DELETE_ITEM_FAILURE'
const DELETE_ITEM_SUCCESS = 'DELETE_ITEM_SUCCESS'

export const state = () => ({
  list: {
    fetching: false,
    deleting: false,
    creating: false,
    data: [],
    pagination: {}
  },
  detail: {
    fetching: false,
    editing: false,
    liking: false,
    data: null,
    likes: [],
    isLiked: false
  }
})

export const getters = {
  list: state => state.list.data,
  listFetching: state => state.list.fetching,
  pagination: state => state.list.pagination,
  detail: state => state.detail.data,
  detailFetching: state => state.detail.fetching,
  detailEditing: state => state.detail.editing,
  detailLiking: state => state.detail.liking,
  detailLikes: state => state.detail.likes,
  detailLiked: state => state.detail.isLiked
}

export const mutations = {
  [FETCH_LIST_REQUEST]: state => (state.list.fetching = true),
  [FETCH_LIST_FAILURE]: state => (state.list.fetching = false),
  [FETCH_LIST_SUCCESS]: (state, { list, pagination }) => {
    state.list.fetching = false
    state.list.data = list
    state.list.pagination = pagination
  },
  [FETCH_ITEM_REQUEST]: state => (state.detail.fetching = true),
  [FETCH_ITEM_FAILURE]: state => (state.detail.fetching = false),
  [FETCH_ITEM_SUCCESS]: (state, data) => {
    state.detail.fetching = false
    state.detail.data = data
  },
  [CLEAR_DETAIL]: state => {
    state.detail.fetching = false
    state.detail.liking = false
    state.detail.data = null
    state.detail.likes = []
    state.detail.isLiked = false
  },
  [EDIT_ITEM_REQUEST]: state => (state.detail.editing = true),
  [EDIT_ITEM_FAILURE]: state => (state.detail.editing = false),
  [EDIT_ITEM_SUCCESS]: (state, data) => {
    state.detail.editing = false
    if (state.detail) {
      state.detail.data = data
    }
    const index = state.list.data.findIndex(item => item._id === data._id)
    if (index > -1) {
      state.list.data.splice(index, 1, data)
    }
  },
  [LIKE_ITEM_REQUEST]: state => (state.detail.liking = true),
  [LIKE_ITEM_FAILURE]: state => (state.detail.liking = false),
  [LIKE_ITEM_SUCCESS]: (state, data) => {
    state.detail.liking = false
    if (state.detail.reactions) {
      state.detail.reactions.heart++
    }
    const article = state.list.data.findIndex(item => item.id === state.detail.id)
    article && article.reactions && article.reactions.heart++
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
        liking: false,
        data: null,
        likes: [],
        isLiked: false
      }
    }
  },
  [CREATE_ITEM_REQUEST]: state => (state.list.creating = true),
  [CREATE_ITEM_FAILURE]: state => (state.list.creating = false),
  [CREATE_ITEM_SUCCESS]: (state, data) => {
    state.list.creating = false
    state.list.data.unshift(data)
  }
}

export const actions = {
  async fetchList ({ commit, state }, params = {}) {
    if (state.list.fetching) {
      return
    }
    commit(FETCH_LIST_REQUEST)
    const { success, data } = await api.article.list({ params }).catch(err => commit(FETCH_LIST_FAILURE, err))
    if (success) {
      commit(FETCH_LIST_SUCCESS, data)
    } else {
      commit(FETCH_LIST_FAILURE)
    }
    return success
  },
  async fetchDetail ({ commit, state }, id) {
    if (state.detail.fetching) {
      return
    }
    commit(FETCH_ITEM_REQUEST)
    const { success, data } = await api.article.item(id)().catch(err => commit(FETCH_ITEM_FAILURE, err))
    if (success) {
      commit(FETCH_ITEM_SUCCESS, data)
    } else {
      commit(FETCH_ITEM_FAILURE)
    }
    return success
  },
  async edit ({ commit, state }, { id, model = null }) {
    if (state.detail.editing || !id || model === null) {
      return
    }
    commit(EDIT_ITEM_REQUEST)
    const { success, data } = await api.article.update(id)({ data: { ...model } }).catch(err => commit(EDIT_ITEM_FAILURE, err))
    if (success) {
      commit(EDIT_ITEM_SUCCESS, data)
    } else {
      commit(EDIT_ITEM_FAILURE)
    }
    return success
  },
  async like ({ commit, state }, id) {
    if (state.detail.liking) {
      return
    }
    commit(LIKE_ITEM_REQUEST)
    const { success, data } = await api.article.like(id)().catch(err => commit(LIKE_ITEM_FAILURE, err))
    if (success) {
      commit(LIKE_ITEM_SUCCESS, data)
    } else {
      commit(LIKE_ITEM_FAILURE)
    }
    return success
  },
  async delete ({ commit, dispatch, state }, id) {
    if (state.detail.deleting || !id) {
      return
    }
    commit(DELETE_ITEM_REQUEST)
    const { success } = await api.article.delete(id)().catch(err => commit(DELETE_ITEM_FAILURE, err))
    if (success) {
      commit(DELETE_ITEM_SUCCESS, id)
    } else {
      commit(DELETE_ITEM_FAILURE)
    }
    return success
  },
  async create ({ commit, state }, params = {}) {
    if (state.list.creating) {
      return
    }
    commit(CREATE_ITEM_REQUEST)
    const { success, data } = await api.article.create({ data: params }).catch(err => commit(CREATE_ITEM_FAILURE, err))
    if (success) {
      commit(CREATE_ITEM_SUCCESS, data)
    } else {
      commit(CREATE_ITEM_FAILURE)
    }
  }
}
