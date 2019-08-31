import Vue from 'vue'
import Vuex from 'vuex'
import layout from './modules/layout'
import stations from './modules/stations'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    namespaced: true,
    layout,
    stations
  }
})
