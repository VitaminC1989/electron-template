import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // define: {
  //   'process.env': {
  //     TEST: 'hhh'
  //   }
  // }
  // server: {
  //   port: 3000
  // }
  // 服务器配置
  server: {
    open: 'http://bing.com'
  }
})
