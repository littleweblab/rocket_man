( function ( $ ) {
  $.widget( 'gadget.choiceSwitch', {
    ////////
    options: {
    ////////
        choices: []
      , startWith: ''
      , tempo: 500
      , onChoise: function ( event, ui ) { 
          console.log( ui.choise.text() );
        }//END ONCHOISE
      }
    //////////
    , _create: function () {
    //////////    
        this.choiceSwitch =  
          $( '<menu/>' )
            .appendTo( this.element )
            .addClass( 'FUNCTION-choiceSwitch' )
            .wrap( '<div/>' )
              .parent()
              .addClass( 'CONTAINER-choiceSwitch' )
              .end()
              ; 
    }//END CREATE
    
    ////////
    , _init: function () { 
    ////////    
        var o = this.options 
          , choices = this.options.choices
          ;
        
        for ( var i in o.choices ) this._addChoise( o.choices[ i ] ); 
        this._addSlider( o.startWith );  
        this._moveTo( o.startWith, 0 );
    }//END INIT
    
    /////////////
    , _addSlider: function ( name ) {
    /////////////    
        this.slider = 
          $( '<a/>' )
            .addClass( 'ITEM-choiceSwitch-selected' )
            .text( name )
            .appendTo( this.choiceSwitch )
            .wrap( '<li/>' )
              .parent()
              .addClass( 'ITEM-choiceSwitch-selected STICKER' )
              .css({ top: 0, left: 0 })
              ;  
    }//END SLIDER
    
    //////////
    , _moveTo: function ( name, tempo ) {
    //////////    
        this.choise = this.choiceSwitch.find( 'li:contains('+ name +'):not(.ITEM-choiceSwitch-selected)' )
        var pos = this.choise.position().left; 
        
        this.slider
          .animate({ left: pos }, tempo == undefined ? this.options.tempo : tempo )
          .find( 'a:first' )
            .text( name )
            ;
        
        this._trigger( 'onChoise', null, this.ui());   
    }//END _MOVETO
    
    /////////////
    , _addChoise: function ( name ) {
    ///////////// 
      this._bindClick( 
         $( '<a/>' )
           .addClass( 'ITEM-choiceSwitch' )
           .text( name )
           .appendTo( this.choiceSwitch )
           .wrap( '<li/>' )
             .parent()
             .addClass( 'ITEM-choiceSwitch' )
             .end()
       )//END _BINDCLICK
       ;
    }//END ADDCHOISE
    
    /////////////
    , _bindClick: function ( selector ) {
    /////////////    
        var self = this;
        $( selector )
          .bind( 'click.choiceSwitch', function () {
             self._moveTo( $( this ).text() );
          })//END BIND
          ;
    }//END _CLICKBIND
    
    /////////////
    , _setOption: function ( key, value ) { this.options[ key ] = value; }
    /////////////
    
    //////////
    , destroy: function () { 
    //////////    
        this.choiceSwitch.remove();
        $.Widget.prototype.destroy.apply( this ); 
    }//END DESTROY
    
    /////
    , ui: function () { return { element: this.element, slider: this.slider, choiceSwitch: this.choiceSwitch, choise: this.choise } }
    /////
  })//END WIDGET
  ;
})( jQuery )
;