<template>
  <div class="demo-children">
    <h1>This is an demo-children page --- {{myCount}}(父子传值)</h1>
    <van-button @click='emitMsg()'>Add</van-button>
    <van-button>Default</van-button>
    <van-button type="primary">Primary</van-button>
    <van-button type="dashed">Dashed</van-button>
    <van-button type="danger">Danger</van-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'demo-children',
  props: {
    myCount: {
      type: Number as PropType<number>,
      default: 0,
      required: true
    }
  },
  emits: {
    changeCount: (payload) => {
      // validate payload by returning a boolean
      return true
    }
  },
  setup (props, { attrs, emit }) {
    const emitMsg = () => {
      emit('changeCount', '+')
    }
    return {
      emitMsg
    }
  }
})
</script>
