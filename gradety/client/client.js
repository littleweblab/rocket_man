$( document ).ready( function () {
  $( '.UI' )
    .controls()
    .controls( 'add', '.UI/ui' )
    ;
  
  URL = helperExamineUrl();
  ID = URL.address[ URL.address.length - 1 ];
  
  console.log( URL,ID )
  
  ///////////////////////////
  // DEFAULT AJAX SETTINGS //
  ///////////////////////////
  $.ajaxSetup({
    type: 'post'
  , dataType: 'json'
  , url: '/ajax/script'
  , async: false
  , cache: false
  , timeout: 30000
  , error: function ( err ) { 
      console.log('Ajax Error:', err ); 
      alert( 'Error' )
    }
  , success: function ( response ) { }
  });
  
  /////////////////
  // MODE DESIGN //
  /////////////////
  if ( URL.mode == 'design' ) { 
    
    $( '.UI' ).controls( 
        'add'
      , '.BUTTON-addFlatMaxi-option/addButton/dev_gadgetButton'
      , '.CONTAINER-menubar/menuBar/dev_gadgetMenu'
    )
    ;
    
    $.ajax({
        url: '/design/ajax'
      , data: { type: 'design$list', data: JSON.stringify([ URL.address[  URL.address.length - 1 ] ] ) }
      , success: function ( designs ) {
         $( '.STAGE' )
          .designBrowser( { 
           designs: designs 
         , projectId: URL.address[  URL.address.length - 1 ]         
         , onCreateListItem: function ( event, ui ) {
             ui.listItem.data( { designId: ui.designId, projectId: ui.projectId } );
             $( '.UI' ).controls( 
                'add'
              , '.STYLE-designBrowserIcon/designBrowser/bind' 
              , '.STYLE-designBrowserLabel/designBrowser/dev_gadgetRename'
              , '.STYLE-designBrowserIcon/designBrowser/draggable'  
             )//END CONTROLS
             ; 
         }
        });
      }//END SUCCESS
    }).responseText; //END $.AJAX
  }//END IF DESIGN
  
  ///////////////////////////
  // MODE DESIGN / WIZZARD //
  ///////////////////////////
  if ( URL.mode == 'design$wizzard' ) {
    
    $( '.UI' ).controls(
        'add'
      , '.CONTAINER-menubar/menuBar/dev_gadgetMenu'
      , '.CONTAINER-breadcrump/breadcrump/dev_gadgetMenu' 
      , [ $( '.FORM' ).find( 'select, button, input:not([type=hidden])' ), 'form/dev_gadgetForm'  ]
      , '.UI-BUTTON-choose/choose/bind'
    )
    ;
    $( '.UI' ).dev_gadgetLayout( 'update' );

  }

  ////////////////////////
  // MODE DESIGN / DRAW //
  ////////////////////////
  if ( URL.mode == 'design$draw' ) {
    
    $( '.STAGE' )
      .styleable()//Setup styleables for STAGE parent to init PAGE as styleable in bifork
        .parent()
          .styleable() //Setup styleables for STAGES parent to init stage as styleable in bifork
          ;
    
    $( '.PAGE' ).each( function () {
      var $PAGE = $( this );
      $PAGE
        .ios({ rootident: ID + 1 })
        .data( 'BIFORK', IOSC = {} )
        ; 
      //console.log( '================>' + $('.PAGE').ios('GetZeroNodeType') );
      //console.log( 'ZERONODES :: ', $('.PAGE').ios('GetZeroNodes'));         
      //console.log( 'GetM2 :: ', $('.PAGE').ios('GetM2', 2));
     })//END EACH
     ;
     
     $( '.UI' ).controls( 
         'add'
       , '.GRID-panelBrowse/browseBar/dev_gadgetBrowse'
       , '.GRID-panelToolbar > .CONTAINER-toolbar/toolBar/dev_gadgetMenu'  
       , '.CONTAINER-menubar/menuBar/dev_gadgetMenu'
     )
     ;
  }//END IF

  ////////////////
  // MODE PAGES //
  ////////////////
  if ( URL.mode == 'pages' ) {  
    
    $( '.UI' ).controls( 
        'add'
      , '.PAGE/page/page'
      , '.CONTAINER-menubar/menuBar/dev_gadgetMenu'
      , '.GRID-panelBrowse/browseBar/dev_gadgetBrowse'
      
    )
    ;
    
  }//END IF
 
  ////////////////
  // MODE FILES //
  ////////////////
  if ( URL.mode == 'files' ) {
    
    var callScript = {
         projectid: URL.address[  URL.address.length - 1 ]
       , script: 'script_list_files'
       , parameters: ''//script parameters
       , data: { value_one: 'first', value_two: 'second' }//datavalues
       , columns: JSON.stringify({ columnnames: [ 'designid', 'designname' ]})//for select only
     }//END CALL SCRIPT
     , answer = $.ajax({
         data: callScript
       , error: function ( err ){ alert( 'error' ); }
       , success: function ( files ) {
          var rowOrder = [ null, 'item_name', 'added_by' , 'updated_at', 'mime_type', 'size', 'source' ]
            , TABLE = $( '.CONTAINER-filesBody table' )
            , TBODY = TABLE.find( 'tbody' )
            ;
          for ( var i = 0; i < files.length; i++ ) {
            var ROW = $( '<tr/>' ).appendTo( TBODY ).height('30px');
            for ( var c in rowOrder ) {
              var content = files[ i ][ rowOrder[ c ] ] || 'no value'
                , COLUMN = $( '<td class="FUNCTION-tableContent"/>' ).appendTo( ROW )
                ;
              
              if (  rowOrder[ c ] == 'source' ) {
                
                COLUMN.addClass( 'STYLE-sourceCol' ); 
                ////////////////////////
                // CREATE UPLOAD FORM //
                ////////////////////////
                $( '.UI' ).controls(
                  'add'
                , [ $( '<input type="file" id="test1" class="STYLE-filesDropzone" name="files[]" data-text="Replace with another file"/>' ).prependTo( COLUMN ), 'fileReplace/dev_gadgetForm' ] 
                )
                ;
              } 
              else if (  rowOrder[ c ] == null ) {
                COLUMN.addClass( 'STYLE-pageCol' );
              }
              else {
                $( '<p/>' )
                  .appendTo( COLUMN )
                  .addClass( 'CONTAINER-tableContent' )
                  .html( rowOrder[ c ] == 'item_name' ? '<strong>' + content + '</strong>' : content )
                  ;
              }//END IF    
            }//END LOOP
          }//END LOOP 
          
          $( '.UI' ).controls( 'add', '.CONTAINER-filesSearch input/search/dev_gadgetForm' );
          //$( '.CONTAINER-filesSearch input' ).dev_gadgetControls({ type: 'search', dev_gadgetForm: 'add' });//Add search
         
          /////////////////////////////
          // ADD TABLE HEAD SORTABLE //
          /////////////////////////////
          TABLE
            .tablesorter({
              sortList: [ [ 1 , 0 ] ]
            , cssAsc: 'STYLE-tableHeadSorted-down'//Top
            , cssDesc: 'STYLE-tableHeadSorted-top'//Down
          });
        }//END SUCCESS
     }).responseText
     ;//END $.AJAX
  
     $( '.UI' ).controls( 'add', '.CONTAINER-menubar/menuBar/dev_gadgetMenu', '.CONTAINER-uploadNewFile input/fileUpload/dev_gadgetForm' ); 
  }//END FILES
  
});// END DOMREADY
