import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Summary from '../views/Summary.vue'
import Transactions from '../views/Transactions.vue'
import Graph from '../views/Graph.vue'

Vue.use(Router)

class RouteMeta {
  title: string

  constructor ({ title }: { title: string }) {
    this.title = title
  }
}

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'summary',
      component: Summary,
      meta: new RouteMeta({ title: 'Summary' })
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: Transactions,
      meta: new RouteMeta({ title: 'Transactions' })
    },
    {
      path: '/graph',
      name: 'graph',
      component: Graph,
      meta: new RouteMeta({ title: 'Graph' })
    }
  ]
})

// This callback runs before every route change, including on initial load
router.beforeEach((to, from, next) => {
  const routeMeta = to.meta as RouteMeta
  store.dispatch('topToolbar/changeTitle', routeMeta.title)
  next()
})

export default router
