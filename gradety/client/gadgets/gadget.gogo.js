// HELPER FUNCTIONS
    
    function GOGOisString(input)
    {
        return typeof(input)=='string';
    };

    function GOGOseperate(toSeperate, seperator)
    {
        if(toSeperate.indexOf(seperator) !== -1)
        { 
           var seperated = toSeperate.split(seperator)
           
           return seperated  
        }
        return toSeperate
    };
    
    function GOGOcreateTask(task)
    {
        var tasks = {}
        
        var firstSeperate = GOGOseperate(task,'>>');
    
     
        if($.isArray(firstSeperate))
        {
            tasks.type = firstSeperate[0]
            var elementIdent = firstSeperate[1]
        
        } else {
            tasks.type = undefined
            var elementIdent = task
        }

        var secondSeperate = GOGOseperate(elementIdent,'=>');

        // if name is not only a name
        if($.isArray(secondSeperate))
        {
             tasks.ident = GOGOseperate(secondSeperate[1],':');


            // element of HTML width id
            if(secondSeperate[0].indexOf('#') !== -1)
            {
                 tasks.element = GOGOseperate(secondSeperate[0],'#');
                // tasks.element.push('#')
                 
                tasks.element = [tasks.element[0],'#', tasks.element[1]  ]
                 
            }
            // element of HTML width class
            else if(secondSeperate[0].indexOf('.') !== -1){
                tasks.element = GOGOseperate(secondSeperate[0],'.');
                //tasks.element.push('.')
                tasks.element = [tasks.element[0],'.', tasks.element[1]  ]
            } 
            // everything else
            else {
                tasks.element = GOGOseperate(secondSeperate[0],':');
            }
        } 
        else{ 
            tasks.ident =   GOGOseperate(secondSeperate,':');
          
        }
         //console.log('createTask:', tasks)
       return tasks   
    }

    // CHANGE FIRST LETTER TO UPPER/LOWERCASE
    function GOGOfirstLetter(string, changeTo)
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
    };
