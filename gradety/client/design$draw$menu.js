( function ( $ ) {
  $.widget( "gadget.menu", {
    options: {
      deep: 1
    , level: 1
    , type: 'horizontal'
    , buttons: [ 'First', 'Item', 'One', 'Last' ]
    , stadi: [ 'default', 'selected', 'hover', 'sub' ] 
    , viewStadi: 'default'
    , viewDeep: 1 
    , sampleTree: {
       Company: { One:{}}
     , CEO: {}  
     , Services: {
          Something: {}
        , AnotherThing: {}
        , MoreThings: {
             Pink: {}
           , Green: {}
           , Yellow: {}
        }
     }
     , Contact: {}   
    }
    , task: {
        //////////////
        // VERTICAL //
        //////////////
        vertical: {
          defaultStyles: {
            'margin-top': '0px'
          , 'margin-right': '0px'
          , 'margin-bottom': '0px'
          , 'margin-left': '0px'
          , 'padding-top': '5px'
          , 'padding-right': '10px'
          , 'padding-bottom': '5px'
          , 'padding-left': '10px'
          , 'background-color': '#9e9e9f'
          , 'font-family': 'Arial, sans-serif'
          , 'font-weight': 'normal'
          , 'font-style': 'normal'
          , 'font-size': '14px'
          , 'color': '#ffffff'
          }//END DEFAULT STYLES
          , filter: true
          , scriptNeeded: false
          , script: function () {
              ( function( $ ) {
                $.fn.verticalMenu = function () {
                    return this.each( function ( i ) {
                      $( this ).find( 'menu:visible' )
                        .find( 'a' )
                          .click( function () {
                            var $this =  $( this )
                               , $menu = $this.next( 'menu' )
                               , $selected = 
                                  $this
                                    .parent()
                                      .siblings()
                                        .children()
                                          .filter( function () { return $( this ).attr( 'class' ).match( 'selected' ) != null || $( this ).attr( 'class' ).match( 'sub' )  ? true : false  } ) 
                                          ;
                            /////////////////////
                            // REMOVE SELECTED //
                            /////////////////////
                            if ( $selected.length ) { 
                              $selected
                                .attr( 'class',  $selected.attr( 'class' ).replace( 'selected', 'default' ).replace( 'sub', 'default' ) ) 
                                .next( 'menu' )
                                .css( 'display', 'none' )
                                ;
                            }//END IF
                            
                            /////////////////////////////
                            // HEIGHLIGHT NEW SELECTED //
                            /////////////////////////////
                            $this.attr( 'class', $this.attr( 'class' ).replace( 'default', $menu.length ? 'sub' : 'selected' ) );
                            $menu.css( 'display', 'block' );
                          })//END CLICK
                          .end()
                          .find( 'menu' ).css( 'display', 'none' ) 
                          ;
                    })//END EACH
                    ;
                }//END $.FN.VERTICALMENU
                ;
              })( jQuery )//END PLUGIN
              ;
          }
          , '0':{
                              
              action: function ( ui ) {
                  ui.element
                    .find( 'menu' )
                    .fadeIn( 0 )
                      .eq( ui.deep )
                      .fadeOut( 0 )
                      ;
              }//END ACTION
              , styles: {
                 ////////////
                 // BUTTON //
                 ////////////
                  first: {}//END FIRST
                , item: {}//END DEFAULT
                , last: {}//END LAST
                , one: {}//END ONE
                ///////////
                // STADI //
                ///////////
                , default: { 
                    'background-color': '#a9b3be'
                  , 'font-weight': 'bold'
                  , "margin-bottom": "1px" 
                }//END DEFAULT
                , selected: { 
                    'background-color': '#353535'
                  , 'color': '#fff'
                  , 'font-weight': 'bold'
                  , 'color':  '#7a7a7b' 
                  , 'margin-bottom': '1px' 
                }//END SELECTED
                , hover: { 
                    'background-color': '#ffffff'
                  , 'color': '#7a7a7b'
                  , 'font-weight': 'bold' 
                  , 'padding-bottom': '6px' 
                }//END HOVER
                , sub: { 
                    'background-color': '#333334'
                  , 'font-weight': 'bold'
                  , 'color': '#7a7a7b'
                  , 'border-bottom-color': '#4b4b4c'
                  , 'border-bottom-style': 'dotted'
                  , 'border-bottom-width': '2px'
                  , 'margin-bottom': '0px'
                  , 'padding-bottom': '4px'
                 }//END SUB
              }//END STYLES
              , direction: 'vertical'  
            }// END 0
          , '1':{
              action: function ( ui ) {
                ui.element
                  .find( 'menu' )
                  .fadeIn( 0 )
                    .eq( ui.deep )
                    .fadeOut( 0 )
                    ;
              }//END ACTION
              , styles: {
                ////////////
                // BUTTON //
                ////////////
                
                  first: { color: '#999999', 'padding-top': '12px' }//END FIRST
                , item: { color: '#999999'}//END DEFAULT
                , last: { color: '#999999', 'margin-bottom': '1px', 'padding-bottom': '24px' }//END LAST
                , one: { color: '#999999' }//END ONE
                ///////////
                // STADI //
                ///////////                
                , default: { 'background-color': '#333334' }//END DEFAULT
                , selected: { 'background-color': '#282828' }//END SELECTED
                , hover: { 'background-color': '#49494a' }//END HOVER
                , sub: { 
                    'background-color': '#4b4b4c' 
                  , 'border-bottom-color': '#4b4b4c'
                  , 'border-bottom-style': 'dotted'
                  , 'border-bottom-width': '1px'
                }//END SUB
              }//END STYLES 
              , direction: 'vertical'  
            }//END 1
          , '2':{
              action: function ( ui ) {
                ui.element
                  .find( 'menu' )
                  .fadeIn( 0 )
                    .eq( ui.deep )
                    .fadeOut( 0 )
                    ;
              }//END ACTION
              , styles: {
                ////////////
                // BUTTON //
                ////////////
                  first: { 'padding-top': '6px' }//END FIRST
                , item: {}//END DEFAULT
                , last: { 'padding-bottom': '12px'}//END LAST
                , one: {}//END ONE
                ///////////
                // STADI //
                ///////////
                , default: { 'background-color': '#353535', 'font-size': '11px', color: '#999999'  }//END DEFAULT
                , selected: { 'background-color': '#353535', 'font-size': '11px', color: '#999999', 'font-weight': 'bold' }//END SELECTED
                , hover: { 'background-color': '#a9b3be', 'font-size': '11px',color: '#fff' }//END HOVER
              }//END STYLES
              , direction: 'vertical'   
            }//END 2 
        }//END VERTICAL
        
        
        ////////////////
        // HORIZONTAL //
        ////////////////
        , horizontal: {
            filter: false
          , scriptNeeded: true
          , script: function () {
              ( function( $ ) {
                $.fn.horizontalMenu = function () {
                  return this.each( function ( i ) {
                    var $menu = $( this ).find( 'menu:visible' );
                    
                    ///////////////////
                    // ON MOUSE OVER //
                    ///////////////////
                    function forMouseoverHorizontalMenu () {
                      var $this =  $( this )
                        , $menu = $this.next( 'menu' )
                        , $parents = $this.parentsUntil('.GIRD > .CONTAINER, .GIRD > .STICKER', 'menu' )
                        , $selected = $this.parent().siblings().children().filter( function () { return $( this ).attr( 'class' ).match( 'sub' )  ? true : false  } ) 
                        ;
                            
                        if ( $parents.last().data( 'timer' ) ) { 
                          clearTimeout( $parents.last().data( 'timer' ) );
                          $parents.last().removeData( 'timer' );
                        }//END IF
                            
                        if ( $this.attr( 'class' ).indexOf( 'sub' ) == -1 ) $this.data( 'was', $this.attr( 'class' ) ); 
                            
                        /////////////////////
                        // REMOVE SELECTED //
                        /////////////////////
                        if ( $selected.length ) { 
                          $selected.data( 'timer'
                          , setTimeout( 
                              function () { 
                                $selected
                                  .attr( 'class', $selected.data( 'was' ) ) 
                                  .next( 'div' )
                                    .find( '> menu' )
                                      .css( 'display', 'none' )
                                        .unwrap()
                                        .find( '> menu' )
                                        .css( 'display', 'none' )
                                        .unwrap()
                                        ;
                                }//END FUNCTION
                              , 200 
                              )//SET TIMEOUT 
                          )//END DATA
                          ;
                        }//END IF
                              
                        /////////////////////////////
                        // HEIGHLIGHT NEW SELECTED //
                        /////////////////////////////
                        if ( $menu.length ) $this.attr( 'class', $this.attr( 'class' ).replace( 'default', 'sub'  ).replace( 'selected', 'sub'  ) );
                        $menu
                          .css({ display: 'inline-block', 'white-space': 'nowrap' })
                            .wrap( '<div/>' )
                            .parent()
                              .addClass( 'STICKER' )
                              .css( 
                                $parents.length == 1 
                                ? { 'white-space': 'nowrap' }
                                : { top: 0, left: '100%', 'white-space': 'nowrap' }
                              )//END CSS
                              .end()
                              .css( 'display', 'block' )
                              ;
                    }//END FORMOUSEOVERHORIZONTALMENU
                    
                    ///////////////////
                    // ON MOUSELEAVE //
                    ///////////////////
                    function forMouseleaveHorizontalMenu () {
                      var $this = $( this );
                      if ( $menu.data( 'timer' ) ) clearTimeout( $menu.data( 'timer' ) );
                      $menu.data( 
                        'timer'
                      , setTimeout( 
                          function () { 
                            $this
                              .find( 'div > menu' )
                                .unwrap()
                                .css( 'display', 'none' )
                                .end()
                                .find( 'a' )
                                  .filter( function () { return $( this ).attr( 'class' ).match( 'sub' )  ? true : false  })
                                  .each( function () { $( this ).attr( 'class', $( this ).data( 'was' ) ); })
                                  ;
                          }//END FUNC
                        , 800 
                        )//END SET TIMEOUT
                      )//END DATA
                      ;
                    }//END FORMOUSELEAVEHORIZONTALMENU
                    
                    //////////////
                    // ON CLICK //
                    //////////////
                    function forClickHorizontalMenu () { 
                      var $this = $(this) 
                        , $parents =  $this.parentsUntil('.GIRD > .CONTAINER, .GIRD > .STICKER', 'menu' )
                        ;
                      var $selected =  
                        $parents
                          .find( 'a' )
                            .filter( function () { return $( this ).attr( 'class' ).match( 'sub' )  ? true : false  } ) 
                              .each( function () { $( this ).data( 'was', $( this ).data( 'was').replace(  'default', 'selected' ) ) })
                              .end()
                              .filter( function () { return $( this ).attr( 'class' ).match( 'selected' )  ? true : false  } )
                              ; 
                        
                        if ( $selected.length ) $selected.each( function () { $( this ).attr( 'class', $( this ).attr( 'class' ).replace( 'selected', 'default'  ) ) });
                        $this.attr( 'class', $this.attr( 'class' ).replace( 'default', 'selected' ) );
                        $parents
                          .find( 'div > menu' )
                          .unwrap()
                          .css( 'display', 'none' )
                          .end() 
                            .find( 'a' )
                              .filter( function () { return $( this ).attr( 'class' ).match( 'sub' )  ? true : false  })
                              .each( function () { $( this ).attr( 'class', $( this ).data( 'was' ) ); })
                              ;
                   }//END FORCLICKHORIZONTALMENU
                    
                    $menu
                      .find( 'a' )
                        .bind({ 
                          'mouseover.horizontalMenu': forMouseoverHorizontalMenu                         
                        , 'click.horizontalMenu': forClickHorizontalMenu
                        })//END BIND
                        .parent()
                          .bind( 'mouseleave.horizontalMenu', forMouseleaveHorizontalMenu )
                          .end()
                      .end()
                      .find( 'menu' )
                        .css( 'display', 'none' )   
                        ;   
                  })//END EACH
                  ;
                }//END $.FN.VERTICALMENU
                ;
              })( jQuery )//END PLUGIN
              ;
            }//END SCRIPT 
           , defaultStyles: {
              'margin-top': '0px'
            , 'margin-right': '0px'
            , 'margin-bottom': '0px'
            , 'margin-left': '0px'
            , 'padding-top': '5px'
            , 'padding-right': '10px'
            , 'padding-bottom': '5px'
            , 'padding-left': '10px'
            , 'background-color': '#a9b3be'
            , 'font-family': 'Arial, sans-serif'
            , 'font-weight': 'bold'
            , 'font-style': 'normal'
            , 'font-size': '14px'
            , 'color': '#ffffff'
  
          
            }//END DEFAULT STYLES
            , '0':{
                  action: function ( ui ) {
                    ui.element
                      .find( 'div.STICKER > menu' )
                        .unwrap()
                      .end()
                      .find( 'menu' )
                      .fadeIn( 0 )
                        .eq( ui.deep )
                        .fadeOut( 0 )
                        ;
                }//END ACTION
                , styles: {
                  ////////////
                  // BUTTON //
                  ////////////
                    first: { 
                      'margin-top': '0px'
                    , 'margin-right': '0px'
                    , 'margin-bottom': '0px'
                    , 'margin-left': '14px'
                    }//END FIRST
                  , item: { 
                      'margin-top': '0px'
                    , 'margin-right': '0px'
                    , 'margin-bottom': '0px'
                    , 'margin-left': '4px'

                  }//END DEFAULT
                  , last: { 
                      'margin-top': '0px'
                    , 'margin-right': '0px'
                    , 'margin-bottom': '0px'
                    , 'margin-left': '4px'
   
                  }//END LAST
                  , one: {}//END ONE
                  ///////////
                  // STADI //
                  ///////////
                  , default: { 
                      'background-color': '#a2a1a2' 
                    , 'border-top-left-radius': '8px'
                    , 'border-top-right-radius': '8px'
                    , 'border-bottom-left-radius': '8px'
                    , 'border-bottom-right-radius': '8px'
                  }//END DEFAULT
                  , selected: { 
                      'background-color': '#333334' 
                    , 'border-top-left-radius': '8px'
                    , 'border-top-right-radius': '8px'
                    , 'border-bottom-left-radius': '8px'
                    , 'border-bottom-right-radius': '8px'
                  }//END SELECTED
                  , hover: { 
                      'background-color': '#ffffff'
                    , color: '#727273' 
                    , 'border-top-left-radius': '8px'
                    , 'border-top-right-radius': '8px'
                    , 'border-bottom-left-radius': '8px'
                    , 'border-bottom-right-radius': '8px'
                  }//END HOVER
                  , sub: { 
                      'background-color': '#333334'  
                    , 'border-top-left-radius': '8px'
                    , 'border-top-right-radius': '8px'
                    , 'border-bottom-left-radius': '0'
                    , 'border-bottom-right-radius': '0'
                  }//END SUB
                }//END STYLES
                , direction: 'horizontal'  
              }// END 1
            , '1':{
                action: function ( ui ) {
                   
                  ui.element
                    .find( 'div.STICKER > menu' )
                      .unwrap()//Cleanup
                      .end()
                      ;
                  
                  for ( var i = 2; i <= ui.deep; i++ ) {
                    ui.element
                      .find( 'menu:eq(' +  ( i-1 ) + ')' )
                      .fadeIn( 0 )
                        .css({ display: 'inline-block', 'white-space': 'nowrap' })
                        .wrap('<div/>')
                          .parent()
                          .addClass( 'STICKER HELPER-demoMenuAction' )
                          .css( ( i-1 ) == 1  
                            ? { 'white-space': 'nowrap'  } 
                            : { top: 0
                              , left: '100%'  
                              , 'white-space': 'nowrap'
                              })//END CSS
                              ;
                              }//END LOOP
                            
                    ui.element
                      .find( 'menu' ) 
                        .eq( ui.deep )
                          .fadeOut( 0 )
                          ;
                 
                }//END ACTION
                , styles: {
                  ////////////
                  // BUTTON //
                  ////////////
                    first: { 'margin-left': '4px' }//END FIRST
                  , item: { 'margin-left': '4px' }//END DEFAULT
                  , one: {}//END ONE
                  , last: {
                      'border-bottom-left-radius': '8px'
                    , 'border-bottom-right-radius': '8px'
                    , 'margin-left': '4px'
                    
                  }//END LAST
                  ///////////
                  // STADI //
                  ///////////                
                  , default: { 'background-color': '#333334' }//END DEFAULT
                  , selected: { 'background-color': '#212121' }//END SELECTED
                  , hover: { 'background-color': '#4b4b4c' }//END HOVER
                  , sub: { 
                    'background-color': '#333334'                   
                  , 'border-bottom-color': '#4b4b4c'
                  , 'border-bottom-style': 'dotted'
                  , 'border-bottom-width': '2px' 
                  }//END SUB

                }//END STYLES 
                , direction: 'vertical'  
              }//END 1
            , '2':{
                action: function ( ui ) {
                                       
                  ui.element
                    .find( 'div.STICKER > menu' )
                    .unwrap()
                    ;
                  
                  for ( var i = 2; i <= ui.deep; i++ ) {
                    ui.element
                      .find( 'menu:eq(' +  ( i - 1 ) + ')' )
                      .fadeIn( 0 )
                      .css({ display: 'inline-block', 'white-space': 'nowrap' })
                      .wrap('<div/>')
                        .parent()
                        .addClass( 'STICKER HELPER-demoMenuAction' )
                        .css( ( i-1 ) == 1  
                        ? { 'white-space': 'nowrap' } 
                        : { top: 0
                        , left: '100%' 
                        , 'white-space': 'nowrap'
                          }  
                          )//END CSS
                          ;    
                          }//END LOOP
                            
                  ui.element
                    .find( 'menu' ) 
                    .eq( ui.deep )
                    .fadeOut( 0 )
                    ;
                }//END ACTION
                , styles: {
                  ////////////
                  // BUTTON //
                  ////////////
                   
                    first: { 
                      'border-top-left-radius': '8px'
                    , 'border-top-right-radius': '8px'
                    , 'margin-left': '4px'
                    
                    }//END FIRST
                  , item: { 'margin-left': '4px' }//END DEFAULT
                  , one: {}//END ONE
                  , last: { 
                      'border-bottom-left-radius': '8px'
                    , 'border-bottom-right-radius': '8px'
                    , 'margin-left': '4px'
                    
                  }//END LAST
                  ///////////
                  // STADI //
                  ///////////
                  , default: { 'background-color': '#333334'  }//END DEFAULT
                  , selected: { 'background-color': '#212121' }//END SELECTED
                  , hover: { 'background-color': '#4b4b4c' }//END HOVER
                  
                }//END STYLES
                , direction: 'vertical'   
              }//END 2
        }
      }//END TASK
    }//END OPTIONS
    
    //////////
    , _create: function () { 
    //////////
        var self = this;
        if ( ! this.element.find( 'menu' ).length ) this._createDeepth( this.options.deep, this.element );
        else $( document ).ready( function () {//Wait for styleables  
          self.element.find( '.HELPER-demoMenu' ).remove();
          self.changeViewStadi();
          self.changeViewDeep();
          
        });
    }
    ////////
    , _init: function () {
    ////////    
        var data = this.element.data( 'styleable_item' )
          , script = this.options.task[ this.options.type ].script.toString()
          ;
        if ( ! data.storage.overwrite.menu.level ) data.storage.overwrite.menu.level = this.options.level;
        if ( ! data.storage.overwrite.menu.filter ) data.storage.overwrite.menu.filter = this.options.task[ this.options.type ].filter;
        if ( ! data.storage.overwrite.menu.directions ) data.storage.overwrite.menu.directions = [ this.options.task[ this.options.type ][ 0 ].direction, this.options.task[ this.options.type ][ 1 ].direction, this.options.task[ this.options.type ][ 2 ].direction ] ;
        if ( ! data.script && this.options.task[ this.options.type ].scriptNeeded == true ) data.script = script.substring( script.indexOf( '{' ) + 1,  script.lastIndexOf( '}' ) )
    }//END INIT
    
    ///////////
    , _destroy: function () { 
    ///////////
        this.element.find( 'menu:first' ).remove();
        $.Widget.prototype.destroy.apply( this ); 
    }//END DESTROY
    
    //////////////
    , _addButtons: function ( level, button, selector, stadi  ) {
    //////////////
        var stadi = stadi || this.options.stadi.reverse()
          , view =  this.options.viewStadi   
          , options = this.options.task[ this.options.type ][ level ]
          ;
        
        for ( var i in stadi ) {
          if (  ( this.options.deep - 1 ) == level &&stadi[ i ] == 'sub' ) { /* Do nothing */ } 
          else { 
            var mergedCss = 
              $.extend(
                  true
                , {}  
                , this.options.task[ this.options.type ].defaultStyles
                , options.styles[ stadi[ i ] ] 
                , options.styles[ button ]
              )//END EXTEND 
              ;
            var $button = 
              $( '<a/>' )
                .addClass( 'ITEM-' + options.direction )
                .attr( 'id', this.element.attr( 'id' ) + '-' + level + '-' +  button + '-' + stadi[ i ] )
                .text( level + ' ' + button +  ' '  + stadi[ i ] )
                .prependTo( selector )
                ;
            
            this.element
              .closest( '.GRID' )
              .styleable( 'add'
                , { styles: mergedCss
                  , saveStyles: { height: 'auto' }
                  , fit: false
                  , type: 'item'
                  , label: $button.text()
                  , allreadyExist: '#' + $button.attr( 'id' )
                  , task: 'item' 
                  }
                , function ( data ) {
                    $( '.UI' ).controls( 'add', [ data.self, data.type ] );
                }//END CALLBACK
              )//END STYLEABLE
              ;
              
            if ( stadi[ i ] != view ) $button.fadeOut( 0 ); 
          
          }//END LOOP
        }//END IF
    }//END ADD BUTTON
    
    ///////////////
    , _createDeepth: function ( deep, selector ) {
    ///////////////
        var self = this;
        
        ! function ( deep, target ) {
            var lastLast = target.find( '> li:last' )
              , $menu = lastLast.length ? $( '<menu/>' ).appendTo( lastLast.prev('li') ) : $( '<menu/>' ).appendTo( target )
              , level = self.getDeepth( $menu )
              , options = self.options.task[ self.options.type ][ level ]
              ;
            /////////////////////////////////////////////////////////
            // ADD SUB BUTTONS TO PARENT IF THEY STILL DON'T EXIST //
            /////////////////////////////////////////////////////////
            if ( level != 0 && $menu.parent().find( '> a' ).length == 3 ) {
              self._addButtons( level - 1, 'first', $menu.parent(), [ 'sub' ] );
              self._addButtons( level - 1, 'item', $menu.parent(), [ 'sub' ] );
              self._addButtons( level - 1, 'last', $menu.parent(), [ 'sub' ] );
              self._addButtons( level - 1, 'one', $menu.parent(), [ 'sub' ] );
            }//END IF
            
            $menu.addClass( 'FUNCTION-' + options.direction ).css('display', 'none');
            self._addButtons( level, 'first', $( '<li></li>' ).addClass( 'ITEM-' + options.direction ).appendTo( $menu ) );
            self._addButtons( level, 'item', $( '<li></li>' ).addClass( 'ITEM-' + options.direction ).appendTo( $menu ) );
            self._addButtons( level, 'last', $( '<li></li>' ).addClass( 'ITEM-' + options.direction ).appendTo( $menu ) );
            self._addButtons( level, 'one', $( '<li></li>' ).addClass( 'ITEM-' + options.direction ).appendTo( $menu ) );
            
            deep--;
            if ( deep == 0 ) return;//Break recursion 
            return arguments.callee( deep--, $menu );//or create the next level
          
        }( deep, selector )
        ;
      
      this.saveContent();     
    }//END CREATE LEVEL 
    
    ////////////////
    , _removeDeepth: function ( deep ) { 
    ////////////////
        this.element
            .find( 'menu' )
              .eq( deep )
                .parent()
                  .parent()
                    .find( '> li a' )
                      .filter( function () { 
                        return $( this ).attr( 'id' ).match( 'sub' ) != null ? true : false    
                      })//END CALLBACK
                      .remove() 
                      .end()//filter
                    .end()//find
                  .end()//parent
                .end()//parent
                .remove()
                ;  
        this.saveContent(); 
    }//END REMOVE DEEPTH
           
    /////////////
    , getDeepth: function ( selector ) { 
    /////////////
        selector = selector || this.element.find( 'menu:last' ).children( ':first' );
        return selector.parentsUntil( '.GRID > .CONTAINER, .GRID > .STICKER', 'menu' ).length;  
    }//END GETDEEPTH
    
    ///////////
    , _cleanUp: function () {
    ///////////
      this.tryMenu( true );//Stop trying mode when it is running
      this.element.find( '.HELPER-demoMenuAction > menu' ).unwrap();
    }//END CLEANUP
    
    ///////////////
    , _changeDeep: function ( deep ) {
    ///////////////  
        this._cleanUp();
        
        if ( deep > 3 || deep < 0 ) return;
        
        var $deepestMenu = this.element.find( 'menu:last' )
          , currentDeepth = this.getDeepth( $deepestMenu ) + 1 // add $deepestMenu himself 
          , change = ( deep - currentDeepth )
          ;
        if ( deep < this.options.viewDeep )  this.options.viewDeep = deep;
        
        if ( change > 0 ) this._createDeepth( change, $deepestMenu ); 
        else if (  change < 0 ) this._removeDeepth( deep ); 
         
    }//END CHANGE LEVELS
    
    //////////////
    , _changeType: function () {
    //////////////
        this._cleanUp();
        
        var $menus = this.element.find( 'menu' )
          , self = this
          , script = this.options.task[ this.options.type ].script.toString()
          ;
        ////////////////////////////
        // UPDATE MENUS/FUNCTIONS //
        ////////////////////////////
        $menus
        .attr( 'style', '' )
        .each( function () { 
          var $this = $( this )
            , level = self.getDeepth( $this )
            , options = self.options.task[ self.options.type ][ level ]
            , getFunctionClass = $this.attr( 'class' ).split(' ')
            ;
            
            getFunctionClass.shift();//Remove original class from array

            $this
              .attr( 'class' , 'FUNCTION-' + options.direction + ' ' +  getFunctionClass.join(' ') )
              //////////////////
              // UPDATE ITEMS //
              //////////////////
              .find( 'li, a' )
              .each( function () {
                var $this = $( this )
                  , getClass = $this.attr( 'class' ).split( ' ' )
                  ; 
                
                getClass.shift();//Remove original class from array
                $this.attr( 'class', 'ITEM-' + options.direction + ' ' + getClass.join( ' ' ) );
              })//END EACH
              ;  
        })//END EACH
        ;
        this.element.data( 'styleable_item' ).storage.overwrite.menu.filter = this.options.task[ this.options.type ].filter;
        this.changeViewDeep( this.options.viewDeep );
        data.storage.overwrite.menu.directions = [ 
            this.options.task[ this.options.type ][ 0 ].direction
          , this.options.task[ this.options.type ][ 1 ].direction
          , this.options.task[ this.options.type ][ 2 ].direction 
        ];
        
        if ( this.options.task[ this.options.type ].scriptNeeded == true ) data.script = script.substring( script.indexOf( '{' ) + 1,  script.lastIndexOf( '}' ) )
 
        this.saveContent(); 
    }//END _CHANGETYPE
    
    //////////////
    , saveContent: function () {
    //////////////
        this.element
          .data( 'styleable_item' )
          .parent
            .styleable( 'saveContent', $( '#' + this.element.attr( 'id' ) )  )
            ;
    }//END SAVE CONTENT

    ///////////////////
    , changeViewStadi: function ( stadi ) {
    ///////////////////  
       var stadi = stadi || this.options.viewStadi
       this.element
          .find( 'menu a:not(.HELPER-demoMenu a )' )
          .filter( function ( index ) { return $( this ).attr( 'id' ).indexOf( stadi.toLowerCase() ) == -1 } )
            .css( 'display', 'none' )
            .end()
          .filter( function ( index ) { return $( this ).attr( 'id' ).indexOf( stadi.toLowerCase() ) !== -1 } )
            .css( 'display', 'block' )
            ;
    }//END _CHANGEVIEWSTADI
    
    /////////////////
    , changeViewDeep: function ( deep ) {
    /////////////////
        var o = this.options;
        deep = deep || o.viewDeep
        o.task[ o.type ][ deep - 1 ].action({  element: this.element, deep: deep }); //Trigger action 
      
    }//END _CHANGEVIEWDEEP 
    , tryMenu: function ( stop ) {
        var $styleableMenu = this.element.find( 'menu:first' )
          , id = this.element.attr( 'id' )
          , o = this.options
          , self = this
          ;
        
        function getStyles ( stadi, button, level ) {
          return $styleableMenu
                  .find( level == 0 ? '> li > a' : 'menu:eq(' + ( level - 1 ) + ') > li > a' )
                    .filter( function () { return $( this ).attr( 'id' ).match( stadi ) != null && $( this ).attr( 'id' ).match( button ) != null ? true : false ; })//END FILTER
                    .attr( 'style' )
                    ;
        }//GETSTYLES 
       
        function createPreview ( $menu, level, tree, count ) {
          var self = this 
            , $style = $( '.HELPER-' + id + '-tryMenu' ).length ? $( '.HELPER-' + id + '-tryMenu' ) : $( '<style class="HELPER-' + id + '-tryMenu"/>' ).appendTo( 'head' )
            ;
          
          for ( var i in tree ) {
            ////////////////////////////////////// 
            // CREATE CLASS NAME                //
            // STYLEABLEID-LEVEL-POSITION-STADI //
            // C25EEE6D-0-first-default         //
            //////////////////////////////////////
            
            //alert(helperObjLength( tree ))
            var className =  
              id 
              + '-' 
              + level 
              + '-' 
              + (  helperObjLength( tree ) == 1 
                   ? 'one' : count == 0 
                   ? 'first' : ( count == helperObjLength( tree ) - 1 ) 
                   ? 'last' : 'item'   
                )
              ;
            ///////////////////
            // CREATE BUTTON //
            ///////////////////
            var $button = 
              $( '<a/>' )
                .appendTo( $menu )
                .text( i )
                .addClass( className + '-default' )//END ADDCLASS
                .attr( 'href', '#' )
                .click( function ( event ) { event.preventDefault(); event.stopPropagation(); } )
                .wrap( '<li></li>' )
                  .parent()
                  .addClass( 'ITEM-' + o.task[ o.type ][ level ].direction )
                  ;
            
            ///////////////////////////////////////
            // IF CSS STYLES STILL DOESN'T EXIST //
            /////////////////////////////////////// 
            if ( $style.text().indexOf( ( className + '-default')  ) == -1 ) {
              
              $style.text(
                $style.text() 
                + '.' 
                + className 
                + '-default' 
                + '{' 
                + getStyles( 'default', ( helperObjLength( tree ) == 1 ? 'one' : count == 0  ? 'first' : ( count == helperObjLength( tree ) - 1 ? 'last' : 'item' ) ), level ).replace('display: none;', '')
                +  '}\n'
                + '.' 
                + className 
                + '-default:hover'
                + '{' 
                + getStyles( 'hover', ( helperObjLength( tree ) == 1 ? 'one' : count == 0  ? 'first' : ( count == helperObjLength( tree ) - 1 ? 'last' : 'item' ) ), level ).replace('display: none;', '')
                +  '}\n'
                + '.' 
                + className 
                + '-selected'
                + '{' 
                + getStyles( 'selected', ( helperObjLength( tree ) == 1 ? 'one' : count == 0  ? 'first' : ( count == helperObjLength( tree ) - 1 ? 'last' : 'item' ) ), level ).replace('display: none;', '')
                +  '}\n'
              );
              
              var subStyles = getStyles( 'sub', ( helperObjLength( tree ) == 1 ? 'one' : count == 0  ? 'first' : ( count == helperObjLength( tree ) - 1 ? 'last' : 'item' ) ), level )
              if ( subStyles != undefined ) {
                $style.text(
                  $style.text() 
                  + '.' 
                  + className 
                  + '-sub'
                  + '{' 
                  + subStyles.replace('display: none;', '')
                  + '}\n'
                );//END TEXT
              }//END IF
            }//END IF
            
            //////////////////////////////
            // START ANOTHER MENU LEVEL //
            //////////////////////////////
            if ( helperObjLength( tree[ i ] ) != 0 && level < ( o.deep - 1 ) ) { 
              createPreview( 
                $( '<menu/>' )
                  .appendTo( $button )
                  .addClass(  'FUNCTION-' + o.task[ o.type ][ level + 1  ].direction )
              , level + 1 
              , tree[ i ]
              , 0
              )//END CREATEPREVIEW
              ;
            }//END IF 
            count++;
          }//END LOOP
        }//END CREATEPREVIEW
       
        //////////////////
        // START TRYING //
        //////////////////
        if ( $styleableMenu.is( ':visible' ) && stop !== true ) {
          //////////////////////
          // CREATE DEMO MENU //
          //////////////////////
          this.demoMenu = 
            $styleableMenu
              .clone()
                .addClass('HELPER-demoMenu')
                .appendTo( this.element )
                .html( '' ) 
                .css( 'display', 'none' )
                ;
          
          ///////////////////////
          // REMOVE STYLEABLES //
          ///////////////////////
          $styleableMenu
            .fadeOut( 'fast', function () {
              ////////////////////////////////////////
              // ADD LEVELS / BUTTONS TO DEMEO MENU //
              ////////////////////////////////////////
              createPreview(
                self.demoMenu//Menu
              , 0//Level
              , o.sampleTree//treeObj
              , 0 //Count
              )//END CREATEPREVIEW
              ;
              
              ////////////////////////
              // ADD PLIUGIN SCRIPT //
              ////////////////////////  
              var script = o.task[ o.type ].script.toString()            
                , scriptTag = document.createElement( 'script' )
                , pluginName = script.replace( / /ig, '' ).split('.', 3)[ 2 ].split( '=' )[ 0 ]//script.replace( / /ig, '' ).match(/\$\.fn\.(.*)\=/ )[ 1 ]
                ;
              scriptTag.id = 'HELPER-' + id + '-' + pluginName
              scriptTag.type = 'text/javascript';
              scriptTag.text = script.substring( script.indexOf( '{' ) + 1, script.lastIndexOf( '}' ) );
              $( 'head' )[ 0 ].appendChild( scriptTag );//Add to dom
       
             
              
              self.demoMenu.fadeIn( 'fast' );
               self.element[ pluginName ]();//Call plugin
            })//END FADEOUT
            ;    
        }//END IF 
        
        /////////////////
        // STOP TRYING //
        /////////////////
        else {
          if ( ! this.demoMenu  ) return;//Abort if a remove is tried before try 
          this.demoMenu.fadeOut( 'fast', function () {
            self.demoMenu.remove();
            delete self.demo
            $( '.HELPER-' + id + '-tryMenu, #HELPER-' + id + '-' +  o.task[ o.type ].script.toString().replace( / /ig, '' ).split('.', 3)[ 2 ].split( '=' )[ 0 ] ).remove();  //.match(/\$\.fn\.(.*)\=/ )[ 1 ] ).remove();
            $styleableMenu.fadeIn( 'fast' ); 
          })//END FADEOUT
          ;
        }//END ELSE
    }//END TRYMENU
    /////////////
    , _setOption: function ( key, value ) {
    /////////////
        this.options[ key ] = value;
        
        switch ( key ) {
          case 'level': 
            this.element.data( 'styleable_item' ).storage.overwrite.menu[ key ] = value;
          break;
          case 'deep': 
            this.element.data( 'styleable_item' ).storage.overwrite.menu[ key ] = value; 
            this._changeDeep( value );
          break;
          case 'type':
            this.element.data( 'styleable_item' ).storage.overwrite.menu[ key ] = value; 
            this._changeType( value );
          break;
          case 'viewStadi':
            this.options[ key ] = value.toLowerCase();
            this.changeViewStadi( value );
          break; 
          case 'viewDeep':
            this.changeViewDeep( value );
          break; 
        }//END SWITCH
    }//END OPTIONS 
    
    /////
    , ui: function () { return {  element: this.element  }; }
    /////
    
     });//END WIDGET
})( jQuery );