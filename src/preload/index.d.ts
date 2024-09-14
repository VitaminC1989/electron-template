import { ElectronAPI } from '@electron-toolkit/preload'
import { Logger } from './logger'

declare global {
  interface Window {
    electron: ElectronAPI
    electronLog: Logger
    api: unknown
  }
}
