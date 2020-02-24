import StationsService from '../../services/StationsService'
const stationsService = new StationsService()
const state = {
  allStationsState: [],
  userLocationState: [],
  dashboardDataState: null
}

// const getters = {
//   loadStations: state => state.stations,
//   loadUserLocation: state => state.userLocation
// }

const actions = {
  async changeLocation ({ commit }, userLocation) {
    await commit('setUserLocationState', userLocation)
  },
  async setAllStationsState ({ commit }) {
    const stationsServiceResponse = await stationsService.getAll()
    commit('setStationsState', stationsServiceResponse)
  },
  async setUserLocationState ({ commit }, userLocation) {
    await commit('setUserLocationState', userLocation)
  },
  async setDashboardDataState ({ commit }, dashboardData) {
    await commit('setDashboardDataState', dashboardData)
  }
}

const mutations = {
  // eslint-disable-next-line no-return-assign
  setStationsState: (state, stations) => state.allStationsState = stations,
  // eslint-disable-next-line no-return-assign
  setUserLocationState: (state, userLocation) => state.userLocationState = userLocation,
  // eslint-disable-next-line no-return-assign
  setDashboardDataState: (state, dashboardData) => state.dashboardDataState = dashboardData
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
