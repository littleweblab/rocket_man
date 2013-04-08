(function($){

jQuery.fn.mutate = function(props, callback, timeout){

	if(!timeout) timeout = 10;
	
	return this.each(function(){
		var $this = $(this), 
			func = function(){ __check.call(this, $this) },
			data = { props: props.split(","), func: callback, vals: [] };
		    offWidth =  $this[0].offsetWidth;

		    $.each(data.props, function(i) {
		        
		        if(data.props[i] == 'size')
		        { 
		            data.vals[i] = offWidth; 
		        } 
		        else { 
		            
		            data.vals[i] = $this.css(data.props[i]); 
		        }; 
		    
		    });
		      
		    $this.data('watch', data);
	        $this.data('watch').interval = setInterval(func, timeout);
	        
	});
	
	function __check($this) {
    
            var data = $this.data('watch'),
    			changed = false,
    			temp	= "",
    			interval = $.extend({},$this.data('watch')).interval; 
		
    		if(data != undefined && data.props !== undefined )
    		{
    		    for(var i=0;i < data.props.length; i++) 
    		    {
                    if(data.props[i] == 'size')
                    {
                        var h = $this[0].offsetHeight;
			            if(data.vals[i] != h)
			            {
			                data.vals[i] = h;
                			changed = true;
                			break;
                		} 
			        } 
			            
			        if(data.vals[i] != temp)
			        {
        				    data.vals[i] = temp;
        				    changed = true;
        				    break;
        			}
    			}
    		}
    		else {
    	        //destroy yourself
    		    clearInterval(interval)
    		}
    		if(changed && data.func) {
    			data.func.call($this, data);
    		}
    		//console.log('stil watch')
  
    	
    }
}
jQuery.fn.unmutate = function(){
   
    $this = $(this);
    var interval = $.extend({},$this.data('watch')).interval; 
    clearInterval(interval);
    $this.removeData('watch')
   
}


})(jQuery);


// IS CHILD OF?
jQuery.fn.isChildOf = function(b){ 
    return (this.parents(b).length > 0); 
};