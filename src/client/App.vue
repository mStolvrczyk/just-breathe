<template>
  <v-app>
    <div class="navbar">
      <v-app-bar
              flat
              persistent
              dark
              app
              fixed
              :scroll-threshold="1"
              :scroll-off-screen="true"
              :src="require('@/assets/appImage.jpg')"
      >
        <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
          ></v-img>
        </template>
        <div class="v-toolbar-title">
              <v-toolbar-title>
                  Air Quality Check
              </v-toolbar-title>
          </div>
          <v-spacer/>
          <v-btn icon>
              <v-icon>
                  notifications
              </v-icon>
          </v-btn>
          <v-btn icon>
              <v-icon>
                  person
              </v-icon>
          </v-btn>
      </v-app-bar>
    </div>
    <v-content>
      <router-view/>
    </v-content>
<!--    <DetailsDialog :visibility.sync="visibility"-->
<!--                   v-on:updateVisibility="updateDetailsDialogVisibility"></DetailsDialog>-->
  </v-app>
</template>

<script>

// import DetailsDialog from '@/components/ui/DetailsDialog'

export default {
  // components: { DetailsDialog },
  data: () => ({
    // visibility: false
  }),
  methods: {
    // updateDetailsDialogVisibility (value) {
    //   this.visibility = value
    // }
  }
}
</script>

<style>
    #app {
      background-image:
        linear-gradient(to bottom, rgba(30, 230, 176, 0.5), rgba(30, 230, 176, 0.5))

    }
</style>
