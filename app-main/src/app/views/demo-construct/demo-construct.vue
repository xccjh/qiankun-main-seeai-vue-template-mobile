<template>
  <div class="demo-construct">
    <van-icon name="contact" size='30'/>
    <van-icon name="eye-o" size='30'/>
    <van-icon name="share-o" size='30'/>
    <van-icon name="shopping-cart-o" size='30'/>
    <svg-icon icon='account-book' style='width: 30px;height: 30px;'></svg-icon>
    <svg-icon icon='aim' style='width: 30px;height: 30px;'></svg-icon>
    <van-divider/>
    <h1 class='p'>This is an demo-construct page --- {{myCountComputed}}(computed)</h1>
    <h1>This is an global store data change --- {{storeCount}}</h1>
    <h1>This is an local store data change --- {{localCount}} --- {{localMapCount}}(nameScoped mapState)</h1>
    <van-button @click='incrementGlobal()'>add global storeCount</van-button>
    <van-button @click='incrementLocal()'>add local storeCount</van-button>
    <van-button @click="changeTheme()">更换主题</van-button>
    <van-button @click='toLogin()'>go-to-login</van-button>
    <demo-children @change-count='changeMyCount' :my-count='myCount'></demo-children>
    <pre style='width:100%;overflow:auto;margin:50px 0'>
      {{envVar}}
    </pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref, computed, watch, watchEffect, reactive } from 'vue'
import { RouteLocationNormalized, Router, useRoute, useRouter } from 'vue-router'
import { useStore, createNamespacedHelpers } from 'vuex'
import { DemoChildren } from './components'
import { win } from '@/common/base'
import { ToolsUtil } from '@/common/utils'
declare const window:win

const { mapState } = createNamespacedHelpers('DemoConstructStore')

export default defineComponent({
  name: 'demo-construct',
  components: {
    DemoChildren
  },
  setup () {
    const instance = getCurrentInstance()
    if (instance) {
      console.log('全局属性:', instance.appContext.config.globalProperties)
    }
    const router: Router = useRouter()
    const route: RouteLocationNormalized = useRoute()
    const store = useStore()
    onMounted(() => {
      console.log('this:', instance)
      console.log('route.path:', route.path)
      console.log('route.fullPath:', route.fullPath)
      console.log('route.meta:', route.meta)
      console.log('route.params:', route.params)
      console.log('route.query:', route.query)
    })
    // 注意抽离hook
    const myCount = ref(2)
    const count = ref(0)
    const numbers = reactive([1, 2, 3, 4])
    const state = reactive({
      id: 1,
      attributes: {
        name: ''
      }
    })
    const changeMyCount = () => {
      myCount.value = myCount.value + 2
    }
    const toLogin = () => {
      router.push({
        name: 'login'
      })
    }
    const myCountComputed = computed(() => myCount.value * 2)
    const stop = watchEffect(async onInvalidate => {
      // // 异步api调用，返回一个操作对象
      // const apiCall = setInterval(() => {
      //   myCount.value = myCount.value + 2
      // }, 2000)
      // onInvalidate(() => {
      //   // 取消异步api的调用。
      //   clearInterval(apiCall)
      // })
    }, {
      flush: 'post'
    })
    setTimeout(() => {
      stop()
    }, 10000)
    // 直接侦听ref
    watch(count, (count, prevCount) => {
      console.log(count, prevCount)
    })
    // 侦听响应式对象,数组和对象是引用类型，如果没有副本 old 和 new 会是同一个值
    watch(
      () => [...numbers],
      (numbers, prevNumbers) => {
        console.log('侦听响应式对象', numbers, prevNumbers)
      })

    numbers.push(5) // logs: [1,2,3,4,5] [1,2,3,4]
    // 深度嵌套对象监听
    watch(
      () => state,
      (state, prevState) => {
        console.log(
          state.attributes.name,
          prevState.attributes.name
        )
      }, { deep: true }
    )
    // 侦听多个数据源
    watch([count, myCount], (newValues, prevValues) => {
      console.log('watch:', newValues, prevValues)
    })
    console.log('computed:', myCountComputed.value)
    return {
      envVar: process.env,
      toLogin,
      myCount,
      myCountComputed,
      changeMyCount,
      storeCount: computed(() => {
        if (store) {
          return store.state.storeCount
        } else {
          return undefined
        }
      }),
      localCount: computed(() => {
        if (store) {
          return store.state.DemoConstructStore.localCount
        } else {
          return undefined
        }
      }),
      changeTheme () {
        window.$theme.style = ToolsUtil.themeMap.zksd.themeLabel
      },
      incrementGlobal: () => store.commit('increment'),
      incrementLocal: () => store.commit('DemoConstructStore/demoConstructIncrement')
    }
  },
  computed: {
    ...mapState<{ localCount }>({
      localMapCount: (state) => {
        return state.localCount
      }
    })
  }
})
</script>
<style lang='less' scoped>
  .demo-construct {
    width: 100%;
  }
</style>
<style lang="less" scoped theme='educational'>
  .p {
    font-size:60px!important;
  }
</style>
