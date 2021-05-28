class Vue {
  constructor (options) {
    // 1. 保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 2. 把 data 成员转换为 getter、setter 注入到 Vue 实例
    this._proxyData(this.$data)
    // 3. 调用 Observer 实现 $data 数据劫持
    new Observer(this.$data)

    // 4. 调用 Compiler 解析指令/插值表达式等
    new Compiler(this)
  }

  /**
   * 用于变量 data 所有属性，并转换为 getter、setter 注入到 Vue 实例
   * 这样做事便于使用 this.<属性名> 的操作来触发 data 中成员的响应式
   * @param {*} data 
   */
  _proxyData (data) {
    Object.keys(data).forEach(key => {
      // Object.defineProperty(对象，属性，属性描述)
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        // getter 获取值时执行
        get () {
          return data[key]
        },  
        // setter 设置值时执行
        set (newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}