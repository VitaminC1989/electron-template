import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  // ---------------- 主进程配置 ----------------
  main: {
    plugins: [externalizeDepsPlugin()], // 使用 externalizeDepsPlugin 插件，将依赖外部化
    resolve: {
      alias: {
        '@config': resolve('src/config'),
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload'),
        '@renderer': resolve('src/renderer/src'), // 定义路径别名
        '@components': resolve('src/renderer/src/components')
      }
    }
  },
  // ---------------- 预加载脚本配置 ----------------
  preload: {
    resolve: {
      alias: {
        '@config': resolve('src/config'),
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload'),
        '@renderer': resolve('src/renderer/src'), // 定义路径别名
        '@components': resolve('src/renderer/src/components')
      }
    },
    plugins: [externalizeDepsPlugin()] // 使用 externalizeDepsPlugin 插件，将依赖外部化
  },
  renderer: {
    resolve: {
      alias: {
        '@config': resolve('src/config'),
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload'),
        '@renderer': resolve('src/renderer/src'), // 定义路径别名
        '@components': resolve('src/renderer/src/components')
      }
    },
    // 服务器配置
    server: {},
    plugins: [vue()]
  }
})
