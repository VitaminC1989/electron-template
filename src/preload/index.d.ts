import { ElectronAPI } from '@electron-toolkit/preload'
import { Logger } from './logger'
import { Store } from './store'
import type { ModelType } from '@renderer/object/model'

declare global {
  interface Window {
    electron: ElectronAPI
    electronLog: Logger
    store: Store
    api: unknown
    model: ModelType
  }
}
