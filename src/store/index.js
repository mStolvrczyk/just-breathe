import Vue from 'vue'
import Vuex from 'vuex'
import stations from './modules/stations'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    namespaced: true,
    stations
  }
})
