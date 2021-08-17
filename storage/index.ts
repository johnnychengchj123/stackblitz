/**
 * 本地存储实现,封装localStorage和sessionStorage
 */
import localStorageApi from './localStorage';
import sessionStorageApi from './sessionStorage';
import cookieStorageApi from './cookieStorage';
import nativeStorageApi from './nativeStorage';

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
  clear() {}
};
export const localStorage = localStorageApi;
export const sessionStorage = sessionStorageApi;
export const cookieStorage = cookieStorageApi;
export const nativeStorage = nativeStorageApi;

export default sessionStorage;
