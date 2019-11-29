<template>
  <transition name="popup">
    <div id="sensor_panel" align="center" v-if="stationDetails != null">
      <v-container
        fluid class="pa-0"
        v-for="sensor in stationDetails.sensors"
        :key="sensor.id"
      >
        <v-row align="center" dense>
          <v-col cols="5">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-card v-on="on" rounded color="teal lighten-1" block class="white--text">
                  {{sensor.symbol}}
                </v-card>
              </template>
              <span>{{sensor.name}}</span>
            </v-tooltip>
          </v-col>
          <v-col cols="5">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-card v-on="on" class="white--text" :style="{ 'background-color': sensor.backgroundColor }">
                  <strong>{{sensor.pollutionLimit+'%'}}</strong>
                </v-card>
              </template>
              <span>{{sensor.lastValue+' &#181/m'}}<sup>3</sup></span>
            </v-tooltip>
          </v-col>
          <v-col cols="2">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" @click="fillDatacollection(sensor.id, apiResponse)" fab x-small color="teal lighten-1">
                  <v-icon style="font-size:18px;color: white">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <span>Pokaż szczegóły</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SensorPanel',
  props: {
    stationDetails: Object,
    apiResponse: Array
  }
}
</script>

<style>
  .popup-enter,
  .popup-leave-to{
    transform: rotateY(50deg);
  }
  .popup-enter-to,
  .popup-leave {
    transform: rotateY(0deg);
  }
  .popup-enter-active,
  .popup-leave-active {
    transition: transform 400ms;
  }
  @media only screen and (max-width: 767px) {
    #sensor_panel {
      position: absolute;
      height: 38%;
      top: 56%;
      left: 20%;
      width: 60%;
      overflow: scroll;
    }
  }
  @media only screen and (min-width: 768px) {
    #sensor_panel {
      position: absolute;
      top: 38%;
      left: 40px;
      width: 220px;
    }
  }
</style>
