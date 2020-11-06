/**
 * Q1: 在class中使用resolve，reject使用箭头函数， then使用普通函数有什么区别？
 * 
 * Q2: successCallBack传递不是很懂
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(aaa) {
    aaa(this.resolve, this.reject);
  }

  status = PENDING;
  value = undefined;
  reason = undefined;

  successCallBack = undefined;
  failCallBack = undefined;

  resolve = (value) => {
    if (this.status !== PENDING) return;
    this.status = FULFILLED;

    this.value = value;

    // 成功是否存在
    this.successCallBack && this.successCallBack(this.value);
  }

  reject = (reason) => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;

    this.reason = reason;

    // 失败是否存在
    this.failCallBack && this.failCallBack(this.reason);
  }

  then = (successCallBack, failCallBack) => {
    console.log('then===', successCallBack, this.value);
    if (this.status === FULFILLED) {
      successCallBack(this.value);
    } else if (this.status === REJECTED) {
      failCallBack(this.reason);
    } else {
      // pending 状态
      this.successCallBack = successCallBack;
      this.failCallBack = failCallBack;
    }
  }
}

module.exports = MyPromise;
