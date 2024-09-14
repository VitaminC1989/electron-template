import { app, ipcMain, shell } from 'electron'
import { getEthernetMacAddresses, removeExistingHandlers } from '@main/utils/common'

import log from './logger'

// 通讯管道名称枚举
import { MESSAGE_TYPE } from '@config/communication'

// 初始化函数
function init() {
  // 移除已存在的事件处理器,避免重复注册导致错误
  removeExistingHandlers([
    MESSAGE_TYPE.GET_DEVICE_MAC,
    MESSAGE_TYPE.LOG_CHANGE_LEVEL,
    MESSAGE_TYPE.LOG_GET_LOG_FILE_PATH
  ])

  // 监听退出应用消息
  ipcMain.on(MESSAGE_TYPE.EXIT_APP, () => {
    app && app.exit()
  })

  // ------------------ 通用功能 ------------------
  // 获取设备MAC地址
  ipcMain.handle(MESSAGE_TYPE.GET_DEVICE_MAC, () => {
    return getEthernetMacAddresses()
  })

  // 在默认浏览器中打开URL
  ipcMain.on(MESSAGE_TYPE.OPEN_URL_IN_BROWSER, (_event, url) => {
    shell.openExternal(url)
  })

  // ------------------ 日志相关功能 start ------------------
  // 获取日志文件路径
  ipcMain.handle(MESSAGE_TYPE.LOG_GET_LOG_FILE_PATH, () => {
    return log.transports.file.getFile().path
  })

  // 修改日志级别
  ipcMain.handle(MESSAGE_TYPE.LOG_CHANGE_LEVEL, (_event, val) => {
    log.changeFileLevel(val)
  })

  // 以下是各种日志级别的处理函数
  ipcMain.on(MESSAGE_TYPE.LOG_INFO, (_event, param, ...args) => {
    log.info(param, ...args)
  })

  ipcMain.on(MESSAGE_TYPE.LOG_WARN, (_event, param, ...args) => {
    log.warn(param, ...args)
  })

  ipcMain.on(MESSAGE_TYPE.LOG_ERROR, (_event, param, ...args) => {
    log.error(param, ...args)
  })

  ipcMain.on(MESSAGE_TYPE.LOG_DEBUG, (_event, param, ...args) => {
    log.debug(param, ...args)
  })

  ipcMain.on(MESSAGE_TYPE.LOG_VERBOSE, (_event, param, ...args) => {
    log.verbose(param, ...args)
  })

  ipcMain.on(MESSAGE_TYPE.LOG_SILLY, (_event, param, ...args) => {
    log.silly(param, ...args)
  })
  // ------------------ 日志相关功能 end ------------------
}

// 导出初始化函数
export default {
  init
}
