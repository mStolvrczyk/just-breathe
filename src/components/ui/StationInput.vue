<template>
  <transition name="popup">
      <v-autocomplete
        background-color="white"
        v-model="selectedStation"
        :items="stations"
        flat
        search="searchValue"
        hide-no-data
        clearable
        item-value="id"
        item-text="stationName"
        label="Wybierz stację"
        solo
        return-object
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              Brak stacji
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-autocomplete>
  </transition>
</template>

<script>
export default {
  name: 'StationInput',
  data () {
    return {
      selectedStation: null,
      searchValue: ''
    }
  },
  props: {
    stations: Array
  },
  watch: {
    'selectedStation' (value) {
      this.$emit('setSelectedStation', value)
      this.selectedStation = null
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
  /*@media only screen and (max-width: 767px) {*/
  /*  #station_input {*/
  /*    position: relative;*/
  /*    text-align: center;*/
  /*  }*/
  /*}*/
  /*@media only screen and (min-width: 768px) {*/
  /*  #station_input {*/
  /*    margin: 0;*/
  /*    padding: 0;*/
  /*    position: relative;*/
  /*    text-align: center;*/
  /*  }*/
  /*}*/
</style>
