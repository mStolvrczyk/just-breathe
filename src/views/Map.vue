<template>
  <div id="dashboard">
    <LeafletMap
      :stationInputVisibility.sync="stationInputVisibility"
      :stations="stations"
      v-on:closeStationInput="closeStationInput"
    />
    <UserPanel
      :userPanelVisibility.sync="userPanelVisibility"
      v-on:closeUserPanel="closeUserPanel"
    />
  </div>
</template>
<script>
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
    this.getAllStations()
  }
}
</script>
