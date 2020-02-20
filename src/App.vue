<template>
  <v-app>
    <v-app-bar
      flat
      persistent
      dark
      app
      fixed
      :scroll-threshold="1"
      :scroll-off-screen="true"
      :src="require('@/assets/appImage.jpg')"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
        />
      </template>
      <div class="v-toolbar-title">
        <v-toolbar-title>
          Air Quality Check
        </v-toolbar-title>
      </div>
      <v-spacer/>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" @click="$router.push('/dashboard')" icon>
            <v-icon>
              mdi-tablet-dashboard
            </v-icon>
          </v-btn>
        </template>
        <span>Znajdź stację</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" @click="$router.push('/map')" icon>
            <v-icon>
              mdi-map-marker
            </v-icon>
          </v-btn>
        </template>
        <span>Panel użytkownika</span>
      </v-tooltip>
    </v-app-bar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      stationInputVisibility: false,
      userPanelVisibility: false,
      watcher: navigator.geolocation.watchPosition(this.getLocation),
      userLocation: []
    }
  },
  methods: {
    getLocation (pos) {
      if (this.userLocation.length >= 0) {
        navigator.geolocation.clearWatch(this.watcher)
      }
      this.userLocation.push(
        pos.coords.latitude,
        pos.coords.longitude
      )
    },
    ...mapActions('stations', ['getAllStations', 'getUserLocation']),
    // ...mapActions('stations', ['getUserLocation']),
    closeStationInput (value) {
      this.stationInputVisibility = value
    },
    closeUserPanel (value) {
      this.userPanelVisibility = value
    }
  },
  watch: {
    'userLocation' () {
      this.getUserLocationDetails(this.userLocation)
    }
  },
  mounted () {
    this.getAllStations()
  },
  created () {
  }
}
</script>
<style>
  #app {
    background-image:
      linear-gradient(to bottom, rgba(30, 230, 176, 0.5), rgba(30, 230, 176, 0.5))

  }
</style>
