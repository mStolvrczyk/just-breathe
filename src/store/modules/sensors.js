import pollutionLevels from '@/libs/pollutionLevels'
import Functions from '@/libs/sharedFunctions'
const functions = new Functions()

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
  apiResponseStateDashboard: null,
  apiResponseStateMap: null
}

const actions = {
  async setChartDialogDataState ({ commit }, { id, apiResponse }) {
    const sensor = apiResponse.find(sensor => sensor.details.id === id)
    const filteredMeasurements = sensor.measurement.filter(({ date }) => date >= functions.formatDate(new Date()) + ' 00:00:00')
    const filteredValues = filteredMeasurements.map(({ value }) => value)
    const averageMeasurement = functions.getAverage(filteredValues)
    const lastMeasurement = functions.getLastMeasurement(filteredValues)
    const barDataCollection = {
      labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
      datasets: [
        {
          label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
          backgroundColor: functions.setBackgroundColor(filteredValues, sensor.details.paramTwo, true),
          data: filteredMeasurements.map(({ value }) => value.toFixed(2))
        }
      ]
    }
    await commit('setBarDataCollectionState', barDataCollection)
    const lineDataCollection = {
      labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
      datasets: [
        {
          label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
          backgroundColor: functions.setBackgroundColor([averageMeasurement], sensor.details.paramTwo, true)[0],
          data: filteredMeasurements.map(({ value }) => value.toFixed(2))
        }
      ]
    }
    await commit('setLineDataCollectionState', lineDataCollection)
    const sensorDetails = {
      sensorId: sensor.details.id,
      averageMeasurement: {
        value: averageMeasurement.toFixed(2),
        procentValue: functions.getPollutionLimit(sensor.details.paramTwo, averageMeasurement),
        pollutionLevel: pollutionLevels[functions.setBackgroundColor([averageMeasurement], sensor.details.paramTwo, false)[0]],
        color: functions.setBackgroundColor([averageMeasurement], sensor.details.paramTwo, false)[0]
      },
      lastMeasurement: {
        value: lastMeasurement.toFixed(2),
        procentValue: functions.getPollutionLimit(sensor.details.paramTwo, lastMeasurement),
        pollutionLevel: pollutionLevels[functions.setBackgroundColor([lastMeasurement], sensor.details.paramTwo, false)[0]],
        color: functions.setBackgroundColor([lastMeasurement], sensor.details.paramTwo, false)[0]
      }
    }
    await commit('setSensorDetailsState', sensorDetails)
  },
  async resetChartDialogDataState ({ commit }) {
    await commit('setBarDataCollectionState', { labels: null, datasets: [] })
    await commit('setLineDataCollectionState', { labels: null, datasets: [] })
    await commit('setSensorDetailsState', { sensorId: null, averageMeasurement: null, lastMeasurement: null })
  },
  async setBarDataCollectionState ({ commit }, barDataCollection) {
    await commit('setBarDataCollectionState', barDataCollection)
  },
  async setLineDataCollectionState ({ commit }, lineDataCollection) {
    await commit('setLineDataCollectionState', lineDataCollection)
  },
  async setSensorDetailsState ({ commit }, sensorDetails) {
    await commit('setSensorDetailsState', sensorDetails)
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
