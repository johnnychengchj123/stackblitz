// Import stylesheets
import './style.css';
import { localStorage } from './storage/index';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');

function testStorage() {
  const stoarge = localStorage;
  console.log('stoarge11', stoarge);

  stoarge.setStorage({
    key: 'string',
    value: 'string'
  });
  stoarge.setStorage({
    key: 'boolean',
    value: true
  });
  stoarge.setStorage({
    key: 'number',
    value: 11
  });
  stoarge.setStorage({
    key: 'null',
    value: null
  });
  stoarge.setStorage({
    key: 'undefined',
    value: undefined
  });
  stoarge.setStorage({
    key: 'array',
    value: ['a', 'b']
  });
  stoarge.setStorage({
    key: 'object',
    value: { a: 1 }
  });
  // get
  stoarge.getStorage({
    key: 'string',
    success: (result) => {
      return console.log('string: ', result);
    }
  })
  stoarge.getStorage({
    key: 'boolean',
    success: (result) => {
      return console.log('boolean: ', result);
    }
  })
  stoarge.getStorage({
    key: 'number',
    success: (result) => {
      return console.log('number: ', result);
    }
  })
  stoarge.getStorage({
    key: 'null',
    success: (result) => {
      return console.log('null: ', result);
    }
  })
  stoarge.getStorage({
    key: 'undefined',
    success: (result) => {
      return console.log('undefined: ', result);
    }
  })
  stoarge.getStorage({
    key: 'array',
    success: (result) => {
      return console.log('array: ', result);
    }
  })
  stoarge.getStorage({
    key: 'object',
    success: (result) => {
      return console.log('object: ', result);
    }
  })
  // remove
  setTimeout(() => {
    stoarge.clearStorage({
      key: 'object'
    });
  }, 2000);

  // clear
  setTimeout(() => {
    stoarge.clearAllStorage();
  }, 5000);
}

appDiv.innerHTML = `<h1>TypeScript Starter
<button onclick="test()">11111</button>
</h1>`;

setTimeout(() => {
  testStorage();
}, 1000);
