<template>
  <v-row justify="center">
    <v-dialog
      persistent
      v-model="userPanelVisibility"
      max-width="500px"
    >
      <v-card
        class="pa-3"
        color="teal lighten-4"
      >
        <v-card>
          <v-card-text align="center" class="teal--text font-weight-bold" style="font-size: 17px">
            W TRAKCIE REALIZACJI
          </v-card-text>
        </v-card>
        <div align="center" class="my-2">
          <v-btn rounded @click="closeUserPanel" color="teal" class="white--text font-weight-bold">
            Wróć
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'UserPanel',
  props: {
    userPanelVisibility: Boolean
  },
  methods: {
    closeUserPanel () {
      this.$emit('closeUserPanel', false)
    }
  }
}
</script>

<style scoped>

</style>
