var util = require( 'util' )
  , EventEmitter = require( 'events' ).EventEmitter
  ;

 function SQLIOS () {
  if ( ! ( this instanceof SQLIOS ) ) return new SQLIOS( t );
  EventEmitter.call( this );
  return this;    
};

util.inherits( SQLIOS, EventEmitter );
module.exports = SQLIOS;

SQLIOS.prototype.select = function ( fab ) { 
  //console.log( '\n*** modul ios.js *** [ select ] ***\n') ;
  //console.log( 'ios.js, select, inspect fab ==> \n', util.inspect( fab ) );
    //console.log('ios.js, inspect fab.ties ==> \n',util.inspect(fab.ties));
    var parameters = fab.parameters.replace( /\s/g, "" ).split( ',' )
      , sqlstm = ''
      ;
   //console.log('ios.js, inspect fab.ties.databasenamespace ==> ' + fab.ties.databasenamespace);
    var databaseselector=fab.ties.databasenamespace + fab.projectid + '.';
    //console.log('ios.js databaseselector ==> ' + databaseselector); 

    switch ( fab.table ) {
    case 'designsXconstants' :
         sqlstm = 'SELECT C.projectid,D.designid,D.bifork,D.designname,D.created_at,D.updated_at FROM '
      +  databaseselector + 'designs AS D INNER JOIN '
      +  databaseselector + 'constants AS C ' 
      + 'WHERE ' + parameters[ 0 ] + '="' + parameters[ 1 ] + '"';
    break;
    default:    
      sqlstm = 'SELECT * FROM ' + databaseselector + fab.table + ' WHERE ' + parameters[ 0 ]+'="' + parameters[ 1 ] + '"'//MYSQL TASK;
    }

    console.log( 'select.js, sqlstm ==> ' + sqlstm );
    
    fab.ties.pool.query( 
      sqlstm 
    , function selectCb( err, rows, fields ) {
        if ( err ) throw err;
        //console.log('select.js, row ==>', rows[0][fab.field]);
        switch ( fab.table ) {
          case 'designsXconstants' :
            fab.write( rows[ 0 ][ 'bifork' ] );
          break;
          default:
            fab.write( rows[ 0 ][ fab.field ] );
        }//END SWITCH        
      }//END SELECTCB
    );//END TIES.POOL.QUERY
   //fab.write('you have found the select.');
};//END SQLIOS.PROTOTYPE.SELECT

SQLIOS.prototype.update = function ( fab ) { 
   var parameters = fab.parameters.replace( /\s/g, "" ).split( ',' )
     , databaseselector = fab.ties.databasenamespace + fab.projectid + '.'
     , sqlstm = 'UPDATE ' + databaseselector + fab.table + ' SET ' + fab.field  + ' = ? WHERE ' + parameters[ 0 ] + '= ? '//MYSQL TASK;
     ;
  //console.log('ios.js, update inspect fab ==> \n', util.inspect(fab));
  //console.log( 'update.js, sqlstm ==> ' + sqlstm );
                
  fab.ties.pool.query(    
    'UPDATE ' + databaseselector + fab.table + ' SET ' + fab.field  + ' = ? WHERE ' + parameters[ 0 ] + '= ? '//Mysql task
  , [ fab.data , parameters[ 1 ] ]
  , function selectCb ( err ) {
      if ( err ) throw err;
      fab.write( 'Super it\'s bin saved!' );
    }//END SELECTCB
  );//END QUERY
};//SQLIOS.PROTOTYPE.UPDATE

//////////////////////////////////////////////////////////////////////
// calling script, allways via gradety_master, holding the scripts  //
// first parameter[0] is projectid,                                 //
// instructing the script the database to deel with                 //
// if fab.data section is set, it builds the last parameter         //
////////////////////////////////////////////////////////////////////// 
SQLIOS.prototype.script = function ( fab ) { 
  console.log( '\n*** modul ios.js *** [ script ] *** \n' );
  //console.log('ios.js, inspect fab.ties ==> \n',util.inspect(fab.ties));
  console.log( 'ios.js, script, inspect fab ==> \n', util.inspect( fab ) );
  console.log( 'ios.js, script, inspect fab.data ==> ' + typeof( fab.data ) + '\n', util.inspect( fab.data ) );

  var p = fab.parameters.replace( /\s/g, "" ).split( ',' )
    , parameters = []
    ;
  //console.log('ios.js, script, inspect p ==> \n', util.inspect(p));
  ////////////////////////////////////
  // PROJECTID, SET FIRST PARAMETER //
  ////////////////////////////////////
  //parameters[0]=fab.projectid;
  parameters.push( fab.projectid );
  
  for ( var i = 0; i < p.length; i++ ) if ( p[ i ] != '' ) parameters.push( p[ i ] );
  
  var questionMarks = []; 
  for ( var i = parameters.length; i--; ) questionMarks.push( '?' );

  ///////////////////////////////////////////////////////////////
  // FAB.DATA-SECTION, SETUP LAST PARAMETER WITH RECEIVED DATA //
  ///////////////////////////////////////////////////////////////
  if ( fab.data != 'undefined' ) {
    if ( typeof ( fab.data ) == 'string' ) {
      if ( fab.data.length > 0 ) {
        parameters.push( fab.data );
        questionMarks.push( '?' );            
      }//END IF
    }//END IF
  }//END IF

  var callScript = 'call ' + fab.script + '(' +  questionMarks.join() + ')' 
    , sqlstm = 'not defined jet'//MYSQL TASK
    ;
  //console.log('ios.js :: script :: fab.script ==> ' + fab.script );
  //console.log('ios.js :: script :: callScript ==> \n' + callScript );
  //console.log('ios.js :: script callScript :: parameters ==> \n', util.inspect( parameters ) );
        
  fab.ties.pool.query( 
    callScript
  , parameters
  , function selectCb ( err, rows, fields ) {
      if ( err ) {
        console.log('ios.js :: script if err :: err ==>' , util.inspect( err ) );
        fab.write( 'sql-error numer ' + err.number + ' message: ' + err.message  );
      }//END IF
      //console.log('ios.js :: script callScript :: rows ==> \n', util.inspect(rows));
      fab.write( JSON.stringify( rows ) );
    }//END SELECTCB
  );//END TIES.POOL.QUERY
  //fab.write('you have found the script-routine.');
};//END SQLIOS.PROTOTYPE.SCRIPT

   
//////////////////////////////////////////////////////////////////////////////////   
// EXTRACT THE PROJECTID FROM HREF VIA PATHNAME //127.0.0.1:4011/BLOG/A0B0C0/42 //
//////////////////////////////////////////////////////////////////////////////////
SQLIOS.prototype.blob = function  ( fab ) {
  var path = require('path')
    , blobext = path.extname( fab.url )
    , blobkey = path.basename( fab.url, blobext )
    , projectid = path.dirname( fab.pathname ).replace( /\//g, '' )
    , table = 'library'
    ;
    //console.log('ios.js :: blob :: inspect fab ==> \n', util.inspect(fab));
    //var projectid=path.dirname(fab.pathname).replace(/\//g,'');
    //console.log('ios.js, inspect fab.ties ==> \n',util.inspect(fab.ties));
    //console.log('ios.js :: blob :: blobkey ==> ' + blobkey + ' :: blobext ==> ' + blobext );
    //console.log('ios.js :: blob :: projectid ==> ' + projectid);
    var databaseselector = fab.ties.databasenamespace + projectid + '.';
    //console.log('ios.js :: blob :: databaseselector ==> ' + databaseselector); 
    var sqlstm = 'SELECT file_data FROM ' + databaseselector + table + ' WHERE item_id=' + '\'' + blobkey + '\'';
    //console.log( 'ios.js :: blob :: sqlstm ==> ' + sqlstm );
    fab.ties.pool.query(
      sqlstm
    , function selectCb ( err, rows ) {
        if ( err ) throw err;
        fab.write( rows[ 0 ][ 'file_data' ] );
      }//END SELECTCB
    );//END CLIENT QUERY
}//END SQLIOS.PROTOTYPE.BLOB 

SQLIOS.prototype.getbif = function ( fab ,report){ 

    //console.log('ios.js, select, inspect fab ==> \n', util.inspect(fab));
    //console.log('ios.js, inspect fab.ties ==> \n',util.inspect(fab.ties));
    var parameters = fab.parameters.replace( /\s/g, "" ).split( ',' );
   
    //console.log('ios.js, inspect fab.ties.databasenamespace ==> ' + fab.ties.databasenamespace);
    var databaseselector=fab.ties.databasenamespace + fab.projectid + '.';
    //console.log('ios.js databaseselector ==> ' + databaseselector); 

    var sqlstm='SELECT bifork FROM ' + databaseselector + fab.table + ' WHERE '+parameters[0]+'="'+parameters[1]+'"'//MYSQL TASK;
    //var datarow= function(value){return value};
    
    console.log('select.js, sqlstm ==> ' + sqlstm );
    
    fab.ties.pool.query( sqlstm ,
            function selectCb(err, rows, fields){
            if (err) throw err;

            var answer = [];
            for ( var row in rows ) { 
                var stringyfied = {}
                  , obj = rows[ row ];
                for ( var name in obj ) stringyfied[ name ] = obj[ name ].toString(); 
                answer.push( stringyfied );
            };
            
            
            if (report) report(answer[0]['bifork']);
            //if (report) report(JSON.stringify(answer[0]['bifork']));
            
           // console.log('\ngetbif.js, bif row :::::>>>>> \n', answer[0]['bifork'] );
           // console.log('\ngetbif.js, stringify bif :::::>>>>> \n',JSON.stringify( answer[0]['bifork'] ));
        }//END SELECTCB
    );//END TIES.POOL.QUERY
    
    //fab.write('you have found the select.');
};

SQLIOS.prototype.getbif2 = function ( fab ){

    //console.log('ios.js, select, inspect fab ==> \n', util.inspect(fab));
    //console.log('ios.js, inspect fab.ties ==> \n',util.inspect(fab.ties));
    var parameters = fab.parameters.replace( /\s/g, "" ).split( ',' );
   
    //console.log('ios.js, inspect fab.ties.databasenamespace ==> ' + fab.ties.databasenamespace);
    var databaseselector=fab.ties.databasenamespace + fab.projectid + '.';
    //console.log('ios.js databaseselector ==> ' + databaseselector); 

    var sqlstm='SELECT bifork FROM ' + databaseselector + fab.table + ' WHERE '+parameters[0]+'="'+parameters[1]+'"'//MYSQL TASK;
    //var datarow= function(value){return value};
    
    console.log('select.js, sqlstm ==> ' + sqlstm );
    
    fab.ties.pool.query( sqlstm ,
            function selectCb(err, rows, fields){
            if (err) throw err;

            var answer = [];
            for ( var row in rows ) { 
                var stringyfied = {}
                  , obj = rows[ row ];
                for ( var name in obj ) stringyfied[ name ] = obj[ name ].toString(); 
                answer.push( stringyfied );
            };
            
            return 'brave new world'; //answer[0]['bifork'];

        }//END SELECTCB
    );//END TIES.POOL.QUERY
    
};
