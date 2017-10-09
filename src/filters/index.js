/**
 * @desc Vue filters
 * @author Jooger <zzy1198258955@163.com>
 * @date 10 Oct 2017
 */

'use strict'

import Vue from 'vue'
import { fmtDate } from '@/utils'

const filters = {
  fmtDate
}

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))
