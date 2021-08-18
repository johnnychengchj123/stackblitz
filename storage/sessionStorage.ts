import localStorageTools, { getStorageProps, setStorageProps, clearStorageProps } from './localStorage'

const inBrowser = typeof window !== 'undefined'

const virtualStorage = {
  storage: {},
  setStorage(params: setStorageProps): any {
    const { key, value, expires, success, fail } = params
    let val = value

    if (!key) {
      if (fail) {
        fail('key为必传值')
      }
      return Promise.reject()
    }

    if (val === undefined) {
      this.clearStorage({ key })
      if (success) {
        success(undefined)
      }
      return Promise.resolve()
    }

    if (expires) {
      val = {
        value,
        expires,
        timestamp: +new Date(),
      }
    }
    this.storage[key] = val

    if (success) {
      success(value)
    }
    // eslint-disable-next-line consistent-return
    return Promise.resolve(val)
  },

  getStorage(params: getStorageProps): any {
    const { key, success } = params

    if (!key) {
      return undefined
    }
    let val
    const target = this.storage
    // eslint-disable-next-line no-prototype-builtins
    if (target.hasOwnProperty(key)) {
      val = target[key]
    }
    if (val && val.expires) {
      // 值已经过期
      if (val.timestamp + val.expires * 1000 < new Date()) {
        this.clearStorage({ key })
        val = ''
      } else {
        // 值没有过期
        val = val.value
      }
    }

    if (success) {
      success(val)
    }
    return Promise.resolve(val)
  },

  clearStorage(params: clearStorageProps) {
    const { key, success } = params

    if (!key) {
      return
    }
    const target = this.storage
    // eslint-disable-next-line no-prototype-builtins
    if (target.hasOwnProperty(key)) {
      delete target[key]
    }

    if (success) {
      success()
    }
  },

  clearAllStorage() {
    this.storage = {}
  },
}

export default inBrowser
  ? {
      ...localStorageTools,
      storage: window.sessionStorage,
    }
  : virtualStorage
