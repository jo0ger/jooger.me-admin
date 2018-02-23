/**
 * @desc api service
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

import Axios from 'axios'
import store from '@/store'
import config from '@/config'
import { Message } from 'element-ui'
import OSS from 'ali-oss'

const logMsg = (msg = '', type = 'success') => {
  if (msg) {
    Message[type] && Message[type]({
      duration: 3000,
      message: msg
    })
  }
}

export const fetcher = Axios.create(config.service)

const codeMap = {
  FAILED: -1,
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
  PARAMS_ERROR: 10001
}

fetcher.interceptors.request.use(config => config, err => Promise.reject(err))

fetcher.interceptors.response.use(response => {
  if (!response || !response.data) {
    return logMsg('服务器异常', 'error')
  }
  switch (response.data.code) {
    case codeMap.UNAUTHORIZED:
      if (!response.config.url.includes('/auth/info')) {
        logMsg(response.data.message, 'error')
      }
      store.dispatch('auth/clearAuthInfo')
      break
    case codeMap.FAILED:
    case codeMap.FORBIDDEN:
    case codeMap.SERVER_ERROR:
    case codeMap.PARAMS_ERROR:
      logMsg(response.data.message, 'error')
      break
    case codeMap.SUCCESS:
      if (response.config.method.toLocaleUpperCase() !== 'GET') {
        logMsg(response.data.message, 'success')
      }
      break
    default:
      break
  }
  return response.data
}, err => {
  const status = err.response ? err.response.status : err.code
  const message = err.message ? err.message : `请求错误${status ? `，code:${status}` : ''}`
  logMsg(message, 'error')
  return Promise.reject(err)
})

const wrap = (url, type = 'get') => (config = {}) => fetcher.request({ ...config, method: type, url: `/backend${url}` })

const api = {
  auth: {
    login: wrap('/auth/local/login', 'post'),
    logout: wrap('/auth/local/logout'),
    info: wrap('/auth/info')
  },
  article: {
    create: wrap('/articles', 'post'),
    list: wrap('/articles'),
    item: id => wrap(`/articles/${id}`),
    like: id => wrap(`/articles/${id}/like`, 'post'),
    update: id => wrap(`/articles/${id}`, 'patch'),
    delete: id => wrap(`/articles/${id}`, 'delete')
  },
  category: {
    create: wrap('/categories', 'post'),
    list: wrap('/categories'),
    item: id => wrap(`/categories/${id}`),
    update: id => wrap(`/categories/${id}`, 'patch'),
    delete: id => wrap(`/categories/${id}`, 'delete')
  },
  tag: {
    create: wrap('/tags', 'post'),
    list: wrap('/tags'),
    item: id => wrap(`/tags/${id}`),
    update: id => wrap(`/tags/${id}`, 'patch'),
    delete: id => wrap(`/tags/${id}`, 'delete')
  },
  option: {
    fetch: wrap('/options'),
    update: wrap('/options', 'patch')
  },
  user: {
    list: wrap('/users'),
    item: id => wrap(`/users/${id}`),
    update: id => wrap(`/users/${id}`, 'patch'),
    delete: id => wrap(`/users/${id}`, 'delete')
  },
  music: {
    list: wrap('/music/songs')
  },
  moment: {
    create: wrap('/moments', 'post'),
    list: wrap('/moments'),
    update: id => wrap(`/moments/${id}`, 'patch'),
    delete: id => wrap(`/moments/${id}`, 'delete')
  },
  aliyun: {
    oss: wrap('/aliyun/oss'),
    upload: (name, file, options) => {
      return getAliyunClient()
        .then(() => _aliyunClient.multipartUpload(name, file, Object.assign({}, options)))
        .then(res => {
          return {
            url: res.res.requestUrls[0].replace(`http://${_aliyunClient.options.bucket}.${_aliyunClient.options.region}.aliyuncs.com`, 'https://static.jooger.me') || ''
          }
        })
    }
  }
}

export default api

let _aliyunClient = null
function getAliyunClient () {
  if (_aliyunClient && _aliyunClient instanceof OSS.Wrapper) return Promise.resolve()
  return api.aliyun.oss().then(res => {
    if (res.success && res.data) {
      _aliyunClient = new OSS.Wrapper(res.data)
    }
    return _aliyunClient
  })
}
