<template>
    <div class="custom-popup" id="map">
        <l-map
                :zoom.sync="zoom"
                :center="center"
                style="z-index: 0"
        >
            <l-tile-layer :url="url"
                          :attribution="attribution"></l-tile-layer>
            <l-marker
                    :key="station.id"
                    v-for="station in allStations"
                    :lat-lng="getMark(station)"
            >
                <div class="leaflet-popup-content-wrapper">
                    <l-popup :content="station.stationName"></l-popup>
                </div>
                <l-icon
                        v-if="center.id === station.id"
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
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from 'vue2-leaflet'
import { mapGetters } from 'vuex'

export default {
  name: 'LeafletMap',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon
  },
  props: {
    selectedStation: Object
  },
  methods: {
    getMark: (station) => {
      return {
        id: station.id,
        lat: station.gegrLat,
        lng: station.gegrLon,
        color: 'blue'
      }
    }
  },
  computed: {
    ...mapGetters('stations', ['allStations'])
  },
  data () {
    return {
      zoom: 6,
      center: {
        lat: 52.25,
        lng: 19.3
      },
      url: 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=fc31e976df5a44d7b5164bcbb91c70b0',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      tealIcon: require('@/assets/tealPin.png'),
      yellowIcon: require('@/assets/yellowPin.png'),
      iconSize: [40, 40]
    }
  },
  watch: {
    'selectedStation' (value) {
      this.center = {
        id: value.id,
        lat: value.gegrLat,
        lng: value.gegrLon
      }
      this.zoom = 13
    }
  }
}
</script>

<style lang="stylus">
    #map {
        height: 80vh;
    }

    .custom-popup .leaflet-popup-content-wrapper {
        background: #4DB6AC;
        color: white;
        font-size: 16px;
        line-height: 24px;
        border-radius: 5px;
    }
</style>
