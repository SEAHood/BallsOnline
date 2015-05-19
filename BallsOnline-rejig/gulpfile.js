var gulp = require('gulp');
var typescript = require('gulp-tsc');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('compile', function(){
	gulp.src(['/src/player.ts'])
		.pipe(typescript())
		.pipe(gulp.dest('js/'))
});