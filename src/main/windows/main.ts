// Electron 核心模块
import { app, shell, BrowserWindow, ipcMain } from 'electron'

// Electron 工具库
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// Node.js 内置模块
import path from 'path'
import { EventEmitter } from 'events'

// 开发工具扩展
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

// 配置文件
import { windowSize } from '../../config/windows'

// 日志模块
import log from '@main/logger'

// 应用图标
import icon from '../../../resources/icon.png?asset'

// 通信类型枚举
import { MESSAGE_TYPE } from '@config/communication'

// 注: 以下导入已被注释，如需使用请取消注释
// import { initConsole } from '@renderer/plugins/core/console'

// 事件发射器，用于处理窗口创建事件
const windowEvent = new EventEmitter()

// 主窗口实例
let win: BrowserWindow | null = null

// 判断是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'

// 创建主窗口
function createWindow() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    ...windowSize,
    show: false,
    frame: false, // 无边框窗口
    autoHideMenuBar: true,
    transparent: true,
    resizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      // 生产环境不能使用 devTools
      devTools: !isProduction,
      webviewTag: true // 启用 webview 支持
    }
  })

  // 监听窗口崩溃事件
  win.webContents.on(
    'render-process-gone',
    (event: Electron.Event, details: Electron.RenderProcessGoneDetails) => {
      log.error('渲染器进程意外消失，（可能由于进程崩溃或被杀死导致）', event, details)
    }
  )

  // 窗口准备好时显示
  win?.on('ready-to-show', () => {
    win?.show()
    // 在开发环境下打开开发者工具
    !isProduction && win?.webContents.openDevTools({ mode: 'detach' })
    // 发出窗口已创建完成的事件
    windowEvent.emit('window-created', win)
    // 初始化 IPC 消息传递
    InitIPCMessaging(win)
  })

  // 处理新窗口打开请求
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 根据环境加载不同的URL
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// 安装Vue开发者工具
async function installVueDevTools() {
  try {
    const name = await installExtension(VUEJS_DEVTOOLS)
    console.log(`已添加扩展: ${name}`)
  } catch (err) {
    log.info('发生错误: ', err)
  }
}

// 初始化应用
function init() {
  // 应用单例锁
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  } else {
    // 处理第二个实例启动
    app.on('second-instance', () => {
      log.info('第二个实例正在运行')
      if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()

        // 窗口折叠时恢复正常大小
        win.webContents.send(MESSAGE_TYPE.RECOVERY_SIZE)
        ipcMain.emit(MESSAGE_TYPE.RECOVERY_SIZE)
      }
    })

    // 应用就绪时
    app.whenReady().then(async () => {
      // 设置应用用户模型ID (Windows)
      electronApp.setAppUserModelId('com.electron')

      // 监听窗口创建事件
      app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
      })

      // 创建主窗口
      createWindow()

      // 处理 macOS 激活事件
      app.on('activate', function () {
        // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
        // 通常在应用程序中重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
    })

    // 当所有窗口都被关闭时退出应用
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }
}

// 初始化 IPC 消息传递
function InitIPCMessaging(win) {
  // 监听窗口最大化
  win.on('maximize', () => {
    win.webContents.send(MESSAGE_TYPE.WIN_MAXIMIZED)
  })

  // 监听窗口恢复
  win.on('unmaximize', () => {
    win.webContents.send(MESSAGE_TYPE.WIN_UNMAXIMIZED)
  })

  // 监听 WIN_MAXIMIZE 消息，切换窗口最大化/恢复
  ipcMain.on(MESSAGE_TYPE.WIN_MAXIMIZE, () => {
    if (!win.isMaximized()) {
      win.maximize()
    } else {
      win.unmaximize()
    }
  })

  // 监听 WIN_MINIMIZE 消息，最小化窗口
  ipcMain.on(MESSAGE_TYPE.WIN_MINIMIZE, () => {
    win.minimize(true)
  })

  // 监听 WIN_SHOW_OR_CLOSE 消息，显示或隐藏窗口
  ipcMain.on(MESSAGE_TYPE.WIN_SHOW_OR_CLOSE, (e, params) => {
    params.winShowSign ? win.show() : win.hide()
  })

  // 监听 WIN_TOGGLE_VISIBILITY 消息，切换窗口显示/隐藏
  ipcMain.on(MESSAGE_TYPE.WIN_TOGGLE_VISIBILITY, () => {
    win.isVisible() ? win.hide() : win.show()
  })
}

// 获取主窗口实例
function getWindow() {
  return win
}

// 导出模块
export default {
  init,
  getWindow,
  onWindowCreated: (callback) =>
    windowEvent.on('window-created', (win) => callback && callback(win))
}
