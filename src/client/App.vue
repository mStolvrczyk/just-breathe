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
        :src="require('@/assets/appImage.jpg')"
      >
        <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
          ></v-img>
        </template>
        <div class="v-toolbar-title">
          <v-toolbar-title>
            Air Quality Check
          </v-toolbar-title>
        </div>
        <v-spacer/>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="autocompleteInput = !autocompleteInput" icon>
              <v-icon>
                search
              </v-icon>
            </v-btn>
          </template>
          <span>Znajdź stację</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon>
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
        :autocompleteInput.sync="autocompleteInput"
        v-on:closeAutocompleteDialog="setVisibility"
      />
    </v-content>
  </v-app>
</template>
<script>
import Dashboard from '@/views/Dashboard'

export default {
  components: { Dashboard },
  data: () => ({
    autocompleteInput: false
  }),
  methods: {
    setVisibility (value) {
      this.autocompleteInput = value
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
