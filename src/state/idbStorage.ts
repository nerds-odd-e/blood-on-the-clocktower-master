import { del, get, set } from 'idb-keyval'
import type { StateStorage } from 'zustand/middleware'

export const idbStorage: StateStorage = {
  async getItem(name) {
    return (await get<string>(name)) ?? null
  },
  async setItem(name, value) {
    await set(name, value)
  },
  async removeItem(name) {
    await del(name)
  },
}
