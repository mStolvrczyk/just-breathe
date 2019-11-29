<template>
  <transition name="popup">
    <div id="station_input" v-if="autocompleteInput">
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
          <v-list-tile>
            <v-list-tile-title>
              Brak stacji
            </v-list-tile-title>
          </v-list-tile>
        </template>
      </v-autocomplete>
    </div>
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
    autocompleteInput: Boolean,
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
  @media only screen and (max-width: 767px) {
    #station_input {
      width: 90%;
      position: absolute;
      top: 5px;
      text-align: center;
      left: 20px;
    }
  }
  @media only screen and (min-width: 768px) {
    #station_input {
      width: 60%;
      position: absolute;
      top: 2%;
      right: 20%;
    }
  }
</style>
