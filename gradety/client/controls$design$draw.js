function createdesign$draw ( opt ) {   
  return {
    ////////
    menuBar: { dev_gadgetMenu: getMenubarObj() }
    ////////
    
    //////////
    , toolBar: controls$design$draw$toolbar( 'toolBar' ) 
    //////////
    
    ///////
    , grid: {
    ///////   
        sortable: controls$design$draw$grid( 'sortable' )
      , resizable: controls$design$draw$grid( 'resizable' )  
      , dev_gadgetMedithumb: controls$design$draw$grid( 'dev_gadgetMedithumb' )
      , dev_gadgetBubble: controls$design$draw$grid( 'dev_gadgetBubble' )
      , dev_gadgetSplit: controls$design$draw$grid( 'dev_gadgetSplit' )
      , styleable: controls$design$draw$grid( 'styleable' )
      , dev_gadgetBubble: controls$design$draw$grid( 'dev_gadgetBubble' )
    }//END GRID
    
    ////////////
    , container: { 
    //////////// 
        resizable: controls$design$draw$container( 'resizable' ) 
      , dev_gadgetFocus: controls$design$draw$container( 'dev_gadgetFocus' )
      , bind: controls$design$draw$container( 'bind' ) 
    }//END CONTAINER
    
    //////////
    , sticker: {
    //////////  
        bind: controls$design$draw$sticker( 'bind' )
      , resizable: controls$design$draw$sticker( 'resizable' )
      , draggable: controls$design$draw$sticker( 'draggable' )
      , dev_gadgetFocus: controls$design$draw$sticker( 'dev_gadgetFocus' )
      
    }//END STICKER
    
    ///////
    , item: { dev_gadgetFocus: $.extend( controls$design$draw$container( 'dev_gadgetFocus' ), { size: 'small' } ) }
    ///////
    
    ////////////
    , browseBar: { dev_gadgetBrowse: getDrawBrowseObj() }
    ////////////
    
    //////////
    , subgrid: {
    //////////
        dev_gadgetRules: {
          status: 'subGrid'
        , subGrid: function ( event, ui ) { 
            window.location = '/design/draw/' + URL.address.join('/') + '/' + ui.element.attr('id') ;
          }//END TRIGGER SUBGRID
        }//END GDAGET.RULES  
    }//END SUBGRID
    
    ///////
    , menu: { 
    ///////  
        menu: { disabled: false  } 
      , flyingPanel: {
          width: 'auto'
        , afterInit: function ( event, ui ) {
            var $styleable = ui.element
              , deepth = $styleable.menu( 'getDeepth' ) 
              , $focus = $( 'body' ).data( 'gadgetFocus' )
              , $hasSub = $focus.parent().find( '> a' ).filter( function () { return $( this ).attr( 'id' ).match( 'sub' ) != null ? true : false })//END CALLBACK
              , $isSub = $focus.is( function () { return $( this ).attr( 'id' ).match( 'sub' ) != null ? true : false } )
              , choices = ' 1 , 2 , 3 '.split( ',' ).slice( 0, $isSub ? deepth - 1: deepth  )  
              ;
              
            
            $styleable
              /////////////////////
              // TRY MENU BUTTON //
              /////////////////////
              .flyingPanel( 
                'addItem'
              , function ( item ) { 
                 $( '<input type="submit"/>' )
                      .val( 'Try Menu' )
                      .wrap( '<form class="FORM"/>' )
                      .appendTo( item )
                      .dev_gadgetForm({ 
                        action: function (event, ui) {
                          ui.nicer.click( 
                            function () { 
                              $styleable.menu( 'tryMenu' ); 
                              if ( ui.nicer.text() != 'Done Trying' ) {
                                ui.nicer.find( 'a' ).text( 'Done Trying' );
                                item.nextAll( '.CONTAINER-flyingPanel' ).fadeOut( 0 );                              
                                 $focus = $( 'body' ).data( 'gadgetFocus' ).dev_gadgetFocus( 'deactivate' );
                                 $styleable.dev_gadgetFocus( 'activate' );
                              } else { 
                                ui.nicer.find( 'a' ).text( 'Try Menu' );
                                item.nextAll( '.CONTAINER-flyingPanel' ).fadeIn( 0 ); 
                                if ( $focus.length ) $styleable.dev_gadgetFocus( 'deactivate' );
                                $focus.dev_gadgetFocus( 'activate' );
                              }//END ELSE
                            }//END FUNCTION
                          )//END CLICK
                        }//END ACTION
                      })//END GADGETFORM
                      ; 
                  }//END CALLBACK
              )//END ADD
              
              //////////////////
              // LABEL STATUS //
              //////////////////
              .flyingPanel( 
                'addItem', function ( item ) { $( '<label/>' ).text( 'Status:' ).appendTo( item ); }              
              , { triggerDraggable: true,  paddingRight: 0, paddingLeft: 0  } 
              )//END ADD
              
              //////////////////////////
              // CHOISE SWITCH STATUS //
              //////////////////////////
              .flyingPanel( 
                'addItem'
              , function ( item ) { 
                  item.choiceSwitch({
                    choices:  $hasSub.length ?  [ 'Default', 'Selected', 'Hover', 'Sub' ] : [ 'Default', 'Selected', 'Hover' ]
                  , startWith: $styleable.data( 'menu' ).options.viewStadi[ 0 ].toUpperCase() + $styleable.data( 'menu' ).options.viewStadi.substr( 1 ) //This is necessary to make the first letter uppercase 
                  , onChoise: function ( event, ui ) { 
                     $styleable.menu( 'option', 'viewStadi', ui.choise.text() );
                     createdesign$draw( '_handleItemFocusOnMenuViewChange' )( $styleable, ui.choise.text() );
                    }//END ONCHOISE
                  })
                  ;
                }//END CALLBACK
              )//END ADD
              ;         
         
         if ( choices.length > 1  ) {
            $styleable
              /////////////////
              // LABEL LEVEL //
              /////////////////
              .flyingPanel( 
                'addItem', function ( item ) { $( '<label/>' ).text( 'Level:' ).appendTo( item ); }
              , { triggerDraggable: true, paddingRight: 0, paddingLeft: 0 } 
              )//END ADD
              
              /////////////////////////
              // CHOISE SWITCH LEVEL //
              /////////////////////////
              .flyingPanel( 
                'addItem'
              , function ( item ) { 
                  item.choiceSwitch({
                    choices: choices
                  , startWith: ' ' + $styleable.data( 'menu' ).options.viewDeep > choices.length ? ( $styleable.data( 'menu' ).options.viewDeep - 1 ) + ' ': $styleable.data( 'menu' ).options.viewDeep + ' ' 
                  , onChoise: function ( event, ui ) { 
                     $styleable.menu( 'option', 'viewDeep', parseInt( ui.choise.text() ) );
                     createdesign$draw( '_handleItemFocusOnMenuViewChange' )( $styleable );
                    }//END ONCHOISE
                  })
                  ;
                }//END CALLBACK
              )//END ADD
              ;
            }//END IF
          }//END AFTERINIT	
        }//FLYINGPANEL
    }//END MENU
    
    /////
    , ui: { 
    /////
        dev_gadgetLayout: { show: [ 'menu', 'toolBar', 'edit', 'stage', 'browse' ] }//END GADGET MODES
      , dev_gadgetClipboard: { disabled: false }
    }//END UI
    
    //////////////
    , _focusStart: function ( ui ) {
    //////////////  
        var data = ui.element.data( 'styleable_item' )
          , bifParent =  $( '.PAGE' ).ios( 'GetNodeByIdent', data.parent.attr( 'id' ) )
          ;
        
        $( '.UI' ).controls( 
          'store'
          , ui.element
          , '.GRID/dev_gadgetBubble'
          , '.GRID/dev_gadgetSplit'
          , '.GRID/dev_gadgetMedithumb' 
        )
        ;
      
        helperCopyPasteAttributes( true );//Handle copy/paste attributes buttons in toolbar 
        
        /////////////////////////////////////////////////////////////
        // LOAD CONTAINER_EDIT COLUMN WHEN CLICKING ON A CONTIANER //
        /////////////////////////////////////////////////////////////
        $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'getColumnInDom', 'container_list' ).data( 'bifork', bifParent );//updates data in grid_list element with the parent grid of myobj  
        $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'getColumnInDom', 'styleable_setup' ).data( 'bifork', data ); 
        $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'browseTo', 'styleable_setup', true );
        
    }//END _FOCUSSTOP
    
    ////////////
    ,_focusStop: function ( ui ) {
    ////////////
      var data = ui.element.data( 'styleable_item' )
        , browseBarPos = $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'ui' ).target.data( 'browseName' )
        , canMove = ( browseBarPos  == 'styleable_setup' || browseBarPos == 'styleCategories_list' || browseBarPos  == 'styles_list' );
        ;
      
      $( '.UI' ).controls( 'restore', ui.element );
      
      helperCopyPasteAttributes( false ); 
      
      if ( ui.target.is( '.GRID' ) ) ui.target.trigger( 'mouseenter' );
      if ( canMove && ! ui.target.is( '.CONTAINER' ) ) $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'browseTo', 'grid_list' );
    
    }//END _FOCUSSTOP
    
    /////////////////////
    , _showOnFocusByTask: function ( selector, task ) {
    /////////////////////    
        switch ( task ) {
           case 'menu':
            $( selector ).flyingPanel( 'show' );
           break;
           case 'item':
            $( selector ).closest( '.GRID > .STICKER, .GRID > .CONTAINER' ).flyingPanel( 'show' );
            $( selector ).closest( '.GRID >.STICKER, .GRID > .CONTAINER' ).flyingPanel( 'reset' );
           break;
           case 'subgrid':
             $( selector ).dev_gadgetRules( 'removeOverlay' );//Remove overlay from container
           break;
        };//END SWITCH 
    }//END _SHOWONFOCUSBYTASK
    
    ///////////////////////
    , _hideOnDeFocusByTask: function ( selector, task ) {
    ///////////////////////    
        switch ( task ) {
          case 'menu':
            $( selector ).flyingPanel( 'hide' );
          break;
          case 'item':
            $( selector ).closest( '.GRID > .STICKER, .GRID > .CONTAINER' ).flyingPanel( 'hide' );
          case 'subgrid':
            $( selector ).dev_gadgetRules( 'reset' );//Remove overlay from container
           break;
        };//END SWITCH 
    }// _HIDEONDEFOCUSBYTASK
    
    ///////////
    , _getMyObj: function ( id ) { return $( '.PAGE' ).ios( 'GetNodeByIdent', id ) }
    ///////////
    
    ///////////////////////////////
    , _handleItemFocusOnMenuViewChange: function ( selector ) {
    ///////////////////////////////
        var $focus = $( 'body' ).data( 'gadgetFocus' );
        if ( ! $focus.length  ) return;//If focus is the styleable with the menu itself
        
        var stadi = $( selector ).data( 'menu' ).options.viewStadi 
          , button =  $focus.attr( 'id' ).split('-')[ 2 ]//get first, item, sub or last
          ;
          
        /////////////////////////////////////////
        // IF IT IS NOT VISIBLE                //
        // ( LEVEL OR STADI IS SET ON HIDDEN ) //
        /////////////////////////////////////////
        if ( ! $focus.is( ':visible' ) ) { 
          $focus
            .parentsUntil( '.CONTAINER, .STICKER', 'menu' )
            .each( function ( i ) {
              var $this = $( this )
                , $next = 
                    $this
                      .find( '> li > a:visible' )
                      .filter( function ( index ) { 
                        return $( this ).attr( 'id' ).indexOf( stadi.toLowerCase() ) != -1  
                            && $( this ).attr( 'id' ).indexOf( button.toLowerCase() ) != -1
                             ;  
                      })
                      ;
              /////////////////////////////////////////
              // FIRST BUTTON WITH THE SAME STADI ON //
              // A VISIBLE LEVEL WILL BE SET ON      //
              // FOCUS INSTEAD OF $focus             //
              /////////////////////////////////////////
              if ( $next.is( ':visible' )  ) {
                $focus.dev_gadgetFocus( 'deactivate' );
                $next.dev_gadgetFocus( 'activate' );
                return false;
              }//END IF
            })//END EACH 
            ;
        }//END IF
    }//END _handleItemFocusOnMenuViewChange
  }[ opt ]
  ;
}
;