$.fn.textNodes = function() {
  var ret = [];
  this.contents().each( function() {
    var fn = arguments.callee;
      if ( this.nodeType == 3 || $.nodeName(this, "br") ) 
        ret.push( this );
      else $(this).contents().each(fn);
  });
  return $(ret);
}