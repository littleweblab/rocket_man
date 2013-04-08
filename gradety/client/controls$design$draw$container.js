function controls$design$draw$container ( opt ) {   
  return {
      //////////
      resizable: {
      //////////
    	    minHeight: 1
        , minWidth: 1
        , handles: 's'
        , ghost: false
        , helper: 'ui-resizable-helperContainer'
        , disabled: true
        , start: function ( event, ui ) {
          ///////////////////////////////
          // HIDE SCROLLBARS ON RESIZE //
          ///////////////////////////////
          ui.element
            .css( 'overflow', 'visible' )
            .find( ':first:not(.ui-resizable-s)' )
              .css( 'overflow', 'hidden' )
              ;
          
          $( '.ui-resizable-handle' ).not( '.ui-resizable-s' ).unbind();//Disable other resizer than sorth 
          
          ////////////////////////////
          // APPEND REZISABLE LABEL //
          //////////////////////////// 
          $( '.ui-resizable-helperContainer' )
            .css( 'overflow', 'hidden' )
            .append( '<div class="STICKER-biforkResizeLine"></div>'
                   + '<div class="STICKER-templateingResize-n">' 
                   + '<div>'
                   + '<div class="UI-CONTAINER-choose STYLE-resizeChooseHorizontal">' 
                   + '<a href="#" class="UI-BUTTON-choose">Top</a>'  
                   + '</div>' 
                   + '</div>'
                   )//END APPEND
                   ;
        }//END START
        , resize: function ( event, ui ) {
          var $resizeLabelParent = $( '.ui-resizable-helperContainer' ).find( '.STICKER-templateingResize-n' );
          
          $resizeLabelParent
            .find( '.UI-CONTAINER-choose > .UI-BUTTON-choose' )
              .html( ui.size.height + ' <strong class="STYLE-lowercase">px</strong>' )
              .end()
              .css( 'margin-left', - $resizeLabelParent.width() / 2 )
              ;
        }//END RESIZE
      , stop: function ( event, ui ) {
          var grid =  ui.element.closest('.GRID')
            , myobj = createdesign$draw( '_getMyObj' )( grid.attr('id') )
            , sumHeight = grid.styleable( 'allContainerHeight' )
            ;
       
          grid.styleable( 'resize', ui.element, ui.size.height  );
          ui.helper.find( 'div' ).remove();//Removes size label
          ////////////////////////////////////////////////////
          // BRING SCROLLBAR BACK TO CONTAINER IF NESSESARY //    
          ////////////////////////////////////////////////////
          ui.element
            .css( 'overflow', 'auto' )
            .find( ':first:not(.ui-resizable-s)' )
              .css( 'overflow', 'visible' )
              ;
          
          ////////////////////////////////////////////////////////////////////
          // THIS FIXES PROPBLEM IN WEBKIT TO RECREATE THE AUTO WITH IN DOM // 
          ////////////////////////////////////////////////////////////////////
          ui.element
            .width( '1px' )
            .width( 'auto' )
            ;
         
          helperResetPositionAfterResize( ui.element, ui.element.find( '> .ui-resizable-s' ), 'bottom' );//Reset position of the resizer is nessesary if content of container was scrolled
        }//END STOP
    }//END RESIZABLE
    
    //////////////////
    , dev_gadgetFocus: {
    //////////////////
       
        activate: function ( event, ui ) {
          createdesign$draw( '_focusStart' )( ui ); 
          helperToggleFitSortable( ui.element, ! ui.element.data( 'styleable_item' ).fit  );
          createdesign$draw( '_showOnFocusByTask' )( ui.element, ui.element.data( 'styleable_item' ).task )
         
        }//END ACTIVATE
      , deactivate: function ( event, ui ) {
          createdesign$draw( '_focusStop' )( ui ); 
          helperToggleFitSortable( ui.element, false  );
          createdesign$draw( '_hideOnDeFocusByTask' )( ui.element, ui.element.data( 'styleable_item' ).task )
      }//END DEATIVATE
    }//FOCUSED END   
    ///////
    , bind: {
    ///////
        'mouseenter': function ( event ) { $( this ).trigger( 'leaveBottom' ); }
      , 'mouseleave': function ( event ) { $( this ).trigger( 'mouseenter' ); }
    }//BIND END      
  }[ opt ]
  ;
}
;