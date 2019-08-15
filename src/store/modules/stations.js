import axios from 'axios'

const state = {
  stations: [],
  selectedStation: []
}

const mutations = {
  setStations: (state, stations) => (state.stations = stations),
  setSelectedStation: (state, selectedStation) => (state.selectedStation = selectedStation)
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
  },
  async getSelectedStation ({ commit }, selectedStationName) {
    const response = state.stations.filter(({ stationName }) => stationName === selectedStationName)
    commit('setSelectedStation', response)
  }
}

const getters = {
  allStations: state => state.stations,
  selectedStation: state => state.selectedStation,
  filterStations: state => state.stations.filter(({ city }) => city === 'Kraków')
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
