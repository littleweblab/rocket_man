var website = require( './frontend.js' );
  
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


fab.pool.query(
 'SELECT * FROM gradety_A0B0C0.pages'
, function ( err, qPages ) {
    website.startProject( 'A0B0C0', 6001, qPages )  
    //website.startProject( 'A0B0C0', 6001, qPages )     
})




//console.log( website.add( 'A0B0C0', 6001 ) );
//console.log( website.add( 'id20', 6002 ).port  );
//console.log( website.remove( 'id10') );
//console.log( website.add( 'id10', 6001 ).port  );