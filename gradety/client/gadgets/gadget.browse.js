( function ( $ ) {
  $.widget( "gadget.dev_gadgetBrowse", {
    options: {
      start: 0
    , move: 216
    , cancel: '.HELPER-browseDontMove'
    //, one: { callback:function(event, ui){console.log( ui)}, style:'panel', back: false, items:'li.ITEM-browse'   }
    //, two: { callback:function(event, ui){console.log( ui)}, style:'panel', back: true,  items:'li.ITEM-browse'    }
    //, three: { callback:function(event, ui){console.log( ui)}, style:'option', back: true, items:'li.ITEM-browse'   }
    //, four: { callback:function(event, ui){console.log( ui)}, style:'option', back: true, items:'li.ITEM-browse'  }  
    }
    , _create: function () { 
      var self = this
        , o = this.options;
      ////////////////////////////////////////
      // CREATE LIST OF COLUMS FROM OPTIONS //
      ////////////////////////////////////////
      self.columnsOpts = $.extend( {}, o );  
      
      delete self.columnsOpts.start;
      delete self.columnsOpts.disabled;
      delete self.columnsOpts.move; 
      delete self.columnsOpts.cancel;
      
      self.current = o.start;//The current column witch is visible in the browsbar 
  
      self.element.html( '<div class="CONTAINER-browse UI-CONTAINER-panel"><div class="GRID-browseBody"></div></div></div>' );//html frame    
      self.browse = self.element.find( '.GRID-browseBody' ); 
      self.scroller = self.element.find( '.CONTAINER-browse' ); 
            
      self.colums = {};//Storage for created columns
      self.number = [];//Storage for positions
      self.last = [];      
      
      self._createColumn(self.columnsOpts);//Function call to create columns
    }//END CREATE
    
    , _init: function () { 
        var self = this
          , o = this.options
          , w = self.element.width();
            
        if ( o.disabled == false ) {
          self.target = self._getColumnAtPosition( o.start ); 
          
          var t = self.target.closest( '.FUNCTION-browse' ).data( 'browseName' );
          self._trigger( [ t + 'onShow' ], null, self.ui() );
          self._move( 0 );
        }//END IF
    }//END INIT
    
    , destroy: function () {
        var self = this
          , o = this.options; 
            
        self.element.remove( ':first' );
        $.Widget.prototype.destroy.apply( this );
    }//END DESTROY
    
    , _setOption: function ( key, value ) {
        var self = this
          , o = this.options
          , opts = {}; 
        
        this.options[ key ] = value;
        opts[ key ] = value;
        /////////////////////    
        // ADD NEW COLUMNS //
        /////////////////////
        if ( $.isPlainObject( value ) ) {
          if ( self[ key ] != undefined ) self.remove( key );
          self._createColumn( opts );
        }//END IF
    }//END _SETOPTION
    
    , remove: function ( name ) {
        var self = this
          , o = this.options
          , n = jQuery.inArray( name, self.number )
          , t;
        
        self.colums[ name ].body.parent().remove();  
        
        delete self.colums[ name ];
        delete self.options[ name + 'onHight' ];  
        delete self.options[ name + 'onShow' ];  
        self.number.splice(n, 1);
    }
    , _createColumn: function ( opts ) {
        var self = this
          , $self = $(this)
          , o = this.options
          , counter = 0
          , col = opts;
          
        for ( var c in col ) {
          var o = col[ c ];
          self.colums[ c ] ={}; //Create columns object
          self.colums[ c ][ 'body' ] = $( '<menu class="FUNCTION-browse LAYOUT-alsoResize"></menu>' );//Create columns html frame
          self.colums[ c ][ 'move' ] = o.moveOnClick;//Save if move on click is enabled 
          self.colums[ c ][ 'back' ] = o.back;
          self.options[ c + 'onHight' ] = o.onHight; 
          self.options[ c + 'onPressBack' ] = o.onPressBack;                        
          self.options[ c + 'onShow' ] = o.onShow;
          ///////////////////////////////////////      
          // CREATE COLUMN WITH POSITION o.pos //
          ///////////////////////////////////////                           
          if ( o.pos !== undefined && o.pos <= ( self.number.length - 1 ) ) {
            $( '<div class="GRID-browseColumn"></div>' )
              .insertBefore( '.GRID-browseColumn:eq(' + o.pos + ')' )
              .append( self.colums[ c ][ 'body' ] );
            
            self.colums[ c ][ 'body' ].data( 'browseName', c );
            self.number.splice( o.pos, 0, c );
          
          } else { // ELSE APPEND
                    
            self.colums[ c ][ 'body' ]
                .appendTo(self.browse)
                .wrap( '<div class="GRID-browseColumn"></div>' )
                .data( 'browseName', c );
            
            self.number.push( c );
          }//END IF/ELSE                         
                
          self.setStyle( c );
          self.colums[ c ][ 'content' ] = o.content;
          
          if ( o.items !== undefined ) self.delegateMove( c, o.items );
          //END IF  
          counter++;     
        }//END LOOP
    }//END CREATE COLUMN
    , delegateMove: function ( col, item, target ) {
        var self = this;
        self.colums[ col ][ 'body' ]
            .undelegate('click')
            .delegate( item , 'click.browse', {moveTo: target } ,function () { 
              var $this = $( this ); 
              if ( target !== undefined  ) self.colums[ col ][ 'move' ] = target;
              if ( ! $this.is( '.Back, ' + self.options.cancel ) && ! $this.children().is('.Back, ' + self.options.cancel ) && self.options.disabled == false ) {
      
                self.trigger = $this;
      
                if ( self.colums[ col ][ 'move' ] !== false ) {
                  if ( self.colums[ col ][ 'move' ] !== true ) self.browseTo( self.colums[ col ][ 'move' ] ); 
                  else self.browseNext( col ); 
                };//END IF/ELSE IF/ELSE  
              }//END IF
            });//END DELEGATE
    }//END DELEGATEMOVE    
    , createBack: function ( c ) {
        var self = this
          , columnBack = self.colums[ c ][ 'back' ];
      
        if( ! columnBack ) return;
        self.colums[ c ].body.find('.ITEM-browse > a.Back').remove();
        self.colums[ c ][ 'backButton' ] = 
          $( '<li class="ITEM-browse"><a class="ITEM-browse Back STYLE-itemBrowseBigLetter"><span class="STICKER-browseBackArrow ICON-whiteArrowLeft-mini"></span>Back</a></li>' )
          .prependTo( self.colums[ c ].body )
          .bind( 'click.browse', function () {  
            targetColumn = self.last[ self.last.length - 1 ]; 
            self.trigger = $( this );
            self.browseTo( self._getColumnAtPosition( targetColumn ).closest( '.FUNCTION-browse' ).data( 'browseName' ) ); 
          });//END BIND
       
    }//END CREATE BACK
    , setStyle: function ( name ) {
        var self = this, o = this.options; 
        switch( o[ name ].style ) {
          case 'option': self.colums[ name ][ 'body' ].addClass( 'UI-CONTAINER-option' );
          break;
          case 'panel': self.colums[name]['body'].addClass('UI-CONTAINER-panel');
          break;
          default: self.colums[name]['body'].addClass('UI-CONTAINER-panel');
          break;
        }//END SWITCH
    }//END SETSTYLE

    , _move: function ( pos ) {
        var self = this, o = this.options, current = ( pos - self.current );
        self.scroller.animate({ scrollLeft: pos * o.move  }, 250, function () {} );

        var allreadyExists =  $.inArray( pos, self.last );
        if ( allreadyExists !== -1 && self.last.length > 1 ) self.last = self.last.slice( 0 , allreadyExists );//if new position is before the current postion hitory will be reduced to the index of the new position  
        else if ( self.current !== pos ) self.last.push( self.current );//add column to history if browsebar has moved to another position
        // console.log( self.last, exist )
        self.current = pos;
    }//END MOVE
    
    , _getColumnAtPosition: function ( n ) {
        var self = this
          , o = this.options;
        
        return self.browse.find( '> :eq(' + n + ')' ).children( ':first' );
    }//END _GETCOLUMNATPOSITION

    , browseNext: function ( name ) {
        var self = this
          , o = this.options
          , n = $.inArray( name, self.number )
          , t;
             
        if ( o.disabled == false ) {
          self.target = self._getColumnAtPosition( n + 1 ); 
          t = self.target.closest( '.FUNCTION-browse' ).data( 'browseName' );
          
          self.createBack( t );
          self._trigger( [ name + 'onHight' ], null, self.ui() );
          self._trigger( [ t + 'onShow' ], null, self.ui() );
         
          self._move( n + 1 );
          self.trigger = undefined;
        }
    }//END BROWSENEXT
    , browseTo: function( name ) {
        var self = this
          , o = this.options
          , n = $.inArray( name, self.number )
          , current = self._getColumnAtPosition( self.current ).closest( '.FUNCTION-browse' ).data( 'browseName' )
          , t;
             
        if ( o.disabled == false ) {
        
          self.target = self._getColumnAtPosition( n );  
          t = self.target.closest( '.FUNCTION-browse' ).data( 'browseName' );
          
          self.createBack( t );
          
          self._trigger([ current + 'onHight' ], null, self.ui() );
          self._move( n );
          self._trigger([ t + 'onShow' ], null, self.ui() );
          
          self.trigger = undefined;
        }//END IF   
    }//END BROWSETO
    
    , update: function () {
        var self = this
          , o = this.options
          , current = self._getColumnAtPosition( self.current ).closest( '.FUNCTION-browse' ).data( 'browseName' );
        if ( o.disabled == false ) self._trigger([ current + 'onShow' ], null, self.ui() );
    }//END UPDATE
    , getColumnInDom: function ( name ) {
      var self = this
        , n = $.inArray( name, self.number )
        , current  = self._getColumnAtPosition( n );
      return current;
    }//END GETCOLUMNINDOM
    
    , current: function () {
        var self = this,current  = self._getColumnAtPosition( self.current );
        return current; 
    }
    , ui: function () { 
        var self = this
          , current = self._getColumnAtPosition( self.current );
          
        return {  
          element: this.element
        , trigger: this.trigger
        , target: this.target
        , back: self.back
        , current: current
      
        };//END RETURN
    }//END UI
  });//END WIDGET
})(jQuery);


























