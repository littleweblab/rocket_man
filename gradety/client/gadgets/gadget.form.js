(function($){  
    $.widget("gadget.dev_gadgetForm", {
        options:{
           
             target: undefined
           , arrowSize: undefined //small
           , special: undefined
           , minValue: 0 //For stepper
           , maxValue: 1000//For stepper
           , highlight: function(event, ui) {
           
            
               ui.element
                    .closest('.FORM-item')
                        .css('background-color', '#cddef0')
                        .stop()
                        .animate({'background-color': 'transparent'}, {duration:600, complete:function(){ $(this).css('background-color', 'transparent') } });
            }
            
        }
  ,_create: function () {
    var self = this
      , o = this.options
      ; 
    
   
    if ( self.element.data( 'special' ) ) self.type = self.element.data( 'special' );
    else if ( self.element[ 0 ].nodeName == 'SELECT' )  self.type = 'select-one'; 
    else if ( o.special == undefined ) self.type = self.element.attr( 'type' );
    else if ( $.isArray( o.special ) ) self.type = 'multi'; 
    else self.type = o.special;
   
    switch ( self.type ) {
      case 'text': self._createInput(); 
      break;

      case 'checkbox': self._createCheckbox(); 
      break;

      case 'radio': self._createRadio(); 
      break;

      case 'select-one': self._createSelect(); 
      break;

      case 'button': self._createButton(); 
      break;

      case 'submit': self._createButton(); 
      break;

      case 'color': self._createColor(); 
      break;

      case 'stepper': self._createStepper(); 
      break;

      case 'multi': self._createMulti(); 
      break;

      case 'file': self._createFile(); 
      break;
    }
             
    ///////////////////////////////////////////////////////////////// 
    // ADD CLASSES FROM THE ORIGINAL FORM ELEMENT TO THE NICER ONE //
    // IF IT ISN'T A BUTTON                                        //
    /////////////////////////////////////////////////////////////////
    if ( o.rapeClass == true && self.type != 'button' && self.type != 'submit' ) this.nicer.addClass( self.element.attr( 'class' ) );
    ///////////////////////
    // IF IT IS A BUTTON //
    ///////////////////////    
    else if ( o.rapeClass == true ) self.nicer.find( 'a' ).addClass(self.element.attr( 'class' ) );
    ////////////////////////////////
    // HIDE ORIGINAL FORM ELEMENT //
    ////////////////////////////////    
    if ( self.type != 'file' ) this.element.css('display', 'none');
  }//END CREATE
  
        ,_init:function(){
            var self = this, o = this.options;
             
        }
        ,_removeNicer:function(){
            var self = this, o = this.options;
               switch (self.type)
                 {
     				case 'text':
     				     self.nicer.remove();
     				break;

     				case 'checkbox':
     				     self.nicer.remove();
     				break;

     				case 'radio': 
     				     self.nicer.remove();
     				break;

     				case 'select-one': 
     				     self.nicer.remove();
     				break;

    				case 'button': 
    				    self.nicer.remove();
    				    
     				break;

    				case 'submit':
    				    self.nicer.remove();
     				break;

    			    case 'color': 
    			        self.nicer.remove();
     				break;

     				case 'stepper': 
     				    // SIBLING DOSN' T SEEMS TO WORK THIS WAY SO... LET'S TRY THIS
                        //self.nicer.siblings('.BUTTON-form-rightStepper,.BUTTON-form-rightStepper-mini, .BUTTON-form-leftStepper, .BUTTON-form-leftStepper-mini').remove()
                        self.nicer.parent().find('.BUTTON-form-rightStepper,.BUTTON-form-rightStepper-mini, .BUTTON-form-leftStepper, .BUTTON-form-leftStepper-mini').remove()
                        self.nicer.remove();
     				break;

    				case 'multi':
    				    self.element.closest('"*:has(.FORM-item)" ').css('display', 'inline-block');
    				    self.nicer.remove();
    				break;

    			  case 'file': 
    			    self.uploadButton.remove()
    			    self.element.unwrap();
    			  break;


          }
            
            
            self.element.css('display', 'block');
            
        }
        ,_setOption: function( key, value ) 
        {
            var self = this, o = this.options;
            
            self._removeNicer();
            self.options[ key ] = value;
            self._create();
        } 
        ,destroy: function(){ 
           
            this._removeNicer();
            this.element.css('display', 'block');
            $.Widget.prototype.destroy.apply(this);
        }
        ,_createMulti:function(){
           
            var self = this, o = this.options;
            var b = self.element.closest('"*:has(.FORM-item)" ').css('display', 'none');
            var v = self.element.val().split(' ');
            
            
            self.element.focusout(function(){
              
                self._trigger( 'change', null, self.ui()); 
            
            });
            
            self.nicer = $();
            
            $(o.special).each(function(i){
                
                var c = b.clone().css('display', 'inline-block');
                
                $(c).insertBefore(b)
                    .find('.FORM-item')
                    .html('<label class="FORM-label">'+ o.special[i]+ '</label>')
                
                
                    var input = $('<input type="text" value="'+v[i]+'" />')
                            .appendTo( c.find('.FORM-item') )
                            .dev_gadgetForm({ 
                            
                                special: 'stepper', 
                                change: function(event, ui){
                                
                                    v[i] = ui.newValue;
                                    self.newValue = v.join(' ');
                                    self.element.val(self.newValue);
                                    self.element.trigger('focusout');
                            }     
                        });
               
                $.merge(self.nicer,c);
            });
            
           self._trigger( 'action', null, self.ui()); 
          
        }
        ,_createInput: function(){
          var self = this
            , o = this.options
            ;
          
          if ( self.nicer == undefined ) {
            self.nicer = $( '<div class="FORM-input" ><p contentEditable="true">'+self.element.val()+'</p></div>');
            self.oldValue = self.nicer.find( 'p' ).text();
            self.newValue = self.nicer.find( 'p' ).text();
          }//END IF 
            
          if ( o.target == undefined ) self.element.before( self.nicer );
          else self._trigger( 'target', null, this.ui() );  
             
          if ( this.options.disabled == false ) {
            self.nicer
              .css('display', 'block')
              .keyup( function ( event ) {
                var $text = $( this ).text();
                if ( $text.length < 1 ) event.preventDefault();
                // VALIDATE MINVALUE FOR STEPPERS
                if ( parseInt( $text ) < o.minValue && o.special == 'stepper' ) {
                  self.newValue = o.minValue; 
                  self.element.val( o.minValue  );
                  self.nicer.find('p').text( o.minValue );
                }//END IF 
                // VALIDATE MAXVALUE FOR STEPPERS
                else if ( parseInt( $text ) > o.maxValue && o.special == 'stepper' ) {
                  self.newValue = o.maxValue 
                  self.element.val( o.maxValue  );
                  self.nicer.find('p').text( o.maxValue );
                }//END ELSE IF 
                else {
                  self.newValue = self.nicer.find('p').text();
                  self.element.val(self.newValue);
                }//END ELSE
                if ( o.keyEvents == true  ) self._trigger( 'change', null, self.ui() ); 
              })//END KEYUP
              .focusout( function () { 
                self._trigger( 'change', null, self.ui() ); 
                if ( self.newValue != self.oldValue ) self._trigger( 'highlight', null, self.ui() ); 
              })//END FOCUSOUT
              .bind( 'keydown.form', 'return', function ( event ) {
                event.preventDefault();
                $( this ).trigger( 'focusout' );
              })//END BIND
              ;
              self._trigger( 'action', null, this.ui() ); 
          }//END IF  
        }//END CREATE INPUT
        ,_createStepper: function(){
             var self = this, o = this.options;
            
             self._createInput();
             
             var number = parseFloat(self.element.val().match(/\d+/))
             var unit =  self.element.val().split(number)
             var thisPos = self.nicer.position();
             var padding = 0;
             var mini = '';
             var indent = 44
            // SETUP FOR MINI STEPPERS 
            
            if((self.element.width() ) <= 120 && o.arrowSize != 'large'){
                mini = '-mini'
                padding = 18;
                indent = 30;
                self.nicer.find('p').css('font-size', 11)
                
             }
             
             if(!isNaN(number) )
             {
                  
                  // new margins for inputDiv
                  // the distance for the Buttons
                  self.nicer.css({'padding-left':  padding, 'padding-right':  padding})
                         .children(':first')
                             .css({'width': 'auto'});
                  // add left Button           
              
                  self.nicer
                         .append('<a class="BUTTON-form-leftStepper'+mini+'">lower</a>')
                             .find('.BUTTON-form-leftStepper'+mini)
                               .click(function(){
                                     
                                     if( number - 1 >= o.minValue ){
                                        number = number - 1
                                         self.nicer.children('p:last').text(number + unit[1])
                                         self.newValue =  self.nicer.find('p').text();
                                         self.oldValue = self.nicer.find('p').text();
                                         self.nicer.trigger('keyup');
                                         self._trigger( 'change', null, self.ui()); 
                                         self._trigger( 'highlight', null, self.ui()); 
                                     }
                                     
                                 });
                  // add right Button    
                  
                 
                  self.nicer
                         .append('<a class="BUTTON-form-rightStepper'+mini+'">higher</a>')
                            .find('.BUTTON-form-rightStepper'+mini)
                             .click(function(){  
                                
                                 number = number + 1
                                 if ( number <= o.maxValue  ) {
                                   self.nicer.children('p:last').text(number + unit[1])
                                   self.newValue =  self.nicer.find('p').text();
                                   self.oldValue = self.nicer.find('p').text();
                                   self.nicer.trigger('keyup');
                                   self._trigger( 'change', null, self.ui()); 
                                   self._trigger( 'highlight', null, self.ui()); 
                                 }
                             });
              
              
             }
        }
        ,_createColor: function(){
             
             var self = this, o = this.options, $button;
             
             self._createInput();
             
             //http://stackoverflow.com/questions/3403882/javascript-one-shade-darker
             function shadeColor(color, shade) 
             {
                     var colorInt = parseInt(color.substring(1),16);

                     var R = (colorInt & 0xFF0000) >> 16;
                     var G = (colorInt & 0x00FF00) >> 8;
                     var B = (colorInt & 0x0000FF) >> 0;

                     R = R + Math.floor((shade/255)*R);
                     G = G + Math.floor((shade/255)*G);
                     B = B + Math.floor((shade/255)*B);

                     var newColorInt = (R<<16) + (G<<8) + (B);
                     var newColorStr = "#"+newColorInt.toString(16);

                     return newColorStr;
             }
             
             if(this.options.disabled == false )
             {
                 
                 $( '<a/>' )
                   .prependTo( self.nicer )
                   .addClass( 'BUTTON-form-color' )
                   .click( function () { self._trigger( 'colorPicker', null, self.ui() ); })
                   ; 
                 
                 self.nicer.addClass('FORM-input-color')
                           .find('p')
                              .css({'background':self.nicer.text(), color: shadeColor(self.nicer.text(), - 90) });
                              
                 self.nicer.focusout(function(){
                      self.nicer 
                          .find('p')
                              .css({'background':self.nicer.text(), color: shadeColor(self.nicer.text(), - 90) });
                 });
             }
                       
                       
            
        }
        ,_createButton: function(){
             
             var self = this, o = this.options;
             if(self.nicer  == undefined)
             {
               // CREATE NEW NICER SELECT
               self.nicer = $('<div class="FORM-button"><a class="FORM-button">' + self.element.val() + '</a></div>');
               self.newValue = self.element.val();
             }

             if(o.target == undefined)
             {
               self.element.after( self.nicer );
             } 
             else {

               self._trigger( 'target', null, this.ui());  
             }
             self.nicer.css('display', 'block');
             
             
             if(this.options.disabled == false )
             {
                 self.nicer.click(function(){

                   self.element.trigger('click');
                   self._trigger( 'change', null, self.ui()); 

                 });

                 self._trigger( 'action', null, self.ui()); 
             }
        }
        ,_createFile: function(){
          var self = this
            , o = this.options
            , name = self.element.data( 'text' ) || 'Upload'
            , activate = false
            ;
            
          if ( self.nicer == undefined ) {
            self.nicer =  
              $('<a class="FORM-fileupload"></a>')
                .text( name )
                .insertAfter( this.element )
                .append( this.element.css({ position: 'absolute', left: 0, top: 0, opacity: 0, width: 800, height: 800 }) )
                ;
                  
            }//END IF
             self._trigger( 'action', null, $.extend( { }, this.ui() ) );       
        }
        ,_createRadio: function () {
            
             var self = this, o = this.options;  
              
             if(self.nicer  == undefined)
             {
                 self.nicer = $('<div class="FORM-radio"></div>');
                 
                 if(self.element.attr('checked'))
                 {
                    
                    self.nicer.append('<span class="STICKER-checked"></span>')
                 }
              }

              if(o.target == undefined)
              {
                  
                  self.element.after( self.nicer );
              } 
              else {

                 self._trigger( 'target', null, this.ui());  
              }
              if(this.options.disabled == false )
              {
                 
                 self.nicer.click(function()
                 {         
                      // REMOVE SELECTION
                      $('input[name="' + self.element.attr('name') + '"]').each(function()
                      {
                          $(this).data('dev_gadgetForm').nicer.find('.STICKER-checked').remove();
                      });
                  
                      // SELECT NEW
                      self.nicer.append('<span class="STICKER-checked"></span>');
                      self.element[0].checked = true;
                      self.newValue = self.element.val()
                      self._trigger( 'change', null, self.ui()); 
                 });

                 self._trigger( 'action', null, self.ui()); 
              }
        }
        ,_createCheckbox: function(){
             var self = this, o = this.options;
             
             
             
             if(self.nicer  == undefined)
             {
               
               self.nicer = $('<div class="FORM-checkBox"></div>');
               
               if(self.element.attr('checked'))
               {
                   self.nicer.append('<span class="STICKER-checked"></span>')
               }
             }
             
             if(o.target == undefined)
             {
                 self.element.after( self.nicer );
             } 
             else {

                self._trigger( 'target', null, this.ui());  
             }
             if(this.options.disabled == false )
             {
                self.nicer.click(function()
                {
                    if($(this).find('.STICKER-checked').length)
                    {
                        self.nicer.find('.STICKER-checked').remove()
                        self.element.value = false
                        self.element[0].checked = false;
                        self.newValue = false
                        self._trigger( 'change', null, self.ui());
                    } 
                    else {

                        self.nicer.append('<span class="STICKER-checked"></span>');
                        self.element[0].checked = true;
                        self.element.value = false
                        self.newValue = true
                        self._trigger( 'change', null, self.ui() ); 
                     }
                });

                self._trigger( 'action', null, self.ui()); 
             }
        
        }
        
        ,_createSelect: function(){
             var self = this, o = this.options, $selectOpts = $('option', self.element), $selected = self.element.find('option:selected'), $menu;
             //console.log('self.nicer ',self.nicer )
             if(self.nicer  == undefined)
             {
                 // CREATE NEW NICER SELECT
                 self.nicer = $('<div class="FORM-select"><menu class="FUNCTION-option STICKER-dropdown"></menu></div>');
              
                 // DEFINE MENU
                 $menu = self.nicer.find('menu');
                 // ´CREATE SELCTED/FIRST OPTION
                 self.newValue = $('<li class="ITEM-option"><a class="ITEM-option firstOption"><span class="STICKER-dropDownIcon ICON-pixelArrowRight-mini"></span>'+ $selected.text() + '<span class="value">' + $selected.val() + '</span></a></li>').appendTo($menu);    
                 // ´CREATE ALL OPTIONS TO SELECT 
                 $selectOpts.each(function(){ $menu.append('<li class="ITEM-option"><a class="ITEM-option">' + $(this).text() + '<span class="value">' + $(this).val() + '</span></a></li>') });
             }
             else{
                
                $menu = self.nicer.find('menu'); 
             
             }
             
             
             if(o.target == undefined)
             {
                self.element.after( self.nicer );
             } 
             else {

                self._trigger( 'target', null, this.ui());  
             }
             
             self.nicer.css('display', 'block');
             
             // FIRST / LAST OPTION
             var $first =  $menu.find('li.ITEM-option:first'); 
             var $rest =   $menu.find('li.ITEM-option:not(:first)');
             
             // HEIGHT OF ALL & HEIGHT OF A SINGLE OPTION
             var $showAllHeight =   $menu.find('li.ITEM-option').height() * ( self.nicer.find('li.ITEM-option').length -1) ; 
             var $hideAllHeight =   $menu.find('li.ITEM-option').height();
             
             // SETUP DROPDOWN DIMENSIONS
             $menu.height( $hideAllHeight )
                  .width(self.element.css('width') );
            

             if(this.options.disabled == false )
             {
                 // TOGGLE DROPDOWN
                 $first.toggle( 
                     
                     function() { 
                                  var pos = { of: self.nicer ,my:'left top', at:'left top' ,offset:'0 0' ,collision:'none none' }
                                  // CUT AND PASTE MENU TO BODY TO SOLVE PROBLEMS WITH THE Z-INDEX
                                  $menu.appendTo('body')
                                       .position(pos)
                                       .css('z-index',10005)
                                       .animate({ height: $showAllHeight }, 'fast');  
                     }
                     ,function() { $menu.animate({ height: $hideAllHeight }, 'fast' )
                                        .position('destroy')
                                   
                                   $menu.appendTo(self.nicer).css({'display': 'block', left: 0, top: 0})
                                   // self._trigger( 'change', null, self.ui()); 
                     }
                 );
                 // BIND CLICK EVENT TO SELECT A NEW VALUE
                 $rest.unbind('click.select')
                      .children(':contains("'+  $selected.val()  +'")')
                        .parent()
                            .css('display','none')
                        .end()
                      .end()
                      .bind('click.select',function(){   
                            
                          var text = $(this).children('a').html();
                          
                         
                          $rest.filter( function() { return $(this).find('span.value').text() == $first.find('span.value').text() }).css('display','block');
                          $first.find('a').html( '<span class="STICKER-dropDownIcon ICON-pixelArrowRight-mini"></span>' + text );    

                          $rest.filter( function() { return $(this).find('span.value').text() == $first.find('span.value').text() }).css('display','none');
                          
                          
                          $first.trigger('click')
                          $showAllHeight = $menu.height() 
                          
                           
                           
                          // UPDATE ORIGINAL SELECT 
                          self.newValue =  $menu.find( "span.value").html(); 
                          self.element.val(self.newValue);
                          //self.element.trigger('change')
                          self._trigger( 'change', null, self.ui()); 
                          // COPY MENU BACK TO SELF.NICER SOLVES REZISE/SCROLL PROBLEMS
                          $menu.position('destroy')
                          $menu.appendTo(self.nicer).css({'display': 'block', left: 0, top: 0})
                          
                          // IF IN OPTIONS DEFINED: TRIGGERS CHANGE EVENT
                         
                      
                      });
                      
                      // TRIGGER ACTION
                      self._trigger( 'action', null, self.ui()); 
             
             }
             
             
        }
        
        ,ui: function(){ return{ newValue: this.newValue, nicer: this.nicer, element: this.element    } }
       
 
    
})


    
    



})( jQuery );