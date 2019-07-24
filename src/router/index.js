// Lib imports
import Vue from 'vue'
import Router from 'vue-router'
// import VueAnalytics from 'vue-analytics'
// import Meta from 'vue-meta'

// Routes

import paths from './paths'

Vue.use(Router)

const router = new Router({
  routes: paths
})

export default router
