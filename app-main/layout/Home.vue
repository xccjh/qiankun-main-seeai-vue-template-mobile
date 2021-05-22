<template>
  <div class="home">
    <h1>This is an app-main home page</h1>
    <h1>Welcome To Use SEEAI Template</h1>
    <div>
      <img
        :src="imgUrl"
        alt=""
      >
    </div>
    <br>
    <van-button
      style="margin-bottom:20px;"
      @click="loadSubPart($event)"
    >
      load app-sub part
    </van-button>
    <br>
    <van-button
      style="margin-bottom:20px;"
      @click="loadOtherSubPart($event)"
    >
      load app-other-sub part
    </van-button>
    <br>
    <van-button @click="unMountPart($event)">
      unmout app-sub&app-other-sub part
    </van-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, getCurrentInstance } from 'vue'
import { loadMicroApp } from 'qiankun'
const { microAppSetting } = require('../../package.json')
const microApp1Config = microAppSetting[process.env.NODE_ENV][0]
const microApp2Config = microAppSetting[process.env.NODE_ENV][1]

export default defineComponent({
  name: 'Home',
  setup () {
    const instance = getCurrentInstance()

    const unMountPart = () => {
      if (instance) {
        const micro = instance.appContext.config.globalProperties.micro
        micro.microApp1 && micro.microApp1.unmount().then(() => {
          const child1 = document.getElementById('microApp1')
          if (child1) {
            document.body.removeChild(child1)
          }
        })
        micro.microApp2 && micro.microApp2.unmount().then(() => {
          const child2 = document.getElementById('microApp2')
          if (child2) {
            document.body.removeChild(child2)
          }
        })
      }
    }
    const loadOtherSubPart = (e) => {
      if (instance) {
        const micro = instance.appContext.config.globalProperties.micro
        const divDom2 = document.createElement('div')
        divDom2.id = 'microApp2'
        divDom2.style.width = '80%'
        divDom2.style.height = '40%'
        divDom2.style.position = 'fixed'
        divDom2.style.zIndex = '99999'
        divDom2.style.overflow = 'auto'
        divDom2.style.left = '50%'
        divDom2.style.top = '30%'
        divDom2.style.backgroundColor = 'white'
        divDom2.style.transform = 'translate(-50%,-50%)'
        divDom2.style.boxShadow = '0 0 10px grey'
        document.body.appendChild(divDom2)
        micro.microApp2 = loadMicroApp({
          name: microApp2Config.name,
          entry: `${microApp2Config.host}:${microApp2Config.port}/${microApp2Config.name}/#/${microApp2Config.name}/home`,
          container: '#microApp2',
          props: {
            name: microApp2Config.name
          }
        }, {
          singular: false
        })
      }
    }
    const loadSubPart = (e) => {
      if (instance) {
        const micro = instance.appContext.config.globalProperties.micro
        const divDom1 = document.createElement('microApp1')
        divDom1.id = 'microApp1'
        divDom1.style.width = '80%'
        divDom1.style.height = '40%'
        divDom1.style.position = 'fixed'
        divDom1.style.zIndex = '99999'
        divDom1.style.overflow = 'auto'
        divDom1.style.left = '50%'
        divDom1.style.top = '30%'
        divDom1.style.backgroundColor = 'white'
        divDom1.style.transform = 'translate(-50%,-50%)'
        divDom1.style.boxShadow = '0 0 10px grey'
        document.body.appendChild(divDom1)
        // store.commit('setContainer', '#child')
        // document.querySelector('#app').style.display = 'none'
        // router.push({
        //   path: '/app-sub',
        //   query: {
        //     id: 0
        //   }
        // })
        // e.stopPropagation()
        // e.preventDefault()
        // loadSubApp () {
        // },
        // unLoadApp () {
        //   if (microApp) {
        //     microApp.unmount()
        //   }
        // }
        micro.microApp1 = loadMicroApp({
          name: microApp1Config.name,
          entry: `${microApp1Config.host}:${microApp1Config.port}/${microApp1Config.name}/#/${microApp1Config.name}/home`,
          container: '#microApp1',
          props: {
            name: microApp1Config.name
          }
        }, {
          singular: false
        })
      }
    }

    return {
      loadSubPart,
      loadOtherSubPart,
      unMountPart,
      imgUrl: require('@images/logo.png')
    }
  }
})
</script>
