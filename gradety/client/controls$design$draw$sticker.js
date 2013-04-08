function controls$design$draw$sticker ( opt ) {   
  return {
    /////////////
    _createLabel: function ( direction ) {
    /////////////  
      var containerStyle
        ;
      
      switch ( direction ) {
        case 'n': containerStyle = 'STYLE-resizeChooseHorizontal';
        break;
        case 's': containerStyle = 'STYLE-resizeChooseHorizontal';
        break;
        case 'w': containerStyle = 'STYLE-resizeChooseVerticalLeft';
        break;
        case 'e': containerStyle = 'STYLE-resizeChooseVerticalRight';
        break;
        default: containerStyle = 'STYLE-resizeChooseHorizontal';
      }//END SWITCH
        
          
       var html = '<div class="STICKER-templateingResize-' + direction + '">'  
             +   '<div class="UI-CONTAINER-choose ' + containerStyle + '">' 
             +     '<a href="#" class="UI-BUTTON-choose">'+direction+'</a>'
             +   '</div>'
             + '</div>'
             ;  return html;
             
    }//END _CREATELABEL
    
    //////////
    , _pxUnit: '<strong class="STYLE-lowercase">px</strong>'
    //////////
    
    ///////   
    , bind: {
    ///////
        'mouseenter.sticker': function ( event ) { event.stopImmediatePropagation(); $( this ).trigger( 'leaveBottom' ); }
      , 'mouseleave.sticker': function ( event ) { $( this ).trigger( 'mouseenter' ); }
    }// BIND END
    
    ////////////
    , resizable: {
    ////////////
        minHeight: 10
      , minWidth: 10
      , handles: 's,e,w,n,se'
      , ghost: true
      , helper: 'ui-resizable-helperSticker'
      , start: function ( event, ui ) {
          var $handler = $( event.originalEvent.target )
            , data = ui.element.data( 'helperResizeData', [] ).data( 'helperResizeData' )
            , directions = 'n,s,w,e,se'.split(',') 
            ;
          
          for ( var x in directions ) {
            if ( $handler.hasClass( 'ui-resizable-' + directions[ x ] ) ) {
              data.push( directions[ x ], $( controls$design$draw$sticker( '_createLabel' )( directions[ x ][ 0 ] ) ).appendTo( 'body' ).find( '.UI-BUTTON-choose' ) );
              if ( directions[ x ][ 1 ] ) data.push( $(  controls$design$draw$sticker( '_createLabel' )( directions[ x ][ 1 ] ) ).appendTo( 'body' ).find( '.UI-BUTTON-choose' ) );
            }//END IF
          }//END LOOP
      }//END START
      
      , resize: function ( event, ui ) {
        var resizeLabelSticker = ui.element.data( 'helperResizeData' )
          , pxUnit = controls$design$draw$sticker('_pxUnit')
          , label = resizeLabelSticker[ 0 ]
          , width = ui.size.width
          , height =  ui.size.height
          , w = { collision:'none none', of: ui.helper, my: 'right center', at: 'left center', offset: '0 0' }
          , e = { collision:'none none', of: ui.helper, my: 'left center', at: 'right center', offset: '0 0' }
          , n = { collision:'none none', of: ui.helper, my: 'center bottom', at: 'center top', offset: '0 0' }  
          , s = { collision:'none none', of: ui.helper, my: 'center top', at: 'center bottom', offset: '0 0' }
          ;

        for ( var i in resizeLabelSticker ) {
          if ( i > 0 ) { 
            var $currentLabel = resizeLabelSticker[ i ]
              , $sticker = $currentLabel.parent().parent()
              , stickerPos = $sticker.width() / 2
              ;
          
            if ( label == 'w' ) { 
              $sticker.position( w );
              $currentLabel.html( width + pxUnit ); 
            }//END IF
            else if (  label == 'e' ) { 
              $sticker.position( e );
              $currentLabel.html( width + pxUnit ); 
            }//END ELSE IF
            else if ( label == 'n'  ) {
              $sticker.position( n );
              $currentLabel.html( height + pxUnit );
            }//END ELSE IF
            else if ( label == 's' ) {
               $sticker.position( s );
               $currentLabel.html( height + pxUnit );
            }//END ELSE IF
            else if ( label == 'se' ) {
              if ( i == 1 ) {
                $sticker.position(e);
                $currentLabel.html( height + pxUnit );
              
              } else {
                $sticker.position(s);
                $currentLabel.html( width + pxUnit );
              } //END IF/ELSE
            }//END ELSE IF
          }//END IF
        }//END LOOP
      }//END RESIZE
      , stop: function ( event, ui ) { 
          var stickerList = ui.element.data( 'helperResizeData' )          
            , grid =  ui.element.closest( '.GRID' )
            ;
          
          for ( var sticker in stickerList  ) $( stickerList[ sticker ] ).parent().parent().remove();
          ui.element.removeData( 'helperResizeData' );  
          grid.styleable( 'resize', ui.element, ui.size.height, ui.size.width, parseInt( ui.element.css( 'left' ) ), parseInt( ui.element.css( 'top' ) ));
      
      }//END STOP
    }//END RESIZABLE
               
    ////////////
    , draggable: {
    ////////////
        containment: '.STAGE'
      , start: function ( event, ui ) {  
          var data = $( this ).data( 'helperResizeData', [] ).data( 'helperResizeData' );
          data.push(    
            $(  controls$design$draw$sticker( '_createLabel' )( 'n' ) ).appendTo( 'body' ).find( '.UI-BUTTON-choose' ) 
          , $(  controls$design$draw$sticker( '_createLabel' )( 'w' ) ).appendTo( 'body' ).find( '.UI-BUTTON-choose' ) 
          )
          ;      
      }//END START
      , drag: function ( event, ui ) { 
          var resizeLabelSticker = $(this).data( 'helperResizeData')
            , n = { collision:'none none', of: ui.helper, my: 'center bottom', at: 'center top', offset: '0 0' }
            , w = { collision:'none none', of: ui.helper, my: 'right center', at: 'left center', offset: '0 0' }  
            , $top = resizeLabelSticker[ 0 ]
            , $left = resizeLabelSticker[ 1 ]
            , $topSticker = resizeLabelSticker[ 0 ].parent().parent()
            , $leftSticker = resizeLabelSticker[ 1 ].parent().parent()
            ;
           
          $top.html( Math.round( ui.position.top )  + controls$design$draw$sticker( '_pxUnit' ) ); 
          $topSticker.position( n );
          
          $left.html( Math.round( ui.position.left ) + controls$design$draw$sticker( '_pxUnit' ) ); 
          $leftSticker.position( w ); 
          
      }//END DRAG
      , stop: function ( event, ui ) {    
          var $this = $( this )  
            , grid =  $this.closest( '.GRID' )
            , stickerList = $this.data( 'helperResizeData' )
            ;
          
          for ( var sticker in stickerList  ) $( stickerList[ sticker ] ).parent().parent().remove();
          $this.removeData( 'helperResizeData' );  
          grid.styleable( 'resize', $this, $this.height(),  $this.width(), Math.round( ui.position.left ),  Math.round( ui.position.top ) );
      }//END STOP
    }//END DRAGABLE 
    
    //////////////////
    , dev_gadgetFocus: {
    //////////////////
        activate: function ( event, ui ) {
          createdesign$draw( '_focusStart' )( ui );
          ui.element.resizable( 'disable' );// DISABLE RESIZABLE
          ui.element.draggable( 'disable' );// ENABLE REZISABLE 
          createdesign$draw( '_showOnFocusByTask' )( ui.element, ui.element.data( 'styleable_item' ).task )
          ui.element.dev_gadgetRules( 'removeOverlay' );//Remove overlay from container
        }//END ACTIVATE
      
      , deactivate: function ( event, ui ) {
          createdesign$draw( '_focusStop' )( ui );  
          ui.element.resizable( 'enable' );// DISABLE RESIZABLE
          ui.element.draggable( 'enable' );// ENABLE REZISABLE
          ui.element.dev_gadgetRules( 'reset' );//Rest subgrid overlay if nessesary      
          createdesign$draw( '_hideOnDeFocusByTask' )( ui.element, ui.element.data( 'styleable_item' ).task )
        }//END DEACTIVATE
      }//END FOCUS  

  }[ opt ]
  ;
}
;