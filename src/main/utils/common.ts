// 移除注册的handle事件
import { ipcMain } from 'electron'
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
 * 移除已注册的 IPC 处理程序
 *
 * @param {string[]} channelNames - 需要移除处理程序的 IPC 通道名称数组
 * @example
 * removeExistingHandlers(['channel1', 'channel2']);
 */
export function removeExistingHandlers(channelNames: string[]): void {
  channelNames.forEach((channel: string) => {
    ipcMain.removeHandler(channel)
  })
}
