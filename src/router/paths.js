import DashboardView from '@/views/Dashboard'
import MapView from '@/views/Map'

export default [
  {
    path: '/dashboard',
    alias: '',
    component: DashboardView,
    name: 'Dashboard',
    view: 'Dashboard',
    meta: { description: 'Overview of enviroment' }
  },
  {
    path: '/map',
    component: MapView,
    name: 'Map',
    view: 'Map',
    meta: { description: 'Map with locations of measuring stations' }
  }
]
