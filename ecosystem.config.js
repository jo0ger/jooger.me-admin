/**
 * @desc PM2 deploy
 * @author Jooger <zzy1198258955@163.com>
 * @date 12 Oct 2017
 */

const packageInfo = require('./package.json')

module.exports = {
  deploy: {
    production: {
      user: 'root',
      host: 'jooger.me',
      ref: 'origin/master',
      repo: packageInfo.repository.url,
      path: '/root/www/' + packageInfo.name,
      'post-deploy': 'git pull && cnpm install && pm2 stop all && npm run build && pm2 start all'
    }
  }
}
