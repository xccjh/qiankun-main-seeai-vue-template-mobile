import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { MicroApp } from 'qiankun/es/interfaces'
import { app } from '@/main'
import { serialPromises2 } from '@/common/utils'

export const guard = (to:RouteLocationNormalized, from:RouteLocationNormalized, next:NavigationGuardNext) => {
  // 路由跳转卸载局部微应用
  const micro: { [index: string]: MicroApp } = app.config.globalProperties.micro
  const microArr: Promise<null>[] = []
  const keys: string[] = Object.keys(micro)
  if (keys.length) {
    keys.forEach(key => {
      const microItem: MicroApp = micro[key]
      if (microItem && microItem.unmount) {
        microArr.push(microItem.unmount())
      }
    })
    serialPromises2(microArr, () => {
      keys.forEach(childItem => {
        const child = document.getElementById(childItem)
        if (child) {
          document.body.removeChild(child)
        }
        delete app.config.globalProperties.micro[childItem]
      })
      next()
    })
  } else {
    next()
  }
}
