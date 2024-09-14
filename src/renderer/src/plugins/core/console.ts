// utils
import { serializeError } from '@renderer/utils/common'

// 定义 LogFunction 类型
type LogFunction = (...args: any[]) => void

// 将全局声明移到文件顶部
declare global {
  interface Window {
    log: typeof window.electronLog & {
      info: LogFunction
      debug: LogFunction
      warn: LogFunction
      error: LogFunction
    }
  }
}

// ------------------ 自定义 window.log start ------------------
/**
 * 提取调用栈中的方法名、文件名、行号、列号
 * @param stackLine - 堆栈信息的单行
 * @returns 处理后的堆栈信息
 */
function extractStackInfo(stackLine: string): string {
  // 正则表达式解析调用栈，提取出方法名、文件名、行号和列号
  const regex = /at\s+(\S+)\s+\((.*):(\d+):(\d+)\)/
  const match = stackLine.match(regex)

  if (match) {
    const methodName = match[1] // 方法名
    const line = match[3] // 行号
    const column = match[4] // 列号
    // 文件名
    const arr = match[2].split('/')
    const fileName = arr[arr.length - 1]

    // 返回格式化后的结果，包含方法名、文件名、行号和列号
    return `${methodName} (${fileName}, line: ${line}, column: ${column} ${line}:${column})`
  } else {
    // 如果无法解析堆栈信息，返回原始行
    return stackLine
  }
}

/**
 * 处理 Error 对象的堆栈信息
 * @param stack - Error 对象的堆栈信息
 * @returns 处理后的堆栈信息
 */
function processStack(stack: string): string {
  const stackArr = stack.split('\n') // 将堆栈信息分割成数组，每一行为调用路径
  const formattedStack = extractStackInfo(stackArr[2]) // 提取调用栈的第三行并处理
  return formattedStack
}

/**
 * 初始化自定义的日志功能，扩展 `window.log` 对象
 */
export function initLog(): void {
  // 移除此处的 declare global

  // 初始化 window.log
  window.log = {
    ...window.electronLog
  }

  /**
   * 自定义 log.info 方法，记录信息级别的日志，并附带调用栈信息。
   * 获取当前的堆栈信息，记录日志时添加调用栈的第三行（调用源信息）。
   *
   * @param {...any} args - 传入的日志信息
   */
  window.log.info = function (...args: any[]): void {
    const stack = new Error().stack // 创建 Error 对象并获取堆栈信息
    const stackInfo = processStack(stack as string)

    window.electronLog.info(...args, stackInfo) // 记录日志，并附带调用栈的第三行（调用源）
  }

  /**
   * 自定义 log.debug 方法，记录调试级别的日志，并附带调用栈信息。
   *
   * @param {...any} args - 传入的日志信息
   */
  window.log.debug = function (...args: any[]): void {
    const stack = new Error().stack // 创建 Error 对象并获取堆栈信息
    const stackInfo = processStack(stack as string)

    window.electronLog.debug(...args, stackInfo) // 记录日志，并附带调用栈的第三行（调用源）
  }

  /**
   * 自定义 log.warn 方法，记录警告级别的日志，并附带调用栈信息。
   *
   * @param {...any} args - 传入的日志信息
   */
  window.log.warn = function (...args: any[]): void {
    const stack = new Error().stack // 创建 Error 对象并获取堆栈信息
    const stackInfo = processStack(stack as string)

    window.electronLog.warn(...args, stackInfo) // 记录日志，并附带调用栈的第三行（调用源）
  }

  /**
   * 自定义 log.error 方法，对传入的 Error 对象进行预处理，并记录错误日志。
   * 因为 Error 对象在传递到主进程时会被序列化，且不可枚举的属性会丢失，
   * 所以在这里手动提取 Error 对象的 `name`、`message` 和 `stack`，防止关键信息丢失。
   *
   * @param {...any} args - 传入的日志信息，可能包含 Error 对象
   */
  window.log.error = function (...args: any[]): void {
    // 对传入的每个参数进行检查，如果是 Error 对象，则提取其关键信息
    const processedArgs = args.map((item) => {
      if (item instanceof Error) {
        // 如果参数是 Error 对象，则调用 serializeError 提取 `name`、`message` 和 `stack`
        return serializeError(item)
      } else {
        // 如果不是 Error 对象，则直接返回原始值
        return item
      }
    })

    // 调用原始的 electronLog.error 方法，将处理后的参数传递给日志系统
    const prefix = '❗️❗️❗️'
    window.electronLog.error(prefix, ...processedArgs)
  }
}
// ------------------ 自定义 window.log end ------------------
