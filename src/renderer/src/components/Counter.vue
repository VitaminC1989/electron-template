<template>
  <div>
    <h1>Pinia计数器示例</h1>
    <p>当前计数: {{ counterStore.count }}</p>
    <p>双倍计数: {{ counterStore.doubleCount }}</p>
    <button class="primary-button" @click="counterStore.increment">增加</button>
    <button class="secondary-button" @click="counterStore.reset">重置</button>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@renderer/store/modules/counter'

const counterStore = useCounterStore()
</script>

<style lang="less" scoped>
button {
  padding: 5px 10px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.primary-button {
  margin-right: 10px;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
}

.primary-button:hover {
  background: linear-gradient(45deg, #43a0f5, #00d4e8);
}

.secondary-button {
  background: #f0f0f0;
  color: #333;
}

.secondary-button:hover {
  background: #e0e0e0;
}
</style>
