<template>
  <v-navigation-drawer
    id="ap-drawer"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <v-img
      :src="sidebarImage"
      :gradient="sidebarOverlayGradiant"
      height="100%"
    >
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile avatar>
          <v-list-tile-title class="title">
            Air Quality Check
          </v-list-tile-title>
        </v-list-tile>
        <v-divider/>
        <sidebar-menu/>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import SidebarMenu from './SidebarMenu'

export default {
  name: 'Sidebar',
  data () {
    return {
      responsive: false
    }
  },
  components: { SidebarMenu },
  computed: {
    ...mapState('layout', ['sidebarImage']),
    // inputValue: {
    //   get () {
    //     return this.$store.state.layout.drawer
    //   },
    //   set (val) {
    //     this.setDrawer(val)
    //   }
    // },
    // eslint-disable-next-line vue/no-dupe-keys
    // items () {
    //   return this.$t('Layout.View.items')
    // },
    sidebarOverlayGradiant () {
      return `${this.$store.state.layout.sidebarBackgroundColor}, ${this.$store.state.layout.sidebarBackgroundColor}`
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

<style scoped>

</style>
