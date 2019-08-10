<template>
  <v-content>
    <v-container>
      <v-layout row wrap>
        <v-flex xs8 offset-xs2>
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
                <v-list-tile-content @click="getStation(item), getStationName(item)">
                  <v-list-tile-title v-text="item.stationName"></v-list-tile-title>
                  <v-list-tile-sub-title v-text="item.city"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>mdi-coin</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-autocomplete>
          <!--        <div class="todos">-->
          <!--          <div v-for="station in allStations" :key="station.id" class="todo">-->
          <!--            {{station.city}}-->
          <!--          </div>-->
          <!--        </div>-->
          <leaflet-map/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import LeafletMap from '../../material/LeafletMap'
export default {
  name: 'Dash',
  components: { LeafletMap }
}
</script>

<style scoped>
</style>
