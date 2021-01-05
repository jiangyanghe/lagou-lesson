## 理解事件的发布-订阅机制
```
/**
* 通过调用 addEventListener 方法，我们可以创建一个事件监听器，这个动作就是“订阅”
* useCapture 默认值 false 事件句柄在冒泡阶段执行 true - 事件句柄在捕获阶段执行
*/

target.addEventListener(type, listener, useCapture);

// 当 click 事件被触发时，事件会被“发布”出去，进而触发监听这个事件的 func 函数。这就是一个最简单的发布-订阅案例。

el.addEventListener("click", func, false);
```

使用发布-订阅模式的优点在于，监听事件的位置和触发事件的位置是不受限的，就算相隔十万八千里，只要它们在同一个上下文里，就能够彼此感知。这个特性，太适合用来应对“任意组件通信”这种场景了。

## 发布-订阅模型 API 设计思路
通过前面的讲解，不难看出发布-订阅模式中有两个关键的动作：事件的监听（订阅）和事件的触发（发布），这两个动作自然而然地对应着两个基本的 API 方法。

on()：负责注册事件的监听器，指定事件触发时的回调函数。

emit()：负责触发事件，可以通过传参使其在触发的时候携带数据 。

最后，只进不出总是不太合理的，我们还要考虑一个 off() 方法，必要的时候用它来删除用不到的监听器：

off()：负责监听器的删除

## Contenxt API
Context API 有 3 个关键的要素：React.createContext、Provider、Consumer。

```
const AppContext = React.createContext(defaultValue)
const { Provider, Consumer } = AppContext

<Provider value={title: this.state.title, content: this.state.content}>
  <Title />
  <Content />
 </Provider>

 <Consumer>
  {value => <div>{value.title}</div>}
</Consumer>

```