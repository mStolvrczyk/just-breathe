<template>
  <v-app>
    <!--    <v-app-bar-->
    <!--      flat-->
    <!--      persistent-->
    <!--      dark-->
    <!--      app-->
    <!--      fixed-->
    <!--      :scroll-threshold="1"-->
    <!--      :scroll-off-screen="true"-->
    <!--      :src="require('@/assets/appImage.jpg')"-->
    <!--    >-->
    <!--      <template v-slot:img="{ props }">-->
    <!--        <v-img-->
    <!--          v-bind="props"-->
    <!--          gradient="to top right, rgba(0,77,64,.9), rgba(0,77,64,.9)"-->
    <!--        />-->
    <!--      </template>-->
    <!--      <div class="v-toolbar-title">-->
    <!--        <v-toolbar-title>-->
    <!--          Air Quality Check-->
    <!--        </v-toolbar-title>-->
    <!--      </div>-->
    <!--      <v-spacer/>-->
    <!--      <v-tooltip bottom>-->
    <!--        <template v-slot:activator="{ on }">-->
    <!--          <v-btn v-on="on" @click="$router.push('/dashboard')" icon>-->
    <!--            <v-icon>-->
    <!--              mdi-tablet-dashboard-->
    <!--            </v-icon>-->
    <!--          </v-btn>-->
    <!--        </template>-->
    <!--        <span>Panel użytkownika</span>-->
    <!--      </v-tooltip>-->
    <!--      <v-tooltip bottom>-->
    <!--        <template v-slot:activator="{ on }">-->
    <!--          <v-btn v-on="on" @click="$router.push('/map')" icon>-->
    <!--            <v-icon>-->
    <!--              mdi-map-marker-->
    <!--            </v-icon>-->
    <!--          </v-btn>-->
    <!--        </template>-->
    <!--        <span>Mapa</span>-->
    <!--      </v-tooltip>-->
    <!--    </v-app-bar>-->
    <!--      :temporary="temporaryDrawer"-->
    <v-navigation-drawer
      light
      clipped
      v-model="drawer"
      :mini-variant="miniVariant"
      :permanent="$vuetify.breakpoint.mdOnly"
      stateless
      app
      :width="navbarWidth"
    >
      <v-img
        :src="require('@/assets/appImage.jpg')"
        gradient="to top right, rgba(0,77,64,.9), rgba(0,77,64,.9)"
        height="100%"
      >
        <v-container>
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
           <StationInput
            v-if="!miniVariant"
          />
<!--            :stations="allStationsState"-->
          <div align="center" id="view-icons">
            <v-tooltip bottom v-if="miniVariant">
              <template v-slot:activator="{ on }">
                <v-btn x-large color="white" v-on="on" @click="mini = !mini" icon>
                  <v-icon>
                    search
                  </v-icon>
                </v-btn>
              </template>
              <span>Szukaj stacji</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn x-large color="white" v-on="on" @click="$router.push('/dashboard')" icon>
                  <v-icon>
                    mdi-tablet-dashboard
                  </v-icon>
                </v-btn>
              </template>
              <span>Panel użytkownika</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn x-large color="white" v-on="on" @click="$router.push('/map')" icon>
                  <v-icon>
                    mdi-map-marker
                  </v-icon>
                </v-btn>
              </template>
              <span>Mapa</span>
            </v-tooltip>
          </div>
          <transition name="popup">
            <div v-if="stationDetails !== null && !mini">
              <div class="row">
                <div align="center" class="sidebar-element">
                  <v-img
                    :src="require('@/assets/place-yellow.png')"
                    class="sidebar-icon"
                  />
                 <p class="icon-text">Stacja pomiarowa</p>
                  <p class="station-name-text">{{stationDetails.stationName}}<br><span class="city-text">{{stationDetails.city}}</span></p>
                </div>
              </div>
              <div class="row">
                <div align="center" class="sidebar-element">
                  <v-img
                  :src="require('@/assets/road-yellow.png')"
                  class="sidebar-icon"
                  />
                  <p class="icon-text">Odległość</p>
                  <p class="distance-text">{{stationDetails.stationDistance}}</p>
                </div>
              </div>
              <div class="row">
                <div align="center" class="sidebar-element">
                  <v-img
                    :src="require('@/assets/fog-yellow.png')"
                    class="sidebar-icon"
                  />
                  <p class="icon-text">Jakość powietrza</p>
                </div>
              </div>
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
                          <p v-on="on" :style="{'color': sensor.backgroundColor}">{{sensor.pollutionLimit+'%'}}</p>
                        </template>
                        <span>{{sensor.lastValue+' &#181/m'}}<sup>3</sup></span>
                      </v-tooltip>
                    </div>
                    <div class="sensor-column">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn v-on="on" fab x-small color="white">
                            <v-icon style="font-size:18px;color: teal">mdi-dots-horizontal</v-icon>
                          </v-btn>
                        </template>
                        <span>Pokaż szczegóły</span>
                      </v-tooltip>
                    </div>
                  </div>
            </div>
          </transition>
        </v-container>
      </v-img>
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

export default {
  components: { StationInput },
  data () {
    return {
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
        return 190
      } else {
        return 270
      }
    }
    // ...mapState('stations', ['allStationsState'])
  },
  watch: {
    '$vuetify.breakpoint.mdOnly' (value) {
      this.mini = !value
    },
    'stationDetails' () {
      if (this.mini) {
        this.mini = !this.mini
      }
      // }
    }
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
  // mounted () {
  //   console.log(this.$vuetify.breakpoint.smAndDown)
  // }
  created () {
    bus.$on('setStationDetails', (data) => {
      this.stationDetails = data
    })
  }
}
</script>
<style lang="scss">
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
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;
    }
    #view-icons {
      margin-bottom: 40px;
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
      font-size: 16px;
      color: #FFFF;
      font-weight: bold;
    }
    .city-text {
      font-family: Rubik;
      font-size: 14px;
      color: #FFFF;
    }
    .distance-text {
      font-family: Rubik;
      font-size: 20px;
      color: #FFFF;
      font-weight: bold;
    }
  }
  @mixin mobile-drawer () {
    .sidebar-element {
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;
    }
    #view-icons {
      margin-bottom: 40px;
    }
    .sidebar-icon {
      align-items: center;
      margin-bottom: 0.2rem;
      width: 20px;
      height: 20px;
    }
    .icon-text {
      font-family: Rubik;
      font-size: 10px;
      color: #FFFF;
      font-weight: bold;
    }
    .station-name-text {
      font-family: Rubik;
      font-size: 14px;
      color: #FFFF;
      font-weight: bold;
    }
    .city-text {
      font-family: Rubik;
      font-size: 12px;
      color: #FFFF;
    }
    .distance-text {
      font-family: Rubik;
      font-size: 18px;
      color: #FFFF;
      font-weight: bold;
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
    flex-direction: row;
    justify-content: center;
  }
  .sensor-row {
    display: flex;
    align-content: center;
    flex-direction: row;
    justify-content: space-between;
  }
  .sensor-column {
    align-content: center;
    flex-direction: column;
    justify-content: center;
    display: block;
  }
  .sensor-symbol {
    font-family: Rubik;
    font-size: 16px;
    color: #FFFF;
    font-weight: bold;
  }
  #image-container {
  height: 100px;
  }
  .logo-image {
    max-height: 55px;
    max-width: 200px;
  }
  #app {
    background-image:
      linear-gradient(to bottom, rgba(30, 230, 176, 0.5), rgba(30, 230, 176, 0.5))

  }
</style>
