<template>
  <transition name="popup">
    <div id="station_card" v-if="stationDetails != null">
      <v-card color="teal lighten-1" class="pa-1">
        <v-card-text align="center" class="white--text">
          <strong>{{stationDetails.stationName}}</strong><br>
          {{stationDetails.city}}<br>
          <strong>{{'odległość: '+stationDetails.stationDistance}}</strong>
        </v-card-text>
      </v-card>
      <div id="close_button">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn id="v-btn_close" v-on="on" @click="closeStationCard" text fab x-small color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Zamknij okno</span>
        </v-tooltip>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'StationCard',
  props: {
    stationDetails: Object
  },
  methods: {
    closeStationCard () {
      this.$emit('closeStationCard', null)
    }
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
    #station_card {
      position: absolute;
      bottom: 55%;
      left: 20%;
      width: 60%;
    }
    #close_button {
      visibility: hidden;
      top: 1%;
      right: 1%;
      position: absolute;
    }
  }
  @media only screen and (min-width: 768px) {
    #station_card {
      position: absolute;
      bottom: 65%;
      left: 40px;
      width: 220px;
    }
    #close_button {
      top: 1%;
      right: 1%;
      position: absolute;
    }
    #v-btn_close {
      width: 30px;
      height: 30px;
    }
  }
</style>
