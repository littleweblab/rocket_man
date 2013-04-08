console.log( '\n::::::::::> Gradety ( Rocketman ) app.js started <::::::::::::' );
//require('./create_static_css')
fab = require( 'fab.server' );
dir = __dirname; 
////////////////////////////////////////////////////////////////////////////////////
// establish some permanent sql- database connections (clients in node-mysql)     //
// so called sqlties, inherited from class Ties                                   //
// SQL-Users are not the gradety-users, they organized through table members      //
//                                                                                //
// invoke the sql-input-output-system via class SQLIOS with methods:              //
// -select -update -blob -script                                                  //  
////////////////////////////////////////////////////////////////////////////////////
inspect = require( 'util').inspect
Ties = require( './mysql_ties')
sqlties = new Ties( 'gradety')
SQLIOS = require( './mysql_ios')
sqlios = new SQLIOS();

//console.log('app.js, inspect Ties ==> ',inspect(Ties));
//console.log('app.js, inspect SQLIOS ==> ',inspect(SQLIOS));

///////////////////////////////////////////////////
// CREATE n possible bindings to the sql-server  //
///////////////////////////////////////////////////
sqlties.bind( 3 );
/////////////
// EXPORTS //
/////////////
with( fab )( server )
( require( './server/body' )
, require( './server/body$head' )
, require( './server/body$ajax' )
, require( './server/body$design' )
, require( './server/body$files' )
, require( './server/body$files$table' )
, require( './server/body$modeswitch' )
, require( './server/body$design$wizzard' )
, require( './server/body$css' )
, require( './server/body$mysql' )

)
;