var util = require( 'util' )
  , EventEmitter = require( 'events' ).EventEmitter
  , MySQLPool = require( 'mysql-pool' ).MySQLPool
  ;

function Ties ( namespace ) {
  this.pool = new MySQLPool({ database: "gradety_master" });
  this.pool.properties.host = '127.0.0.1';
  this.pool.properties.user = 'root';
  this.pool.properties.password = '';
  this.databasenamespace = ( namespace ) ? namespace + '_' : 'gradety_';
  //console.log( 'ties, namespace ==> ' + namespace + ' :: ', this.databasenamespace );
};

util.inherits( Ties, EventEmitter );
module.exports = Ties;

Ties.prototype.bind = function ( count ) {
  var self = this;
  //console.log('ties.js, inspect self ==> \n',util.inspect(self));
  self.freeties = count;
  self.maxties = count;
  self.pool.connect( count, function ( err, numberofties ) { 
    if ( err ) throw err;
    self.maxties = numberofties;
    console.log( 'ties, numberofties ==> ', numberofties );
  });
  console.log( 'ties bind connections count ==> ', count );
  //console.log('ties.js, inspect pool ==> \n',util.inspect(self.pool));
}

Ties.prototype.getties = function getties(cb){
  var self = this;
  //console.log('ties.js, inspect self ==> \n',util.inspect(self));
  if ( cb ) {}
  return this.pool;
}
