import DashView from '@/components/Dash.vue'
import DashboardView from '@/components/views/Dashboard'

export default [
  {
    path: '/',
    component: DashView,
    children: [
      {
        path: 'dashboard',
        alias: '',
        component: DashboardView,
        name: 'Dashboard',
        meta: { description: 'Overview of enviroment' }
      }
    ]
  }
]
