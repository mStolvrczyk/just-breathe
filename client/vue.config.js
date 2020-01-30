const webpack = require('webpack')
const path = require('path')

function getApiUrl () {
  switch (process.env.NODE_ENV) {
    case 'production': {
      return './api'
    }
    default: {
      return './api'
    }
  }
}

module.exports = {
  configureWebpack: {
    ...require('./webpack.config'),
    plugins: [
      new webpack.DefinePlugin({
        'process.env.API_BASE_URL': JSON.stringify(getApiUrl())
      })
    ]
  },
  outputDir: path.resolve(__dirname, 'dist')
}

if (process.env.NODE_ENV === 'development') {
  module.exports.devServer = {
    // eslint-disable-next-line global-require
    before: (app, server) => {
      app.use('/', require('../server/app'))
    }
  }
}
