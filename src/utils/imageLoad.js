/**
 * @desc Image load helper
 * @author Jooger <zzy1198258955@163.com>
 * @date 12 Oct 2017
 */

'use strict'

import { isType } from './tool'

export const imageLoad = (url = '', opt = {}) => {
  if (!isType(opt, 'Object')) {
    if (isType(opt, 'Function')) {
      opt = { success: opt }
    } else {
      opt = {}
    }
  }
  const { success, fail, load } = opt
  if (!url || !isType(url, 'String')) {
    return fail && fail()
  }
  const img = new Image()
  const prop = isType(img.naturalWidth, 'Undefined') ? 'width' : 'naturalWidth'
  img.src = url
  if (img.complete) {
    if (img[prop]) {
      success && success.call(img)
    } else {
      fail && fail.call(img)
    }
  } else {
    load && load()
    img.onload = success
    img.onerror = fail
  }
}
