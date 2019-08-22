const webpack = require('webpack')

// mozna skonfigurowac podstawowa sciezke do api, do ktorego wysylasz zapytania
function getApiUrl () {
  switch (process.env.NODE_ENV) {
    case 'production': {
      return 'http://localhost:8000/api'
    }
    default: {
      return 'http://localhost:8000/api'
    }
  }
}

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.API_BASE_URL': JSON.stringify(getApiUrl())
      })
    ]
  }
}
