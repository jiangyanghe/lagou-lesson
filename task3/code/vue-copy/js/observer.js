// 负责数据劫持
// 把 $data 中的成员转换成 getter/setter
class Observer {
  constructor (data) {
    this.walk(data)
  }

  walk (data) {
    // 1. 判断数据是否是对象，如果不是对象返回
    // 2. 如果是对象，遍历对象的所有属性，设置为 getter/setter
    if (!data || typeof data !== 'object') {
      return
    }

    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  // 定义响应式成员
  defineReactive (obj, key, val) {
    const self = this
    // 收集依赖，发送通知
    let dep = new Dep()

    // 如果 val 是对象，继续设置它下面的成员为响应式数据
    self.walk(val)

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,

      // obj 是传入的 $data
      // $data 引用了 get 方法
      // 即外部 $data 对 defineReactive 内部的 get 有引用，因此产生闭包
      // get 中又使用了局部变量 val，所以没有释放 defineReactive 的局部变量 val，从而拓展了 val 的作用域
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)

        return val // 若是 obj[key] 会出现循环触发 getter 形成堆栈溢出问题
      },
      set (newValue) {
        if (newValue === val) {
          return
        }
        // 如果 newValue 是对象，设置 newValue 的成员为响应式
        self.walk(newValue)
        val = newValue

        // 发送通知
        dep.notify()
      }
    })
  }
}