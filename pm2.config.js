module.exports = {
  script: "serve",
  name: "dungeon-list:8081",
  env: {
    PM2_SERVE_PATH: 'build',
    PM2_SERVE_PORT: 8081,
    PM2_SERVE_SPA: 'true',
    PM2_SERVE_HOMEPAGE: '/index.html'
  }
}
