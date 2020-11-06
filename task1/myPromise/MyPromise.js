

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const RWJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  status = PENDING;
  value = undefined;
  reason = undefined;

  successCallBack = undefined;
  failCallBack = undefined;

  resolve = (value) => {
    if (this.tatus !== PENDING) return;
    this.status = FULFILLED;

    this.value = value;

    // 成功是否存在
    this.successCallBack && this.successCallBack(this.value);
  }

  reject = (reason) => {
    if (this.status !== PENDING) return;
    this.status = RWJECTED;

    this.reason = reason;

    // 失败是否存在
    this.failCallBack && this.failCallBack(this.reason);
  }

  then(successCallBack, failCallBack) {
    if (this.status === FULFILLED) {
      successCallBack(this.value);
    } else if (this.status === RWJECTED) {
      failCallBack(this.reason);
    } else {
      // pending 状态
      this.successCallBack = successCallBack;
      this.failCallBack = failCallBack;
    }
  }
}

module.exports = MyPromise;
