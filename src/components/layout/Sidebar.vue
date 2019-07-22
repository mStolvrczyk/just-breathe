<!--<template>-->
<!--  <v-navigation-drawer-->
<!--    id="ap-drawer"-->
<!--    class="teal lighten-3"-->
<!--    app-->
<!--    dark-->
<!--    floating-->
<!--    persistent-->
<!--    width="260"-->
<!--  >-->
<!--    <v-img-->
<!--      :src="image"-->
<!--      :gradient="sidebarOverlayGradiant"-->
<!--      height="100%"-->
<!--    >-->
<!--      <v-list>-->
<!--        <v-list-tile-->
<!--          v-for="item in items"-->
<!--          :key="item.title"-->
<!--          @click=""-->
<!--        >-->
<!--          <v-list-tile-action>-->
<!--            <v-icon>{{ item.icon }}</v-icon>-->
<!--          </v-list-tile-action>-->

<!--          <v-list-tile-content>-->
<!--            <v-list-tile-title>{{ item.title }}</v-list-tile-title>-->
<!--          </v-list-tile-content>-->
<!--        </v-list-tile>-->
<!--      </v-list>-->
<!--    </v-img>-->
<!--  </v-navigation-drawer>-->
<!--</template>-->
<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <v-img
      :src="image"
      :gradient="sidebarOverlayGradiant"
      height="100%"
    >
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile avatar>
          <v-list-tile-avatar
            color="white"
          >
            <v-img
              :src="logo"
              height="34"
              contain
            />
          </v-list-tile-avatar>
          <v-list-tile-title class="title">
            Vuetify MD
          </v-list-tile-title>
        </v-list-tile>
        <v-divider/>
        <v-list-tile
          v-if="responsive"
        >
          <v-text-field
            class="purple-input search-input"
            label="Search..."
            color="purple"
          />
        </v-list-tile>
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          :active-class="color"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title
            v-text="link.text"
          />
        </v-list-tile>
        <v-list-tile
          disabled
          active-class="primary"
          class="v-list-item v-list__tile--buy"
          to="/upgrade"
        >
          <v-list-tile-action>
            <v-icon>mdi-package-up</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="font-weight-light">
            Upgrade To PRO
          </v-list-tile-title>
        </v-list-tile>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<!--<script>-->
<!--import { mapMutations, mapState } from 'vuex'-->

<!--export default {-->
<!--  name: 'Sidebar',-->
<!--  data () {-->
<!--    return {-->
<!--      drawer: true,-->
<!--      items: [-->
<!--        { title: 'Home', icon: 'dashboard' },-->
<!--        { title: 'About', icon: 'question_answer' }-->
<!--      ],-->
<!--      links: ['Home', 'Contacts', 'Settings'],-->
<!--      mini: true,-->
<!--      right: null-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapState('app', ['image', 'color']),-->
<!--    inputValue: {-->
<!--      get () {-->
<!--        return this.$store.state.app.sidebar-->
<!--      },-->
<!--      set (val) {-->
<!--        this.setSidebar(val)-->
<!--      }-->
<!--    },-->
<!--    // eslint-disable-next-line vue/no-dupe-keys-->
<!--    items () {-->
<!--      return this.$t('Layout.View.items')-->
<!--    },-->
<!--    sidebarOverlayGradiant () {-->
<!--      return `${this.$store.state.app.sidebarBackgroundColor}, ${this.$store.state.app.sidebarBackgroundColor}`-->
<!--    }-->
<!--  },-->
<!--  mounted () {-->
<!--    this.onResponsiveInverted()-->
<!--    window.addEventListener('resize', this.onResponsiveInverted)-->
<!--  },-->
<!--  beforeDestroy () {-->
<!--    window.removeEventListener('resize', this.onResponsiveInverted)-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapMutations('app', ['setSidebar', 'toggleSidebar']),-->
<!--    onResponsiveInverted () {-->
<!--      if (window.innerWidth < 991) {-->
<!--        this.responsive = true-->
<!--      } else {-->
<!--        this.responsive = false-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  data: () => ({
    logo: './img/vuetifylogo.png',
    links: [
      {
        to: '/dashboard',
        icon: 'mdi-view-dashboard',
        text: 'Dashboard'
      },
      {
        to: '/user-profile',
        icon: 'mdi-account',
        text: 'User Profile'
      },
      {
        to: '/table-list',
        icon: 'mdi-clipboard-outline',
        text: 'Table List'
      },
      {
        to: '/typography',
        icon: 'mdi-format-font',
        text: 'Typography'
      },
      {
        to: '/icons',
        icon: 'mdi-chart-bubble',
        text: 'Icons'
      },
      {
        to: '/maps',
        icon: 'mdi-map-marker',
        text: 'Maps'
      },
      {
        to: '/notifications',
        icon: 'mdi-bell',
        text: 'Notifications'
      }
    ],
    responsive: false
  }),
  computed: {
    ...mapState('app', ['image', 'color']),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
    items () {
      return this.$t('Layout.View.items')
    },
    sidebarOverlayGradiant () {
      return `${this.$store.state.app.sidebarBackgroundColor}, ${this.$store.state.app.sidebarBackgroundColor}`
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
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
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
