import { ElectronAPI } from '@electron-toolkit/preload'
import { Logger } from './logger'
import { Store } from './store'
declare global {
  interface Window {
    electron: ElectronAPI
    electronLog: Logger
    store: Store
    api: unknown
  }
}
