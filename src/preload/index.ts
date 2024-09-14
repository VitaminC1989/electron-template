import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import loggerAPI from './logger'

// Custom APIs for renderer
const api = {}

// 导出日志相关的 API
const electronLog = {
  ...loggerAPI
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronLog', electronLog)
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
}
