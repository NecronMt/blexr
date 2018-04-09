import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Reports from '@/components/Reports'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/reports',
      name: 'Reports',
      component: Reports
    }
  ]
})
