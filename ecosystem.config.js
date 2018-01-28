module.exports = {
  apps: [{
    name: 'bottomlessbrunch.com',
    script: './server/server.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-13-56-120-181.us-west-1.compute.amazonaws.com',
      key: '~/.ssh/TheKeyPairofEric.pem',
      ref: 'origin/master',
      repo: 'git@github.com:ericconstantinides/bottomlessbrunch.com.git',
      path: '/home/ubuntu/Sites/bottomlessbrunch.com',
      'post-deploy': 'pm2 startOrRestart ecosystem.config.js'
    }
  }
}
