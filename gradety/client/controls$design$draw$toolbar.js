function controls$design$draw$toolbar ( opt ) {   
  return {
    ////////
    toolBar: {
    ////////  
      dev_gadgetMenu: {
        type: 'toolbar'
      , selectable: 'none'
      , 'button.Hide Grid': {  
          extraStyles: 'STYLE-toolbar-drawHideGridButton'
        , action: function( event, ui ) { 
            ui.button.bind( 'click', function () {
              var gridHelper = $('.Grid >  .ui-resizable-handle ')
                ;
                
              if ( $('.Grid >  .ui-resizable-handle ').css( 'display' ) == 'none' ) {
                $( this ).text('Hide Grid'); 
                $( '.Grid > .ui-resizable-handle, .STICKER > .ui-resizable-handle' ).fadeIn( 'fast' );
              } else {  
                $( this ).text( 'Show Grid' );  
                $( '.Grid >  .ui-resizable-handle, .STICKER > .ui-resizable-handle ').fadeOut( 'fast' );
              }//END IF/ELSE  
            });//END BIND
        }//END ACTION
      }//END BUTTON HIDE GRID
      , 'button.Copy Attributes': {  
          extraStyles: 'STYLE-toolbar-drawCopyStyleButton'
        , css:{ 'display': 'none' }
        , action: function( event, ui ) { 
            ui.button.bind( 'click', function () {
              var $body = $( 'body' )
                , data = $body.data( 'gadgetFocus' ).data( 'styleable_item' )
                , paste =  $( '.STYLE-toolbar-drawPasteStyleButton' ).fadeIn( 'fast' );//Find paste button and fade it in
              if ( !! $( 'body' ).data( 'copy' ) ) helperToolbarFeedback( paste.find('a'), '#cacaca' );//Give feedback that Attributes are copied
              $body.data( 'copy', $.extend( true, {},  data.styles ) );//Save attribute data for paste as hard copy
            });//END BIND
        }//END ACTION
      }//END BUTTON COPY ATTRIBUTES
      , 'button.Paste Attributes': {  
          extraStyles: 'STYLE-toolbar-drawPasteStyleButton'
        , css:{ 'display': 'none' }
        , action: function( event, ui ) { 
            ui.button.bind( 'click', function () {
              var $body = $( 'body' )
                , data = $body.data( 'gadgetFocus' ).data( 'styleable_item' )
                , styles = $body.data( 'copy' )
                ;
              data.parent.styleable( 'setStyles', data.self, styles );
              $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'browseTo', 'styleable_setup', true );//Update Browsebar
            });//END BIND
        }//END ACTION
      }//END BUTTON PASTE ATTRIBUTES
      , 'button.Cancel': {  
          extraStyles: 'STYLE-toolbar-drawCancelButton'
        , action: function( event, ui ) { 
            ui.button.bind( 'click', function () {
              var areYouShure = confirm( "Are you sure? All changes will be gone?" );
              if ( areYouShure != false ) window.location = '/design/';
            });//END BIND
        }//END ACTION
      }//END BUTTON CANCEL
      , 'button.Save': {  
          extraStyles: 'STYLE-toolbar-drawSaveButton'
        , action: function( event, ui ) { 
            ui.button.bind('click', function(){ 
              // ajax-call in TIOCS, action not used jet     
              $('.PAGE').ios('doSendBifork');
            });//END BIND
          }//END ACTION
        }// END BUTTON SAVE 
      }//END GADGETMENU
    }//END TOOLABR
  }[ opt ]
  ;
}
;