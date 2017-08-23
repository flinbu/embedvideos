var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

gulp.task('min', function() {
    gulp.src('embed.videos.js')
        .pipe(rename('embed.videos.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});