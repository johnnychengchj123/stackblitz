import { getStorageProps, setStorageProps, clearStorageProps } from './localStorage'

function decode(s: string) {
  return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
}

const store = {
  storage: document.cookie,
  setStorage(params: setStorageProps): any {
    const { key, value, expires, success, fail } = params

    if (!key) {
      if (fail) {
        fail('key为必传值')
      }
      return Promise.reject()
    }

    if (value === undefined) {
      this.clearStorage({ key })
      if (success) {
        success(undefined)
      }
      return Promise.resolve()
    }
    let expiresStr = this.getStorage({ key: 'expires' })
    if (expires instanceof Date) {
      expiresStr = expires.toUTCString()
    }
    const domain = window.location.host.substr(window.location.host.indexOf('.'))
    document.cookie = `${key}=${escape(value)}; path=/; domain=${domain};  ${expires && `expires=${expiresStr}`}`
    if (success) {
      success(value)
    }
    // eslint-disable-next-line consistent-return
    return Promise.resolve(value)
  },

  getStorage(params: getStorageProps): any {
    const { key, success } = params

    if (!key) {
      return
    }
    const jar = {} as any
    const cookies = document.cookie ? document.cookie.split('; ') : []
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
    if (success) {
      success(jar[key])
    }

    // eslint-disable-next-line consistent-return
    return Promise.resolve(jar[key])
  },

  has(key: string) {
    const val = this.getStorage({ key })
    return Promise.resolve(!!val)
  },

  clearStorage(params: clearStorageProps) {
    const { key, success } = params
    const expires = new Date()
    expires.setTime(expires.getTime() - 1)
    const domain = window.location.host.substr(window.location.host.indexOf('.'))
    document.cookie = `${key}=; expires=${expires.toGMTString()}; domain=${domain}; path=/`

    if (success) {
      success()
    }
  },

  clearAllStorage() {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    }

    if (cookies.length > 0) {
      for (let i = 0; i < cookies.length; i += 1) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        const domain = window.location.host.substr(window.location.host.indexOf('.'))
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`
      }
    }
  },
}

export default store
