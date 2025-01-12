import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import loggerAPI from './logger' // 日志
import storeAPI from './store' // 持久化存储
import modelAPI from './model' // 模型

// Custom APIs for renderer
const api = {}

// 导出日志相关的 API
const electronLog = {
  ...loggerAPI
}

// 导出 store 相关的 API
const store = {
  ...storeAPI
}

// 导出模型相关的 API
const model = {
  ...modelAPI
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronLog', electronLog)
    contextBridge.exposeInMainWorld('store', store)
    contextBridge.exposeInMainWorld('model', model)
  } catch (error) {
    loggerAPI.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.electronLog = electronLog
  // @ts-ignore (define in dts)
  window.store = store
  // @ts-ignore (define in dts)
  window.model = model
}
