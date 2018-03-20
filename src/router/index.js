import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/components/SignUp'
import Confirm from '@/components/Confirm'
import SignIn from '@/components/SignIn'
import List from '@/components/List'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/SignUp',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/Confirm',
      name: 'Confirm',
      component: Confirm
    },
    {
      path: '/SignIn',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/List',
      name: 'List',
      component: List
    }
  ]
})
