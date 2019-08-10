import { set, toggle } from '@/utils/vuex'

const state = {
  drawer: null,
  navbar: null,
  sidebarImage: require('@/assets/sidebarImage.jpg'),
  appImage: require('@/assets/appImage7.jpg'),
  sidebarBackgroundColor: 'rgba(0, 128, 128, 0.7)',
  appBackgroundColor: 'rgba(0, 128, 128, 0.6)'
  // sidebarBackgroundColor: 'rgba(27, 27, 27, 0.74)'
}

const mutations = {
  setDrawer: set('drawer'),
  setNavbar: set('navbar'),
  setSidebarImage: set('sidebarImage'),
  setAppImage: set('appImage'),
  toggleDrawer: toggle('drawer')
}

export default {
  namespaced: true,
  state,
  mutations
}
