const path = require('path')

module.exports = {
  entry: {
    app: './src/client/main.js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src', 'client')
    }
  }
}
