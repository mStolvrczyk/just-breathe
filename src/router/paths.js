import DashboardView from '@/views/Dashboard'
import MapView from '@/views/Map'

export default [
  {
    path: '/dashboard',
    component: DashboardView,
    name: 'Dashboard'
  },
  {
    path: '/map',
    component: MapView,
    name: 'Map'
  }
]
