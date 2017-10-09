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
const FETCH_DETAIL_REQUEST = 'FETCH_DETAIL_REQUEST'
const FETCH_DETAIL_SUCCESS = 'FETCH_DETAIL_SUCCESS'
const FETCH_DETAIL_FAILURE = 'FETCH_DETAIL_FAILURE'
const EDIT_DETAIL_REQUEST = 'EDIT_DETAIL_REQUEST'
const EDIT_DETAIL_FAILURE = 'EDIT_DETAIL_FAILURE'
const EDIT_DETAIL_SUCCESS = 'EDIT_DETAIL_SUCCESS'
const CLEAR_DETAIL = 'CLEAR_DETAIL'
const FETCH_LIKES_SUCCESS = 'FETCH_LIKES_SUCCESS'
const LIKE_REQUEST = 'LIKE_REQUEST'
const LIKE_SUCCESS = 'LIKE_SUCCESS'
const LIKE_FAILURE = 'LIKE_FAILURE'

export const state = () => ({
  list: {
    fetching: false,
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
  [FETCH_DETAIL_REQUEST]: state => (state.detail.fetching = true),
  [FETCH_DETAIL_FAILURE]: state => (state.detail.fetching = false),
  [FETCH_DETAIL_SUCCESS]: (state, data) => {
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
  [EDIT_DETAIL_REQUEST]: state => (state.detail.editing = true),
  [EDIT_DETAIL_FAILURE]: state => (state.detail.editing = false),
  [EDIT_DETAIL_SUCCESS]: (state, data) => {
    state.detail.editing = false
    state.detail.data = data
    const index = state.list.data.findIndex(item => item._id === data._id)
    if (index > -1) {
      state.list.data.splice(index, 1, data)
    }
  },
  [FETCH_LIKES_SUCCESS]: (state, { list, isLiked }) => {
    state.detail.likes = list
    state.detail.isLiked = isLiked
  },
  [LIKE_REQUEST]: state => (state.detail.liking = true),
  [LIKE_FAILURE]: state => (state.detail.liking = false),
  [LIKE_SUCCESS]: (state, data) => {
    state.detail.liking = false
    if (state.detail.reactions) {
      state.detail.reactions.heart++
    }
    const article = state.list.data.findIndex(item => item.id === state.detail.id)
    article && article.reactions && article.reactions.heart++
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
    commit(FETCH_DETAIL_REQUEST)
    const { success, data } = await api.article.item(id)().catch(err => commit(FETCH_DETAIL_FAILURE, err))
    if (success) {
      commit(FETCH_DETAIL_SUCCESS, data)
    } else {
      commit(FETCH_DETAIL_FAILURE)
    }
    return success
  },
  async edit ({ commit, state }, { id, model = null }) {
    if (state.detail.editing || !id || model === null) {
      return
    }
    commit(EDIT_DETAIL_REQUEST)
    const { success, data } = await api.article.update(id)({ data: { ...model } }).catch(err => commit(EDIT_DETAIL_FAILURE, err))
    if (success) {
      commit(EDIT_DETAIL_SUCCESS, data)
    } else {
      commit(EDIT_DETAIL_FAILURE)
    }
    return success
  },
  async like ({ commit, state }, id) {
    if (state.detail.liking) {
      return
    }
    commit(LIKE_REQUEST)
    const { success, data } = await api.article.like(id)().catch(err => commit(LIKE_FAILURE, err))
    if (success) {
      commit(LIKE_SUCCESS, data)
    } else {
      commit(LIKE_FAILURE)
    }
    return success
  }
}
