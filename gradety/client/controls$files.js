function createfiles ( opt ) {   
  return {
    ////////
    menuBar: { dev_gadgetMenu: getMenubarObj() }
    ////////
    
    /////////
    , search: {
    /////////  
        dev_gadgetForm: { 
          disable: false 
        , rapeClass: true  
        , keyEvents: true
        , change: function ( event, ui ) {
            var $table = $( '.TABLE table' )//Find table
              ;
              
            $table.find('.HELPER-tableMessage').remove();//Remove nothing matched message
            ///////////////////////
            // ADD CANCEL BUTTON //
            ///////////////////////
            if ( ! ui.nicer.find('.ICON-cancel-mini').length && ui.newValue != '' ) { 
                ui.nicer.css( 'background-position', '-80px 1px' );//Hide loupe icon
                /////////////////////////////////////////////
                // CREATE CANCEL BUTTON BY STARTING TYPING //
                /////////////////////////////////////////////
                $( '<a/>' )
                  .addClass('ICON-cancel-mini STYLE-form-search-cancel')
                  .appendTo( ui.nicer )
                  .click( function () {
                  ///////////////////////////////////
                  // REMOVE SEARCH FILTER ON CLICK // 
                  ///////////////////////////////////
                  ui.nicer
                    .css( 'background-position', '3px 1px' )//Show loupe icon again
                    .find( 'p' )
                      .text( '' )//Remove filter text
                    .end()
                    .find( '.ICON-cancel-mini' )
                      .remove()//Remove cancel button
                      ;
                  $table.find('.HELPER-tableMessage').remove();//Remove nothing matched message
                  $.uiTableFilter( $table, '' );//Reset filter
                })//END CLICK
                ;
            }//END IF
            else if ( ui.newValue == '' ) {
              /////////////////////////////////////
              // IF TEXT IS DELETED BY BACKSPACE //
              /////////////////////////////////////
              ui.nicer
                .find('.ICON-cancel-mini')
                  .remove()//Remove cancel button
                  ;
              ui.nicer.css( 'background-position', '3px 1px' );//Show loupe icon again
            }//END IF/ELSE IF
            
            $.uiTableFilter( 
              $table
            , ui.newValue
            , null 
            , function() { 
                if ( $table.find('tbody tr:visible').length == 0 ) $table.find( 'tbody' ).append( '<tr class="HELPER-tableMessage"><td colspan="7" class="STYLE-tableMessage"><h1>We are sorry, nothing matched!</h1></td></tr>' );//Add mesage if nothing matched the search
              }//END CALLBACK
            );//FILTER IN TABLE PLUGIN
        }//END CHANGE
      }//END FORM
    }//END SEARCH
    
  //////////////
  , fileReplace: {
  //////////////
      dev_gadgetForm: {
          rapeClass: true  
        , action: function ( event, ui ) {
            var $TD = ui.nicer.closest( 'td' )
                               
            helperUpload( 
                ui.nicer
              , $( 'table' )
              , {   dropZone:  $TD 
                  , fileInput: ui.element
                  , url: '/path/to/upload/handler.json'
                  , multipart: true
                  , singleFileUploads: true
              }//END OPTIONS
            );
          }//END ACTION
      }//END DEV_GADGETFORM
  }//END FILEREPLACE 
  
  /////////////
  , fileUpload: {
  /////////////
      dev_gadgetForm: {
          rapeClass: false
        , action: function ( event, ui ) {
            var $TD = ui.nicer.closest( 'td' )
              , TABLE = ui.nicer.closest( 'table' )
              ;
            /////////////////////////////////
            // MAKE NICER TO AN ADD BUTTON //
            /////////////////////////////////
            ui.nicer
              .removeClass( 'FORM-fileupload' )
              .addClass( 'BUTTON-addMaxi' )
              .addClass( 'STYLE-uploadButton' )
              ;
            /////////////////////
            // CREATE DROPZONE //
            /////////////////////  
            var $dropzone = 
             $( '<div class="CONTAINER-dropzone STYLE-light STYLE-filedHeadDropZone"></div>' )
                .append( '<p class="STICKER-filedHeadDropZoneLabelLeft"><strong>Drop</strong> your file here</p>' )
                .append( '<p class="STICKER-filedHeadDropZoneLabelRight"> to upload a <strong>new</strong> one</p>' )
                .appendTo( '.CONTAINER-filesHead' )
                .css({ display: 'none', 'margin-left': 10, 'margin-right': 10 })
                ;
            ///////////////////////////////////////
            // BIND DRAGLEAVE/EXIT AND DRAGENTER //
            // TO DOCUMENT                       //
            ///////////////////////////////////////
            $( document )
              .bind( 'dragleave dragexit', function ( event ) { 
                if ( event.pageX > ( window.innerWidth -25 )//Leaf document right
                  || event.pageX == 0 //Leaf document left/bottom
                ) {
                  $dropzone
                    .fadeOut( 0 , function () {
                      $( '.FUNCTION-filesHeadGrid' )
                        .fadeIn( 0 )
                        ;
                    })//END FADEOUT
                    ;
                }//END IF
              })//END BIND
              .bind( 'dragenter', function ( event ) { 
                $( '.FUNCTION-filesHeadGrid' )
                  .fadeOut( 0, function () {
                    $dropzone
                      .fadeIn( 0 )
                      ;
                  });//END FADEOUT
                })//END BIND
                ;
            ////////////////////////////
            // CONFIGURATE FILEUPLOAD //
            ////////////////////////////
            ui.nicer
              .fileupload({    
                dropZone: $( '.CONTAINER-filesHead' )
              , fileInput: ui.element
              , url: '/path/to/upload/handler.json'
              , multipart: true
              , singleFileUploads: true
              })//END FILEUPLOAD
              ;            
        }//END ACTION
      }//END DEV_GADGETFORM
  }//END FILEUPLOAD
  
  /////
  , ui: { dev_gadgetLayout:{ show: [ 'menu', 'edit','stage' ] } }
  /////
  }[ opt ]
  ;
}
;