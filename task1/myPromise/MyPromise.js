class MyPromise{
  constructor(excutor){
    this.value = '';
    this.reason = '';
    this.status = 'padding'
    this.onFulfilledCallback = []
    this.onRejectedCallback = []
    let resolve = (value)=>{
      if (this.status == 'padding') {
        this.status = 'fulfilled'
        this.value = value
        this.onFulfilledCallback.forEach(fn=>{
          fn()
        })
      }
    };
    let reject = (reason)=>{
      if (this.status == 'padding') {
        this.status = 'rejected'
        this.reason = reason
        this.onRejectedCallback.forEach(fn=>{
          fn()
        })
      }
    };
    /*1. 当发生异常是捕获异常 */
    try{
      excutor(resolve,reject)
    }catch (e){
      reject(e)
    }

  }
  then(onFulfilled,onRejected){
    //4.防止使用者不传成功或失败回调函数，所以成功失败回调都给了默认回调函数
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };
    let newPromise;
    if(this.status == 'fulfilled'){
      return newPromise = new MyPromise((resolve,reject)=>{
        setTimeout(()=>{
          try{
            let x = onFulfilled(this.value)
            this.resolvePromise(newPromise, x, resolve, reject);
          }catch (e){
            reject(e)
          }
        })

      })

    }
    if(this.status == 'rejected'){
      return newPromise = new MyPromise((resolve,reject)=>{
        setTimeout(()=>{
          try{
            let x = onRejected(this.reason)
            this.resolvePromise(newPromise, x, resolve, reject);
          }catch (e){
            reject(e)
          }
        })

      })

    }
    if(this.status == 'padding'){
      return newPromise = new MyPromise((resolve,reject)=> {
        this.onFulfilledCallback.push(() => {
          setTimeout(()=> {
            try {
              let x = onFulfilled(this.value)
              this.resolvePromise(newPromise, x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallback.push(() => {
          setTimeout(()=> {
            try {
              let x = onRejected(this.reason)
              this.resolvePromise(newPromise, x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          })
        })
      })
    }
  }
  catch(onRejected){
    this.then(null,onRejected)
  }
  resolvePromise(newPromise,x,resolve,reject){
    if (newPromise === x) {
      return reject(new TypeError('Circular reference'));
    }
    let called = false;
    if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
      try{
        let then = x.then;
        if (typeof then === 'function') {
          then.call(x, y => {
            if (called) return;
            called = true;
            this.resolvePromise(newPromise, y, resolve, reject);
          }, error => {
            if (called) return;
            called = true;
            reject(error);
          })
        } else {
          resolve(x);
        }
      }catch(e){
        if (called) return;
        called = true;
        reject(e);
      }

    }else {
      resolve(x)
    }
  }

}
module.exports = MyPromise


