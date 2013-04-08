//////////////////
// GADGET MENU  //
////////////////////////////////////////
                // CALLBACKS:         // 
                // action             //
                // OPTIONS:           //
                // -button.name       //
                // -selectable:       //
                //      single,       //
                //      none,         //
                //      multiSelect   //
                //                    //
                ////////////////////////
                  
( function ( $ ) {  
  $.widget( "gadget.dev_gadgetMenu", {
      options: { 
        selectable: 'none' 
      , data: {}
      
      }
    , _create: function () {
      var self = this
        , e = this.element
        , menuExist = this.element.find( 'menu' )
        ; 
      ////////////////////////////////      
      // IF A BUTTON IS STATIC HTML //
      ////////////////////////////////  
      menuExist
        .find( 'a' )
        .each( function () {
          var $this = $( this )
            , button = 'button.' + $this.text()
            ;
          self.options[ button ]  = {};
          if ( $this.is( 'a[class*="-selected"]' ) ) self.options[ button ][ 'selected' ] = true
        })//END EACH
        ; 
              
        e.gadgetCreate( $.extend( this.options, { addClass: 'CONTAINER-'+this.options.type } ) );
        if ( menuExist.length ) {
          $.extend( this, { menu: menuExist.addClass( 'FUNCTION-' + this.options.type ), buttons: {} });
        } else {
          $.extend( this, {  menu: $( '<menu>' ).appendTo(e).addClass( 'FUNCTION-'+this.options.type ), buttons: {} });
        }//END IF/ELSE
               
        this._buttonsCreate();
        this._setFirstLast();
    }//END CREATE

// SPLIT:                
            ,_split:function(o){
                
                var  o = this.options, commands = []
                   
                for(option in o)
                {
  
                   if(option.indexOf('.') !== -1 )
                   {
                       var command = option.split('.');
                           command[0] = o[option];
                           commands.push(command);     
                   }
                }
                
                return  commands
            }
            
// SETOPTIONS:           
            ,_setOption: function( key, value ) {
                
                this.options[ key ] = value;
                
                
                this.element.gadgetCreate(this.options);
                this._buttonsCreate();
                this._setFirstLast()
                
                // MENU DISABLE / ENABLE
                if(this.options.disabled == true)
                {
                    this.element.slideUp('slow')
                }
                
                if(this.options.disabled == false) {
                        
                    this.element.slideDown('slow') 
                }
            }
            
// DESTROY:
            ,destroy: function() { 

                this.element.find('.FUNCTION-'+this.options.type).remove()
                this.element.removeClass('CONTAINER-'+this.options.type)
                $.Widget.prototype.destroy.apply(this);
            }
// INIT:
            ,_init: function(){}
            
// SETFIRSTLAST:        
  ,_setFirstLast: function () {
    var self = this
      , o = self.options
      , first = self.element.find( 'a.ITEM-' + o.type + ':data(dev_gadgetButton.options.disabled!=true):first' )
      , last = self.element.find( 'a.ITEM-' + o.type + ':data(dev_gadgetButton.options.disabled!=true):last' )
      , firstList = first.parent().attr( 'class' )
      , lastList = last.parent().attr( 'class' );
       
       first = first.attr( 'class' );
       last = last.attr( 'class' );
   
   
    self.element
      ///////////////////////////////
      // REMOVE FIRST/LAST CLASSES //
      ///////////////////////////////
      .find( '.ITEM-' + o.type + '-first , .ITEM-' + o.type + '-last' )
        .addClass( 'ITEM-' + o.type )
        .removeClass( 'ITEM-' + o.type + '-first ITEM-' + o.type + '-last' )
        .end()
      ///////////////////////
      // SET FIRST CLASSES //
      ///////////////////////
      .find( 'a.ITEM-' + o.type + ':data(dev_gadgetButton.options.disabled!= true):first' )
        .parent( 'li.ITEM-' + o.type )
          .removeClass('ITEM-' + o.type )
          .attr('class', 'ITEM-' + o.type + '-first ' + firstList )
          .addClass( 'ITEM-' + o.type+'-first' )
          .removeClass('ITEM-'+o.type)
          .end() 
        .attr('class', 'ITEM-' + o.type + '-first ' + first )
        .removeClass('ITEM-'+o.type)
        .end()   
      //////////////////////
      // SET LAST CLASSES //
      //////////////////////
      .find('a.ITEM-' + o.type + ':data(dev_gadgetButton.options.disabled!=true):last')
        .parent( 'li.ITEM-' + o.type )
        .removeClass( 'ITEM-' + o.type )
        .attr('class', 'ITEM-' + o.type + '-last ' + lastList )
        .removeClass('ITEM-'+o.type)
        .end() 
      .attr('class', 'ITEM-'+o.type+'-last ' + last)
      .removeClass( 'ITEM-'+o.type )
      .end();   
  }

// BUTTONSCREATE:                 
            ,_buttonsCreate: function(){
                
                // CREATE BUTTON COMMANDS WITH METHOD NAME
                var commands = this._split();

                for(command in commands)
                {
                    var newButton = { element: this.options.element || this.element, data: this.options.data }; 
                   
                    newButton.selectable = this.options.selectable
                    
                    // CREATE BUTTON NAME
                    newButton.text = commands[command][1];
                  
                   
                  
                    
                    // IF IT IS A SIMPLE BUTTON DEFINITION 
                    // WITH ONLY A FUNCTION     
                    if(!jQuery.isPlainObject(commands[command][0]))
                    {
                        newButton.action = commands[command][0]
                    }
                    
                    // OR IT IS A BUTTON DEFINITION 
                    // WIDTH A FULL SET OF BUTTON OPTIONS
                    else if(jQuery.isPlainObject(commands[command][0])){
                        $.extend(newButton, commands[command][0] )
                        
                    }
                    
                    // CREATE CLASS
                    newButton.addButtonClass =  'ITEM-'+this.options.type;
                    
                    // DESTROY BUTTON
                    if(commands[command][0] == 'destroy')
                    {
                        this.buttons[commands[command][1]].dev_gadgetButton('destroy') 
                        delete this.buttons[commands[command][1]]
                        delete this.options['button.'+ commands[command][1]]
                     }
                     else if(commands[command][0] == 'disable')
                     {
                        this.buttons[commands[command][1]].dev_gadgetButton('disable') 
                     }
                     else if(commands[command][0] == 'enable')
                     {
                        this.buttons[commands[command][1]].dev_gadgetButton('enable') 
                     }
                     // UPDATE BUTTON
                     else if (typeof  this.buttons[commands[command][1]] != "undefined") 
                     {
                        if(!commands[command][0].buttonPosition || commands[command][0].buttonPosition - 1 == command )
                        {
                            
                            this.buttons[commands[command][1]].dev_gadgetButton('option', newButton ) 
                        }
                         
                     }
                     // EXITING STATIC BUTTON
                     else if(this.element.find('a[text="'+commands[command][1]+'"]').length){
                        
                      
                        this.buttons[commands[command][1]] = this.element.find('a[text="'+commands[command][1]+'"]')
                            .unwrap()
                            .removeClass()
                            .dev_gadgetButton( newButton )
                            
                            
                     
                    }
                     // ADD BUTTON 
                     else {
                          
                        this.buttons[commands[command][1]] = $('<a></a>')
                            .appendTo( this.menu )
                            .dev_gadgetButton( newButton )
                    }
                }
            }
        }); 

})(jQuery);




