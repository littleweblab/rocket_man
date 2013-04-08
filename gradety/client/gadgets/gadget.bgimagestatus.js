( function ( $ ) {
  $.widget("gadget.bgImageStatus", {
    options: {  
      $dropZone: ''
    , $styleable: ''
    , fileObj: {}
    , labelReplaceNewFile: 'Upload a new file' 
    , labelReplaceFromSource: 'Replace from files'
    , labelAddedBy: 'Added by'
    , labelNoFileFromSource:  'Add existing file'
    , remove: function ( event, ui ) { }
    , fileFromSource: function ( event, ui ) {  alert( 'Add file form existing source' ); }
    }
    //////////
    , _create: function () {}
    ////////// 
    
    ////////
    , _init: function () {
    ////////
        this._createNoFileView();
        this._createFileView();
        this._createFileReplaceView();
        this._toggleView();
    }//END _INIT
    
    /////////////
    , _setOption: function ( key, value ) {
    /////////////
        this.options[ key ] = value;
        if ( key == 'fileObj' ) {  
          //////////////////////
          // REFRESH FILEVIEW //
          //////////////////////
          this.$file.remove()
          this._createFileView();
        
          /////////////////////////////
          // REFRESH FILEREPLACEVIEW //         
          /////////////////////////////
          this.$fileReplace.remove();
          this._createFileReplaceView();
        
          this._toggleView(); 
        }//END IF
    }//END SETOPTIONS
    
    //////////////
    , _toggleView: function ( drag ) {
    //////////////
        if ( ! this.options.fileObj.name ) {
          this.$file.css( 'display', 'none' );
          this.$fileReplace.css( 'display', 'none' );

          this.$noFile.css( 'display', 'block' );
          this.options.$dropZone.css({ height: 'auto', width: 'auto',  overflow: 'visible', position: 'relative', paddingLeft: 14, paddingRight: 20 });
          
        }//END IF 
        else {
          this.$file.css( 'display', 'block' );
          this.$fileReplace.css( 'display', 'block' );
            
          this.$noFile.css( 'display', 'none' );
          this.options.$dropZone.css({ height: 1, width: 1, overflow: 'hidden', position: 'absolute', paddingLeft: 0, paddingRight: 0 });
        }//END ELSE 
    }//END TOGGLE VIEW
    
    //////////////////
    , _createFileView: function () {
    //////////////////  
       var self = this
         , o = this.options
         ;
       
       this.$file = $( '<div/>' )
          .appendTo( this.element )
          .addClass( 'CONTAINER-bgimagestatus-file' )
          ;

        var $row = $( '<p/>' ).appendTo( this.$file );//CREATE FIRST "ROW"
        
        /////////////////////////////
        // CREATE FILE REMOVE LINK //
        /////////////////////////////
        $( '<a/>' )
          .addClass( 'STYLE-bgimagestatus-fileRemove' )
          .append( '<span class="ICON-cancel-mini">Remove</span>' )
          .appendTo( $row )
          .bind( 'click.bgimagestatus', function ( event ) { self._trigger( 'remove', event, self.ui() ); })
          ;
        
        ///////////////////////////
        // CREATE FILENAME LABEL // 
        ///////////////////////////
        $( '<span/>' )
          .appendTo( $row )
          .addClass( 'STYLE-bgimagestatus-fileName' )
          .text( helperTextCut( this.options.fileObj.name, 20 )  + '.' + this.options.fileObj.suffix )
          ;    

        $row = $( '<p/>' ).appendTo( this.$file );//NEW "ROW"
        
        /////////////
        // DIVIDER //
        /////////////
        $( '<span/>' )
          .appendTo( $row )
          .addClass( 'STYLE-bgimagestatus-addedBy-label' )
          .text( o.labelAddedBy )
          ;       
        //////////////////////////
        // CREATE ADDED BY LINK //
        //////////////////////////
        $( '<a/>' )
          .appendTo( $row )
          .addClass( 'STYLE-bgimagestatus-addedBy' )
          .text( helperTextCut( this.options.fileObj.addedBy, 15 ) )
          ;
          
    }//END _CREATEFILEVIEW 
    
    /////////////////////////
    , _createFileReplaceView: function () {
    /////////////////////////
        var self = this
          , o = this.options
          ;
          
        this.$fileReplace = $( '<div/>' ).addClass( 'CONTAINER-bgimagestatus-fileReplace' ).appendTo( this.element );
        ////////////////////////////////////
        // MAKE REPLACE WITHNEW FILE LINK //
        ////////////////////////////////////
        $( '<a/>' )
          .addClass( 'STYLE-bgimagestatus-link' )
          .appendTo( this.$fileReplace )
          .text( o.labelReplaceNewFile )
          .bind('click.bgimagestatus', function () { 
            o.$dropZone.find( 'input' ).trigger( 'click' ); 
          })
          ;   
        ////////////////////
        // CREATE DIVIDER //
        ////////////////////  
        $( '<span/>' ).addClass( 'STYLE-browse-content-divider' ).appendTo( this.$fileReplace )
        
        ///////////////////////////////////
        // MALE REPLACE FROM SOURCE LINK // 
        ///////////////////////////////////
        $( '<a/>' )
          .addClass( 'STYLE-bgimagestatus-link' )
          .appendTo( this.$fileReplace )
          .text( o.labelReplaceFromSource )
          .bind( 'click.bgimagestatus', function () { self._trigger( 'fileFromSource', event, self.ui() ); } )
          ;
          
        this.$fileReplace.wrapInner('<p></p>');
      
    }//END _CREATEFILEREPLACEVIEW
    
    ////////////////////
    , _createNoFileView: function () {
    ////////////////////  
      var self = this;
      
      this.$noFile = 
        $( '<div/>' )
          .appendTo( this.element )
          .addClass( 'CONTAINER-bgimagestatus-noFile' )
          ;        
        ////////////////////////////////////////
        // CREATE ADD FILE FROM RESOURCE LINK //
        ////////////////////////////////////////
        $( '<a/>' )
          .addClass( 'STYLE-bgimagestatus-link' )
          .appendTo( this.$noFile )
          .wrap( '<p></p>' )
          .text( this.options.labelNoFileFromSource )
          .bind( 'click', function () { self._trigger( 'fileFromSource', event, self.ui() ); } )
          ;   
    }//END _CREATENOFILEVIEW
    
    ///////////////
    , hideOnDrag: function () {
    ///////////////    
        this.$file.css( 'display', 'none' );
        this.$fileReplace.css( 'display', 'none' );
        this.$noFile.css( 'display', 'none' );
        this.options.$dropZone.css( { height: 'auto', width: 'auto',  overflow: 'visible', position: 'relative', paddingLeft: 14, paddingRight: 20 } ); 
    }//END HIDEALLVIEWS
    
    ///////////////
    , showAfterDrag: function () { this._toggleView(); }//END SHOWALLVIEWS
    ///////////////    
    
    /////
    , ui: function () { return { element: this.element, fileObj: this.options.fileObj, $dropZone: this.options.$dropZone,  $styleable: this.options.$styleable } }
    /////
    
    //////////
    , destroy: function () { $.Widget.prototype.destroy.apply( this ); 
         
         self._trigger( 'remove', event, self.ui() );
         this.$file.remove();
         this.$fileReplace.remove();
         this.$noFile.remove();
        
    }     
    //////////  
});  
})( jQuery );