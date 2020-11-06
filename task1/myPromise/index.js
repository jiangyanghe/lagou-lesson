/**
 * 手写promise
 * S1 new Promise((resolve, reject) => {})
 * 
 * S2 resolve((value) => {successCallBack(value)})
 *    reject((reason) => {failCallBack(reason)})
 */
const MyPromise = require('./MyPromise');
let promise = new MyPromise((resolve, reject) => {
  // resolve('成功');
  setTimeout(() => {resolve('成功');}, 2000)
  // setTimeout(() => {reject('失败');}, 2000)
  // reject('失败');
})
.then(
  (value) => {
    console.log(value)
  }, 
  (reason) => {
    console.log(reason)
  }
);

// console.log(promise.resolve);
// console.log(promise.then);
// console.log(Object.getPrototypeOf(promise.then), Object.getPrototypeOf(promise.resolve));
