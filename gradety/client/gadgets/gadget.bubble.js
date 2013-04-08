///////////////////////
// GADGET BUBLE      //
///////////////////////
( function ( $ ) { 
  $.widget( "gadget.dev_gadgetBubble", {
    options: {
        mouseEvent: true
      , setPosition: {
          of: false
        , my: 'left bottom'
        , at: 'right top'
        , offset: '-28px 18px'
        , collision: 'none none'  
      }//END SET POSITION
      , action: function ( event, ui ) {
          ui.element.bind({    
            'mouseenter.bubble': function () { ui.self.show( 600 ); }
          , 'leaveTop.bubble': function () { ui.self.hide( 300 ); }
          , 'leaveBottom.bubble': function () { ui.self.hide( 0 ); }
          , 'leaveLeft.bubble': function () { ui.self.hide( 0 ); }
          , 'leaveRight.bubble': function () { ui.self.hide( 0 ); }
          });//END BIND
      
          ui.bubble.bind({     
            'mouseenter.bubble':  function(){  ui.self.show( 0 );  ui.element.dev_gadgetSplit( 'show' ); ui.element.dev_gadgetMedithumb( 'show' ); }
          , 'mouseleave.bubble':  function(){  ui.self.hide( 0 );  ui.element.dev_gadgetSplit( 'hide' ); ui.element.dev_gadgetMedithumb( 'hide' ); }
          });//END BIND
      }//END ACTIONS
    }//END OPTIONS
    , _create: function () { 
        var e = this.element; 
        var menuOptions = $.extend( {}, this.options, { type: 'medithumb', element: e  } );  
        delete menuOptions.disabled;
        delete menuOptions.mouseEvent;
        delete menuOptions.position;
           
        this.options.setPosition.of = this.element; 
        this.bubble = $( '<div class="STICKER TakeMyKidsWidth"></div>' )
                        .appendTo( 'body' )
                        .append( '<div class="STICKER-mediBubbleDott">'
                              + '<div class="CONTAINER-mediBubbleDott"></div>'
                              + '</div>'
                              + '<div class="STICKER-littleBubbleDott">'
                              +'<div class="CONTAINER-littleBubbleDott"></div>'
                              +'</div>'
                              +'<div class="CONTAINER-bubble"><div></div></div>'
                        )
                        .find( '.CONTAINER-bubble > div' )
                          .dev_gadgetMenu( menuOptions )
                          .end()
                        .css({'display':'none', opacity:0, width: 70,  height: 37, 'z-index':10003 })
                        ;
    }//END _CREATE
    , _init: function () { 
        var self = this
          , o = this.options
          ;
        
        this.bubble.position( o.setPosition );
        if ( this.options.mouseEvent == true && this.options.disabled == false ) this._trigger( 'action', null, this.ui() ); 
      
        $( window ).resize( function() {
          self.bubble.css({ 'display': 'inline-block' }); 
          self.bubble.position( self.options.setPosition );
          self.bubble.css({ 'display': 'none' }); 
        });
    }//END _INIT
    , _setOption: function ( key, value ) {
        this.options[ key ] = value;
        if ( key !== 'setPosition') {
          this._unbind();
          if ( this.options.mouseEvent == true && this.options.disabled == false ) this._trigger( 'action', null, this.ui() ); 
        
          var menuOptions = $.extend( {}, this.options, { type: 'medithumb' } );  
          delete menuOptions.disabled;
          delete menuOptions.mouseEvent; 
          delete menuOptions.position;
        
          this.bubble
              .find('.CONTAINER-bubble > div')
              .dev_gadgetMenu(menuOptions).dev_gadgetMenu( 'option', menuOptions )
              ;
        }//END IF
         //this.options.position.of = self.element 
    }//END SET OPTIONS
    , _unbind: function () {
        this.bubble.unbind( '.bubble' );
        this.element.unbind( '.bubble' ); 
    }//END UNBIND
    , destroy: function () { 
        this.bubble.stop();
        this._unbind();
        this.bubble.remove();
        $.Widget.prototype.destroy.apply(this);
    }//END DESTROY
    , ui: function () { return { bubble: this.bubble,  element: this.element, self:this }; }
    , show: function ( tempo ) {
        if ( this.options.disabled == false ) {
      
          var self= this
            , o = self.options
            ;
          
          self._trigger( 'onShow', null, self.ui() ); 
          self.bubble
              .clearQueue()
              .stop() 
              .delay( tempo )   
              .animate({ 
                paddingBottom: [ 27, 'easeOutBack' ]
              , paddingLeft: [ 15, 'easeOutBack' ]
              , opacity: 10 
              }
              , { duration: 700
                , step: function () {
                    var $this = $( this );    
                    $this.css( { 'display': 'block' }); 
                    $this.position( o.setPosition );
                  }//END FUNCTION
              })//END ANIMATE     
              .find( '.STICKER-mediBubbleDott' )
                .css({
                  left: 6
                , top: 'auto'
                , bottom: '25%'
                })//END CSS
                .end()
              .find( '.STICKER-littleBubbleDott' )
                .css({
                  left: 0
                , top: 'auto'
                , bottom: '5%'
                })//END CSS
                ;            
        }//END IF
    }//END SHOW
    , hide: function ( tempo ) {
        if ( this.options.disabled == false ) {
          var self = this
            , o = self.options;
          
          self._trigger( 'onHide', null, self.ui() ); 
          self.bubble 
              .clearQueue()
              .stop()
              .delay( tempo )
              .animate({ 
                  paddingBottom: 0
                , paddingLeft: 0
                , opacity: 0 
                }
              , { duration:300
                , step: function () { 
                    var $this = $( this );    
                    $this.css({ 'display': 'block' }); 
                    $this.position( o.setPosition );   
                }//END FUNCTION
              , complete: function () { $( this ).css( 'display', 'none' ); }
              });//END ANIMATE
        }//END IF
    }//END HIDE
  }); 
})(jQuery);


