<template>
    <v-container>
        <v-autocomplete
                background-color="teal lighten-4"
                v-model="selectedStation"
                :items="allStations"
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
        <LeafletMap :selected-station="selectedStation"></LeafletMap>
    </v-container>
</template>
<script>
import LeafletMap from '@/components/ui/LeafletMap'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Dashboard',
  components: { LeafletMap },
  data: () => ({
    selectedStation: null,
    searchValue: ''
  }),
  methods: {
    ...mapActions('stations', ['getStations'])
  },
  computed: {
    ...mapGetters('stations', ['allStations']
    )
  },
  mounted () {
    return this.getStations()
  }
}
</script>

<style scoped>

</style>
