var empty = {AREA:1,BASE:1,BR:1,COL:1,COMMAND:1,EMBED:1,HR:1,IMG:1,INPUT:1,KEYGEN:1,LINK:1,META:1,PARAM:1,SOURCE:1,WBR:1};

function toFab ( node, depth ) {
  depth || ( depth = 0 );

  var attrs = node.attributes
    , children = node.childNodes
    , name = node.nodeName.toUpperCase()
    , padding = Array( depth + 1 ).join( "  " )
    , ret = padding + "( ";
  
  if ( node.nodeType == 3 ) {
    return ret +=
      "\"" +
      node.nodeValue
        .replace( /\n+/g, "\\n" )
        .replace( / +/g, " " ) +
      "\" )\n"
  }
  
  ret += name;
  
  if ( attrs && attrs.length ) {
    ret += ", { ";
    
    for ( var i = 0, attr, name; attr = attrs[ i ]; i++ ) {
      if ( i ) ret += ", ";
      
      name = attr.name;
      if ( /\W/.test( name ) ) name = "\"" + name + "\"";

      ret += name + ": \"" + attr.value + "\"";
    }
    
    ret += " }";
  }
  
  ret += " )\n";
  
  if ( name in empty ) return ret;
  
  for ( var i = 0, child; child = children[ i ]; i++ ) {
    ret += toFab( child, depth + 1 );
  }
  
  return ret + padding + "()\n";
}