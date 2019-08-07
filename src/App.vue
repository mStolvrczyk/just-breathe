<template>
  <v-app id="app">
    <navbar/>
    <sidebar/>
    <dash/>
  </v-app>
</template>
<style lang="stylus">
  #app {
    background-color #ECEFF1

  }
</style>
<script>
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Dash from './components/Dash'
export default {
  components: { Dash, Sidebar, Navbar }
}
</script>
