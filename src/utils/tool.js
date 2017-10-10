/**
 * @desc Tool
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

/**
 * 类型检测
 * @param {*} obj 检测对象
 * @param {String | Array[String]} type 类型（数组）
 */
export const isType = (obj = {}, type = 'Object') => {
  if (!Array.isArray(type)) {
    type = [type]
  }
  return type.some(t => Object.prototype.toString.call(obj) === `[object ${t}]`)
}

/**
 * 防抖函数，适用于输入框input的检索，屏幕的拖拽等
 * @param  {Function} fn                防抖回调
 * @param  {Number}   [delta=0]         回调触发时间
 * @param  {Boolean}  [immediate=false] 是否立即触发回调
 * @return {Function}                   防抖函数包装的函数
 */
export const debounce = (fn, delta = 0, immediate = false) => {
  let can = true
  let timer = null
  return function () {
    if (immediate) {
      if (can) {
        fn.call(this, ...arguments)
        can = false
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        can = true
        fn.call(this, ...arguments)
      }, parseInt(delta))
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.call(this, ...arguments)
      }, parseInt(delta))
    }
  }
}

/* 将时间输出为统一的格式
 * @param fmt  yyyy-MM-dd hh:mm:ss:S q
 * @returns {*}
 */
export const fmtDate = (date, fmt = 'yyyy-MM-dd hh:mm') => {
  date = new Date(date)
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * Deep Copy
 * @param {Object | Array} out
 * @return {Object | Array} out
 * @usage deepCopy({}[, obj, obj2, ...]) | deepCopy([][, arr1, arr2, ...])
 */
export const deepCopy = function (out = {}) {
  for (let i = 1; i < arguments.length; i++) {
    const obj = arguments[i]

    if (!obj) {
      continue
    }

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          out[key] = Array.isArray(obj[key]) ? [] : {}
          deepCopy(out[key], obj[key])
        } else {
          out[key] = obj[key]
        }
      }
    }
  }
  return out
}
