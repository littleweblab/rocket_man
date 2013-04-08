///////////////
// BROWSEBAR //
///////////////
function getDrawBrowseObj(){     
  return {  
    start: 0
  , move: 216
   
  ////////////
  , grid_list: {
  ////////////
      style: 'panel'
    , back: false
    , moveOnClick: true
    , items: 'li.ITEM-browse:not(.HELPER-notSortable)'
    , onHight: function ( event, ui ) {}
    , onShow: function ( event, ui ) { 
        
        helperEmtyPageDesign();
        if ( $( '.PAGE' ).ios( 'GetZeroNodes' ).Item.length > 1 ) browsebarGridList( event, ui );
        else browsebarContainerList( event, ui ); 
        $( '.UI' ).dev_gadgetLayout( 'update' );
      }//END ONSHOW
    }//END browsebarGridList
  
  /////////////////  
  , container_list: {
  /////////////////
  
      style: 'panel'
    , back: true
    , moveOnClick: true
    , items: 'li.ITEM-browse'
    , onHight: function ( event, ui ) {}
    , onShow: function ( event, ui ) { 
       
       helperEmtyPageDesign();
       browsebarContainerList( event, ui ); 
       $( '.UI' ).dev_gadgetLayout( 'update' );
      }//END ONSHOW
    }//END browsebarContainerList
  
  //////////////////
  , styleable_setup: {
  //////////////////
     
      style: 'panel'
    , back: true
    , moveOnClick: true
    , items: 'a.BUTTON-addFlatMaxi' 
    , onHight: function ( event, ui ) { 
        var $body = $( 'body' );
        if ( 
          ui.target.data( 'browseName' ) !== ui.current.data( 'browseName' ) 
          && ui.trigger != undefined 
          && ! ui.trigger.is( 'a.BUTTON-addFlatMaxi' ) 
          && $body.data( 'gadgetFocus' ) != undefined 
        ) { $body.data( 'gadgetFocus' ).dev_gadgetFocus( 'deactivate' ); }//END IF
        
        browsebarRemoveContent( ui.current );
        
      }//END ONHEIGHT
    , onShow: function ( event, ui ) {    
        var data =  ui.target.data( 'bifork' ) 
          , $styleable = data.self
          , $body = $( 'body' )
          ;
          
        helperEmtyPageDesign();

        ///////////////////////////
        // PREVENT INFINITE LOOP //
        ///////////////////////////
        if ( $body.data( 'gadgetFocus' ) !== undefined ) { 
          if ( $body.data( 'gadgetFocus' ).attr( 'id' ) !== $styleable.attr( 'id' ) ) {
            $styleable.dev_gadgetFocus( 'activate' );//Focus the container if it still isn't 
          }//END IF
        }//END IF
        
        //////////////////////////    
        // REMOVE EXISTING LIST //
        //////////////////////////
        $( '[name=position]' )
          .closest( '.GRID_form25' )
            .remove()
            ;
        
        //////////////////////////////////
        // CREATE ADD CSS-STYLES BUTTON //
        //////////////////////////////////
        var $addCssStyles = 
          $( '<a/>' )
            .data( 'bifork', data )
            .addClass( 'BUTTON-addFlatMaxi' )
            .text( 'Add new attribute' ) 
            .append( '<span/>' )
              .find( 'span' )
                .addClass( 'STICKER-addFlatMaxiIcon ICON-add-maxi-panel' )
                .text( 'Icon Add' )
                .end()
              .wrap( '<li/>' )
                .parent()
                .addClass( 'ITEM-browse First STYLE-NoPadding' )
                ;
                            
        ui.target
          .find( 'li:not(:has(.Back)), .STYLE-given' )
            .remove()
            .end()
          .append( $addCssStyles )
          ;
          
        ///////////////////////////////////////////////////////////////////
        // BRING THINGS TOGETHER THAT WILL BE NEEDED TO CREATE THE FORMS //
        // TO SETUP THE STYLEABLES STYLES                                //    
        ///////////////////////////////////////////////////////////////////  
        var getStyles = stylesObj()
          , accordionLabel = '' 
          , groupLabel = ''
          , getStyleable = function ( styleable ) { return !! styleable ? $( '.STAGE' ) : $styleable; }
          , htmlAccordion = function () { return '<li class="FUNCTION-accordion"><a class="ITEM-accordion">' + accordionLabel + '<span class="STICKER-accordionIcon ICON-greyArrowRight-mini"></span></a></li><li class="ITEM-browse Default STYLE-NoPadding toggle"></li>'; }
          , htmlGroupLabel = function () { return $('<div class="GRID_form100 StyleGroup"><h6>' + groupLabel + '</h6></div>'); } //function () { return '<div class="GRID_form100 StyleGroup"><h6 class="STYLE-itemBrowseBorderDotted">' + groupLabel + '</h6></div>'; }
          , countItemsInARow = 4
          , $newRow
          , htmlRow = '<div class="GRID_form100"></div>'//'<div class="GRID_form100 STYLE-itemBrowseBorderDotted"></div>'
          , createLabel = function ( label ) { return label !== 'none' ?  '<label class="FORM-label">' + label + '</label>' : ''; }
          , htmlColumn = function ( columns, label ){ return '<div class="GRID_form' + 25 * columns + '"><div class="FORM-item" >' + createLabel( label ) + '</div></div>'; }
          , htmlFormType = function ( value, name, type, defaults ) {
              if ( typeof type == 'object' ) { 
                var selected = $.inArray( value.replace( / /, '' ), type )
                  , options = []
                  ;
                
                for ( var i = 0; i < type.length; i++ ) { 
                  if ( i == selected ) options.push( '<option value="' + type[ i ] + '" selected="selected">' + type[ i ] + '</option>' );
                  else options.push( '<option value="' + type[ i ] + '">' + type[ i ] + '</option>' );
                }//END LOOP
                return '<select name="' + name + '">' + options.join('') + '</select>';
              }//END IF
              else if ( type == 'stepper' || type == 'color' ) return '<input class="FORM-input-' + type + '" type="text"  name="' + name + '" value="' + value + '"/>';
              else if ( type == 'text' ) return '<input class="FORM-input" type="text"  name="' + name + '" value="' + value + '"/>';
              else if ( type == 'checkbox' ) return '<input type="checkbox" ' + defaults + '/>';
              else if ( type == 'radio' ) return '<input type="radio" name="' + name + '" value="' + value + '"/>';
              else if ( type == 'file' ) return '<input class="FORM-input-' + type + '" type="file" name="file" data-name="' + name + '" data-value="' + value + '" data-text="Upload a new image" multiple/>';
            }//END HTMLFORMTYPE 
          , createColumn = function ( rows, label, attributes, styles, type ) {
              var $newColumn = $( htmlColumn( rows, label ) ).appendTo( $newRow ) // CREATE COLUMN //
                , $formItem = $newColumn.find( '.FORM-item' ).append( htmlFormType( attributes, styles, type ) )
                ;
              
              ///////////////////////////////////////////////////////////////////////////////////////////////////
              // "COUNTERS" UP THE countItemsInARow VARIABLE TO SEE IN THE LOOP WHEN A NEW ROW MAST BE CREATED //
              /////////////////////////////////////////////////////////////////////////////////////////////////// 
              countItemsInARow = countItemsInARow + rows;
            }//END CREATECOLUMN
          , create$newRow = function () {
              //////////////////////////////////////////////////////    
              // CREATE A NEW ROW IF ROW IS FULL                  //
              // MAX 4 COLUMNS / HOW MANY ROWS A STYLE FORM FIELD // 
              // NEEDS IS SETUPED IN STYLE.rows[stylePosition]    //     
              //////////////////////////////////////////////////////
              
              if ( countItemsInARow == 4 ) { 
               $newRow = $( htmlRow ).appendTo( accordion.next() ); 
               countItemsInARow = 0;    
               
              }//END IF   
             

            }//END CREATE$newRow
          ;
          
          ///////////////////////////////////////////////
          // CREATE FORM ELMENTS & GRID FOR CSS-STYLES //
          ////////////////////////////////////////////////////
          // LOOPS TROUGH ALL STYLES FROM STYLEABLE(BIFORK) //
          /////////////////////////////////////////////////////////////////////////////
          // LOOPS TROUGH ALL CATEGORIES IN getStyles (styles config file styles.js) //      
          /////////////////////////////////////////////////////////////////////////////
          // LOOPS TROUGH ALL GROUPS IN THE CATEGORIE // 
          //////////////////////////////////////////////
          for ( var attribute in data.styles ) { for ( var categorie in getStyles ) { for ( var group in getStyles[ categorie ] ) {
            
            ////////////////////////////////////////////////////////////
            // FILTER: ONLY STYLEABLES THAT ARENT ON THE EXCLUDE LIST //
            ////////////////////////////////////////////////////////////
            if ( browsebarCssStyleHedge( data.task, getStyles[ categorie ][ group ][ 2 ] ) ) { 
              
              var STYLE = getStyles[ categorie ][ group ][ 1 ]//get style
                , stylePosition = $.inArray( attribute, STYLE.styles || [] )//find style in styles if it exist in this categorie/stylegroup 
                , accordionExist
                , accordion
                ;
                    
              if ( stylePosition !== -1 ) {//Exist bifork style in this styles categorie? 
                ///////////////////////////////////////////////////////////////////////////////////////
                // CREATES ACCORDION IF FOR THE CATEGORIE OF THE MATCHED STYLE IT STLL DOESN'T EXIST //
                /////////////////////////////////////////////////////////////////////////////////////// 
                accordionLabel = getStyles[ categorie ][ 0 ]; 
                groupLabel = getStyles[ categorie ][ group ][ 0 ];
                accordionExist = ui.target.find(  'li.FUNCTION-accordion:contains("' + accordionLabel + '")' );
             
                if ( ! accordionExist.length ) accordion = ui.target.append( htmlAccordion ).find( 'li.FUNCTION-accordion:contains("' + accordionLabel + '")' );
                else var accordion = accordionExist;
                      
                create$newRow();//Ask if a new row is needed
              
                if ( ! accordion.next().find( 'div:contains("' + groupLabel + '")' ).length ) { 
                  $newRow.before( htmlGroupLabel )// Create group label if it still doesn't exist 
                  if ( $newRow.prev().prev().length  ) $newRow.prev().css( 'margin-top', -6 );//Adjust Headlines 
                }//END IF
                
                //////////////////////////////////////////////////////////////////////////////////
                // some css styles have values that can only be defined like this:              //
                // background-position:"10px 10px". for the interface each value needs his own  //
                // form element to keep the setup of theese styles simple for the user.         //
                ///////////////////////////////////////////////////////////////////////////////////////////////////////
                // to deal with this problem we created sync form elements. before thair values where send to bifork //
                // newvalue search for other form items with the same style as name and joins thair values together  //
                ///////////////////////////////////////////////////////////////////////////////////////////////////////
           
                if ( $.isArray( STYLE.rows[ stylePosition ] ) ) { //If it is a style that needs more than one form element  
                  
                  var splitAttributes = data.styles[ attribute ].split(' ');
                  for ( var i = 0; i <  STYLE.rows[ stylePosition ].length; i++ ) { 
                    if ( $newRow ) {
                      var $items = $newRow.find('.FORM-items')
                      console.log( $items.length  )
                      }
                    create$newRow();//Ask if a new row is needed
                    createColumn(
                      STYLE.rows[ stylePosition ][ i ]
                    , STYLE.label[ stylePosition ][ i ]
                    , splitAttributes[ i ]
                    , STYLE.styles[ stylePosition ] 
                    , STYLE.type[ stylePosition ][ i + 1 ] 
                    );
                  }//END LOOP 
                }//END IF
                else createColumn( STYLE.rows[ stylePosition ], STYLE.label[ stylePosition ], data.styles[ attribute ], STYLE.styles[ stylePosition ], STYLE.type[ stylePosition ] );
              }//END IF
            }//END IF
            
            if ( $newRow ) browsebarAdjustColumns( $newRow );
        }}}//END LOOPS
        
        browsebarMakeNicerForms( ui.target, $styleable, data );//Make Created Forms Nicer 
             
        //////////////////////////////////////////////////////////
        // LOOPS TROUGH ALL LI'S THAT SOULD BECAME AN ACCORDION //
        //////////////////////////////////////////////////////////
        ui.target
          .find( '.FUNCTION-accordion' )
            .each( function () {
              var $this = $( this )
                , pos = $.inArray( $this.text(), data.openAccordions )//Search in biforks open accordion list if accordion was open before
                ;
            
              /////////////////////
              // SETUP ACCORDION //
              /////////////////////
              $( this ).dev_gadgetAccordion( {
                open: ( pos != -1 ) ? true : false // IF WAS OPEN OR NOT   
              , afterHide: function ( event, ui ) { 
                  var pos = $.inArray( ui.element.text(), data.opendAccordions || [] );//Ask if accordion exist in bifork list
                  data.openAccordions.splice( pos );//Removes this accordion from biforks open accordion list  
                  $( '.UI' ).dev_gadgetLayout( 'update' );
              }//END AFTER HIDE
              , afterShow: function( event, ui ) { 
                  var pos = $.inArray( ui.element.text(), data.opendAccordions || [] );//Ask if accordion exist in bifork list
                  if ( pos == -1 ) data.openAccordions.push( ui.element.text() );//Add this accordion to biforks open accordion list 
                  $( '.UI' ).dev_gadgetLayout( 'update' );
            }//END AFTER SHOW
          });//END ACCORDION GADGET
        });//END ACCORDION LOOP
       
        //////////////////////////////////////////////
        // APPEND MEDITHUMBS TO DELETE STYLEGROPUPE //
        //////////////////////////////////////////////      
        $( '.StyleGroup' )
          .each( function () {
            ///////////////////////////////////////////////////////////////////
            // GET THINGS TOGETHER THAT WILL BE NEEDED TO REMOVE STYLE GROUP //     
            ///////////////////////////////////////////////////////////////////
            var $this = $( this )
              , $rows = $this.nextUntil( '.StyleGroup' )
              , $toggle = $this.closest( '.toggle' )
              , $accordion = $toggle.prev()
              , $focus = $( 'body' ).data( 'gadgetFocus' )
              , $styleable = $focus.length ? $focus : $( '.PAGE' )
              , data = $styleable.data( 'styleable_item' ) 
              , stylesToRemove = []
              ;
            
            //////////////////////////////////////////////////
            // CREATE TRIGGER TO REMOVE STYLEGROUP ON CLICK //
            //////////////////////////////////////////////////
            $this.dev_gadgetMedithumb({
              'button.delete': {
                addClass:'STYLE-itemMedithumbIcon ICON-trash-mini'
              , action: function ( event, ui ) { 
                  ui.button.click( function () { 
                    
                    for ( var categorie in getStyles ) { //loops trough categories in getstyles 
                      for ( var group in getStyles[ categorie ] ) { //loops trough groups in categories/getstyles 
                        if ( getStyles[ categorie ][ group ][ 0 ] == $this.text() ) { //if current loop is the group we are looking for
                        
                          var defaults =  jQuery.extend( true, {}, getStyles[ categorie ][ group ][ 1 ][ 'defaults' ]);// make a copy of groups default styles
                          var $file = ui.element.next().find( '.FORM-item:has(input[type=file])' );   
                          var $form = $file.find( 'input[type=file]' );
                          
                          for ( var style in defaults ) stylesToRemove.push( style );
                          
                          ////////////////////////////////////////
                          // REMOVE CSS-STYLE FORM STYLEABLE    // 
                          // IN THE DOM AND IN STYLEABLE OBJECT //
                          //////////////////////////////////////// 
                          function removeCssStyle ( $accordion, $styleGroup, $toggle, $rows, data, stylesToRemove ) {
                            $rows
                              .add( $styleGroup )
                              .fadeOut( 
                                400
                              , function () {
                                  
                                  if ( ! $styleGroup.prev().length ) $styleGroup.nextAll( '.StyleGroup:first' ).css( 'margin-top', 0 );
                                  data.parent.styleable( 'deleteStyles', data.self, stylesToRemove );
                                  $rows.add( $styleGroup ).remove();// remove stylegroup from browsebar
                                  if ( $toggle.children().length == 0 ) $toggle.add( $accordion ).remove();//if categorie of deleted stylegroupe is emty now for this styleable delete accordion/toggler  
                                  else $accordion.dev_gadgetAccordion( 'updateHeight' );//Reset height of an opened toggler after sytle was removed to remove the spot it left
                                  $( '.UI' ).dev_gadgetLayout( 'update' );
                                }//END CALLBACK
                              )//END FADEOUT
                          }//END REMOVECSSSTYLE
                          
                          /////////////////////////////////////////
                          // IF IT CSS_STYLE IS BACKGROUND-IMAGE //
                          /////////////////////////////////////////
                        
                          if ( ! data.storage[ $form.data( 'name' ) ] ) { 
                            removeCssStyle( $accordion, $this, $toggle, $rows, data, stylesToRemove );
                          }
                          else {
                            $.ajax({
                                 url: '/removefile'
                               , dataType: 'json'
                               , data: { projectId: URL.address[ URL.address.length - 2 ], fileId: $styleable.data( 'styleable_item' ).storage[ $form.data( 'name' ) ].fileId }
                               , success: function ( removed ) {
                                   var $file = ui.element.next().find( '.FORM-item:has(input[type=file])' );   
                                   
                                   ////////////////////////////////////////////
                                   // SET BACKGROUND-IMAGE TO NONE           //
                                   // AND REMOVE IMAGE OBJECT FROM STYLEABLE //
                                   ////////////////////////////////////////////
                                   removeCssStyle( $accordion, $this, $toggle, $rows, data, stylesToRemove );
                                   delete data.storage[ $form.data( 'name' ) ];
                                   $file.next().bgImageStatus( 'option', 'fileObj', {} );
                                   
                                 }//END SUCCESS
                               })//END $.AJAX 
                               
                               
                          }//END ELSE                                                 
                        }//END IF 
                      }//END GROUP LOOP
                    }//END CATEGORIE LOOP
                  });//END BUTTON
                }//END ACTION
              }//END BUTTON DELETE
            });//END MEDITHUMNB
          });// END STYLEGROUP LOOP
                
     
        /////////////////
        // SETUP GIVEN //     
        /////////////////
        var getGiven = givenObj() 
          , styleableType = function () {
              var type; 
              for ( var search in getGiven ) {  
                if ( getGiven[ search ][ 0 ] == data.task.toLowerCase() ) type = getGiven[ search ][ 0 ];//look after styles for kind 
                else if ( getGiven[ search ][ 0 ] == data.type.toLowerCase() ) type = getGiven[ search ][ 0 ];//look after styles for nature 
              }//END LOOP
              return type;
            }()
          ;
        if ( styleableType !== undefined ) {
          
          var $htmlGivenHead = 
                $( '<li/>' )
                  .addClass( 'ITEM-browse' )
                  .append( '<a/>' )
                  .find( 'a' )
                    .text( 'Given' )
                    .addClass( 'ITEM-browse Header' )
                    .end()
                    
            , $htmlGivenBody = $( '<li/>' ).addClass( 'ITEM-browse' )
            , $given = styleableType !== 'page' 
                       ? $( '<menu/>' )
                           .appendTo( ui.target )
                           .addClass( 'FUNCTION-browse STICKER-given STYLE-given' )
                           //.css( { 'bottom': 0, position: 'absolute', left: 432 } )
                           .append( $htmlGivenHead, $htmlGivenBody  ) 
                       
                       : $htmlGivenBody
                           .addClass( 'HELPER-bodySetup' )
                           .insertAfter( ui.target.find( '.First:first' ) )
                     
            , givenTarget = styleableType !== 'page' ? $given.find( '.ITEM-browse:last' ) : '.HELPER-bodySetup'
            , savedStyle = []
            ;
           
            ///////////////////////////// 
            // START ROW COUNTER AGAIN //
            /////////////////////////////  
            countItemsInARow = 4;   
            
            /////////////////////
            // ADD CHANGE TASK //
            /////////////////////
            $( '<a/>' )
              .attr( 'href', "#" )
              .text( 'Change Task' )
              .insertAfter( $given.children( ':first' ) )
              .wrap( '<li/>' )
              .parent()
                .addClass( 'ITEM-browse' )
                .end()
              .wrap( '<div/>' )
              .parent()
                .addClass( 'GRID_form100' )
                .end()
              .wrap( '<div/>' )
              .parent()
                .addClass( 'CONTAINER-browse-content' )
                .end()
              .wrap( '<p/>' )
              .before( helperFirstLetterToUppercase( data.type ) )  
              .before( ' for ' ) 
              .before( data.task ) 
              .before( '<span/>' ) 
              .prev()
                .addClass( 'STYLE-browse-content-divider' )
                .end()
              .bind( 'click',  function ( event ) {
                //////////////////
                // REMOVE FOCUS //
                //////////////////
                $styleable.dev_gadgetFocus( 'deactivate' );
                
                /////////////////////////////////
                // MOVE BROWSEBAR TO GRID VIEW //
                /////////////////////////////////
                $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'browseTo', 'grid_list' );
                
                //////////////////////////////////////////////////////////////
                // HIDE ORIGINAL STYLEABLE UNTIL WE KNOW WHAT TO DO WITH IT //
                // IF USER PRESSED CANCEL INSTAED OF CHOOSING A NEW TASK    //
                // WE WILL NEED TO RESTORE LAST SETUP                       //
                //////////////////////////////////////////////////////////////
                data.self.fadeOut( 0 );                
                
                var cloneData = 
                  $.extend( true
                    , {}
                    , $styleable.data( 'styleable_item' )
                    , { task: controls$design$draw$grid( '_addStyleableControlsWizzardSettings' )
                      , afterAdd: function ( ui ) {  
                          ui.element.styleable( 'removeStyleable', data.self );//Remove original styleable if clone has a new task
                        } 
                      , onCancel: function ( ui ) {           
                          ui.element.styleable( 'removeStyleable', ui.styleable );//Remove Copy that was created to switch the task
                          data.self.fadeIn( 0, function () { $( this ).trigger( 'click' ) } );//Show old container
                      }//END ONCANCEL 
                      ,html: ''
                    }//END SECOND OBJ
                  );//END $.EXTEND
                
                //////////////////
                // CREATE CLONE //
                //////////////////
                data.parent.styleable(
                    'add'
                  , cloneData
                  , controls$design$draw$grid( '_addStyleableControlsCallback' )
                );//END STYLEABLE
              });//END CHANGE TASK
      
              //////////////////////////
              // LOOP FOR GIVEN SETUP //     
              //////////////////////////////////////////////////////////
              // LOOPS TROUGH GETGIVEN TO FIND MATCHING CONFIGURATION //
              //////////////////////////////////////////////////////////
              for ( var type in getGiven ) {               
                
                //////////////////////////////////////////////////////
                // MATCHED getGiven OPTION NAME WITH styleableType? //     
                //////////////////////////////////////////////////////
                if ( getGiven[ type ][ 0 ] == styleableType ) {
                             
                  var OPTIONS = getGiven[ type ][ 1 ];
                
                  ////////////////////////////////
                  // MATCHED WITH styleableType //     
                  ////////////////////////////////    
                  for ( var given in OPTIONS[ 'givens' ] ) {
                    
                    var formType = OPTIONS[ 'givens' ][ given ];
                  
                    //////////////////////////////////////////////////////    
                    // CREATE A NEW ROW IF ROW IS FULL                  //
                    // MAX 4 COLUMNS / HOW MANY ROWS A STYLE FORM FIELD // 
                    // NEEDS IS SETUPED IN STYLE.rows[stylePosition]    //     
                    //////////////////////////////////////////////////////        
                    if ( countItemsInARow == 4 ) { 
                      $newRow = $( htmlRow ).appendTo( givenTarget ); 
                      countItemsInARow = 0;    
                    }//END IF
                    
                    /////////////////////
                    // CREATE HEADLINE //
                    /////////////////////  
                    if ( OPTIONS.type[ given ] == 'headline' ) { 
                      
                      var $column = 
                        $( '<h6/>' )
                          .text( OPTIONS.values[ given ] )
                          .appendTo( $newRow )
                          .css('margin-top', '-6px')
                          ;
                          
                    }//END IF
                    
                    ///////////////////
                    // CREATE COLUMN //
                    ///////////////////
                    else {
                      var $column = 
                        $( htmlColumn( OPTIONS.rows[ given ], OPTIONS.label[ given ] ) )
                          .appendTo( $newRow )
                          .find( '.FORM-item' )
                          .append( htmlFormType( OPTIONS.values[ given ]  , OPTIONS.givens[ given ] , OPTIONS.type[ given ], OPTIONS.defaults[ given ] ) )
                          ;
                    
                    }//ELSE
                    
                    //////////////////////////////////////////////////
                    // REMOVE PADDING FROM COLUMN IF IT IS TO SMALL // 
                    //////////////////////////////////////////////////
                    if ( $column.parent().is('.GRID_form25 ') ) { 
                      $column
                        .addClass( 'STYLE-NoPaddingLeftRight STYLE-NoPaddingBottom' )
                        .parent()
                        ;     
                    }//END IF
                      
                    ///////////////////////////////////
                    // SETUP GIVEN SPECIAL CALLBACKS //  
                    ///////////////////////////////////            
                    // STYLEABLE //
                    ///////////////
                    // FIT //
                    /////////
                    if ( formType == 'fit' ) { 
                      if ( data.fit == true )  $column.find( 'input' )[ 0 ].checked = true; //Checks input if bifork.isfittoparent is true     
                      
                      $column
                        .find( 'input' )
                          .dev_gadgetForm({ 
                            change: function ( event, ui ) {  
                              helperToggleFitSortable( $styleable, ! ui.newValue );
                              data.parent.styleable( 
                                'fit'
                              , data.self
                              , ui.newValue 
                              );//END STYLEABLE
                            }//END CHANGE
                          });//END GADGETFORM
                    };//END IF
                    
                    ///////////////
                    // STYLEABLE //
                    ///////////////            
                    // FOLLOW //
                    ////////////
                    if ( formType == 'follow' ) { 
                      if ( data.type == 'container' ) $column.find( 'input' )[ 0 ].checked = true; //Checks input if bifork.isfittoparent is true     
                      
                      $column
                        .addClass( 'HELPER-followCheckBox' )
                        .find( 'input' )
                          .dev_gadgetForm({ 
                            change: function ( event, ui ) { 
                              data.parent.styleable( 
                                'setType'
                              , data.self
                              , ui.newValue == true ? 'container' : 'sticker' 
                              , function ( data, overwrite ) {
                                  $( '.UI' )
                                    .controls( 
                                      'add'
                                    , [ data.self, data.type ]
                                    , [ data.self, data.task ]
                                    )
                                    ;
                                }
                              );
                            }//END CHANGE
                          });//END GADGETFORM
                    };//END IF
                    
                    ///////////////
                    // STYLEABLE //
                    ///////////////
                    // MENU TYPE //
                    ///////////////                
                    if ( formType == 'menuType' ) {     
                      $column
                        .find( 'option:selected' ) 
                          .removeAttr( 'selected' )
                          .end()
                        .find( 'option:contains("' + helperFirstLetterToUppercase( data.storage.overwrite.menu.type ) + '")' )
                          .attr( 'selected', 'selected' )
                          .end()
                        .find( 'select' )
                        .dev_gadgetForm({
                          change: function ( event, ui ) { 
                            data.self.menu( 'option', { type: ui.newValue.toLowerCase() });
                            data.self.flyingPanel( 'reset' );
                          }//END CHANGE
                        })//END GADGETFORM
                        ;
                    };//END IF
                  
                    ///////////////
                    // STYLEABLE //            
                    ////////////////
                    // MENU LEVEL //
                    ////////////////   
                    if ( formType == 'menuLevelDeepth' ) {     
                      $column
                        .find( 'option:selected' ) 
                          .removeAttr( 'selected' )
                          .end()
                        .find( 'option:contains("' + data.storage.overwrite.menu.deep + '")' )
                          .attr( 'selected', 'selected' )
                          .end()
                        .find( 'select' )
                          .dev_gadgetForm({
                            change: function ( event, ui ) {  
                              data.self.menu( 'option', 'deep', ui.newValue );//Set new numebr of levels in styleable- & menuobj
                              data.self.flyingPanel( 'reset' );
                            }//END CHANGE
                          })//END GADGETFORM
                          ;
                    };//END IF
                    
                    ///////////////
                    // STYLEABLE //   
                    /////////////////////
                    // MENU STARTPOINT //
                    /////////////////////
                    if ( formType == 'menuLevel' ) {
                      $column
                        .find( 'input' )
                        .val( data.storage.overwrite.menu.level )
                        .dev_gadgetForm({
                          special: 'stepper'
                        , minValue: 1
                        , change: function ( event, ui ) {
                            data.self.menu('option', { level: ( ui.newValue ) });//Change startingpoint in styleable- & menuobj
                          }//END CHANGE
                        })//END GADGETFORM
                        ;
                    }//END IF     
                                      
                    ///////////
                    // STAGE //
                    /////////////////////////////     
                    // DEFAUT STYLES FOR STAGE //
                    /////////////////////////////
                    if ( formType == 'background-color01'
                      || formType == 'background-image01'
                      || formType == 'background-attachment01'
                      || formType == 'background-position01'
                      || formType == 'background-repeat01' 
                    ) { 
                      var style = OPTIONS.givens[ given ].replace( /\d/g, '' )
                        , $stage = $( '.STAGE' )
                        ;
                      
                      if ( savedStyle.length == 0 ) { 
                        savedStyle = 
                          $stage
                            .data( 'styleable_item' )
                            .styles[ style ]
                            .split(' ')
                            ;
                      }//END IF
                      
                      //////////////////////////////////////
                      // SET SAVED VALUE FOR SELECT FIELD //
                      //////////////////////////////////////
                      if ( $.isArray( OPTIONS.type[ given ]) ) {
                        
                        $column
                          .find( 'option:selected' ) 
                            .removeAttr( 'selected' )
                            .end()
                          .find( 'option:contains("' + savedStyle.shift() + '")' )
                            .attr( 'selected', 'selected' )
                            .end()
                            ;
                      }//END IF 
                      
                      ////////////////////////////////
                      // SET SAVED VALUE FOR INPUTS //
                      ////////////////////////////////
                      else if ( savedStyle.length ) {
                        
                        var tempValue = savedStyle.shift();
                        if ( OPTIONS.type[ given ] !== 'file' ) $newRow.find( 'input' ).val( tempValue );// Change hardcoded value with value from database if exist
                        else $newRow.find( 'input' ).data( 'value', tempValue );//Extra Update for file "value"
                        
                      }//END ELSE 
                      
                      //////////////////////////////
                      // MAKE FORM ELEMENTS NICER //
                      //////////////////////////////
                      browsebarMakeNicerForms( $newRow , $stage, $stage.data( 'styleable_item' ) );
                        
                    }//END IF  
                      
                    ////////// 
                    // PAGE //  
                    ///////////////////            
                    // PAGE POSITION //
                    ///////////////////
                    if ( formType == 'position' ) { 
                      var pagePos = '';   
                        
                      if ( data.styles[ 'margin-left' ] != 'auto' ) pagePos = 'left';
                      if ( data.styles[ 'margin-right' ] != 'auto' ) pagePos = 'right';
                      if ( pagePos == '' ) pagePos = 'center';
                      if (  OPTIONS.values[ given ]  ==  pagePos ) $column.find( 'input' )[ 0 ].checked = true; // select current page position
                        
                      $column
                        .find( 'input' )
                        .dev_gadgetForm({
                          change: function ( event, ui ) { 
                            var pos = {
                                  left: { 'margin-left': '15px', 'margin-right': 'auto' }
                                , right: { 'margin-left': 'auto', 'margin-right': '15px' }
                                , center: { 'margin-left': 'auto', 'margin-right': 'auto' }
                                }//END POS
                              
                            $( '.STAGE' ).styleable( 'setStyles', $( '.PAGE' ), pos[ ui.newValue ] );  
                            $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'update' );
                          }//END CHANGE
                        });//END GADGET FORM
                    };//END IF
                                    
                    ////////// 
                    // PAGE //  
                    ////////////////            
                    // PAGE WIDTH //
                    ////////////////
                    if ( formType == 'width01' ) {
                      $column
                        .find( 'input' )
                        .val( data.saveStyles.width )
                        .dev_gadgetForm({
                          special: 'stepper'
                        , minValue: 1
                        , change: function ( event, ui ) { 
                            alert( 'nothing happend' );   
                          }//END CHANGE           
                        })
                        ;
                    }//END IF
                    
                    //////////
                    // PAGE //
                    /////////////////
                    // PAGE HEIGHT //
                    /////////////////
                    if ( formType == 'height01' ) {
                      $column
                        .find( 'input' )
                        .val( data.styles[ 'min-height' ] )
                        .dev_gadgetForm({
                          special: 'stepper'
                        , minValue: 1
                        , change: function ( event, ui ) { 
                            alert('nothing happend'); 
                          }//END CHANGE
                        })
                        ;
                    }//END IF
                      
                    //////////
                    // PAGE //
                    /////////////////////
                    // PAGE MARGIN-TOP //
                    /////////////////////  
                    if ( formType == 'margin-top01' ) {
                      $column
                        .find( 'input' )
                        .val( data.styles[ 'margin-top' ] )
                        .dev_gadgetForm({
                          special: 'stepper'
                        , minValue: 1
                        , change: function ( event, ui ) { $( '.STAGE' ).styleable( 'setStyles', $( '.PAGE' ), { 'margin-top' : ui.newValue } ); }//END CHANGE
                        });
                    }//END IF
                    
                    //////////
                    // PAGE //
                    ////////////////////////
                    // PAGE MARGIN-BOTTOM //
                    ////////////////////////  
                    if ( formType == 'margin-bottom01' ) {
                      $column
                        .find( 'input' )
                        .val( data.styles[ 'margin-bottom' ] )
                        .dev_gadgetForm({
                          special: 'stepper'
                        , minValue: 1
                        , change: function ( event, ui ) { $( '.STAGE' ).styleable( 'setStyles', $( '.PAGE' ), { 'margin-bottom' : ui.newValue } ); }//END CHANGE
                        });
                    }//END IF
                
                    countItemsInARow = countItemsInARow +  OPTIONS.rows[given]; //"counters" up the countitemsinarow variable to see in the loop when a new row mast be created 
                    if ( countItemsInARow == 4 ) browsebarAdjustColumns ( $newRow );
              
                  }// END LOOP
                }// END OPTION
              }// END LOOP            
              
              ///////////////////////////////////////////////////////////////////////////////////////////
              // THIS IS THE EXTRA SPACE UNDER MENU TO MANAGE THAT FORM WILL NOT DISAPEAR BEHIND GIVEN //
              ///////////////////////////////////////////////////////////////////////////////////////////
              $( '<li/>' )
                .addClass( 'ITEM-browse HELPER-givenBrowseHeight' )
                .height( $( '.STYLE-given' ).height() )
                .appendTo( ui.target )
                ;  
              
          }//END IF 
          $( '.UI' ).dev_gadgetLayout( 'update' );
        }//END ON SHOW
    }//STYLEABLE SETUP
  
  , styleCategories_list: {
      style: 'option'
    , back: 'last'
    , moveOnClick: true
    , items: 'li.ITEM-browse'
    , onHight: function ( event, ui ) { browsebarSetBackground( ui.target, 'panel'); }
    , onShow: function ( event, ui ) {
      
        browsebarSetBackground( ui.target, 'option');
        var getStyles = stylesObj()
          , categories = getCategories()
          ;
          
        function isAllowed ( categorie ) {
          var somethingFound = 0
            , nature = ui.trigger.data( 'bifork' ).type.toLowerCase()
            , kind = ui.trigger.data( 'bifork' ).task.toLowerCase()
            , natureOfStyleable = nature == 'item' ? kind : nature
            ;
 
          for ( var i = categorie.length; i--; ) {
            var not = $.isArray( categorie[ i ][ categorie[ i ].length -1  ] ) 
                    ? browsebarCssStyleHedge( natureOfStyleable, categorie[ i ][ categorie[ i ].length-1 ] ) 
                    : -1
                    ;
            if ( not > -1 ) somethingFound++;
          }//END LOOP 
          if ( somethingFound == categorie.length -1 ) return false;
          return true;
        }//END IS ALLOWED
        
        ///////////////////////////////////////////    
        // CREATE LIST OF CATEGORIES FROM STYLES //
        ///////////////////////////////////////////  
        function getCategories () {
          var categories = []; 
          for ( categorie in getStyles ) if ( isAllowed( getStyles[ categorie ] ) ) categories.push( getStyles[ categorie ][ 0 ] );    
          return categories;
        }//END GETCATEGORIES
        
        //////////////////////////    
        // REMOVE EXISTING LIST //
        //////////////////////////  
        ui.target
          .find( 'li:not(.ITEM-browse:has(.Back))' )
          .remove()
          .end()
          ; 
        
        ///////////////////////////
        // CREATE LIST IN A LOOP //
        ///////////////////////////  
        for ( var categorie in categories ) {
          var $listItem = 
              $('<a class="ITEM-browse-dark STYLE-itemBrowseBorder-dark STYLE-itemBrowseBigLetter-dark">' + categories[ categorie ] + '<br><span class="STYLE-itemBrowseText"></span> <span class="STICKER-browseArrow ICON-greyArrowRight-mini STYLE-icon-mini-dark"></span> <span class="STICKER-browseArrow ICON-greyArrowRight-mini STYLE-icon-mini-dark"></span> </a> ' )
              .appendTo( ui.target )
              .wrap( '<li class="ITEM-browse"></li>' )// Create list item 
              .parent()
                .data( 'bifork', ui.trigger.data( 'bifork' ) )   
                .end();      
          
          if ( ui.target.find( 'li:not(.ITEM-browse:has(.Back))' ).length == 1 ) $listItem.addClass( 'First-dark' );//First element becomes a shadow 
        }// END LOOP
        
        $( '.UI' ).dev_gadgetLayout( 'update' );
      }// END ONSHOW
  }//END STYLE CATEGORIE LIST

  //////////////
  , styles_list: {
  //////////////
      style: 'option'
    , back: true
    , moveOnClick: 'styleable_setup' // container_edit'
    , items: 'li.ITEM-browse'
    , onHight: function ( event, ui ) { browsebarSetBackground( ui.target, 'panel'); }
    , onShow: function ( event, ui ) { 
        
        browsebarSetBackground( ui.target, 'option' );
               
        function isAllowed ( categorie ) {
          var somethingFound = 0
            , nature = ui.trigger.data( 'bifork' ).type.toLowerCase()
            , kind = ui.trigger.data( 'bifork' ).task.toLowerCase()
            , natureOfStyleable = nature == 'item' ? kind : nature
            , not = browsebarCssStyleHedge( natureOfStyleable, $.isArray( categorie ) ? categorie[ categorie.length -1 ] : -1  )
            ;
        
          if ( not > -1 ) return false;
          return true;
        }//END ISALLOWED
        
        //////////////////////////    
        // REMOVE EXISTING LIST //
        //////////////////////////    
        ui.target
          .find( 'li:not(.ITEM-browse:has(.Back))' )
            .remove()
            .end()
          .find( 'li.ITEM-browse:has(.Back)')
            .data( 'bifork', ui.trigger.data( 'bifork' ) )
            .end()
            ; 
        /////////////////////////////    
        // COLLECT THINGS TOGETHER //
        /////////////////////////////
        var getStyles = stylesObj() 
          , pos = ui.trigger.prevAll().length - 1, categorie = getStyles[ pos ]
          , data =  ui.element.dev_gadgetBrowse( 'getColumnInDom', 'styleable_setup' ).data( 'bifork' )
          ;
          
        ////////////////////////////////////////////    
        // CREATE LIST OF CATEGORIES STYLE GROUPS //
        ////////////////////////////////////////////
        // LOOP THROUGH CATEGORIE //
        ////////////////////////////
        for ( var list in categorie ) {
          
          ////////////////////////////
          // FILTER CATEGORIE LABEL //
          ////////////////////////////
          if ( typeof categorie[ list ] !== 'string' && isAllowed( categorie[ list ] ) ) { 
            //////////////////////
            // CREATE LIST ITEM //
            //////////////////////   
            var $listItem = 
              $( '<a/>' )
                .addClass( 'ITEM-browse-dark STYLE-itemBrowseBorder-dark STYLE-itemBrowseLetter-dark StyleButton' )
                .text( categorie[ list ][ 0 ] )
                .appendTo( ui.target )
                .append( '<br/>', '<span/>' )
                .find( 'span' )
                  .addClass( 'STYLE-itemBrowseText' )
                  .text( categorie[ list ][ 1 ][ 'label' ].join( ', ' ) )
                  .end()
                .wrap( '<li/>' )
                .parent()
                  .addClass( 'ITEM-browse' )
                  .end()
                .bind(
                  'click'
                , categorie[ list ][ 1 ][ 'defaults' ]
                , function ( event ) { data.parent.styleable( 'setStyles', data.self , event.data ); }
                )
                .data( 'bifork', data )
                ;
            
            if (  ui.target.find( 'li:not(.ITEM-browse:has(.Back))' ).length == 1 ) $listItem.addClass( 'First-dark' );// FIRST ELEMENT BECOMES A SHADOW                    
          }//END IF
        }// END LOOP
        
        $( '.UI' ).dev_gadgetLayout( 'update' );
      }//END ON SHOW
    }//END STYLES LIST
  /*      
  , textStyle_list: {
      style: 'panel'
    , back: true//'styleable_setup'
    , items: false
    , onPressBack: function( event, ui ) {
        $container = $( 'body' ).data( 'gadgetFocus' );
        $container.dev_gadgetWrite( 'cancel' );
    }
    , onHight: function( event, ui ) { }
    , onShow: function( event, ui ) {
        //////////////////////////    
        // REMOVE EXISTING LIST //
        //////////////////////////  
        ui.target
          .find( 'li:not(:has(.Back)), .STYLE-given' )
          .remove();
        /////////////////////////////    
        // COLLECT THINGS TOGETHER //
        /////////////////////////////
        var $container = $( 'body' ).data( 'gadgetFocus' )//Get focused element
          , id = $container.attr( 'id' )// get id of focused element
          , iosc = $('.PAGE').ios('GetNodeByIdent', id )// get iosc of focused element 
          , textStyles = iosc.TextStyles // get teststyles from bifork
          , accordionLabel = '' // placeholder for accordion label  
          , htmlAccordion = function () { return '<li class="FUNCTION-accordion"><a class="ITEM-accordion">' + accordionLabel + '<span class="STICKER-accordionIcon ICON-greyArrowRight-mini"></span></a></li><li class="ITEM-browse Default STYLE-NoPadding toggle"></li>'; }
          ; // html of accordion
          
        //////////////////////////////    
        // LOOPS TROUGH TEXTSTYLES  //
        //////////////////////////////    
        
        
        for ( var categorie in textStyles ) {
          var CATEGORIE = textStyles[ categorie ];
          ///////////////////////////////////////////////////////////////////////////////////////
          // CREATES ACCORDION IF FOR THE CATEGORIE OF THE MATCHED STYLE IT STLL DOESN'T EXIST //
          /////////////////////////////////////////////////////////////////////////////////////// 
          accordionLabel = CATEGORIE[ 0 ]; 
          var accordionExist = ui.target.find( 'li:contains("' + accordionLabel + '")' )  
            , elementsHTML = [];
          
          if ( ! accordionExist.length ) var accordion = ui.target.append( htmlAccordion ).find( 'li:contains("' + accordionLabel + '")' );
          else var accordion = accordionExist;
          ////////////////////////////////////////////////////
          // LOOPS TROUGH TEXTSYLE ELEMNTS IN THE CATEGORIE //
          //////////////////////////////////////////////////// 
          for ( var element in CATEGORIE ) {
            var ELEMENT =  CATEGORIE[ element ];
            //////////////////////////////////////////////////////
            // IF IST IN NOT THE FIRST ELEMENT (CATEGORIE NAME) //
            //////////////////////////////////////////////////////
            if ( typeof ELEMENT != 'string' ) {
               elementsHTML.push( '<li class="HELPER-textStyles">' + '<' + ELEMENT.tag + ' class="' + ELEMENT.tag + id + '"  >' + ELEMENT.name + '</' + ELEMENT.tag + '>' + '</li>' );//Create text styles as html string and push it into elementshtml array
               helperDynamicStyleSheet( ELEMENT.tag + id , ELEMENT.attributes );//Create stylesheet
            }
          }//END LOOP
          ////////////////////////////////////
          // CREATE MENU FOR TEXT SELECTION //
          ////////////////////////////////////
           $( '<menu class="TextStyles">' + elementsHTML.join( '' ) + '</menu>' )
            .appendTo( accordion.next() )// Make menu and with the elements from elementshtml 
              .find( 'li > *' )
              .each(function(){
                
                var $this =  $(this) 
                  , fs = parseInt( $this.css('font-size') );
                $this.css({ 'padding-top': 0, 'padding-bottom': 8, 'padding-left': 0, 'padding-right': 0, margin: 0, 'line-height': fs * 1.6 + 'px' });
                
                
              });//Find childs of li and remove paddings and margins because list has his own space
             
          if ( categorie == 0 ) accordion.addClass( 'First' );//First element becomes a shadow 
        }// END TEXTSTYLES LOOP 
        /////////////////////////////////
        // INITIALISE ACCORDION WIDGET //
        /////////////////////////////////
        ui.target.find( '.FUNCTION-accordion' ).each( function () {
          var $this = $( this ), pos = $.inArray( $this.text(), iosc.OpendAccordions );//Search in biforks open accordion list if accordion was open before
          /////////////////////
          // SETUP ACCORDION //
          /////////////////////
          $( this ).dev_gadgetAccordion({
              open: ( pos != -1 ) ? true : false//If was open or not   
            , beforeHide: function ( event, ui ) { ui.toggle.find( '.HELPER-textStyles' ).dev_gadgetMedithumb( 'hide', 50 ); }
            , afterHide: function( event, ui ) { 
                var pos = $.inArray( ui.element.text(), iosc.OpendAccordions );//Ask if accordion exist in bifork list
                iosc.OpendAccordions.splice( pos );//Removes this accordion from biforks open accordion list  
                $( '.UI' ).dev_gadgetLayout( 'reset' );//Refresh grid
            }
            , beforeShow: function( event, ui ) { ui.toggle.find( '.HELPER-textStyles' ).dev_gadgetMedithumb( 'show', 0 ); }  
            , afterShow: function( event, ui ) { 
                var pos = $.inArray( ui.element.text(), iosc.OpendAccordions );//Ask if accordion exist in bifork list
                if ( pos == -1 ) iosc.OpendAccordions.push( ui.element.text() );//Add this accordion to biforks open accordion list 
                $( '.UI' ).dev_gadgetLayout( 'reset' );//Refresh grid
            }
          });//END ACCORDION GADGET
        });//END ACCORDION LOOP
      }//END ON SHOW
    }//END TEXT STYLE LIST  
    , file_list: {
        style: 'panel'
      , back: true
      , items: false
      , onPressBack: function( event, ui ) {}
      , onHight: function( event, ui ) {}
      , onShow: function( event, ui ) {
      
      var iosc =  ui.target.data('bifork') 
        , fileType = ui.target.data('filetype') 
        , callScript = {
            projectid: 'A0B0C0'
          , script: 'script_list_files'
          , columns: JSON.stringify({columnnames:[ 'none', 'none' ]})
        }

      , answer = $.ajax({
          url: '/ajax/script'
        , type: 'GET'
        , async: false
        , cache: false
        , timeout: 30000
        , data: callScript
        , error: function( err ){ alert( 'error' ); }
        , success: function( files ) {  
            
            createFileList( files ); 
             
        }
      }).responseText; //END $.AJAX

      function createFileList ( files ) {
        ui.target.find( 'li:not(.ITEM-browse-files:has(.Back))' ).remove();//Clear filelist         
        for ( file in files ) {
          var fileArray = files[ file ].item_name.split('.')   
            , filename = fileArray[ 0 ]
            , fileSuffix = files[ file ].mime_type.split('/')
            , $listItem = 
              $( '<a class="ITEM-browse-files STYLE-itemBrowseBorder-files">' +  filename  + '</a>')
                .appendTo( ui.target )
                .bind( 'click', { path: files[ file ].item_id, fileType: fileType },  function ( event ) {
                  //////////////////////////////////
                  // ADD FILE TO SELECTED ELEMENT //
                  //////////////////////////////////
                  switch (  event.data.fileType ) {
                    case 'background-image': iosc.doSetContainerStyles( { 'background-image': 'url(/blob/' + event.data.path + ')'}, 'update' );
                    break;
                    case 'image': $( '#' + iosc.Ident ).dev_gadgetImage( 'addNewImage', event.data.path , 0 );
                    break;
                  };//END SWITCH
                  $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'getColumnInDom', 'styleable_setup' ).data('bifork', iosc );//MAKE SURE THAT STYLEABLE BECOMES AN BIFORK OBJ 
                  $( '.GRID-panelBrowse').dev_gadgetBrowse( 'browseTo', 'styleable_setup' );
                })//END BIND
                .wrap( '<li class="ITEM-browse-files"></li>' )
                .parent()
                .append('<span class="STICKER-browseFiles STYLE-icon-mini-files">' +  fileSuffix[ 1 ]  + '</span>')
                .end();
              
              if ( ui.target.find( 'li:not(.ITEM-browse-files:has(.Back))' ).length == 1 ) $listItem.addClass( 'First' );// FIRST ELEMENT BECOMES A SHADOW            
          }//END LOOP
        }//END CREATEFILELIST     
      }//END ONSHOW
    }//END FILE_LIST*/
    
  };//END RETURN OBJ   
};//END DESIGNBROWSE        
    

////////////////////////////////////////////////////////////////////
// GET IOSC INFORMATION THAT BROWSEBAR WILL NEED TO CREATE A LIST //
////////////////////////////////////////////////////////////////////
function browsebarGetIosc ( target, type ) {
  var $page = $( '.PAGE' );

  if ( type == 'grid' ) { 
    return $page.ios( 'GetZeroNodes' ).doGetVisibleGrids();//Returns a list of the grids witch are editable / visible for the user 
  }//END IF
  else if ( $page.ios('GetZeroNodes').Item.length == 1 )  { 
    return $( '#' + $page.ios( 'GetZeroNodes' ).Item[ 0 ].Ident ).styleable( 'styleablesList' );
  }//END ELSE IF
  else {  
    return $( '#' + target.data( 'bifork' ).Ident ).styleable( 'styleablesList' );//Container list of a grid
  }//END ELSE

}//END BROWSEBARGETIOSC

/////////////////////  
// PAGE SETUP PAGE //
/////////////////////
function browsebarCreateDesignSetupButton ( target ) {
  var $page = $( '.PAGE' );

  $( '<li class="ITEM-browse HELPER-notSortable"></li>' )
    .appendTo( target )
    .append( 
      '<a class="EditDesign ITEM-browse Setup First STYLE-itemBrowseBorder">Setup design properties</a>'
    , '<span class="STICKER-setupIcon"></span>'
    , '<span class="STICKER-browseArrow ICON-greyArrowRight-mini STYLE-setupArrow"></span>'
    )//END APPEND
    ///////////////////////////
    // BIND BROWSEBAR EVENTS //
    ///////////////////////////
    .bind( 'click', { bifork: $page.data( 'styleable_item' ) }, function ( event ) {
      var $panel = $( '.GRID-panelBrowse' );

      $panel
        .dev_gadgetBrowse( 'getColumnInDom', 'styleable_setup' )
        .data( 'bifork', event.data.bifork )
        ;
      ////////////////////  
      // MOVE BROWSEBAR //
      ////////////////////  
      $panel.dev_gadgetBrowse( 'browseTo', 'styleable_setup', true );

    })//END BIND
    .data( 'bifork', $page.ios( 'GetZeroNodes' ).Item[ 0 ].ContainerList.Item[ 1 ] )//Get pages styleable
    ;
}//END BROWSEBARCREATEDESIGNSETUP

///////////////////////////
// CREATE LIST IN A LOOP //
///////////////////////////
function browsebarLoopTroughContainers ( loop, $target, fx ) {
  var iosc = browsebarGetIosc( $target , 'container' );
  
  for ( var container in loop ) if ( loop[ container ].self.is( ':visible' ) == true ) {
    
    var isItem = loop[ container ].type == 'item'
      , $styleableList = $( '<strong/>' ).text( loop[ container ].label )
      ;
    
    //////////////////////
    // CREATE LIST ITEM //
    //////////////////////
    var $listItem =
      $( '<a/>' )
        .appendTo( $target )
        .append( 
          isItem 
          ? $( '<strong/>' ).text( loop[ container ].label + ' ' +  loop[ container ].saveStyles[ 'z-index' ] )
          : $styleableList             
        )//END APPEND
        .addClass( 'ITEM-browse ' + ( isItem ? 'RelatedItem' : 'STYLE-itemBrowseBorder' ) )
        .wrap( '<li/>' )
        .closest( 'li' )
          .addClass( 'ITEM-browse ' + ( isItem ? 'ui-sortable-cancel' : '' ) )
          .bind( 'click', { bifork: loop[ container ] }, function ( event ) {
            
            $( '.GRID-panelBrowse' )
              .dev_gadgetBrowse( 'getColumnInDom', 'styleable_setup' )
              .data( 'bifork', event.data.bifork )
              ; 
          })//END BIND
          .data( 'bifork', loop[ container ] )
          .end()
          ;
      
    if ( ! isItem ) { 
      $styleableList
        .after(
          $( '<br/>' )
        , $( '<span/>' ).addClass( 'STYLE-itemBrowseText' ).text( loop[ container ].type + ' ' +  loop[ container ].saveStyles[ 'z-index' ] )
        , $( '<span/>' ).addClass( 'STICKER-browseArrow ICON-greyArrowRight-mini' ) 
        )
        .dev_gadgetRename({ 
          maxSigns: 28
        , save: function( event, ui ){ ui.element.closest( 'li' ).data( 'bifork' ).label = ui.newName; }
        , onStart: function( event, ui ){ ui.element.closest( 'menu' ).sortable( 'disable' ); }   
        , onStop: function( event, ui ){ ui.element.closest( 'menu' ).sortable( 'enable' ); }
        })
        .end()
        ;
    }//END IF 
    else { 
      //////////////////////////////////////////////////////
      // Removes border from previous list item           //
      // if current is a item and prev was something else //
      //////////////////////////////////////////////////////
      $listItem
        .parent()
          .prev()
            .find( 'a' )
              .removeClass( 'STYLE-itemBrowseBorder' ) 
              ;
    }//END ELSE
      
    if ( container == 0 && $( '.PAGE' ).ios( 'GetZeroNodes' ).Item.length !== 1 ) $listItem.addClass( 'First' );//First element becomes a shadow 
  }//END IF
      
  $target.find( '.RelatedItem' ).parent().show( 450 );//fade related item out together 


  /////////////////////////////////////////
  // MAKE LIST SORTABLE TO SETUP Z_INDEX //
  /////////////////////////////////////////
  $target.sortable({
    items: 'li:not(.HELPER-notSortable)'
  , placeholder: 'HELPER-browseSortablePlaceholder'
  , cancel: '.ui-sortable-cancel'
  , forcePlaceholderSize: true
  , forceHelperSize: true
  , axis: 'y'
  , helper: 'clone'
  , tolerance: 'pointer'
  
  ////////
  , start: function ( event, ui ) {
  ////////
      $target
        .find( '.RelatedItem' )
          .parent()
          .hide( 300 )
          .end()
        .end()
        .find( 'li:not(.HELPER-notSortable) a' )
          .addClass( 'STYLE-itemBrowseBorder' )
          ;

      ////////////////////////////////////////
      // SETUP SELECTED SORTABLE AS DRAGGED //
      ////////////////////////////////////////     
      ui.helper
        .css({ 'background': '#dce6f0', overflow: 'hidden' })
        .find( 'a' )
          .css({ 'color': '#323e49' })
          .removeClass( 'First' )
          .end()
        .find( 'span:first' )
          .css({ 'color': '#8a96a2' })
          .end()
        .find( 'span:last' )
          .remove()
          ;
    }//END START

  ///////
  , over: function ( event, ui ) {
  ///////////////////////////////////////////////////////////////////
      // MANAGEING THE SHADOW OF THE FIRST LIST ELEMENT WHILE DRAG //
      ///////////////////////////////////////////////////////////////
      $target
        .find( '.wasFirst' )
          .removeClass( 'wasFirst' )
          .addClass( 'First' )
          ; 

      if ( ui.item.find( 'a' ).is( '.First' ) ) ui.item.next().find( 'a' ).addClass( 'First' ); 
      if ( ui.placeholder.next().find( 'a' ).is( '.First' ) )  ui.placeholder.next().find( 'a' ).removeClass( 'First' ).addClass( 'wasFirst' );  

    }//END OVER

  ///////
  , stop: function ( event, ui ) { 
  ///////   
     browsebarSetZindex( $target );
     var sorted = browsebarSortedByZindex ( iosc ); 
   
     $target
       .find( 'li:not(.ITEM-browse:has(.Back,.Setup))' )
         .remove()
         ;
  
     browsebarLoopTroughContainers( sorted ,$target, true );//Create containers
    }//END STOP
  })//END SORTABLE
  ;

  //////////////////////////////////////////////////////////////////////////
  // HIGHLIGHT CONTAINER IN THE DOM WICH IS SELECTED IN LIST BY MOUSEOVER //
  //////////////////////////////////////////////////////////////////////////     
  $target
    .find( 'li.ITEM-browse:not(:first)' )
      .hover( 
        function () {  
          var $original =  $( this ).data( 'bifork' ).self
            , height = $original.outerHeight()
            , width = $original.outerWidth()
            ;
          ////////////////////
          // CREATE SQUARES //
          ////////////////////
          $( '<div/>' )
            .prependTo( $original )
              .addClass( 'FUNCTION-showmethecontainer' )
                .height( height )
                .width( width )
                ;
        }//END CALLBACK
      , function () { $( '.FUNCTION-showmethecontainer' ).remove(); }
    );//END HOVER

}//END BROWSEBARLOOPTROUGHCONTAINERS

////////////////////////////////////
// SORT CONTAINER LIST BY Z-INDEX //
////////////////////////////////////
function browsebarSortedByZindex ( list ) {
  
  var browsebarSortedByZindex = []
    , noZIndex = []//Saves all styleables/grids with an z-index at the position same as the z-index
    , items = {}//Stores all items at the position of the last styleable witch was not an item and last has a number as z-index ( only for styleable lists )
    , last = ''//Last styleable/grid (not item ) wich was looped 
    ;
  
  for ( styleable in list ) {
    var zindex = list[ styleable ].saveStyles[ 'z-index' ] || list[ styleable ].zIndex;//Find z-index if exists 
    
    if ( list[ styleable ].type == 'item' && last != 'noZIndex' ) items[ last ].push( list[ styleable ] ); //If current is an item and last has a namber as z-index
    else if ( list[ styleable ].type == 'item' ) noZIndex.push( list[ styleable ] );//If current is an item and last has auto as z-index
    //////////////////////////////////////////////////
    // IF IT IS AN STYLEABLE WITH Z-INDEX AS NUMBER //
    //////////////////////////////////////////////////
    else if ( zindex && zindex != 'auto' ) {
     browsebarSortedByZindex[ zindex ] = list[ styleable ];//Create list of styeables with z-index
     last = zindex;//Save last 
     items[ last ] = [];//create storage for possible foloming items wich are related to the current styleable
    }//END ELSE IF 
    /////////////////////////////////////////////
    // IF IT IS AN STYLEABLE WITH Z-INDEX AUTO //
    /////////////////////////////////////////////
    else { 
      last = 'noZIndex';//Mark last as styleable with z-index auto
      noZIndex.push( list[ styleable ] );//Push current in the list 
    }//END IF/ELSE IF/ELSE
  }//END LOOP
  ////////////////////////////////////////////////////////////////////////////////////
  // LOOP TROUGH ITEM OBJ AND MERGE ITEMS AT THE RIGHT POSITION IN SORTED BY ZINDEX //
  //////////////////////////////////////////////////////////////////////////////////// 
  for ( var item in items ) for ( var i = 0; items[ item ].length > i;  i++ ) {
    browsebarSortedByZindex.splice(item -1, 0, items[ item ][ i ] );//Items where added before and in the wrong order because they the later reverse! 
  };//END LOOP

  browsebarSortedByZindex = browsebarSortedByZindex.reverse();//styeable with the heighst z-index at the beginning of the list 
  $.merge( browsebarSortedByZindex, noZIndex );//no z-index beneath
  return browsebarSortedByZindex;
}//END BROWSEBARSORTEDBYZINDEX

////////////////
// SET ZINDEX //
////////////////
function browsebarSetZindex ( $target ) {
  var $styleables = $target.find( 'li:not(.HELPER-notSortable,.ui-sortable-cancel)' )//exclute related container & bacbutton 
    , count = $styleables.length
    ;
  ////////////////////////////
  // LOOPS THROUGH THE LIST //
  ////////////////////////////
  $styleables.each( function () {
    var $this = $( this )
      , data = $this.data( 'bifork' )
      ;
      
    count--;//Count down
    data.parent.styleable( 'setSaveStyles', data.self, { 'z-index': count } );//Set new value  
  });//END EACH
}//END LOOP


//////////////////////
// CREATE GRID LIST //
//////////////////////
function browsebarGridList ( event, ui ) {
  $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'delegateMove', 'grid_list', 'li:not(.HELPER-notSortable)', 'container_list' );//Setup click events again if grid list has shown container list of root   
  var iosc = browsebarGetIosc( ui.target , 'grid');
  
  //////////////////////////    
  // REMOVE EXISTING LIST //
  //////////////////////////    
  ui.target
    .find('li:not(.ITEM-browse:has(.Back))')
      .remove()
      .end()
      ;
  
  ////////////////////////////////
  // CREATE DESIGN SETUP BUTTON //
  ////////////////////////////////
  browsebarCreateDesignSetupButton( ui.target );
  
  ///////////////////////////
  // CREATE LIST IN A LOOP //
  ///////////////////////////
  if ( iosc.length > 1 ) for ( var grid in iosc ) {
    var containerExist = $( '#' + iosc[ grid ].Ident ).styleable( 'styleablesList' ).length != 0; 

    //////////////////////
    // CREATE LIST ITEM //
    //////////////////////
    var $listItem = 
        $( '<a/>' )
          .addClass( 'ITEM-browse STYLE-itemBrowseBorder' )
          .append( 
            $( '<strong/>' ).text( iosc[ grid ].Label )
          , $( '<br/>' ) 
          , $( '<span/>' ).addClass( 'STYLE-itemBrowseText' ).text( 'Fix Grids Height' )
          )//END APPEND
          .appendTo( ui.target )
          .wrap( '<li/>' )
          .closest( 'li' )
            .addClass( 'ITEM-browse HELPER-browseDontMove' )
            .bind( 'click', { bifork: iosc[ grid ] }, function ( event ) {
              ////////////////////
              // MOVE BROWSEBAR //
              ////////////////////
              $( '.GRID-panelBrowse' )
                .dev_gadgetBrowse( 'getColumnInDom', 'container_list' )
                .data( 'bifork', event.data.bifork )
                ;   
            })//END BIND
            .data( 'bifork', iosc[ grid ] )
            .end()
          .find( 'strong' )
            .dev_gadgetRename({ 
              maxSigns: 28
            , save: function ( event, ui ){ ui.element.closest( 'li' ).data( 'bifork' ).Label = ui.newName; }
            , onStart: function ( event, ui ) { ui.element.closest( 'menu' ).sortable( 'disable' ); }  
            , onStop: function ( event, ui ){ ui.element.closest( 'menu' ).sortable( 'enable' ); }
          })
          ;      
          
    ///////////////////////////////////////////////////////////
    // SETUPS BROWSE TO CONTAINER LIST IF GRID HAS CONTAINER //
    ///////////////////////////////////////////////////////////                    
    if ( containerExist ) { 
      $listItem
        .append( '<span class="STICKER-browseArrow ICON-greyArrowRight-mini"></span>' )
        .closest( 'li' )
          .removeClass( 'HELPER-browseDontMove' )
          ;
    }//END IF
  
  }//END LOOP

  ///////////////////////////////////////
  // CREATE SORTABLES TO SETUP Z-INDEX //
  ///////////////////////////////////////
  var $sortable =  ui.target.find( 'li.ITEM-browse:not(:first)' );// get sortables 
    ui.target 
      .sortable({
        items: 'li:not(.HELPER-notSortable)'
      , placeholder: 'HELPER-browseSortablePlaceholder'
      , cancel: '.HELPER-notSortable'
      , forcePlaceholderSize: true
      , forceHelperSize: true
      , axis: 'y'
      , helper: 'clone'
      , delay: 0
      
      ////////
      , start: function ( event, ui ) {
      //////////////////////////////////////////
        // SETUP SELECTED SORTABLE AS DRAGGED //
        ////////////////////////////////////////            
        ui.helper
          .css({ 'background-color': '#dce6f0', 'overflow': 'hidden' })
          .find( 'a' )
            .css( 'color', '#323e49' )
            .end()
          .find( 'span:first' )
            .css( 'color', '#8a96a2' )
            .end()
          .find( '.STICKER-browseArrow' )
            .css( 'display', 'none' )
            .end()
          .find( 'strong' )
            .removeClass( 'FUNCTION-rename' )//If renameing runs
            ;
        }//END START
    
      ///////
      , stop: function ( event, ui ) {
      ///////
        var $sortables = ui.target.find( 'li.ITEM-browse:not(:first)' )
          , count = $sortables.length
          ;
        ///////////////////////////////////////////////////
        // BRINGS BACK THE RESIZER TO FRONT SO ELSE THEY //
        // WHERE OVERLAYED AND NOT USABLE                //
        ///////////////////////////////////////////////////
        $( 'body' ).find( '.ui-resizable-handle' ).css( 'z-index', count + 1 );
        ////////////////////////////
        // LOOPS THROUGH THE LIST //
        ////////////////////////////
        $sortables.each( function( i ) {
          var $this = $( this )
            , iosc = $this.data('bifork')
            , id = iosc.Ident
            ;
        //////////////////////////////////////////
        // SET Z-INDEX IN BIFORK-OBJ AND IN DOM //
        //////////////////////////////////////////
        $( '#' + id ).css( 'z-index', count );
        iosc.zIndex = count;
        count--;//Count 
      });//END LOOP  
    }// END STOP
  });// END SORTABLES
  
  /////////////////////////////////////////////////////////////////////
  // HIGHLIGHT GRID IN THE DOM WICH IS SELECTED IN LIST BY MOUSEOVER //
  /////////////////////////////////////////////////////////////////////       
  $sortable
    .hover( 
      function () {
        var id = $( this ).data( 'bifork' ).Ident
          , $grid = $( '#' + id )
          , height = $grid.outerHeight()
          , width = $grid.outerWidth()
          ;
        
        $( '<div/>' )
          .prependTo( $grid )
            .addClass( 'FUNCTION-showmethegrid' )
            .height( height)
            .width( width )
            ;
       }
     , function () { $( '.FUNCTION-showmethegrid' ).remove(); }
     )//END HOVER
     ;
}//END BROWSEBARGRIDLIST

///////////////////////////
// CREATE CONTAINER LIST //
///////////////////////////
function browsebarContainerList ( event, ui ) {
  ///////////////////////////
  // SETUP SOURCE FOR LIST // 
  ///////////////////////////
  var iosc = browsebarGetIosc( ui.target , 'container')
    , $page = $( '.PAGE' )
    ;

  if ( $page.ios('GetZeroNodes').Item.length == 1 ) $( '.GRID-panelBrowse' ).dev_gadgetBrowse( 'delegateMove', 'grid_list', 'li:not(.HELPER-notSortable)', 'styleable_setup' );//Update target of the list items in the browsebar  
  
  //////////////////////////    
  // REMOVE EXISTING LIST //
  //////////////////////////
  ui.target
    .find('li:has(.Back)')
      .addClass('HELPER-notSortable')
      .end()
    .find( 'li:not(.ITEM-browse:has(.Back))' )
      .remove()
      ;

  if ( $page.ios('GetZeroNodes').Item.length == 1 ) browsebarCreateDesignSetupButton( ui.target );// CREATE DESIGN SETUP BUTTON
  
  browsebarLoopTroughContainers( browsebarSortedByZindex( iosc ), ui.target  );//Create containers
  browsebarSetZindex( ui.target );//Set z-index for all container in the list
}//END BROWSEBARCONTAINERLIST

////////////////////////////////////////////////
// REPLACE HTML FORMS WITH NICER GADGET FORMS //
//////////////////////////////////////////////// 
function browsebarMakeNicerForms ( object, $styleable, data  ) {
    /////////////////////////////////////////
    // CREATED TRIGGER FOR BIFORK UPDATES  //
    /////////////////////////////////////////
    function newValue ( $element, newAttribute ) {
      var newValue = {}
        , name = $element.attr( 'name' )
        , $syncFields = $( '[name="' + name + '"]' )
        , cleanName = name.replace( /\d/g,'' )//Remove numbers! It's nessasary because if a style is twice in one browsebar it is defined with a number background-color01
        ;
        
        newValue[ cleanName ] = ''; 
        
        if ( $syncFields.length  ) { 
          $syncFields.each( function ( i ) { 
            var val = $( this ).data( 'value' ) || $( this ).val();
            newValue[ cleanName ] = newValue[ cleanName ] + val + ( i !== ( $syncFields.length -1 ) ? ' ' : '' ); 
          });//END EACH
        }//END IF
        
        data.parent.styleable( 'setStyles', $styleable , newValue );
    }//END NEWVALUE
        
    /////////////////////
    // APPENDS GADGETS //
    ///////////////////// 
    $( object )
      .find( 'select, button, input:not([type=hidden])' )
        //////
        .each( function( e ) {
        //////  
          var $form = $( this );
          
          /////////////////
          // COLOR FIELD //
          /////////////////
          if ( $form.is( '.FORM-input-color' ) ) { 
            $form.dev_gadgetForm({ 
              special: 'color'
            , change: function ( event, ui ) { 
              
                newValue( ui.element, ui.newValue );  
                helperEmtyPageDesign(); 
              
              }//END CHANGE
            , colorPicker: function ( event, ui ) { 
                alert( 'Move to Colorpicker' )
              } 
            });//END FORM COLOR
          }//END IF
          
          /////////////
          // STEPPER //
          /////////////
          else if ( $form.is('.FORM-input-stepper') ) {
            $form.dev_gadgetForm({ 
              special: 'stepper'
            , change: function( event, ui ) { 
                newValue(ui.element, ui.newValue); 
                helperEmtyPageDesign();  
              }//END CHANGE 
            });//END FORM STEPPER
          }//END ELSE IF
          
          ////////////////
          // FILEUPLOAD //
          ////////////////
          else if ( $form.is( '.FORM-input-file' ) ){
            $form.dev_gadgetForm({ 
              rapeClass: false
            , action: function ( event, ui ) { 
                var $dropZone = ui.nicer.closest( '.FORM-item' ).addClass( 'STYLE-browse-alignLeft STYLE-form-item-file' );
                //////////
                var upload = helperUpload(  
                //////////  
                  ui.nicer
                , $( '.GRID-panelEdit' )
                , { dropZone: $dropZone
                  , fileInput: ui.element
                  , url: '/upload'
                  , dataType: 'json'
                  , multipart: true
                  , singleFileUploads: true
                  , formData: [ 
                      { name: 'projectId', value: URL.address[ URL.address.length - 2 ] }
                    , { name: 'addedBy', value: 'Tobi' }
                    , { name: 'usedIn', value: URL.address[ URL.address.length - 1 ]  }
                    , { name: 'usageAs', value: 'bg' }
                    , { name: 'fileId', value: data.storage[ $form.data( 'name' ) ] != undefined ? data.storage[ $form.data( 'name' ) ].fileId : 'x' }
                    ]//END FORMDATA
                  , done: function ( e, respond ) {
                      
                      var formData = $( this ).data( 'fileupload' ).options.formData;
                      data.parent.styleable( 'setStyles', $styleable ,  { 'background-image': 'url(/image/' + URL.address[ URL.address.length - 2 ] + '/' + respond.result.fileId + ')' } );
                      data.storage[ $form.data( 'name' ) ] = respond.result;
                      $( this )
                        .parent()
                          .next()
                            .bgImageStatus( 'option', 'fileObj', respond.result )
                            ;
                      ///////////////////////////////////////
                      // UPDATE FILEID IN UPLOADS FORMDATA //
                      ///////////////////////////////////////      
                      formData.pop();
                      formData.push({ name: 'fileId', value:  respond.result.fileId });     
              
                    }//END DONE
                  }//END OPTIONS
                  , true
                ); //END HELPERUPLOAD
                
                //////////////////
                var $bgImageStatus =
                ////////////////// 
                  $( '<div/>' )
                    .addClass( 'FORM-item HELPER-browsebarFileStatus STYLE-NoPadding STYLE-form-item-file' )
                    .insertAfter( $dropZone )
                    .bgImageStatus( { 
                      $dropZone: $dropZone
                    , $styleable: $styleable
                    , fileObj: data.storage[ $form.data( 'name' ) ]
                    , remove: function ( event, ui ) { 
                        ////////////////////////////////////////////////////
                        // UPDATE FILEID IN UPLOADS FORMDATA AS UNDEFINED //
                        ////////////////////////////////////////////////////
                        var formData = ui.$dropZone.find( 'a.FORM-fileupload' ).data( 'fileupload' ).options.formData;
                        formData.pop();
                        formData.push({ name: 'fileId', value: 'x' });
                        
                        //////////////////////////////////
                        // REMOVE FILE ALSO IN DATABASE //
                        //////////////////////////////////   
                        $.ajax({
                          url: '/removefile'
                        , dataType: 'json'
                        , data: { projectId: URL.address[ URL.address.length - 2 ], fileId: ui.fileObj.fileId }
                        , success: function ( removed ) {
                            ////////////////////////////////////////////
                            // SET BACKGROUND-IMAGE TO NONE           //
                            // AND REMOVE IMAGE OBJECT FROM STYLEABLE //
                            ////////////////////////////////////////////
                            data.parent.styleable( 'setStyles', $styleable,  { 'background-image': 'none' } );
                            delete $styleable.data( 'styleable_item' ).storage[ $form.data( 'name' ) ];
                            ui.element.bgImageStatus( 'option', 'fileObj', {} );
                          }//END SUCCESS
                        })//END $.AJAX
                        ;
                      }//END REMOVE 
                    })//END BGIMAGESTATUS
                    ;
                 }//END ACTION
              });//END FORM
          }//END ELSE IF
          
          /////////////////
          // SIMPLE FORM //
          /////////////////
          else { 
            $form.dev_gadgetForm({ 
              change: function ( event, ui ){ 
                newValue( ui.element,  ui.newValue );
                helperEmtyPageDesign(); 
              }//END CHANGE
            })//END GADGETFORM
            ;
          }//END ELSE 
    });//END EACH
}//END BROWSEBARMAKENICERFORM

//////////////////////////////////////////////////////////////////
// ASK IF THE TASK IS ON THE EXCLUDE LIST FOR CURRENT CSS-STYLE //
//////////////////////////////////////////////////////////////////
function browsebarCssStyleHedge ( task, array ) {
  if ( $.isArray( array ) ) return $.inArray( task, array ); 
  else return -1; 
}//END BROWSEBARCSSSTYLEHEDGE

function browsebarAdjustColumns ( $row ) { 
  if ( $row.find( 'input[type=file]' ).length ) return; //Ignore fileuploads 
  var $items = 
    $row
      .find( '.FORM-item:not(.HELPER-browsebarFileStatus)' )
      .not( ':last' )
        .css( 'margin-right', 6 )
        .end() 
        ;
   
  $items
    .parent()
      .each( function ( i ) { 
        var newWidth = ( 216 - ( $items.length * 6 - 6 ) ) / $items.length + ( i != $items.length - 1 ?  6 : 0 );
        $( this ).width( helperIsOdd( i ) ? Math.ceil( newWidth ) : Math.floor( newWidth ) );
      })//END EACH
      ; 
}//END BROWSEBARADJUSTCOLUMNS 

function browsebarRemoveContent ( $current ) {
  $current
    .find( 'li:not(.ITEM-browse:has(.Back) ):not(.ITEM-browse:has(.BUTTON-addFlatMaxi) )' )
    .remove()
    .end()
    ;   
}//BROWSEBARREMOVECONTENT
  
function browsebarSetBackground ( $browsebar, style ) {
  if ( style == 'panel' ) $browsebar.closest( '.CONTAINER-browse' ).removeClass( 'UI-CONTAINER-option' ).addClass( 'UI-CONTAINER-panel' );
  else if ( 'option' ) $browsebar.closest( '.CONTAINER-browse' ).removeClass( 'UI-CONTAINER-panel' ).addClass( 'UI-CONTAINER-option' ); 
}//BROWSEBARSETBACKGROUND
