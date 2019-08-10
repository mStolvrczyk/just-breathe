<template>
  <div id="layout_lite">
    <v-app>
      <v-img
      :src="appImage"
      :gradient="appOverlayGradiant"
      >
        <navbar/>
        <dash/>
      </v-img>
    </v-app>
  </div>
</template>

<script>
import Navbar from './layout_lite_elements/Navbar'
import Dash from './layout_lite_elements/Dash'
import { mapState } from 'vuex'
export default {
  name: 'LayoutLite',
  components: { Dash, Navbar },
  computed: {
    ...mapState('layout', ['appImage']),
    appOverlayGradiant () {
      return `${this.$store.state.layout.appBackgroundColor}, ${this.$store.state.layout.appBackgroundColor}`
    }
  }
}
</script>

<style scoped>

</style>
