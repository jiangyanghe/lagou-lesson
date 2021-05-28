class Watcher {
  constructor (vm, key ,cb) {
    this.vm = vm  // Vue 实例
    this.key = key // 属性名称
    this.cb = cb  // 回调函数，负责更新视图

    // 将 watcher 对象记录到 Dep 类的静态属性 target 中
    Dep.target = this

    // vm[key] 触发 get 方法，在其中会调用 addSub
    this.oldValue = vm[key]

    Dep.target = null
  }

  // 数据发生变化时，更新视图
  update() {
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) {
      return
    }

    this.cb(newValue)
  }
}