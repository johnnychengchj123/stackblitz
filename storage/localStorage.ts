/**
 * 本地存储实现,封装localStorage
 */
export interface OptionsProps {
  expires?: Date
}

export interface clearStorageProps {
  key: string
  // eslint-disable-next-line no-unused-vars
  success?: () => {} // 失败回调
}

export interface getStorageProps {
  key: string
  // eslint-disable-next-line no-unused-vars
  success?: Function // 失败回调
  // eslint-disable-next-line no-unused-vars
  fail?: Function // 失败回调
}

export interface setStorageProps {
  key: string
  value: any
  // eslint-disable-next-line no-unused-vars
  success?: Function // 失败回调 
  // eslint-disable-next-line no-unused-vars
  fail?: Function // 失败回调
  expires?: Date
  level?: number // 存储级别，Interger类型，0 - 内存【默认】，1 - 设备，2 - 云端【11】
}

export interface nativeStorageProps {
  level?: number // 存储级别，Interger类型，0 - 内存【默认】，1 - 设备，2 - 云端【11】
  // eslint-disable-next-line no-unused-vars
  fail?: Function // 失败回调
  expires?: Date
}

export function serialize(val: object) {
  return JSON.stringify(val)
}

export function deserialize(val: object) {
  if (typeof val !== 'string') {
    return undefined
  }
  try {
    return JSON.parse(val)
  } catch (e) {
    return val || undefined
  }
}

const localStorage = {
  storage: window.localStorage,
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
    this.storage.setItem(key, serialize(val))

    if (success) {
      success(value)
    }
    // eslint-disable-next-line consistent-return
    return Promise.resolve(val)
  },

  getStorage(params: getStorageProps): any {
    const { key, success } = params
    if (!key || this.disabled) {
      return undefined
    }
    let value = deserialize(this.storage.getItem(key))

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

    return Promise.resolve(value)
  },

  clearStorage(params: clearStorageProps) {
    const { key, success } = params

    if (!key) {
      return
    }

    if (success) {
      success()
    }
    this.storage.removeItem(key)
  },

  clearAllStorage() {
    this.storage.clearAllStorage()
  },
}

export default localStorage
