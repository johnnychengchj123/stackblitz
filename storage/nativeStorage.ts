import { serialize } from './localStorage'

const localStorageTools = import('./localStorage') as any
const isPC = !(window as any).KNB // TODO

interface nativeStorageProps {
  level?: number // 存储级别，Interger类型，0 - 内存【默认】，1 - 设备，2 - 云端【11】
  // eslint-disable-next-line no-unused-vars
  fail?: (key: string, err: any) => {} // 失败回调
  expires?: Date
}

const store = {
  storage: (window as any).KNB || {},
  disabled: false,
  set(key: string, val: any, options?: nativeStorageProps): any {
    if (!key || this.disabled) {
      return
    }
    if (isPC) {
      // eslint-disable-next-line consistent-return
      return Promise.resolve(localStorageTools.set(key, val))
    }
    if (val === undefined) {
      this.remove(key)
      return
    }
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      let value = val

      if (key && value) {
        const { level, fail } = options
        const { expires } = options

        if (expires) {
          value = {
            value,
            expires,
            timestamp: +new Date(),
          }
        }
        this.storage.setStorage({
          key,
          value: serialize(value),
          level: level || 0,
          success: () => {
            resolve(value)
          },
          fail: (e: any) => {
            if (fail) {
              fail(key, e)
            }
            reject(e)
          },
        })
      } else {
        reject()
      }
    })
  },

  get(key: string, def?: any, options?: nativeStorageProps): any {
    if (!key || this.disabled) {
      return
    }
    if (isPC) {
      // eslint-disable-next-line consistent-return
      return Promise.resolve(localStorageTools.get(key))
    }
    // eslint-disable-next-line consistent-return
    return new Promise((resolve) => {
      const { fail } = options
      this.storage.getStorage({
        key,
        success: (result: any) => {
          let val = result && result.value
          if (val && val.expires) {
            // 值已经过期
            if (val.timestamp + val.expires * 1000 < new Date()) {
              this.remove(key)
              val = ''
            } else {
              // 值没有过期
              val = val.value
            }
          }
          if (val) {
            resolve(val || def)
          } else {
            resolve(null)
          }
        },
        fail: (e: any) => {
          if (fail) {
            fail(key, e)
          }
          resolve(null)
        },
      })
    })
  },

  async has(key: string) {
    if (!key || this.disabled) {
      return false
    }
    if (isPC) {
      return localStorageTools.get(key)
    }
    const val = await this.get(key)

    return val
  },

  remove(key: string) {
    if (!key || this.disabled) {
      return
    }
    if (isPC) {
      localStorageTools.remove(key)
      return
    }
    this.storage.clearStorage({
      key,
    })
  },

  clear(key: string) {
    if (this.disabled) {
      return
    }
    if (isPC) {
      localStorageTools.clear()
      return
    }
    if (key) {
      this.remove(key)
    } else {
      console.error('native环境无法清空客户端存储的数据')
    }
  },
}
// 测试是否方法可用，不可用直接disabled
try {
  const testKey = '__storejs__'
  store.set(testKey, testKey)
  if (store.get(testKey) !== testKey) {
    store.disabled = true
  }
  store.remove(testKey)
} catch (e) {
  store.disabled = true
}

export default store
