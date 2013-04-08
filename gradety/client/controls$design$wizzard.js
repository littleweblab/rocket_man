function createdesign$wizzard ( opt ) {   
  return {
    ///////////////
    _wizzardValues: [ 'name', 'position', 'width', 'height' ]//List of wizzard values 
    ///////////////
    
    ///////////////
    , _wizzardDone: 
    ///////////////  
        function () {
          var wizzardValues = createdesign$wizzard( '_wizzardValues' )//Get wizzards must have values
            , saveData = createdesign$wizzard( '_wizzardData' )()//Get wizzard date 
            ;
        
          for ( var name in wizzardValues ) if ( ! saveData[ wizzardValues[ name ] ] ) return wizzardValues[ name ];//Returns fase if loop finds a undefined value
          return true;//Return true if every wizzard value is filled
    }//END WIZZARDDONE
    
    /////////////////
    , _wizzardChange: 
    /////////////////    
        function( toShow ) {
          var $position = $( '.CONTAINER-stageWizard-' + toShow )
            , $stage = $( '.STAGE' )
            ;
         // $stage.css({ 'overflow': 'visible', 'height':3000 });//Prevents scrollbars on animation 
               
          /////////////////////////
          // CHANGE WIZZARD STEP //
          /////////////////////////       
          $position
            .insertAfter( '.CONTAINER-breadcrump' )//Prepare next step for animation 
          ///////////////////////////////
          // HIDE CURRENT WIZZARD STEP //
          ///////////////////////////////    
          .next()
            .css({ top: $( '.CONTAINER-stageWizard-' + toShow ).height() * - 1 }) 
            .delay( 10 )
            .animate({ 
                top: 0 
              , opacity: 0 }
              , 200
              , function () { 
                  $( this ).css({ 'display': 'none' });//Hide old step   
                //  $stage.css({ 'overflow': 'auto', 'height': 'auto' });//Enable scrollbars again           
              }//END FUNCTION
            )//END ANIMATE
            .end()
            ////////////////////////////
            // SHOW NEXT WIZZARD STEP //
            ////////////////////////////    
            .css({
              display: 'block'
            , opacity: 0
            , top: $( '.CONTAINER-stageWizard-' + toShow ).height() * - 1 
            })
            .animate({
              top: [ 0, 'easeOutBack' ]
            , opacity: [ 10, 'easeInOutQuad' ] }
            , 300 
            );//END ANIMATE
        }//END WIZZARDCHANGE
    
    ///////////////
    , _wizzardData: 
    ///////////////  
        function () {
          if ( ! $( 'body' ).data( 'wizzard' ) ) $( 'body' ).data( 'wizzard', {} );//Create data storage if it still doesn't exist
          return $( 'body' ).data( 'wizzard' );//Return data storage
        }//END WIZZARDDATA

    ///////////////
    , _wizzardNext:
    /////////////// 
        function ( next ) { 
          var saveData = createdesign$wizzard( '_wizzardData' )()
            , $headline = $( '.CONTAINER-stageWizard-create h2' )
            , wizzardValues =  createdesign$wizzard( '_wizzardValues' )
            ;
        
          var wizzardDone = createdesign$wizzard( '_wizzardDone' )()
            , next = ( wizzardDone == 'width' || wizzardDone == 'height' ) ? 'dimension' : wizzardDone; //Height and with have not the same name as their step (dimension)
         
          ////////////////////////////////////////
          // TAKE THE NEXT UNDEFINED VALUE/STEP //
          ////////////////////////////////////////
          if ( wizzardDone !== true ) {
          
            $( '.FUNCTION-breadcrump a' )
              .filter( function() { return $( this ).text().toLowerCase() == next; })
              .trigger( 'click' )
              ;
          ///////////////
          // LAST STEP //
          ///////////////
          } else {
            $( '.ITEM-breadcrump-selected ').removeClass( 'ITEM-breadcrump-selected' );//Remove selected from breadcrump
            $headline.html( '' );//Clean up old results in create design steps headine
            for ( var name in wizzardValues ) $headline.append( ' <span>' + wizzardValues[ name ] + ': </span>' + saveData[ wizzardValues[ name ] ] + '<br/>' );//List results
            createdesign$wizzard( '_wizzardChange' )( 'create' );//Change step to create 
          }//END IF/ELSE     
      }//END WIZZARDNEXT
    
    //////////
    , menuBar: { dev_gadgetMenu: getMenubarObj() }
    //////////
    
    /////////////
    , breadcrump: {
    /////////////
        dev_gadgetMenu: {
            type: 'breadcrump'
          , selectable: 'single'
          , 'button.Name': {  
              selected: true
            , action: function ( event, ui ) { 
                ui.button.bind( 'click', function () { 
                createdesign$wizzard('_wizzardChange')( 'name' )
                
                });//END BIND
            }//END ACTION
          }//END BUTTON NAME
          , 'button.Position': {  
              action: function ( event, ui ) { 
                ui.button.bind( 'click', function () { 
                  createdesign$wizzard('_wizzardChange')( 'position' )
                 
                });//END BIND
              }//END ACTION
          }//END BUTTON POSITION
          , 'button.Dimension': {  
              action: function( event, ui ) { 
                ui.button.bind( 'click', function () {
                  createdesign$wizzard('_wizzardChange')( 'dimension' )
                 
                });//END BIND
              }//END ACTION
          }//END BUTTON SIZE
          , 'button.Cancel': {
              html: '<span class="ICON-cancel-mini STICKER-breadcrump-last"></span>Cancel'
            , selectable: 'none'
            , action: function( event, ui ) { 
                ui.button.bind( 'click', function () { 
                  window.location = '/design/' + URL.address[ 0 ];
                });//END BIND
            }//END ACTION
          }//END BUTTON CANCEL
        }//END GADGETMENU
    }//END BREADCRUMP
        
    ///////
    , form: {
    ///////    
        dev_gadgetForm: {
          rapeClass: true
        , arrowSize: 'large'
        , special: undefined
        , change: function ( event, ui ) { 
            var saveData = createdesign$wizzard( '_wizzardData' )()
              , name = ui.element.attr( 'name' )
              , isDimension = ui.element.closest( '.CONTAINER-stageWizard-dimension' ).length; 

            if ( name != 'next' ) saveData[ name ] = ui.newValue;//Save value to wizzarddata   
            //////////////////////////////////////
            // IF FORM ELEMENT IS A NEXT BUTTON //
            //////////////////////////////////////
            if ( name == 'next' ) { 
              if ( ! saveData.width && isDimension ) saveData.width = '1024px';//Special for dimension if value isn't changed by user
              if ( ! saveData.height && isDimension ) saveData.height = '768px';//Special for dimension if value isn't changed by user
              createdesign$wizzard( '_wizzardNext' )();
            }//END IF
            
            if ( name == 'create' ) {
              var data = { 
                type: 'design$wizzard$save'
              , data: JSON.stringify( [  
                  URL.address[ 0 ]
                , saveData.name
                , saveData.position
                , ( saveData.position == 'left'  ||  saveData.position == 'stretch' ? '15px' : 'auto' )
                , ( saveData.position == 'right' ||  saveData.position == 'stretch' ? '15px' : 'auto' )
                , saveData.width
                , saveData.height 
                ] )
              }//END CALLSCRIPT
             
              var answer = $.ajax({
                  url: '/design/ajax'
                , type: 'GET'
                , async: false
                , cache: false
                , timeout: 30000
                , data: data
                , error: function ( err ) { alert( 'error' ); }
                , success: function ( newDesignId ) { 
                    top.location.href= '/design/draw/' + URL.address[ 0 ] + '/'+  newDesignId;// to the new design redirection
                }//END SUCCESS
              }).responseText//END ANSWER
            }//END IF 
        }//END CHANGE
      }//END GADGETFORM 
    }//END FORM
    
    /////////  
    , choose: {
    /////////  
        ///////////////////////////////////////////
        // BIND FOR CHOOSE PAGE POSITION BUTTONS //
        ///////////////////////////////////////////
        bind: {
          'click': function ( event ) { 
            var $this = $( this )
              , name = $this.attr('name')//Get name of the position to save
              , saveData = createdesign$wizzard( '_wizzardData' )()//Get wizzards data storage
              ,  stretchWidth = '100%'
              , $width = $( 'input[name$="width"]' )
              ;
              
            $( '.UI-BUTTON-choose-selected' ).removeClass( 'UI-BUTTON-choose-selected' );//Remove last selected position
            $this.addClass( 'UI-BUTTON-choose-selected' );//Mark clicked choosen as selected
             
            /////////////////////////////
            // HANDLE POSITION STRETCH //
            /////////////////////////////   
            if ( name == 'stretch'  ) {
               saveData.width = stretchWidth;//Set width to 100%
               
               $width.val( stretchWidth )
                 .css( 'display', 'none' )
                 .prev()
                   .css( 'display', 'none' )//Hide width label  
                   .end()
                 .next()
                   .css( 'display', 'none' )//Hide width nicerForm  
                   ;
            } else if ( $width.val() == '100%' &&  name !== 'stretch' &&  saveData.position == "stretch"   ) {
               delete saveData.width;//Remove width
               
               $width
                 .val( stretchWidth )
                 .prev()
                   .css( 'display', 'block' )//Hide width label  
                   .end()
                 .next()
                   .css( 'display',  'block' )//Hide width nicerForm  
                   ;
            }//END IF
            
            saveData.position = name;//Save position
            createdesign$wizzard( '_wizzardNext' )()//Go on to next step
          }//END CLICK
        }//END BIND 
    }//END CHHOSE
        
    /////
    , ui: { dev_gadgetLayout: { show: [ 'menu', 'edit', 'stage' ] } }
    /////
  }[ opt ]
  ;   
}
;