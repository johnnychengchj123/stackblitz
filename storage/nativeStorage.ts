import localStorageTools, { serialize, nativeStorageProps } from './localStorage'

const isPC = !(window as any).KNB // TODO

const store = {
  storage: (window as any).KNB || {},
  setStorage(key: string, val: any, options?: nativeStorageProps): any {
    if (!key) {
      return Promise.reject()
    }
    if (isPC) {
      // eslint-disable-next-line consistent-return
      return Promise.resolve(localStorageTools.setStorage({ key, value: val }))
    }
    if (val === undefined) {
      this.clearStorage(key)
      return Promise.reject()
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

  getStorage(key: string, def?: any, options?: nativeStorageProps): any {
    if (!key) {
      return
    }
    if (isPC) {
      // eslint-disable-next-line consistent-return
      return Promise.resolve(localStorageTools.getStorage({ key }))
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
              this.clearStorage(key)
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

  clearStorage(key: string) {
    if (!key) {
      return
    }
    if (isPC) {
      localStorageTools.clearStorage({ key })
      return
    }
    this.storage.clearStorage({
      key,
    })
  },

  clearAllStorage(key: string) {
    if (isPC) {
      localStorageTools.clearAllStorage()
      return
    }
    if (key) {
      this.clearStorage(key)
    } else {
      console.error('native环境无法清空客户端存储的数据')
    }
  },
}

export default store
