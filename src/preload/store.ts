import { ipcRenderer } from 'electron'
import { KeyInfo } from '@main/electronStore'
// 通道名称枚举
import { MESSAGE_TYPE } from '@config/communication'

// 定义类型
export interface Store {
  get: (key: string) => Promise<any>
  set: <T>(key: string, value: T, options?: Partial<KeyInfo>) => Promise<boolean>
  delete: (key: string) => Promise<boolean>
  getAllStore: () => Promise<Record<string, any>>
}

// 导出存储操作对象
export default {
  /**
   * 获取存储的值
   * @param key - 存储键
   * @returns 存储的值
   */
  get: async (key: string): Promise<any> => ipcRenderer.invoke(MESSAGE_TYPE.STORE_GET, key),

  /**
   * 设置存储的值
   * @param key - 存储键
   * @param value - 要存储的值
   * @param options - 存储选项
   * @returns 操作是否成功
   */
  set: async <T>(key: string, value: T, options: Partial<KeyInfo>): Promise<boolean> =>
    await ipcRenderer.invoke(MESSAGE_TYPE.STORE_SET, key, value, options),

  /**
   * 删除存储的值
   * @param key - 要删除的存储键
   * @returns 操作是否成功
   */
  delete: async (key: string): Promise<boolean> =>
    ipcRenderer.invoke(MESSAGE_TYPE.STORE_DELETE, key),

  /**
   * 返回所有存储数据
   * @returns 所有存储的键值对
   */
  getAllStore: async (): Promise<Record<string, any>> =>
    ipcRenderer.invoke(MESSAGE_TYPE.STORE_GET_ALL)
}
