# 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程
* 初始化参数，即通过命令行(或者配置文件)中的参数进行合并，得到最终打包命令的最后参数

* 开始编译：通过前面的参数初始化一个Compiler对象，并加载我们所需要的所有的loader，并执行Compiler对象的run方法来执行编译过程

* 确定入口：通过webpack.config.js中的entry(或者我们自己在命令行中指定)，找到我们的入口文件

* 编译模块：通过我们刚才的入口文件进行递归，找到每个模块的依赖，并调用我们指定的loader进行编译，直到所有依赖都被编译完成

* 完成模块编译：得到了每个模块最后编译的结果已经他们之间的依赖关系

* 输出资源：这一步是把我们刚才得到的文件通过他们之间的依赖关系来组成一个一个的chunk，再把每个chunk输出到文件上（这也是最后可以对输出内容进行更改的地方）

* 输出完成：根据配置确定输出的路径和文件名，把文件内容写入到文件中

# 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路
loader 用于对模块的源代码进行转换，在加载资源的时候预处理文件；是一个Node.js 的模块
Plugin 用于解决loader目前无法实现的其他事，是一个具有apply方法的JavaScript对象

loader 的开发思路就是一个node包的开发，支持链式调用
```
  module.exports = (source) => {
    // source 的一些处理操作，写法和node写法相似
    return source;
  }
```

plugin的开发是基于webpack在各个环节中埋下了hook;
```
class MyPlugin{

  // 传入相应的配置信息
  constructor(options){

  }

  // 将Compiler对象传递进来
  // 然后通过这个对象来注册钩子函数
  apply(compiler){
    // 注册emit钩子方法
    // compilation是一个上下文,
    compiler.hooks.emit.tap("MyPlugin",compilation=>{
      //在这里执行我们的方法来修改内容
    })
  }
}
```


  