import { createWebHashHistory, createRouter } from 'vue-router'

// import App from '@renderer/App.vue'
import Home from '@renderer/views/Home.vue'
import Demo from '@renderer/views/Demo/index.vue'
const routes = [
  // { path: '/', component: Home },
  { path: '/', component: Demo },
  { path: '/home', component: Home },
  { path: '/demo', component: Demo }
]

const router = createRouter({
  history: createWebHashHistory(), // 使用 createWebHistory
  routes
})

export { routes }
export default router
