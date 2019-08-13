import axios from 'axios'

const state = {
  stations: []
}

const mutations = {
  setStations: (state, stations) => (state.stations = stations)
}

const actions = {
  async getStations ({ commit }) {
    // const response = await axios.get('http://localhost:8000/api/stations')
    if (!localStorage.getItem('stations')) {
      const response = await axios.get('http://localhost:8000/api/stations')
      localStorage.setItem('stations', JSON.stringify(response.data))
    }
    const localResponse = JSON.parse(localStorage.getItem('stations'))
    commit('setStations', localResponse)
  }
}

const getters = {
  allStations: state => state.stations,
  filterStations: state => state.stations.filter(({ city }) => city === 'Ustroń')
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
