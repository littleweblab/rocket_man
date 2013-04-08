( function ( $ ) {
  $.widget( 'gadget.dev_gadgetAccordion', {
    options: {
      open: true
    , hideAttributes: {'height':0,'min-height':0}
    , onHide: function () {}
    , onShow: function () {}
    }//END OPTIONS
  
  //////////
  , _create: function () {}
  //////////
  
  ////////
  , _init: function () { 
  ////////
      var o = this.options;
        
      this.accordion = this.element.next();
      this.accordion.css( 'overflow', 'hidden' );

      if ( ! o.open ) this.accordion.css( o.hideAttributes );
      else this._setArrow( true );
      this._bindToggler();
  }//END INIT
  
  ///////////////
  , _bindToggler: function () {
  ///////////////
      var self = this;
      this.element
        .bind(
            'click.accordion'
          , function() {
              if ( self.accordion.height() == 0 ) self.show();  
              else self.hide();  
            }//END CALLBACK
        )//END BIND
        ;
    }//END _BINDTOGGLER
  
  ////////////  
  , _setArrow: function ( open ) {
  ////////////
      var $arrow = this.element.find( 'span' );
      
      $arrow.toggleClass( 'ICON-greyArrowRight-mini', !open );
      $arrow.toggleClass( 'ICON-greyArrowBottom-mini', open );
    }//END _SETARROW
  
  /////////////
  , _setOption: function ( key, value ) {
  /////////////      
      this.options[ key ] = value;
      this._init();
    }// END _SETOPTIONS
  
  /////////////  
  , _getHeight: function () {
  /////////////
      var height = 0;   
      this.accordion.find( '> *:visible').each( function () { height = height + $( this ).height() }); 
      return height;
    }//END GETHEIGHT
  
  ///////////////
  , updateHeight: function () { this.element.next().height( this._getHeight() ); }
  ///////////////
  
  ///////
  , show: function () {
  ///////
      var self = this
        , o = this.options
        ;
      
      if ( o.disabled == false ) {
        this._trigger( 'beforeShow', null, this.ui() ); 
        this._setArrow( true );
        
        self.accordion
          .stop()
            .animate(
              { 'height': self._getHeight() }
            , function () { self._trigger( 'afterShow', null, self.ui() ); }
            )//END ANIMATE
            ;
      }//END IF
    }//END SHOW
  
  ///////
  , hide: function () {
  ///////
      var self = this
        , o = this.options
        ;
        
      if ( o.disabled == false ) {
        self._trigger( 'beforeHide', null, self.ui() ); 
        self._setArrow( false ); 
        
        self.accordion
          .stop()
            .animate( 
              o.hideAttributes
            , function () { self._trigger( 'afterHide', null, self.ui() ); }
            )//END ANIMATE
            ;
      }//END IF
    }//END HIDE
  
  /////
  , ui: function () { return { element: this.element, accordion: this.accordion, toggle: this.element.next() }; }
  /////
  
  //////////
  , destroy: function () {
  //////////
      this.accordion.css( 'overflow', 'auto' );
      this.element.unbind('.accordion');
      $.Widget.prototype.destroy.apply(this);
    }//END DESTROY
  })
  ;
})( jQuery )
;