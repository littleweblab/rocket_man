//////////////////////
// GADGET BUTTON    //
////////////////////////////////////////////
                    // CALLBACKS:         // 
                    // action             //
                    // OPTIONS:           //
                    // -type              //
                    // -action            //
                    // -selectable:       //
                    //      single,       //
                    //      none,         //
                    //      multiSelect   //
                    //                    //
                    ////////////////////////   
(function($) {  
        
        $.widget( "gadget.dev_gadgetButton", {
// OPTIONS:            
            
            options:{ 
              selectable: 'none'
              , data: {}
              , selected: false
            }
// CREATE:   
            ,_create: function(){
                this.button = this.element; 
                var o = this.options;

                if($.isFunction(this['_'+this.options.type]))   
                {
                    this['_'+this.options.type]();
                }
                else if(this.element.parent().is('menu')){
                    
                    this.options.type = 'menu'
                    this._menu();
                }  
                else {

                    this.element.gadgetCreate( this.options );
                }
                
                 if(this.options.selected == true && this.options.type == 'menu' && o.disabled == false){
                         this.element.trigger('click.button') 
                 }
               
            }
            
// INIT:                            
            ,_init: function(){
           
                var self = this.element, o = this.options;
                if(o.disabled == false )
                {
                   
                    this._trigger( "action", null,  o.element ? $.extend( this.ui(), { element: o.element } ) : this.ui() );
                }
              
                
            }

// DESTROY:              
             ,destroy: function() { 
             
                 if($.isFunction(this['_'+this.options.type]))   
                 {
                     this.element.unbind()
                     this.buttonsBody.remove();
                 }
                 else{
                    this.element.unbind().remove();
                 }
                 
                 $.Widget.prototype.destroy.apply(this);
             }
             
// SETOPTION             
             ,_setOption: function( key, value ) {
                 var o = this.options;
                 this.options[ key ] = value;

                 //this._create()
             	 this.element.unbind()
             	  
                 if($.isFunction(this['_'+this.options.type]))   
                 {

                     
                     this['_'+this.options.type]();
                 }
                 else if(this.element.parent().is('menu')){
                      

                     this.options.type = 'menu'
                     this._menu();
                 }  
                 else {

                     this.element.gadgetCreate( this.options );
                 }

                  if(this.options.selected == true && this.options.type == 'menu' && o.disabled == false){
                          this.element.trigger('click.button') 
                  }
                 
                  if(o.disabled == false )
                  {
                      this._trigger( "action", null, this.ui() ); 
                  }
                 // ENABLE / DISBALE
                 if(this.options.disabled == true && this.options.type == 'menu')
                 {
                     this.button.hide()
                     this.buttonsBody.hide()
                     
                 } else if(this.options.type == 'menu'){
                      
                     this.element.show()
                     this.buttonsBody.show()
                     
                 }
                 
                 
             }
                               
// UI:             
             ,ui: function(){  
                
                 
                 
                 
                 if( $.isFunction(this['_'+this.options.type]) ) 
                 {
                     return{ button: this.element, buttonsBody: this.buttonsBody ,  parent: this.element.parent(),  data: this.options.data  }    
                 } 
                 else {
                    
                     return{ button: this.element,  parent: this.element.parent(),  data: this.options.data   }      
                 }}        
            
// ADD BUTTON:   
            ,_add: function(){

                var newOptions = $.extend( {}, this.options )
                    delete newOptions.text
                    delete newOptions.extraStyles
                if(this.buttonsBody == undefined){
                    
                                            this.element
                                            .addClass('BUTTON-addFlatMaxi-option')  
                                            .wrap('<div class="STICKER-stageAddButton"></div>')
                                            .html('<span class="STICKER-addFlatMaxiIcon ICON-add-maxi-option"></span>' + this.options.text )
                                            .parent()
                                            .gadgetCreate(newOptions);
                
                         this.buttonsBody =  this.element.parent()
                
                }
                
                else{
                    
                    this.element.html('<span class="STICKER-addFlatMaxiIcon ICON-add-maxi-option"></span>' + this.options.text )
                    this.buttonsBody.gadgetCreate(newOptions);
                }
                
            }
          
// MENU BUTTON:             
            ,_menu: function(){
                var self = this
                var newOptions = $.extend( {}, this.options )
                    delete newOptions.text
                    delete newOptions.extraStyles
                
                var buttonClass =  self.options.extraStyles  ? self.options.addButtonClass + ' ' + self.options.extraStyles : self.options.addButtonClass ;    
                if(self.buttonsBody == undefined)
                {
                 
                    self.element
                        .wrap('<li class="'+ buttonClass  + '"></li>')
                        .html( this.options.text )
                        .addClass( buttonClass )
                        .gadgetCreate(newOptions);
                        
                        
                    self.buttonsBody =  this.element.parent();
                   
                 }
                 else {
                    
                    this.element
                        .html( this.options.text )
                        .addClass( buttonClass)
                        .parents('li')
                        .addClass(buttonClass )
                        
                    self.element.gadgetCreate(newOptions);
                    if ( self.options.addClass ) this.element.parent().addClass( self.options.addClass )
                 }
             
                 
                 if(self.options.selectable == 'single' || self.options.selectable == 'multiSelect')
                 {
                     self.element.bind('click.button', function(){
                        
                          
                         if(self.options.selectable == 'single'){ 
                             self.buttonsBody.closest('menu').find('a,li').attr('class', function(i, c){ return c.replace(/selected/, ''); });
                             self.button.add(self.buttonsBody).addClass( self.options.addButtonClass+'-selected');  
                         }
                         
                         if(self.options.selectable ==  'multiSelect'){ 
                             
                             self.button.add(self.buttonsBody).toggleClass(self.options.addButtonClass+'-selected');
                         }
                     });
                 }
                 
           
              }              
          });       
            

})(jQuery);

