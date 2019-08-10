<template>
  <div id="layout">
    <v-app>
      <navbar/>
      <sidebar/>
      <dash/>
    </v-app>
  </div>
</template>

<script>
import Navbar from './layout_elements/Navbar'
import Sidebar from './layout_elements/Sidebar'
import Dash from './layout_elements/Dash'
export default {
  name: 'Layout',
  components: { Dash, Sidebar, Navbar }
}
</script>

<style scoped>

</style>
