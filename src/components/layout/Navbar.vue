<template>
  <v-toolbar
    color="#ECEFF1"
    flat
    prominent
  >
    <div class="v-toolbar-title">
      <v-toolbar-title
        class="tertiary--text font-weight-light"
      >
        <v-btn
          v-if="responsive"
          class="default v-btn--simple"
          dark
          icon
          @click.stop="onClickBtn"
        >
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
        {{ title }}
      </v-toolbar-title>
    </div>
    <v-spacer/>
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
  </v-toolbar>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Navbar',
  data: () => ({
    title: null,
    responsive: false
  }),
  watch: {
    '$route' (val) {
      this.title = val.name
    }
  }
}
</script>

<!--<style lang="stylus">-->
<!--</style>-->
