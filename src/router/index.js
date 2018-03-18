import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Table from '@/components/Table'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Table',
      name: 'Table',
      component: Table
    },
    {
      path: '/List',
      name: 'List',
      component: List
    }
  ]
})
