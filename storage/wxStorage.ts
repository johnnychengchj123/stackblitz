import { OptionsProps } from './localStorage';

const canUseWxSDK = typeof window !== 'undefined' && (window as any).wx;

const store = {
  storage: (window as any).wx || {},
  disabled: false,
  set(key: string, val: any, options: OptionsProps = {}): any {
    let value = val;
    if (!key || this.disabled || !canUseWxSDK) {
      return;
    }
    if (value === undefined) {
      this.remove(key);
      return;
    }
    const { expires } = options;

    if (expires) {
      value = {
        value,
        expires,
        timestamp: +new Date()
      };
    }
    try {
      this.storage.setStorageSync(key, value);
    } catch (e) {
      // continue regardless of error
    }
    // eslint-disable-next-line consistent-return
    return value;
  },

  get(key: string, def?: any): any {
    if (!key || this.disabled || !canUseWxSDK) {
      return;
    }
    let value = null;
    try {
      value = this.storage.getStorageSync(key);
      if (value && value.expires) {
        // 值已经过期
        if (value.timestamp + value.expires * 1000 < new Date()) {
          this.remove(key);
          value = '';
        } else {
          // 值没有过期
          value = value.value;
        }
      }
    } catch (e) {
      // continue regardless of error
    }
    // eslint-disable-next-line consistent-return
    return value || def;
  },

  has(key: string) {
    if (!key || this.disabled || !canUseWxSDK) {
      return false;
    }
    const val = this.get(key);
    return !!val;
  },

  remove(key: string) {
    if (!key || this.disabled || !canUseWxSDK) {
      return;
    }
    try {
      this.storage.removeStorageSync(key);
    } catch (e) {
      // continue regardless of error
    }
  },

  clear() {
    if (this.disabled || !canUseWxSDK) {
      return;
    }
    try {
      this.storage.clearStorageSync();
    } catch (e) {
      // continue regardless of error
    }
  }
};
// 测试是否方法可用，不可用直接disabled
try {
  const testKey = '__storejs__';
  store.set(testKey, testKey);
  if (store.get(testKey) !== testKey) {
    store.disabled = true;
  }
  store.remove(testKey);
} catch (e) {
  store.disabled = true;
}
export default store;
