<template>
  <div id="apps">
    <layout/>
<!--    <layout-lite/>-->
  </div>
</template>
<style lang="stylus">
  #app {
    background-color #ECEFF1
  }
</style>
<script>
import Layout from './components/layout/Layout'
import LayoutLite from './components/layout_lite/LayoutLite'
export default {
  components: { LayoutLite, Layout }
}
</script>
