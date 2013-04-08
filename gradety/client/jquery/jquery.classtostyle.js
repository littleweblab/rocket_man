/*!
 * jQuery.classToStyle - transfrorm css rules from the stylesheet into style attribute of the selected element, 
 * Copyright (c) 2007-2011 little web lab ug mail(at)littleweblab(dot)com | http://www.littleweblab.com
 * Dual licensed under MIT and GPL.
 * Date: 11/02/2011
 */
 
(function( $ ){ 
    
    $.fn.classToStyle = function( options ) {  
    
    return this.each(function() {
        
        var opts = $.extend({}, $.fn.classToStyle.defaults, options),
            $this = $(this),
            classes = $this.attr('class').split(' '), styles = {},
            id = $this.attr('id');
      
        ///////////////////////////
        // GET RULE ATTRIBUTES   //
        ///////////////////////////
        
            for(var n in classes) 
            {
                $.extend( styles, getStyle('.'+classes[n]) )
            }
            
        ///////////////////////////////
        // SET STYLES & REMOVE CLASS //
        ///////////////////////////////

            $this.css(styles)
                 .removeAttr('class');
    
         ///////////////////////////////////
         // FUNCTION THAT GETS THE STYLES //
         //////////////////////////////////////////////////////////////////////////////////////////////////////////////
         // WITH HELP FROM http://stackoverflow.com/questions/324486/how-do-you-read-css-rule-values-with-javascript //
         //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            
            function getStyle(className) {
                

                    var sylesheetLength = document.styleSheets.length, classes = [], save = {}

                  ///////////////////////////
                  // MERGE ALL STYLESHEETS //
                  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       
                  // WITH HELP FROM http://stackoverflow.com/questions/3354224/javascript-regex-how-to-get-text-between-curly-brackets //
                  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    
                    function getWordsBetweenCurlies(str) {
                      
                      var results = [], re = /{([^}]+)}/g, text;
                      
                      while(text = re.exec(str)) {
                        results.push(text[1]);
                      }
                      
                      return results.join();
                    }
                  
                  ///////////////////////////
                  // MERGE ALL STYLESHEETS //
                  ///////////////////////////

                      for(var i = 0; sylesheetLength > i; i++ )
                      {
                          // FOR IE OR THE OTHERS
                          var c = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
                          $.merge(classes, c) ;
                      }

                  ///////////////////
                  // FILTER RULES  //
                  ///////////////////

                      for(var x=0;x<classes.length;x++) 
                      {
                          if(classes[x].selectorText==className) 
                          {
                             // CLEAN UP
                              var rule = (classes[x].cssText) ? classes[x].cssText : classes[x].style.cssText;
                                  rule = getWordsBetweenCurlies(rule);
                                  
                                  rule = rule.replace(/ /g,"").split(';');
                                  rule.pop();
                                
                                  // SAVE
                                  for(n in rule)
                                  {
                                      var styleArray = rule[n].split(':')
                                         ,name = styleArray[0];
                                         
                                         styleArray.shift();
                                         styleArray = styleArray.join(":");
                                         save[name] = styleArray
                                  }
                            }
                      }
                // RETURN
                return save
             }
    
    }); // EACH END 

  }; //fn END

$.fn.classToStyle.defaults = {}

})( jQuery );