import { createWebHashHistory, createRouter } from 'vue-router'

import App from '@renderer/App.vue'

const routes = [{ path: '/', component: App }]

const router = createRouter({
  history: createWebHashHistory(), // 使用 createWebHistory
  routes
})

export { routes }
export default router
