import Vue from 'vue'

// Plugins
import './plugins'

// Sync router with store
import { sync } from 'vuex-router-sync'

// Application imports
import App from './components/App.vue'
import router from '@/router'
import store from './store/index'

// Sync store with router
sync(store, router)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
