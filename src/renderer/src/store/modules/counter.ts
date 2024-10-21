import { defineStore } from 'pinia'

interface CounterState {
  count: number
  name: string
}

export const useCounterStore = defineStore('counter', {
  state: (): CounterState => ({
    count: 0,
    name: 'Pinia'
  }),
  getters: {
    doubleCount: (state: CounterState): number => state.count * 2
  },
  actions: {
    increment(): void {
      this.count++
    },
    reset(): void {
      this.count = 0
    }
  }
})
