import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // ---------------- 主进程配置 ----------------
  main: {
    plugins: [externalizeDepsPlugin()], // 使用 externalizeDepsPlugin 插件，将依赖外部化
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'), // 定义路径别名
        '@config': resolve('src/config'),
        '@main': resolve('src/main'),
        '@components': resolve('src/renderer/src/components')
      }
    }
  },
  // ---------------- 预加载脚本配置 ----------------
  preload: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'), // 定义路径别名
        '@config': resolve('src/config'),
        '@main': resolve('src/main'),
        '@components': resolve('src/renderer/src/components')
      }
    },
    plugins: [externalizeDepsPlugin()] // 使用 externalizeDepsPlugin 插件，将依赖外部化
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'), // 定义路径别名
        '@config': resolve('src/config'),
        '@main': resolve('src/main'),
        '@components': resolve('src/renderer/src/components')
      }
    },
    plugins: [vue()]
  }
})
