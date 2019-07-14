// import LoginView from './components/Login.vue'
import DashView from './components/Dash.vue'
import DashboardView from './components/views/Dashboard'

const routes = [
  // {
  //   path: '/login',
  //   component: LoginView
  // },
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
export default routes
