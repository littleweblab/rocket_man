function createdesign( opt ) {   
  return {
    ////////  
    menuBar: { dev_gadgetMenu: getMenubarObj() }
    ////////
  
    //////////
    , addButton: {
    //////////
        dev_gadgetButton: {
          action: function ( event, ui ) { 
            ui.button.bind( 'click', function () {
              window.location = '/design/wizzard/' + URL.address[ 0 ];
            });//END BIND
          }//END ACTION
        }//END DEV_GADGETBUTTON
    }//END ADD BUTTON
    
    ////////////////
    , designBrowser: {
    ////////////////
        dev_gadgetRename: {
          maxSigns: 18
        , save: function ( event, ui ) {}
        , onStart: function ( ){ }
        , onStop: function () { } 
        } //END DEV_GADGETRENAME
      , bind: { 
          'mouseup': function ( event ) { 
            var designid = $( this ).closest( 'li' ).data( 'designId' );
            var projectid = $( this ).closest( 'li' ).data( 'projectId' );
            window.location = '/design/draw/' + projectid + '/' + designid;
          }//END MOUSEUP
      }//END BIND
      , draggable: { 
          disabled: false 
        , helper: 'clone'
        , scroll: false
        , zIndex: 100000 
        , containment: 'body'
        , appendTo: 'body'
        , cursorAt: { left: 43, top: 33 }
        , start: function ( event, ui ) {
          
          var $this = $( this )
            , parent = $this.closest( 'li' ).css( 'opacity', 0 )// Hide original untill we know what to do with it
            , designId = parent.data( 'designId' )
            ;
       
          ui.helper
            .addClass( 'HELPER-onDrag' ).css({ 'width': 86,'height': 66, 'background': '#232323' }) //Add round corners
            .html( '<h1 class="HELPER-onDragLabel">' +  helperTextCut( $this.next().text() , 8 ) + '</h1>' )
            ;
            
          $( '.UI' )
            .dev_gadgetClipboard( 
              'bindDroppable'
            , [ 'Trash', 'Copy' ]
            //////////
            // OVER //
            ///////////////
            , [ // TRASH //
                ///////////
                function () { 
                  ui.helper
                    .find( '.HELPER-onDragLabel' )
                      .stop()
                      .fadeOut( 
                        'fast'
                      , function () { 
                          $( '<h1 class="HELPER-onDropLabel">Delete</h1>' )
                            .prependTo(  ui.helper )
                            .stop()
                            .fadeIn()
                            ;
                          
                          ui.helper.animate({ width: 75, height: 40 });
                        }//END CALLBACK
                      )//FADE OUT
                      ;
                    }//END TRASH OVER
                 
                  //////////
                  // COPY //
                  //////////
                , function () { 
                    ui.helper
                      .find( '.HELPER-onDragLabel' )
                        .stop()
                        .fadeOut( 
                          'fast'
                        , function () {
                            $( '<div class="HELPER-onCopyDrag"><h1 class="HELPER-onDropLabelCopy">Copy</h1></div>' )
                              .prependTo( ui.helper )
                              .parent()
                                .css({ 'overflow': 'visibly' })
                                .end()
                              .css({ 'background-color': '#464646' })
                              .stop()
                              .animate({
                                'width': 86
                              , 'height': 66 
                              , 'margin-left': '-16px'
                              , 'margin-top': '-16px'
                              , 'opacity': 1
                              })//END ANIMATE
                              ;
                          });//FADE OUT CALLBACK 
                    }//END COPY OVER 
                  ]//END OVER 
                
                /////////
                // OUT //
                ///////////////
                , [ // TRASH //
                    ///////////
                    function () { 
                      ui.helper
                        .find( 'h1.HELPER-onDropLabel' )
                          .stop()
                          .fadeOut( 
                            'fast'
                          , function () { 
                              $( this ).remove(); 
                          })//END FADEOUT CALLBACK
                          .end()
                        .stop()
                        .animate(
                          { 'width': 86, 'height': 66  }
                        , { step: function () { } 
                          , complete: function () {
                              ui.helper
                                .find( '.HELPER-onDragLabel' )
                                .fadeIn( 'fast' )
                                ;
                            }//END COMPLETE
                          }//END CALLBACKS
                        );//END ANIMATE
                    }//END TRASH OUT
                    
                      //////////
                      // COPY //
                      //////////
                    , function () {  
                        ui.helper.find( '.HELPER-onCopyDrag' )
                          .stop()
                          .animate({
                            'margin-left': 0
                          , 'margin-top': 0
                          , 'opacity': 0 }
                          , function() { 
                              $( this ).remove(); 
                              ui.helper
                                .find( '.HELPER-onDragLabel' )
                                .stop()
                                .fadeIn( 'fast' )
                                ;
                            }//END CALLABCK
                          );//END ANIMATE
                    }//END COPY OUT 
                  ]//END OUT
                
                //////////
                // DROP //
                ///////////////
                , [ // TRASH //
                    ///////////
                    function () {
                      $.ajax({
                        url: '/design/ajax'
                      , type: 'POST'
                      , async: false
                      , cache: false
                      , timeout: 30000
                      , data: {  type:'design$list$delete', data: JSON.stringify([ URL.address[ 0 ], designId ]) }
                      , error: function ( err ) { alert('error'); }
                      , success: function ( msg ) {  parent.data( 'droppedOnTrash', true ); }
                      })//END AJAX
                      ;
                    }//END TRASH DROP
                    
                    //////////
                    // COPY // 
                    //////////
                  , function () {
                      $.ajax({
                        url: '/design/ajax'
                      , type: 'POST'
                      , async: false
                      , cache: false
                      , timeout: 30000
                      , data: {  type:'design$list$copy', data: JSON.stringify([ URL.address[ 0 ], designId ]) }
                      , error: function ( err ) { alert('error'); }
                      , success: function ( copied ) { $( '.STAGE' ).designBrowser( 'addDesign', copied ); }    
                    })//END AJAX
                    ;
                  } //END COPY DROP  
                ] //END DROP
                , '.STYLE-designBrowserIcon'//ACCEPT 
            )//END DEV_GADGETCLIPBOARD          
            ;
         
          $( '.UI' ).dev_gadgetClipboard( 'show', [  'Copy', 'Trash' ] );
        }//END START
        , stop: function ( event, ui ) {
            var $design = $( this ).closest( 'li' );
            if ( $design.data( 'droppedOnTrash' ) == true ) $( '.STAGE' ).removeData( 'droppedOnTrash' ).designBrowser( 'removeDesign', $design );
            else $design.animate({ 'opacity': 1 } ); 
            $( '.UI' ).dev_gadgetClipboard( 'hide', [  'Copy', 'Trash' ] );
        }//END STOP
      }//END DRAGGABLE
    }//END DESIGNBROWSER
 
    /////
    , ui: {
    ///// 
        dev_gadgetLayout:{ show: [ 'menu', 'edit', 'stage' ] }//Layout 
      , dev_gadgetClipboard: { disabled: false }
    }//END UI
  }[ opt ]
  ;
}
;