<template>
  <v-app>
    <v-content>
      <router-view/>
      <ChartDialog/>
      <InformationDialog
        :information.sync="informationDialogText"
        :informationDialogVisibility.sync="informationDialogVisibility"
        v-on:closeInformationDialog="closeInformationDialog"
      />
    </v-content>
  </v-app>
</template>
<script>
import ChartDialog from '@/components/ui/ChartDialog'
import { bus } from '@/main'
import { mapActions, mapState } from 'vuex'
import Functions from '@/libs/sharedFunctions'
import StationsService from '@/services/StationsService'
import pollutionLevelsSort from '@/libs/pollutionLevelsSort'
import pollutionLevelsSortReversed from '@/libs/pollutionLevelsSortReversed'
import InformationDialog from '@/components/ui/InformationDialog'

export default {
  components: { InformationDialog, ChartDialog },
  data () {
    return {
      informationDialogText: null,
      informationDialogVisibility: false,
      stationsService: new StationsService(),
      functions: new Functions(),
      allStations: null
    }
  },
  methods: {
    ...mapActions('stations', ['setAllStationsState', 'setClosestStationState', 'setUserLocationState', 'setRouteState']),
    ...mapActions('sensors', ['setApiResponseStateDashboard']),
    closeInformationDialog (value) {
      this.informationDialogVisibility = value.informationDialogVisibility
      setTimeout(function () { this.informationDialogText = value.informationDialogText }
          .bind(this),
        250)
    },
    async closestStation (userLocation) {
      if (this.allStations === null) {
        await this.setAllStationsState()
      }
      let minDist = Infinity
      let markerDist
      let closestStationDetails
      this.allStations.forEach(station => {
        markerDist = this.functions.getDistance(station.coordinates.map(Number), userLocation)
        if (markerDist < minDist) {
          minDist = markerDist
          closestStationDetails = station
        }
      })
      const response = (await this.stationsService.getStation(closestStationDetails.id)).filter(({ measurement }) => measurement.length > 0)
      this.setApiResponseStateDashboard(response)
      const sensorsDetails = response.map(({ details }) => details)
      const lastSensorsValues = this.functions.mapLastValues(response)
      const sensors = this.functions.mapSensors(sensorsDetails, lastSensorsValues)
      const closestStation = {
        response: response,
        id: closestStationDetails.id,
        stationName: closestStationDetails.stationName,
        city: closestStationDetails.city,
        temperature: closestStationDetails.temperature,
        pressure: closestStationDetails.pressure,
        wind: closestStationDetails.wind,
        humidity: closestStationDetails.humidity,
        sensors: sensors,
        gaugeChartData: this.mapGaugeChartData(sensors),
        stationDistance: this.functions.roundStationDistance(this.functions.getDistance(closestStationDetails.coordinates,
          userLocation))
      }
      this.setClosestStationState(closestStation)
    },
    getLocation (pos) {
      const userLocation = [
        pos.coords.latitude,
        pos.coords.longitude
      ]
      this.closestStation(userLocation)
      this.setUserLocationState(userLocation)
    },
    mapGaugeChartData (sensors) {
      const sensorsTable = sensors.map((sensor) => {
        return pollutionLevelsSort[sensor.pollutionLevel]
      })
      const worstPollutionLevelSensor = sensorsTable.reduce((prev, current) => (prev > current) ? prev : current)
      const worstPollutionLevelSensors = sensors.filter(({ pollutionLevel }) => pollutionLevel === pollutionLevelsSortReversed[worstPollutionLevelSensor])
      if (worstPollutionLevelSensors.includes(worstPollutionLevelSensors.find(({ symbol }) => symbol === 'PM10'))) {
        return worstPollutionLevelSensors.find(({ symbol }) => symbol === 'PM10')
      } else if (worstPollutionLevelSensors.includes(worstPollutionLevelSensors.find(({ symbol }) => symbol === 'PM2.5'))) {
        return worstPollutionLevelSensors.find(({ symbol }) => symbol === 'PM2.5')
      } else if (worstPollutionLevelSensors.includes(worstPollutionLevelSensors.find(({ symbol }) => symbol === 'O3'))) {
        return worstPollutionLevelSensors.find(({ symbol }) => symbol === 'O3')
      } else {
        return worstPollutionLevelSensors[Math.floor(Math.random() * worstPollutionLevelSensors.length)]
      }
    },
    handleError (error) {
      switch (error.code) {
        case 1:
          this.informationDialogVisibility = true; this.informationDialogText = 'Lokalizacja nie została udostępniona.'
          break
        case 2:
          this.informationDialogVisibility = true; this.informationDialogText = 'Nie można ustalić lokalizacji.'
          break
        case 3:
          alert('timeout')
          break
        default:
          alert('unknown error')
          break
      }
    }
  },
  computed: {
    ...mapState('stations', ['allStationsState', 'userLocationState'])
  },
  watch: {
    '$route.path' (value) {
      setTimeout(function () { this.setRouteState(value) }
        .bind(this),
      250)
    },
    allStationsState: {
      handler: function (value) {
        this.allStations = value
      },
      deep: true
    }
  },
  beforeMount () {
    bus.$on('setInformationDialog', (value) => {
      this.informationDialogVisibility = value.informationDialogVisibility; this.informationDialogText = value.informationDialogText
    })
  },
  mounted () {
    if (navigator.onLine) {
      navigator.geolocation.getCurrentPosition(this.getLocation, this.handleError, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true })
    } else {
      setTimeout(function () { this.informationDialogVisibility = true; this.informationDialogText = 'Brak połączenia z internetem.' }
         .bind(this),
        10000)
    }
    this.setAllStationsState()
    this.$nextTick(function () {
      window.setInterval(() => {
        if (navigator.onLine) {
          this.closestStation(this.userLocationState)
        }
      }, 900000)
    })
  }
}
</script>
<style lang="scss">
  @import "style";
</style>
