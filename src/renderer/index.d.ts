export {}

// 定义 LogFunction 类型
type LogFunction = (...args: any[]) => void

import { Logger } from '../preload/logger'

// 将全局声明移到文件顶部
declare global {
  interface Window {
    log: Logger & {
      info: LogFunction
      debug: LogFunction
      warn: LogFunction
      error: LogFunction
    }
  }
}
