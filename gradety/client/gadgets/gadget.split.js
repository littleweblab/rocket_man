(function($){
    
    $.widget("gadget.dev_gadgetSplit", {
           options:{
               
               mouseEvent: true
           
           }
            
           ,_create: function(){ 
              var self = this, o = this.options;
              
              
              self.split = $('<menu class="FUNCTION-split"></menu>').appendTo(self.element)
              self.vsplit = $('<li class="ITEM-split STYLE-verticalSplit"><a class="ITEM-split STYLE-verticalSplit">vsplit</a></li>').appendTo( self.split).find('a.ITEM-split:first');
              self.hsplit = $('<li class="ITEM-split"><a class="ITEM-split">hsplit</a></li>').appendTo(self.split).find('a.ITEM-split:first');
                        
              self.setPosition();
              
              if(o.disabled == false &&  o.mouseEvent == true)
              {
                  self.split.css({'opacity':'0', display: 'none'})
              }
           }
           ,_init: function(){ 

              var self = this, o = this.options;

              if ( o.disabled == false &&  o.mouseEvent == true ) {
                self.element.bind({ 
                  'mouseenter.split': function(){ self.show(); }
                , 'mouseleave.split': function(){ self.hide(); }
                });
              } 
              if ( o.disabled == false ) self._trigger( 'action', null, this.ui() );     
           }
           ,destroy: function(){
              this.split
                    .clearQueue()
                    .stop()
                    .remove();
                    
               $.Widget.prototype.destroy.apply(this);
           }
           ,_setOption: function( key, value ) {
               
               var self = this, o = this.options;
               this.split
                   .clearQueue()
                   .stop();
                      
               self.split
                  
                   .add(self.vsplit)
                   .add(self.hsplit)
                   .unbind();
               
               this.options[ key ] = value;
               
               if(o.disabled == false &&  o.mouseEvent == true)
               {
                   // PROBLEM MIT CLICK AUF DAS GRID DANN VERSCHWINDET DER SPLIT BUTTON
                   // WEI? AUCH NICHT MEHR WOFÜR DAS HIER WAR
                   self.split.css({'opacity':'0', display: 'none'})
               } 
               else {
                  
                   self.show();
               }
               
               if(o.disabled == true)
               {
                   self.split.css({'opacity':'0', display: 'none'})
               }
               self._init();
               
             
           }
           ,ui: function(){ return { element: this.element, vsplit: this.vsplit,  hsplit: this.hsplit } }
           ,show: function(){

               var self = this, o = this.options; 
              
               if(o.disabled == false  &&  o.mouseEvent == true)
               {  
                   self.setPosition()
                   self.split.css({display: 'block'})
                             .clearQueue()
                             .stop()
                             .delay(600)
                             .animate({'opacity': 10}, 9000);
               }
            }
            ,hide: function(){

                var self = this, o = this.options; 
                
                if(o.disabled == false  &&  o.mouseEvent == true)
                {
                    self.setPosition()      
                    self.split.clearQueue()
                              .stop()
                              .delay(300)
                              .animate({'opacity': 0}, 300);
                }

            }
           ,setPosition: function(){
               
               var self = this
                 , o = this.options
                 , SplitButtonCases
                 , north = self.element.closest(':has(> .ui-resizable-n )').children('.ui-resizable-n')
                 , west = self.element.closest(':has(> .ui-resizable-w)').children('.ui-resizable-w')
                 ;
               
               // get the height / width of the rezise handlers to add more space to the split buttons
               // so that a part of the button will not be hidden by the reziser
               var AddHandlerHeight = north.is(":visible") ? north.height() : 0 ;
               var AddHandlerWidth = west.is(":visible") ? west.width() : 0;
                         
               self.vsplit.css('margin-top', AddHandlerHeight);  
               self.hsplit.css('margin-left', AddHandlerWidth);
               
               

               // witch side is the longest we need to know 
               if( self.element.width() < self.element.height() )
               {
                   SplitButtonCases =  Math.ceil( self.element.width() / 146 ); 
               }    
               else {
                   SplitButtonCases =  Math.ceil( self.element.height() / 146 ); 
               }

               if(SplitButtonCases <= 3 )
               {
                   switch (SplitButtonCases) 
                   {
                       // small
                       case 2:
                           self.vsplit
                               .width(73) 
                               .height(46)
                               .css({'background-position' : '-306px -1px', 'margin-left': '-37px' }); 

                           self.hsplit
                               .width(46) 
                               .height(73)
                               .css({'background-position' : '-1px -36px', 'top': '-36px' });      
                       break;

                       // normal
                       case 3:
                           self.vsplit
                               .width(120) 
                               .height(100) 
                               .css({'background-position' : '-186px -2px',  'margin-left': '-61px'});

                            self.hsplit
                               .width(100) 
                               .height(120) 
                               .css({'background-position' : ' -2px -109px',  'top': '-59px'});
                       break;

                       // large
                       case 4:
                            self.vsplit
                               .width(120) 
                               .height(100) 
                               .css({'background-position' : '-186px -2px',  'margin-left': '-61px'});

                            self.hsplit
                               .width(100) 
                               .height(120) 
                               .css({'background-position' : ' -2px -109px',  'top': '-59px'});
                       break;

                       // min size
                       default:
                            self.vsplit.width( 40 ) 
                               .height( 12 )
                               .css({'background-position' : ' -378px -3px ',  'margin-left': '-20px'}); 

                            self.hsplit.width( 12 ) 
                               .height( 40 )
                               .css({ 'background-position' : '  0 3px',  'top': '-20px'}).text('d');
                       break;
                   }
               } 
               // max size
               else {
                   self.vsplit
                       .width(186) 
                       .height(146)
                       .css({'background-position' : ' 0 -4px',  'margin-left': '-93px'});

                   self.hsplit
                       .width(146) 
                       .height(186)
                       .css({'background-position' : ' -3px -229px', 'top': '-93px'});
               }
           }
    });
    
    
})(jQuery);