import { ipcRenderer } from 'electron'
import { MESSAGE_TYPE } from '@config/communication'

/**
 * 安全序列化函数：将数据转换为可序列化的格式
 * @param arg - 需要序列化的参数
 * @returns 序列化后的字符串
 */
function safeSerialize(arg: any): string {
  try {
    return JSON.stringify(arg, null, 2)
  } catch (error) {
    return JSON.stringify(
      {
        message: 'Unserializable object detected',
        original: String(arg)
      },
      null,
      2
    )
  }
}

/**
 * 处理参数函数：将所有参数安全序列化
 * @param args - 需要处理的参数数组
 * @returns 处理后的参数数组
 */
function processArgs(args: any[]): string[] {
  return args.map((arg) => safeSerialize(arg))
}

/**
 * 日志接口：定义日志对象的方法
 */
export interface Logger {
  info: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
  debug: (...args: any[]) => void
  verbose: (...args: any[]) => void
  silly: (...args: any[]) => void
  getLogFilePath: () => Promise<string>
  uploadLog: (date: string) => Promise<unknown>
  changeLogLevel: (val: string) => Promise<unknown>
}

const logger: Logger = {
  /**
   * 记录 info 级别的日志
   * @param args - 要记录的参数
   */
  info: (...args: any[]): void => {
    const processedArgs = processArgs(args)
    ipcRenderer.send(MESSAGE_TYPE.LOG_INFO, ...processedArgs)
    console.log(...args)
  },

  /**
   * 记录 warn 级别的日志
   * @param args - 要记录的参数
   */
  warn: (...args: any[]): void => {
    const processedArgs = processArgs(args)
    ipcRenderer.send(MESSAGE_TYPE.LOG_WARN, ...processedArgs)
    console.warn(...args)
  },

  /**
   * 记录 error 级别的日志
   * @param args - 要记录的参数
   */
  error: (...args: any[]): void => {
    const processedArgs = processArgs(args)
    ipcRenderer.send(MESSAGE_TYPE.LOG_ERROR, ...processedArgs)
    console.error(...args)
  },

  /**
   * 记录 debug 级别的日志
   * @param args - 要记录的参数
   */
  debug: (...args: any[]): void => {
    const processedArgs = processArgs(args)
    ipcRenderer.send(MESSAGE_TYPE.LOG_DEBUG, ...processedArgs)
    console.debug(...args)
  },

  /**
   * 记录 verbose 级别的日志
   * @param args - 要记录的参数
   */
  verbose: (...args: any[]): void => {
    const processedArgs = processArgs(args)
    ipcRenderer.send(MESSAGE_TYPE.LOG_VERBOSE, ...processedArgs)
    console.log(...args)
  },

  /**
   * 记录 silly 级别的日志
   * @param args - 要记录的参数
   */
  silly: (...args: any[]): void => {
    const processedArgs = processArgs(args)
    ipcRenderer.send(MESSAGE_TYPE.LOG_SILLY, ...processedArgs)
    console.log(...args)
  },

  /**
   * 获取日志文件路径
   * @returns Promise<string> 日志文件路径
   */
  getLogFilePath: (): Promise<string> => {
    return ipcRenderer.invoke(MESSAGE_TYPE.LOG_GET_LOG_FILE_PATH)
  },

  /**
   * 上传日志文件
   * @param date - 日期字符串
   * @returns Promise<unknown> 上传结果
   */
  uploadLog: (date: string): Promise<unknown> => {
    return ipcRenderer.invoke(MESSAGE_TYPE.UPLOAD_LOG, date)
  },

  /**
   * 修改日志等级
   * @param val - 新的日志等级
   * @returns Promise<unknown> 修改结果
   */
  changeLogLevel: (val: string): Promise<unknown> => {
    return ipcRenderer.invoke(MESSAGE_TYPE.LOG_CHANGE_LEVEL, val)
  }
}

export default logger
