import { del, get, set } from 'idb-keyval'
import type { StateStorage } from 'zustand/middleware'

declare global {
  interface Window {
    __ST_FAIL_IDB_WRITES?: boolean
  }
}

function shouldFailWrite(): boolean {
  return (
    typeof window !== 'undefined' && window.__ST_FAIL_IDB_WRITES === true
  )
}

export const idbStorage: StateStorage = {
  async getItem(name) {
    return (await get<string>(name)) ?? null
  },
  async setItem(name, value) {
    if (shouldFailWrite()) {
      throw new Error('IndexedDB write failed')
    }
    await set(name, value)
  },
  async removeItem(name) {
    await del(name)
  },
}
