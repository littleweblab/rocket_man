function createpeople(self, myobj, id){   
        
    var people=  {
         
         patterns:{ 
             dev_gadgetPatterns:{
                   selection: function(event,ui){ }
                    ,createNewItem: function(event,ui){ alert('new Item')}
                    ,createNewPattern: function(event,ui){ alert('new Pattern')}
                    ,draggable: true
                    ,droppable: true
                    ,draggableOpts: {
                        zIndex: 10050
                        ,revert: true
                        ,revertDuration: 100
                        ,opacity: 0.7
                        ,scroll: false
                        ,containment: 'body'
                    }
                    ,droppableOpts:{

                         accept: 'li.ITEM-patterns'
                        ,activeClass: 'CONTAINER-dropzone-active'
                        ,hoverClass: 'CONTAINER-dropzone-hover'
                        ,drop: function(event, ui){ 
                             var pattern =  $(this).find('strong').text()
                             $('.CONTAINER-patterns').dev_gadgetPatterns('createNewItem', ui.draggable, pattern );
                             ui.draggable.remove();

                        }
                    }
            } 
         }
        
         /////////
         // UI  //
         /////////

             ,ui: { 

                 dev_gadgetLayout:{ show: ['menu','browse','toolbar','help','setup'] }
                 ,dev_gadgetModes:{

                     start:'People'
                     , design:function(){ window.location.replace('/design/draw/'+ window.location.pathname.split('/').pop());}
                     , edit:function(){ window.location.replace('/edit/'+ window.location.pathname.split('/').pop());}
                     , people:function(){ window.location.replace('/people/'+ window.location.pathname.split('/').pop());}
                     , translate:function(){ window.location.replace('/translate/'+ window.location.pathname.split('/').pop());}


                 }//END GADGET MODES
             }
        
         ,container:{
             dev_gadgetRules: {
                 editable: function(event,ui){console.log('editable', ui)}
                ,readonly: function(event,ui){alert('readonly')}
            }
            
             
             
             
         }
      
    }
        
    $.extend(true, $('body').data('controls_save')[id] = {} , { people: people }); 
}



