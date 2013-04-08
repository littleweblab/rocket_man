( function ( $ ) {
  $.widget( 'gadget.dev_gadgetLayout', {
    
    ////////
    options: {
    ////////
          
      ///////
      height: { 
      ///////
        menu: 34
      , toolBar: 15 
      , help: 132
      , edit: 'flex' 
      }//END HEIGHT
      
      //////
    , width: {
      //////
        setup: 35
      , stage: 'flex'
      , browse: 216
      }//END WIDTH
      
      ///////
      , show: [ 'menu', 'toolBar', 'help', 'edit', 'setup', 'stage', 'browse' ]
      ///////
    }//END OPTIONS
    
    ////////
    , _init: function () {
    ////////  
      
      var self = this;
      
      this.$ui = $( '.UI' ).width( '100%' ).height( '100%' );
      
      this.$ui.ajaxComplete( function () { self.update(); });
      this.window = $( window ).bind( 'resize.layout', function ( event ) { self.update() });
      
      /////////////////
      // DEFINE ROWS //
      /////////////////
      this.options.$rows = { 
        menu: $( '.GRID-panelMenu' )//.css({ zIndex: 1 }) //< needed for focus
      , toolBar: $( '.GRID-panelToolbar' )//.css({ zIndex: 1 })
      , help: $( '.GRID-panelHelp' )//.css({ zIndex: 1 })
      , edit: $( '.GRID-panelEdit' ).css({  whiteSpace: 'nowrap'  })//.css({ zIndex: 1 })
      }//END ROWS
        
      ////////////////////
      // DEFINE COLUMNS //
      ////////////////////
      this.options.$columns = { 
        setup: $( '.GRID-panelSetup' ).css({ whiteSpace: 'normal' })
      , stage: $( '.GRID-panelStage' ).css({ whiteSpace: 'normal' })
      , browse: $( '.GRID-panelBrowse' ).css({ whiteSpace: 'normal' })
      }//END COLUMNS
      
      this._show();
      
     
      
      
    /*
      var $window = $( window )
        , windowHeight = $window.height()
        , $stickyEl = $( '.GRID-panelStage' )
        , elWidth = $stickyEl.outerWidth( true )
        , leafBottomLine
        ; 
        
        
      $window.scroll( function () { 
        var $focus = $( 'body' ).data( 'gadgetFocus' );
        if ( ! $focus.length ) return;
        
        var windowTop = $window.scrollTop();
        
        if ( leafBottomLine === undefined ) leafBottomLine = $focus.offset().top + $focus.outerHeight( true );
        
        if ( leafBottomLine > windowTop + windowHeight ) { 
            $stickyEl
              .css({ position: 'fixed', top: $stickyEl.offset().top - windowTop })
              .next()
                .css( 'margin-left', elWidth ) 
                ;
        }//END IF 
        else {
          $stickyEl
            .css({ position: 'relative', top: 'auto' })
              .next()
                .css( 'margin-left', 0 ) 
                ;
              
              leafBottomLine = undefined;
        }//END ELSE
      })//END SCROLL
      ;
    
   */
   
   /*
     var $window = $( window )
       , $stickyEl = $( '.GRID-panelStage' )
       , elTop = $stickyEl.offset().top
       , offS = 0
       ;
     
     $window.scroll( function () {
      var $focus = $( 'body' ).data( 'gadgetFocus' );
      

      
      
      if ( ! $focus.length ) return; 
    
        var windowTop = $window.scrollTop()
        , x = $stickyEl.offset().top - $focus.offset().top + 10
        , leftTop = windowTop > ( elTop + Math.abs( x ) )
        , leftBottom = windowTop + $window.height() < $focus.offset().top + $focus.outerHeight( true )    
        ;
         
     
      if ( leftBottom ) {
        $stickyEl.css({ position: 'fixed', top: windowTop  - $stickyEl.offset().top })
        
      } else {
        
       // $stickyEl.css({ position: 'fixed', top: x })
        
        
      }
      if ( leftTop ) {
        $stickyEl
          .css({ position: 'fixed', top: x })
          .next()
            .css( 'margin-left', $stickyEl.outerWidth( true ) )
            ;
      
      }//END IF
      
      else {
          $stickyEl.css({ position: 'relative', top: 'auto' }).next().css( 'margin-left', 0) ;
      } 
     
      });  */
     
    }//END INIT
    
    
    
    
    //////////
    , _create: function () {}
    //////////
    
    ////////
    , _show: function () {
    ////////    
        var show = this.options.show;
        
        for ( var row in this.options.$rows  ) { 
          if ( $.inArray( row, show ) != -1 ) {
            this.options.$rows[ row ]
              .css( 'display', 'block' )
              .height( this.options.height[ row ] == 'flex' ? this._getFlexHeight( this.options.$rows[ row ] ) : this.options.height[ row ] )
              ;
          }//END IF 
        }//END LOOP
        
        for ( var column in this.options.$columns  ) {  
          if ( $.inArray( column, show  ) != -1 ) { 
            this.options.$columns[ column ]
              .css( 'display', 'inline-block' )
              .width( this.options.width[ column ] == 'flex' ? this._getFlexWidth( this.options.$columns[ column ] ) : this.options.width[ column ] )
              ;
           }//END IF
        }//END LOOP
      }//END SHOW
    
    ///////////////
    , _setUiHeight: function () {
    ///////////////
        var height = 0
          , windowHeight = $( window ).height()
          ;
        for ( var row in  this.options.$rows ) height = height + this.options.$rows[ row ].outerHeight( true ); 
        return windowHeight > height ? windowHeight : height;  
    }//END SET UI HEIGHT
    
     
    /////////////////////
    , _getHeighestHeight: function ( $column ) {
    /////////////////////  
        var heigestHeight = 0
          , parentMinHeight = this._getFlexHeight( this.options.$rows.edit )
          ;
       
        $column
          .siblings( ':not(.STICKER-given)' )
          .andSelf()
            .each( function () {
              var singleHeight = 0;
              $( this )
                .find( '> * > *' )
                  .each( function () {
                    $this = $( this ); 
                    if ( $this.is( ':visible' ) ) { singleHeight = singleHeight + $this.outerHeight( true ); }
                  });
              
              if ( heigestHeight < singleHeight ) heigestHeight = singleHeight;
            })//END EACH
            ;
        return parentMinHeight < heigestHeight ? heigestHeight : parentMinHeight;
    }// _GETHEIGHESTHEIGHT
      
    ////////////////  
    , _getFlexHeight: function ( $column ) {
    ////////////////
        var height = 0;
        
        $column.siblings().each( function () {
           var $this = $( this );
           if ( $this.css( 'display' ) == 'block' ) height = height +  $this.height()
        });
        
        return $( window ).height() - height;
    }//END _GETFLEXHEIGHT
    
    /////////////  
    , _getFlexWidth: function ( $row ) {
    /////////////
        var width = 0;
        $row.siblings().each( function () {
           var $this = $( this );
          if ( $this.css( 'display' ) == 'inline-block' ) width = width + $this.width()
        });
        
        return this.$ui.width() - width;
    }//END _GETFLEXWIDTH

    /////////
    , update: function () {
    /////////    
        var newHeight = this._getHeighestHeight( this.options.$columns.stage );
        
        this._show();
        
        for ( var column in this.options.$columns ) {
          this.options.$columns[ column ].height( newHeight )
          var $child = this.options.$columns[ column ].find( '> *:first' );
          $child.height( newHeight - ( $child.outerHeight( true ) - $child.height() ) );
        }//END LOOP
        
        this.options.$rows.edit.height( newHeight );
        this.$ui.height( this._setUiHeight() );
        this._show();
    
    }//END UPDATE
    /*
    
    //////////////////
    , setStickyElement: function ( $focus ) {
    //////////////////  
        
        var $window = $( window )
          , windowHeight = $window.height()
          , $stickyEl = this.options.$columns.stage 
          , stickyElTop = $stickyEl.offset().top
          , stickyElWidth = $stickyEl.outerWidth( true )
          , focusTop = $focus.offset().top
          , focusHeight = $focus.outerHeight( true )
          , leaveBottomBorderLine = $focus.offset().top + $focus.outerHeight( true )
          ;
        
        function clean ( m ) {
          //if ( m == mode ) return;
          console.log( 'clean', m );
          $stickyEl
            .css({ position: 'relative', top: 'auto' })
            .next()
              .css( 'margin-left', 0 ) 
              ;
              
         // mode = m; 
          
        }
        
        $window.bind( 'scroll.layout', function () {
          var windowTop = $window.scrollTop()
            , leaveTopHoldPosition = ( stickyElTop - focusTop + 10 ) 
            , leaveTopBorderLine = windowTop > ( stickyElTop + Math.abs( leaveTopHoldPosition ) )
            ;
           
          
                  
          if ( leaveBottomBorderLine > windowTop + windowHeight  ) {
            console.log('TOP')
            
            $stickyEl
              .css({ position: 'fixed', top: $stickyEl.offset().top - windowTop })
              .next()
                .css( 'margin-left', stickyElWidth ) 
                ;
          }//END ELSEIF
          
          else if ( leaveTopBorderLine ) {
            console.log('BOTTOM')
            $stickyEl
              .css({ position: 'fixed', top: leaveTopHoldPosition  })
              .next()
                .css( 'margin-left', stickyElWidth )
                ; 
          }//END IF

          else {
            clean();  
          }//END ELSE  
        })//END BIND
        ;
       
    }//END FIXSTAGEONFOCUS
    */
    //////////
    , destroy: function () {
    //////////
        $.Widget.prototype.destroy.apply( this );
    }//DESTROY END
      
    , _setOption: function ( key, value ) {
        this.options[ key ] = value;
        this._init();
    } // SET OPTIONS END
  , ui: function () { return { element: this.element } }
 

    })//END WIDGET
    ;
    
})( jQuery )
;