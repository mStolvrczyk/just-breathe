import Vue from 'vue'
import Vuex from 'vuex'
import stations from './modules/stations'
import sensors from './modules/sensors'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    namespaced: true,
    stations,
    sensors
  }
})
