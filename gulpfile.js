var path = require('path');
var gulp    = require('gulp'),                 
    imagemin = require('gulp-imagemin'),      
    sass = require('gulp-ruby-sass'),       
    minifycss = require('gulp-minify-css'),  
    jshint = require('gulp-jshint'),          
    uglify  = require('gulp-uglify'),   
    rename = require('gulp-rename'),       
    concat  = require('gulp-concat'),      
    clean = require('gulp-clean'),         
    tinylr = require('tiny-lr'), 
    server = tinylr(),
    port = 35729,
    livereload = require('gulp-livereload'),
    $ = require('gulp-load-plugins')();


gulp.task('html', function() {
    var htmlSrc = './src/1.0.0/**/*.html',
        htmlDst = './dist/';

    gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDst))
        .pipe(livereload(server));
});
// gulp-ruby-sass: 1.x
gulp.task('css', function(){
    return sass(['./src/1.0.0/sass/tmbui.scss'],{
            sourcemap:false,
            noCache:true,
            style:'expanded',
            unixNewlines:true
        })
        .pipe(gulp.dest('./dist/css'))
        .pipe(minifycss({noAdvanced: true}))
        .pipe(rename({
            suffix: '.min',
            extname: ".css"
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(livereload(server));
});

gulp.task('js', function(){
    var imgSrc = ['./src/1.0.0/js/*.js','./src/1.0.0/js/**/*.js'],
        imgDst = './dist/js';
    gulp.src(imgSrc)
        .pipe(gulp.dest(imgDst));
})

gulp.task('clean', function() {
    gulp.src(['./dist/css', './dist/js'], {read: false})
        .pipe(clean());
});
gulp.task('connect', function () {
    var connect = require('connect'),
        serveIndex = require('serve-index'),
        serveStatic = require('serve-static');

    var app = connect()
        .use(serveStatic('./src/1.0.0/')).use(serveStatic('./dist/'))
        .use(serveIndex('./src/1.0.0/'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });

});

gulp.task('serve', ['connect', 'css'], function () {
    require('open')('http://localhost:9000');
});

gulp.task('default', ['clean'], function(){
    gulp.start('html','css','js');
});
gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();
    livereload.listen();
    gulp.watch([
        './src/1.0.0/**/*.html',
        './src/1.0.0/sass/**/*.scss',
        './src/1.0.0/js/**/*.js',
        './src/1.0.0/js/*.js'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('src/1.0.0/**/*.html', ['html']);
    gulp.watch('src/1.0.0/sass/**/*.scss', ['css']);
    gulp.watch(['src/1.0.0/js/*.js','src/1.0.0/js/**/*.js'], ['js']);

});
