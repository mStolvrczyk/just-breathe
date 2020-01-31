const path = require('path')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
