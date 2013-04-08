( function ( $ ) {
  $.widget( "gadget.dev_gadgetRules", {
    options: { 
      borderSize: 0 
      , status : 'editable'
    }
  , _create: function () { this._createOverlay(); }
  , _init: function () { 
      var self = this
        ;
        
      self.status = this.options.status
      self._setSize();
      self._setColor();             
      self._createLink();
      
  }//END _INIT
  , _createLink: function () {
    var self = this
      ;
    
    if ( self.status == 'subGrid' ) {
      
      self.link =  
        $( '<div>' )
          .appendTo( self.element )
          .toggleClass( function () {
            if ( self.size != 'maxi' ) return 'STICKER-subGridButton STYLE-stickerSubGridButton-' + self.size;
            else return 'STICKER-subGridButton';
          })//END TOGGLE
          ;
        
      self._setLink(); 
    }//END IF 
    else {
      
      self.link = 
        $( '<div>' )
          .appendTo( self.element )
          .toggleClass( function () {
            if ( self.size != 'maxi' ) return 'STICKER-rulesButton STYLE-stickerRulesButton-' + self.size;
            else return 'STICKER-rulesButton'
          })//END TOGGLE
          ;
                    
      self._setLink(); 
    }//END ELSE  
  
  }//END _CREATELINK
  , _setSize: function () {
    var self = this
      , w = self.element.parent().width()
      , h = self.element.height()
      ; 
      
    if ( self.status == 'subGrid' ) {
      
      if ( w < 65 || h < 25 ) self.size = 'mini';
      else if ( w < 95 || h < 35 ) self.size = 'medi';
      else self.size = 'maxi';
      
    }//END IF 
    else {  
    
      if ( w < 55 || h < 55 ) self.size = 'mini';
      else if ( w < 55 || h < 55 ) self.size = 'medi';
      else self.size = 'maxi';
    
    }//END ELSE
  
  }//END _SETSIZE
  , _setLinkStatus: function () {
      var self = this
        , link = self.link.find( 'a' )
        ; 
        
      link.attr( 'class', '' );
      
      if (  self.status == 'subGrid' ) {
        
        link
          .addClass( self.size != 'maxi' ? 'BUTTON-flat-black STYLE-toggleeditable-' + self.size + '-' + self.status : 'BUTTON-flat-black STYLE-toggleeditable-' + self.status )
          .text( 'Subgrid' )
          .hover( 
            function ( event ) {
              $( this )
                .css( 'color', '#fbfbfb' ) 
                .text( 'Edit' )
                ;
            }
          , function ( event ) {
              $( this )
                .css( 'color', '#598bca' ) 
                .text( 'Subgrid' )
                ;
            }
          )//END HOVER
          ;
      }//END IF
      else if ( self.size != 'maxi' ) link.addClass( 'BUTTON-toggleeditable STYLE-toggleeditable-' + self.size + '-' + self.status );
      else link.addClass( 'BUTTON-toggleeditable STYLE-toggleeditable-'+ self.status );
  
  }
  , _setLink: function () {
      var self = this
        ; 
      
      self.link.append( '<a/>' );
      self._setLinkStatus();   
      
      if ( self.status == 'subGrid' ) self.link.click( function ( event ) {  event.stopPropagation(); self._trigger( 'subGrid', null, self.ui() ); });
      else if ( self.status !== 'closed' ) {
        self.link
          .click( function () {
            if ( self.status == 'editable' ) {
            
              self.status = 'readonly'; 
              self._trigger( 'readonly', null, self.ui() );  
              self._setColor();
              self._setLinkStatus();   
            
            }//END IF 
            else {
              
              self.status = 'editable';
              self._trigger( 'editable', null, self.ui() );  
              self._setColor();
              self._setLinkStatus();   
            
            }//END ELSE
          })//END CLICK
          ;
      }//END IF
  
  }//END _SETLINK
  , _setColor: function () {
      var self = this;
      self.bar
        .attr( 'class', '' )
        .addClass( 'STICKER-' + self.status )
        ;  
  
  }//END SETCOLOR
  , _createOverlay: function () {
     var self = this
        , o = this.options
        , w = self.element.parent().width()
        , h = self.element.height()
        ; 
       
      self.bar = $( '<div>' )
          .width( w - ( o.borderSize * 2 ) )
          .height( h - ( o.borderSize * 2 ) )
          .appendTo( self.element )
          ;
          
  }//END CREATEOVERLAY
  , _setOption: function ( key, value ) { this.options[ key ] = value; }
  , reset: function () { 
     
      this.removeOverlay();
      this._createOverlay(); 
      this._setSize();
      this._setColor();             
      this._createLink();
  
  }//END RESET
  , removeOverlay: function () {
      
      this.bar.remove();
      this.link.remove();
  
  }//END REMOVE OVERLAY
  , destroy: function () {}
  , ui: function () { return { element: this.element }; }
  });
})( jQuery );