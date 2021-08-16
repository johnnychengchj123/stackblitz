import { OptionsProps } from './localStorage'

function decode(s: string) {
  return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
}

const store = {
  storage: document.cookie,
  disabled: false,
  set(key: string, value: string, options: OptionsProps = {}): any {
    if (!key || this.disabled) {
      return
    }
    if (value === undefined) {
      this.remove(key)
      return
    }
    const { expires } = options
    let expiresStr = this.get('expires')
    if (expires instanceof Date) {
      expiresStr = expires.toUTCString()
    }
    const domain = window.location.host.substr(window.location.host.indexOf('.'))
    this.storage = `${key}=${escape(value)}; path=/; domain=${domain};  expires=${expiresStr}`
  },

  get(key: string, def?: any): any {
    if (!key || this.disabled) {
      return
    }
    const jar = {} as any
    const cookies = this.storage ? this.storage.split('; ') : []
    for (let i = 0; i < cookies.length; i += 1) {
      const parts = cookies[i].split('=')
      let cookie = parts.slice(1).join('=')

      if (cookie.charAt(0) === '"') {
        cookie = cookie.slice(1, -1)
      }

      try {
        const name = decode(parts[0])
        cookie = decode(cookie)
        jar[name] = cookie
        if (key === name) {
          break
        }
      } catch (e) {
        console.log(e)
      }
    }

    // eslint-disable-next-line consistent-return
    return jar[key] || def
  },

  has(key: string) {
    if (this.disabled) {
      return false
    }
    const val = this.get(key)
    return !!val
  },

  remove(key: string) {
    if (this.disabled) {
      return
    }
    const expires = new Date()
    expires.setTime(expires.getTime() - 1)
    const domain = window.location.host.substr(window.location.host.indexOf('.'))
    this.storage = `${key}=; expires=${expires.toGMTString()}; domain=${domain}; path=/`
  },

  clear() {
    if (this.disabled) {
      return
    }
    const cookies = this.storage.split(';')
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      this.storage = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    }

    if (cookies.length > 0) {
      for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        const domain = window.location.host.substr(window.location.host.indexOf('.'))
        this.storage = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`
      }
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
