<template>
  <div>
    <div>此页面无路由</div>
    <vant-button type="primary" @click='goHome()'>返回首页</vant-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router'
import { win } from '@/common/base'
declare const window: win
const { name } = require('../package.json')
const { microAppSetting } = require('../../package.json')
const currentSetting = microAppSetting[process.env.NODE_ENV].filter(item => item.name === name)[0]
const mainSub = currentSetting.activeRule.split('/#')
const main = mainSub[0]
export default defineComponent({
  name: 'not-found',
  setup () {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    return {
      goHome () {
        if (window.__POWERED_BY_QIANKUN__) {
          router.push({
            path: main + '/home',
            query: route.query
          })
        } else {
          router.push({
            name: 'home',
            query: route.query
          })
        }
      }
    }
  }
})
</script>
