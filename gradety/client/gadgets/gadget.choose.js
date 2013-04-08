(function($){

    $.widget("gadget.choose", {
           options:{
               
                introText: 'Select ',
                betweenButtons: 'or',
                outroText: 'or ',
                mouseEvent: true
            }

           ,_create: function(){ 
               
               var self = this, o = this.options, c = 0 ,  menuOptions = $.extend({},this.options);  
                                
                                                    delete menuOptions.disabled, 
                                                    delete menuOptions.cancel, 
                                                    delete menuOptions.mouseEvent,
                                                    delete menuOptions.action,
                                                    delete menuOptions.introText, 
                                                    delete menuOptions.betweenButtons, 
                                                    delete menuOptions.outroText
               
            // CREATE BOX FOR CHOOSEBUTTONS
               self.choose = $('<div class="UI-CONTAINER-choose"></div>')
                                .css({ 'font-size': 13, display: 'none'})
                                .appendTo(self.element);
            
            // INTRO TEXT 
               if(o.introText != undefined ) self.introText = self._createText(o.introText);
               
            // BUTTONS 
               self.buttons = $();
               self.betweenButtons = $();
               
              for ( var i in menuOptions ) {
                if ( o.betweenButtons != undefined  && c != 0 ) {
                  var t = self._createText( o.betweenButtons );
                  $.merge( self.betweenButtons , t );
                }//END IF      
                
                if ( typeof  menuOptions[ i ] == 'object' ) var setup = $.extend( { addClass: 'UI-BUTTON-choose'}, menuOptions[ i ] )
                else {
                  
                  var setup = { addClass: 'UI-BUTTON-choose', action: menuOptions[ i ]  }
                }
                      
                var b = $( '<a>' + i + '</a>' )
                          .appendTo(self.choose)
                          .dev_gadgetButton( setup );
                          $.merge(self.buttons , b);
                c++;
              }//END LOOP
               
             // OUTRO
                if(o.outroText != undefined) self.outroText = self._createText(o.outroText);
                if(o.cancel != undefined) self.cancel = $('<a href="#" class="UI-STYLE-chooseCancel">cancel</a>').appendTo(self.choose).dev_gadgetButton(o.cancel);   
            // SETTING SIZE OF ALL ELEMENTS    
                self.scale();
               
           }
           ,_init: function(){ 
               var self = this, o = this.options; 
               self.show()
           
               if(o.mouseEvent == true && o.disabled == false )
               {  
                   //this._trigger( 'cancel', null, this.ui() ); 
                   self._trigger( 'action', null, this.ui() ); 
               }
              
           }
           ,ui: function(){
                return { 
                        element: this.element, 
                        cancel: this.cancel, 
                        choose: this.choose, 
                        buttons: this.buttons, 
                        outroText: this.outroText, 
                        introText: this.outroText, 
                        betweenButtons: this.betweenButtons
                       }    
           }
           ,destroy: function(){
               
               var self = this, o = this.options; 
               
               self.choose.remove();
               
               $.Widget.prototype.destroy.apply(this);
           }
           ,_setOption: function( key, value ) {
              
               var self = this, o = this.options; 
               
               self.choose.remove();
               this.options[ key ] = value;
               self._create();
               
               if(this.options.disabled == true)
               {
                   self.buttons.add(self.cancel).dev_gadgetButton('disable')
               
               } else {
                   
                   self.buttons.add(self.cancel).dev_gadgetButton('enable')
               }

           }
           ,_createText: function(text){
                
                 var self = this, o = this.options;
                 
                 return $('<span class="UI-STYLE-chooseText">'+text+'</span>').appendTo(self.choose)
           }
           ,scale: function(){
                
                var self = this, o = this.options;
             
             // CREATE SCALE 'FACTOR'
                var s = Math.round(this.element.parent().innerWidth() / (this.element.text().length / 2))
             
             // NOT BIGGER OR SMALER THAN 7/24
                if(s > 20) s = 20;
                else if(s < 7) s= 7;
            
            // SCALE:
                self.buttons
                    .add(self.cancel)
                    .add(self.outroText)
                    .add(self.betweenButtons)
                    .add( self.outroText)
                    .add( self.introText)
                    
                    .css('font-size', s);
           }
           ,show: function(){
               var self = this, o = this.options; 
               
               if(o.disabled == false )
               {
                   self.scale();
                   self.choose.fadeIn(1500);
               }
               
           }
           ,hide: function(){
               
               var self = this, o = this.options; 
               
               if(o.disabled == false )
               {
                   self.scale();
                   self.choose.fadeOut(1500);
               }
           }

    });


})(jQuery);


