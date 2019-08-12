import axios from 'axios'

const state = {
  stations: []
}

const mutations = {
  setStations: (state, stations) => (state.stations = stations)
}

const actions = {
  async getStations ({ commit }) {
    const response = await axios.get('http://localhost:8000/api/stations')

    commit('setStations', response.data)
  }
}

const getters = {
  allStations: state => state.stations,
  filterStations: state => state.stations.filter(({ city }) => city === 'Kraków')
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
