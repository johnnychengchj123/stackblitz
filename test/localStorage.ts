/**
 * 本地存储实现,封装localStorage
 */
export interface OptionsProps {
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
  disabled: false,
  set(key: string, value: any, options: OptionsProps = {}): any {
    let val = value

    if (!key || this.disabled) {
      return
    }
    if (val === undefined) {
      this.remove(key)
      return
    }
    const { expires } = options

    if (expires) {
      val = {
        value,
        expires,
        timestamp: +new Date(),
      }
    }
    this.storage.setItem(key, serialize(val))
    // eslint-disable-next-line consistent-return
    return val
  },

  get(key: string, def?: any): any {
    if (!key || this.disabled) {
      return def
    }
    let value = deserialize(this.storage.getItem(key))

    if (value && value.expires) {
      // 值已经过期
      if (value.timestamp + value.expires * 1000 < new Date()) {
        this.remove(key)
        value = ''
      } else {
        // 值没有过期
        value = value.value
      }
    }
    return value === undefined ? def : value
  },

  has(key: string) {
    if (!key || this.disabled) {
      return false
    }
    return this.get(key) !== undefined
  },

  remove(key: string) {
    if (!key || this.disabled) {
      return
    }
    this.storage.removeItem(key)
  },

  clear() {
    if (this.disabled) {
      return
    }
    this.storage.clear()
  },
}
// 测试是否方法可用，不可用直接disabled
try {
  const testKey = '__storejs__'
  localStorage.set(testKey, testKey)
  if (localStorage.get(testKey) !== testKey) {
    localStorage.disabled = true
  }
  localStorage.remove(testKey)
} catch (e) {
  localStorage.disabled = true
}
export default localStorage
