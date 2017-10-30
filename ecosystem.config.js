module.exports = {
  apps: [{
    name: 'bottomlessbrunch.com--client',
    script: './client-server.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-13-56-120-181.us-west-1.compute.amazonaws.com',
      key: '~/.ssh/TheKeyPairofEric.pem',
      ref: 'origin/master',
      repo: 'git@github.com:ericconstantinides/bottomlessbrunch.com--client.git',
      path: '/home/ubuntu/Sites/bottomlessbrunch.com--client',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
