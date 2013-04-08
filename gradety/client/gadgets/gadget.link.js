(function($){  
     
     $.widget("gadget.dev_gadgetLink", {
         options:{ 
              mouseEvent: true,
              action: function(event, ui){  
                  ui.element.bind('click.gadgetLink', function(event){
                      event.preventDefault();
                      ui.self.show()
                  }) 
              },
              show: function(event, ui){  
                  
                   ui.element.closest('.CONTAINER-writeText')
                     //.attr('contentEditable', 'false')
                     .fadeTo('fast', 0.33)
                     .dev_gadgetBrackets('hide') 
                     .dev_gadgetBubble('hide')
                     .attr('contentEditable', 'false');
              },
              hide: function(event, ui){  
                   ui.element.closest('.CONTAINER-writeText')
                     //.attr('contentEditable', 'true')

                     .fadeTo('fast',1)

                     .dev_gadgetBrackets('show')
                     .dev_gadgetBubble('show')
            }
              
             
         }
        ,_create:function(){
            var self = this; var originalLink = 'Enter new link here...';
            
           
            if(self.element.attr('href') !== undefined){
                
                originalLink = self.element.attr('href');
            }
            
            this.linkEdit ={};      
            this.linkEdit.element  = $('<div class="STICKER-linkEdit">'
                                     + '<div class="FUNCTION-linkForm">'
                                     +       '<form class="FORM">'
                                     +           '<input id="linkForm" class="FORM-item FORM-input " name="test" type="text" value="'
                                     + originalLink
                                     +           '"/>'
                                     +       '</form>'
                                     +       '<div class="STICKER-ButtonSetLink"><a class="BUTTON-setLink">SetLink</a></div>'
                                     +  '</div>'
                                     +'</div>'
                                     )
                                     
            this.linkEdit.input = this.linkEdit.element.find('#linkForm');
            this.linkEdit.input.dev_gadgetForm();
            this.linkEdit.nicerInput = this.linkEdit.element.find('div.FORM-input').addClass('STYLE-linkForm')
            this.linkEdit.form = this.linkEdit.element.find('.FORM');
            this.linkEdit.button = this.linkEdit.element.find('.BUTTON-setLink');
            
            
            
            this.cancelButton = $('<div class="STICKER-linkButton"><p></p><div class="STICKER-linkCancelIcon ICON-cancel-link-mini"></div></div>')
            this.cancelButton
                .appendTo('body')
                .css({'width': self.element.width(), 'height': self.element.height(), 'z-index': 99999 })
                .position({ of:self.element, my:'center center', at:'center center', offset: 0 })
                .find('p')
                    .text(this.element.text())
                    .css({ 'font-size': self.element.parent().css('font-size')})
                    .css('margin-top', (this.cancelButton.find('p').height() / 2 * -1)) 
                .end()
                .fadeOut(0);
                
          
            this.linkEdit.element
                .css({'display':'block', height: 0, 'z-index': 99999 })
                .appendTo('body')
                .position({ of: self.cancelButton, my:'left top', at:'right bottom', offset: '-61px -120px', collision:'none none' })
               //.fadeOut(0);
            
            
            this.cancelButton.find('.STICKER-linkCancelIcon')
                   .bind('click.linkEdit', function(){
                       self.linkEdit.nicerInput.find('p').text(originalLink) 
                       self.linkEdit.input.val(originalLink)
                       self.hide();
                   })
              
            
            
                 this.linkEdit.form
                       .validate({  debug: true,
                                     //errorElement: "em",
                                     //errorContainer: test,
                                     errorPlacement: function(error, element) 
                                                     {
                                          				//error.appendTo('.test-error')
                                          				self.linkEdit.button.unbind('.linkEdit')
                                          				self.linkEdit.button.css({'background-position':'0 -44px', 'cursor': 'default'}) 
                                          			 },
                                          			 success: function(label) {

                                          			     self.linkEdit.button.bind('mouseenter.linkEdit', function(){
                                          			          $(this).css({'background-position':'0 -132px', 'cursor': 'pointer'}); 
                                          			     });

                                          			     if($input.val().search(/@/i) !== -1)
                                                         {
                                                             self.linkEdit.button.css('background-position','0 -88px'); 
                                                             self.linkEdit.button.bind('mouseleave.linkEdit', 
                                                             function(){

                                                   			     self.linkEdit.button.css('background-position','0 -88px');

                                                   			 });
                                                   			 self.linkEdit.button.bind('click.linkEdit',function(){ 

                                                                 self.hide()
                                                                 self.element.attr('href',  'mailto:'+ self.linkEdit.input.val())
                                                                 self.linkEdit.button.css('background-position','0 -88px');

                                                             })

                                                         } else {

                                                             self.linkEdit.button.css('background-position','0 0');   
                                                             self.linkEdit.button.bind('mouseleave.linkEdit', 
                                                             function(){

                                                        		 self.linkEdit.button.css('background-position','0 0');  
                                                        	 });
                                                        	 self.linkEdit.button.bind('click.linkEdit', function(){ 

                                                                 self.hide()
                                                                 self.element.attr('href',  self.linkEdit.input.val())
                                                                 self.linkEdit.button.css('background-position','0 0');  
                                                            })
                                                         }
                                                     },
                                                     rules: {
                                                         linkForm: {

                                                            url: true,
                                                         }
                                                     },
                                          			 messages: {
                                              			 linkForm: {
                                              				url: 'url'
                                                         }
                                                    }
                        });

                        this.linkEdit.nicerInput              
                           .keydown( function(event){ 
                             
                            $input =  self.linkEdit.input;


                            if($input.val().search(/@/i) !== -1)
                            {

                                $input.rules("remove", "url");
                                $input.rules( "add", { email: true, 
                                                       messages: { email: 'e-mail' }
                                                     }
                                );
                            } 
                            else {


                                $input.rules("remove", "email");
                                $input.rules( "add", { url: true, 
                                                       messages: { url: 'url' }
                                                     }
                                            );
                                }

                            self.linkEdit.form.valid();  
                        
                        })
            

             
                
        
         }
         ,_init: function(){
             var self = this;
                if(this.options.mouseEvent == true && this.options.disabled == false )
                {
                    self._trigger( 'action', null, this.ui() ); 
                }
                
                $(window).resize(function() {
                    if(self.cancelButton != undefined){
                        self.cancelButton.position({ of:self.element, my:'center center', at:'center center', offset: 0 })
                        self.linkEdit.element .position({ of: self.cancelButton, my:'left top', at:'right bottom', offset: '-61px 8px', collision:'none none' })
                   
                    } 
                });
             
              
                 
             
         }
         ,_setOption: function( key, value ) {
              
              //this.linkEdit.button.unbind('.linkEdit')
              this.options[ key ] = value;
              //this._init()
              console.log(this.element)
         }
         ,destroy: function(){ 
             this.hide()
             this.element.unbind('.gadgetLink');
             this.linkEdit.element.remove()
             this.cancelButton.remove()
             $.Widget.prototype.destroy.apply(this);
          
         }
         ,ui: function(){ return{ cancelButton: this.cancelButton, linkEdit: this.linkEdit,  element: this.element, self:this } }
         ,setButton: function(){
             
             
         }
         ,show: function(){  
             
             var self = this;
             
             if(this.options.disabled == false )
             {
                 self._trigger( 'show', null, this.ui() ); 
                 
                 self.linkEdit.nicerInput.trigger('keyup')
                
                 this.cancelButton
                         .appendTo('body')
                            .css({'width': self.element.width(), 'height': self.element.height(), display:'block' })
                            .position({ of:self.element, my:'center center', at:'center center', offset: 0 })
                            .find('p')
                                .text(this.element.text())
                                .css({ 'font-size': self.element.parent().css('font-size')})
                                .css('margin-top', (self.cancelButton.find('p').height() / 2 * -1)) 
                            .end()
                     .css({' display':'none '})        
                     .fadeIn('fast')
                     .position({ of:self.element, my:'center center', at:'center center', offset: 0 })
                 
                 this.linkEdit.element
                     .css({'display':'block', height: 0})
                     .position({ of: self.cancelButton, my:'left top', at:'right bottom', offset: '-61px -120px', collision:'none none' })
                     .stop()
                     .animate({ 
                        'opacity': 10,
                        'height': [44, 'easeOutBack'],
                        'margin-top': [128, 'easeOutBack']
                     }//,
                     //{
                     //    complete: function(){}
                     //}
                     )  
             } 
         }
         ,hide: function(){
              
              var self = this;
              
              if(this.options.disabled == false )
              {
                  self._trigger( 'hide', null, this.ui() ); 
                    
                  this.cancelButton.fadeOut('fast')
                  self.linkEdit.button.unbind('.linkEdit')
                  this.linkEdit.element
                      .stop()
                      .animate({ 
                          'opacity': 0,
                          'height': [0, 'easeOutBack'],
                          'margin-top': [240, 'easeOutBack']
                      },
                      { 
                          complete: function() { $(this).css({'display':'none', 'margin-top': 0});  }
                      });
              }
          }
     });



})(jQuery);