import { set, toggle } from '@/utils/vuex'

const state = {
  drawer: null,
  image: require('@/assets/sidebarImage.jpg'),
  sidebarBackgroundColor: 'rgba(0, 128, 128, 0.7)'
  // sidebarBackgroundColor: 'rgba(27, 27, 27, 0.74)'
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
