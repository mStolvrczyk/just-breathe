<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card
          class="pa-3"
          color="teal lighten-4"
        >
          <div class="custom-popup" id="map">
            <l-map
              :zoom="zoom"
              :center="center"
              style="z-index: 0"
            >
              <l-tile-layer :url="url"
              :attribution="attribution"></l-tile-layer>
              <l-marker
                :key="index"
                v-for="(station, index) in allStations"
                :lat-lng="latLng(station.gegrLat, station.gegrLon)"
              >
                <div class="leaflet-popup-content-wrapper">
                  <l-popup :content="station.stationName"></l-popup>
                </div>
                  <l-icon
                    v-if="center === latLng(station.gegrLat, station.gegrLon)"
                    :icon-url="yellowIcon"
                    :icon-size="iconSize"
                  ></l-icon>
                  <l-icon
                    v-else
                    :icon-url="tealIcon"
                    :icon-size="iconSize"
                  ></l-icon>
              </l-marker>
            </l-map>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from 'vue2-leaflet'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'LeafletMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon
  },
  methods: {
    ...mapActions('stations', ['getStations']),
    latLng: (lat, lng) => {
      return L.latLng(lat, lng)
    }
  },
  computed: {
    ...mapGetters('stations', ['allStations', 'selectedStation']
    ),
    // centerStation () {
    //   this.$store.watch(
    //     this.selectedStation(), () => {
    //       this.center = L.latLng(this.selectedStation[0].gegrLat, this.selectedStation[0].gegrLon)
    //     }
    //   )
    // },
    // setZoom () {
    //   return 6
    //   // if (!this.selectedStation.length > 0) {
    //   // } else {
    //   //   return 10
    //   // }
    // }
    // addMarker () {
    //   L.marker().
    // }
  },
  created () {
    this.getStations()
  },
  data () {
    return {
      zoom: 6,
      center: L.latLng(52.25, 19.3),
      url: 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=fc31e976df5a44d7b5164bcbb91c70b0',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      tealIcon: require('@/assets/tealPin.png'),
      yellowIcon: require('@/assets/yellowPin.png'),
      iconSize: [40, 40]
    }
  },
  watch: {
    '$store.state.stations.selectedStation' () {
      this.center = L.latLng(this.selectedStation[0].gegrLat, this.selectedStation[0].gegrLon)
      this.zoom = 10
    }
  }
}
</script>

<style lang="stylus">
#map {
  height: 75vh;
}
.custom-popup .leaflet-popup-content-wrapper {
  background:#4DB6AC;
  color:white;
  font-size:16px;
  line-height:24px;
  border-radius: 5px;
}
</style>
