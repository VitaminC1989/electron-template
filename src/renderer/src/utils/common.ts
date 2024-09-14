/**
 * 将 Error 对象序列化为普通对象
 * 由于 Error 对象的某些属性不可枚举，无法直接序列化。
 * 通过这个函数可以提取 Error 对象的 name、message 和 stack 信息，方便日志记录和传输。
 *
 * @param {Error} error - 要序列化的 Error 对象
 * @returns {Object} 序列化后的对象，包含 Error 的关键信息
 */
export function serializeError(error: Error): {
  name: string
  message: string
  stack?: string
} {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack
  }
}
