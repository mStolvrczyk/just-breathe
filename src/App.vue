<template>
    <v-app class="primary-background">
        <component :is="layout">
            <router-view></router-view>
        </component>
    </v-app>
</template>

<script>
import LayoutRegular from '@/layouts/LayoutRegular'
import LayoutLite from '@/layouts/LayoutLite'

export const layout = 'Regular'

export default {
  components: { LayoutLite, LayoutRegular },
  computed: {
    layout () {
      return `Layout${layout}`
    }
  }
}
</script>

<style lang="stylus">
    .primary-background {
        background-color: #ECEFF1
    }
</style>
