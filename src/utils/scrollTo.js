/**
 * @desc 页面滚动
 * @author Jooger <zzy1198258955@163.com>
 * @date 10 Oct 2017
 */

'use strict'

import BezierEasing from 'bezier-easing'
import { isType } from './tool'

export const requestAnimationFrame = process.env.VUE_ENV === 'server'
  ? function (callback) {
    setTimeout(callback, 1000 / 60)
  } : (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame
  )

const _ = {
  $ (selector) {
    return document.querySelector(String(selector))
  },
  on (element, events, handler) {
    if (!(events instanceof Array)) {
      events = [events]
    }
    for (let i = 0; i < events.length; i++) {
      element.addEventListener(events[i], handler)
    }
  },
  off (element, events, handler) {
    if (!(events instanceof Array)) {
      events = [events]
    }
    for (let i = 0; i < events.length; i++) {
      element.removeEventListener(events[i], handler)
    }
  }
}

export const easing = {
  ease: [0.25, 0.1, 0.25, 1.0],
  linear: [0.00, 0.0, 1.00, 1.0],
  'ease-in': [0.55, 0.055, 0.675, 0.19],
  'ease-out': [0.215, 0.61, 0.355, 1],
  'ease-in-out': [0.645, 0.045, 0.355, 1],
  fuck: [0.85, 0, 0.15, 1]
}

// 参考 https://github.com/surmon-china/surmon.me/blob/master/utils/scroll-to-anywhere.js
export const scrollTo = (element = null, duration = 500, options = {}) => {
  if (isType(element, 'String')) {
    element = _.$(element)
  }
  if (element === undefined || element === null) {
    return
  }
  options.easing = options.easing || easing['linear']
  const page = _.$('.app-container .app-main')

  let initialY = page.scrollTop
  let elementY = 0
  if (isType(element, 'Number')) {
    elementY = element
  } else {
    elementY = initialY + element.getBoundingClientRect().top
  }
  let targetY = page.scrollHeight - elementY < window.innerHeight
      ? page.scrollHeight - window.innerHeight
      : elementY

  if (options.offset) {
    targetY += options.offset
  }

  let diff = targetY - initialY
  let be = BezierEasing.apply(BezierEasing, options.easing)
  let start

  let done = function () {
    options.onDone && options.onDone()
  }

  if (!diff) return

  requestAnimationFrame(function step (timestamp) {
    if (!start) start = timestamp

    const time = timestamp - start
    let progress = Math.min(time / duration, 1)
    progress = be(progress)

    page.scrollTo(0, initialY + diff * progress)

    if (time < duration) {
      requestAnimationFrame(step)
    } else {
      done()
    }
  })
}
