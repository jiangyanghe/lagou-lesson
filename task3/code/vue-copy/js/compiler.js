class Compiler {
  constructor (vm) {
    this.el = vm.$el
    this.vm = vm

    this.compile(this.el)
  }

  // 编译模板， 处理文本节点和元素节点
  compile (el) {
    let childNodes = el.childNodes

    Array.from(childNodes).forEach(node => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node)
      }

      // 判断 node 是否有子节点，有，则递归调用 compile
      if (node.childNodes && node.childNodes.length !== 0) {
        this.compile(node)
      }
    })
  }

  // 编译元素节点，处理指令
  compileElement (node) {
    // 遍历所有属性节点，判断是否为指令
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // v-text --> text
        attrName = attrName.substr(2)
        let key = attr.value

        // 判断指令是否为绑定事件指令
        if (this.isEventDirective(attrName)){
          this.bindEvent.call(this, node, attrName, key)
          return
        }

        this.updated(node, key, attrName)
      }
    })
  }
  
  updated (node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }
  // 处理 v-html 指令
  htmlUpdater (node, value, key) {
    node.innerHTML = value

    new Watcher(this.vm, key, (newValue) => {
      console.log(newValue)
      node.innerHTML = newValue
    })
  }
  // 处理 v-text 指令
  textUpdater (node, value, key) {
    node.textContent = value

    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }
  // 处理 v-model 指令
  modelUpdater (node, value, key) {
    node.value = value

    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })

    // 实现双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 处理 v-on 指令的事件绑定
  bindEvent(node, attrName, key) {
    const eventName = attrName.substr(3)
    const fn = this.vm.$options.methods && this.vm.$options.methods[key]
    fn && node.addEventListener(eventName, fn.bind(this.vm))
  }

  // 编译文本节点，处理插值表达式
  compileText (node) {
    // console.dir(node)
    // 正则匹配插值
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      // 创建 Watcher 对象，当数据改变时更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }

  // 判断元素属性是否为指令
  isDirective (attrName) {
    return attrName.startsWith('v-')
  }
  // 判断指令是否为绑定事件的指令，即 v-on
  isEventDirective(attrName) {
    return attrName.startsWith('on')
  }

  // 判断是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3
  }

  // 判断是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1
  }
}