//////////////
// CONTROLS //
////////////////////////////////////////////////////////////////////////////
// Add, remove, store and restore jquery widgets from setup file/function //
////////////////////////////////////////////////////////////////////////////
// AMPLE SETUP FILE //
//////////////////////
//
//  function setup( opt ) {   
//    return {
//      type: {
//        widget: { options }
//      }
//      , type2: {
//        widget2: { options: setup( '_helperFunction' ) }
//      } 
//      ,_helperFunction: function ( argument ) {
//        alert( argument )
//      }
//    }[ opt ]
//    ;
//  } 
//  ;
//
/////////
// ADD //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Add jquery ui widget to an dom-element:                                                                                                           //
// $( element with the controls widget )                                                                                                             //
// .controls( 'add', 'selector to add widget/type/widget', 'selector to add widget/type2/widget2' , 'another selector to add widget/type/widget' )   // 
// If no widget is defined all widgets in type obj will be added!                                                                                    //
// You can also define an add argument as array:                                                                                                     //
// $( element with the controls widget ).controls( 'add', [ $( element to add widget ), 'type/widget', { overwrite } ] )                             //
// Overwrite enables you to overwrite or add new option to a hardcoded option from setup function on controls call                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// REMOVE //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Add jquery ui widget from an dom-element:                                                                                                                    //
// $( element with the controls widget )                                                                                                                        //
// .controls( 'remove', 'selector to remove widget/type/widget', 'selector to remove widget/type2/widget2' , 'another selctor to remove widget/type/widget' )   //
// If no widget is defined all widgets in type obj will be removed!                                                                                             //
// You can also define an remove argument as array: $( element with the controls widget ).controls( 'remove', [ $( element to add widget ), 'type/widget' ] )   //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// STORE //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Save selected existing widget/s configuration and the dom elements they are part of as data obj in another DOM-element selector and remove the widget/s                // 
// $( element with the controls widget )                                                                                                                                  //  
// .controls( 'store', selector where in the dom the options/element will be saved, 'selctor that should loose a widget/widget witch should be removed and saved', ... ); //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
// RESTORE //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Restore widgets from the stored list and add them to their original owners again                                      //
// $( element with the controls widget ).controls( 'restore', select element with the stored widget you wanna restore ); //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

( function ( $ ) {
  $.widget( "gadget.controls", {
    ////////
    options: {}
    ////////
    
    //////////
    , _create: function () {}
    //////////
    
    ////////
    , _init: function () {}
    ////////
    
    /////////////
    , _setOption: function ( key, value ) { this.options[ key ] = value; }
    /////////////
    
    ////////
    , _func: function () { return window[ 'create' +  this._mode() ] }
    ////////
    
    ////////
    , _mode: function () { return helperExamineUrl().mode }
    ////////
    
    ////////
    , _loop: function ( task, callback ) {
    ////////    
        var func = this._func()
          ;
        
        ! function ( task ) { 
            if ( ! task.length ) return;
            
            var gadget = task.shift()              
              , overwrite = $.isArray( gadget ) ? gadget[ 2 ] : {}
              ; gadget = $.isArray( gadget ) ? [ gadget[ 0 ] ].concat( gadget[ 1 ].split( '/' ) ) : gadget.split( '/' );
            
            /////////////////////////
            // VARS FOR ADD/REMOVE //
            /////////////////////////
            if ( func( gadget[ 1 ] ) ) {
              var selector = gadget[ 0 ]
                , widget = gadget[ 2 ] 
                , options = ! widget ? func( gadget[ 1 ] ) : [ func( gadget[ 1 ] )[ widget ] ]
                ;
            ////////////////////
            // VARS FOR STORE //
            ////////////////////
            } else {
              var selector = gadget[ 0 ]
                , widget = gadget[ 1 ]
                , options = [ {} ]
                ;
            }//END ELSE 
            
            for ( var w in options ) { 
              options[ w ] = $.extend( true, {}, options[ w ], overwrite  );
              callback( selector, widget, options, w ); 
            }//END LOOP
            return arguments.callee( task );
        
        } ( $.makeArray( task ) )
        ;
    }//END LOOP
    
    //////
    , add: function () {
    //////    
        this._loop( 
          arguments
        , function ( selector, widget, options, w ) { 
            $( selector )[ w == 0 ? widget : w ]( 'destroy' )
                         [ w == 0 ? widget : w ]( options[ w ] )
                         ;  
          }//END CALLBACK  
        );//END THIS._LOOP        
      }//END ADD   
    
    /////////
    , remove: function () {
    /////////   
       this._loop( 
          arguments
        , function ( selector, widget, options, w ) { 
            $( selector )[ w == 0 ? widget : w ]( 'destroy' );  
          }//END CALLBACK  
        );//END THIS._LOOP        
    }
    
    ////////
    , store: function () {
    ////////    
        var temp = $.makeArray( arguments )
          , storage = 
              temp
                .shift()
                  .data( 'helperSavedControls', { selector : [], widget: [], options: [] } )
                  .data( 'helperSavedControls' )
                  ;
        
        this._loop( 
          temp
        , function ( selector, widget, options, w ) {
            $( selector ).each( function () {
              var $this = $( this )
                ;
              if ( $this.data( widget ) != undefined ) { 
                storage.selector.push( $this ); 
                storage.widget.push( widget );
                storage.options.push( $this.data( widget ).options );
              }//END IF 
              ;
              $this[ widget ]( 'destroy' );
            })//END EACH
            ;        
          }//END CALLBACK  
        );//END THIS._LOOP       
    }//END STORECONTROLS   
    
    //////////
    , restore: function ( storage ) {
    //////////    
        var stored = $( storage ).data( 'helperSavedControls' )
          ;
        for ( var i = 0; i < stored.widget.length; i++  ) stored.selector[ i ][ stored.widget[ i ] ]( stored.options[ i ] );
    }//END RESTORE
  
  //////////
  , destroy: function () { $.Widget.prototype.destroy.apply( this ); }//END DESTROY
  //////////
  })//END WIDGET 
  ; 
})( jQuery )
;