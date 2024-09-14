<script setup lang="ts">
import { onMounted } from 'vue'
import Versions from './components/Versions.vue'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')

onMounted(() => {
  window.log.getLogFilePath().then((res) => {
    console.log('<<< 日志文件路径 >>>', res)
  })
})
</script>

<template>
  <div class="drag-area"></div>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
  </div>
  <Versions />
</template>

<style>
.drag-area {
  height: 30px;
  width: 100%;
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
