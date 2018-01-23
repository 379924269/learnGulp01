#gulp + bower自动化构建前段学习

##搭建环境
    ([参考地址]http://www.ydcss.com/archives/18)
##bower加载库文件
     [参考地址]https://segmentfault.com/a/1190000002971135



##安装插件

//--save-dev gulp gulp-ruby-sass gulp-uglify gulp-imagemin imagemin-pngquant gulp-livereload gulp-webserver gulp-rename gulp-sourcemaps gulp-changed gulp-concat gulp-clean
// 引入我们的gulp组件
var gulp			= require('gulp');					// 基础库
var sass 			= require('gulp-ruby-sass'),			// CSS预处理/Sass编译
    uglify 			= require('gulp-uglify'),				// JS文件压缩
    imagemin 		= require('gulp-imagemin'),		// imagemin 图片压缩
    pngquant 		= require('imagemin-pngquant'),	// imagemin 深度压缩
    livereload 		= require('gulp-livereload'),			// 网页自动刷新（服务器控制客户端同步刷新）
    webserver 		= require('gulp-webserver'),		// 本地服务器
    rename 		= require('gulp-rename'),			// 文件重命名
    sourcemaps 	= require('gulp-sourcemaps'),		// 来源地图
    changed 		= require('gulp-changed'),			// 只操作有过修改的文件
    concat 			= require("gulp-concat"), 			// 文件合并
    clean 			= require('gulp-clean');				// 文件清理