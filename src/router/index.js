// Lib imports
import Vue from 'vue'
import Router from 'vue-router'
// import VueAnalytics from 'vue-analytics'
// import Meta from 'vue-meta'

// Routes
import paths from './paths'

function route (path, view, name) {
  return {
    name: name || view,
    path,
    component: (resovle) => import(
      `@/views/${view}.vue`
    ).then(resovle)
  }
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: paths.map(path => route(path.path, path.view, path.name)).concat([
    { path: '*', redirect: '/dashboard' }
  ])
})
