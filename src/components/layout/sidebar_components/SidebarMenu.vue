<template>
  <v-list>
    <v-list-tile
      v-for="item in items"
      :key="item.title"
      @click=""
    >
      <v-list-tile-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
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
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'User panel', icon: 'person' },
        { title: 'Map', icon: 'place' }
      ],
      links: ['Home', 'Contacts', 'Settings'],
      // responsive: false

    }
  }
}
</script>

<style scoped>

</style>
