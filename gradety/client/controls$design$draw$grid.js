function controls$design$draw$grid ( opt ) {   
  return {
    ///////////
    sortable: {
    ///////////  
        placeholder: 'UI-GRID-sortable-placeholder' 
      , containment: '.STAGE'
      , items: '.CONTAINER:not(.ui-sortable-disabled)'
      , cancel: '.ui-sortable-cancel'
      , connectWith: '.GRID'
      , forcePlaceholderSize: false
      , helper: 'clone'
      , scroll: false
      , zIndex: 100005
      , opacity: 0.8
      , tolerance: 'pointer'
      , cursorAt: { left: 43, top: 33 }
      , refreshPositions: true
      , start: function ( event, ui ) {
          
          var $this = $( this )
            , data = ui.item.data( 'styleable_item' )
            , tch = $this.styleable( 'allContainerHeight' )
            , w = $this.width()
            , h = $this.height()
            ;
          
          $( '.UI' )
            .controls( 
              'remove'
            , [ ui.item, data.type ]
            , [ ui.item, data.task ] 
            )
            ;
          
          //////////////////////////////////////////////////////////////////////
          // IF THE NODE IS overflow:auto; WE HAVE A PROBLEM WIDTH            //
          // THE HELPER BECAUSE YOU CAN DRAG & DROP THE HELPER BUT            //
          // YOU CAN'T SEE IT. THE NODE STARTS TO SCROLL.                     //
          // TO PREVENT THAT WE CHANGE THE OVERFLOW OF THE NODE TO VISIBLE,   //
          // BUT THAN IF THE TOTAL CONTAINER HEIGHT IS HEIGHER THAN THE NODE  //
          // THE HIDDEN PARTS OF CONTAINERS WILL BE SHOWN.                    //
          // SO WE WRAP THE REST OF THE CONTAINERS IN THE NODE                //
          // WITH A DIV THAT MANAGES THE OVERFLOW                             //
          //////////////////////////////////////////////////////////////////////
          $this.css( 'overflow', 'visible' );
          if ( tch > h ) $this.wrapInner( '<div class="HELPER-sortable" style="overflow:hidden; display: block; height:' + h + 'px; width:' + w +' px;"></div>');          
          //////////////////////    
          // MARK AS DRAGGED  //
          //////////////////////
          ui.helper
            .addClass( 'HELPER-onDrag' )
            .css({ 
               'width': 86
             , 'height': 66
             , 'overflow': 'visible'
             , 'border': 0
             , 'padding': 0
             , 'margin': 0 
            }) 
            .html( '' )
            ;
            
          helperUpdateSortableCursorAt ( ui.item, { left: 43, top: 33 } );//Update cursor at 
          helperUpdateSortableItemPosition( ui.item, 86 + 9 , 66 + 9 );//Update containment  
          
          ///////////////////////////////////////////////    
          // THIS WILL INIT THE CLIPBOARD TRASH & COPY //
          ///////////////////////////////////////////////  
          $( '.UI' ).dev_gadgetClipboard( 
              'bindDroppable'
              , [ 'Trash', 'Copy' ]
              , [ function () { 
                    $( '<h1 class="HELPER-onDropLabel">Delete</h1>' ).css( 'display', 'none' ).prependTo( ui.helper ).fadeIn();
                    ui.helper
                      .css({ 'overflow': 'visibly' })
                      .stop()
                      .animate(
                        { width: 75, height: 40 }
                      , { step: function () {
                            helperUpdateSortableItemPosition( ui.item, ui.helper.width() , ui.helper.height()  );
                          }//END STEP
                        }//END DURATION 
                    );//END ANIMATE
                  }//END TRASH OVER
                , function () { 
                   $( '<div class="HELPER-onCopyDrag"><h1 class="HELPER-onDropLabelCopy">Copy</h1></div>' )
                    .prependTo( ui.helper )
                      .parent()
                      .css({ 'overflow': 'visibly' })
                      .end()
                    .css({ 'background-color': '#464646' })
                    .stop()
                    .animate({
                      width: 86
                    , height: 66
                    , 'margin-left': '-16px'
                    , 'margin-top': '-16px'
                    , 'opacity': 1
                    });
                  }//END COPY OVER 
                ]//END OVER 
              , [ function () { 
                  ui.helper.find( 'h1' ).fadeOut( 'fast', function () { $( this ).remove(); });
                  ui.helper
                    .stop()
                    .animate(
                      { width: 86, height: 66 }
                    , { step: function () {
                          helperUpdateSortableItemPosition( ui.item, ui.helper.width() , ui.helper.height()  );
                        }//END STEP
                      }//END DURATION
                    );//END ANIMATE
                  }//END TRASH OUT
                  , function () {  
                      ui.helper
                        .find( '.HELPER-onCopyDrag' )
                        .stop()
                        .animate({
                          'margin-left': '-16px'
                        , 'margin-top': '-16px'
                        , 'opacity': 0 }
                        , function() { $( this ).remove(); }
                        );//END ANIMATE
                  }//END COPY OUT 
                ]//END OUT
              , [ 
                  function () { ui.item.addClass( 'HELPER-trash' ); }//END TRASH DROP
                , function () { ui.item.addClass( 'HELPER-copy' ); }//END COPY DROP  
                
                ]//END DROP
              , '.CONTAINER'//ACCEPT 
        );//END DEV_GADGETCLIPBOARD
        
        $( '.UI' ).dev_gadgetClipboard( 'show', [ 'Copy', 'Trash' ] );//Show clipboard
        
      }//END START
      , over: function ( event, ui ) { helperSortablePlaceholderMargin( $( this ), ui ); }
      , stop: function ( event, ui ) {
               
         var $this = $( this )
            , helperSortable = $this.find( '.HELPER-sortable' )//FIND sortableHelper div if it exist?
            , data = ui.item.data( 'styleable_item' )
            ;
            
          if ( helperSortable.length ) { 
            $this.find( '.CONTAINER, .HELPER-sortable > .ui-resizable-handle' ).unwrap();
            helperSortable.remove();
          }//END IF 
            
          ///////////
          // TRASH //
          ///////////
          if ( ui.item.is( '.HELPER-trash' ) ) {
            $this.sortable( 'cancel' );
            $( '.UI' ).controls( 'restore', data.self );
            data.parent.styleable( 'removeStyleable', ui.item );//Remove Styleable 
            $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'browseTo', 'grid_list', true );//Move Browsebar away from deleted container options
            helperCopyPasteAttributes( false );//Remove Copy Attributes button 
            if ( data.task == 'menu' ) ui.item.menu( 'tryMenu' );//This is necessary to remove the styles/script is created for demonstration if tryMenu was active on remove 
            $( '.UI' ).controls( 
                'add'
              , [ $this.not( ':has(>.CONTAINER, > .STICKER ), .PAGE > #' + $this.attr( 'id' ) ), 'grid/dev_gadgetMedithumb' ] 
              , [ $this.not( ':has(>.CONTAINER, > .STICKER )' ), 'grid/dev_gadgetSplit', $this.parent().is( ':not(.PAGE)' ) ? {} : { mouseEvent: false } ]  
              )
              ;            
          }//END IF
          
          //////////
          // COPY //
          //////////
          else if ( ui.item.is( '.HELPER-copy' ) ) {
            
            $this.sortable( 'cancel' );
            ui.item.removeClass( 'HELPER-copy' );
            
            $this.styleable( 
              'copy'
            , data.self
            , controls$design$draw$grid( '_addStyleableControlsCallback' )
            )//Restore original look 
            ;
                       
            $( '.UI' )
                .controls( 'restore', data.self )
                .controls( 
                  'add'
                , [ data.self, data.type ]
                , [ data.self, data.task, data.storage.overwrite[ data.task ] ] 
                )
                ;
          }//END ELSE IF 
          
          //////////
          // MOVE //
          //////////
          else { 
            var newParentGrid = ui.item.closest( '.GRID' )
              
              ;

            /////////////////////////////////////
            // MANAGE UI'S CONTROLS AFTER DROP //
            /////////////////////////////////////
           $( '.UI' )
              .controls( 'restore', ui.item )
               .controls( 
                'add' 
              , [ $this.add( newParentGrid ).not( ':has(>.CONTAINER),> .STICKER' ), 'grid/dev_gadgetMedithumb' ] 
              , [ $this.add( newParentGrid ).not( ':has(>.CONTAINER),> .STICKER' ), 'grid/dev_gadgetSplit' ] 
              , [ $this.add( newParentGrid ), 'grid/dev_gadgetBubble' ] 
              )//END ADD
              .controls( 
                'remove' 
              , [ newParentGrid.has( '>.CONTAINER,> .STICKER' ), 'grid/dev_gadgetMedithumb' ]
              , [ newParentGrid, 'grid/dev_gadgetSplit' ] 
              )//END REMOVE
              ;
            
            /////////////////////////////////////
            // IF SORTED STYLEABLE WAS DELETED //
            /////////////////////////////////////     
            
            ui.item.removeClass( 'HELPER-onDrag' );//Remove schadow and round corners
            data.parent.styleable( 'domUpdate', ui.item, ui.item.closest( '.GRID' ) );//Restore original look 
            $( '.UI' )
                .controls( 
                  'add'
                , [ ui.item, data.type ]
                , [ ui.item, data.task, data.storage.overwrite[ data.task ] ] 
                )
                ;
            
      
            ////////////////////
            // FINAL CLEAN UP //
            ////////////////////
            ui.item.dev_gadgetFocus( 'activate' );//Set moved styleable on focus again
          }//END ELSE
          
          //////////////////////////////////////
          // IF SORTABLE HELPER WAS NECESARRY //  
          // IT WON'T BE NEEDED ANYMORE       //
          //////////////////////////////////////
          
          $this.css( 'overflow', 'auto' );
          $( '.UI' ).dev_gadgetClipboard( 'hide', [ 'Trash', 'Copy' ] );//Hide clipboard after drop
          helperHoldPositionOnScroll( newParentGrid , newParentGrid.find( '> .ui-resizable-w, > .ui-resizable-n ' ), 'top' ); 
      
      }//END STOP
    }//END SORTABLE
    
    ////////////
    , resizable: {
    ////////////  
        minHeight: 5
      , minWidth: 5
      , maxWidth: ''
      , handles: ''
      , helper: 'ui-resizable-helper'
      , start: function ( event, ui ) {
          var myobj = $( '.PAGE' ).ios( 'GetNodeByIdent', ui.element.attr( 'id' ) )
            , data = ui.element.data( 'helperResizeData', {  myleftwidth: 1 , mytopheight: 1 } ).data( 'helperResizeData' )
            ;  
          
          ///////////////////////////////////////////////////////////////////////////    
          // set global remembervalue of left- and top-distance (node or zeronode) //
          /////////////////////////////////////////////////////////////////////////// 
          if ( myobj.HasParent ) {
            
            data.HelpGlobalLeftDistance = myobj.Parent.DownNode.LeftDistance;
            data.HelpGlobalTopDistance = myobj.Parent.DownNode.TopDistance;                            
          
          } else if ( myobj.ZeroNodeType !== 'root' ) {
            
            data.HelpGlobalLeftDistance = myobj.Owner.Owner.Owner.LeftDistance;
            data.HelpGlobalTopDistance = myobj.Owner.Owner.Owner.TopDistance;                                                                                        
          
          }//END IF/ELSE
          
          ///////////////////////////////////////////////////////////////////////////////////////////////////// 
          // Calculate the max.Width and min.Width / max.Height and min.Height for the resizing              //          
          // e.g. the interval mytopheight, mybottomheight, design$draw.grid._conf.myleftwidth, myrightwidth //
          // between which the resizebar can move                                                            //
          ///////////////////////////////////////////////////////////////////////////////////////////////////// 
          // function seeks the nearest splitline distance left and right, top and bottom                    //
          // first get the optical nearest neighbour line-distance                                           //
          // TNodes.doFindClosestLineElement(myobj,direction)  --> direction is left,right,top,bottom in ''  //
          /////////////////////////////////////////////////////////////////////////////////////////////////////
          
          ////////////////////////
          // HORIZONTAL REZISE  //
          ////////////////////////
          if ( myobj.Orientation == 'h' ) {
            
            data.mytopheight = myobj.Owner.doFindClosestLineDistance( myobj, 'top' );//Top resize 
            data.mybottomheight = myobj.Owner.doFindClosestLineDistance( myobj, 'bottom');//Bottom resize 
            
            $('.ui-resizable-helper')
              .css( 'overflow', 'visible' )
              .append( controls$design$draw$grid( '_labelH' ) )//Create h label
              ;
            
            /////////////////
            // SAVE LABELS //
            /////////////////
            data.labelA = $( '.ui-resizable-helper' ).find( '.STICKER-templateingResize-n > .UI-CONTAINER-choose > .UI-BUTTON-choose' );
            data.labelB = $( '.ui-resizable-helper' ).find( '.STICKER-templateingResize-s > .UI-CONTAINER-choose > .UI-BUTTON-choose' );    
            data.stickerA = $( '.ui-resizable-helper' ).find( '.STICKER-templateingResize-n' )
            data.stickerB = $( '.ui-resizable-helper' ).find( '.STICKER-templateingResize-s' )
      
          
          }//END IF
          
          /////////////////////
          // VERTICAL REZISE //
          /////////////////////
          if ( myobj.Orientation == 'v' ) {
            
            data.myleftwidth = myobj.Owner.doFindClosestLineDistance( myobj,'left' );//Left resize                             
            data.myrightwidth = myobj.Owner.doFindClosestLineDistance( myobj, 'right' );//Right resize
            
            $('.ui-resizable-helper')
              .css( 'overflow', 'visible' )
              .append( controls$design$draw$grid( '_labelV' ) ) // CREATE V LABEL
              ;
            
            ///////////////////
            // SAVE LABEL    //
            ///////////////////
            data.labelA = $( '.ui-resizable-helper' ).find( '.STICKER-templateingResize-w > .UI-CONTAINER-choose > .UI-BUTTON-choose' );
            data.labelB = $( '.ui-resizable-helper' ).find( '.STICKER-templateingResize-e > .UI-CONTAINER-choose > .UI-BUTTON-choose' );   
            
          }//END IF    
          
          /////////////////////////////
          // RESET RESIZABLE OPTIONS //
          /////////////////////////////
          ui.element.resizable( 
            "option", { 
              "minHeight": data.mybottomheight
            , "maxHeight": data.mytopheight
            , "minWidth": data.myrightwidth
            , "maxWidth": data.myleftwidth 
            }
          )
          ;  
          
          
          $( '.UI' ).controls( 'store', ui.element, '.GRID/dev_gadgetBubble', '.GRID/dev_gadgetSplit', '.GRID/dev_gadgetMedithumb' );
      
      
      }//END START
      , resize: function ( event, ui ) {
          var myobj = $( '.PAGE' ).ios( 'GetNodeByIdent', ui.element.attr( 'id' ) )
            , data = ui.element.data( 'helperResizeData' )
            , domparentident = $( myobj.HasParent ? '#' + myobj.Parent.Parent.Ident : '#' + myobj.Owner.Ident )// GET PARENT OF THE REZISED GRID //
            , neighbour = ui.element.closest( '.GRID > .GRID' ).prev( '.GRID' )
            ;
            
          ///////////////////////////////////////////////////
          // UPDATE VERTICAL SIZE VALUE IN LABEL ON REZISE //
          ///////////////////////////////////////////////////
          if ( myobj.Orientation == 'v' ) {
            
            var neighbourWidth = neighbour.find( '.GRID' ).length ? neighbour.find( '.GRID:last' ).width() : neighbour.width()
              , width =  ui.originalSize.width >= ui.size.width ? ( ui.originalSize.width - ui.size.width ) + neighbourWidth : neighbourWidth - (  ui.size.width - ui.originalSize.width )
              ;  
            data.labelA.html( width + ' <strong class="STYLE-lowercase">px</strong>' );
            data.labelB.html( ui.size.width + ' <strong class="STYLE-lowercase">px</strong>' );
          
          }//END IF 
          /////////////////////////////////////////////////////
          // UPDATE HORIZONTAL SIZE VALUE IN LABEL ON REZISE //
          /////////////////////////////////////////////////////
          else if ( myobj.Orientation == 'h' ) {
          
            var neighbourHeight = neighbour.find( '.GRID' ).length ? neighbour.find( '.GRID:last' ).height() : neighbour.height()  
              , height = neighbourHeight + ui.originalSize.height - ui.size.height
              ;
            data.labelA.html( ui.size.height + ' <strong class="STYLE-lowercase">px</strong>' );    
            data.labelB.html( height + ' <strong class="STYLE-lowercase">px</strong>' );
            data.stickerA.css( 'margin-left', - data.stickerA.width() / 2 );
            data.stickerB.css( 'margin-left', - data.stickerB.width() / 2 );
          }//ELSE IF   
      }//END RESIZE
      , stop: function ( event, ui ) {
          var myobj = $( '.PAGE' ).ios( 'GetNodeByIdent', ui.element.attr( 'id' ) )
            , data = ui.element.data( 'helperResizeData')
            , myupnode = myobj.Parent.UpNode
            , $upNode =  $( '#' + myupnode.Ident )
            , $downNode = $( '#' + myobj.Ident )
            ;
          
          $downNode.css({ 'left': "", 'top': "" });//Remove the setting of style left and top by ui-resizeable in _mousestop 
          
          /////////////////////////////////////////        
          // GET THE RESULT OF THE RESIZE-MOVING //
          /////////////////////////////////////////
          var dh = ui.size.height - ui.originalSize.height
            , dw = ui.size.width - ui.originalSize.width
            ;

          if ( myobj.ZeroNodeType == 'none' ) {                           
            ///////////////////////////////////////////////////////////////////////////////////////////
            // switch from downnode (e,s resizing) to upnode (w,n resizing) to call resize-procedure //
            // node: change the sign of dh and dw for the oposite direction                          //
            ///////////////////////////////////////////////////////////////////////////////////////////        
            if ( Math.abs( dh ) >= 1 ) {
              if ( zeroRules.ResizeHeightFixRule ) myupnode.Owner.doDOM_FitHeightFix( myupnode, -dh );
              else myupnode.Owner.doDOM_FitHeightEnh( myupnode, -dh );
            }//END IF
                    
            if ( Math.abs( dw ) >= 1 ) {
              if ( zeroRules.ResizeWidthFixRule ) myupnode.Owner.doDOM_FitWidthFix( myupnode, -dw );
              else myupnode.Owner.doDOM_FitWidthEnh( myupnode, -dw );
            }

            $( '.ui-resizable-helper' )
              .find( 'div' )
                .remove()
                ;
          }//END IF                       
          
          $upNode.styleable( 'updateFit', $upNode.find( '.CONTAINER:first' ) );//Manage container fit 
          $downNode.styleable( 'updateFit', $downNode.find( '.CONTAINER:first' ) );//Manage container fit  
          
          ui.element.removeData( 'helperResizeData' );
          
          $( '.UI' ).controls( 'restore', ui.element );
     
          $( '.CONTAINER, .STICKER' ).dev_gadgetRules( 'reset' );//Rest subgrid overlay if nessesary
      }//END STOP
    }//END REZISEABLE
    
    //////////////////////
    , dev_gadgetMedithumb: {
    //////////////////////
        'button.Delete':{
          addClass: 'STYLE-itemMedithumbIcon ICON-trash-mini'
        , action: function ( events, ui ) {
            var id = ui.element.attr( 'id' )
              , myobj = createdesign$draw( '_getMyObj' )( id )
              ;
            ui.button.bind( 'click', function () {
              if ( myobj.ZeroNodeType == 'container' || myobj.ZeroNodeType == 'sticker' ) myobj.Owner.doRemoveZeroNode( 'delete' );
              else if ( myobj.ZeroNodeType == 'none' ) myobj.Owner.doRemoveBranch( myobj, 'relink' );//owner is TNodes, parent is TSplit 
              $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'update', 'grid_list' );//Update browsebar  
            })//END BIND
            ;
          }//END ACTION 
        }//END BUTTON.DELETE
    }//END GADGETMEDITHUMB
    
    //////////////////
    , dev_gadgetSplit: {
    //////////////////
          mouseEvent: true 
        , action: function ( event, ui ) { 
          var id = ui.element.attr( 'id' )
            , myobj = createdesign$draw( '_getMyObj' )( id )
            , $browse = $( '.GRID-panelBrowse' )
            ;         
          ui.vsplit.click( function () { 
            myobj.Owner.doAdd( myobj, 'v', 'V build from ' + myobj.Ident );
            $browse.dev_gadgetBrowse( 'browseTo', 'grid_list' );
          });//END CLICK       
          
          ui.hsplit.click( function () { 
            myobj.Owner.doAdd( myobj, 'h', 'H build from ' + myobj.Ident );
            $browse.dev_gadgetBrowse( 'browseTo', 'grid_list' );
          });//END CLICK
        }//END ACTION
    }//END GADGETSPLIT
    
    ////////////
    , styleable:  { sortableCancelClass: 'ui-sortable-cancel' }
    ////////////
    
    ///////////////////
    , dev_gadgetBubble: {
    ///////////////////  
        onShow: function ( event, ui ) {   
          var allContainerHeight = ui.element.styleable( 'allContainerHeight' );
          ui.element
            .dev_gadgetBubble( 'option', {  
              setPosition: {
                of: ui.element
              , my: 'left bottom'
              , at:'right top'
              , offset: '-28px ' + ( allContainerHeight + 18 ) + 'px'
              , collision:'none none'
              }//END SETPOSITION
            });//END BUBBLE  
        }//END ONSHOW
        , 'button.addIcon': { 
            addClass: 'STYLE-itemMedithumbIcon ICON-add-mini'
          , action: function ( events, ui ) { 
              ui.button
                .bind( 'click', function () {
                  controls$design$draw$grid( '_addContainerAction' )( ui.element );
                })//END BIND
                ;
            }//END ACTION
        }//END BUTTON      
        , 'button.Add Container': function ( events, ui ) {
            ui.button.bind( 'click', function () {  
              controls$design$draw$grid( '_addContainerAction' )( ui.element );  
            })//END BIND
            ;
        }//END BUTTON           
    }//END GADGETBUBBLE
    
    /////////////
    , _myhandles: function ( myobj ) { 
    /////////////   
      var myhandles = 'all'
         , myflag = false
         ;
      
      switch ( myobj.Spin ) {
        case -1:
          myhandles = ( myobj.Orientation == 'h' ) ? 'n' : 'w';
          myflag = true;
          break
          ;
        case 1: 
          myhandles = ( myobj.Orientation == 'h' ) ? '' : ''; 
          break
          ;
        case 0: 
          myhandles = 's'; 
          break
          ;
      }//END SWITCH
      return myhandles;
    }//END MYHANDLES
        
    /////////////////
    , _mybottomheight: function ( myobj ) { return ( myobj.HasParent ) ? myobj.Parent.Parent.Height : myobj.Owner.Height; }
    /////////////////
    
    ///////////////
    , _myrightwidth: function ( myobj ) { 
    ///////////////
        if ( myobj.Owner == undefined ) return; 
        return ( myobj.HasParent ) ? myobj.Parent.Parent.Width : myobj.Owner.Width;          
    }//_MYRIGHTWIDTH
   
   ///////////
    , _labelV: '<div class="STICKER-biforkResizeVertical"></div>'
    //////////         
             + '<div class="STICKER-templateingResize-w">' 
             +    '<div class="UI-CONTAINER-choose STYLE-resizeChooseVerticalLeft">'
             +      '<a href="#" class="UI-BUTTON-choose">Left</a>'
             +    '</div>'
             +  '</div>'
             + '<div class="STICKER-templateingResize-e">' 
             +   '<div class="UI-CONTAINER-choose STYLE-resizeChooseVerticalRight">'
             +      '<a href="#" class="UI-BUTTON-choose">Right</a>'
             +    '</div>'
             + '</div>'
             
    /////////
    , _labelH: '<div class="STICKER-biforkResizeHorizontal"></div>'
    /////////                           
            + '<div class="STICKER-templateingResize-n">' 
            +    '<div class="UI-CONTAINER-choose STYLE-resizeChooseHorizontal">'
            +      '<a href="#" class="UI-BUTTON-choose">Top</a>'
            +    '</div>'
            +  '</div>'
            + '<div class="STICKER-templateingResize-s">' 
            +   '<div class="UI-CONTAINER-choose STYLE-resizeChooseHorizontal">'
            +      '<a href="#" class="UI-BUTTON-choose">Bottom</a>'
            +    '</div>'
            + '</div>'
    
    //////////////////////
    , _addContainerAction: function ( selector ) {
    //////////////////////    
        $( selector ).styleable(
          'add'
        , { styles: { 'background-color': 'orange' }
          , fit: false
          , type: 'container'
          , task: controls$design$draw$grid( '_addStyleableControlsWizzardSettings' )
          }
          , controls$design$draw$grid( '_addStyleableControlsCallback' )
         )//END STYLEABLE
         ;
         
    }//END _ADDCONTAINERACTION 
    
    ////////////////////////////////
    , _addStyleableControlsCallback: function ( data, overwrite ) {
    ////////////////////////////////
    
      ///////////////////////////////////////////////////////
      // REMOVE SPLIT/MEDITHUMB FROM STYLEABLE PARENT GRID //
      ///////////////////////////////////////////////////////
      $( '.UI' )
          .controls(
            'remove'
          , [  data.parent, 'grid/dev_gadgetSplit' ]
          , [  data.parent, 'grid/dev_gadgetMedithumb' ]
          )
          ;
      ////////////////////////////
      // IF WIZZARD IS ON START //
      ////////////////////////////
      if ( data.task == 'choose' ) $( '.UI' ).controls( 'add', [ data.self, data.task, overwrite ] );
              
      ////////////////////////
      // IF WIZZARD IS DONE //
      ////////////////////////
      else $( '.UI' )
               .controls(
                  'add'
                , [ data.self, data.type ]
                , [ data.self, data.task, overwrite ]
                )
                ;
              
      helperEmtyPageDesign();
    }//END _ADDSTYLEABLECONTROLSCALLBACK
    
    ///////////////////////////////////////
    , _addStyleableControlsWizzardSettings: 
    /////////////////////////////////////// 
        [ 'Text'
        , 'Subgrid'
        , [ 'Menu'
          , [ { name:'type.Vertical'
              , introText: 'Levels '
              , betweenButtons: ''
              , outroText: 'or ' 
              }
              , 'deep.1'
              , 'deep.2'
              , 'deep.3' 
            ]//END TYPE VERTICAL
          , [ { name:'type.Horizontal'
              , introText: 'Levels '
              , betweenButtons: ''
              , outroText: 'or ' 
              }
              , 'deep.1'
              , 'deep.2'
              , 'deep.3' 
            ]//END TYPE HORIZONTAL
          ]//MENU
        ]//END TEXT
  }[ opt ]
  ;
}
;

