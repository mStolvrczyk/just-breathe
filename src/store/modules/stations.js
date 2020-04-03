import StationsService from '../../services/StationsService'
const stationsService = new StationsService()
const state = {
  allStationsState: [],
  userLocationState: null,
  closestStationState: {
    stationName: null,
    city: null,
    temperature: null,
    pressure: null,
    wind: null,
    humidity: null,
    sensors: null,
    stationDistance: null,
    gaugeChartData: {
      lastPercentValue: 0,
      lastValue: 0,
      backgroundColor: null
    }
  },
  selectedStationState: null,
  routeState: null
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
  },
  async setSelectedStationState ({ commit }, selectedStation) {
    await commit('setSelectedStationState', selectedStation)
  },
  async setRouteState ({ commit }, route) {
    await commit('setRouteState', route)
  }
}

const mutations = {
  // eslint-disable-next-line no-return-assign
  setAllStationsState: (state, allStations) => state.allStationsState = allStations,
  // eslint-disable-next-line no-return-assign
  setClosestStationState: (state, closestStation) => state.closestStationState = closestStation,
  // eslint-disable-next-line no-return-assign
  setUserLocationState: (state, userLocation) => state.userLocationState = userLocation,
  // eslint-disable-next-line no-return-assign
  setSelectedStationState: (state, selectedStation) => state.selectedStationState = selectedStation,
  // eslint-disable-next-line no-return-assign
  setRouteState: (state, route) => state.routeState = route
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
