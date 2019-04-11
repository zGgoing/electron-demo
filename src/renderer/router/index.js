import Vue from 'vue'
import Router from 'vue-router'
import { Compare, Login } from '../components'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/compare',
      name: 'compare',
      component: Compare
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
