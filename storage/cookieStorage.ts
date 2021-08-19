import {
  getStorageProps,
  setStorageProps,
  clearStorageProps
} from './localStorage';

const store = {
  storage: document.cookie,
  setStorage(params: setStorageProps): any {
    const { key, value, expires, success, fail } = params;

    if (!key) {
      if (fail) {
        fail('key为必传值');
      }
      return Promise.reject();
    }

    if (value === undefined) {
      this.clearStorage({ key });
      if (success) {
        success(undefined);
      }
      return Promise.resolve();
    }
    let expiresStr = this.getStorage({ key: 'expires' });
    if (expires instanceof Date) {
      expiresStr = expires.toUTCString();
    }
    document.cookie = `${key}=${encodeURIComponent(
      JSON.stringify(value) || ''
    )}; path=/; ${expires && `expires=${expiresStr}`}`;
    console.log(
      `document.cookie = ${`${key}=${encodeURIComponent(
        JSON.stringify(value) || ''
      )}; path=/; ${expires && `expires=${expiresStr}`}`}`
    );
    if (success) {
      success(value);
    }
    // eslint-disable-next-line consistent-return
    return Promise.resolve(value);
  },

  getStorage(params: getStorageProps): any {
    const { key, success } = params;

    if (!key) {
      return;
    }
    const name = key + '=';
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const cookieStr = cookie.trim();
      if (cookieStr.indexOf(name) === 0) {
        const val = decodeURIComponent(
          cookieStr.substring(name.length, cookieStr.length)
        );
        if (success) {
          success(JSON.parse(val));
        }
        return Promise.resolve(JSON.parse(val));
      }
    }

    // eslint-disable-next-line consistent-return
    return Promise.resolve('');
  },

  clearStorage(params: clearStorageProps) {
    const { key, success } = params;

    if (typeof key !== 'string' || !key.length) {
      return;
    }
    const expires = new Date();
    expires.setTime(expires.getTime() - 1);
    document.cookie = `${key}=; expires=${expires.toUTCString()}; path=/`;

    if (success) {
      success();
    }
  }
};

export default store;
