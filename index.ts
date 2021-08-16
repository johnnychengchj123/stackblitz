// Import stylesheets
import './style.css';
import { localStorage } from './test/index';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
function test() {
  console.log('test', localStorage);
  localStorage.set('aaa', 'aaa');
}
appDiv.innerHTML = `<h1>TypeScript Starter
<button onclick="test()">11111</button>
</h1>`;

setTimeout(() => {
  test();
}, 1000);
