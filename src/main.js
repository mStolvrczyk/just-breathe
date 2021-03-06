import Vue from 'vue'

// Plugins
import vuetify from './plugins/vuetify'

// Leaflet
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Sync router with store
import { sync } from 'vuex-router-sync'

// Application imports

import App from './App.vue'
import router from '@/router'
import store from '@/store'
import './registerServiceWorker'

// Sync store with router
sync(store, router)

Vue.config.productionTip = false

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
export const bus = new Vue()
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
