function controls$design$draw$item ( opt ) {   
  return {
    dev_gadgetFocus: {
      selectable: '.menuItem'
    , size: 'small' 
    , activate: function ( event, ui ) { 
        createdesign$draw( '_focusStop' )( ui );
      
      }//END ACTIVATE
    , deactivate: function ( event, ui ) {
        createdesign$draw( '_focusStop' )( ui );
      }//END DEACTIVATE
    }//END DEV FOCUS
  
  }[ opt ]
  ;
}
;