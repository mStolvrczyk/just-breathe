<template>
<v-dialog
  v-model="visibility"
  width="600"
>
  <transition name="sensor_popup">
    <div
      id="chart_card"
      v-if="functions.barDataColllection != null"
    >
      <v-card
        class="pa-3"
        color="teal lighten-4"
        width="600"
      >
        <div align="center">
          <v-card
            color="white"
          >
            <v-card-text
              align="center"
              v-if="functions.barDataColllection === null"
            >
              <strong>
                Brak pomiarów
              </strong>
            </v-card-text>
            <div v-else>
              <bar-chart
                v-if="chartSwitch"
                :chart-data="functions.barDataColllection"
                :height="170"
              />
              <line-chart
                v-else
                :chart-data="functions.lineDataCollection"
                :height="170"
              />
            </div>
          </v-card>
          <div class="text-center pa-2" v-if="functions.barDataColllection != null">
            <v-btn-toggle rounded v-model="alignment">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="chartSwitch = true" color="white" v-on="on">
                    <v-icon style="font-size:23px;color: teal">mdi-chart-bar</v-icon>
                  </v-btn>
                </template>
                <span>Wykres słupkowy</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="chartSwitch = false" color="white" v-on="on">
                    <v-icon style="font-size:23px;color: teal">mdi-chart-bell-curve</v-icon>
                  </v-btn>
                </template>
                <span>Wykres liniowy</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="functions.compareWithYesterday(functions.sensorId, functions.apiResponse)" color="white" v-on="on">
                    <v-icon style="font-size:23px;color: teal">mdi-compare</v-icon>
                  </v-btn>
                </template>
                <span>Porównaj z wczoraj</span>
              </v-tooltip>
            </v-btn-toggle>
          </div>
          <v-container fluid class="pa-0" v-if="functions.barDataColllection != null">
            <v-row align="center">
              <v-col cols="12" sm="12">
                <div class="text-center">
                  <v-card
                    color="teal lighten-1"
                  >
                    <v-card-text class="white--text">
                      <strong>uśredniony pomiar z dziś: {{functions.averageMeasurement.procentValue + '%'}} ({{functions.averageMeasurement.value + ' &#181/m'}}<sup>3</sup>) - {{functions.averageMeasurement.pollutionLevel}}</strong><br>
                      <strong>ostatni pomiar: {{functions.lastMeasurement.procentValue + '%'}} ({{functions.lastMeasurement.value + ' &#181/m'}}<sup>3</sup>) - {{functions.lastMeasurement.pollutionLevel}}</strong>

                    </v-card-text>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-card>
    </div>
  </transition>
</v-dialog>
</template>

<script>
import BarChart from '@/components/vue-chartjs/BarChart'
import LineChart from '@/components/vue-chartjs/LineChart'
import Functions from '@/libs/helperFunctions'

export default {
  data () {
    return {
      alignment: 0,
      chartSwitch: true,
      functions: new Functions()
    }
  },
  name: 'ChartDialog',
  components: { BarChart, LineChart },
  props: {
    visibility: Boolean,
    mobileData: Object
  },
  methods: {
    closeDialog () {
      this.$emit('updateVisibility', false)
    }
  }
}
</script>

<style scoped>

</style>
