// 初始化日志
import { initLog } from '@renderer/plugins/core/console'
initLog()

import './assets/main.css'
import { createApp } from 'vue'
import router from '@renderer/router'
import pinia from '@renderer/store'
import App from './App.vue'

createApp(App).use(router).use(pinia).mount('#app')
