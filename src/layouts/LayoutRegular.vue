<template>
    <div>
        <Navbar></Navbar>
        <Sidebar></Sidebar>
        <v-content>
            <v-container fluid class="pa-0">
                <router-view></router-view>
            </v-container>
        </v-content>
    </div>
</template>

<script>
import Navbar from '@/components//ui/NavbarRegular'
import Sidebar from '@/components/ui/Sidebar'

export default {
  name: 'LayoutRegular',
  components: { Sidebar, Navbar }
}
</script>

<style scoped>

</style>
