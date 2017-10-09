/**
 * @desc Store modules entry
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

import * as app from './app'
import * as auth from './auth'

export default {
  app: { namespaced: true, ...app },
  auth: { namespaced: true, ...auth }
}
