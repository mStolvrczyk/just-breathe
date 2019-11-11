<template>
  <div id="dashboard">
    <LeafletMap
      :stations="stations"
      v-on:sendBarDataCollection="saveBarDataCollection"
      v-on:sendLineDataCollection="savePieDataCollection"
      v-on:sendAverageMeasurement="savePieDataCollection"
      v-on:sendbarDataCollection="savePieDataCollection"
    />
    <ChartDialog
      :visibility.sync="visibility"
      v-on:updateVisibility="updateDetailsDialogVisibility"
    />
  </div>
</template>
<script>
import LeafletMap from '@/components/ui/LeafletMap'
import StationsService from '@/services/StationsService'
import ChartDialog from '@/components/ui/ChartDialog'

export default {
  name: 'Dashboard',
  components: { ChartDialog, LeafletMap },
  watch: {
    'pieDataCollection' (value) {
      console.log(value)
    }
  },
  data: () => ({
    stationsService: new StationsService(),
    stations: [],
    visibility: false
  }),
  methods: {
    async getAllStations () {
      this.stations = await this.stationsService.getAll()
    },
    savePieDataCollection (value) {
      this.pieDataCollection = value
      this.visibility = true
    },
    updateDetailsDialogVisibility (value) {
      this.visibility = value
    }
  },
  mounted () {
    this.getAllStations()
  }
}
</script>

<style scoped>

</style>
