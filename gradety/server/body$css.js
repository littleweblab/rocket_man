module.exports = function body$css ( write ) {
  var css = require( 'stylus' )
    , fs = require( 'fs' )
    , str = fs.readFileSync( dir + '/../stylus/screen.styl', 'utf8' )
    ;
    css.render(
      str
    , { filename: dir + '/../stylus/screen.styl', compress: true }
    , function ( err, css ) {
        if ( err ) throw err;
        fs.writeFile( dir + '/css/screen.css', css, function ( err ) {} )
      }
    );
  return write
}
