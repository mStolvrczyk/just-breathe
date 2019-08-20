<template>
  <v-toolbar
    color='rgba(0, 0, 0, 0.3)'
    flat
    persistent
    app
    fixed
    scroll-threshold="1"
    scroll-off-screen="true"
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
              class="white--text font-weight-light"
              id="toolbar"
            >
              Air Quality Check<span style="font-style: italic" class="font-weight-thin"> Lite</span>
            </v-toolbar-title>
        </div>
        <v-spacer/>
          <v-toolbar-items>
            <v-btn icon>
              <v-icon
                color="white"
              >
                notifications</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon
                color="white"
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
    title: 'Air Quality Check',
    subtitle: 'Lite',
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
