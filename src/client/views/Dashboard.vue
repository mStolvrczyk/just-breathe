<template>
  <div id="dashboard">
    <LeafletMap
      :autocompleteInput.sync="autocompleteInput"
      :stations="stations"
    />
  </div>
</template>
<script>
import LeafletMap from '@/components/ui/LeafletMap'
import StationsService from '@/services/StationsService'
import ChartDialog from '@/components/ui/ChartDialog'

export default {
  name: 'Dashboard',
  components: { LeafletMap },
  watch: {
    'pieDataCollection' (value) {
      console.log(value)
    }
  },
  data: () => ({
    stationsService: new StationsService(),
    stations: []
  }),
  props: {
    autocompleteInput: Boolean
  },
  methods: {
    async getAllStations () {
      this.stations = await this.stationsService.getAll()
    }
  },
  mounted () {
    this.getAllStations()
  }
}
</script>

<style scoped>

</style>
