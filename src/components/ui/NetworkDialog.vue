<template>
  <v-dialog
    persistent
    v-model="networkDialogVisibility"
    :max-width="networkChartWidth"
  >
    <div id="network-dialog-card">
      <h3 class="network-info">Brak połączenia z internetem.</h3>
      <div class="row chart button">
        <v-btn @click="closeNetworkDialog" class="teal--text font-weight-bold" rounded color="#EEEEEE" dark>Wróć</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
    export default {
      name: 'NetworkDialog',
      props: {
        networkDialogVisibility: Boolean
      },
      methods: {
        closeNetworkDialog () {
          this.$emit('closeNetworkDialog', false)
        }
      },
      computed: {
        networkChartWidth () {
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
