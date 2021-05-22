import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { SharedModule } from '@/common/services'
import { win } from '@/common/base'
const { name } = require('../../../package.json')
const { microAppSetting } = require('../../../../package.json')
const currentSetting = microAppSetting[process.env.NODE_ENV].filter(item => item.name === name)[0]
const mainSub = currentSetting.activeRule.split('#')
const sub = mainSub[1]
declare const window: win

export const guard = (to:RouteLocationNormalized, from:RouteLocationNormalized, next:NavigationGuardNext) => {
  const userInfo = SharedModule.getShared().getUserInfo()
  const token = userInfo.token
  if (to.path === sub + '/login') {
    if (token) {
      next({
        name: 'home'
      })
    } else {
      next()
    }
  } else {
    if (token) {
      next()
    } else {
      if (window.__POWERED_BY_QIANKUN__) {
        next('/login')
      } else {
        next(sub + '/login')
      }
    }
  }
  next()
}
