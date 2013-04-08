function createtranslate( self, myobj, id )
{   
    var save = $('body').data('controls_save')[id] = { translate:{} };

    //////////
    // SAVE //     
    //////////

    save._func = {
        obj: myobj
    }; // FUNC END

////////////
// DESIGN //     
////////////   

    var translate = {
        tank:{ 
            dev_gadgetTank:{ disabled: false }
        }


/////////
// UI  //
/////////
        ,ui: { 

            dev_gadgetLayout:{ show: ['menu','browse','toolbar','setup'] }
            ,dev_gadgetModes:{

                start:'Translate'
                , design:function(){ window.location.replace('/design/draw/'+ window.location.pathname.split('/').pop());}
                , edit:function(){ window.location.replace('/edit/'+ window.location.pathname.split('/').pop());}
                , people:function(){ window.location.replace('/people/'+ window.location.pathname.split('/').pop());}
                , translate:function(){ window.location.replace('/translate/'+ window.location.pathname.split('/').pop());}
            }//END GADGET MODES
        }    
        ,container:{}
        ,grid:{}
        ,sticker:{}

    };//END EDIT

//////////////////////////////////////////////////////////////////////////////
// MERGE SAVE & DESIGN TO ONE DATASTORE AND SAVE IT IN BODY AS DATA ELEMENT //
//////////////////////////////////////////////////////////////////////////////        

    $.extend(true,$('body').data('controls_save')[id]['translate'], translate );  
}