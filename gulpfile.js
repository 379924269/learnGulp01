/**
 * Created by Dick on 2018/1/16.
 */
//为什么要return?
// 而且根据async-task-support，我们知道，只有return之后，其他依赖了xxx的任务，才能保证执行顺序，否则可能del还没有删除完东西，下一个依赖了xxx的任务就开始了。

//gulp.task(name, fn)这个你应经见过了
//
//gulp.run(tasks...)尽可能多的并行运行多个task
//
//gulp.watch(glob, fn)当glob内容发生改变时，执行fn
//
//gulp.src(glob)返回一个可读的stream
//
//gulp.dest(glob)返回一个可写的stream
//gulp-sass:            sass的编译
//gulp-autoprefixer:    自动添加css前缀
//gulp-minify-css:      压缩css一行
//gulp-uglify:          压缩js代码
//gulp-notify:          加控制台文字描述用的
//gulp-clean:           清理文件
//gulp-file-include:    include 文件用
//gulp-imagemin:        图片压缩
//imagemin-pngquant:    图片无损压缩
//gulp-cache:           检测文件是否更改
//gulp-zip:             自动打包并按时间重命名
//gulp-htmlmin:         压缩html
//merge-stream:         合并多个 stream
//gulp-util:            打印日志 log
//gulp-plumber:         监控错误
//gulp-babel:           编译ES6
//gulp-if:              条件判断
//gulp-sequence:        顺序执行
//gulp-eslint:          代码风格检测工具
//del:                  删除文件
// 引入gulp
var gulp = require('gulp');					// 基础库

// 引入我们的gulp组件
var sass = require('gulp-ruby-sass');			// CSS预处理/Sass编译
var uglify = require('gulp-uglify');				// JS文件压缩
var imagemin = require('gulp-imagemin');		// imagemin 图片压缩
var pngquant = require('imagemin-pngquant');	// imagemin 深度压缩
var livereload = require('gulp-livereload');			// 网页自动刷新（服务器控制客户端同步刷新）
var webserver = require('gulp-webserver');		// 本地服务器
var rename = require('gulp-rename');			// 文件重命名
var sourcemaps = require('gulp-sourcemaps');		// 来源地图
var changed = require('gulp-changed');			// 只操作有过修改的文件
var concat = require("gulp-concat"); 			// 文件合并
var clean = require('gulp-clean');				// 文件清理

/* = 全局设置
 -------------------------------------------------------------- */
var srcPath = {
    html: 'src',
    css: 'src/scss',
    script: 'src/js',
    image: 'src/images'
};
var destPath = {
    html: 'dist',
    css: 'dist/css',
    script: 'dist/js',
    image: 'dist/images'
};

/* = 开发环境( Ddevelop Task )
 -------------------------------------------------------------- */
// HTML处理
gulp.task('html', function () {
    return gulp.src(srcPath.html + '/**/*.html')
        .pipe(changed(destPath.html))
        .pipe(gulp.dest(destPath.html));
});

//移动bootstrap中的字体
gulp.task('removeFont', function () {
    return gulp.src("bower_components/bootstrap/dist/fonts/*")
        .pipe(gulp.dest("dist/lib/bootstrap/fonts/"));
});

// 样式处理
gulp.task('sass', function () {
    return sass(srcPath.css, {style: 'compact', sourcemap: true}) // 指明源文件路径、并进行文件匹配（编译风格：简洁格式）
        .on('error', function (err) {
            console.error('Error!', err.message); // 显示错误信息
        })
        .pipe(sourcemaps.write('maps')) // 地图输出路径（存放位置）
        .pipe(gulp.dest(destPath.css)); // 输出路径
});

// JS文件压缩&重命名
gulp.task('script', function () {
    return gulp.src([srcPath.script + '/*.js', '!' + srcPath.script + '/*.min.js']) // 指明源文件路径、并进行文件匹配，排除 .min.js 后缀的文件
        .pipe(changed(destPath.script)) // 对应匹配的文件
        .pipe(sourcemaps.init()) // 执行sourcemaps
        .pipe(rename({suffix: '.min'})) // 重命名
        .pipe(uglify({preserveComments: 'some'})) // 使用uglify进行压缩，并保留部分注释
        .pipe(sourcemaps.write('maps')) // 地图输出路径（存放位置）
        .pipe(gulp.dest(destPath.script)); // 输出路径
});

// imagemin 图片压缩
gulp.task('images', function () {
    return gulp.src(srcPath.image + '/**/*') // 指明源文件路径，如需匹配指定格式的文件，可以写成 .{png,jpg,gif,svg}
        .pipe(changed(destPath.image))
        .pipe(imagemin({
            progressive: true, // 无损压缩JPG图片
            svgoPlugins: [{removeViewBox: false}], // 不要移除svg的viewbox属性
            use: [pngquant()] // 深度压缩PNG
        }))
        .pipe(gulp.dest(destPath.image)); // 输出路径
});

// 文件合并
gulp.task('concat', function () {
    return gulp.src(srcPath.script + '/*.min.js')  // 要合并的文件
        .pipe(concat('libs.js')) // 合并成libs.js
        .pipe(rename({suffix: '.min'})) // 重命名
        .pipe(gulp.dest(destPath.script)); // 输出路径
});

// 本地服务器
gulp.task('webserver', function () {
    gulp.src(destPath.html) // 服务器目录（.代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            livereload: true, // 启用LiveReload
            open: true // 服务器启动时自动打开网页
        }));
});

// 监听任务
gulp.task('watch', function () {
    // 监听 html
    gulp.watch(srcPath.html + '/**/*.html', ['html'])
    // 监听 scss
    gulp.watch(srcPath.css + '/*.scss', ['sass']);
    // 监听 images
    gulp.watch(srcPath.image + '/**/*', ['images']);
    // 监听 js
    gulp.watch([srcPath.script + '/*.js', '!' + srcPath.script + '/*.min.js'], ['script']);
});
// 默认任务
gulp.task('default', ['webserver', 'watch']);

/* = 发布环境( Release Task )
 -------------------------------------------------------------- */
// 清理文件
gulp.task('clean', function () {
    return gulp.src([destPath.css + '/maps', destPath.script + '/maps'], {read: false}) // 清理maps文件
        .pipe(clean());
});

// 样式处理
gulp.task('sassRelease', function () {
    return sass(srcPath.css, {style: 'compressed'}) // 指明源文件路径、并进行文件匹配（编译风格：压缩）
        .on('error', function (err) {
            console.error('Error!', err.message); // 显示错误信息
        })
        .pipe(gulp.dest(destPath.css)); // 输出路径
});
// 脚本压缩&重命名
gulp.task('scriptRelease', function () {
    return gulp.src([srcPath.script + '/*.js', '!' + srcPath.script + '/*.min.js']) // 指明源文件路径、并进行文件匹配，排除 .min.js 后缀的文件
        .pipe(rename({suffix: '.min'})) // 重命名
        .pipe(uglify({preserveComments: 'some'})) // 使用uglify进行压缩，并保留部分注释
        .pipe(gulp.dest(destPath.script)); // 输出路径
});

// 打包发布
gulp.task('release', ['clean'], function () { // 开始任务前会先执行[clean]任务
    return gulp.start('sassRelease', 'scriptRelease', 'images'); // 等[clean]任务执行完毕后再执行其他任务
});

/* = 帮助提示( Help )
 -------------------------------------------------------------- */
gulp.task('help', function () {
    console.log('----------------- 开发环境 -----------------');
    console.log('gulp default		开发环境（默认任务）');
    console.log('gulp html		HTML处理');
    console.log('gulp sass		样式处理');
    console.log('gulp script		JS文件压缩&重命名');
    console.log('gulp images		图片压缩');
    console.log('gulp concat		文件合并');
    console.log('---------------- 发布环境 -----------------');
    console.log('gulp release		打包发布');
    console.log('gulp clean		清理文件');
    console.log('gulp sassRelease		样式处理');
    console.log('gulp scriptRelease	脚本压缩&重命名');
    console.log('---------------------------------------------');
});

//gulp.task(
//    'minifyCss', function () {
//        gulp.src('css/*.css')
//            .pipe(minifyCss()) //压缩css
//            .pipe(gulp.dest('dist/css/')); //放到dist/css目录下面
//    }
//);
//
//gulp.task('script', function () {
//        gulp.src(['src/a.js', "src/b.js"])
//            .pipe(concat('all.js'))
//            .pipe(uglify())   // 压缩js代码
//            .pipe(gulp.dest('dist/js'));
//    }
//);
////把js库放到项目里面
//gulp.task('buildlib', function() {
//    gulp.src('./bower_components/bootstrap/dist/*')
//        .pipe(gulp.dest('./dist/lib/bootstrap/'));
//    gulp.src('./bower_components/jquery/dist/jquery.min.js')
//        .pipe(gulp.dest('./dist/lib/jquery/'));
//});
//
//gulp.task('saySomeThing', function () {
//    console.log('this is the default task');
//});
//
//gulp.task("clean", function () {
//    return gulp.src('/dist')
//        .pipe(clean());
//});
//
//gulp.task(
//    'default', ['minifyCss', 'script']
//);


