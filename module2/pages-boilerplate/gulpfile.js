// 实现这个项目的构建任务
// 实现这个项目的构建任务

const { src, dest, parallel, series, watch } = require('gulp')
const del = require('del')
const browserSync = require('browser-sync');
const gulpLoadPlugins = require('gulp-load-plugins'); // 自动加载插件
const plugins = gulpLoadPlugins({
  DEBUG: false
});
const bs = browserSync.create()
const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
  ],
  pkg: require('./package.json'),
  date: new Date()
}
const clean = () => {
  return del(['dist', 'temp'])
}
// 样式编译
const style = () => {
  console.log('+++++++++++', plugins, gulpLoadPlugins, gulpLoadPlugins(), gulpLoadPlugins().sass() );
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest('dist'))
}
// 脚本编译
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))
}
// 页面模板编译
const page = () => {
  return src('src/*.html', { base: 'src' })
    .pipe(plugins.swig({ data }))
    .pipe(dest('dist'))
}
// 图片和文字编译
const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
// 其他文件以及文件清除
const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    notify: false,
    port: 2080,
    // open: false,
    // files: 'dist/**',
    server: {
      baseDir: ['dist', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}
const compile = parallel(style, script, page, image, font);

const build = series(clean, parallel(compile, extra))
module.exports = {
  clean,
  compile,
  build,
  serve
}
