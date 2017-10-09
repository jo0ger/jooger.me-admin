/**
 * @desc Local storage
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

import { isType } from './tool'

function checkValue (value) {
  return isType(value, 'String') ? value : JSON.stringify(value || {})
}

export const setSessionStorageItem = (key = '', value = '') => {
  key && window.sessionStorage.setItem(key, checkValue(value))
}

export const getSessionStorageItem = (key = '') => {
  return key && window.sessionStorage.getItem(key)
}

export const removeSessionStorageItem = (key = '') => {
  key && window.sessionStorage.removeItem(key)
}

export const setLocalStorageItem = (key = '', value = '') => {
  key && window.localStorage.setItem(key, checkValue(value))
}

export const getLocalStorageItem = (key = '') => {
  return key && window.localStorage.getItem(key)
}

export const removeLocalStorageItem = (key = '') => {
  key && window.localStorage.removeItem(key)
}
