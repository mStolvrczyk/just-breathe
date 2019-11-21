<template>
  <v-row justify="center">
    <v-dialog persistent v-model="mobileDialogVisibility" max-width="1000px">
      <div
        id="chart_card">
        <v-card
          class="pa-3"
          color="teal lighten-4"
        >
          <div align="center">
            <v-card
              id="charts"
              color="white"
            >
              <v-card-text
                align="center"
                v-if="barDataCollection === null"
              >
                <strong>
                  Brak pomiarów
                </strong>
              </v-card-text>
              <div v-else>
                  <bar-chart
                    v-if="chartSwitch"
                    :chart-data="barDataCollection"
                    :height="290"
                  />
                  <line-chart
                    v-else
                    :chart-data="lineDataCollection"
                    :height="310"
                  />
              </div>
            </v-card>
            <div class="text-center pa-2" v-if="barDataCollection != null">
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
                    <v-btn color="white" v-on="on">
                      <v-icon style="font-size:23px;color: teal">mdi-compare</v-icon>
                    </v-btn>
                  </template>
                  <span>Porównaj z wczoraj</span>
                </v-tooltip>
              </v-btn-toggle>
            </div>
            <v-container fluid class="pa-0" v-if="barDataCollection != null">
              <v-row align="center">
                <v-col cols="12" sm="12">
                  <div class="text-center">
                    <v-card
                      color="teal lighten-1"
                    >
                      <v-card-text class="white--text">
                        <strong>uśredniony pomiar z dziś:<br> {{sensorDetails.averageMeasurement.procentValue + '%'}}
                          ({{sensorDetails.averageMeasurement.value + ' &#181/m'}}<sup>3</sup>) -
                          {{sensorDetails.averageMeasurement.pollutionLevel}}</strong><br>
                        <strong>ostatni pomiar:<br> {{sensorDetails.lastMeasurement.procentValue + '%'}}
                          ({{sensorDetails.lastMeasurement.value + ' &#181/m'}}<sup>3</sup>) -
                          {{sensorDetails.lastMeasurement.pollutionLevel}}</strong>

                      </v-card-text>
                    </v-card>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
          <div class="text-center">
            <v-btn @click="closeDialog" class="teal--text" small rounded color="white" dark>Return</v-btn>
          </div>
        </v-card>
      </div>
    </v-dialog>
  </v-row>
</template>

<script>
import BarChart from '@/components/vue-chartjs/BarChart'
import LineChart from '@/components/vue-chartjs/LineChart'
export default {
  name: 'MobileChartDialog',
  components: {
    BarChart, LineChart
  },
  data () {
    return {
      chartSwitch: true,
      alignment: 0
    }
  },
  props: {
    mobileDialogVisibility: Boolean,
    sensorDetails: Object,
    barDataCollection: Object,
    lineDataCollection: Object
  },
  methods: {
    closeDialog () {
      this.$emit('closeMobileDialog', false)
    }
  }
}
</script>

<style>
#charts {
  width: 720px;
  overflow-x: scroll;
}
</style>
