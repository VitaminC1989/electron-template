// 移除注册的handle事件
import { ipcMain } from 'electron'
import { execSync } from 'child_process'
import * as os from 'os'

export interface MacAddress {
  name: string
  mac: string
}

/**
 * 获取有线网络接口的 MAC 地址
 *
 * @returns {MacAddress[]} 返回包含有线网络接口的 MAC 地址的对象数组
 * @example
 * const ethernetMacAddresses = getEthernetMacAddresses();
 * ethernetMacAddresses.forEach(interface => {
 *   console.log(`${interface.name}: ${interface.mac}`);
 * });
 */
export function getEthernetMacAddresses(): MacAddress[] {
  // 获取所有网络接口的详细信息
  const interfaces: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces()
  // 用于存储所有有线网络接口的 MAC 地址的数组
  const macAddresses: MacAddress[] = []

  // 遍历每个网络接口
  for (const interfaceName in interfaces) {
    const networkInterface = interfaces[interfaceName]

    // 添加检查确保 networkInterface 不是 undefined
    if (networkInterface) {
      // 遍历每个接口的信息
      for (const interfaceInfo of networkInterface) {
        // 检查 MAC 地址是否存在且不是默认的全零 MAC 地址
        if (
          interfaceInfo.mac &&
          interfaceInfo.mac !== '00:00:00:00:00:00' &&
          !interfaceInfo.internal && // 确保不是内部接口
          !interfaceName.toLowerCase().includes('virtual') && // 排除虚拟网络适配器(因为该网络适配器mac地址可能会变)
          !interfaceName.toLowerCase().includes('vethernet') // 排除Hyper-V 虚拟网络适配器(因为该网络适配器mac地址会变)
        ) {
          // 将有效的 MAC 地址和接口名称添加到数组中
          macAddresses.push({
            name: interfaceName,
            mac: interfaceInfo.mac
          })
        }
      }
    }
  }

  // 返回所有有线网络接口的 MAC 地址
  return macAddresses
}

/**
 * 同步获取主板序列号
 *
 * 此函数会根据当前操作系统平台(Windows或macOS)获取主板序列号。
 * 对于不支持的平台,会抛出错误。
 *
 * @returns {string} 返回主板序列号
 * @throws {Error} 如果平台不支持或获取过程中出错,则抛出错误
 *
 * @example
 * try {
 *   const serialNumber = getMotherboardSerialNumberSync();
 *   console.log('主板序列号:', serialNumber);
 * } catch (error) {
 *   console.error('获取主板序列号失败:', error.message);
 * }
 */
export function getMotherboardSerialNumberSync(): string {
  const platform: NodeJS.Platform = os.platform()

  try {
    if (platform === 'win32') {
      // Windows 平台,使用 wmic 获取主板序列号
      const stdout: string = execSync('wmic baseboard get SerialNumber').toString()
      // 提取 SerialNumber,去除不必要的换行和空白
      const result: string = stdout.split('\n')[1].trim()
      return result
    } else if (platform === 'darwin') {
      // macOS 平台,使用 ioreg 获取主板序列号
      const stdout: string = execSync('ioreg -l | grep IOPlatformSerialNumber').toString()
      // 提取序列号
      const result: string = stdout.split('"IOPlatformSerialNumber" = ')[1].replace(/"/g, '').trim()
      return result
    } else {
      // 不支持的平台
      throw new Error('当前平台不支持获取主板序列号')
    }
  } catch (error: unknown) {
    throw new Error(`获取主板序列号时出错: ${(error as Error).message}`)
  }
}

/**
 * 移除已注册的 IPC 处理程序
 *
 * @param {ReadonlyArray<string>} channelNames - 需要移除处理程序的 IPC 通道名称数组
 * @returns {void}
 * @example
 * removeExistingHandlers(['channel1', 'channel2']);
 */
export function removeExistingHandlers(channelNames: ReadonlyArray<string>): void {
  channelNames.forEach((channel: string): void => {
    ipcMain.removeHandler(channel)
  })
}
