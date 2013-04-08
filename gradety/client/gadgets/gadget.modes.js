(function($){
    
$.widget("gadget.dev_gadgetModes", {
    options:{
         design: function(){}
        ,edit: function(){}
        ,people:  function(){}
        ,translate:  function(){}
    }
        
    ,_create: function(){ 
        
        var self = this, o = this.options; 
       
        
        // FIND MODES ELEMENTS
        self.modeSwitch = $('.FUNCTION-modes'); 
        self.modeRevolver = $('.STICKER-modes-buttonmodestatus');
        self.modeSelect = $('.FUNCTION-showHideModeSelection'); 
        self.modeSwitch.find('.BUTTON-modesatus').text(o.start)
    }
    ,_init: function(){ 
           
        var self = this, o = this.options, current;
           
        self.modeSelect.find('li').filter( function() { return $.trim($(this).text()) == $.trim(self.modeSwitch.find('.BUTTON-modesatus').text())}).css('display','none');
        self.current = o.start
        
       
        
        if(o.disabled == false)
        {
            
            self._changeRevolver(o.start);
            
            self.modeRevolver
                .add(self.modeSelect)
                .bind({
                    'mouseenter.revolver.modes':function(){ 
                        self.show(); 
                     }
                    ,'mouseleave.revolver.modes':function(){ 
                        self.hide(); 
                    }
                });
            
            self.modeSelect
                .find('li')
                    .bind({'mouseenter.select.modes': function(){  
                   
                       //var t = $.trim(self.modeSwitch.find('.BUTTON-modesatus').text()) 
                       //,c = self.modeSelect.find('li').filter( function() { return $.trim($(this).text()) == t})
                       //,n = $(this);
                    }
                    ,'click.select.modes': function(){   
                        // self.doUnbind()
                        var t = $.trim(self.current);
                        self.current = $(this).text();
                        var c = self.modeSelect.find('li').filter( function() { return $.trim($(this).text()) == t}) ,n = $(this);
                
                        self._changeRevolver($.trim(n.text()));   
                
                       self.modeSelect.find('li').css('display','inline-block');
                       n.css('display','none');
                       self.hide(); 
                       self._trigger( self.mode.toLowerCase() , null, self.ui()); 
                }
            });
        }
    }
    ,_changeRevolver: function(futureMode){
           var self = this, o = this.options; 
           
           self.mode = futureMode.replace(/^\s*|\s*$/g,'');
           self.modeSwitch.find('.STICKER-mode-icon  span').attr('class', 'ICON-mode-'+self.mode.toLowerCase()+'-maxi');
           self.modeSwitch.find('a.BUTTON-modesatus').text(self.mode);
    }
 
    
    ,doUnbind:function(){
        
        var self = this, o = this.options; 
           
        self.modeSelect
            .add(self.modeSelect.find('li'))
            .add(self.modeRevolver)
            .unbind('.modes');
    }
    ,destroy: function(){
        
        var self = this, o = this.options; 
        
        self.doUnbind();
        $.Widget.prototype.destroy.apply(this);
    }
    ,_setOption: function( key, value ) {
        
        var self = this, o = this.options;
        
        self.doUnbind()
        self.options[ key ] = value;
        self._init()
                  
    }
    ,ui:function(){  return{  element: this.element, mode: self.mode  } }
       
    ,show: function(){
        
        var self = this, o = this.options;
           
        if(o.disabled == false)
        {
            self.modeSwitch
                .css({'background-position': '0 -134px' });
             
            self.modeSelect
                .css({'display':'inline-block'  })
                .stop()
                .animate({ 'width': ($('.FUNCTION-modeSelection').children('li').length -1 ) * 54, 'padding-left': 62 }
                          ,200
                          ,function(){
                              
                                 self.modeSwitch.bind('clickoutside.modes', function(){ self.hide(); });
                          }
                );
        }
        
        
    }
    ,hide: function(){
           
        var self = this, o = this.options;
        
        if(o.disabled == false)
        {
            self.modeSelect
                .stop()
                .animate({ 
                    
                    width: 0
                   ,'padding-left': 62
                   ,'width': 36 
                }
                , 100
                ,function() { 
                          
                    self.modeSwitch.css({'background-position': '0 0'}); 
                    
                     self.modeSelect.css('display', 'none');
                    
                  
                    
                });
        }
    }
});
    
})(jQuery);




