/**
 * @desc App Store
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import storeModules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: !__PROD__,
  modules: storeModules
})
