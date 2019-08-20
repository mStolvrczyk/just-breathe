<template>
    <v-autocomplete
            background-color="teal lighten-4"
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            chips
            flat
            hide-no-data
            clearable
            item-text="stationName"
            item-value="id"
            label="Insert city name here"
            solo
    >
        <template v-slot:no-data
        >
            <v-list-tile>
                <v-list-tile-title>
                    Try it now!
                </v-list-tile-title>
            </v-list-tile>
        </template>
        <template v-slot:selection="{ item, selected }">
            <v-chip
                    :selected="selected"
                    color="blue-grey"
                    class="white--text"
            >
                <v-icon left>mdi-coin</v-icon>
                <span v-text="item.stationName"></span>
            </v-chip>
        </template>
        <template v-slot:item="{ item }">
            <v-list-tile>
                <v-list-tile-avatar
                        color="teal"
                        class="headline font-weight-light white--text"
                >
                    {{ item.stationName.charAt(0) }}
                </v-list-tile-avatar>
                <v-list-tile-content @click="getSelectedStation(item.stationName), viewStation()">
                    <v-list-tile-title v-text="item.stationName"></v-list-tile-title>
                    <v-list-tile-sub-title v-text="item.city"></v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
        </template>
    </v-autocomplete>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'StationsSearch',
  data: () => ({
    isLoading: false,
    items: [],
    model: null,
    search: null,
    selection: null,
    stationName: null
  }),
  methods: {
    ...mapActions('stations', ['getStations', 'getSelectedStation']),
    viewStation () {
      console.log(this.selectedStation[0].gegrLat)
    }
  },
  computed: {
    ...mapGetters('stations', ['allStations', 'selectedStation']
    )
  },
  created () {
    this.getStations()
  },
  watch: {
    search (val) {
      if (this.items.length > 0) return

      this.isLoading = true

      this.items = this.allStations
    }
  }
}
</script>

<style scoped>

</style>
