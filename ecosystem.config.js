module.exports = {
  apps: [{
    name: 'bottomlessbrunch.com',
    script: './server/server.js'
  }],
  deploy: {
    production: {
      user: 'eric',
      host: 'eric2',
      ref: 'origin/master',
      repo: 'git@github.com:ericconstantinides/bottomlessbrunch.com.git',
      path: '/var/www/node/bottomlessbrunch.com',
      'post-deploy': 'pm2 startOrRestart ecosystem.config.js'
    }
  }
}
