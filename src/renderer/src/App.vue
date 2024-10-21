<template>
  <div class="app-container">
    <!-- 拖拽区域，用于窗口拖动 -->
    <div class="drag-area"></div>
    <!-- 应用 Logo -->
    <img alt="logo" class="logo" src="./assets/electron.svg" />
    <!-- 创建者信息 -->
    <div class="creator">Powered by electron-vite</div>
    <!-- 应用描述文本 -->
    <div class="text">
      Build an Electron app with
      <span class="vue">Vue</span>
      and
      <span class="ts">TypeScript</span>
    </div>
    <!-- 提示信息，指导用户打开开发者工具 -->
    <p class="tip">请尝试按 <code>F12</code> 打开开发者工具</p>

    <!-- 持久化存储 electron-store demo -->
    <div class="store">
      <ElectronStoreDemo></ElectronStoreDemo>
    </div>

    <div class="counter">
      <Counter></Counter>
    </div>

    <!-- 动作链接区域 -->
    <div class="actions">
      <div class="action">
        <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">文档</a>
      </div>
      <div class="action">
        <a href="#" @click.prevent="ipcHandle">发送 IPC</a>
      </div>
    </div>

    <!-- 新增的包装容器，用于居中 Versions 组件 -->
    <div class="versions-container">
      <Versions />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import Versions from './components/Versions.vue'
import Counter from './components/Counter.vue'
import ElectronStoreDemo from './components/ElectronStoreDemo.vue'

// 将 ipcHandle 函数改为异步函数
const ipcHandle = () => {
  window.electron.ipcRenderer.send('ping')
}

onMounted(async () => {
  try {
    const logFilePath = await window.log.getLogFilePath()
    console.log('<<< 日志文件路径 >>>', logFilePath)
  } catch (error) {
    console.error('获取日志文件路径时出错:', error)
  }
})
</script>

<style lang="less" scoped>
.app-container {
  padding-top: 40px; // 留出拖拽区域的空间
  text-align: center;
  font-family: Arial, sans-serif;

  .drag-area {
    height: 30px;
    width: 100%;
    -webkit-app-region: drag; // 使该区域可拖动窗口
    position: fixed;
    top: 0;
    left: 0;
    background-color: #f0f0f0; // 添加背景色以区分拖拽区域
  }

  .logo {
    width: 100px;
    margin: 20px auto;
    display: block;
  }

  .creator {
    margin-bottom: 10px;
    color: #555;
  }

  .text {
    margin-bottom: 20px;
    font-size: 1.1em;

    .vue {
      color: #42b883; // Vue 文字颜色
    }

    .ts {
      color: #007acc; // TypeScript 文字颜色
    }
  }

  .tip {
    color: #888;
    margin-bottom: 20px;
  }

  .counter {
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: inline-block;

    p {
      font-size: 1.2em;
      margin-bottom: 10px;
    }

    button {
      padding: 10px 20px;
      font-size: 1em;
      cursor: pointer;
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;

    .action {
      a {
        color: #42b883;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  // 新增的样式，用于居中 Versions 组件
  .versions-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
