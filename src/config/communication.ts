// 通讯管道名称枚举
export const MESSAGE_TYPE = {
  // ---------------- 通用 start ----------------
  // 打印console
  PRINT_LOG: 'printLog',
  // 最小化
  MINIMIZE: 'minimize',
  // 最大化
  MAXIMIZE: 'maximize',
  // 关闭窗口
  EXIT_APP: 'exit-app',
  // 获取设备MAC地址
  GET_DEVICE_MAC: 'get-device-mac',
  // 用默认浏览器打开网页
  OPEN_URL_IN_BROWSER: 'open-url-in-browser',
  // ---------------- 通用 end ----------------

  // ---------------- 持久化存储 start ----------------
  STORE_SET: 'store-set',
  STORE_GET: 'store-get',
  STORE_DELETE: 'store-delete',
  STORE_ONCE: 'store-once',
  STORE_GET_ALL: 'store-get-all',
  // ---------------- 持久化存储 end ----------------

  // ---------------- 日志 start ----------------
  LOG_INFO: 'log-info',
  LOG_WARN: 'log-warn',
  LOG_ERROR: 'log-error',
  LOG_DEBUG: 'log-debug',
  LOG_VERBOSE: 'log-verbose',
  LOG_SILLY: 'log-silly',
  // 获取日志文件路径
  LOG_GET_LOG_FILE_PATH: 'log-get-log-file-path',
  // 上传日志
  UPLOAD_LOG: 'upload-log',
  // 修改日志层级
  LOG_CHANGE_LEVEL: 'log-change-level',
  // ---------------- 日志 end ----------------

  // ---------------- 主窗口 start ----------------
  // 窗口最大化
  WIN_MAXIMIZE: 'win-maximize',
  // 窗口已最大化
  WIN_MAXIMIZED: 'win-maximized',
  // 窗口最小化
  WIN_MINIMIZE: 'win-minimize',
  // 窗口已最小化
  WIN_MINIMIZED: 'win-minimized',
  // 窗口已恢复大小
  WIN_UNMAXIMIZED: 'win-unmaximized',
  // 关闭主窗口
  WIN_SHOW_OR_CLOSE: 'win-show-or-close',
  // 切换窗口显示/隐藏
  WIN_TOGGLE_VISIBILITY: 'win-toggle-visibility',
  // ---------------- 主窗口 end ----------------

  // ---------------- 折叠窗口 start ----------------
  // 折叠窗口非内容区域鼠标穿透
  FOLD_WIN_IGNORE_MOUSE: 'fold-win-ignore-mouse',
  // 折叠窗口显示或隐藏
  FOLD_WIN_SHOW_OR_CLOSE: 'fold-win-show-or-close',
  // 折叠窗口移动
  FOLD_WIN_MOVE: 'fold-win-move',
  // 折叠窗口获取窗口位置
  FOLD_GET_WIN_POSITION: 'fold-get-win-position',
  // 折叠窗口设置窗口位置
  FOLD_SET_WIN_POSITION: 'fold-set-win-position',
  // 获取屏幕信息
  GET_SCREEN_INFO: 'get-screen-info',
  FOLD_WIN_RESIZE: 'fold-win-resize',
  // ---------------- 折叠窗口 end ----------------

  // ---------------- 关于自动更新通讯 start ----------------
  UPDATE_CHECK: 'updateCheck', // 检查更新
  UPDATE_STATUS: 'updateStatus', // 更新状态响应到主窗口
  UPDATE_CHECKING: 'updateChecking', // 开始检测更新事件
  UPDATE_AVAILABLE: 'updateAvailable', // 有可用更新
  UPDATE_LATEST: 'updateLatest', // 当前为最新版本，无可用更新
  UPDATE_DOWNLOAD_START: 'updateDownloadStart', // 开始下载更新
  UPDATE_DOWNLOAD_PROGRESS: 'updateDownloadProgress', // 更新进度
  UPDATE_DOWNLOAD_END: 'updateDownloadEnd', // 下载结束
  UPDATE_ERROR: 'updateError', // 更新出错
  UPDATE_INSTALL_APP: 'updateInstallApp', // 安装新版本
  // ---------------- 关于自动更新通讯 end ----------------
  GET_APP_PATH: 'getAPPPath', // 获取APP安装地址
  START_RECORDER: 'startRecorderUpload',
  RESIZE_SIZE: 'resizeSize', // 重置窗口大小至底部
  MOVE_WINDOW: 'moveWindow', // 移动窗口'
  RECOVERY_SIZE: 'recoverySize' // 恢复原生大小
}
