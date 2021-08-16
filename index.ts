// Import stylesheets
import './style.css';
import { localStorage } from './storage/index';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');

function testStorage() {
  const stoarge = localStorage;
  stoarge.set('string', 'string');
  stoarge.set('boolean', true);
  stoarge.set('number', 11);
  stoarge.set('null', null);
  stoarge.set('undefined', undefined);
  stoarge.set('array', ['a', 'b']);
  stoarge.set('object', { a: 1 });

  console.log(`string-${stoarge.get('string')}`);
  console.log(`boolean-${stoarge.get('boolean')}`);
  console.log(`number-${stoarge.get('number')}`);
  console.log(`null-${stoarge.get('null')}`);
  console.log(`undefined-${stoarge.get('undefined')}`);
  console.log(`array-${JSON.stringify(stoarge.get('array'))}`);
  console.log(`object-${JSON.stringify(stoarge.get('object'))}`);

  // has
  console.log(`has-${stoarge.has('object')}`);
  console.log(`no-has-${stoarge.has('object1')}`);

  // remove
  setTimeout(() => {
    stoarge.remove('object');
  }, 2000);

  // clear
  setTimeout(() => {
    // stoarge.clear();
  }, 5000);
}

appDiv.innerHTML = `<h1>TypeScript Starter
<button onclick="test()">11111</button>
</h1>`;

setTimeout(() => {
  testStorage();
}, 1000);
