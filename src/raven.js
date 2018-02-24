/**
 * @desc Raven
 * @author Jooger <zzy1198258955@163.com>
 * @date 24 Feb 2018
 */

import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

export default function installRaven (Vue) {
  if (process.env.NODE_ENV === 'production') {
    Raven
      .config('https://d555b685147d4acc98e5cf5cbeac5692@sentry.io/293703')
      .addPlugin(RavenVue, Vue)
      .install()
  }
}
