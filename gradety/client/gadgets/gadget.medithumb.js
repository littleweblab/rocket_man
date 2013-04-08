///////////////////////
// GADGET MEDITHUMB  //
///////////////////////
                
(function($) {  
    
    
    $.widget("gadget.dev_gadgetMedithumb", {
        options:{
            mouseEvent: true,
            action: function(event, ui){
                
                ui.element.bind({
                        
                    'mouseenter.medithumb':  function(){  ui.self.show(600) }
                   ,'leaveTop.medithumb':  function(){    ui.self.hide(700) }
                   ,'leaveBottom.medithumb':  function(){ ui.self.hide(0) }
                   ,'leaveLeft.medithumb':  function(){   ui.self.hide(700) }
                   ,'leaveRight.medithumb':  function(){  ui.self.hide(0) }
                
                });
                ui.medithumb.bind({     
                
                   'mouseenter.medithumb':  function(){  ui.self.show(0);  ui.element.dev_gadgetBubble('show'); ui.element.dev_gadgetSplit('show'); }
                  ,'mouseleave.medithumb':  function(){  ui.self.hide(0);  ui.element.dev_gadgetBubble('hide'); ui.element.dev_gadgetSplit('hide'); }
                
                })
                
            }
            ,position: {
    		    of: false,
    		    my:'right top' ,
    			at:'left top' , 
    			offset:'0 0' ,
    			collision:'none none'
    		}
    	}
            
        
        ,_create: function(){ 
           var self= this, menuOptions = $.extend({},this.options,{ type: 'medithumb', element: self.element })  
                           delete menuOptions.disabled, delete menuOptions.mouseEvent, delete menuOptions.position
           
         
            this.options.position.of = this.element 
            
            this.medithumb = $('<div class="STICKER TakeMyKidsWidth"></div>')
                .appendTo('body')
                .append('<div/>')
                .children(':first')
                    .dev_gadgetMenu(menuOptions)
                .end()
                .position(this.options.position)
                .css({'display':'none', opacity:0,  'z-index':10002})
                //.css('background','pink')
       
        //this.element.click(function(){   this.medithumb.stop()})
        this.element.queue("fx");
         
                
        }
        ,_init: function(){ 
             var self= this
             if(this.options.mouseEvent == true && this.options.disabled == false )
             {
        
                 this._trigger( 'action', null, this.ui() ); 
            
             }
             $(window).resize(function() {
                        
                        self.medithumb.css({'display':'inline-block'}), 
                        self.medithumb.position(self.options.position)
                        self.medithumb.css({'display':'none'}) 
             });
             
           
            
                 
        }
        ,_setOption: function( key, value ) {
                this.medithumb.stop()
                this.options[ key ] = value;
                this._unbind()
                
                if(this.options.mouseEvent == true && this.options.disabled == false )
                {
                    this._trigger( 'action', null, this.ui() ); 
                }
                var menuOptions = $.extend({},this.options,{ type: 'medithumb' })  
                                   delete menuOptions.disabled, delete menuOptions.mouseEvent, delete menuOptions.position
                
                //console.log(' menuOptions',  menuOptions)
                this.medithumb.children(':first').dev_gadgetMenu('option', menuOptions)
               
               
        }
        ,_unbind:function(){
             
             this.medithumb.unbind('.medithumb')
             this.element.unbind('.medithumb') 
        }

        ,destroy: function() { 
            this.medithumb.stop()
            this._unbind()
            this.medithumb.remove()
          
            
            $.Widget.prototype.destroy.apply(this);
          
        }
        
        ,ui: function(){  
             
             return{ medithumb: this.medithumb,  element: this.element, self:this }    
        }
        ,show:function(tempo){
            
              
            if(this.options.disabled == false  ){
                var self= this
             
                self.medithumb.position(self.options.position)
                self.medithumb
                    .css({'display':'inline-block'})
                    .position(self.options.position)
                    .clearQueue()
                    .stop() 
                    .delay(tempo)
                    .animate({ opacity:10 },
                             { duration:700  
                               
                               ,step: function() { 
                                    
                                  // self.medithumb.css({'display':'inline-block'}); 
                                   //self.medithumb.position(self.options.position);  
                                }
                             
                             });
            
            }
        }
        ,hide:function(tempo){
            if(this.options.disabled == false ){
             var self= this
                 self.medithumb 
                     .clearQueue()
                     .stop() 
                     .delay(tempo)
                     .animate({ opacity:0 },{ duration:300, complete: function() { $(this).css('display','none') }});
            }
        }


       
        
        
    }); 

})(jQuery);

// !!!!!!!!!!!!!!!!!!!!!!
// OLD
// !!!!!!!!!!!!!!!!!!!!!!
jQuery.gadgetMedithumb = function(array, options, name)
{
    for(var i = 0; i < array.length; i++ )
    {
        var $array = $(array[i]);
// TASK    
        var task = GOGOcreateTask(name); // returns task.element & task.ident;   
         
// BROTHERS         
        var GADbrothers = $(':data(gadget.namespace=' + task.ident[1] + ')').filter(function(){ return $(this).data('gadget').parent ==  $array[i] })

// POSITION    
        var GADposition = $array
                            .gadgetPosition({
                                    css:{ 'z-index':300 }
                                   ,position:{ my:'right top' ,at:'left top' , offset:'0 0' ,collision:'none none'}
                            
                            },'div=>'+task.ident.join(':'))

            
// MENU      
        var GADmenu = GADposition.gadgetMenu(options, 'medithumb=>'+task.ident.join(':'));

// BODY     
        var GADbody = GADposition.children(':first');      
    
// NEW GADGET     
        var $newGADget = GADposition
                            .css({width: GADbody.outerWidth(), height:GADbody.outerHeight()})
                            .position({ my:'right top' ,at:'left top' ,offset:'0 0' ,collision:'none none', of: $array  })
                            .css({'display':'none', opacity:0})
        
        $newGADget.queue("fx");
        
// SHOW       
        function showMedithumb(tempo)
        { 
            $newGADget 
                .clearQueue()
                .stop() 
                .delay(tempo)
                .animate({
                    
                    opacity:[10]
                  , display:'block'
                        
                  },{  
                      
                    duration:700
                  , step: function(i)
                          {
                              $(this).css({'display':'block'}); 
                          }
                 });
         };

// HIDE
       function hideMedithumb(tempo)
       { 
           $newGADget 
               .clearQueue()
               .stop() 
               .delay(tempo)
               .animate({ 
                   
                   paddingBottom:0
                 , paddingLeft: 0
                 , opacity:0 
                 
                 },{ 
                   duration:300
                 , complete: function() {$(this).css('display','none')}
            });
        };


// EVENTS

       $(array).bind('showMedithumb', function(e,index){ showMedithumb(index) } );
       $(array).bind('hideMedithumb', function(e,index){ hideMedithumb(index) } );
                        
                      
    }
}
jQuery.fn.gadgetMedithumb = function(options, name){
    return jQuery.gadgetMedithumb(this, options, name);
};







(function( $ ){

  jQuery.fn.goMedithumb = function( options  ) {  

    return this.each(function() {
        
      var opts = $.extend({}, $.fn.gadgetAccordion.defaults, options);    
      
          $(this).bind({    

                    'mouseenter':  function(){  $(this).trigger('showMedithumb', 600) }
                   ,'leaveBottom leaveLeft':  function(){  $(this).trigger('hideMedithumb', 0) }
                   ,'leaveTop leaveRight':  function(){  $(this).trigger('hideMedithumb', 700) }

          });

          var $Delete = $(this).gadgetPosition().not(':data(gadget.name=bubbleBody)');
          var $DeleteParent = $($Delete.data('gadget').parent);
      
          $Delete.bind({ 

                    'mouseenter' : function(){ $DeleteParent.trigger('mouseenter'); }
                   ,'mouseleave' : function(){ $DeleteParent.trigger('leaveBottom'); 
                                               $DeleteParent.trigger('mouseleave.split');
                                             }
          });
    }); 
 };

 $.fn.goMedithumb.defaults = { }
  
})( jQuery );









/*


   $(domident).gadgetPosition({ css:{ width:33, height: 33 } 
                                ,position:{my:'right top', at:'left top', offset:'0 0'}
                               },'div=>bubble:position'
                               )
               .gadgetMenu({
                                'item:trash=>Delete:buttonDeleteBifork': function(){ alert("Add function call here")}} 
                               ,'medithumb=>testName:testNamespace' 
 		                  );





.gadgetPosition({ css:{ width:33, height: 33 } 
                            ,position:{my:'right top', at:'left top', offset:'0 0'}
                           },'div=>bubble:position'
                           )*/