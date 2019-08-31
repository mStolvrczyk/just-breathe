<template>
    <v-navigation-drawer
            v-model="sidebarVisibility"
            fixed
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
                <v-list-tile
                        v-for="link in links"
                        :key="link.title"
                        :to="link.to"
                >
                    <v-list-tile-action>
                        <v-icon>{{ link.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ link.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-layout>
        </v-img>
    </v-navigation-drawer>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Sidebar',
  data () {
    return {
      responsive: false,
      sidebarVisibility: false,
      drawer: true,
      links: [
        { title: 'Home', to: '/dashboard', icon: 'dashboard' },
        { title: 'User panel', icon: 'person' },
        { title: 'Map', to: '/map', icon: 'place' }
      ]
    }
  },
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
