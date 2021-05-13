import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw
} from 'vue-router'
import { DemoConstructRoute } from '../views/demo-construct'
import { guard } from './guard'

const { microAppSetting } = require('../../../../package.json')
const currentSetting = microAppSetting[process.env.NODE_ENV][0]
const appMainBase = currentSetting.activeRule.split('/#/')[0]
const appMainName = appMainBase.split('/')[1]
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    redirect: `${appMainBase}/home`,
    meta: {
      name: '入口'
    }
  },
  {
    path: appMainBase,
    component: () => import(/* webpackChunkName: "micro-app-main" */ '/layout/AppMainIndex.vue'),
    name: appMainName,
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
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '/layout/Login.vue'),
    name: 'login',
    meta: {
      name: '登录'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => guard(to, from, next))

export default router
