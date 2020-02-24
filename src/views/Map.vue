<template>
  <div id="map">
    <LeafletMap
      :stationInputVisibility.sync="stationInputVisibility"
      :stations="allStationsState"
      v-on:closeStationInput="closeStationInput"
    />
    <UserPanel
      :userPanelVisibility.sync="userPanelVisibility"
      v-on:closeUserPanel="closeUserPanel"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
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
    ...mapState('stations', ['allStationsState'])
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
  }
}
</script>
