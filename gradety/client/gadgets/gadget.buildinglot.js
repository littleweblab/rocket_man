function GOGOdirection(event, element)
{
    var $this = element
    var pos = $this.offset();
    var dimension ={};
    var exit;

    dimension.top =  Math.abs((event.pageY - pos.top)) 
    dimension.right = Math.abs((event.pageX - (pos.left + $this.width()) ))
    dimension.bottom = Math.abs((event.pageY - (pos.top + $this.height())  ))
    dimension.left = Math.abs((event.pageX - pos.left))
    var exit = Math.min( Math.min(dimension.top, dimension.bottom) , Math.min( dimension.left, dimension.right  )) 
    

    for(i in dimension)
    {
        if( dimension[i] == exit)
        {
            exit = i 
        }
    }
    
  //  console.log(exit, dimension)
    return exit
}


$leaveLeft = jQuery.event.special.leaveLeft = {
    setup: function( data, namespaces )
    {
        jQuery.event.add(this, 'mouseleave', $leaveLeft.handler );
        return false; 
    },

    teardown: function(namespaces) {
        jQuery.event.remove(this, 'mouseleave',  $leaveLeft.handler);
        return false;
    },
    
    handler: function(event) {
        var $element = jQuery(this);
        temp = GOGOdirection(event, $element )
        if( temp == 'left')
        {
            $element.triggerHandler('leaveLeft')
        }
    }
};

$leaveRight = jQuery.event.special.leaveRight = {
    setup: function( data, namespaces )
    {
        jQuery.event.add(this, 'mouseleave', $leaveRight.handler );
        return false; 
    },

    teardown: function(namespaces) {
        jQuery.event.remove(this, 'mouseleave',  $leaveRight.handler);
        return false;
    },
    
    handler: function(event) {
        var $element = jQuery(this);
        temp = GOGOdirection(event, $element )
        if( temp == 'right')
        {
            $element.triggerHandler('leaveRight')
        }
    }
};

$leaveTop = jQuery.event.special.leaveTop = {
    setup: function( data, namespaces )
    {
        jQuery.event.add(this, 'mouseleave', $leaveTop.handler );
        return false; 
    },

    teardown: function(namespaces) {
        jQuery.event.remove(this, 'mouseleave',  $leaveTop.handler);
        return false;
    },
    
    handler: function(event) {
        var $element = jQuery(this);
        temp = GOGOdirection(event, $element )
        if( temp == 'top')
        {
            $element.triggerHandler('leaveTop')
        }
    }
};

$leaveBottom = jQuery.event.special.leaveBottom = {
    setup: function( data, namespaces )
    {
        jQuery.event.add(this, 'mouseleave', $leaveBottom.handler );
        return false; 
    },

    teardown: function(namespaces) {
        jQuery.event.remove(this, 'mouseleave',  $leaveBottom.handler);
        return false;
    },
    
    handler: function(event) {
        var $element = jQuery(this);
        temp = GOGOdirection(event, $element )
        if( temp == 'bottom')
        {
            $element.triggerHandler('leaveBottom')
        }
    }
};





/*

(function($){
    
    $.widget("gadget.dev_gadgetTest", {
           options:{
             
            }
            
           ,_create: function(){ 
              var self = this;
             
              
           }
           ,_init: function(){ 
               
             
                 
           }
           ,destroy: function(){
              
               $.Widget.prototype.destroy.apply(this);
           }
           ,_setOption: function( key, value ) {
               //this.options[ key ] = value;
               alert( key)
               alert(value)
                      
           }
           
           ,setPosition: function(showAgain){
               
        
           }
            
           ,show: function(){
               
            
           
           }
           ,hide: function(){
               
            
               
        }
            
    });
    
    
})(jQuery);
*/









$(document).ready(function() {
    
        //var pathname = window.location.pathname;
        //console.log('pathname',pathname)
 
         //$('.GRID-panelBrowse').dev_gadgetBrowse(); 
      
        
  
  ///////////////////////
  // GADGET JQ UI setups 
  ///////////////////////  
 
  
  
 /*   
    
    $('a.ITEM-stagePagePreview').dev_gadgetMedithumb({
        
       
        'button.button1': {  addClass:'STYLE-itemMedithumbIcon ICON-trash-mini',  action:function(event, ui){ ui.button.bind('click', function(){ $('a.ITEM-stagePagePreview:first').remove() })  } }
         //,'button.button2': {  addClass:'STYLE-itemMedithumbBorder',  action:function(event, ui){ ui.button.bind('click', function(){alert('222')  })  } }
        
        //,'button.button3': {  addClass:'STYLE-itemMedithumbBorder',  action:function(event, ui){ ui.button.bind('click', function(){alert('222')  })  } }
      
      
      
      
       //,'button.button2': {  action:function(event, ui){ ui.button.bind('click', function(){ alert('222') })  } }
       //,'button.button3': {  action:function(event, ui){ ui.button.bind('click', function(){ alert('222') })  } }
        
    });
    
    
    
    $('a.ITEM-stagePagePreview').dev_gadgetBubble({
        
         //mouseEvent: false,
        'button.bubble1': {  addClass:'STYLE-itemMedithumbIcon ICON-add-mini',  action:function(event, ui){ ui.button.bind('click', function(){ alert('222')  })  } }
       ,'button.bubble2': {  action:function(event, ui){ ui.button.bind('click', function(){alert('222')  })  } }
       ,'button.bubble3': {  addClass:'STYLE-itemMedithumbBorder',  action:function(event, ui){ ui.button.bind('click', function(){alert('222')  })  } }
      
      
      
      
       //,'button.button2': {  action:function(event, ui){ ui.button.bind('click', function(){ alert('222') })  } }
       //,'button.button3': {  action:function(event, ui){ ui.button.bind('click', function(){ alert('222') })  } }
        
    });
    
    $('a.ITEM-stagePagePreview:first').dev_gadgetBubble('disable')
    
    
//$('a.ITEM-stagePagePreview:first').dev_gadgetMedithumb('option',{  mouseEvent: false})
//$('a.ITEM-stagePagePreview:first').dev_gadgetMedithumb('option',{  mouseEvent: true})
    
 //$('a.ITEM-stagePagePreview').dev_gadgetMedithumb('disable')
// $('a.ITEM-stagePagePreview:first').dev_gadgetMedithumb('show')
    
   //$('a.ITEM-stagePagePreview:first').dev_gadgetMedithumb('enable')
   //$('a.ITEM-stagePagePreview:first').dev_gadgetMedithumb('destroy')
    
    
    //create call 
    $('<div class="create_test">')
            .gadgetCreate({   
            'background-color': 'red', 
            left: 90, 
            height: 90,
            width: 400 ,
            top: 90,    
            'z-index': 100000,
            color: 'green',
            addClass: 'STICKER',
            
            
            'beforeCreate': function(event, ui){
                    console.log('beforeCreated',ui)
                    alert('before')
            },
            'created': function(event, ui){
                    console.log('beforeCreated',ui)
                    alert('created')
            
            }
    
    }).appendTo('.create_test')
    

    
    
    //$('.create_test') .gadgetCreate('destroy')   
    
    $('<a class=""/>')
        .appendTo('.STAGE')
        .dev_gadgetButton({
                
                action: function(event, ui){ ui.button.bind('click', function(){ alert('bing1') }) },
                text: 'Add Bingo',
                left: 0,
                top: 60,
                'z-index': 100000,
                left: 0, 
                height: 50,
                width: 50 ,
                top: 0, 
                'z-index': 100000,
                'background-color': 'blue',
                addClass: 'STICKER BUTTON',
                text: 'Button 2',
                border: '2px solid orange'
       
    });
      
    $('<a class="test2"/>')
        .appendTo('.STAGE')
        .dev_gadgetButton({

                action: function(event, ui){ ui.button.bind('click', function(){ alert('bing2') })},
                type: 'add',
                text: 'Add Bingo2 ',
                left: 0,
                top: 160,
             
    });
    
    
        
    $('<a class="test3"/>').appendTo('.STAGE')
         .dev_gadgetButton({ 
            
             action: function(event, ui){ ui.button.bind('click', function(){ alert('bing3') }) },
             left: 60, 
             height: 50,
             width: 50 ,
             top: 0, 
             'z-index': 100000,
             'background-color': 'blue',
             addClass: 'STICKER BUTTON',
             text: 'Button 2',
             border: '2px solid red'
             
    });
        
          
          $('.test2').dev_gadgetButton('option', { 'background-color': 'orange', text:'eeee',  action: function(event, ui){ ui.button.bind('click', function(){ alert('bing2 new') })}})
          //$('.test').dev_gadgetButton('destroy')
          //$('.test3').dev_gadgetButton('destroy')
          //$('.test2').dev_gadgetButton('destroy')
        
       
        
      
        
    $('<div class="menu1">').dev_gadgetMenu({
        
                 type: 'toolbar',
                 selectable: 'single',
                 
                 
                 'button.button1': {  
                                     selected: true,
                                     action: function(event, ui) {  ui.button.bind('click', function(){ alert('111')  }) }  
                                    
                                   }
                  
                ,'button.button2': { 
                                     action:function(event, ui){ ui.button.bind('click', function(){ alert('222') })  }
                                    
                                    
                                     
                                   }
               
               ,'button.buttonhh': {  
                                     
                                     action:function(event, ui){ ui.button.bind('click', function(){ alert('333') })  }
                                   }                       
                         
                ,'button.button3': {   
                                    
                                     action:function(event, ui){ ui.button.bind('click', function(){ alert('333') })  }
                                   }
                                      
                ,'button.button4': {   
                                     
                                     action:function(event, ui){ ui.button.bind('click', function(){ alert('333') })  }
                                   }                   
                })
                
                .appendTo('.STAGE');
                
                $('.menu1').dev_gadgetMenu('option', {  'button.buttonhh': { 
                                                                            color: 'yellow' 
                                                                           ,action:function(event, ui){ ui.button.bind('click', function(){ alert('new 333') })  }
                                                                            
                                                                            }, 
                                                        background: '#000'  });
                
               //$('.menu1').dev_gadgetMenu('option', { 'button.buttonhh': 'disable'});
                //$('.menu1').dev_gadgetMenu('option', { 'button.buttonhh': 'enable'});
                //$('.menu1').dev_gadgetMenu('option', { 'button.buttonhh': 'destroy'});
                //$('.menu1').dev_gadgetMenu('destroy')
                
                //$('.menu1').dev_gadgetMenu('disable')
                //$('.menu1').dev_gadgetMenu('enable')
                //$('.menu1').dev_gadgetMenu('destroy')
    
     $('<div class="menu2"><menu class="FUNCTION-toolbar"><li class="ITEM-toolbar-selected"><a class="ITEM-toolbar-selected" style="color:green">Test2</a></li><li class="ITEM-toolbar"><a class="ITEM-toolbar" style="color:green">Test</a></li></menu></div>')
            .appendTo('.STAGE')
            .dev_gadgetMenu({
                type: 'toolbar', 
                selectable: 'single',
                'button.button4': { action:function(event, ui){ ui.button.bind('click', function(){ alert('333') })  }}
            });
    
    
    $('.menu2').dev_gadgetMenu('option', {  'button.Test2': { color: 'yellow' ,action:function(event, ui){ ui.button.bind('click', function(){ alert('new 333') })  }} });
    //$('.menu2').dev_gadgetMenu('option', { 'button.Test': 'disable'});
    //$('.menu2').dev_gadgetMenu('option', { 'button.Test': 'enable'});
    
*/
    

// END GADGET JQ UI setups 
///////////////////////////////////////////   
    
    
    
    
    
    
    
      
            //$('.FORM').gadgetForm();
            //$('.CONTAINER-browse').gadgetBrowse();
            
            //$('.UI-CONTAINER-option:eq(1)').click(function(){
                
                 /*   
               $('.UI-CONTAINER-stage').find('.GRID') 
                  
                    
                    .append( '<menu class="FUNCTION-split"><li class="ITEM-split STYLE-verticalSplit"><a class="ITEM-split STYLE-verticalSplit"><span id="BUTTON-vSplit">vsplit</span></a></li><li class="ITEM-split"><a class="ITEM-split"><span  id="BUTTON-hSplit">hsplit</span></a></li></menu>')
                    .find('.FUNCTION-split')
                    .css('display', 'none')
                    .end()
                    .each(function(){
                    
                        $(this).hover( function(){
                            $(this).find('.FUNCTION-split').css('display', 'block')        
                        },function(){
                            $(this).find('.FUNCTION-split').css('display', 'none')
                        });
                     });
                })
                */
                
           /* $('.UI-CONTAINER-option').click(function(){
               
                console.log( $('.CONTAINER'))
                    $('.CONTAINER').gadgetMedithumb({'item:trash=>Delete:buttonDeleteBifork': 
                          function(){   }
                        },'Delete:bifork');
                        
                        
                $('.CONTAINER').bind({    
                        
                       'mouseenter':  function(){  $(this).trigger('showMedithumb', 600) }
                      ,'leaveBottom leaveLeft':  function(){  $(this).trigger('hideMedithumb', 0) }
                      ,'leaveTop leaveRight':  function(){  $(this).trigger('hideMedithumb', 700) }
                     
                });
                
                
                
            })*/
            
            
            
            
            
            //.gadgetWrite({ editableArea: $('.UI-CONTAINER-option') })
/*          





            $('.UI-CONTAINER-option').click(function(){
                $('.FORM').trigger('click')
                
            })*/
            
            

            
            
            
            
           
                
               
                
                
              
    
    
    
    
});

     
     
     
     
     