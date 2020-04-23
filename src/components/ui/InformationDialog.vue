<template>
  <v-dialog
    persistent
    v-model="informationDialogVisibility"
    :max-width="informationDialogWidth"
  >
    <div id="information-dialog-card">
      <h3 class="information-info">{{information}}</h3>
      <div class="row chart button">
        <v-btn @click="closeInformationDialog" class="teal--text font-weight-bold" rounded color="#EEEEEE" dark>{{ buttonText }}</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
    export default {
      name: 'InformationDialog',
      props: {
        informationDialogVisibility: Boolean,
        information: String
      },
      methods: {
        closeInformationDialog () {
          this.$emit('closeInformationDialog', { informationDialogVisibility: false, informationDialogText: null })
          if (this.information === 'Dostępna jest nowa wersja aplikacji') {
            window.location.reload(true)
          }
        }
      },
      computed: {
        buttonText () {
          if (this.information === 'Dostępna jest nowa wersja aplikacji') {
            return 'Pobierz'
          } else {
            return 'OK'
          }
        },
        informationDialogWidth () {
          if (this.$vuetify.breakpoint.xsOnly) {
            return 60 + '%'
          } else {
            return 30 + '%'
          }
        }
      }
    }
</script>

<style scoped>

</style>
