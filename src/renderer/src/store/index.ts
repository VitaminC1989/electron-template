import { Pinia, createPinia } from 'pinia'
// import piniaPersistElectron from './plugins/piniaPersistElectron'

// pinia persist
const pinia: Pinia = createPinia()
// pinia 自定义持久化存储
// pinia.use(piniaPersistElectron)

export default pinia
