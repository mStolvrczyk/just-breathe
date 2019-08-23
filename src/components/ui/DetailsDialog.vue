<template>
    <v-dialog
            v-model="visibility"
            width="600"
            persistent
    >
        <v-card>
            <v-card-text>
                COSTUJEST, JAKIES DANE, OPCJE
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
export default {
  name: 'DetailsDialog',
  props: {
    visibility: Boolean
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
