<template>
  <div id="dashboard">
    {{loadUserLocation}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters('stations', ['loadUserLocation'])
  }

}
</script>

<style scoped>
  #dashboard {
    width: 100%;
    height: 100%;
    background: #E0F2F1;
  }
</style>
