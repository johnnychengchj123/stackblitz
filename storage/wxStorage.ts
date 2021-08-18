import { getStorageProps, setStorageProps, clearStorageProps } from './localStorage'

const canUseWxSDK = typeof window !== 'undefined' && (window as any).wx

const store = {
  storage: (window as any).wx || {},
  setStorage(params: setStorageProps): any {
    const { key, value, expires, success, fail } = params
    let val = value

    if (!key || !canUseWxSDK) {
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

    try {
      this.storage.setStorageSync(key, val)
      if (success) {
        success(value)
      }
      // eslint-disable-next-line consistent-return
      return Promise.resolve(val)
    } catch (e) {
      if (fail) {
        fail(e)
      }
      // eslint-disable-next-line consistent-return
      return Promise.reject(e)
    }
  },

  getStorage(params: getStorageProps): any {
    const { key, success, fail } = params

    if (!key || !canUseWxSDK) {
      return
    }
    let value = null
    try {
      value = this.storage.getStorageSync(key)
      if (value && value.expires) {
        // 值已经过期
        if (value.timestamp + value.expires * 1000 < new Date()) {
          this.clearStorage({ key })
          value = ''
        } else {
          // 值没有过期
          value = value.value
        }
      }
      if (success) {
        success(value)
      }
    } catch (e) {
      // continue regardless of error
      if (fail) {
        fail(value)
      }
    }

    // eslint-disable-next-line consistent-return
    return Promise.resolve(value)
  },

  clearStorage(params: clearStorageProps) {
    const { key, success } = params

    if (!key || !canUseWxSDK) {
      return
    }
    try {
      this.storage.removeStorageSync(key)
    } catch (e) {
      // continue regardless of error
    }

    if (success) {
      success()
    }
  },

}

export default store
