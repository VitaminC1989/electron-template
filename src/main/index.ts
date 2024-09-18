import { app } from 'electron'
import windows from './windows/index'
import ipc from './ipc'
import log from './logger'
// 通讯管道名称枚举

// 初始化主窗口
windows.main.init()
windows.main.onWindowCreated(() => {
  // console.log('windows.main.onWindowCreated', windows.main.getWindow())
  ipc.init()
})

// 注释掉悬浮窗口
// windows.fold.init()

// ---------------- 捕获错误并打印到日志 start ----------------
// Electron 9.0.0 及以上版本的渲染进程消失事件
app.on('render-process-gone', (event, webContents, details) => {
  log.error('渲染进程消失:', { event, webContents, details })
})

// 捕获主进程中的未捕获异常
process.on('uncaughtException', (error) => {
  log.error('未捕获的异常:', error)
})

// 捕获主进程中的未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  log.error('未处理的 Promise 拒绝:', promise, '原因:', reason)
})
// ---------------- 捕获错误并打印到日志 end ----------------
