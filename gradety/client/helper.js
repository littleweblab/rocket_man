function helperToggleFitSortable ( $element, toggler ) {
  if ( toggler == false ) {  
    $element
      .resizable( 'disable' )
      .find( '> .ui-resizable-s' )
        .css( 'display','none' )
        ;
    helperMakeItSortableKey( $element, toggler );//Add sortable event
  
  } else {
    $element
      .resizable( 'enable' )
      .find( '> .ui-resizable-s' )
        .css({ 'display': 'block' })
        .append( '<div class="STICKER-biforkResizeLine"/>' )
        ;
    helperMakeItSortableKey( $element, toggler );//Add sortable event
    helperHoldPositionOnScroll( $element, $element.find( '> .ui-resizable-s' ), 'bottom' );//Hold resizer at his position on scroll
           
  }//END IF/ELSE
}
//////////////////////////////////////////////////////
// HELPs TO UPPERCASE THE FIRST LETTER OF AN STRING //
//////////////////////////////////////////////////////
function helperFirstLetterToUppercase ( string ) {
  return string.substr( 0, 1 ).toUpperCase() + string.substr( 1 );
}

/////////////////////////////////////
// HELPBOX FOR AN EMTY PAGE DESIGN //
/////////////////////////////////////
function helperEmtyPageDesign () {
  var anySplits = $( '.PAGE' ).ios('GetZeroNodes').Item.length > 1
    , anyContainers = $('#' + $( '.PAGE' ).ios('GetZeroNodes').Item[ 0 ].Ident ).styleable('styleablesList') != 0
    ;
    
  if ( anySplits || anyContainers ) $( '.STICKER-helperFirstSplit' ).fadeOut( 200, function () { $( this ).remove(); } );
  else {
    var PAGE = $( '.PAGE' )
      , helperFirstSplit =  $( '.STICKER-helperFirstSplit' )
      , pageWidth = PAGE.width();
      
    if ( ! helperFirstSplit.length ) {
      helperFirstSplit = 
        $( '<div class="STICKER-helperFirstSplit">'
        + '<div class="CONTAINER-biforkFirstAdd"><h1>Make your first split</h1></div>'
        + '<div class="CONTAINER-help"><h1>What the hell is a split?</h1><p>You can read some usefull help stuff in microsoft style here!</p></div>'
        + '</div>'
        )
        .appendTo( PAGE );
    }//END IF

    helperFirstSplit
      .find( '.CONTAINER-biforkFirstAdd h1' )
        .css({ 'font-size' : ( pageWidth / 30 ), 'margin-top': - ( ( pageWidth / 30 ) / 2 )  })
        .end()
      .find( '.CONTAINER-help' )
        .css({ 'margin-left':  pageWidth / 2  + ( ( pageWidth / 30 )  ) 
        , 'margin-right': pageWidth / 30 
        , 'margin-top': ( pageWidth / 30 ) / 2  
        });//END CSS
  }//END IF/ELSE
}//END HELPEREMTYPAGEDESIGN

////////////////////////////////////////////////////////////
// WORARRAOUND: IT LOOKS LIKE SORTABLE                    //
// CREATES THE CONTAINMENT PROPERTIES BEFORE              //
// THE START AND DON'T REFRESH IT ON SORT.                //
// SO THE WIDGET DOESN'T USE THE                          //
// NEW DIMENSIONS OF ui.item TO FIND THE LIMITATIONS      //
// OF THE .STAGE. SO I HAD TO ANNUL THE WIDGET            //
// AND UPDATE CONTAINMENT AGAIN WITH ._setContainment()   //
// DIRECTLY WITH A CALL IN WIDETS DATA ELEMENT.           //
////////////////////////////////////////////////////////////
// + 9 PREVENTS A SCROLLBAR FOR .STAGE IN                 //
// MOZILLA, THAT IS CAUSED BY THE SHADOW OF THE ui.helper //
////////////////////////////////////////////////////////////
function helperUpdateSortableItemPosition ( element, width, height ) {
  if ( element.data( 'sortable-item' ) ) {
    var sortable = element.data('sortable-item');
        sortable.helperProportions = { height:  height , width: width };
        element.data('sortable-item')._setContainment();
  }
}
////////////////////////////////////////////////
// WORKARROUND: IT LOOKS LIKE SORTABLE        //                
// CREATES THE CURSOR AT PROPERTIES BEFORE    //              
// THE START AND DON'T REFRESH THEM ON SORT.  //
// SO I UPDATE THEM DIRTY IN THE IN THE FINAL // 
// DATA ELEMENT                               //
////////////////////////////////////////////////
function helperUpdateSortableCursorAt ( element, at ) {
   var sortable = element.data( 'sortable-item' );
   sortable.offset.click.left = at.left; 
   sortable.offset.click.top = at.top;
}

///////////////////////
// DYNAMICSTYLESHEET //
///////////////////////
function helperDynamicStyleSheet ( classname, attributes ) {
  var styleSheet = [];
  if(!$( 'style#dynamicStyleSheet-' + classname).length ) $( '<style id="dynamicStyleSheet-' + classname +'"/>' ).appendTo( 'head' );
  var styleHtml = $( 'style#dynamicStyleSheet-' + classname ); 
  
  styleSheet.push( '.' + classname + ' { ' );
  for ( style in attributes ) styleSheet.push(style +  ' : ' + attributes[style] + ';');
  styleSheet.push( ' }' );
  return styleHtml.html( styleSheet.join( '' ) );
}
/////////////////
// TEXT CUT... //
/////////////////
function helperTextCut( txt, lng ) {
  if ( ! txt || ! lng ) return '';
  return  txt.length > lng ? txt.substr( 0, ( lng - 3 ) ) + '... ' : txt;
}
/////////////////////////////
// HOLD POSITION ON SCROLL //
/////////////////////////////
function helperHoldPositionOnScroll ( scroller, holder, pos ) {
  var holderHeight  = holder.outerHeight();
  scroller.scroll( function ( event ) {
    var bottomExtra = pos == 'top' ? 0 : scroller.outerHeight() - holderHeight; 
    holder.css({'top': scroller.scrollTop() + bottomExtra });
  });
};
/////////////////////////////////
// RESET POSITION AFTER RESIZE //
/////////////////////////////////
function helperResetPositionAfterResize( scroller, holder, pos ) {
  var bottomExtra = pos == 'top' ? 0 :  scroller.outerHeight() - holder.outerHeight(); 
  holder.css({ 'top': scroller.scrollTop() + bottomExtra });
};
//////////////////////////
// MAKE IT SORTABLE KEY //
//////////////////////////
function helperMakeItSortableKey ( element , addRemove ) {
  if ( addRemove == true ) {
    $( document )
      .bind( 'keydown.focus', 'meta', function( event ) {
        event.preventDefault();
        element.removeClass('ui-sortable-cancel');//Remove class ui-sortable-cancel from conatiner makes ist sortable
      })
      .bind( 'keyup.focus', 'meta', function( event ) {
        event.preventDefault();
        element.addClass('ui-sortable-cancel');//Add class ui-sortable-cancel from conatiner makes ist unsortable
      });
  }//END IF 
  else { 
    $( document ).unbind( 'keydown.focus' ); 
    element.addClass('ui-sortable-cancel');//Add class ui-sortable-cancel from conatiner makes ist unsortable
  }//Remove Draggable            
}//END HELPERMAKEITSORTABLEKEY

////////////////////////////////////////
// HELPER SORTABLE PLACEHOLDER MARGIN //
////////////////////////////////////////
function helperSortablePlaceholderMargin ( element, ui ) { 
  var $this= $( element )
    , AddHandlerHeight = $this.closest( ':has(> .ui-resizable-n )' ).children( '.ui-resizable-n' ).height()
    , AddHandlerWidth = $this.closest( ':has(> .ui-resizable-w)' ).children( '.ui-resizable-w' ).width()
    ;

    if ( AddHandlerHeight != 0 ) ui.placeholder.css( { 'margin-top': 5 +  AddHandlerHeight });
    else ui.placeholder.css( { 'margin-top': 5 } );

    if ( AddHandlerWidth != 0 ) ui.placeholder.css( {'margin-left': 5 +  AddHandlerWidth });
    else ui.placeholder.css( { 'margin-left': 5  });
}//END HELPER SORTABLEPLACEHOLDERMARGIN
  
function helperToolbarFeedback ( button , highlight ) {
  var color = button.css( 'color' );
  ////////////////////////
  // GIVE COPY FEEDBACK //
  ////////////////////////
  button.animate(
    { color: highlight }
    , 'fast'
    , function () { 
      $( this ).animate(
        { color: color }
      , 'fast'
      , function () { button.css('color', ''); } 
      );//END ANIMATE 
   }//END CALLBACK  ‚
  );//END ANIMATE
}//END HELPERTOOLBARFEEDBACK

//////////////////////////
// COPY PASTE ATTRIBUTE //
//////////////////////////
function helperCopyPasteAttributes ( toggle ) {
  if ( toggle ) {
    if ( $('body').data( 'copy' ) ) $( '.STYLE-toolbar-drawPasteStyleButton' ).clearQueue().stop().fadeIn( 'fast' );//Show paste attributes button
    $( '.STYLE-toolbar-drawCopyStyleButton' ).clearQueue().stop().fadeIn( 'fast' );//Show copy attributes button
  }//END IF 
  else $( '.STYLE-toolbar-drawPasteStyleButton, .STYLE-toolbar-drawCopyStyleButton' ).delay( 20 ).fadeOut( 'fast' );//Fade out copy/paste attributes button
}//END HELPERCOPYPASTEATTRIBUTE

////////////////
// EXAMINEURL //
////////////////
function helperExamineUrl () {
  function cleanUpUrl( url ){
    var cleanup = []
      , url = url.split( '/' )
      , address = []
      ; 
    for ( var sub in url ) {
      var dontTakePorts = url[ sub ].search( /\.|:/ ) > 0
        , path = ( cleanup.length > 0 ) ? cleanup.join( '$' ) + '$' + url[ sub ] : url[ sub ]
        , isFunction = typeof window[ 'create' + path ] == 'function'
        ;
      if ( url[sub].length && !dontTakePorts && isFunction ) cleanup.push( url[ sub ].replace( /\?.*/, '' ) );
      else if ( !dontTakePorts && url[ sub ].length) address.push( url[ sub ] );
    }//END LOOP
    return { mode: cleanup.join( '$' ), address: address };
  }// END CLEANUPURL
  return cleanUpUrl( document.URL );
}//helperExamineUrl

////////////////////////////////////
// HELPER GET LENGTH OF AN OBJECT //
////////////////////////////////////
function helperObjLength ( obj ) {
    var size = 0, key;
    for ( var key in obj ) if ( obj.hasOwnProperty( key ) ) size++;
    return size;
}//END HELPEROBJLENGTH 

//////////////////////////////////////////////////////////////////
// HELPER IF YOU NEED TO BIND CLICK AND DB CLICK TO ONE ELEMENT //
//////////////////////////////////////////////////////////////////
function helperClickAndDbClick ( $selector, func, interval ) { 
  if ( $selector.data( 'helperClickAndDbClick' ) == undefined  ) { 
    $selector
      .data( 
        'helperClickAndDbClick' 
      , window.setInterval( 
          function () { 
            window.clearInterval( $selector.data( 'helperClickAndDbClick' ) ) ;
            func( $selector )
             
          }//END FUNC
        , interval || 400
        )//END SETINTERVAL
    );//END DATA
  }//END IF
  else {
    window.clearInterval( $selector.data( 'helperClickAndDbClick' ) );
    $selector.removeData( 'helperClickAndDbClick'  );
  }//END ELSE
}//END HELPERCLICKANDDBCLICK

function helperUpload ( $uploadButton, frame, options , showAllOnEnterWindow ) {
    ///////////////////
    // ADD DROP ZONE //
    ///////////////////
    var $dropzone = 
      $( '<div class="CONTAINER-dropzone STYLE-filesDropzone STYLE-light"><p>Replace with another file</p></div>' )
        .appendTo( options.dropZone )
        .css( 'display','none' )
        ;
    ///////////////////////
    // CREATE FILEUPLOAD //
    ///////////////////////
    $uploadButton
      .fileupload( options )//END FILEUPLOAD
      .bind( 'fileuploaddone', function ( event, ui ) { 
          $dropzone.css( 'display', 'none' );
          $uploadButton.css( 'display', 'inline-block');
      });
      
     if ( ! showAllOnEnterWindow ) { 
      ////////////////////////
      // SHOW/HIDE DROPZONE //
      ////////////////////////
       $uploadButton.bind( 'fileuploaddragover', function ( event ) {
        var $this = $( this )
          , data = event.data
          , last = frame.data( 'HELPER-dragover' )
          ;
        if ( ! last ) last = frame.data('HELPER-dragover', { dom: null } );
        ///////////////////////////////////////////
        // ONLY IF IT IS DIFFERENT THAN THE LAST //
        ///////////////////////////////////////////
        if ( last.dom != null ) {
          last.form.css( 'display', 'none' );
          last.upload.css( 'display', 'inline-block' );
        }//END IF
        ///////////////////////////
        // IF YOU DRAGLEAVE LEFT //
        ///////////////////////////
        if ( event.offsetX < 20 ) {
          $dropzone.css( 'display', 'none' );
          $uploadButton.css( 'display', 'inline-block');
        }//END IF
        else { 
          $dropzone.css( 'display', 'block' );
          $uploadButton.css( 'display', 'none' );
          //////////////////////////////
          // SAVE THIS IN LAST HELPER //
          //////////////////////////////
          last.form = $dropzone; 
          last.dom = this; 
          last.upload = $uploadButton;
        }//END ELSE
      });//END BIND
      
      }
      ///////////////////////////////////////////
      // HIDE DROPZONE IF WINDOW IS LEFT AGAIN //
      ///////////////////////////////////////////
      $( document )
        .bind( 'drop', function () {
            $uploadButton.css( 'display', 'inline-block' );
            $dropzone.css( 'display', 'none' );
            $dropzone.parent().next().bgImageStatus( 'showAfterDrag' );
        } )
        .bind( 'dragleave dragexit', function ( event ) { 
      
          var $this = $( this );
          
          if ( $( event.toElement ).parents( frame ).length == 0//Leaf the table 
              || event.clientX > ( window.innerWidth - 35 )//Leaf document right
              || event.clientX == 0 //Leaf document left/bottom
          ) {
            $uploadButton.css( 'display', 'inline-block' );
            $dropzone.css( 'display', 'none' );
            $dropzone.parent().next().bgImageStatus( 'showAfterDrag' );
          }//END IF
        })//END BIND
        ;
        
        if ( showAllOnEnterWindow ) {
          
          $( document ).bind( 'dragenter', function ( event ) { 
             $dropzone.css( 'display', 'block' );
             $uploadButton.css( 'display', 'none' );
             $dropzone.parent().next().bgImageStatus( 'hideOnDrag' );
          })//END BIND
          ;
        }
        return { dropZone: $dropzone,  button: $uploadButton };
}//END HELPER UPLOAD

function helperIsOdd ( number ) { return number % 2; }

/*
////////////////////////
// COMPLEMENTARYCOLOR //
////////////////////////
function helperComplementaryColor( hex ) {  
  
  function min3(a,b,c) { return (a<b)?((a<c)?a:c):((b<c)?b:c); }
  
  function max3(a,b,c) { return (a>b)?((a>c)?a:c):((b>c)?b:c); }// complement
  
  function HueShift(h,s) {
  	h+=s;
  	while (h>=360.0) h-=360.0;
  	while (h<0.0) h+=360.0;
  	return h;
  }

  function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16);}
  function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16);}
  function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16);}
  function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h;}
  
  function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B);}
   function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
         + "0123456789ABCDEF".charAt(n%16);
   }
  
  temprgb={ r: hexToR( hex ), g: hexToG( hex ), b: hexToB( hex ) };
  temphsv=RGB2HSV(temprgb);

  temphsv.hue=HueShift(temphsv.hue,180.0);
  
  temprgb=HSV2RGB(temphsv);

  function RGB2HSV(rgb) {
      hsv = new Object();
      max=max3(rgb.r,rgb.g,rgb.b);
      dif=max-min3(rgb.r,rgb.g,rgb.b);
      hsv.saturation=(max==0.0)?0:(100*dif/max);
      if (hsv.saturation==0) hsv.hue=0;
      else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
      else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
      else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
      if (hsv.hue<0.0) hsv.hue+=360.0;
      hsv.value=Math.round(max*100/255);
      hsv.hue=Math.round(hsv.hue);
      hsv.saturation=Math.round(hsv.saturation);
      return hsv;
  }

  // RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
  // which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
  function HSV2RGB(hsv) {
      var rgb=new Object();
      if (hsv.saturation==0) {
          rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
      } else {
          hsv.hue/=60;
          hsv.saturation/=100;
          hsv.value/=100;
          i=Math.floor(hsv.hue);
          f=hsv.hue-i;
          p=hsv.value*(1-hsv.saturation);
          q=hsv.value*(1-hsv.saturation*f);
          t=hsv.value*(1-hsv.saturation*(1-f));
          switch(i) {
          case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
          case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
          case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
          case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
          case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
          default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
          }
          rgb.r=Math.round(rgb.r*255);
          rgb.g=Math.round(rgb.g*255);
          rgb.b=Math.round(rgb.b*255);
      }
      return rgb;
  }
  return '#' + rgbToHex(temprgb.r ,temprgb.g ,temprgb.b);
}
*/
