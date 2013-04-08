(function($){
    
$.widget("gadget.dev_gadgetImage", {
   options:{
          remove:'<div class="STICKER-dropfile-remove ICON-remove-mini"></div>' 
        , imageLimit: 1
        , columns:[]
        , loadPath:'/blob/'
        , savePath:'/ajax/image'
        , onCreate: function () { alert( 'bingo' ); }
        , action: function(event,ui){ alert( 'action' ); }
        ,dropzoneHtml:
    		   
                     '<div class="CONTAINER-target STYLE-noTarget">'
                        + '<div class="CONTAINER-target"></div>'
                        + '<div class="STICKER-dropfile-arrow"></div>'
                        +'<form class="CONTAINER-formFile HELPER-file STICKER-dropImage-upload" action="/library_images" method="POST" enctype="multipart/form-data"><a class="FORM-fileupload">Upload</a><input name="Datei" type="file"/></form>'
                    +'</div>'
                    +'<div class="STICKER-dropfile-description">'	
     		            +'<h1>Drop image here</h1>'
     		            +'<a class="BUTTON-AddAsText"><span class="ICON-add-mini  STICKER-AddAsText"></span> Add from Libary</a>'
     		         +'</div>'
        
        ,dropzoneHtmlMedium:    

                    '<div class="CONTAINER-target STYLE-target-medium STYLE-noTarget">'
                       +'<div class="CONTAINER-target STYLE-target-medium"></div>'
                       +'<div class="STICKER-dropfile-arrow STYLE-dropfile-arrow-medium"></div>'
                       +'<form class="CONTAINER-formFile HELPER-file STICKER-dropImage-upload STYLE-dropImage-upload-medium" action="/library_images" method="POST" enctype="multipart/form-data"><a class="FORM-fileupload">Upload</a><input name="Datei" type="file"></form>'
                    +'</div>'   
                    + '<div class="STICKER-dropfile-description  STYLE-dropfile-description-medium">'	
                       +'<h2>Drop image here</h2>'
                       +'<a class="BUTTON-AddAsText"><span class="ICON-add-mini STICKER-AddAsText"></span> Add from Libary</a>'
                    +'</div>'     
                            
        ,dropzoneHtmlMini: 

                    '<div class="CONTAINER-target STYLE-target-mini STYLE-noTarget">'
                       +'<div class="CONTAINER-target STYLE-target-mini"></div>'
                       +'<div class="STICKER-dropfile-arrow STYLE-dropfile-arrow-mini"></div>'
                       +'<form class="CONTAINER-formFile HELPER-file STICKER-dropImage-upload STYLE-dropImage-upload-mini" action="/library_images" method="POST" enctype="multipart/form-data"><a class="FORM-fileupload">Upload</a><input name="Datei" type="file"></form>'
                    +'</div>'
                    + '<div class="STICKER-dropfile-description  STYLE-dropfile-description-mini">'	
                        +'<a class="BUTTON-AddAsText"><span class="ICON-add-mini STICKER-AddAsText"></span> Add from Libary</a>'
                    +'</div>'
                   

   }
    
   ,_create: function(){ 
      var self = this;
      self.element
          .addClass('CONTAINER-dropfile') 
         // .append('<div class="GRID-image-column"><div class="CONTAINER-image"><img src="http://d1.stern.de/bilder/stern_5/fotografie/2010/KW48/David_Drebin/David_Drebin_3_maxsize_735_490.jpg"/></div></div>')
   }
   
    , _init: function () { 
      if ( this.options.disabled == false ) { 
        var self = this, o = this.options;
        self._reCreate();
        self.columns = o.columns;
        self.imageExist = self.columns.length;
        self.currentImage = self.element.find( 'img' ).attr( 'src' );
        
        var column = self._createColumn(); 

        self._createDropzone( self.columns[ self.columns.length - 1 ] );
        self._setFileupload( self.columns[ self.columns.length - 1 ] );
        self.columns[ self.columns.length - 1 ]
          .find( '.CONTAINER-target, .STICKER-dropfile-description' )
          .css( 'display', 'block' );
        self.dropzone.css( 'display', 'block' );  
        
        /////////////////////
        // IF IMAGE EXISTS //                
        /////////////////////
        if ( self.currentImage ) {
          self.element.find( 'img' ).remove()
          self._createImage( column, self.currentImage );  
          self._changeToImage( column ); 
        }//END IF
      }//END IF
    }//END INIT
   ,destroy: function(){
         var self = this, columns = self.element.find('.GRID-image-column');

             // REMOVE FILEUPLOAD
            self._removeFileUpload();
            self._removeDelete();
            //self._removeDropzones();
      
            self.element.removeClass('CONTAINER-dropfile')
        $.Widget.prototype.destroy.apply(this);
   }
   ,_removeFileUpload: function(){
         var self = this;
        
         self.element
             .find('*:data(dropImage)')
             .unbind('.dropImage')
             .removeData('dropImage');  
       
   }
   ,_addFileUpload: function(){
        
        var self = this, columns = self.element.find('.GRID-image-column');
         columns.each(function(){
            
            var $this = $(this);
            self._setFileupload($this);
        });
       
   }
   ,_removeDelete: function(){
        var self = this;
        self.element.find('.HELPER-deleteImage').remove();
   }
   ,_addDelete: function(){
       
        var self = this, columns = self.element.find('.CONTAINER-image');
         columns.each(function(){
             var $this = $(this);
             self._createDelete($this)     
         });
       
   }
   ,_removeDropzones: function(){
          var self = this, columns = self.element.find('.GRID-image-column');
          columns.each(function(){
                 var $this = $(this);
                 if(!$this.find('img').length) $this.remove();

          });
       
   }
   ,_setOption: function( key, value ) {
       self = this;
       console.log(key)
       this.options[ key ] = value;
       
      
       
       if(this.options.disabled == true)
       {
           self.hide();
           self._removeFileUpload();
           self._removeDelete();
         
       } else if(this.options.disabled == false) {
           if(self.columns !== undefined){
               self._addFileUpload();
               self._addDelete();
               self.show();
           } else {
               
               self._init()
           }
       }
       
   }
   ,_save: function(){
       
       self.element.find('.HELPER-deleteImage').remove()
       
   }
   ,_reCreate: function(){
      var self = this,o = self.options,  columns = self.element.find('.GRID-image-column');
      if(!o.columns.length){
         
         columns.each(function(){
             var $this = $(this);
             
             o.columns.push($this)
             self._createDelete($this.find('.CONTAINER-image'))    
             self._setFileupload($this)
             
             $this.find('.CONTAINER-image')
                  .css({width: '100%', height: '100%'})
                  .find('img')
                    .css({width: '100%', height: '100%'});
         });
      }
   }
   ,_setFileupload: function ( column ) {
        var self = this, o = self.options;
        self.activate = false;
        
        column.fileUpload({
            url: o.savePath
          , fieldName: 'file'
          , namespace: 'dropImage'
          , cssClass: 'GRID-image-column'
          , multipart: true
          , withCredentials: false
          , formData: {
              projectid: 'A0B0C0'
            , script: 'script_TempFileToLibrary'
            , columns: JSON.stringify({ columnnames:[ '', '' ] })    
            }//END FORM DATA
          , onLoad: function ( event, files, index, xhr, handler ) {
              var response = $.parseJSON( xhr.responseText ) //returns response[0].item_id .item_name .created_at .tmpfilename
                , image = column.find( 'img' );
              
              self.addNewImage( response[ 0 ].item_id, 0 ); 
          }//END ONLOAD
          , onDragEnter: function ( event ) { 
              if ( self.activate == false ) {     
                  self.activate = true;  
                  self.element.find('.STICKER-dropfile-arrow').effect( 'bounce', function () {  self.activate = false; } );
              }         
          }
          , initUpload: function () {}
          , onDrop: function ( event ) {}
        })//END FILEUPLOAD
        .fadeIn( 2000 )//FADE IN COLUMN 
              
              
             if(this.options.disabled == true)
             {
               self.hide() 
             } 
   }
   ,addNewImage: function ( path , column ) {
      
     
       var self = this
          , o = this.options
          , column = self.element.find('.GRID-image-column:eq('+ column +')')
          , image = column.find( 'img' )
         ;
         
         console.log(image,column )
        if ( image.length && o.imageLimit == 1 ) {
           self._createImage( column,  o.loadPath + path );  
           self._replaceImage( column );
           self._trigger( 'onCreate', null, self.ui() ); 
         }
         else if ( image.length && o.imageLimit > 1 ) { /* IN FUTURE THIS SHOULD CREATE A */ } 
         else {  
     
           self._createImage(column, o.loadPath + path);  
           self._changeToImage(column); 
           self._trigger( 'onCreate', null, self.ui() );
     }
     
     
   }
   
   ,_createColumn: function(){
       var self = this;
       self.columns.push($('<div class="GRID-image-column"></div>'));
       
         return  self.columns[self.columns.length-1]
           .appendTo(self.element)
           .css({width:'100%', height:'100%'});
    
   }
   ,_replaceImage: function(column){
        var self = this, old = column.find('img:first').parent(), img = column.find('img:eq(1)').parent() 
           old.fadeOut( 1000, function(){ 
                img.fadeIn(1000)
                old.remove()
            });
        
   }
   ,_createDelete: function(target){
        var self = this, o = self.options, column = target.closest( '.GRID-image-column' );
        target.append( $(o.remove).addClass('HELPER-deleteImage').click( function(event){ event.stopPropagation(); self._createDropzone(column);  self._changeToDropzone(column),  self._trigger( 'onDelete', null, self.ui() );  self.activate = false;}))
   }
   ,_createImage: function(column, image_url){
         var self = this, o = self.options;  
         self.currentImage = image_url 
         $('<div class="CONTAINER-image"><img src="' + self.currentImage + '"></div>')
        
        .appendTo(column)
        .css({width: '100%', height: '100%', display:'none'})
        .find('img')
            .css({width: '100%', height: '100%'});
            
        self._createDelete(column.find('.CONTAINER-image:last')) 
                
   }
   ,hide: function(){
       
       var self = this, img = self.element.find('img').length;
        if(!img){
            self.element.children(':first').fadeOut(500) 
        }
        
   }
   
   ,show: function(){
        var self = this, img = self.element.find('img');
        
           self._refreshDropzones()
           if(!img){
                self.element.children(':first').fadeIn(500) 
            }
            else{
                self.element.find('.HELPER-deleteImage').fadeIn(500) 
            }
   }
   ,_setDropzoneSize: function(){
       
       var self = this, o = self.options, w = self.element.parent().width(), h = self.element.height();  
       
       if(w < 215 || h < 115)
       {
           self.dropzone = o.dropzoneHtmlMini
       }
       else if(w < 270 || h < 220)
       {
           self.dropzone = o.dropzoneHtmlMedium
       } 
       else {
           self.dropzone =  o.dropzoneHtml
       }
   }
   ,_refreshDropzones:function(){
     
       for( i in self.columns ){
           
           $(self.columns[i]).find('.HELPER-ImageDropzone').remove()
           self._createDropzone()
       }
       
   }
        
   ,_createDropzone: function(column){
        
        var self = this, o = self.options;
        self._setDropzoneSize();
        self.dropzone = $(self.dropzone).addClass('HELPER-ImageDropzone').css({display:'none'}).appendTo(column);
    
        self.dropzone
            .find('.STICKER-dropImage-upload')
            .bind({'mouseenter.image': function(){

                var fadeIn = function(){ self.dropzone.find('.STICKER-dropImage-upload').stop().animate({opacity: 1},400) }; 
                        
                column.find('.STICKER-dropfile-arrow').stop().animate({opacity: 0}, 300, fadeIn() );
                column.find('.CONTAINER-target:eq(1)').stop().animate({opacity: 0.2}, 300, fadeIn() );
            }
            ,'mouseleave.image': function(){

                var fadeIn = function(){ 
                        
                    column.find('.STICKER-dropfile-arrow').stop().animate({opacity: 1}, 300);
                    column.find('.CONTAINER-target:eq(1)').stop().animate({opacity: 1}, 400 );
                }; 
                        
                self.dropzone.find('.STICKER-dropImage-upload').stop().animate({opacity: 0}, fadeIn() );
            }});
          
          self.dropzone
              .find('.BUTTON-AddAsText')
              .click(function(event){ event.stopPropagation(); self._trigger( 'action', null, self.ui() );  });    
            
          // PREVENTS FOCUS ON CONTAINER
          self.dropzone.find('form').click(function(event){ event.stopPropagation();});    
           
    }
 
   ,_changeToImage: function(column){
        var self = this, img = column.find('img').parent(), dropZone = column.find('.CONTAINER-target, .STICKER-dropfile-description'); 
        self._setDropzoneSize();
        dropZone.fadeOut( 500, function(){ 
            img.fadeIn(1000)
            dropZone.remove() 
           
        });
   }
   
   ,_changeToDropzone: function(column){
       var self = this, img = column.find('img').parent(); 
       
       img.fadeOut( 1000, function(){ 
            column.find('.CONTAINER-target, .STICKER-dropfile-description').fadeIn(2000) 
            img.remove()
       });
    }
    ,ui: function(){ return { element: this.element, imagePath: this.currentImage } }
    

  
    
});

    
})(jQuery);