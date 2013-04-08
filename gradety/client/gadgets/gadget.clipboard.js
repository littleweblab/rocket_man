( function ( $ ) {
  $.widget( "gadget.dev_gadgetClipboard", {
    
  options: {
    trash: function( event, ui ) {}
  , trashAccept:'.STICKER, .CONTAINER'
  , thumbs: [ 'Images', 'Pdf', 'Copy', 'Trash' ]
  , type: [ 'clipboard', 'clipboard', 'copy', 'trash' ]
  , clipped: {}
  , target: 'body'
  }
  ////////////
  // CREATE //
  ////////////  
  , _create: function () { 
      var self = this
        , o = this.options; 
      
      //self.helper = $('<div class="FUNCTION-showClipboard"></div>').appendTo( 'body' )
      self.allTumbs = $();
      self.clipboard = $( '<menu class="FUNCTION-clipboard"></menu>' )
                          .appendTo( o.target )
                          .wrap( '<div class="STICKER-clipboard"></div>' )
                          
                            
                          
  }//END CREATE
  ///////////////
  // ADD THUMB //
  ///////////////
  , _addThumb: function ( thumbs ) {
      var self = this
        , o = this.options;

      for ( var t in thumbs ) { 
        var thumb = thumbs[ t ];
        self[ thumb ] =  $( '<li class="ITEM-clipboard"><a class="ITEM-' + o.type[ t ] + '"><span class="ICON-clipboard-' + thumb + '"> ' + thumb  + '</span></a></li>' ).appendTo( self.clipboard );// CREATE THUMB IN DOM
        self.allTumbs.add(  self[ thumb ] );//ADD TO STORAGE OF THUMBS FOR LATER LOOPS
        self[ thumb ].css({ 'margin-top': 69 , 'display': 'none' });// HIDE THUMB
        //self.clipboard.parent().width( self.clipboard.parent().width() + self[ thumb ].width() );
      }//END LOOP
  }//END ADD THUMB
  //////////////////////
  // _BINDMOUSEEVENTS //
  //////////////////////
  , _bindMouseEvents: function ( thumbs ) {
    var self = this
      , o = this.options;
      
    self.helper
          .bind({ 
            'mouseenter.bindMouseEvents.clipboard': function () {
              self.show( thumbs );
            }//END MOUSEENTER 
          , 'mouseleave.bindMouseEvents.clipboard': function () {
              self.hide( thumbs );
            }//END MOUSEENTER
          });//END BIND  
  }//END HIDE THUMBS
  ////////////////////////
  // _UNBINDMOUSEEVENTS //
  ////////////////////////
  , _unbindMouseEvents: function ( thumbs ) {
      self.clipboard
          .parent()
          .unbind( 'bindMouseEvents' );
  }//END UNBINDMOUSE EVENTS
  ///////////////////
  // BINDDROPPABLE //
  ///////////////////
  , bindDroppable: function ( thumbs, funcOver, funcOut, funcDrop, accept ) {
    var self = this
      , o = this.options;
      
    for ( var i in  thumbs ) {
      self[ thumbs[ i ] ].droppable( 'destroy' );
      self[ thumbs[ i ] ].droppable({
        accept: accept
      , over: funcOver[ i ]
      , out: funcOut[ i ]
      , drop: funcDrop[ i ]
      });//END DROPPABLE
    }//END LOOP 
  }//END BINDDROPPABLE
  ,_updateDropableOffset: function ( thumb ) {
    if ( ! thumb.data( 'droppable' ) ) return;
    
    var dropOffset = thumb.data( 'droppable' ).offset
    if ( dropOffset ) { 
      var thisOffset = thumb.offset();
      dropOffset.top = thisOffset.top;
      dropOffset.left = thisOffset.left;
    }//END IF
  }//END UPDATEDROPABLEOFFSET
  ,_filterThumbs: function ( thumbs, filter ) {
    var filteredThumbs = [];
    for ( var i in thumbs ) if ( $.inArray( thumbs[ i ] , filter  ) ==  -1 ) filteredThumbs.push( thumbs[ i ] );
    return filteredThumbs;
  }//END FILTERTHUMBS
  , _init: function () { 
      var self = this
        , o = this.options
        ; 
        
      if ( ! o.disabled ) {
        
        self._addThumb( o.thumbs );
        //self._bindMouseEvents( self._filterThumbs( o.thumbs, [ 'Copy', 'Trash' ] ) );
        //self.show( o.thumbs )
       
      }//END IF
  }//END _INIT
  , ui: function () { return { element: this.element } }
  , setPosition: function () {
    var self = this
      , o = this.options
      , $parent = self.clipboard.parent();
    $parent.css( 'margin-left', - ( $parent.width() /  2 ) - 8 );
  }//END SETPOSITION
  , destroy: function () {}
  , _setOption: function ( key, value ) {
    var self = this, o = this.options;
    this.options[ key ] = value;
  }
  , ui:function(){  return{  element: this.element  } }   
  
  , show: function ( name ) {
    var self = this
      , o = this.options;
    
    if ( ! o.disabled ) {
      self.clipboard.parent().height( 69 ).css( 'z-index', 99999 );
    
      for ( var i in name ) {
        self[ name[ i ] ].css( 'display', 'inline-block' );
        
        self.setPosition();
          
        self[ name[ i ] ]
          .clearQueue()
          .stop()
          .delay( i * 200 )
          .animate(
            { 'margin-top': 10 }
          , 500
          , function () { self._updateDropableOffset( $( this ) ); self.setPosition(); }
          );//END ANIMATE  
      }//END LOOP
    }//END IF
  }//END SHOW
  , hide: function ( name ) {
    var self = this
      , o = this.options;
    if ( ! o.disabled ) {
      for ( var i in name ) {
        self[ name[ i ] ]
          .clearQueue()
          .stop()
          .delay( i * 200 )
          .animate(
            { 'margin-top': 69 }
          , 500
          , function () { 
              self.clipboard.parent().height( 1 ); 
              $(this).css( 'display', 'none' );  
              self.setPosition(); }
          );//END ANIMATE
      }//END LOOP
    }//END IF
  }//END HIDE
});
    
})(jQuery);