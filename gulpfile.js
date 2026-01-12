var gulp = require('gulp')
var del = require('del')
var replace = require('gulp-replace')

gulp.task('cdn', () => {
    gulp.src(['../public/static/js/manifest*.js'])
        .pipe(replace(`"{{$CDN}}"`, `CDN+'/'`))
        .pipe(gulp.dest('../public/static/js/'))
})

gulp.task('cssCdn', () => {
    gulp.src(['../public/static/css/*.css'])
        .pipe(replace('{{$CDN}}', '/'))
        .pipe(gulp.dest('../public/static/css/'))
})

const jsCdn = () => replace('src:"static', `src:CDN+"/static`)
// const removeConsole = () => replace(/console\.(log|warn|error)\(([^()]+)\)/g, `(true)`)
gulp.task('js', () => {
    gulp.src(['../public/static/js/*.js'])
        .pipe(jsCdn())
        // .pipe(removeConsole())
        .pipe(gulp.dest('../public/static/js/'))
})

gulp.task('swJs', () => {
    gulp.src(['../public/sw.js'])
        .pipe(replace(/importScripts\("\{\{\$CDN\}\}precache-manifest\.[a-z0-9]+\.js"\);/, ''))
        .pipe(gulp.dest('../public/'))
})

gulp.task('rm', () => del(['../public/precache-manifest.*.js'], {force: true}))

// gulp.task('default', ['cdn', 'cssCdn', 'jsCdn', 'remove console'])
gulp.task('default', ['cdn', 'cssCdn', 'js', 'swJs', 'rm'])
