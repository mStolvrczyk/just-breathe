<template>
    <v-app class="primary-background">
        <v-toolbar
                color='rgba(0, 0, 0, 0.3)'
                flat
                dark
                dense
                app
                fixed
        >
            <div class="v-toolbar-title">
                <v-toolbar-title>
                    Air Quality Check
                </v-toolbar-title>
            </div>
            <v-spacer/>
            <v-btn icon>
                <v-icon>
                    apps
                </v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>
                    notifications
                </v-icon>
            </v-btn>
            <v-btn @click="updateDetailsDialogVisibility(true)"
                   icon>
                <v-icon>
                    person
                </v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-container fluid class="pa-0">
                <v-img
                        :src="appImage"
                        :gradient="`${'rgba(0, 128, 128, 0.6)'}, ${'rgba(0, 128, 128, 0.6)'}`"
                >
                    <router-view></router-view>
                </v-img>
            </v-container>
        </v-content>
        <DetailsDialog :visibility.sync="detailsDialogVisible"
                       v-on:updateVisibility="updateDetailsDialogVisibility"></DetailsDialog>
    </v-app>
</template>

<script>

import DetailsDialog from '@/components/ui/DetailsDialog'

export default {
  components: { DetailsDialog },
  data: () => ({
    appImage: require('@/assets/appImage.jpg'),
    detailsDialogVisible: false
  }),
  methods: {
    updateDetailsDialogVisibility (value) {
      this.detailsDialogVisible = value
    }
  }
}
</script>

<style lang="stylus">
    .primary-background {
        background-color: #ECEFF1
    }
</style>
