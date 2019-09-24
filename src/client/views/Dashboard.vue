<template>
    <v-container>
        <v-autocomplete
                background-color="teal lighten-4"
                v-model="selectedStation"
                :items="stations"
                flat
                search="searchValue"
                hide-no-data
                clearable
                item-value="id"
                item-text="stationName"
                label="Wybierz stację"
                solo
                return-object
        >
            <template v-slot:no-data>
                <v-list-tile>
                    <v-list-tile-title>
                        Brak stacji
                    </v-list-tile-title>
                </v-list-tile>
            </template>
        </v-autocomplete>
        <LeafletMap
          :stations="stations"
          :selected-station="selectedStation"
          :visibility.sync="chartDialogVisibility"
          v-on:updateVisibility="updateChartDialogVisibility"
          v-on:sendId="setChoosenStationId"
        />
        <ChartDialog
          :visibility.sync="chartDialogVisibility"
          v-on:updateVisibility="updateChartDialogVisibility"
          :choosenStationId="choosenStationId"
        />
    </v-container>
</template>
<script>
import LeafletMap from '@/components/ui/LeafletMap'
import StationsService from '@/services/StationsService'
import ChartDialog from '@/components/ui/ChartDialog'

export default {
  name: 'Dashboard',
  components: { LeafletMap, ChartDialog },
  data: () => ({
    selectedStation: null,
    searchValue: '',
    stationsService: new StationsService(),
    stations: [],
    chartDialogVisibility: false,
    choosenStationId: null
  }),
  methods: {
    async getAllStations () {
      this.stations = await this.stationsService.getAll()
    },
    updateChartDialogVisibility (value) {
      this.chartDialogVisibility = value
    },
    setChoosenStationId (value) {
      this.choosenStationId = value
    }
  },
  mounted () {
    this.getAllStations()
  }
}
</script>

<style scoped>

</style>
