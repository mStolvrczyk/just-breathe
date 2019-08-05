// import axios from 'axios'

const state = {
  todos: [
    {
      id: 1,
      title: 'Todo one'
    },
    {
      id: 2,
      title: 'Todo two'
    }
  ]
}

const mutations = {}
const actions = {}

const getters = {
  allTodos: state => state.todos
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
