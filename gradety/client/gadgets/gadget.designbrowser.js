( function ( $ ) {
  $.widget( "gadget.designBrowser", {
    ////////
    options: {
    ////////
      projectId: ''
    , pageId: ''
    , maxColumns: 6
    , onAClick: function ( event, ui ) {}
    , onCreateListItem: function () { }
    , designs: []
    }//END OPTIONS
    
    //////////  
    , _create: function () {  
    //////////
      this.$listBody = $( '<div/>' ).appendTo( this.element ).addClass( 'CONTAINER-designBrowser' );
      this._createList( this.options.designs ); 
     
        
    }//END CREATE
    
    ////////
    , _init: function () {}
    ////////    
      
    //////////////
    , _createList: function ( designs ) {
    ////////////// 
        for ( var i in designs ) { 
          var $listItem = $( '<li/>' )
                .addClass( 'ITEM-designBrowserPreview' )
                .append( 
                  $( '<a/>' )
                    .addClass( 'ITEM-designBrowserPreview' ) 
                    .append(  
                       this._bindTriggerOnAClick(  $( '<span/>' ).addClass( 'STYLE-designBrowserIcon' ), designs[ i ].designid )
                     , $( '<span/>' ).addClass( 'STYLE-designBrowserLabel' ).text( designs[ i ].designname )
                    )//END APPEND
                )//END APPEND
                .appendTo( this.$listBody )
                ;
          this._trigger( 'onCreateListItem', null, $.extend( this.ui(), { row: this.row, listItem: $listItem , designId: designs[ i ].designid, projectId: this.options.projectId, pageId: this.options.pageId } ) );
        }//END LOOP 
        this._sort();
    }//END CREATE LIST
    
    ///////////////////////
    , _bindTriggerOnAClick: function ( $selector, designId ) {
    ///////////////////////
        var self = this;
        return $selector
                 .bind( 
                   'click.designBrowser'
                 , { designId: designId, projectId: this.options.projectId, pageId: this.options.pageId  }
                 , function ( event ) { self._trigger( 'onAClick', null, $.extend( self.ui(), { projectId: event.data.projectId, designId: event.data.designId, pageId: event.data.pageId } ) ); 
                 })//END BIND
                 ; 
    }//END _BINDTRIGGERONACLICK
    
    /////////////
    , _setOption: function ( key, value ) { 
    /////////////
        this.options[ key ] = value; 
        
        ////////////////////////////////
        // IF A NEW DESIGNLIST ARIVES //
        ////////////////////////////////
        if ( key == 'designs' ) {
           this.$listBody.html( '' );
           this._createList( this.options.designs );
        }//END IF
    }//END SETOPTION
    
    ////////
    , _sort: function () {
    ////////    
        var self = this
          , $listItems = this.$listBody.find( 'li.ITEM-designBrowserPreview' )
          , numberOfRows = 1
          , columnsOfRow = 1
          , row = null
          , maxcolumns = this.options.maxColumns
          , designsLength = $listItems.length
          ;

        //////////////////////////////////////////////////////////  
        // THIS IS TOBIS VERY FIRST AND ONLY JS CODE IN GRADETY //
        //////////////////////////////////////////////////////////
        while ( designsLength > numberOfRows * columnsOfRow ) {
          if ( columnsOfRow < maxcolumns ) {
            columnsOfRow += 1;
            numberOfRows += 1; 
          } else numberOfRows += 1;
        }//END WHILE 
        // END TOBIS CODE
      
        this.$listBody
          .find( 'li.ITEM-designBrowserPreview' )
            .each( function ( i ) {
              if ( ! row || i % columnsOfRow == 0 ) row = $( '<menu/>' ).appendTo( self.$listBody ).addClass( 'FUNCTION-designBrowserPreview' );
              $( this ).appendTo( row );
             })
             ;
    }//END _SORT
    
    ////////////
    , addDesign: function ( design ) { 
    //////////// 
        this.$listBody.find( 'li.ITEM-designBrowserPreview:first' ).unwrap(); 
        $.merge( this.options.designs, design );
        this._createList( design );
    }//END ADDDESIGN
    
    ///////////////
    , removeDesign: function ( $selector ) {
    ///////////////  
        this.options.designs.splice( $.inArray( $selector.data( 'designId' ), this.options.designs  ), 1 )
        $selector.remove();
        this.$listBody.find( 'li.ITEM-designBrowserPreview:first' ).unwrap();
        this._sort();
    }
    
    /////
    , ui: function () { return { element: this.element, listBody: this.$listBody  } }
    /////
    
    //////////
    , destroy: function () { 
    //////////  
        this.$listBody.remove();
        $.Widget.prototype.destroy.apply( this ); 
  }//END DESTROY
  })//END WIDGET
  ;
})( jQuery )
;


