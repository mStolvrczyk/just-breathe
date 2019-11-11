<template>
  <div class="custom-popup" id="map">
    <v-map
      ref="map"
      :zoom.sync="zoom"
      :center.sync="center"
      style="z-index: 0"
      :options="options"
    >
      <v-tilelayer :url="url"
                   :attribution="attribution"></v-tilelayer>
      <l-marker
        :key="station.id"
        v-for="station in stations"
        :lat-lng="functions.getMark(station)"
        @click="functions.getStationDetails(station.id, stations, userLocation)"
      >
        <l-icon
          v-if="centerStationId === station.id"
          :icon-url="yellowIcon"
          :icon-size="yellowIconSize"
        ></l-icon>
        <l-icon
          v-else
          :icon-url="tealIcon"
          :icon-size="tealIconSize"
        ></l-icon>
      </l-marker>
    </v-map>
      <div align="center" id="button_panel">
        <div class="my-2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="functions.closestStation(stations, userLocation)" fab small color="teal lighten-1" v-on="on">
                <v-icon style="font-size:23px;color: white">mdi-crosshairs-gps</v-icon>
              </v-btn>
            </template>
            <span>Pokaż najbliższą stację</span>
          </v-tooltip>
        </div>
        <div class="my-2">
          <v-tooltip v-if="buttonVisibility" bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="zoomReset" fab small color="teal lighten-1" v-on="on">
                <v-icon style="font-size:23px;color: white">mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>Wróć</span>
          </v-tooltip>
        </div>
      </div>
    <transition name="station_popup">
      <div id="station_card" v-if="functions.stationDetails != null">
        <v-card
          color="teal lighten-1"
        >
          <v-card-text align="center" class="white--text">
            <strong>{{functions.stationDetails.stationName}}</strong><br>
            {{functions.stationDetails.city}}<br>
            <strong>{{'odległość: '+functions.stationDetails.stationDistance}}</strong>
          </v-card-text>
        </v-card>
        <div id="close_button">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="functions.stationDetails = null" text fab x-small color="white" v-on="on" id="desktop_v-btn_close">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Zamknij okno</span>
          </v-tooltip>
        </div>
      </div>
    </transition>
    <transition name="station_popup">
      <div id="sensor_panel" align="center" v-if="functions.stationDetails != null">
          <v-container
            fluid class="pa-0"
            v-for="sensor in functions.stationDetails.sensors"
          >
            <v-row align="center" dense>
              <v-col cols="5" lg="5" xs="5">
                  <v-tooltip
                    bottom
                  >
                    <template v-slot:activator="{ on }">
                      <v-card rounded color="teal lighten-1" block
                             class="white--text" v-on="on">
                        {{sensor.symbol}}
                      </v-card>
                    </template>
                    <span>{{sensor.name}}</span>
                  </v-tooltip>
              </v-col>
              <v-col cols="5" lg="5" xs="5">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-card
                      class="white--text"
                      :style="{'background-color': sensor.backgroundColor }" v-on="on">
                          <strong>{{sensor.pollutionLimit+'%'}}</strong>
                    </v-card>
                  </template>
                    <span>{{sensor.lastValue+' &#181/m'}}<sup>3</sup></span>
                </v-tooltip>
              </v-col>
              <v-col cols="2" lg="2" xs="2">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="functions.fillDatacollection(sensor.id, functions.apiResponse)" fab x-small color="teal lighten-1" v-on="on">
                      <v-icon style="font-size:18px;color: white">mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>
                  <span>Pokaż szczegóły</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
      </div>
    </transition>
<!--    <transition name="station_popup">-->
<!--      <div id="mobile_station_card" v-if="functions.stationDetails != null">-->
<!--        <v-card-->
<!--          color="teal lighten-1"-->
<!--          class="pa-0"-->
<!--        >-->
<!--          <v-card-text align="center" class="white&#45;&#45;text">-->
<!--            <strong>{{functions.stationDetails.stationName}}</strong><br>-->
<!--            {{'odległość: '+functions.stationDetails.stationDistance}}-->
<!--          </v-card-text>-->
<!--        </v-card>-->
<!--      </div>-->
<!--    </transition>-->
<!--    <transition name="station_popup">-->
<!--      <div id="mobile_sensor_panel" align="center" v-if="functions.stationDetails != null">-->
<!--        <v-container-->
<!--          fluid class="pa-0"-->
<!--          v-for="sensor in functions.stationDetails.sensors"-->
<!--        >-->
<!--          <v-row align="center" dense>-->
<!--            <v-col cols="3" lg="5" xs="4">-->
<!--              <v-tooltip-->
<!--                bottom-->
<!--              >-->
<!--                <template v-slot:activator="{ on }">-->
<!--                  <v-card rounded color="teal lighten-1" block-->
<!--                    class="white&#45;&#45;text" v-on="on"-->
<!--                    :style="{'font-size': '13px'}"-->
<!--                  >-->
<!--                    {{sensor.symbol}}-->
<!--                  </v-card>-->
<!--                </template>-->
<!--                <span>{{sensor.name}}</span>-->
<!--              </v-tooltip>-->
<!--            </v-col>-->
<!--            <v-col cols="3" lg="5" xs="4">-->
<!--              <v-tooltip bottom>-->
<!--                <template v-slot:activator="{ on }">-->
<!--                  <v-card-->
<!--                    class="white&#45;&#45;text"-->
<!--                    :style="{'background-color': sensor.backgroundColor, 'font-size': '13px' }" v-on="on">-->
<!--                    <strong>{{sensor.pollutionLimit+'%'}}</strong>-->
<!--                  </v-card>-->
<!--                </template>-->
<!--                <span>{{sensor.lastValue+' &#181/m'}}<sup>3</sup></span>-->
<!--              </v-tooltip>-->
<!--            </v-col>-->
<!--            <v-col cols="2" lg="2" xs="4">-->
<!--              <v-btn id="mobile_details" @click="functions.fillDatacollection(sensor.id, functions.apiResponse), visibility === true" fab x-small color="teal lighten-1">-->
<!--                <v-icon style="font-size:17px;color: white">mdi-dots-horizontal</v-icon>-->
<!--              </v-btn>-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--        </v-container>-->
<!--      </div>-->
<!--    </transition>-->
    <div id="station_input">
      <v-autocomplete
        background-color="white"
        v-model="selectedStation"
        :items="stations"
        flat
        search="searchValue"
        hide-no-data
        clearable
        item-value="id"
        item-text="stationName"
        label="Wybierz stację"
        solo
        return-object
      >
        <template v-slot:no-data>
          <v-list-tile>
            <v-list-tile-title>
              Brak stacji
            </v-list-tile-title>
          </v-list-tile>
        </template>
      </v-autocomplete>
    </div>
    <transition name="sensor_popup">
      <div
        id="chart_card"
        v-if="functions.barDataColllection != null && width > 768"
      >
        <v-card
          class="pa-3"
          color="teal lighten-4"
          width="600"
        >
          <div align="center">
            <v-card
              color="white"
            >
              <v-card-text
                align="center"
                v-if="functions.barDataColllection === null"
              >
                <strong>
                  Brak pomiarów
                </strong>
              </v-card-text>
              <div v-else>
                <bar-chart
                  v-if="chartSwitch"
                  :chart-data="functions.barDataColllection"
                  :height="170"
                />
                <line-chart
                  v-else
                  :chart-data="functions.lineDataCollection"
                  :height="170"
                />
              </div>
            </v-card>
            <div class="text-center pa-2" v-if="functions.barDataColllection != null">
              <v-btn-toggle rounded v-model="alignment">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="chartSwitch = true" color="white" v-on="on">
                      <v-icon style="font-size:23px;color: teal">mdi-chart-bar</v-icon>
                    </v-btn>
                  </template>
                  <span>Wykres słupkowy</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="chartSwitch = false" color="white" v-on="on">
                      <v-icon style="font-size:23px;color: teal">mdi-chart-bell-curve</v-icon>
                    </v-btn>
                  </template>
                  <span>Wykres liniowy</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="functions.compareWithYesterday(functions.sensorId, functions.apiResponse)" color="white" v-on="on">
                      <v-icon style="font-size:23px;color: teal">mdi-compare</v-icon>
                    </v-btn>
                  </template>
                  <span>Porównaj z wczoraj</span>
                </v-tooltip>
              </v-btn-toggle>
            </div>
            <v-container fluid class="pa-0" v-if="functions.barDataColllection != null">
              <v-row align="center">
                <v-col cols="12" sm="12">
                  <div class="text-center">
                    <v-card
                      color="teal lighten-1"
                    >
                      <v-card-text class="white--text">
                        <strong>uśredniony pomiar z dziś: {{functions.averageMeasurement.procentValue + '%'}} ({{functions.averageMeasurement.value + ' &#181/m'}}<sup>3</sup>) - {{functions.averageMeasurement.pollutionLevel}}</strong><br>
                        <strong>ostatni pomiar: {{functions.lastMeasurement.procentValue + '%'}} ({{functions.lastMeasurement.value + ' &#181/m'}}<sup>3</sup>) - {{functions.lastMeasurement.pollutionLevel}}</strong>

                      </v-card-text>
                    </v-card>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </div>
    </transition>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from 'vue2-leaflet'
import Functions from '@/libs/helperFunctions'
import StationsService from '@/services/StationsService'
import BarChart from '@/components/vue-chartjs/BarChart'
import LineChart from '@/components/vue-chartjs/LineChart'

export default {
  name: 'LeafletMap',
  components: {
    'v-map': LMap,
    'v-tilelayer': LTileLayer,
    LMarker,
    LPopup,
    LIcon,
    BarChart,
    LineChart
  },
  props: {
    stations: Array,
  },
  methods: {
    setLocation (pos) {
      if (this.userLocation.length >= 0) {
        navigator.geolocation.clearWatch(this.watcher)
      }
      this.userLocation.push(
        pos.coords.latitude,
        pos.coords.longitude
      )
    },
    zoomReset () {
      this.$refs.map.setZoom(this.zoomHolder)
      this.$refs.map.setCenter([52.25, 19.3])
      this.centerStationId = null
      this.functions.stationDetails = null
      this.selectedStation = null
    }
  },
  data () {
    return {
      zoomHolder: null,
      alignment: 0,
      options: {zoomControl: false},
      zoom: 6,
      center: [
        52.25,
        19.3
      ],
      buttonVisibility: false,
      // url: 'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=fc31e976df5a44d7b5164bcbb91c70b0',
      url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      tealIcon: require('@/assets/tealPin.png'),
      yellowIcon: require('@/assets/yellowPin.png'),
      tealIconSize: [40, 40],
      yellowIconSize: [30, 40],
      initialLocation: [59.93428, 30.335098],
      width: document.documentElement.clientWidth,
      userLocation: [],
      watcher: navigator.geolocation.watchPosition(this.setLocation),
      centerStationId: null,
      searchValue: '',
      stationDetails: null,
      sensorDetails: null,
      functions: new Functions(),
      stationsService: new StationsService(),
      selectedStation: null,
      chartSwitch: true,
      visibility: false
    }
  },
  watch: {
    'visibility' (value) {
      if (value === true) {
        this.$emit('sendBarDataCollection', this.functions.barDataColllection)
        this.$emit('sendLineDataCollection', this.functions.lineDataColllection)
        this.$emit('sendAverageMeasurement', this.functions.averageMeasurement)
        this.$emit('sendLastMeasurement', this.functions.lastMeasurement)
      }
    },
    'functions.sensorId' () {
      this.alignment = 0
      this.chartSwitch = true
    },
    'functions.stationDetails' () {
      if (this.width < 768) {
        this.buttonVisibility = true
      }
      this.functions.barDataColllection = null
      this.functions.lineDataColllection = null
      // console.log(value)
    },
    'selectedStation' (value) {
      this.center = {
        lat: value.coordinates[0],
        lng: value.coordinates[1]
      }
      this.functions.getStationDetails(value.id, this.stations, this.userLocation)
      this.centerStationId = value.id
      this.zoom = 10
    },
    'functions.found' (value) {
      this.center = {
        lat: value.lat,
        lng: value.lng
      }
      this.functions.getStationDetails(value.id, this.stations, this.userLocation)
      this.centerStationId = value.id
      this.zoom = 10
    },
    'zoom' (value) {
      if (this.width < 768) {
        this.buttonVisibility = value !== 5
      } else {
        this.buttonVisibility = value !== 6
      }
    }
  },
  mounted () {
    if (this.width < 768) {
      this.zoomHolder = 5
      this.tealIconSize = [25, 25]
      this.yellowIconSize = [15, 25]
      this.$refs.map.setZoom(5)
    } else {
      this.zoomHolder = 6
    }
  }

}
</script>

<style>
  @import "~leaflet/dist/leaflet.css";
  @import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

  .station_popup-enter,
  .station_popup-leave-to{
    transform: rotateY(50deg);
  }
  .station_popup-enter-to,
  .station_popup-leave {
    transform: rotateY(0deg);
  }
  .station_popup-enter-active,
  .station_popup-leave-active {
    transition: transform 400ms;
  }
  .sensor_popup-enter,
  .sensor_popup-leave-to{
    opacity: 0;
  }
  .sensor_popup-enter-active,
  .sensor_popup-leave-active {
    transition: opacity .5s;
  }
  #map{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  @media only screen and (max-width: 767px) {
    #station_input {
      width: 90%;
      position: absolute;
      top: 10px;
      text-align: center;
      left: 20px;
    }
    #button_panel {
      position: absolute;
      top: 140px;
      right: 23px;
    }
    #station_card {
      position: absolute;
      top: 140px;
      left: 100px;
      width: 50%;
    }
    #sensor_panel {
      position: absolute;
      top: 410px;
      left: 110px;
      width: 200px;
    }
    #details {
      width: 25px;
      height: 25px;
    }
    /*#chart_card {*/
    /*  top: 250px;*/
    /*  left: 15px;*/
    /*  width: 350px;*/
    /*  height: 10%;*/
    /*  position: absolute;*/
    /*}*/
  }
  @media only screen and (min-width: 768px) {
    #station_input {
      width: 60%;
      position: absolute;
      top: 10px;
      /*left: 285px;*/
      right: 285px;
    }
    #button_panel {
      position: absolute;
      top: 120px;
      right: 30px;
    }
    #station_card {
      position: absolute;
      top: 100px;
      left: 60px;
      width: 220px
    }
    #sensor_panel {
      position: absolute;
      top: 230px;
      left: 60px;
      width: 220px;
    }
    #close_button {
      top: 3px;
      left: 190px;
      position: absolute;
    }
    #desktop_v-btn_close {
      width: 30px;
      height: 30px;

    }
    #chart_card {
      top: 100px;
      left: 290px;
      position: absolute;
    }
  }
  /*#chart_card {*/
  /*  top: 100px;*/
  /*  left: 290px;*/
  /*  position: absolute;*/
  /*}*/
  .custom-popup .leaflet-popup-content-wrapper {
    background: #B2DFDB;
    color: white;
    font-size: 16px;
    line-height: 24px;
    border-radius: 5px;
  }
</style>
