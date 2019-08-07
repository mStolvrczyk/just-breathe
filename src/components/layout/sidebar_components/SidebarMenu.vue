<template>
  <v-list>
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
  </v-list>
</template>

<script>
export default {
  name: 'SidebarMenu',
  data () {
    return {
      drawer: true,
      links: [
        { title: 'Home', to: '/dashboard', icon: 'dashboard' },
        { title: 'User panel', icon: 'person' },
        { title: 'Map', to: '/map', icon: 'place' }
      ]
      // responsive: false

    }
  }
}
</script>

<style scoped>

</style>
