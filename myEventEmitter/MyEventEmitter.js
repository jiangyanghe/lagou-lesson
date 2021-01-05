class MyEventEmitter {
  constructor(excutor) {
    // eventMap 用来存储事件和监听函数之前的关系
    this.eventMap = {};
  }

  on(type, handel) {
    if (!(handel instanceof Function)) {
      throw new Error('请传一个函数');
    }

    // 如果队列不存在
    if (!this.eventMap[type]) {
      // 创建队列
      this.eventMap[type] = [];
    }

    this.eventMap[type].push(handel);
  }

  emit(type, params) {
    const typeArr = this.eventMap[type];
    if (typeArr && params.length > 0) {
      typeArr.forEach(handler => {
        handler(params);
      })
    }
  }

  off(type) {
    this.eventMap[type] = [];
  }
}

module.exports = MyEventEmitter;
