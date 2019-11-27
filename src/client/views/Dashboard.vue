<template>
  <div id="dashboard">
    <LeafletMap
      :autocompleteInput.sync="autocompleteInput"
      :stations="stations"
      v-on:closeAutocompleteDialog="sendVisibility"
    />
  </div>
</template>
<script>
import LeafletMap from '@/components/ui/LeafletMap'
import StationsService from '@/services/StationsService'

export default {
  name: 'Dashboard',
  components: { LeafletMap },
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
    },
    sendVisibility (value) {
      this.$emit('closeAutocompleteDialog', value)
    }
  },
  mounted () {
    this.getAllStations()
  }
}
</script>
