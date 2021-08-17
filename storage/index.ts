/**
 * 本地存储实现,封装localStorage和sessionStorage
 */
import localStorageApi from './localStorage'
import sessionStorageApi from './sessionStorage'
import cookieStorageApi from './cookieStorage'
import nativeStorageApi from './nativeStorage'
import wxStorageApi from './wxStorage'

const store = {
  /* eslint-disable no-undef */
  version: '1.1.1',
  storage: {},
  // eslint-disable-next-line no-unused-vars
  setStorage(key: string, val: any) {},
  // eslint-disable-next-line no-unused-vars
  getStorage(key: string, def?: any): any {},
  has() {},
  // eslint-disable-next-line no-unused-vars
  clearStorage(key: string) {},
  clearAllStorage() {},
}
export const localStorage = localStorageApi
export const sessionStorage = sessionStorageApi
export const cookieStorage = cookieStorageApi
export const nativeStorage = nativeStorageApi
export const wxStorage = wxStorageApi

export default sessionStorage
