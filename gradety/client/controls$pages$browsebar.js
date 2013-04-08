function getPageBrowseObj () {
  return {  
    start: 0
  , move:216
  , controls: {
      style:'panel'
    , back: false
    , moveOnClick: true
    , items:'li.ITEM-browse'
    , onHight:function ( event, ui ) {}
    , onShow: function ( event, ui ) {
        $( '<div class="CONTAINER-toolbar"></menu></div>' )
                .appendTo(ui.target)
                .dev_gadgetMenu({
                    type:'toolbar'
                    ,selectable: 'single'
                    
                    , 'button.Files':{ 
                        addClass: '' 
                        ,action: function(event, ui){ 
                            ui.button.bind('click', function(){ 


                            });//END BIND CLICK
                        }//END ACTION
                    }// END FILES
                    
                    ,'button.Apps': {  
                        addClass: ''
                        ,action: function(event, ui){ 
                            ui.button.bind('click', function(){ 

                            });//END APPS
                        }//END BIND CLICK
                    }//END APPS
                });
            
            
            }//END CONTROLS 
        }//END TEXT STYLE LIST
    }// END RETURN OBJ   
}//END DESIGNBROWSE        