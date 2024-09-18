import './assets/main.css'

import { createApp } from 'vue'
import router from '@renderer/router'
import App from './App.vue'
import { initLog } from '@renderer/plugins/core/console'

// 初始化日志
initLog()

createApp(App).use(router).mount('#app')
