import DashView from '@/components/Dash.vue'
import DashboardView from '@/components/views/Dashboard'
import MapView from '@/components/views/Map'

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
        view: 'Dashboard',
        meta: { description: 'Overview of enviroment' }
      },
      {
        path: 'map',
        component: MapView,
        name: 'Dashboard',
        view: 'Dashboard',
        meta: { description: 'Overview of enviroment' }
      }
    ]
  }
]
