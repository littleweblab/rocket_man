function createpages ( opt ) { 
  return {
    ////////
    menuBar: { dev_gadgetMenu: getMenubarObj() }  
    ////////
    
    ///////////
    , browseBar: { dev_gadgetBrowse: getPageBrowseObj() }
    ///////////
    
    ///////
    , tank: { dev_gadgetTank: { disabled: false } }
    ///////
    
    ////////////////
    , buttonAddPage: {
    ////////////////  
        dev_gadgetBubble: {
          'button.AddNewPageIcon': { 
            addClass: 'STYLE-itemMedithumbIcon ICON-add-mini'
          , action: function ( events, ui ) {} 
          }//END BUTTON addContainer
        , 'button.Add new page': function ( events, ui ) { 
            ui.button.bind( 'click', function () { $( '.PAGE' ).page( 'newPage', ui.element.find( '> menu' ) ); });//END BIND
          }//END ADD CONTAINER
        }//BUBBLE END
    }//END BUTTONADDPAGE 
    
    ///////
    , page: { 
    ///////
        page: { 
          disabled: false 
        , addControls: function ( event, ui ) {
            $( '.UI' ).controls( 
              'add'
            , '.PAGE .CONTAINER:has(menu)/buttonAddPage' 
            , '.GRID-panelSetup > .UI-CONTAINER-option/menuSetupPage'
            );//END CONTROLS
           
            $( '.PAGE .CONTAINER > menu' ) 
              // TAKE OVER THE MENU PATHES 
              .delegate( 'a', 'click', function ( event ) { 
                event.preventDefault();
                helperClickAndDbClick( $( this ), function ( $this ) { 
                  if ( $this.attr( 'contentEditable' ) != 'true' ) window.location = '/pages/' + URL.address[ 0 ] + '/' + $this.data( 'id' ); 
                }, 400 )
              })//END DELEGATE
              .find( 'menu' )
                .andSelf()
                  .page$menu()
                  ;      
                    
              $( '.UI' ).dev_gadgetLayout( 'update' );

          }//END ADDCONTROLS
        }//END PAGE 
    }//END PAGE
    
    ////////////////
    , menuSetupPage: {
    ////////////////    
        dev_gadgetMenu: {  
          type: 'pagesetup'
        , 'button.save': {  
            action: function ( event, ui ) { 
              ui.button.bind( 'click', function () {
                $( '.PAGE' ).page( 'save' );
              });//END BIND
            }//END ACTION
          }//END BUTTON.SAVE
        , 'button.delete': {  
            addClass: 'STYLE-itemPagesetupIcon ICON-trash-mini'
          , action: function ( event, ui ) { 
              ui.button.bind( 'click', function () {
                var $page = $( '.PAGE' );
                 $page
                  .page( 'remove' )
                  .page( 'save', function ( respond ) { 
                    window.location = '/pages/' + URL.address[ 0 ] + '/' +  respond[ 0 ].id;  
                  })
                  ;
              });//END BIND
            }//END ACTION
          }//END BUTTON.SAVE
        }//END GADGETMENU
    }//END MENUSETUPPAGE
    
    /////
    , ui: { 
    /////  
        dev_gadgetClipboard: { disabled: true } 
      , dev_gadgetLayout:{ show: [ 'menu', 'edit', 'setup', 'stage', 'browse' ] }
    }//END UI
  }[ opt ]
  ;
}
;