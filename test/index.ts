/**
 * 本地存储实现,封装localStorage和sessionStorage
 */
const localStorageApi = import('./localStorage')
const sessionStorageApi = import('./sessionStorage')
const cookieStorageApi = import('./cookieStorage')
const nativeStorageApi = import('./nativeStorage')

const store = {
  /* eslint-disable no-undef */
  version: '1.1.1',
  storage: {},
  disabled: false,
  // eslint-disable-next-line no-unused-vars
  set(key: string, val: any) {},
  // eslint-disable-next-line no-unused-vars
  get(key: string, def?: any): any {},
  has() {},
  // eslint-disable-next-line no-unused-vars
  remove(key: string) {},
  clear() {},
}
export const localStorage = Object.assign(store, localStorageApi)
export const sessionStorage = Object.assign(store, sessionStorageApi)
export const cookieStorage = Object.assign(store, cookieStorageApi)
export const nativeStorage = Object.assign(store, nativeStorageApi)

export default sessionStorage
