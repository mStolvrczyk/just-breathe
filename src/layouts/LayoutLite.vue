<template>
    <div>
        <Navbar></Navbar>
        <v-content>
            <v-container fluid class="pa-0">
                <v-img
                        :src="appImage"
                        :gradient="appOverlayGradiant"
                >
                    <router-view></router-view>
                </v-img>
            </v-container>
        </v-content>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from '@/components/ui/NavbarLite'

export default {
  name: 'LayoutLite',
  components: { Navbar },
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
