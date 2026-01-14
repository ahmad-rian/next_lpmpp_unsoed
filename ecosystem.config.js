module.exports = {
  apps: [
    {
      name: 'lpmpp',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/home/adminlpmpp/web/lpmpp.unsoed.ac.id/public_html',
      node_args: '--dns-result-order=ipv4first',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
