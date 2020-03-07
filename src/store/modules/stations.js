import StationsService from '../../services/StationsService'
const stationsService = new StationsService()
const state = {
  allStationsState: [],
  userLocationState: null,
  closestStationState: null
}

// const getters = {
//   loadStations: state => state.stations,
//   loadUserLocation: state => state.userLocation
// }

const actions = {
  async setAllStationsState ({ commit }) {
    const stationsServiceResponse = await stationsService.getAll()
    commit('setAllStationsState', stationsServiceResponse)
  },
  async setClosestStationState ({ commit }, closestStation) {
    await commit('setClosestStationState', closestStation)
  },
  async setUserLocationState ({ commit }, userLocation) {
    await commit('setUserLocationState', userLocation)
  }
}

const mutations = {
  // eslint-disable-next-line no-return-assign
  setAllStationsState: (state, allStations) => state.allStationsState = allStations,
  // eslint-disable-next-line no-return-assign
  setClosestStationState: (state, closestStation) => state.closestStationState = closestStation,
  // eslint-disable-next-line no-return-assign
  setUserLocationState: (state, userLocation) => state.userLocationState = userLocation
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
