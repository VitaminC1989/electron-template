import { app } from 'electron'
import log, { LevelOption } from 'electron-log'
import path from 'path'
import fs from 'fs'

// 获取 MAC 地址工具函数
import { getEthernetMacAddresses } from '@main/utils/common'
import type { MacAddress } from '@main/utils/common'

// 获取本机的 MAC 地址列表
const macAddressList: MacAddress[] = getEthernetMacAddresses()
log.info('macAddressList', macAddressList) // 记录所有 MAC 地址

// 设置日志级别和格式
log.transports.file.level = 'info' // 设置日志级别为 info
log.transports.file.maxSize = 10243000 // 设置单个日志文件的最大大小为 10MB
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}' // 设置日志输出格式

// 构建日志文件路径
const logDir: string = path.join(app.getPath('userData'), 'electron_log', 'app')

// 确保日志目录存在，如果不存在则创建
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// 配置日志文件路径
const macAddress: string = getEthernetMacAddresses()?.[0]?.mac || '[mac地址缺失]'
// 将 MAC 地址转换为合法文件名，文件名中不支持使用 `:` 等特殊字符
const legalName: string = macAddress.replace(/:/g, '-')
// 生成当天的日志文件路径
const { logFilePath } = generateLogFileInfo(logDir, legalName)

// 设置日志文件路径
log.transports.file.resolvePath = () => {
  return logFilePath
}

// ------------------ 方法 start ------------------

/**
 * 获取 X 天前的日期
 * @param {number} x 天数，表示从今天起往前数的天数
 * @returns {string} 格式化的日期字符串，形如 '2023-01-01'
 */
function getFormattedDateBeforeDays(x: number): string {
  const date = new Date()
  date.setDate(date.getDate() - x) // 设置日期为 X 天前

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 保证月份两位数
  const day = String(date.getDate()).padStart(2, '0') // 保证日期两位数

  return `${year}-${month}-${day}` // 返回格式化的日期字符串
}

/**
 * 生成日志文件路径
 *
 * 生成的日志文件名称形如 '2023-01-01-[mac地址].log'
 * 如果 `isOld` 为 true 则在文件名后面添加 `.old` 扩展名
 *
 * @param {string} logDir 日志文件夹路径
 * @param {string} macAddress MAC 地址
 * @param {string} [date] 日期字符串，形如 '2023-01-01'，默认为当前日期
 * @param {boolean} [isOld=false] 是否使用 `.old` 扩展名
 * @returns {{ logFileName: string, logFilePath: string }} 生成的日志文件名称和路径
 */
function generateLogFileInfo(
  logDir: string,
  macAddress: string,
  date?: string,
  isOld: boolean = false
): { logFileName: string; logFilePath: string } {
  const today = getFormattedDateBeforeDays(0) // 获取当前日期
  const formattedDate = date || today // 如果未传递日期，默认为当天日期
  // 构建日志文件名
  const logFileName = `${formattedDate}-[${macAddress}]${isOld ? '.old' : ''}.log`
  // 构建日志文件的完整路径
  const logFilePath = path.join(logDir, logFileName)
  return { logFileName, logFilePath }
}

/**
 * 删除指定天数前的日志文件
 * @param {number} daysAgo 天数，表示要删除多少天前的日志文件
 */
function deleteOldLogs(daysAgo: number): void {
  const dateThreshold = getFormattedDateBeforeDays(daysAgo) // 获取删除阈值日期

  fs.readdir(logDir, (err, files) => {
    if (err) {
      log.error('【日志删除】读取日志目录失败:', err)
      return
    }

    // 遍历日志文件，删除早于阈值日期的文件
    files.forEach((file) => {
      // 提取文件名中的日期部分
      const fileDate = file.substring(0, 10) // 文件名的前 10 个字符就是日期部分

      // 如果文件日期早于阈值日期，则删除该文件
      if (fileDate < dateThreshold) {
        const filePath = path.join(logDir, file)
        fs.unlink(filePath, (err) => {
          if (err) {
            log.error('【日志删除】删除日志文件失败:', filePath, err)
          } else {
            log.info('【日志删除】成功删除日志文件:', filePath)
          }
        })
      }
    })
  })
}

// ------------------ 方法 end ------------------

// ------------------ 生命周期 start ------------------
app.whenReady().then(() => {
  // 启动时检查并执行 15 天前的日志删除
  deleteOldLogs(15)
})
// ------------------ 生命周期 end ------------------

// 导出日志相关的操作
export default {
  info(param: any, ...args: any[]): void {
    log.info(param, ...args)
  },
  warn(param: any, ...args: any[]): void {
    log.warn(param, ...args)
  },
  error(param: any, ...args: any[]): void {
    log.error(param, ...args)
  },
  debug(param: any, ...args: any[]): void {
    log.debug(param, ...args)
  },
  verbose(param: any, ...args: any[]): void {
    log.verbose(param, ...args)
  },
  silly(param: any, ...args: any[]): void {
    log.silly(param, ...args)
  },
  transports: log.transports,
  changeFileLevel: (level: LevelOption): void => {
    log.transports.file.level = level // 更改文件日志级别
  },
  deleteOldLogs
}
