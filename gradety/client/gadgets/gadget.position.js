//   $.gadgetPosition().hide() = All gadgetsPosition elements will be hidden
//   $('somedomelement, somedomelement').gadgetPosition().hide() = gadgetsPosition Elements that are in relation to the selcted elements (somedomelements)  will be hidden

//   options: 'refresh'
//   $.gadgetPosition('refresh') = All gadgetsPosition elements position will be refreshed
//   $('somedomelement, somedomelement').gadgetPosition('refresh') = gadgetsPosition Elements that are in relation to the selcted elements (somedomelements)  will be refreshed




jQuery.gadgetPosition = function(array, options, name)
 {
     var $array = array;

     if(array == undefined || array == 'refresh' )
     { 
         $array =  $('div:data(gadget.type=position)');
         //console.log('test', $array)  
     };  
     
     
 
     var opts = jQuery.extend({}, options); 
     var positionHelpers = $();
 
     if(options !== undefined && array !== undefined)
     {
         for(var i = 0; i < $array.length; i++ )
         {
             var item = $array[i]     
     
             if(opts.position.of == '' ||  opts.position.of == undefined )
             {
                 opts.position.of =  item 
             };
             
            
                                     
                                   
             var newPositionHelper = $('body').GADgetoMake( $.extend({addClass: 'STICKER' }, opts) , 'position>>'+name, item);

            $.extend( positionHelpers , newPositionHelper );
             // SAFARI daoes't work widthout that :( 
             //$.gadgetPosition('refresh');
          }  
             
          return positionHelpers
     }    
 
     if(options == undefined && array !== 'refresh')
     {
         if(array !== undefined )
         {
       
             
             for(var i = 0; i < $array.length; i++ )
             {
                 var helperList = $(':data(gadget.type=position)').filter(function(){ return $(this).data('gadget').parent ==  $array[i] });
                 if(helperList.length) 
                 {
                     //positionHelpers.push(helperList);
                      $.extend(positionHelpers, helperList) 
                 } 
                 //return helperList 
                
             }
            return  positionHelpers//.each(function(){ this }) 
             
             
             
         } 
         else {
             return $array  
         }
     } 
     else if(array == 'refresh' || options == 'refresh' ){ 
   
         $array.GADgetoRefresh()
         return $array
     }
 };

 jQuery.fn.gadgetPosition = function(options, name){
     return jQuery.gadgetPosition(this, options, name);
 };
