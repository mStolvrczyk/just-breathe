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
          icon
          @click.stop="onClickBtn"
        >
          <v-icon
          color="grey"
          >mdi-view-list</v-icon>
        </v-btn>
        {{ title }}
      </v-toolbar-title>
    </div>
    <v-spacer/>
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
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },

  methods: {
    ...mapMutations('layout', ['setDrawer', 'toggleDrawer']),
    onClickBtn () {
      this.setDrawer(!this.$store.state.layout.drawer)
    },
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  }
}
</script>

<style lang="stylus">
</style>
