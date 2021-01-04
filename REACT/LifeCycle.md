# react 生命周期
虚拟 DOM、组件化，倘若把这两块知识整合一下，你就会发现这两个概念似乎都在围着 render 这个生命周期打转：虚拟 DOM 自然不必多说，它的生成都要仰仗 render；而组件化概念中所提及的“渲染工作流”，这里指的是从组件数据改变到组件实际更新发生的过程，这个过程的实现同样离不开 render。

由此看来，render 方法在整个组件生命周期中确实举足轻重，它担得起“灵魂”这个有分量的比喻。那么如果将 render 方法比作组件的“灵魂”，render 之外的生命周期方法就完全可以理解为是组件的“躯干”。

## react 15 生命周期

constructor()
componentWillReceiveProps()
shouldComponentUpdate()
componentWillMount()
componentWillUpdate()
componentDidUpdate()
componentDidMount()
render()
componentWillUnmount()

<img src="./assets/lifeCycle15.png">

1, componentWillMount 周期
2，componentWillReceiProps 到底是由什么触发的？——componentReceiveProps 并不是由 props 的变化触发的，而是由父组件的更新触发的
<br>

先来说说 componentWillUpdate 和 componentDidUpdate 

componentWillUpdate 会在 render 前被触发，它和 componentWillMount 类似，允许你在里面做一些不涉及真实 DOM 操作的准备工作；而 componentDidUpdate 则在组件更新完毕后被触发，和 componentDidMount 类似，这个生命周期也经常被用来处理 DOM 操作。此外，我们也常常将 componentDidUpdate 的执行作为子组件更新完毕的标志通知到父组件。

shouldComponentUpdate——为了避免不必要的 render 操作带来的性能开销，React 为我们提供了 shouldComponentUpdate 这个口子。shouldComponentUpdate 的默认值为 true，也就是说“无条件 re-render”。在实际的开发中，我们往往通过手动往 shouldComponentUpdate 中填充判定逻辑，或者直接在项目中引入 PureComponent 等最佳实践，来实现“有条件的 re-render”。

componentWillUnmount() 触发时机
* 组件在父组件中被移除了：这种情况相对比较直观，对应的就是我们上图描述的这个过程。

* 组件中设置了 key 属性，父组件在 render 的过程中，发现 key 值和上一次不一致，那么这个组件就会被干掉。
