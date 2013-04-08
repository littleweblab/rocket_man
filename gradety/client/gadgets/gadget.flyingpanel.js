( function ( $ ) {
  $.widget( 'gadget.flyingPanel', {
    ////////
    options: {
    ////////
      containment: 'body'
    , zIndex: 2000
    , width: 450
    , position: {
				my: 'left top'
			, at: 'left bottom'
			, offset: '10 10'
			}//END POSITION
		, afterInit: function ( event, ui ) {}	
    }//END OPTIONS
    
    //////////
    , _create: function () {
    //////////
      this.panel = 
        $( '<div/>' )
          .addClass( 'STICKER-flyingPanel' )
          .appendTo( 'body' )
          .css({ 'display': 'none', 'z-index': this.options.zIndex })
          ;
    }//END CREATE  
    
    ////////
    , _init: function () {      
    ////////    
      this.panel.width( this.options.width )
      this.setPosition();
      this._addDraggable();
      this._trigger( 'afterInit', null, this.ui() ); 
    }//END _INIT
    
    /////////////
    , _setOption: function ( key, value ) { this.options[ key ] = value; }
    /////////////
    
    ////////////////
    , _addDraggable: function () {
    ////////////////
      var o = this.options
        ;
      this.panel
        .draggable( 'destroy' )
        .draggable({ 
          containment: o.containment
        , zIndex: o.zIndex
        })
        ;
    }//END ONDRAGGABLE
    
    
    ///////////////////////////////
    , handleDraggableClickConflict: function ( selector ) {
    ///////////////////////////////
      var self = this
        ;
      $( selector )
        .hover(
          function ( event ) { 
            event.stopPropagation(); 
            self.panel.draggable( 'disable' ); 
          }
        , function ( event ) { 
            event.stopPropagation(); 
            self.panel.draggable( 'enable' ); 
          }
        )//END HOVER 
        ;
    }//END HANDLEDRAGGABLECLICKCONFLICT
      
    //////////
    , addItem: function ( callback, setup ) { 
    //////////
      var setup = setup || {}
        , css = $.extend( true, {}, setup ); delete css.addBorder; delete css.triggerDraggable; delete css.name
        ;
        
      var $item = 
        $( '<div/>' )
            .appendTo( this.panel )
            .addClass( !! setup.addBorder ? 'CONTAINER-flyingPanel STYLE-flyingPanel-border' : 'CONTAINER-flyingPanel' )
            .addClass( setup.name || '' )
            .css( css )
            ; 
        
      if ( ! setup.triggerDraggable ) this.handleDraggableClickConflict( $item );
      callback( $item, this.panel, this.element );
    }//END ADDITEM
    
    ///////
    , show: function () { this.panel.stop().fadeIn( 'fast' ) }
    ///////
    
    ///////
    , hide: function () { this.panel.stop().fadeOut( 'fast' ) }
    ///////
    
    //////////////
    , setPosition: function () { this.panel.position( $.extend( this.options.position, { of: this.element } ) ).fadeOut( 0 ); }
    //////////////
    
    ////////
    , reset: function () { 
    ////////
      var self = this
        , animated = self.panel.find( ':animated' )
        , wait = setInterval( 
            function () {
	            if ( ! animated.is( ':animated' ) ) {
		            clearInterval( wait );
		            self.panel.html( '' );
                self._trigger( 'afterInit', null, self.ui() ); 
              }//END IF
            }
            , 400 
          );//END SETINTERVAL
    }//END RESET
           
    //////////
    , destroy: function () { 
    //////////
      this.panel.remove();
      $.Widget.prototype.destroy.apply( this ); 
    }//END DESTROY
    
    /////
    , ui: function () {  return {  element: this.element, panel: this.panel } }
    /////
    
  })//END WIDGET
  ;
})( jQuery )
; 