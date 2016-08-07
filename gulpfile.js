var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var gulpif = require('gulp-if');
var babel = require('gulp-babel');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");

gulp.task('crisp', function() {
	return gulp.src('ws-poly.html')
		.pipe(crisper())
		
		.pipe(rename(function(file) {
	      	file.basename = 'v-' + file.basename
	  	}))
		
		.pipe(sourcemaps.init())
		.pipe(gulpif('*.js', babel({
			presets: ['es2015']
		})))

		.pipe(replace(/<html>/g, ''))
		.pipe(replace(/<\/html>/g, ''))
		.pipe(replace(/<head>/g, ''))
		.pipe(replace(/<\/head>/g, ''))
		.pipe(replace(/<\/body>/g, ''))
		.pipe(replace(/<body>/g, ''))
		.pipe(replace(/src="ws-poly.js"/g, 'src="v-ws-poly.js"'))
		
		.pipe(sourcemaps.write())

		
		.pipe(gulp.dest('./'));
});

gulp.task('default', ['crisp']);
