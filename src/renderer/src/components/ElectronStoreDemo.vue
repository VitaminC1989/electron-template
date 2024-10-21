<template>
  <div>
    <h2>Electron Store 演示</h2>
    <input v-model="inputValue" placeholder="输入要保存的值" />
    <button @click="saveValue">保存</button>
    <button @click="getValue">获取</button>
    <p>存储的值: {{ storedValue }} {{ storedValue ? ' | ' + typeof storedValue : '' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const store = window.store
const inputValue = ref('')
const storedValue = ref('')
const DEMO_KEY = 'demoKey'

const saveValue = () => {
  store.set(DEMO_KEY, inputValue.value)
  inputValue.value = ''
}

const getValue = async () => {
  storedValue.value = await store.get(DEMO_KEY)
  console.log('storedValue.value', storedValue.value)
}
</script>
