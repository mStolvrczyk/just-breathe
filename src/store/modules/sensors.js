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
  apiResponseStateDashboard: null,
  apiResponseStateMap: null
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
  async setApiResponseStateDashboard ({ commit }, apiResponse) {
    await commit('setApiResponseStateDashboard', apiResponse)
  },
  async setApiResponseStateMap ({ commit }, apiResponse) {
    await commit('setApiResponseStateMap', apiResponse)
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
  setApiResponseStateDashboard: (state, apiResponse) => state.apiResponseStateDashboard = apiResponse,
  // eslint-disable-next-line no-return-assign
  setApiResponseStateMap: (state, apiResponse) => state.apiResponseStateMap = apiResponse
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
