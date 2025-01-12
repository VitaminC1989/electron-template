<template>
  <div>
    <h1>Demo</h1>

    <button @click="handleRun">运行</button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(123)
})

const handleRun = () => {
  // @ts-ignore
  window.model.startRealTimeSpeechRecognition()
  // @ts-ignore
  // window.model.decodeAudioFile()
}
</script>

<style lang="less" scoped></style>
