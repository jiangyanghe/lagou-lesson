let _Vue = null
export default class VueRouter {
  static install (Vue, params) {
    // 判断是否已经安装 VueRouter 插件
    if (VueRouter.install.installed) return
    VueRouter.install.installed = true

    // 全局保存 Vue 的构造函数
    _Vue = Vue

    // 把创建 Vue 实例时传入的 router 对象放在 Vue 原型上
    // 以实现在 Vue 实例、组件中都能使用 this.$router
    _Vue.mixin({
      beforeCreate () {
        // 判断是 Vue 实例还是组件，Vue 实例才有 $options.router
        if (this.$options.router) {
          // 这里的 this 指向了当前 Vue 实例
          _Vue.prototype.$router = this.$options.router
          // 调用 router 对象的 init 方法，进行路由的初始化
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    this.options = options
    this.routerMap = {}
    this.mode = options.mode
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init () {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  createRouteMap () {
    this.options.routes.forEach(route => {
      this.routerMap[route.path] = route.component
    })
  }

  initComponents (Vue) {
    const self = this
    Vue.component('router-link', {
      props: {
        to: String
      },
      render (h) {
        return h('a', {
          attrs: {
            href: self.mode === 'hash' ? '#' + this.to : this.to
          },
          on: { // 给 a 标签注册事件
            click: this.handleClick
          }
        }, [this.$slots.default])
      },
      methods: {
        handleClick (e) {
          // hash 模式下，a 标签改变地址栏，但不会触发页面加载请求
          // 只有 history 模式，才需阻止 a 标签的默认行为
          // 并通过 history.pushState 修改地址栏，然后触发 popstate
          if (self.mode !== 'hash') {
            e.preventDefault() // 阻止 a 标签的默认行为
            history.pushState({}, '', this.to)
          }
          // 修改当前组件的路径标识
          this.$router.data.current = this.to
        }
      }
    })

    Vue.component('router-view', {
      render (h) {
        const component = self.routerMap[self.data.current]
        return h(component)
      }
    })
  }

  initEvent () {
    // 为 hash、history 模式分别设置监听地址栏变化事件，从而加重目标组件
    if (this.mode !== 'hash') {
      window.addEventListener('popstate', () => {
        this.data.current = window.location.pathname
      })
    } else {
      window.addEventListener('load', () => {
        this.data.current = window.location.hash.slice(1)
        if (!this.data.current) {
          this.data.current = '/'
          window.location.hash = '#/'
        }
      })
      window.addEventListener('hashchange', () => {
        this.data.current = window.location.hash.slice(1)
      })
    }
  }
}
