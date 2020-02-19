<template>
  <div id="map">
    <LeafletMap
      :stationInputVisibility.sync="stationInputVisibility"
      :stations="getAllStations"
      v-on:closeStationInput="closeStationInput"
    />
    <UserPanel
      :userPanelVisibility.sync="userPanelVisibility"
      v-on:closeUserPanel="closeUserPanel"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import LeafletMap from '@/components/ui/LeafletMap'
import StationsService from '@/services/StationsService'
import UserPanel from '@/components/ui/UserPanel'

export default {
  name: 'Dashboard',
  components: { UserPanel, LeafletMap },
  data: () => ({
    stationsService: new StationsService(),
    stations: []
  }),
  props: {
    stationInputVisibility: Boolean,
    userPanelVisibility: Boolean
  },
  computed: {
    ...mapGetters('stations', ['getAllStations'])
  },
  methods: {
    async getAllStations () {
      this.stations = await this.stationsService.getAll()
    },
    closeStationInput (value) {
      this.$emit('closeStationInput', value)
    },
    closeUserPanel (value) {
      this.$emit('closeUserPanel', value)
    }
  },
  mounted () {
    // this.getAllStations()
  }
}
</script>
