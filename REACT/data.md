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