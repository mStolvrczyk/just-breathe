<template>
  <v-toolbar
    color="#ECEFF1"
    flat
    prominent
    app
    fixed
  >
    <div class="v-toolbar-title">
      <v-toolbar-title
        class="tertiary--text font-weight-light"
        id="toolbar"
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
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
    this.title = this.getTitle
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },

  methods: {
    ...mapMutations('layout', ['setDrawer', 'toggleDrawer']),
    onClickBtn () {
      this.setDrawer(!this.$store.state.layout.drawer)
    },
    onClick () {
      //
    },
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  },
  computed: {
    getTitle () {
      return this.$route.name
    }
  }
}
</script>

<style lang="stylus">
</style>
