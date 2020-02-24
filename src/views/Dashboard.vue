<template>
  <div id="dashboard">
    {{ dashboardDataState }}
  </div>
</template>

<script>
import { mapState } from 'vuex'
import HelperFunctions from '@/libs/helperFunctions'
import StationsService from '@/services/StationsService'
export default {
  name: 'Dashboard',
  data () {
    return {
      functions: new HelperFunctions(),
      stationsService: new StationsService(),
      userLocation: null,
      allStations: null,
      dashboardData: null
    }
  },
  computed: {
    ...mapState('stations', ['dashboardDataState'])
  },
  watch: {
    dashboardDataState: {
      handler: function (value) {
        this.dashboardData = value
      },
      deep: true
    }
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
