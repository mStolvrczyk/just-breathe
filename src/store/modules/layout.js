import { set, toggle } from '@/utils/vuex'

const state = {
  drawer: null,
  image: 'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg',
  sidebarBackgroundColor: 'rgba(0, 128, 128, 0.4)'
}

const mutations = {
  setDrawer: set('drawer'),
  setImage: set('image'),
  toggleDrawer: toggle('drawer')
}

export default {
  namespaced: true,
  state,
  mutations
}
