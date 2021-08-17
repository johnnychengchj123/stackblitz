import localStorageTools, { OptionsProps } from './localStorage';

const inBrowser = typeof window !== 'undefined';

const virtualStorage = {
  storage: {},
  disabled: false,
  set(key: string, value: any, options: OptionsProps = {}): any {
    let val = value;

    if (!key || this.disabled) {
      return;
    }
    if (val === undefined) {
      this.remove(key);
      return;
    }
    const { expires } = options;

    if (expires) {
      val = {
        value,
        expires,
        timestamp: +new Date()
      };
    }
    this.storage[key] = val;
    // eslint-disable-next-line consistent-return
    return val;
  },

  get(key: string, def?: any): any {
    if (!key || this.disabled) {
      return def;
    }
    let val;
    const target = this.storage;
    // eslint-disable-next-line no-prototype-builtins
    if (target.hasOwnProperty(key)) {
      val = target[key];
    }
    if (val && val.expires) {
      // 值已经过期
      if (val.timestamp + val.expires * 1000 < new Date()) {
        this.remove(key);
        val = '';
      } else {
        // 值没有过期
        val = val.value;
      }
    }
    return val === undefined ? def : val;
  },

  has(key: string) {
    if (!key || this.disabled) {
      return false;
    }
    // eslint-disable-next-line no-prototype-builtins
    return this.storage.hasOwnProperty(key);
  },

  remove(key: string) {
    if (!key || this.disabled) {
      return;
    }
    const target = this.storage;
    // eslint-disable-next-line no-prototype-builtins
    if (target.hasOwnProperty(key)) {
      delete target[key];
    }
  },

  clear() {
    if (this.disabled) {
      return;
    }
    this.storage = {};
  }
};

export default (inBrowser
  ? Object.assign(localStorageTools, {
      storage: window.sessionStorage
    })
  : virtualStorage);
