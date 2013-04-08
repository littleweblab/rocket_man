//////////////
// FRONTEND //
//////////////
var http = require( 'http' )
  , fab = require( 'fab.server' )
  , helper = require( 'renderer/helper' )
  , port = 6000
  , websites = {}
  ;
  
with( fab ) sub = require( 'fab.sub' );

/////////////////////////
// ADD WEBSITE/-SERVER //
/////////////////////////
exports.startProject = function ( id, p, pages ) {
  
  exports.stopProject( id );//Stop project if it already runs
  
  var port = p || port++
    , fabify = { start: '' }
    , pages = helper.makePageObj( pages )
    ;
  
  //////////////////////
  // CREATE WEBSERVER //
  //////////////////////
  websites[ id ] = http.createServer();
  websites[ id ].listen( port ); 
  websites[ id ].setMaxListeners( pages.length + 1 ); //Don't like this. fab.sub needs a solution to inherit listener
 
  //////////////////
  // CREATE PAGES //
  //////////////////
  for ( x in pages ) ! function ( page ) {
   
    var tpl = ( page.tpl != 'no tpl' ? JSON.parse( page.tpl ) : { tpl: '(" no content ")', css: '' } )
      , path = helper.makeArrayPath( page.parentid, [ page.urlname ], pages, 'urlname' )
      ; 
    
   
    
    fabify.start += '( sub, fabify["' + page.pageid + '"].frame )'
    
    with ( fab )
    with ( html ) fabify[ page.pageid ] = {
      frame: function ( run ) { 
        ( run )
        () 
        ( listen, null )
          ( route, new RegExp( '^\\/' + path.join( '\\/' ).toLowerCase() + '\\/css$' ) )
            ( sub, fabify[ page.pageid ].css  )
          ()
          ( route, new RegExp( '^\\/' + path.join( '\\/' ).toLowerCase() + '$' ) )
            //( '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' )
            ( HTML, { xmlns:'http://www.w3.org/1999/xhtml', 'xml:lang':'de', lang:'de' } )
              ( HEAD )
                ( META, { 'http-equiv': 'Content-Type', 'content': 'text/html', 'charset': 'utf-8' })
                ( TITLE )( page.pagename )()
                ( LINK, { rel: 'stylesheet', type: 'text/css', href: '/static/css/static.css' })
                ( LINK, { rel: 'stylesheet', type: 'text/css', href: '/' +  path.join('/').toLowerCase() + '/css' } )
                ( SCRIPT, { type: 'text/javascript', src: '/static/client/jquery/jquery.js' } )()
                ( SCRIPT, { type: 'text/javascript' } )( '$( document ).ready( function () {' + tpl.script + '});' )()
              ()//head
              ( BODY )
                ( sub, fabify[ page.pageid ].tpl )
              ()//body
            ()//html    
          ()//route
        ()//listen
        ;
      }//END FRAME
    , tpl: function ( run ) { eval( '( run )()' + tpl.tpl.replace( /, name\: \"(.*?)\"/g, '') ); }
    , css: function ( run ) { eval( '( run )()' + tpl.css.replace( /#(.*?) /, 'body' ) ); }
    }//END f
  } ( pages[ x ] )
  ;
  
  /////////////////////////////////////////
  // ADD PROJECTS ( FAB ) CODE TO SERVER //
  /////////////////////////////////////////
  with ( fab ) 
  with ( html )
  ( fab )
    ( run )
    () 
    ( listen, websites[ id ] )
      ( route , /^\/static/)
        ( addContentLength )
        ( fs )
          ( __dirname )
          ( head.url.pathname )
        ()//fs
      ()//route,static
      ( sub, function ( run ) { eval( '( run )()' + fabify.start ); } )
      
      /////////////////
      // DIRTY MYSQL //
      /////////////////
      ( function body$mysql ( write, count ) {
          var MySQLPool = require( "mysql-pool" ).MySQLPool;
          fab.pool = new MySQLPool({
              poolSize: 4,
              user: 'root',
              password: '',
              database: 'gradety_master'
          });

          fab.pool.properties.host = '127.0.0.1';
          fab.pool.properties.user = 'root';
          fab.pool.properties.password = '';
          fab.pool.connect();
          return write
       })//END DIRTY MYSQL
       
      ( route, /^\/image/ )
        ( postGet, function ( f ) { 
          var path = f.pathname.split('/');
          path.shift()
         
          fab.pool.query( 
            'SELECT filedata FROM gradety_' + path[ 0 ] + '.files WHERE fileid = ? LIMIT 1' 
          , [ path[ 1 ] ]  
          , function ( err, file ) {
            if ( err || ! file.length ) f.write( 'Image Unknown' );
            else f.write( file[ 0 ].filedata );
          });//END QUERY
        })// END POSTGET
      ()//END ROUTE IMAGE
    ()//listen
    ;
 
  console.log( ':-) Gradety pubished project:', id );
  return { websites: websites, port: port };
};//END STARTPROJECT

////////////////////////////
// REMOVE WEBSITE/-SERVER //
////////////////////////////
exports.stopProject = function ( id ) {
  if ( ! websites[ id ] ) return
  websites[ id ].close();
  delete websites[ id ];
  console.log( ':-( Gradety unpubished project:', id );
  return 'deleted: ' + id;
};//END STOPPROJECT
