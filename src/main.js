import Vue from 'vue'
import App from './components/App.vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from './store'
import './registerServiceWorker'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.config.productionTip = false

const router = new VueRouter({
  routes: routes
})

new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount('#app')
