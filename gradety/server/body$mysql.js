module.exports = function body$mysql ( write, count ) {
  
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
}
