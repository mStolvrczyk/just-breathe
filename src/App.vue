<template>
  <v-app
  >
    <v-navigation-drawer
      height="100vh"
      light
      clipped
      v-model="drawer"
      :mini-variant="miniVariant"
      :permanent="$vuetify.breakpoint.mdOnly"
      stateless
      app
      :width="navbarWidth"
      :src="require('@/assets/appImage.jpg')"
      @scroll="handleScroll"
    >
      <template v-slot:img="props">
        <v-img
      style="overflow-y: auto; overflow-x: hidden"
          :gradient="'to top right, rgba(0,77,64,.9), rgba(0,77,64,.9)'"
          v-bind="props"
        />
      </template>
      <v-container
      id="container"
      v-on:scroll="handleScroll"
      >
        <nav>
          <div
            id="image-container"
          >
            <v-img
              class="logo-image"
              v-if="miniVariant"
              :src="require('@/assets/jb-sygnet.png')"
            />
            <v-img
              v-else
              :src="require('@/assets/jb-logo.png')"
            />
          </div>
  <!--            :stations="allStationsState"-->
          <div align="center" id="view-icons">
            <v-tooltip bottom v-if="miniVariant">
              <template v-slot:activator="{ on }">
                <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on" @click="mini = !mini" icon>
                  <v-icon>
                    search
                  </v-icon>
                </v-btn>
                <v-btn v-else x-large color="white" v-on="on" @click="mini = !mini" icon>
                  <v-icon>
                    search
                  </v-icon>
                </v-btn>
              </template>
              <span>Szukaj stacji</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on"
                       @click="$router.push('/dashboard')" icon>
                  <v-icon>
                    mdi-tablet-dashboard
                  </v-icon>
                </v-btn>
                <v-btn v-else x-large color="white" v-on="on" @click="$router.push('/dashboard')" icon>
                  <v-icon>
                    mdi-tablet-dashboard
                  </v-icon>
                </v-btn>
              </template>
              <span>Panel użytkownika</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on" @click="$router.push('/map')"
                       icon>
                  <v-icon>
                    mdi-map-marker
                  </v-icon>
                </v-btn>
                <v-btn v-else x-large color="white" v-on="on" @click="$router.push('/map')" icon>
                  <v-icon>
                    mdi-map-marker
                  </v-icon>
                </v-btn>
              </template>
              <span>Mapa</span>
            </v-tooltip>
          </div>
           <StationInput
            v-if="!miniVariant"
          />
        </nav>
        <transition name="popup">
          <div
            id="scrollable-content"
            v-if="stationDetails !== null && !miniVariant"
          >
            <div align="center" class="sidebar-element">
              <v-img
                :src="require('@/assets/place-yellow.png')"
                class="sidebar-icon"
              />
             <p class="icon-text">Stacja pomiarowa</p>
              <p class="station-name-text">{{stationDetails.stationName}}<br><span class="city-text">{{stationDetails.city}}</span></p>
            </div>
            <div align="center" class="sidebar-element">
              <v-img
              :src="require('@/assets/road-yellow.png')"
              class="sidebar-icon"
              />
              <p class="icon-text">Odległość</p>
              <p class="distance-text">{{stationDetails.stationDistance}}</p>
            </div>
            <div align="center" class="sidebar-element">
              <v-img
                :src="require('@/assets/fog-yellow.png')"
                class="sidebar-icon"
              />
              <p class="icon-text">Jakość powietrza</p>
              <div>
                <div
                  class="sensor-row"
                  v-for="sensor in stationDetails.sensors"
                  :key="sensor.index"
                >
                  <div class="sensor-column">
                    <p class="sensor-symbol">{{sensor.symbol}}</p>
                  </div>
                  <div class="sensor-column">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <p class="sensor-value" v-on="on" :style="{'color': sensor.backgroundColor}">{{sensor.pollutionLimit+'%'}}</p>
                      </template>
                      <span>{{sensor.lastValue+' &#181/m'}}<sup>3</sup></span>
                    </v-tooltip>
                  </div>
                  <div class="button-column">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn normal color="white" v-on="on" icon>
                          <v-icon>
                            mdi-dots-horizontal
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Pokaż szczegóły</span>
                    </v-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </v-container>
<!--      <v-img-->
<!--        gradient="to top right, rgba(0,77,64,.9), rgba(0,77,64,.9)"-->
<!--        height="100%"-->
<!--      >-->
<!--      </v-img>-->
    </v-navigation-drawer>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>
<script>
import { bus } from '@/main'
// import { mapActions, mapState } from 'vuex'
import Functions from '@/libs/helperFunctions'
import StationsService from '@/services/StationsService'
import StationInput from '@/components/ui/StationInput'
//
// let nav = document.getElementById('nav')
// window.onscroll = function () {
//   if (window.pageYOffset > 100) {
//     nav.style.background = 'orange'
//     nav.style.boxShadow = '0px 4px 2px blu'
//   } else {
//     nav.style.background = 'transparent'
//   }
// }

export default {
  components: { StationInput },
  data () {
    return {
      scrollPosition: 0,
      stationDetails: null,
      drawer: true,
      mini: true,
      right: null,
      stationsService: new StationsService(),
      functions: new Functions(),
      stationInputVisibility: false,
      userPanelVisibility: false,
      // watcher: navigator.geolocation.watchPosition(this.getLocation),
      userLocation: [],
      userLocationDetails: null,
      allStations: null
    }
  },
  methods: {
    handleScroll () {
      // let currentScrollPosition = e.srcElement.scrollTop
      // if (currentScrollPosition > this.scrollPosition) {
      console.log('Scrolling down')
      // }
    },
    // async closestStation (userLocation) {
    //   if (this.allStations === null) {
    //     await this.setAllStationsState()
    //   }
    //   let minDist = Infinity
    //   let nearestText = '*None*'
    //   let markerDist
    //   let stationId
    //   for (let i = 0; i < this.allStations.length; i += 1) {
    //     markerDist = this.functions.getDistance(this.allStations[i].coordinates.map(Number), userLocation)
    //     if (markerDist < minDist) {
    //       minDist = markerDist
    //       nearestText = this.allStations[i].coordinates
    //       stationId = this.allStations[i].id
    //     }
    //   }
    //   let response = (await this.stationsService.getStation(stationId)).filter(({ measurement }) => measurement.length > 0)
    //   // console.log(response)
    //   let station = await this.allStations.find(({ id }) => id === stationId)
    //   let sensorsDetails = response.map(({ details }) => details)
    //   let lastSensorsValues = this.functions.mapLastValues(response)
    //   let dashboardData = {
    //     stationName: station.stationName,
    //     city: station.city,
    //     sensors: this.functions.mapSensors(sensorsDetails, lastSensorsValues),
    //     stationDistance: this.functions.roundStationDistance(this.functions.getDistance(station.coordinates,
    //       userLocation))
    //   }
    //   this.setDashboardDataState(dashboardData)
    // },
    // getLocation (pos) {
    //   if (this.userLocation.length >= 0) {
    //     navigator.geolocation.clearWatch(this.watcher)
    //   }
    //   let userLocation = [
    //     pos.coords.latitude,
    //     pos.coords.longitude
    //   ]
    //   this.closestStation(userLocation)
    // },
    // ...mapActions('stations', ['setAllStationsState', 'setDashboardDataState']),
    closeStationInput (value) {
      this.stationInputVisibility = value
    },
    closeUserPanel (value) {
      this.userPanelVisibility = value
    }
  },
  computed: {
    miniVariant () {
      return this.$vuetify.breakpoint.smAndDown && this.mini
    },
    navbarWidth () {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 200
      } else {
        return 270
      }
    }
    // ...mapState('stations', ['allStationsState'])
  },
  watch: {
    '$vuetify.breakpoint.mdOnly' (value) {
      this.mini = !value
    }
    // 'stationDetails' () {
    //   if (this.mini) {
    //     this.mini = !this.mini
    //   }
    //   // }
    // }
    // '$vuetify.breakpoint.xsOnly' (value) {
    //   console.log(value)
    // }
    // 'userLocation' (value) {
    //   this.setUserLocationState(value)
    // },
    // allStationsState: {
    //   handler: function (value) {
    //     this.allStations = value
    //   },
    //   deep: true
    // },
  },
  mounted () {
  },
  created () {
    // window.onload = function () {
    //   let el = document.getElementById('totek')
    //   el.addEventListener('scroll', this.handleScroll)
    // }
    bus.$on('setStationDetails', (data) => {
      this.stationDetails = data
    })
    bus.$on('setMini', (value) => {
      // if (this.mini === true) {
      this.mini = value
      // }
    })
  }
}
</script>
<style lang="scss">
    ::-webkit-scrollbar {
      width: 10px;
    }

    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
  .popup-enter,
  .popup-leave-to{
    transform: rotateY(50deg);
  }
  .popup-enter-to,
  .popup-leave {
    transform: rotateY(0deg);
  }
  .popup-enter-active,
  .popup-leave-active {
    transition: transform 400ms;
  }
  @mixin desktop-drawer () {
    .sidebar-element {
      justify-content: center;
      align-content: center;
      flex-direction: column;
      display: flex;
      margin-bottom: 1rem;
    }
    #view-icons {
      margin-bottom: 15px;
    }
    .sidebar-icon {
      align-items: center;
      margin-bottom: 0.2rem;
      width: 25px;
      height: 25px;
    }
    .icon-text {
      font-family: Rubik;
      font-size: 12px;
      color: #FFFF;
      font-weight: bold;
    }
    .station-name-text {
      font-family: Rubik;
      font-size: 14px;
      color: #FFFF;
      font-weight: bold;
      text-align: center;
    }
    .city-text {
      font-family: Rubik;
      font-weight: lighter;
      font-size: 13px;
      color: #FFFF;
      text-align: center;
    }
    .distance-text {
      font-family: Rubik;
      font-size: 18px;
      color: #FFFF;
      font-weight: bold;
      text-align: center;
    }
    .sensor-window {
      height: 100px;
      overflow-y: auto;
    }
    #style-2::-webkit-scrollbar {
      width: 12px;
    }

    #style-2::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
    }

    #style-2::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    .sensor-row {
      flex: 1;
      display: flex;
      align-content: center;
      flex-direction: row;
      justify-content: center;
    }
    .sensor-column {
      width: 100%;
      height: 35px;
      line-height: 35px;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      align-content: center;
    }
    .button-column {
      width: 100%;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      align-content: center;
    }
    .sensor-symbol {
      font-family: Rubik;
      font-size: 16px;
      color: #FFFF;
      font-weight: bold;
      text-align: center;
    }
    .sensor-value {
      align-content: center;
      alignment: center;
      justify-content: center;
      font-family: Rubik;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
  }
  @mixin mobile-drawer () {
    .sidebar-element {
      justify-content: center;
      align-content: center;
      flex-direction: column;
      display: flex;
      margin-bottom: 1rem;
    }
    #view-icons {
      margin-bottom: 15px;
    }
    .sidebar-icon {
      align-items: center;
      margin-bottom: 0.2rem;
      width: 20px;
      height: 20px;
    }
    .icon-text {
      font-family: Rubik;
      font-size: 11px;
      color: #FFFF;
      font-weight: bold;
    }
    .station-name-text {
      font-family: Rubik;
      font-size: 13px;
      color: #FFFF;
      font-weight: bold;
      text-align: center;
    }
    .city-text {
      font-family: Rubik;
      font-weight: lighter;
      font-size: 12px;
      color: #FFFF;
      text-align: center;
    }
    .distance-text {
      font-family: Rubik;
      font-size: 16px;
      color: #FFFF;
      font-weight: bold;
      text-align: center;
    }
    .sensor-window {
      height: 100px;
      overflow-y: auto;
    }
    .sensor-row {
      flex: 1;
      display: flex;
      align-content: center;
      flex-direction: row;
      justify-content: center;
    }
    .sensor-column {
      width: 100%;
      height: 35px;
      line-height: 35px;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      align-content: center;
    }
    .button-column {
      width: 100%;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      align-content: center;
    }
    .sensor-symbol {
      font-family: Rubik;
      font-size: 14px;
      color: #FFFF;
      font-weight: bold;
      text-align: center;
    }
    .sensor-value {
      align-content: center;
      alignment: center;
      justify-content: center;
      font-family: Rubik;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
    }
  }
  @media only screen and (min-width: 600px) {
    @include desktop-drawer()
  }
  @media only screen and (max-width: 599px) {
    @include mobile-drawer()
  }
  .row {
    align-content: center;
    flex-direction: column;
    justify-content: space-around;
    margin-bottom: 1rem;
  }
  #image-container {
    margin-bottom: 1rem;
  }
  nav {
    top: 0;
    z-index: 1;
    position: sticky;
  }
  .logo-image {
    max-height: 55px;
    max-width: 200px;
  }
  #container {
    height: 100vh;
  }
  #scrollable-content {
    padding: 0.5rem;
    overflow-y: auto;
    height: 55%;
  }
  .v-navigation-drawer__content {
    overflow-x: hidden;
    overflow-y: hidden;
  }
  #app {
    p {
      margin-bottom: 3px;
    }
    background-image:
      linear-gradient(to bottom, rgba(30, 230, 176, 0.5), rgba(30, 230, 176, 0.5))

  }
  html {
    overflow-y: hidden;
  }
</style>
