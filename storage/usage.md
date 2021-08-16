# storage
a storage lib which support storage with the same api

```

## Usage

```
 import { localStorage, sessionStorage, nativeStorage, cookieStorage, wxStorage } from './storage'
 
 // localStorage
 localStorage.set(key,val) 
 localStorage.get(key, def)
 
 // sessionStorage
 sessionStorage.set(key, val)
 sessionStorage.get(key, val)
 
```

## API

#### set(key, val)

set storage with key and val

#### get(key, def)

get storage with key, return def if not find

#### remove(key)

remove storage with key

#### has(key)

determine storage has the key

#### clear()
clear all storages