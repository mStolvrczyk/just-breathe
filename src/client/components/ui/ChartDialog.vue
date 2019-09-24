<template>
  <v-dialog
    v-model="visibility"
    width="600"
    persistent
  >
    <v-card>
      <v-card-text>
        {{this.stationDetails}}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          flat
          @click="closeDialog"
        >
          Zamknij
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import StationsService from '@/services/StationsService'
import Functions from '@/libs/helperFunctions'

export default {
  name: 'ChartDialog',
  data () {
    return {
      stationsService: new StationsService(),
      functions: new Functions(),
      stationDetails: null
    }
  },
  props: {
    visibility: Boolean,
    choosenStationId: null
  },
  methods: {
    closeDialog () {
      this.$emit('updateVisibility', false)
    },
    async getThisStation (id) {
      this.stationDetails = await this.stationsService.getStation(id)
    }
  },
  watch: {
    'choosenStationId' (value) {
      this.getThisStation(value)
    }
  }
}
</script>

<style scoped>

</style>
