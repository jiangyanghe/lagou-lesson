一、简答题
1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。

```
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```

答：给 data 新增加的成员并不是响应式数据；

Vue 的 data 中的成员实现响应式数据，是在创建 Vue 实例，将传入构造函数的 data 存放在实例的 data中，然后遍历data 的成员，利用 Object.defineProperty 它们转换成 getter/setter 并定义在 Vue 实例上（这是方便于在实例中使用 this.<成员名> 的操作来触发真正的响应式变化）

然后调用 observer 实现对 data数据劫持。observer对每个成员通过Object.defineProperty将该成员转化为getter/setter并定义在该成员上，真正的响应式就发生在这里。又因为Vue使用的是观察者模式，因此在data 的成员的 getter 中会收集该成员的所有观察者（收集依赖），在 setter 中发发送通知以触发观察者的 update 方法。

经过以上对传入 Vue 构造函数的 data 的加工，就实现了对 data 成员变成了响应式数据。而之后给 data 动态新增的成员，并没有经过以上步骤，所以不是响应式数据。

若要将新增成员设置成响应式数据可使用 Vue 官方提供的 Vue.observable(object) 方法：this.dog = Vue.observable({ name: 'Trump' })。

Vue.observable 原理如上述的使用 observer 的过程，实际就是对 observe 进行了封装。


2、请简述 Diff 算法的执行过程
diff 是找 同级别 的 子节点 依次比较，然后再找下一级别的节点比较。

首先在进行同级别节点比较的时候，首先会对新旧节点数组的 开始 和 结尾 节点设置标记索引，遍历的过程中移动索引；索引标记为：

oldStartIdx/ newStartIdx(旧开始节点索引 / 新开始节点索引)
oldEndIdx/ newEndIdx(旧结束节点索引 / 新结束节点索引)
对应的节点为：

oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)

**开始 ** 和 结尾 点的比较依次按下面步骤进行

如果 oldStartVnode 和 newStartVnode 是 sameVnode (key 和 sel 相同)，调用 patchVnode() 对比和更新节点，把 旧开始 和 新开始 索引往后移动 oldStartIdx++ / newStartIdx++，进入下一个循环；若不同，则进入下一个判断。
如果 oldEndVnode 和 newEndVnode 是 sameVnode (key 和 sel 相同)，调用 patchVnode() 对比和更新节点，把 旧结尾 和 新结尾 索引往前移动 oldEndIdx-- / newEndIdx--，进入下一个循环；若不同，则进入下一个判断。
如果 oldStartVnode 和 newEndVnode 是 sameVnode，即 旧开始节点 / 新结尾节点 相同，调用 patchVnode() 对比和更新节点，把 oldStartVnode 对应的 DOM 元素移动到当前标记的 oldEndVnode 对应的 DOM 元素的后面，然后更新索引 oldStartIdx++ / newEndIdx--，进入下一个循环；不同，则进入下一个判断。
如果 oldEndVnode 和 newStartVnode 是 sameVnode，即 旧结束节点 / 新开始节点 相同，调用 patchVnode() 对比和更新节点，把 oldEndVnode 对应的 DOM 元素移动到当前标记的 oldStartVnode 对应的 DOM 元素的前面，然后更新索引 oldEndIdx-- / newStartIdx++，进入下一个循环；不同，则进入下一步。

如果首尾标记节点对比都不通过，则进入如下步骤：

使用当前标记的 newStartVnode 的 key 在 旧节点 数组中找相同节点。
如果没有找到，说明 newStartVnode 是新增节点，则用 newStartVnode 创建新的 DOM 元素，插入到当前标记的 oldStartVnode 对应的 DOM 元素之前，newStartIdx++ ，进入下一个循环。
如果找到了，则判断 新节点 和找到的 旧节点 的 sel 选择器是否相同
如果相同，调用 patchVnode() 对比和更新节点，把找到的 旧节点 对应的 DOM 元素，移动到当前标记的 oldStartVnode 对应的 DOM 元素的前面， newStartIdx++ ，进入下一个循环。
如果不相同，说明节点被修改了，则用 newStartVnode 创建新的 DOM 元素，插入到当前标记的 oldStartVnode 对应的 DOM 元素之前，newStartIdx++ ，进入下一个循环。

同级对比循环结束时会有两种情况 旧节点的所有子节点先遍历完(oldStartIdx > oldEndIdx)、新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，此时需要对新旧节点数组进行后续处理：

如果旧节点的数组先遍历完(oldStartIdx > oldEndIdx)，说明新节点有剩余且是新创建的 Vnode，则用这些剩余节点创建新的 DOM元素，并批量插入到当前所标记的 newEndVnode 之后的 Vnode（即标识索引为 newEndIdx+1）所对应的 DOM 元素之前，若不存在该 Vnode，则相当于插入到末尾。
如果新节点的数组先遍历完(newStartIdx > newEndIdx)，说明旧节点中有多余，这直接把多余节点批量删除。