<template>
  <v-toolbar
    color="grey lighten-5"
    flat
    prominent
    clipped-left="true"
  >
    <v-spacer></v-spacer>
    <!--    <div-->
    <!--      width="250"-->
    <!--    >-->
    <!--      <v-autocomplete-->
    <!--        background-color="grey lighten-3"-->
    <!--        v-model="model"-->
    <!--        :items="items"-->
    <!--        :loading="isLoading"-->
    <!--        :search-input.sync="search"-->
    <!--        chips-->
    <!--        flat-->
    <!--        hide-no-data-->
    <!--        clearable-->
    <!--        item-text="stationName"-->
    <!--        item-value="id"-->
    <!--        label="Insert city name here"-->
    <!--        solo-->
    <!--      >-->
    <!--        <template v-slot:no-data-->
    <!--        >-->
    <!--          <v-list-tile>-->
    <!--            <v-list-tile-title>-->
    <!--              Try it now!-->
    <!--            </v-list-tile-title>-->
    <!--          </v-list-tile>-->
    <!--        </template>-->
    <!--        <template v-slot:selection="{ item, selected }">-->
    <!--          <v-chip-->
    <!--            :selected="selected"-->
    <!--            color="blue-grey"-->
    <!--            class="white&#45;&#45;text"-->
    <!--          >-->
    <!--            <v-icon left>mdi-coin</v-icon>-->
    <!--            <span v-text="item.stationName"></span>-->
    <!--          </v-chip>-->
    <!--        </template>-->
    <!--        <template v-slot:item="{ item }">-->
    <!--          <v-list-tile>-->
    <!--            <v-list-tile-avatar-->
    <!--              color="teal"-->
    <!--              class="headline font-weight-light white&#45;&#45;text"-->
    <!--            >-->
    <!--              {{ item.stationName.charAt(0) }}-->
    <!--            </v-list-tile-avatar>-->
    <!--            <v-list-tile-content @click="getStation(item), getStationName(item)">-->
    <!--              <v-list-tile-title v-text="item.stationName"></v-list-tile-title>-->
    <!--              <v-list-tile-sub-title v-text="item.city"></v-list-tile-sub-title>-->
    <!--            </v-list-tile-content>-->
    <!--            <v-list-tile-action>-->
    <!--              <v-icon>mdi-coin</v-icon>-->
    <!--            </v-list-tile-action>-->
    <!--          </v-list-tile>-->
    <!--        </template>-->
    <!--      </v-autocomplete>-->
    <!--    </div>-->

    <!--    <v-btn icon>-->
    <!--      <v-icon>search</v-icon>-->
    <!--    </v-btn>-->

    <v-btn icon>
      <v-icon
        color="grey darken-1"
      >
        apps</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon
        color="grey darken-1"
      >
        notifications</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon
        color="grey darken-1"
      >
        person</v-icon>
    </v-btn>

    <!--    <v-btn icon>-->
    <!--      <v-icon>refresh</v-icon>-->
    <!--    </v-btn>-->

    <!--    <v-btn icon>-->
    <!--      <v-icon>more_vert</v-icon>-->
    <!--    </v-btn>-->
  </v-toolbar>
</template>

<script>
  export default {
    name: 'Navbar'
  }
</script>

<!--<style lang="stylus">-->
<!--</style>-->
