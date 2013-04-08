function getMenubarObj () {
  var URL = helperExamineUrl()
  return {
      type: 'menubar'
    , selectable: 'single'
    , 'button.Dashboard': {  
        selected: ( URL.mode == 'dashboard' || URL.mode == 'dashboard' || URL.mode == 'dashboard' ) ? true : false 
      , action: function ( event, ui ) { 
          ui.button.bind( 'click', function () {
            window.location = '/dashboard/' + URL.address[ 0 ];
          });//END BIND
      }//END ACTION
    }//END BUTTON HIDE GRID
    , 'button.Account': {  
        extraStyles: 'STYLE-menubarAccount'
      , selected: ( URL.mode == 'account' || URL.mode == 'account' || URL.mode == 'account' ) ? true : false 
      , action: function ( event, ui ) { 
          ui.button.bind( 'click', function () {
            window.location = '/account/' + URL.address[ 0 ];
          });//END BIND
      }//END ACTION
    }//END BUTTON HIDE GRID
    , 'button.Designs': {
        selected: ( URL.mode == 'design' || URL.mode == 'design$draw' || URL.mode == 'design$wizzard' ) ? true : false 
      , action: function ( event, ui ) { 
          ui.button.bind( 'click', function () {
            window.location = '/design/' + URL.address[ 0 ];
          });//END BIND
      }//END ACTION
    }//END BUTTON HIDE GRID
    , 'button.Pages': {  
        selected: ( URL.mode == 'pages' || URL.mode == 'pages' || URL.mode == 'pages' ) ? true : false 
      , action: function ( event, ui ) { 
          ui.button.bind( 'click', function () {
             window.location = '/pages/' + URL.address[ 0 ] ;
          });//END BIND
      }//END ACTION
    }//END BUTTON HIDE GRID
    , 'button.Files': {  
        extraStyles:'STYLE-menubarFiles'
      , selected: ( URL.mode == 'files' || URL.mode == 'files' || URL.mode == 'files' ) ? true : false 
      , action: function ( event, ui ) { 
          ui.button.bind( 'click', function () {
            window.location = '/files/' + URL.address[ 0 ];
          });//END BIND
      }//END ACTION
    }//END BUTTON HIDE GRID
    , 'button.Settings': {  
        selected: ( URL.mode == 'settings' || URL.mode == 'settings' || URL.mode == 'settings' ) ? true : false 
      , action: function ( event, ui ) { 
          ui.button.bind( 'click', function () {
            window.location = '/setting/' +  URL.address[ 0 ];
          });//END BIND
      }//END ACTION
    }//END BUTTON HIDE GRID
  }//END DEV_GADGETMENUBAR
}//END GETMENUBAROBJ