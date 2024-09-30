import ElectronStore from 'electron-store'

// 创建持久化存储实例
const store = new ElectronStore()

// 安全解析JSON字符串
function safeParse(jsonString: string | undefined): any | undefined {
  if (typeof jsonString === 'undefined') {
    return undefined
  }

  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }
}

// 定义键信息接口
export interface KeyInfo {
  timestamp: number // 时间戳
  expires?: number // 过期时间（可选）
  isOnce?: boolean // 是否只读取一次（可选）
  [key: string]: any // 其他可能的键值对
}

// 定义存储数据接口
interface StoreData<T> {
  data: T // 实际存储的数据
  keyInfo: KeyInfo // 键信息
}

// 存储数据前的处理函数
function getInputData<T>(data: T, options: Partial<KeyInfo>): string {
  const _data: StoreData<T> = {
    data,
    keyInfo: {
      ...options,
      timestamp: new Date().getTime()
    }
  }

  return JSON.stringify(_data)
}

// 取出数据后的处理函数
function getOutputData<T>(data: string | undefined): StoreData<T> | undefined {
  return safeParse(data)
}

// 生成带有前缀的键名
function getKey(key: string): string {
  return `__hr_ai__${key}__`
}

// 获取指定键的数据
async function getData<T>(_key: string): Promise<StoreData<T> | undefined> {
  const _data = await store.get(_key)
  return getOutputData<T>(_data as string)
}

// 检查数据是否过期
async function isExpired(_key: string): Promise<boolean> {
  const data = await getData<any>(_key)
  if (!data) return true
  const { keyInfo } = data
  const { expires, timestamp } = keyInfo

  if (!expires) {
    return false
  }

  return timestamp + expires * 24 * 3600 * 1000 - new Date().getTime() < 0
}

// 检查数据是否为一次性读取
async function isOnce(_key: string): Promise<boolean> {
  const data = await getData<any>(_key)
  if (!data) return false
  const { keyInfo } = data
  const { isOnce } = keyInfo

  return !!isOnce
}

// 获取数据，处理过期和一次性读取的情况
async function get<T>(key: string): Promise<T | null> {
  const _key = getKey(key)
  const _data = await getData<T>(_key)

  if (!_data) {
    return null
  }

  const isExpiredType = await isExpired(_key)
  const isOnceType = await isOnce(_key)
  // 删除已过期或者只读取一次的_key
  if (isExpiredType || isOnceType) {
    remove(_key)
  }

  return isExpiredType ? null : _data.data
}

// 设置数据
async function set<T>(key: string, data: T, options: Partial<KeyInfo> = {}): Promise<void> {
  const _key = getKey(key)
  const _data = getInputData(data, options)
  await store.set(_key, _data)
}

// 删除数据
async function remove(key: string): Promise<void> {
  const _key = getKey(key)
  await store.delete(_key)
}

// 设置一次性读取的数据
async function once<T>(key: string, data: T, options: Partial<KeyInfo> = {}): Promise<void> {
  const _key = getKey(key)
  const _data = getInputData(data, {
    ...options,
    isOnce: true
  })
  await store.set(_key, _data)
}

/**
 * 获取存储中的所有数据
 *
 * @return {Promise<Record<string, any>>} 返回一个Promise，解析为包含所有存储数据的对象
 */
async function getAllStore(): Promise<Record<string, any>> {
  return store.store
}

// 导出公共函数
export { once, set, get, remove, getAllStore }
