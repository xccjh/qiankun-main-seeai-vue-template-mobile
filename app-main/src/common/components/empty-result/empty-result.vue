<template>
  <div class="empty-container">
    <div class="empty-image-container">
      <div class="empty-image"/>
      <div class="tips" v-if='tips'>{{ tips }}</div>
      <div class="sub-tips"  v-if='subTips'>{{ subTips }}</div>
      <div class="action-container" v-if="goUrl !== ''">
        <van-button @click='goToUrl()' type='primary'>去发现</van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'empty-result',
  props: {
    tips: {
      type: String as PropType<string>,
      default: ''
    },
    subTips: {
      type: String as PropType<string>,
      default: ''
    },
    goUrl: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup (props) {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    return {
      goToUrl () {
        router.push({
          path: props.goUrl
        })
      }
    }
  }
})
</script>
<style scoped lang='scss'>
  .empty-container {
    position: relative;
    padding: 15% 0;
    height:100%;

    .empty-image-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      height:100%;

      .empty-image {
        width: 100%;
        height: 60%;
        background-image: url('../../../assets/images/empty-result.png');
        @include bg;
      }

      .tips {
        font-size: 36px;
        color: #3C3D41;
        margin-top: 20px;
      }

      .sub-tips {
        margin: 40px 50px;
        font-size: 46px;
        color: #6C7179;
      }
      .action-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

  }

</style>
