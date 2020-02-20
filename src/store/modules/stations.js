import StationsService from '../../services/StationsService'
const stationsService = new StationsService()
const state = {
  stations: [],
  userLocation: [],
  dashboardData: null
}

const getters = {
  loadStations: state => state.stations,
  loadUserLocation: state => state.userLocation
}

const actions = {
  async getAllStations ({ commit }) {
    const stationsServiceResponse = await stationsService.getAll()
    commit('setStations', stationsServiceResponse)
  },
  async getUserLocationDetails ({ commit }, userLocation) {
    await commit('setUserLocation', userLocation)
    let minDist = Infinity
    let nearestText = '*None*'
    let markerDist
    let stationId
    for (let i = 0; i < state.stations.length; i += 1) {
      markerDist = this.functions.getDistance(state.stations[i].coordinates.map(Number), userLocation)
      if (markerDist < minDist) {
        minDist = markerDist
        nearestText = state.stations[i].coordinates
        stationId = state.stations[i].id
      }
    }
    let response = (await this.stationsService.getStation(stationId)).filter(({ measurement }) => measurement.length > 0)
    let station = await state.stations.find(({ id }) => id === stationId)
    let sensorsDetails = response.map(({ details }) => details)
    let lastSensorsValues = this.functions.mapLastValues(response)
    state.dashboardData
  }
}

const mutations = {
  // eslint-disable-next-line no-return-assign
  setStations: (state, stations) => state.stations = stations,
  // eslint-disable-next-line no-return-assign
  setUserLocation: (state, userLocation) => state.userLocation = userLocation
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
