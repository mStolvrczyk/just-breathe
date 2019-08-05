<template>
  <div>
    <navbar/>
    <sidebar/>
    <v-content>
      <router-view/>
    </v-content>
  </div>
</template>

<script>
  import Navbar from './layout/Navbar'
  import Sidebar from './layout/Sidebar'
  export default {
    name: 'Dash',
    components: { Sidebar, Navbar }
  }
</script>

<style scoped>

</style>
