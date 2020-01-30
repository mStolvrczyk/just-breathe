<template>
  <v-app>
    <div class="navbar">
      <v-app-bar
        flat
        persistent
        dark
        app
        fixed
        :scroll-threshold="1"
        :scroll-off-screen="true"
        :src="require('./assets/appImage.jpg')"
      >
        <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
          />
        </template>
        <div class="v-toolbar-title">
          <v-toolbar-title>
            Air Quality Check
          </v-toolbar-title>
        </div>
        <v-spacer/>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="stationInputVisibility = !stationInputVisibility" icon>
              <v-icon>
                search
              </v-icon>
            </v-btn>
          </template>
          <span>Znajdź stację</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="userPanelVisibility = true" icon>
              <v-icon>
                person
              </v-icon>
            </v-btn>
          </template>
          <span>Panel użytkownika</span>
        </v-tooltip>
      </v-app-bar>
    </div>
    <v-content>
      <Dashboard
        :userPanelVisibility.sync="userPanelVisibility"
        v-on:closeUserPanel="closeUserPanel"
        :stationInputVisibility.sync="stationInputVisibility"
        v-on:closeStationInput="closeStationInput"
      />
    </v-content>
  </v-app>
</template>
<script>
import Dashboard from './views/Dashboard'

export default {
  components: { Dashboard },
  data: () => ({
    stationInputVisibility: false,
    userPanelVisibility: false
  }),
  methods: {
    closeStationInput (value) {
      this.stationInputVisibility = value
    },
    closeUserPanel (value) {
      this.userPanelVisibility = value
    }
  }
}
</script>
<style>
    #app {
      background-image:
        linear-gradient(to bottom, rgba(30, 230, 176, 0.5), rgba(30, 230, 176, 0.5))

    }
</style>
