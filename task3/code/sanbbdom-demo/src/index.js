import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

import { styleModule } from 'snabbdom/build/package/modules/style'
import { classModule } from 'snabbdom/build/package/modules/class'
import { propsModule } from 'snabbdom/build/package/modules/props'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'

const patch = init([
  styleModule, 
  classModule, 
  propsModule, 
  eventListenersModule
])

let vnode = null;
let sortBy = 'rank'

let nextKey = 11

const originalMovies = [
  { rank: 1, title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.' },
  { rank: 2, title: 'The Godfather', desc: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.' },
  { rank: 3, title: 'The Godfather: Part II', desc: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.' },
  { rank: 4, title: 'The Dark Knight', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.' },
  { rank: 5, title: 'Pulp Fiction', desc: 'The lives of two mob hit men, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.' },
  { rank: 6, title: 'Schindler\'s List', desc: 'In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.' },
  { rank: 7, title: '12 Angry Men', desc: 'A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.' },
  { rank: 8, title: 'The Good, the Bad and the Ugly', desc: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.' },
  { rank: 9, title: 'The Lord of the Rings: The Return of the King', desc: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.' },
  { rank: 10, title: 'Fight Club', desc: 'An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...' },
]
// 重新存储一份数据内容，避免页面交互时更改原始数据从而引起错误
let movies = [].concat(originalMovies)

// 初始渲染页面内容
window.addEventListener('DOMContentLoaded', () => {
  let app = document.querySelector('#app');
  vnode = patch(app, view(movies));

  render()
});

// 创建页面节点
const view = (movies) => {
  return h('div.container', [
    h('h1.page-title', 'Top 10 movies'),
    h('div.btn-warp', [
      h('div', [
        'Sort by: ',
        h('a.btn', { class: { active: sortBy === 'rank' }, on: { click: [handleSortClick, 'rank'] } }, 'Rank'),
        h('a.btn', { class: { active: sortBy === 'title' }, on: { click: [handleSortClick, 'title'] } }, 'Title'),
        h('a.btn', { class: { active: sortBy === 'desc' }, on: { click: [handleSortClick, 'desc'] } }, 'Description'),
      ]),
      h('a.btn.add', { on: { click: add } }, 'Add'),
    ]),
    h('div.list', movies.map(movieView))
  ])
}



// 创建列表节点
const movieView = (movie) => {
  return h('div.row', {
    key: movie.rank,
    style: {
      opacity: '0',
      transform: 'translateY(0px)',
      delayed: {transform: `translateY(${movie.top || 0}px)`, opacity: '1'},
      remove: {opacity: '0', transform: `translateY(${movie.top}px) translateY(${movie.top - 50}px)`}
    },
    hook: {
      // 通过 insert 钩子函数，在 VNode 生成真实 DOM 后，获取该 DOM 高度并记录在 movie.elmHeight 中
      // 用于在后续的 render() 中计算每行内容的 top 值后再次渲染到页面
      insert: (vnode) => { movie.elmHeight = vnode.elm.offsetHeight; }
    },
  }, [
    h('div', {style: {fontWeight: 'bold', width: '5%'}}, movie.rank),
    h('div', {style: {width: '30%'}}, movie.title),
    h('div', {style: {width: '65%'}}, movie.desc),
    h('div.rm-btn', {on: {click: [remove, movie]}}, 'x'),
  ]);
}


// 排序：按目标目录内容，从小到大排序
const handleSortClick = (prop) => {
  sortBy = prop

  movies.sort((a, b) => {
    if (a[prop] > b[prop]) {
      return 1
    }
    if (a[prop] < b[prop]) {
      return -1
    }
    return 0
  })
  render()
}

// 添加列表项
const add = () => {
  let m = originalMovies[Math.floor(Math.random() * 10)]
  movies = [{ rank: nextKey++, title: m.title, desc: m.desc}].concat(movies)
  // 第一次渲染创建 DOM，通过 movieView 中的 insert 钩子函数获取真实 DOM 的高度并记录在 movie.elmHeight 中
  render()
  // 第二次渲染，设置好每行的 top 值，再渲染到页面
  render()
}

// 删除一行列表
const remove = (movie) => {
  movies = movies.filter((m) => {
    return m !== movie
  })
  render()
}

const render = () => {
  // 给 movies 中的每一项确定 top 值
  movies = movies.reduce((acc, m) => {
    let last = acc[acc.length - 1];
    m.top = last ? last.top + last.elmHeight + 10 : 8;
    return acc.concat(m);
  }, []);
  vnode = patch(vnode, view(movies));
}