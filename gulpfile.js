/**
 * Created by Dick on 2018/1/16.
 */
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
var gulp = require('gulp');
//
var concat = require('gulp-concat');
//压缩
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');

gulp.task(
    'minifyCss', function () {
        gulp.src('css/*.css')
            .pipe(minifyCss()) //压缩css
            .pipe(gulp.dest('dist/css/')); //放到dist/css目录下面
    }
);

gulp.task('script', function () {
        gulp.src(['src/a.js', "src/b.js"])
            .pipe(concat('all.js'))
            .pipe(uglify())   // 压缩js代码
            .pipe(gulp.dest('dist/js'));
    }
);

gulp.task(
    'default', ['minifyCss', 'script']
);
