import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw
} from 'vue-router'
import { DemoConstructRoute } from '../views/demo-construct'
import { guard } from './guard'
const { name } = require('../../../package.json')
const { microAppSetting } = require('../../../../package.json')
const currentSetting = microAppSetting[process.env.NODE_ENV].filter(item => item.name === name)[0]
const mainSub = currentSetting.activeRule.split('#')
const main = mainSub[0]
const sub = mainSub[1]
const LocalRoute = {
  path: sub,
  name: 'base-construct',
  meta: { name: 'base-construct' },
  component: () => import(/* webpackChunkName: "base-construct" */ '/layout/BaseConstruct.vue'),
  children: [
    {
      path: '',
      name: 'app-sub-index',
      component: () => import(/* webpackChunkName: "app-sub-index" */ '/layout/AppSubIndex.vue'),
      meta: {
        name: '主页'
      },
      children: [
        {
          path: 'home',
          component: () => import(/* webpackChunkName: "home" */ '/layout/Home.vue'),
          name: 'home',
          meta: {
            name: '首页'
          }
        },
        DemoConstructRoute('demo-construct/:id')
      ]
    },
    {
      path: 'login',
      component: () => import(/* webpackChunkName: "login" */ '/layout/Login.vue'),
      name: 'login',
      meta: {
        name: '登录页'
      }
    }
  ]
}
const mainRoute = {
  path: main,
  name: 'micro-base-construct',
  meta: { name: 'base-construct' },
  component: () => import(/* webpackChunkName: "base-construct" */ '/layout/BaseConstruct.vue'),
  children: [
    {
      path: '',
      name: 'micro-app-main-index',
      component: () => import(/* webpackChunkName: "app-sub-index" */ '/layout/AppSubIndex.vue'),
      meta: {
        name: '主页'
      },
      children: [
        {
          path: 'home',
          component: () => import(/* webpackChunkName: "home" */ '/layout/Home.vue'),
          name: 'micro-home',
          meta: {
            name: '首页'
          }
        },
        DemoConstructRoute('demo-construct/:id', 'micro-demo-construct')
      ]
    },
    {
      path: 'login',
      component: () => import(/* webpackChunkName: "login" */ '/layout/Login.vue'),
      name: 'micro-login',
      meta: {
        name: '登录页'
      }
    }
  ]
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    redirect: sub,
    meta: {
      name: '入口'
    }
  },
  LocalRoute,
  mainRoute
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to:RouteLocationNormalized, from:RouteLocationNormalized, next:NavigationGuardNext) => guard(to, from, next))

export default router