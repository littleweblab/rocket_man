// !!!
// doesn't support stopEvents('.namespace')/startEvents('.namespace')
// doesn't support event data objects

(function( $ ){

  $.fn.stopEvents = function( eventsToStop ) {  

    return this.each(function() {
        
        var $this = $(this);
        // SPLIT EVENTS INTO AN ARRAY
        var getEvents =  eventsToStop.split(',');
        var saveEvents = {};
        
        // CLEANUP STRINGS (whitespaces)
        for(var a = 0; a < getEvents.length ; a++)
        {
           getEvents[a] = $.trim(getEvents[a])
        }
        
        // FILTER EVENTS TO STOP/UNBIND
        for(var i = 0; i < getEvents.length; i++)
        {
            // SPLIT EVENTS INTO TYPE/NAMESPACE
            var getEvent = getEvents[i].split('.');
            var newEvent = $this.data('events')[ getEvent[0] ];
            var eventCopy = {}
            
            // MAKE A HARD COPY OF .data()
            $.extend( true , eventCopy, $this.data('events') );
           
            if( newEvent !== undefined)
            {
                // WITHOUT NAMESPACE
                if( getEvent.length == 1)
                { 
                    // IF EVENT TYPE STILL NOT EXIST IN THE saveEvents OBJECT
                    // CREATE IT AN SAVE FILTERED EVENT INTO IT
                    if(saveEvents[ getEvent[0]] == undefined)
                    {
                        saveEvents[ getEvent[0] ] =  eventCopy[ getEvent[0] ] 
                    } 
                    // ELSE PUSH THE EVENT 
                    else {
                        saveEvents[ getEvent[0] ].push( eventCopy[ getEvent[0] ] )   
                    }
                } 
                // WITH NAMESPACE
                else {
                   
                    for(var y = 0; y < $(this).data('events')[ getEvent[0]].length; y++ )
                    {
                        // FIND IN THE EVENT ARRAY THE EvENT WITH THE RIGHT NAMESPACE
                        if ( $this.data('events')[ getEvent[0]][y].namespace == getEvent[1])
                        {
                            // IF EVENT TYPE STILL NOT EXIST IN THE saveEvents OBJECT
                            // CREATE IT AN SAVE FILTERED EVENT INTO IT
                            if(saveEvents[ getEvent[0]] == undefined)
                            {
                                saveEvents[ getEvent[0] ] = [ eventCopy[ getEvent[0] ][y] ] 
                            }
                            // ELSE PUSH THE EVENT 
                            else {
                                saveEvents[ getEvent[0] ].push( eventCopy[ getEvent[0] ][y])  
                            }
                        }
                    }
                }
          }
    }      
        
        
        // SAVE FILTERED EVENTS AS DATA ELEMENT FOR LATER STARTS
        $this.data('saveEvents',   $.extend( true , {}, saveEvents) );
  
        // UNBIND THE FILTERED EVENTS
        for(var o = 0; o < getEvents.length; o++)
        {  
            $this.unbind(getEvents[o]);
        }
       
    });

  };
})( jQuery );


(function( $ ){

  $.fn.startEvents = function( eventsToStart ) {  

    return this.each(function() {
        
        
        var $this = $(this);
        var $data = $this.data('saveEvents')
        // SPLIT EVENTS INTO AN ARRAY
        var getEvents =  eventsToStart.split(',');
        var namespaceFilter = []
        var savedEvents = []
        
       
       
        for(var a = 0; a < getEvents.length ; a++)
        {
           // CLEANING WHITESPACES
           getEvents[a] = $.trim(getEvents[a])
           // CREATE ARRAYS OF THE EVENTS WIDTH TYPE / NAMESPACE
           namespaceFilter.push(  $.trim(getEvents[a]).split('.'))
        }
        
        // FILTER THE SAVED EVENTS TO RETORE THE SELECTED ONES
        for(var b = 0; b < namespaceFilter.length ; b++)
        {
            var eventType = namespaceFilter[b][0]
            var namespace = namespaceFilter[b][1]
            
            if($data[eventType] !== undefined )
            {
                // NO NAMESPACE
                if( namespace == undefined){
                      savedEvents.push(  $data[eventType] )
                } 
                // WIDTH NAMESPACE
                else {
                   
                     var eventChild = $data[eventType]
          
                     for(var z = 0; z < eventChild.length ; z++)
                     {
                        if(eventChild[z].namespace == namespace )
                        {
                          savedEvents.push( [eventChild[z]])
                        }
                     }
                    
                    
                }
            }
        }
        // BIND EVENTS AGAIN
        for(var i = 0; i < savedEvents.length; i++)
        {   
             var savedEvent = savedEvents[i]
          
             for(var g = 0; g < savedEvent.length; g++)
             {
                 // WIDTH NAMESPACE
                 if(savedEvent[g].namespace !== '')
                 {
                     $this.bind(  savedEvent[g].type +'.'+ savedEvent[g].namespace , savedEvent[g].handler  )
                 } 
                 // WITHOUT NAMESPACE
                 else {
                     
                     $this.bind(  savedEvent[g].type , savedEvent[g].handler  )
                 }
              }
        }
        
        //$this.removeData('saveEvents')
    });
  };


})( jQuery );
