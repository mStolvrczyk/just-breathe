<template>
  <LeafletMap
    :stations="stations"
  />
</template>
<script>
import LeafletMap from '@/components/ui/LeafletMap'
import StationsService from '@/services/StationsService'

export default {
  name: 'Dashboard',
  components: { LeafletMap },
  data: () => ({
    stationsService: new StationsService(),
    stations: [],
  }),
  methods: {
    async getAllStations () {
      this.stations = await this.stationsService.getAll()
    },
  },
  mounted () {
    this.getAllStations()
  }
}
</script>

<style scoped>

</style>
