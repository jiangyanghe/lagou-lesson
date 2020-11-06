const MyPromise = require('./MyPromise');
let promise = new MyPromise((resolve, reject) => {
  // setTimeout(() => {resolve('成功');}, 2000)
  setTimeout(() => {reject('失败');}, 2000)
  // reject('失败')
})

promise.then(
  (value) => {
    console.log(value)
  }, 
  (reason) => {
    console.log(reason)
  }
);