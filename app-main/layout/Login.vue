<template>
  <div class='container'>
    <div class='form-box'>
      <van-form @submit="onSubmit">
        <van-field
          v-model="state.userName"
          left-icon="manager"
          name="userName"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          left-icon="lock"
          v-model="state.password"
          type="password"
          name="password"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div class="button-container">
          <van-button type="danger" native-type="submit" class='button-login' :loading='loading' loading-text="登录中...">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRaw, reactive, ref } from 'vue'
import { LocalStorageUtil, SessionStorageUtil, ToolsUtil } from '@/common/utils'
import { FormState, win } from '@/common/base'
import { auth } from '@/app/api'
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'

declare const window: win
export default defineComponent({
  name: 'login',
  setup () {
    const loading = ref(false)
    const router: Router = useRouter()
    const route:RouteLocationNormalizedLoaded = useRoute()
    const store = useStore()
    const state = reactive({
      userName: '',
      password: ''
    })
    const onSubmit = (values) => {
      loading.value = true
      LocalStorageUtil.clearAll()
      SessionStorageUtil.clear()
      const params = {
        userName: values.userName,
        password: values.password,
        orgCode: ToolsUtil.getOrgCode(),
        platformId: window.__platform__
      }
      auth.login(params).then((result) => {
        loading.value = false
        const res = result.data
        if (res.status === 200) {
          if (res.data.user && res.data.user.telphone) {
            res.data.user.password = values.password
            store.commit('setUserInfo', res.data.user)
            Toast.success('登录成功')
            router.push({
              name: 'home',
              query: route.query
            })
          } else {
            Toast.fail('未登录或登录已过期，请重新登录。')
          }
        }
      }).catch(() => {
        loading.value = false
      })
    }
    return {
      state,
      onSubmit,
      loading
    }
  }
})
</script>
<style lang='scss' scoped>
  .container {
    width: 100%;
    height: 100%;
    position: absolute;
    background-image: url(https://seeai.hqjy.com/h5/login-bg.849fb84828b605250940.png);
    @include bg;

    .form-box {
      width: calc(100% - 70px);
      box-sizing: border-box;
      position: absolute;
      margin: 0 35px;
      top: 620px;
      background-color: #fff;
      border-radius: 10px;
      overflow: hidden;
      padding: 20px;

      ::v-deep .van-icon {
        font-size: 50px !important;
      }

      .button-container {
        margin: 16px;

        .button-login {
          width: 320px;
          border-radius: 10px;
          font-size: 30px;
          height: 80px;
          line-height: 80px;
          border: 1px solid #d82727;
          background-color: #ab2025;
        }
      }
    }
  }
</style>
