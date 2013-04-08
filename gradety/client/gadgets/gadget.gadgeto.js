////////////////////
// GADGET CREATE  //
//////////////////////////////////////////////
                  // CALBACKS:              //
                  // beforeCreate, created  //
                  ////////////////////////////
(function($) {  
    
        $.widget( "gadget.gadgetCreate", {  
    // OPTIONS:              
                options: {
                    type: 'div'
                   ,id: ''
                }

    // CREATE:        
                ,_create: function(){ 
                     
                     var self = this, o = this.options;

                     $.extend( this, { parent: this.element });

                     this._trigger( "beforeCreate", null, this.ui() );

                     self._filter();

                     //$.extend( this, {  element: $('<'+ o.tag +'>').attr('id', o.id ).appendTo(this.element) });

                     self._chaining();

                     this._trigger( "created", null, this.ui() );
                     var newOptions = this.options
                     
                     return newOptions  
                }
                
    // INIT            
                ,_init: function(){  }            

    // FILTER:
                ,_filter: function(){
                     
                     var filteredOpts = {chain:{css:{}}};  
                     var $styleTester = $(document.createElement('div'));
                 
                     var opts, methods; 
                         opts = this.options; 

                     for(methods in opts)
                     {
                         // IF IT IS A CSS PROPERTY
                         if(!$.isFunction(opts[methods])) // prevents triggering of a callback function
                         {
                             $styleTester.css(methods, opts[methods])
                         }
                         
                         if($styleTester.attr('style') !== undefined)
                         {
                             filteredOpts.chain.css[methods] = opts[methods]
                             $styleTester.removeAttr('style')
                         } 
                    
                         // IF IT IS A CSS JQUERY CAINING FUNCTION
                         else if($.isFunction($styleTester[methods]) )
                         {
                             filteredOpts.chain[methods] = opts[methods]
                         } 
                    
                         // IF IT IS A WIDGET OPTION
                         
                         else {
                             filteredOpts[methods] = opts[methods]
                         }
                     }
                     //console.log('filter',  filteredOpts)
                     // NEW WIDGET OPTIONS
                     this.options = filteredOpts
                }
        
    // SETOPTION:           
                ,_setOption: function( key, value ) {
        	     
            	     this.options[ key ] = value;
            	  
            	     this._filter();
                     this._chaining();
                     
                 }
        
    // CHAINING:
                ,_chaining: function() { 
                
                    var opts, methods; 
                        opts = this.options.chain; 
                        
                    for(methods in opts)
                    {   
                        var refOptions = {}
                        
                        if($.isArray(opts[methods])){
                            
                            this.element[methods](opts[methods][0],opts[methods][1])
                        }
                        
                        else if( $.isPlainObject(opts[methods]))
                        {
                        
                            for(i in  opts[methods])
                            {
                                if($.isFunction(opts[methods][i]) )
                                {
                                    refOptions[i] = opts[methods][i]()
                                }
                            
                                else {
                                    refOptions[i] = opts[methods][i]
                                }
                            }    
                        
                            // DO CHAINING like array.methods(refOptions);
                            this.element[methods](refOptions)
                        }
                        else {
                            
                            if($.isFunction(this.element[methods]) || methods.search('bind') !== -1 )
                            {
                                // find a way to work widthout 'bind' in the string
                                //console.log(methods.search('bind'), methods)
                            
                                if(methods.search('bind') !== -1 )
                                {
                                   
                                    var eventType = this._firstLetter(methods.replace(/bind/g, ""),'lower')
                                    this.element.unbind(eventType)
                                    this.element.bind(eventType, opts[methods])
                                }
                            
                                else {       
                                 
                                    this.element[methods](opts[methods])
                                }
                             } 
                             else {
                                
                                 this.element.dev_gadgetButton(methods,  opts[methods] )
                             }
                         }
                    };
                    
            }
            ,_firstLetter: function (string, changeTo)
            {
            //--------------------------------------------
            // If changeTo is set to lower firstletter 
            // will be lowercase    
            //-------------------------------------------- 
                if(changeTo == 'lower')
                {
                    return string.charAt(0).toLowerCase() + string.slice(1);
                } 
             //--------------------------------------------    
             // else firstletter will changed to uppercase   
             //--------------------------------------------   
                else if(changeTo == 'upper'){
                    return string.charAt(0).toUpperCase() + string.slice(1);
                };
            }
            
             
    // UI
            ,ui: function(){ return { parent: this.parent, element: this.element };}        

    // DESTROY:        
            ,destroy: function() { 
            
                this.element.unbind().remove();
                $.Widget.prototype.destroy.apply(this);
            }
        }); 

})(jQuery);





// !!!!!!!!!!!!!!!!!!!!!!
// OLD
// !!!!!!!!!!!!!!!!!!!!!!




// CHAINING
    jQuery.GADgetoChaining = function(array, options){

        var opts, methods; 
            opts = options; 
        
        //console.log('o', options)
        
        for(methods in opts)
        {   
           var refOptions = {}
       
          
           if(jQuery.isPlainObject(opts[methods])){
               //console.log('oA', opts[methods])  
               for(i in  opts[methods])
               {
                   if(jQuery.isFunction(opts[methods][i]) )
                   {
                       
                       refOptions[i] = opts[methods][i]()
                   }
                   else {
                       refOptions[i] = opts[methods][i]
                   }
               }    
             // DO CHAINING like array.methods(refOptions);
             array[methods](refOptions)
           }
           else {
               // console.log('oB', opts[methods])   
                     
                   if(jQuery.isFunction(array[methods]) || methods.search('bind') !== -1 ){
                   
                       // find a way to work widthout 'bind' in the string
                       //console.log(methods.search('bind'), methods)
                   
                       if(methods.search('bind') !== -1 )
                       {
                           
                           var eventType = GOGOfirstLetter(methods.replace(/bind/g, ""),'lower')
                      
                        
                           array.unbind(eventType)
                           array.bind(eventType, opts[methods])
                      
                       }
                       else{       
                          
                           array[methods](opts[methods])
                       }
                   
                   
                  } 
                  else {
                        
                      array.gadgetButton(methods,  opts[methods] )
                  }
           }
           
          
           
         
           
        };
   
        return array;
    };
    jQuery.fn.GADgetoChaining = function(options){
        return jQuery.GADgetoChaining(this, options);
    };


// MAKE
//  //$('target').GADgetoMake({chaining }, 'type>>tag.class/or/#id=>name:namespace', related to as object  )
    jQuery.GADgetoMake = function(array, options, name, relation){
        
        // If no target is defined
        if(typeof options ==  'string'){
           var relation = name
           var name = options
           var options =  array  
           var array = undefined
        } 
        //console.log(array,options, name ,relation)
        
     
        
        
        var made = [];
     
        
        var opts = jQuery.extend({}, options); 
        
        
        var task =  GOGOcreateTask(name); var element = task.element;  var ident =  task.ident; var type =  task.type;
        //console.log('CHAINING: element:', element, 'ident:', ident)
        
        
          var addName; var addNamespace; var addNode; var addAttr =""; var addType;
        
          if($.isArray(ident))
          {
            addName = ident[0];
            addNamespace = ident[1];
          }
          else{
            addName = ident;    
          }
        
          if($.isArray(element))
          {
            
              if(element[0] == 'item')
              {
                  alert('item is not supported for now');
                  
              } 
 
              
              else if(element[element.length -2] == '#' || element[element.length-2] == '.')
              {
                    addAttr = [element[1] ,element[2]];
                    addNode = element[0];
              }

          } 
          else {
              addNode = element;
          }
        
        
        
        //var seperatedName = GOGOseperate(name,'.');
    
        if(options !== undefined )//&& array !== undefined)
        {
    
            function makeDomElement(pos)
            {    
                var gadget = { 
                    name:addName
                   ,namespace:addNamespace
                   ,chaining: opts
                   
                };
                
                if(type !== undefined)
                {
                  gadget.type = type 
                }
               
               
                if(relation == undefined){
                    var targetToAppend = pos  
                    gadget.parent = pos    
                }
                else {
                    var targetToAppend = pos 
                    gadget.parent = relation 
                }
                
               
                
               
       
                var make = document.createElement(addNode);
                var $make = $(make);   
                if($.isArray(addAttr))
                {   
                    var classId = 'class'
    
                    if(addAttr[0]== '#'){
                        classId = 'id';
                    }
                    
                    $make.attr(classId,addAttr[1])
                }
               
                if(array !== undefined)
                {
                   $make.data($.extend( {gadget: gadget}, $(make).data()))
                        .appendTo(targetToAppend)
                        .GADgetoChaining(gadget.chaining);
                 }
                 else {
                    $make.data($.extend( {gadget: gadget}, $(make).data()))
                         .GADgetoChaining(gadget.chaining);
                 }
                 
                 made.push(make)
           }
       
           if(array !== undefined)
           {
               for(var i = 0; i < array.length; i++ )
               {
                   makeDomElement(array[i])
               }
            } 
            else {
               makeDomElement()  
            }

           
           
            return $(made)
        }
    };

    jQuery.fn.GADgetoMake = function(options, name, relation)
    {   
        return jQuery.GADgetoMake(this, options, name, relation);
    };

// REFRESH
    jQuery.GADgetoRefresh = function(array, options){
    
    
        
        for(var i = 0; i < array.length; i++ )
        {
            var $item = $(array[i]);    
             
           var gadget = $item.data('gadget'); 
           gadget = { 
                    parent: gadget.parent
                   ,name: gadget.name
                   ,namespace: gadget.namespace
                   ,chaining: gadget.chaining
            };
          
            var temp = $item.data() 
            
            $item.data($.extend({gadget:gadget}, $($item).data())).GADgetoChaining(gadget.chaining);
         
        }
        
        return array
    }

    jQuery.fn.GADgetoRefresh = function(options)
    {   
        return jQuery.GADgetoRefresh(this, options);
    };
