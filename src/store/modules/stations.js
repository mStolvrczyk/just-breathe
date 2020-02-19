import StationsService from '../../services/StationsService'
const stationsService = new StationsService()
const state = {
  stations: []
}

const getters = {
  getAllStations: state => state.stations
}

const actions = {
  async getAllStations ({ commit }) {
    const stationsServiceResponse = await stationsService.getAll()
    commit('setStations', stationsServiceResponse)
  }
}

const mutations = {
  // eslint-disable-next-line no-return-assign
  setStations: (state, stations) => state.stations = stations
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
