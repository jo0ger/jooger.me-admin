// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import '@/components/Element-UI'
import '@/assets/stylus/index'
import router, { composeWithStore } from './router'
import store from './store'
import '@/filters'
import eventBus from './eventBus'
import installRaven from './raven'

Vue.config.productionTip = false

Vue.prototype.$eventBus = eventBus

installRaven(Vue)

composeWithStore(store)

const app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

export default app
