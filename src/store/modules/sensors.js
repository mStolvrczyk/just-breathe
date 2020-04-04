// import StationsService from '../../services/StationsService'
// const stationsService = new StationsService()
const state = {
  barDataCollectionState: {
    labels: null,
    datasets: []
  },
  lineDataCollectionState: {
    labels: null,
    datasets: []
  },
  sensorDetailsState: {
    sensorId: null,
    averageMeasurement: null,
    lastMeasurement: null
  },
  chartDialogVisibilityState: false,
  apiResponseState: null
}

// const getters = {
//   loadStations: state => state.stations,
//   loadUserLocation: state => state.userLocation
// }

const actions = {
  async setBarDataCollectionState ({ commit }, barDataCollection) {
    await commit('setBarDataCollectionState', barDataCollection)
  },
  async setLineDataCollectionState ({ commit }, lineDataCollection) {
    await commit('setLineDataCollectionState', lineDataCollection)
  },
  async setSensorDetailsState ({ commit }, sensorDetails) {
    await commit('setSensorDetailsState', sensorDetails)
  },
  async setChartDialogVisibilityState ({ commit }, chartDialogVisibility) {
    await commit('setChartDialogVisibilityState', chartDialogVisibility)
  },
  async setApiResponseState ({ commit }, apiResponse) {
    await commit('setApiResponseState', apiResponse)
  }
}

const mutations = {
  // eslint-disable-next-line no-return-assign
  setBarDataCollectionState: (state, barDataCollection) => state.barDataCollectionState = barDataCollection,
  // eslint-disable-next-line no-return-assign
  setLineDataCollectionState: (state, lineDataCollection) => state.lineDataCollectionState = lineDataCollection,
  // eslint-disable-next-line no-return-assign
  setSensorDetailsState: (state, sensorDetails) => state.sensorDetailsState = sensorDetails,
  // eslint-disable-next-line no-return-assign
  setChartDialogVisibilityState: (state, chartDialogVisibility) => state.chartDialogVisibilityState = chartDialogVisibility,
  // eslint-disable-next-line no-return-assign
  setApiResponseState: (state, apiResponse) => state.apiResponseState = apiResponse
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
