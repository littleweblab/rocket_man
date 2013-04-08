( function ( $ ) {
  $.widget( 'gadget.dev_gadgetRename', {
    options: {    
      maxSigns: 25
    , save: function ( event, ui ) { alert( ui.oldName + ui.newName ); }
    , onStart:function () {}
    , onStop:function () {}
    , highlightClass: 'FUNCTION-rename'
    }
    , _create: function () {}
    , _init: function () { this._bindClickEvents(); }

    , _setOption: function ( key, value ) {
        this.options[ key ] = value;
        if ( key = 'disabled' && value == false ) this._unbind()
        else this._bindClickEvents();
    }//END SETOPTIONS
    
    , _bindClickEvents: function () {
        var self = this
          , o = self.options
          ; 
          self.element.bind({
            'click.rename': function ( event ) {
              
              self._trigger( 'onStart', event, self.ui());
              //event.stopPropagation(); 

              if ( $( event.target ).attr( 'contentEditable' ) !== 'true' ) $( 'body' ).trigger( 'click' ); 
            }//END CLICK.RENAME
          , 'dblclick.rename': function ( event ) {
              self.toRetore = self.element.text();    
              self.toggleEditable();
              self._bindClickOutside();
            }//END DBLCLICK.RENAME
          , 'keypress.rename': function ( event ) {
              if ( self.element.text().length -1  >= o.maxSigns ) event.preventDefault();
              // PRESSING ENTER
              if ( event.which == 13 ) $( 'body' ).trigger( 'click' );//trigger clickoutside event  
              return event.which != 13;
            }//END KEYPRESS.RENAME
          });//END BIND
    }//END _BINDCLICKEVENTS
    
    , _bindClickOutside: function () {
        var self = this
          ;
        self.element.bind({ 
          'clickoutside.rename' : function ( event ) {
            if ( self.element.text().length == 0 ) self.restoreName();    
            self.toggleEditable();
            self.element.unbind( 'clickoutside.rename' );
            if ( self.toRetore !== self.element.text() ) self._trigger( 'save', null, self.ui() );
            self._trigger( 'onStop', null, self.ui() );
          }//END CLICKOUTSIDE.RENAME
        });//END BIND
    
    }//END _BINDCLICKOUTSIDE
    
    , _unbind: function () {  this.element.unbind( '.rename' ); }
    
    , restoreName: function () { this.element.text( this.toRetore ) }//END RESTORE NAME
    
    , toggleEditable: function () {
        if ( this.element.attr( 'contentEditable' ) == 'true' ) { 
          this.element
              .attr( 'contentEditable', 'false' )
              .removeClass( this.options.highlightClass )
              ;
        } else {
          this.element
              .attr( 'contentEditable', 'true' ) 
              .addClass( this.options.highlightClass )
              ;
        }//END IF/ELSE               
    }//END TOGGLEEDITABLE
    
    , ui: function () {  return{  element: this.element, newName: this.element.text(), oldName: this.toRetore } }
    
    , destroy: function () {
         this._unbind();
        $.Widget.prototype.destroy.apply( this );
    }//END DESTROY     
  })
  ;  
})( jQuery )
;
