electron-template 项目文档
这是一个使用Electron、Vue 3和TypeScript构建的桌面应用程序模板。该项目提供了一个完整的开发框架,包括主进程、渲染进程、IPC通信、持久化存储等功能。

## 项目结构概览

项目采用了典型的Electron应用结构,分为主进程(main)、预加载脚本(preload)和渲染进程(renderer)三个主要部分。

## 主要文件说明

### 主进程 (Main Process)

1. `src/main/index.ts`
   - 主进程的入口文件
   - 初始化主窗口
   - 设置应用的事件监听器
   - 初始化IPC通信

2. `src/main/windows/main.ts`
   - 定义和创建主窗口
   - 设置窗口属性和事件监听器

3. `src/main/ipc.ts`
   - 初始化IPC通信
   - 定义主进程侧的IPC事件处理器

4. `src/main/logger.ts`
   - 配置和初始化日志系统
   - 提供日志记录功能

5. `src/main/electronStore.ts`
   - 配置和初始化electron-store
   - 提供数据持久化存储的方法

### 预加载脚本 (Preload)

1. `src/preload/index.ts`
   - 预加载脚本的入口文件
   - 暴露安全的API给渲染进程

2. `src/preload/logger.ts`
   - 为渲染进程提供日志记录功能

3. `src/preload/store.ts`
   - 为渲染进程提供数据存储的API

### 渲染进程 (Renderer Process)

1. `src/renderer/src/main.ts`
   - 渲染进程的入口文件
   - 初始化Vue应用
   - 加载路由和状态管理

2. `src/renderer/src/App.vue`
   - Vue应用的根组件

3. `src/renderer/src/router/index.ts`
   - 定义应用的路由配置

4. `src/renderer/src/components/`
   - 包含可复用的Vue组件
   - 例如 `Versions.vue` 显示应用的版本信息
   - `ElectronStoreDemo.vue` 演示了如何使用electron-store

5. `src/renderer/src/plugins/core/console.ts`
   - 自定义的日志系统，对`window.electronLog`进行了封装

### 配置文件

1. `electron.vite.config.ts`
   - Electron-vite的配置文件
   - 定义了主进程、预加载脚本和渲染进程的构建配置

2. `electron-builder.yml`
   - Electron-builder的配置文件
   - 定义了应用打包和分发的配置

3. `vite.config.ts`
   - Vite的配置文件，主要用于渲染进程的开发服务器配置

4. `tsconfig.json`, `tsconfig.node.json`, `tsconfig.web.json`
   - TypeScript的配置文件，分别用于整个项目、Node.js环境和Web环境

5. `.eslintrc.cjs`, `.prettierignore`
   - ESLint和Prettier的配置文件，用于代码格式化和风格检查

## 关键功能说明

1. **窗口管理**:
   - 主窗口的创建和管理在 `src/main/windows/main.ts` 中实现
   - 支持无边框窗口和自定义标题栏

2. **IPC通信**:
   - 在 `src/main/ipc.ts` 中初始化和处理IPC事件
   - 通过预加载脚本 (`src/preload/index.ts`) 暴露安全的API给渲染进程

3. **数据持久化**:
   - 使用 electron-store 实现，相关配置在 `src/main/electronStore.ts`
   - 在渲染进程中通过 `window.store` API使用

4. **日志系统**:
   - 使用 electron-log 实现，在 `src/main/logger.ts` 中配置
   - 渲染进程通过 `src/renderer/src/plugins/core/console.ts` 中的封装使用

5. **自动更新**:
   - 在 `src/config/communication.ts` 中定义了相关的IPC事件类型
   - 具体实现需要在主进程中添加

## 开发指南

1. 启动开发服务器:
   ```
   npm run dev
   ```

2. 构建应用:
   ```
   npm run build
   ```

3. 添加新的IPC通信:
   - 在 `src/config/communication.ts` 中添加新的消息类型
   - 在 `src/main/ipc.ts` 中实现主进程侧的处理逻辑
   - 在预加载脚本中暴露相应的API
   - 在渲染进程中使用 `window.electron` 或自定义的API调用

4. 添加新的路由:
   - 在 `src/renderer/src/router/index.ts` 中添加新的路由配置
   - 创建对应的Vue组件

5. 使用持久化存储:
   - 在渲染进程中使用 `window.store` API进行数据的存取
