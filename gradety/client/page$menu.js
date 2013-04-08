( function ( $ ) {
  $.widget( "gadget.page$menu", {
    ////////
    options: {}//END OPTIONS
    ////////
    
    //////////
    , _create: function () {}
    //////////   
    
    ////////
    , _init: function () {
    ////////    
        var self = this
          , $button = this.element.find( '> li > a' )
          ;
          
        this.pageId = $( '.PAGE' ).page( 'getPageId' );
        
        ////////////////////
        // SORTABLE START //
        ////////////////////
        function sortableStart ( event, ui ) {
          
          self._adjustPlaceholder( ui.placeholder, ui.item.find( '> a' ) )
          ui.item.data( 'droppRemove', false );
          ui.item.data( 'next', ui.placeholder.next() );
          
          ui.helper
            .find( '> *:not( a )' )
              .remove()
              .end()
            .find( '> a' )
              .attr( 'class', 'HELPER-page-sortable-menu-item' )
              ;
              
          helperUpdateSortableCursorAt ( ui.item, { left: 0, top: 0 } );//Update cursor at 
          helperUpdateSortableItemPosition( ui.helper, ui.helper.width(), ui.helper.height() );//Update containment  
     
        }//END SORTABLESTART
        
        ///////////////////
        // SORTABLE STOP //
        ///////////////////
        function sortableSort ( event, ui ) { 
          if ( ! ui.item.find( 'a' ).data( 'dropKey' ) ) {
            $( '.HELPER-page-sortable-menu-placeholder' ).fadeIn( 0 );
            self._adjustPlaceholder( ui.placeholder, ui.item.find( '> a' ) ); 
          }//END IF
        }//END FUNCTION
        
        ///////////////////
        // SORTABLE STOP //
        ///////////////////
        function sortableStop ( event, ui ) { 
          var $page = $( '.PAGE' )
            , $menus =  ui.item.parentsUntil( '.CONTAINER, .STICKER', 'menu' )
            , $moved = ui.item.find( '> a' );
            ;
           
          /////////////
          // ON DROP //
          ////////////////////////////////////////////////////////////////////////////////////////////////
          // IF DROP WAS INSIDE ANOTHER PAGE BUT THE LEVELS ARE FILTERED AND IT ISN'T THE CURRENT PAGE  //
          ////////////////////////////////////////////////////////////////////////////////////////////////  
          if ( ui.item.data( 'droppRemove' ) == 'remove' ) { 
              $( this ).sortable( 'cancel' ); 

              var movedPage = $page.page( 'createPageInformation',  ui.item.find( '> a' ) )
                  ;
                  movedPage.previd = 'unknown';
                  movedPage.parentid = ui.item.data( 'dropped' ).data( 'id' );
              
              /////////////////////////////////////////////////////////////////////////
              // ADD PAGES TO PAGEOBJ THAT ARE AFFECTED BY DROP INSIDE WITH A REMOVE //
              /////////////////////////////////////////////////////////////////////////
              $page.page( 'addToPageObj', movedPage );
              $page.page( 'addToPageObj', $page.page( 'createPageInformation', ui.item.data( 'next' ).not( '.ui-sortable-helper' ).find( '> a' ) ) );  
             
              ui.item.remove();
      
          }//END IF 
          else {
            ////////////////////////////////////////////////////////////////////////
            // DROP INSIDE IF FILTER DOESN'T EXIST OR THE PAGE IS THE CURENT PAGE //
            ////////////////////////////////////////////////////////////////////////
            if ( ui.item.data( 'droppRemove' ) != true ) ui.item.appendTo( ui.item.data( 'dropped' ) );
          
            ////////////////////////////////////////////////////
            // ADD PAGES TO PAGEOBJ THAT ARE AFFECTED BY MOVE //
            ////////////////////////////////////////////////////
            $page.page( 
              'addToPageObj'
            , $page.page( 
                'createPageInformation'
              , $moved
                  .attr( 
                    'href'
                  , $page.page('createPath', $moved ) //Update path
                  )//END ATTR   
              )//END PAGE 
            )//END PAGE;
            $page.page( 'addToPageObj', $page.page( 'createPageInformation', ui.item.data( 'next' ).not( '.ui-sortable-helper' ).find( '> a' ) ) );
            $page.page( 'addToPageObj', $page.page( 'createPageInformation', ui.item.next().find( '> a' ) ) );
          }//END ELSE
          ;
          
          ////////////////////////////////////////////
          // IF CURRENT PAGE IS DRAGGED OUT OF VIEW //
          ////////////////////////////////////////////
          if ( this.pageId == $moved.data( 'id' ) ) {
            $page
              .page( 'save', function ( respond ) { 
                window.location = '/pages/' + URL.address[ 0 ] + '/' +  respond[ 0 ].id;  
              });
          }//END IF

          //////////////////////////
          // UPDATE CSS & CLEANUP //
          //////////////////////////
          ui.item.removeData( 'dropped, droppRemove' )
          $menus
            .find( 'a' )
              .each( function () { self.adjustCssClass( $( this ) ); })
              .end()
              ///////////////////////
              // REMOVE EMTY MENUS //
              ///////////////////////
              .find( 'menu:empty' )
                .remove()
                ;
              
          $( '.PAGE menu > li > a' ).removeData( 'dropKey', 'next' );//Cleanup 
        }//END STOP

        ///////////////////////////////
        // BIND SORTABLE & DROPPABLE //
        ///////////////////////////////
       
        
          this
            .element 
              .sortable({
                  placeholder: 'HELPER-page-sortable-menu-placeholder' 
                , items: 'li:not(.ui-sortable-disabled)'
                , cancel: '.ui-sortable-cancel'
                , dropOnEmpty: false
                , helper: 'clone'
                , connectWith: '.FUNCTION-vertical,.FUNCTION-horizontal'
                , cursorAt: { left: 0, top: 0 }
                , receive:  sortableSort
                , remove:  sortableSort
                , out:  sortableSort 
                , change: sortableSort
                , over: sortableSort
                , start: sortableStart
                , sort: sortableSort
                , stop: sortableStop
              })//END SORTABLE*/
              
              
          
        this.bindDrop( $button );//Bind drop events
        this.bindRename( $button );//Bind rename
        
        ///////////////////////////////////////////
        // BIND KEYEVENTS TO ENABLE/DISABLE DROP //
        ///////////////////////////////////////////    
        $( document )
          .bind( 'keydown.page$menu', 'meta', function( event ) {
            event.preventDefault();
            $( '.PAGE menu > li > a'  ).data( 'dropKey', true )
          })
          .bind( 'keyup.page$menu', 'meta', function( event ) {
            event.preventDefault();
            $( '.PAGE menu > li > a'  ).removeData( 'dropKey' )
          })
          ;

    }//END INIT
    
    ////////////
    , _getDeepth: function ( $selector ) { return  $selector.parentsUntil( '.CONTAINER, .STICKER', 'menu' ).length - 1  }
    ////////////
    
    /////////////////////
    , _adjustPlaceholder: function ( $placeholder, $item ) {
    /////////////////////  
       var $closestMenu = $placeholder.closest( 'menu' )
          , margins = $item.css( 'line-height' ) / 2 
          , height = $item.css( 'font-size' )
            ;
       if ( $closestMenu.is( '.FUNCTION-horizontal' ) && ! $item.data( 'dropKey' ) ) $placeholder.css({ display: 'inline-block', marginTop: margins, marginBottom: margins, width: 4, height: height });
       else if ( ! $item.data( 'dropKey' ) ) $placeholder.css({ display: '', marginTop: '', marginBottom: '', width: '', height: '' });       

    }//END ADJUSTPLACEHOLDER

    ///////////
    , _destroy: function () { 
    ///////////
        $( document ).unbind( 'page$menu' ); 
        $.Widget.prototype.destroy.apply( this ); 
    }//END DESTROY
    
    /////////////
    , _setOption: function ( key, value ) {
    /////////////
        this.options[ key ] = value;
    }//END OPTIONS 
    
    /////////////////////
    , getMenuInformation: function ( $selector ) {
    /////////////////////  
       $selector = $selector.parentsUntil( '.CONTAINER, .STICKER', 'menu' ).last().data( 'menu' ).split( '-' );
       return { 
         styleableId: $selector[ 0 ]
         , parentId: $selector[ 1 ]
         , level: $selector[ 2 ]
         , deep: $selector[ 3 ]
         , filtered: $selector[ 4 ] == 1 ? true : false
         , directions: $selector[ 5 ].split( '$' )  
       }//END OBJ
    }//END GETMENUINFORMATION
    
    /////////////////
    , adjustCssClass: function ( $selector ) {
    /////////////////
        var $parent = $selector.parent()
          , menuObj =  this.getMenuInformation( $selector )
          , parts = ( $selector.attr( 'class' ) || menuObj.styleableId + '-depth-pos-stadi' ).split( '-' ) 
          , deepth =  this._getDeepth( $selector )
          ;
        
        ///////////////////////////
        // UPDATE LI'S DIRECTION //
        ///////////////////////////
        $parent.removeAttr( 'style' ).attr( 'class', 'ITEM-' + menuObj.directions[ deepth ] );
          
        /////////////////////
        // ADJUST POSITION //
        /////////////////////
        if ( $parent.prev().length == 0 && $parent.next().length == 0 && ! $parent.siblings().length  ) parts[ 2 ] = 'one';
        else if ( $parent.prev().length == 0  ) parts[ 2 ] = 'first';
        else if ( $parent.next().length == 0  ) parts[ 2 ] = 'last';
        else parts[ 2 ] = 'item';
        
        ///////////////////
        // ADJUST DEEPTH //
        ///////////////////
        parts[ 1 ] = deepth;
        
        //////////////////
        // UPDATE STADI //
        //////////////////

        if ( $selector.next( 'menu' ).find( 'li' ).length ) parts[ 3 ] = 'sub';
        else if ( this.pageId == $selector.data( 'id' )  ) parts[ 3 ] = 'selected'
        else parts[ 3 ] = 'default'; 

        //////////////////////
        // UPDATE CSS CLASS //
        //////////////////////
        $selector.attr( 'class', parts.join( '-' ) );
    }//END ADJUSTCSSCLASS   
    
    ///////////
    , bindRename: function ( $selector ) {
    ///////////
        self = this
        $selector.dev_gadgetRename({ 
          onStart: function ( event, ui) { 
            ui.element
              .enableSelection()
                .parent()
                  .addClass( 'ui-sortable-cancel' )
                  ;   
          }//END ON START
        , highlightClass: 'FUNCTION-page-rename'
        , onStop: function ( event, ui ) { ui.element.disableSelection().parent().removeClass( 'ui-sortable-cancel' ); } 
        , save: function ( event, ui ) {  
            ////////////////////////////////////////////////////////////////
            // If urlmname is different only the the name and the pageObj //
            // of the renamed page will be changed after rename           //
            // else recursive all subpages in the menu became new         //
            // urls und pageobj updates                                   //
            ////////////////////////////////////////////////////////////////
            var $page = $( '.PAGE' )
              , newPath = $page.page( 'createPath', ui.element, ui.oldName )  
              , $update = newPath ? ui.element.parent().find( 'a' ) : ui.element
              ;
            
            $update
              .each( function () {
                var $this = $( this )
                  , pageInfo = $page.page( 'createPageInformation',  $this )
                  ;
                if ( newPath ) $this.attr( 'href', $page.page( 'createPath', $this ) );//Update path in html
                $page.page( 'addToPageObj', pageInfo );//Add changed pages to PageObj to save changes
                })
                ;
          }//END SAVE
        });//END GADGETRENAME
    }//END RENAME
    
    ///////////
    , bindDrop: function ( $selector ) {
    ///////////
        var self = this;
        //////////////////////
        // CLEANUP FOR DRAG //
        //////////////////////
        function cleanUpForDrag ( $selector ) {
          $selector
            .css({ 'z-index': '' })
              .next()
                .css({ 'z-index':'' })
                  .end()
                .closest( 'li' )
                  .css({ 'z-index': '' })
                .next()
                  .css({ 'z-index': '' })
                  ;
        }//CLEANUPFORDRAG
          
        ///////////////
        // DROP OVER //
        ///////////////
        function dropOver ( event, ui ) {
          var $this = $( this )
            //, hedge =  ( ui.draggable.find( 'menu' ).length + self._getDeepth( $this ) + 1 ) < self.getMenuInformation( $this ).deep
            , hedge = ( self._getDeepth( $this ) + 1 + ui.draggable.find( 'a:first' ).data( 'childlength' )  ) < self.getMenuInformation( $this ).deep
            ;
          
          if ( !! $this.data( 'dropKey' ) && hedge ) { 
            $( '.HELPER-page-sortable-menu-placeholder' ).fadeOut( 0 ); 
            $this
              .css({ 'outline': '5 solid #525152',  'z-index': 1 })
              .next()
                .css({ 'z-index': 0 })
                .end()
              .closest( 'li' )
                .css({ 'z-index': 1 })
                .next()
                  .css({ 'z-index': 0 })
                  ;
          }//END IF 
        }//END DROPOVER
          
        //////////////
        // DROP OUT //
        //////////////        
        function dropOut ( event, ui ) { 
          var $this = $( this );
          $this.css( 'outline', 'none' ); 
          cleanUpForDrag( $this );    
        }//END DROPOUT
        
        ///////////////
        // DROP DROP //
        /////////////// 
        function dropDrop ( event, ui ) { 
          var $this = $( this ).css( 'outline', 'none' )
            , menuObj =  self.getMenuInformation( $this )
            , deepth = self._getDeepth( $this )
            , hedge =  ( ui.draggable.find( 'menu' ).length + self._getDeepth( $this ) + 1 ) < self.getMenuInformation( $this ).deep
            ;
          
         if ( !! $this.data( 'dropKey' ) && hedge ) {
            if ( self.pageId == $this.data( 'id' ) || menuObj.filtered == false ) {
              ui.draggable.data( 'droppRemove', 'dontRemove' ); 
              ui.draggable
                .data( 
                  'dropped'
                , $this.next().length 
                  ? $this.next( 'menu' ) 
                  : $( '<menu/>' )
                    .page$menu()
                    .addClass( 'FUNCTION-' + menuObj.directions[ deepth + 1 ] )
                    .insertAfter( $this ) 
                )//END DATA
                ;
            }//END IF 
            else if ( hedge ) {  
              ui.draggable.data( 'droppRemove', 'remove' ); 
              ui.draggable.data( 'dropped', $this ); 
            
            }
          }//END IF
          cleanUpForDrag( $( '.PAGE menu > li > a'  ).removeData( 'dropKey' ) );
        }//END DROPDROP
        
        ////////////////////
        // BIND DROPPABLE //
        ////////////////////
        $selector.droppable({  
              disabled: false
            , addClasses: false
            , over: dropOver
            , out: dropOut         
            , drop: dropDrop
            })//END DROPPABLE
            .disableSelection()
            ;//Add menubar    
    
    }//END BINDDROP
    
    /////
    , ui: function () { return {  element: this.element }; }
    /////
    
     });//END WIDGET
})( jQuery );