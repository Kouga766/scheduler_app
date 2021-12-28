module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  pages: {
    index: {
      entry:"src/main.js",
      title:"Task Management Studio",
    }
  },
  
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true
  },
}

