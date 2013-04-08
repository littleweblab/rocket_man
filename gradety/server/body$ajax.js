module.exports = function body$ajax () {
  //AJAX 
  ( route, /^\/pages\/ajax/ )
    ( undefined, { headers: { "Content-Type": "application/json" } } )

    ( postGet, function ( f ) { 
        
        fab.pool.query( 
          f.pageid == 'first' 
          ? 'SELECT * FROM gradety_' + f.projectid + '.pages WHERE landingpage = 1'
          : 'SELECT * FROM gradety_' + f.projectid + '.pages WHERE pageid ="' + f.pageid + '"'
        , function ( err, qCurrentPage ) {
            if ( err ) { throw err; };
            var pageid = f.pageid == 'first' ? qCurrentPage[ 0 ].pageid : f.pageid; 
            ///////////////////////////////
            // IF AJAX CALL IS AN UPDATE //
            ///////////////////////////////
            if ( f.update ) {
              f.update = JSON.parse( f.update ); 
              var c = f.update.length
                , updatedList = [] // Collects all updated pages to return as answer
                ;
                  
              for ( var i in f.update ) {
                fab.pool.query( 
                  'CALL script_update_page( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )'
                , f.update[ i ] 
                , function ( err, qUpdate ) {
                    c--;   
                    if ( qUpdate[ 0 ].id ) updatedList.push( { pageWas: qUpdate[ 0 ].pageWas, id: qUpdate[ 0 ].id.toString() } );
                    if ( c == 0  ) {
                      f.write( updatedList.length ? JSON.stringify( updatedList ) : JSON.stringify( 'UPDATED' )  );
                      fab.pool.query( 
                        'CALL script_list_pages( ? )'
                      , [ f.projectid ]   
                      , function ( err, qPages ) {
                          var pages = require( 'renderer/helper' ).makePageObj( qPages )
                            //, filter =  require( 'renderer/filter' )( pages, qCurrentPage[ 0 ].pageid, 0, 1000000  )
                            ; 
                          
                          for ( var b in qPages ) { 
                          if (  qPages[ b ].tpl != 'no tpl' ) { //&& !! filter[ qPages[ b ].pageid ] ) {

                            var tpl = JSON.parse( qPages[ b ].tpl );
                            tpl.tpl = require( 'renderer/replace' )( 
                                tpl.tpl
                              , 'MENU'
                              , 'data-menu'
                              , function ( whitespace, replacedId ) { 
                                 
                                 var $selector = replacedId.split( '-' )
                                   , styleableId = $selector[ 0 ]
                                   , parentId = $selector[ 1 ]
                                   , level = $selector[ 2 ]
                                   , deep = $selector[ 3 ]
                                   , filtered = $selector[ 4 ] == 1 ? true : false
                                   , directions = $selector[ 5 ].split( /\$/ )
                                   ;   
                                   
                                 return require( 'renderer/menu' )( pages, qPages[ b ].pageid, styleableId, level, deep, filtered, directions, 1 ) ; 
                              });//END RENDERER/REPLACE
                              
                              fab.pool.query(
                                'CALL script_update_page( ?, ?, "x", "x", "x", "x", "x", "x", "x", "x", ?, "x", "x", "x" )'
                              , [ f.projectid, qPages[ b ].pageid, JSON.stringify( tpl ) ]
                              , function () {}
                              );//END QUERY
                            }//END IF 
                          }//END LOOP
                        }//END CALLBACK
                      );//END QUERY PAGES
                      
                    }//END IF
                });//END QUERY UPDATE CURRENT
              }//END LOOP
            }//END IF
            //////////////////////////
            // IF PAGE HAS A DESIGN //
            //////////////////////////
            else if ( qCurrentPage[ 0 ].tpl != 'no tpl' ) { 
                 var r = JSON.parse( qCurrentPage[ 0 ].tpl )//parse tpl to obj 
              r.pageid = qCurrentPage[ 0 ].pageid;//Add pageid
              f.write( JSON.stringify( r ) );//Send data to client
            }//END ELSEIF
            //////////////////////////////////////
            // IF PAGE BECAME A DESIGN ASSIGNED //
            //////////////////////////////////////  
            else if ( f.designid !== undefined  ) { 
              //////////////////////
              // SELECT ALL PAGES //
              //////////////////////
              fab.pool.query( 
                'CALL script_list_pages( ? )'
              , [ f.projectid ]   
              , function ( err, qPages ) {
                  if ( err ) { throw err; }
                    ////////////////////////////////
                    // SELECT BIF IN TABLE DESIGN //
                    ////////////////////////////////
                    fab.pool.query(
                      'SELECT * FROM gradety_' + f.projectid + '.designs WHERE designid ="' + ( f.designid || qCurrentPage[ 0 ].designid ) + '"'
                    , function ( err, qBif ) {
                        if ( err ) { throw err; }
                        var renderer = require( 'renderer' )
                          , pages = require( 'renderer/helper' ).makePageObj( qPages )
                          , tree = JSON.parse( qBif[ 0 ].bifork )[ 2 ].tree 
                          ;
                        ////////////////
                        // RENDER TPL //
                        ////////////////
                        var r = renderer( tree, pages, pageid ); 
                            r.pageid = qCurrentPage[ 0 ].pageid;
                            r.designid = f.designid || qCurrentPage[ 0 ].designid;
                            r = JSON.stringify( r )
                            ;
                        ////////////////////////////
                        // UPDATE TPL IN DATABASE //
                        ////////////////////////////
                        
                        fab.pool.query(
                          'CALL script_update_page( ?, ?, "x", "x", ?, "x", "x", "x", "x", "x", ?, "x", "x", "x" )'
                          ,[ f.projectid, pageid, f.designid, r ]
                          , function ( err ) {
                              if ( err ) { throw err; }
                              f.write( r );
                          }//END CALLBACK
                        );//END QUERY
                        
                        //f.write( r );
                      }//END CALLBACK
                    );//END POOL
                }//END CALLBACK
              );//END QUERY 
            }//END IF
            ///////////////
            // NO DESIGN //
            ///////////////
            else { 
              fab.pool.query(
                'CALL script_list_designs( ? )'
                , [ f.projectid ]
                , function ( err, qDesigns ) { f.write( JSON.stringify( qDesigns ) ) }//END CALLBACK
              );//END QUERY
            }
          }//END CALLBACK
        );//END QUERY
      //}
     })//END POSTGET
  ()//END ROUTE/PAGES/AJAX
  
  ( route, /^\/design\/ajax/ )
    ( undefined, { headers: { "Content-Type": "application/json" } } )
    ( postGet, function ( f ) { 
     
      switch ( f.type ) {
        /////////////////////////////////
        // IF DRAW WANNA LOAD A DESIGN //
        /////////////////////////////////
        case 'design$draw$loadDesign':
          var data = JSON.parse( f.data );
          fab.pool.query( 
            'SELECT bifork FROM gradety_' + data.projectId + '.designs WHERE designid = ? '   
          , [ data.designId ]
          , function ( err, qDesign ) {
              if ( err ) { throw err; };
              f.write( qDesign[ 0 ].bifork.toString() );
            }
          );//END QUERY 
          break;
        
        ///////////////////////////////////
        // IF DRAW WANNA UPDATE A DESIGN //
        /////////////////////////////////// 
        case 'design$draw$updateDesign': 
           fab.pool.query( 
            'CALL script_update_design( ?, ?, ? )'
          , JSON.parse( f.data ) 
          , function ( err, qDesign ) {  f.write( 'Saved' ); }
          );//END QUERY
          break;
        
        ////////////////////////////////////////
        // IF WIZZARD WANNA MAKE A NEW DESIGN //
        //////////////////////////////////////// 
        case 'design$wizzard$save':
          fab.pool.query( 
            'CALL script_new_design( ?, ?, ?, ?, ?, ?, ? )'
          , JSON.parse( f.data ) 
          , function ( err, qDesign ) {  f.write( JSON.stringify( qDesign[ 0 ].newident.toString() ) ); }
          );//END QUERY
          break;
          
        //////////////////////////////////////////////////////////
        // IF WIZZARD WANNA LOAD LIST OF ALL DESIGNS IN PROJEKT //
        //////////////////////////////////////////////////////////
        case 'design$list':
          fab.pool.query( 
            'CALL script_list_designs( ? )'
          , JSON.parse( f.data )
          , function ( err, qDesignList ) {  f.write( JSON.stringify( qDesignList ) ); }
          ); 
          break;
        
        ////////////////////////////////
        // IF A DESIGN MUST BE COPIED //
        ////////////////////////////////
        case 'design$list$copy':
          fab.pool.query( 
            'CALL script_copy_design( ?, ? )'
            , JSON.parse( f.data )
            , function ( err, qDesignCopy ) {  f.write( JSON.stringify( qDesignCopy ) ); }
          );
          break;
         
         /////////////////////
         // DELETE A DESIGN //
         /////////////////////
         
         case 'design$list$delete':
          fab.pool.query( 
            'CALL script_delete_design( ?, ? )'
          , JSON.parse( f.data ) 
          , function ( err, qDesignDelete ) {  f.write( JSON.stringify( qDesignDelete ) ); }
          );
          break;
      }//END SWITCH
    })//END POSTGET
  ()//END ROUTE DESIGN/AJAX
  
  /////////////////////////////////
  // LOAD AN IMAGE FROM DATABASE //
  /////////////////////////////////
  ( route, /^\/image/ )
    ( postGet, function ( f ) { 
      var path = f.pathname.split('/');
      path.shift()
     console.log(path )
      fab.pool.query( 
        'SELECT filedata FROM gradety_' + path[ 0 ] + '.files WHERE fileid = ? LIMIT 1' 
      , [ path[ 1 ] ]  
      , function ( err, file ) {
        if ( err || ! file.length ) f.write( 'Image Unknown' );
        else f.write( file[ 0 ].filedata );
      });//END QUERY
    })// END POSTGET
  ()//END ROUTE IMAGE
  
  //////////////////////////
  // UPLOAD AN FILE/IMAGE //   
  //////////////////////////
  ( route, /^\/upload/ )
    ( undefined, { headers: { "Content-Type": "application/json" } } )
    ( multiform, function ( f ) { 
      var name = f.filename.split( '.' )
        , suffix = name.pop()
        , fileId = f.fileId.toString().replace( /\n|\r/gi, '' )
        ;
      
      name = name.join( '.' );
      
      ///////////////////////////////////////////////////
      // WRITE FILE TO DISK, CALL STORED PROCEDURE TO  //
      // RAPE IT INTO DB AND REMOVE IT FROM DISK AGAIN //
      ///////////////////////////////////////////////////
      function addFileToDatabase ( projectId, file, fileId, suffix, addedBy, name  ) {
        var fs = require( 'fs' )
          , path = dir + '/upload' + '/' + fileId
          ;
          //////////////
          fs.writeFile( 
          /////////////
              path 
            , file
            , function ( err ) {
                if ( err ) throw err;
                ////////
                fs.stat( path , function ( err, stat ) { 
                ///////  
                  if ( err ) throw err; 
                  ///////////////
                  fab.pool.query(
                  ///////////////
                    'CALL script_file_to_blob( ?, ?, ?, ? )'
                  , [ projectId, fileId, path, stat.size ]
                  , function ( err, qBlob ) {
                      /////////
                      fs.unlink( path, function (err) {
                      /////////  
                        if ( err ) throw err;
                        console.log( ':) uploaded an image, imageid: ' + fileId +  ', projectid: ' + projectId.toString() );
                        f.write( JSON.stringify( { fileId: fileId, suffix: suffix, addedBy: addedBy.toString(), name: name } ) );
                      })//END FS.UNLINK
                      ;
                  })//END QUERY
                  ;
               });//END FS.STAT
              })//END FS.WRITEFILE
              ;
      }//END ADDFILETODATABASE
      
      ////////////////////////////////////////////////// 
      // CREATE NEW FILE IF FILEID IS UNDEFINED ( X ) //
      //////////////////////////////////////////////////
      if ( fileId == 'x' ) {
        ///////////////  
        fab.pool.query(
        ///////////////
          'CALL script_new_file( ?, ?, ?, ?, ?, ?, ? )'
        , [ f.projectId.toString(), name, suffix, f.type.toString(), f.addedBy.toString(), f.usedIn.toString(), f.usageAs.toString() ]
        , function ( err, qNewFile ) { 
            if ( err ) throw err;
            addFileToDatabase( f.projectId.toString() , f.file, qNewFile[ 0 ].fileId.toString(), suffix, f.addedBy.toString(), name );  
          }//END CALLBACK
        );//END QUERY
      }//END IF
      
      /////////////////////////////////////////////////////
      // OVERWRITE EXISTING FILE WHAT MATCHES THE FILEID //
      ///////////////////////////////////////////////////// 
      else {
        fab.pool.query(
          ///////////////
            'CALL sript_update_file( ?, ?, ?, ?, ?, ?, ?, ? )'
          , [ f.projectId.toString(), fileId, name, suffix, f.type.toString(), f.addedBy.toString(), f.usedIn.toString(), f.usageAs.toString() ]
          , function ( err, qNewFile ) { 
              if ( err ) throw err;
              addFileToDatabase( f.projectId.toString() , f.file, fileId, suffix, f.addedBy.toString(), name );
            }//END CALLABCK
        )//END QUERY
        ;
      }//END ELSE 
    })//END MULTIFORM 
  ()//END ROUTE UPLOAD
  
  /////////////////
  // REMOVE FILE //
  /////////////////
  ( route, /^\/removefile/ )
    ( undefined, { headers: { "Content-Type": "application/json" } } )
      ( postGet, function ( f ) { 
         fab.pool.query(
           'CALL script_delete_file( ?, ? )'
          , [ f.projectId, f.fileId ]
          , function ( err, qDeleteFile ) { f.write( JSON.stringify( qDeleteFile[ 0 ] ) ); } 
         )//END QUERY
         ; 
      })//END POSTGET
  ()//END ROUTE REMOVEFILE
  
  
// OLD  
  ( route, /^\/ajax/ )
    //BLOB
    ( route, /^\/blob/ )
      ( method, 'GET' )
        ( addContentLength )
          ( postGet, function ( f ) {
            //f.ties = sqlties;
           
            //sqlios.blob( f );
          })
      ()//method
    ()//route
    // UPDATE 
    ( route, /^\/update/ )
      ( method, 'POST' )
        ( addContentLength )
          ( postGet, function ( f ) { 
            f.ties = sqlties;
            sqlios.update( f );
          })
      ()//method
    ()//route
    //SELECT        
    ( route, /^\/select/ )
      ( method, 'GET' )
        ( postGet, function ( f ) {
          f.ties = sqlties;
           console.log( f )
          sqlios.select( f );
        })
      ()//method
    ()//route
    //SCRIPT 
    ( route, /^\/script/ )
      ( undefined, { headers: { "Content-Type": "application/json" } } )
      ( postGet, function ( f ) { 
        f.ties = sqlties;
        sqlios.script( f );
      })
    ()//route
    //IMAGE
    ( route, /^\/image/ )
      ( undefined, { headers: { "Content-Type": "application/json" } } )
      ( multiform, function ( f ) { 
          f.ties = sqlties;
          sqlios.script( f );
      }) //, { ties:sqlties } )
    ()//route
  ()//route
};//END AJAX