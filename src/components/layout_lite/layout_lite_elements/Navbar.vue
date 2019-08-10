<template>
  <v-toolbar
    color="teal lighten-4"
    flat
    persistent
    app
    fixed
  >
<!--    <v-img-->
<!--      :src="navbarImage"-->
<!--      :gradient="navbarOverlayGradiant"-->
<!--      height="100%"-->
<!--      width="100%"-->
<!--    >-->
      <v-layout
        class="fill-height"
      >
        <v-flex
        align-center
        layout
        >
          <div class="v-toolbar-title">
            <v-toolbar-title
              class="tertiary--text font-weight-light"
              id="toolbar"
            >
              Air Quality Check
            </v-toolbar-title>
        </div>
        <v-spacer/>
          <v-toolbar-items>
            <v-btn icon>
              <v-icon
                color="tertiary"
              >
                apps</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon
                color="tertiary"
              >
                notifications</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon
                color="tertiary"
              >
                person</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-flex>
      </v-layout>
<!--    </v-img>-->
</v-toolbar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Navbar',
  data: () => ({
    title: null,
    responsive: false
  }),
  computed: {
    ...mapState('layout', ['navbarImage']),
    navbarOverlayGradiant () {
      return `${this.$store.state.layout.navbarBackgroundColor}, ${this.$store.state.layout.navbarBackgroundColor}`
    }
  }
}
</script>

<style lang="stylus">
</style>
