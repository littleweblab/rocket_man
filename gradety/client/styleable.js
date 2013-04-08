( function ( $ ) {
  $.widget( "gadget.styleable", {
    options: {
      defaults: {    
        fit: false
      , type: 'container'
      , styles: { 'background-color': 'pink'  }
      , saveStyles: { 'width': 'auto', 'height': 120,  'display': 'block', 'position': 'relative', 'word-wrap': 'break-word', 'z-index': 'auto' }
      , sortable: false  
      , task: 'choose'
      , resizable: true   
      , ident: ''
      , script: ''
      , html: ''
      , label: ''
      , onlyEditableByDesigner: false 
      , openAccordions: [ ]
      , overflow: 'auto'
      , allreadyExist: false
      , storage: { overwrite: {} }
      , afterAdd: function ( ui ) {}
      , onCancel: function ( ui ) { ui.element.styleable( 'removeStyleable', ui.styleable ); }
      }//END DEFAULTS
    , sortableCancelClass: ''//ui-sortable-cancel'
    , dontSaveContentOnTask: [ 'subgrid' ]//List of tasks wich don't need to save content
    , no: [ 'ui-resizable-handle ui-resizable-s' ]//Dom elements inside styleable that schouldn't be saved
/////////////
// TRIGGER //
/////////////     
    , afterAdd: function ( event, ui ) { /* ui.styleable.dev_gadgetFocus( 'activate' ); */ }
    , afterResize: function ( event, ui ) { helperHoldPositionOnScroll( ui.element , ui.element.find( '> .ui-resizable-w, > .ui-resizable-n ' ), 'top' ); }//END AFTER REZISE   
    }//END OPTIONS
    
    , _create: function () {}//END CREATE
    , _init: function () { 
        var self = this;
        var o = this.options;
        
        this.containerList = [ ]; 
        this.element.css( 'overflow', o.defaults.overflow );//Make scrollbars possible
    }//END INIT
    , destroy: function () {
      
      this.element.css( 'overflow', 'visible' );//Make scrollbars possible
      $.Widget.prototype.destroy.apply( this ); 
    
    }//END DESTROY
   
    , _setOption: function ( key, value ) {
      var self = this;
      this.options[ key ] = value;
      if ( key = 'disabled' && value == false) {}
    }//END OPTIONS 
    , ui: function () {  return {  element: this.element  }; }
      
/////////
// ADD //
/////////    
    , add: function ( newSetup, callback ) {
      var self  = this
        , o = self.options
        , e = self.element
        , allreadyExist =  newSetup.allreadyExist || '<div></div>' 
        , styleable = $( allreadyExist ).addClass( o.sortableCancelClass ).data( 'styleable_item', $.extend( true, {}, o.defaults, newSetup ) )
        , data = styleable.data( 'styleable_item' )
        ;
       
            
      if ( ! newSetup.allreadyExist ) styleable.appendTo( e );  
      
      if ( ! styleable.attr( 'id' ) ) {
         data.ident = data.ident == '' || data.ident == undefined  ? 'C' + uuid().substring( 0, 7 ).toUpperCase() : data.ident;
         styleable.attr( 'id', data.ident ) 
      }
      
      data.self = styleable; 
      data.parent =  self.element;
      self.html( styleable, data.html );
      self.setType( styleable, data.type, callback);
      self.fit( styleable, data.fit );
      this._trigger( 'afterAdd', null,  $.extend( self.ui(), { styleable: styleable  } ) );
      //self.saveContent( styleable, ["UI-CONTAINER-choose"] );
      return styleable;
    }//END ADD

//////////////////
// SET SORTABLE //
//////////////////    
    , setSortable: function ( styleable , sortable ) {
       var o = this.options;
       styleable.toggleClass( o.sortableCancelClass , sortable != true ); //true add / false remove
    }//END SETSORTABLE

    
//////////////
// SET TYPE //
//////////////
    , setType: function ( styleable, type, callback  ) {
      var data = styleable.data( 'styleable_item' )
        , e = this.element  
        ;
   
      $( '.UI' ).controls( 'remove',  [ styleable, data.type ] );//Remove last types controls Could be a trigger some day
      
      if ( type == 'sticker' ) {
        this.deleteStyles( styleable, [ 'margin-top', 'margin-bottom', 'margin-left', 'margin-right' ] );
        data.saveStyles = { 'position' : 'absolute', 'display' : 'block', 'width': e.width(), 'height': data.saveStyles.height, 'z-index': data.saveStyles[ 'z-index' ] , top: 10, left: 10 };
        styleable.removeClass( 'CONTAINER PAGE' ).addClass( 'STICKER' );
        data.label = ( data.label == '' ) ? 'Sticker' : data.label;
        data.type = 'sticker';
        data.fit = false;
      } else if ( type == 'page') {
        this.deleteStyles( styleable,  [ 'top', 'left' ] );
        styleable.removeClass( 'STICKER CONTAINER' ).addClass( 'PAGE' );
        data.saveStyles = { 'width': data.saveStyles.width, 'height': data.saveStyles.height,  'display': 'block', 'position': 'relative', 'word-wrap': 'break-word', 'z-index': data.saveStyles[ 'z-index' ] };
        data.label = 'Page';
        data.type = 'page';
        data.fit = false;
      } else if ( type == 'container' ) {
        this.deleteStyles( styleable,  [ 'top', 'left' ] );
        data.saveStyles = { 'width': 'auto', 'height': data.saveStyles.height,  'display': 'block', 'position': 'relative', 'word-wrap': 'break-word', 'z-index': data.saveStyles[ 'z-index' ] };
        styleable.removeClass( 'STICKER PAGE' ).addClass( 'CONTAINER' );
        data.label= ( data.label == '' ) ? 'Container' : data.label ;
        data.type = 'container';
      }//END IF/ELSE
      
      
      this.domUpdate( styleable );
      this.setTask( styleable, data.task, callback );
    }//END TYPE
    
//////////////
// SET TASK //
//////////////    
    , setTask: function ( styleable, task, callback  ) {
        var o = this.options
          , e = this.element
          , data = styleable.data( 'styleable_item' ) //Find data of styleable
          ;
        
        if ( task != data.task && ! $.isArray( task ) ) $( '.UI' ).controls( 'remove', [ styleable,  $.isArray(data.task) ? 'choose' : data.task ] );//Remove last tasks controls Could be a trigger some day
        data.task = task;//Set task obj in styleables data obj
        
        //////////////////////////////////////
        // IF TASK IS AN ARRAY GO TO        //
        // THE WIZZARD ELSE INIT CONTROLLER //
        //////////////////////////////////////
        if ( $.isArray( task ) ) this._wizzard( styleable, data.task, callback );
        else {
          //////////////////////////////////////////
          // IF WIZZARD WAS USED CREATE OVERWRITE //
          //////////////////////////////////////////
          if ( data.storage.wizzard_overwrite ) {
            data.storage.overwrite [ data.task ] = data.storage.wizzard_overwrite[ 1 ];
            delete data.storage.wizzard_overwrite;//Remove wizzard_overwrite setup from storage 
          }//END IF 
             
          this._triggerCallback( styleable, callback, data, data.storage.overwrite[ data.task ] || {} );
          delete data.storage.wizzard_newLabels;//Remove wizzard_newLabels from storage if their are still some
          data.afterAdd( $.extend( this.ui(), { styleable: styleable } ) );
       }//END IF/ELSE
    }//END TASK

//////////////////
// SET _WIZZARD //
//////////////////    
    , _wizzard: function ( styleable, setup, callback ) {
        var self = this;
        var options = {};
        var data = styleable.data( 'styleable_item' ); 
        for ( var i = 0; i < setup.length; i++ ) {
          var newButton =  $.isArray( setup[ i ] ) ? setup[ i ].shift() : setup[ i ];
          ////////////////////////////////////////////////
          // IF THE LABELS MUST CHANGE IN CHOOSE.widget //
          ////////////////////////////////////////////////
          if ( typeof  newButton == 'object' ) {
            var newLabels = $.extend( {}, newButton );//Save temporary the new labels   
            newButton = newButton.name;//Label Button 
            delete newLabels.name;//Label option of the object is not nessesary any more
          }//END IF 
          
          newButton = newButton.split('.');//if it is an option like optionName.optionValue
          ////////////////////
          // CREATE BUTTONS //
          ////////////////////
            options[ newButton.length == 1 ?  newButton[ 0 ] : newButton[ 1 ]  ] = { 
              action: function ( event, ui ) {
                ui.button
                  .bind( 'click.containerToRender', function ( event ) { 
                    var data =  ui.data.self.data( 'styleable_item' ); 
                    if ( ! data.storage.wizzard_overwrite ) data.storage.wizzard_overwrite = [ ui.data.option[ 0 ].toLowerCase(), {} ];//Create storage to save temporary selected options
                    if ( ui.data.option.length != 1 ) data.storage.wizzard_overwrite[ 1 ][ ui.data.option[ 0 ].toLowerCase() ] = ui.data.option[ 1 ].toLowerCase();//Save selection
                    var nextOrEnd = $.isArray( ui.data.task ) == true ? ui.data.task : data.storage.wizzard_overwrite[ 0 ];//Decides what task will be send back to set type: an array if their are still options to choose or a string to end the wizzard 
                    self.setTask( ui.data.self, nextOrEnd, callback );//Call setTask again 
                  });//END BIND
              }//END FUNCTION
            , data: { task: setup[ i ], self: data.self, option: newButton  }
            };//END NEW OPTION
        }//END LOOP 
        options.cancel = { 
           action: function( event, ui ) {
             ui.button
               .bind( 'click', function() {  
                 data.onCancel( $.extend( self.ui(), { styleable: styleable } ));
               });//END BIND 
           }//END ACTION 
        };//END CANCEL
        //////////////////////// 
        // CREATE CHOOSE MENU //
        ////////////////////////  
        if ( data.storage.wizzard_newLabels != undefined ) {
          this._triggerCallback( styleable, callback, $.extend( true, {}, data, { task: 'choose' } ), $.extend( options , data.storage.wizzard_newLabels  )  )
          delete data.storage.wizzard_newLabels;//Delete newLabels from Storage
        } else {
          this._triggerCallback( styleable, callback, $.extend( true, {}, data, { task: 'choose' } ), options )
          data.storage.wizzard_newLabels = newLabels;// If loop had creeated a newLabels obj it will be saved in widgets storage for the next level of options to choose
        }//END IF/ELSE
    
      
    
    }//END WIZZARD

////////////////
// UPDATE FIT //
////////////////  
    , updateFit: function ( styleable ) {
        if ( ! styleable.length ) return; 
        var self = this
          , e = self.element
          , data = styleable.data( 'styleable_item' )
          , allStyles =  $.extend( true, {}, data.styles, data.saveStyles )
          , spaces = [ 'border-top-width', 'border-bottom-width', 'border-width', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom' ]
          , substract = 0
          ;
          
        if ( data.fit == true  ) {
          for ( var i = spaces.length;  i--; ) {
            var value =  allStyles[ spaces[ i ] ]
              , add = spaces[ i ] !== 'border-width' ? parseInt( value ) : parseInt( value ) * 2
              ;
            if ( !! add ) substract += add;
          };//END LOOP
          data.saveStyles.height = e.height() - substract;//Add new height to styleables data
          self.domUpdate( styleable );
        }//END IF
    }//END UPDATE FIT
 
/////////
// FIT //
///////// 
    , fit: function ( styleable, toggle, callback ) {
      var self  = this
        , data = styleable.data( 'styleable_item' )
        , o = self.options
        , e = self.element
        ;
     
      if ( data.type != 'container' ) return;//Sticker or pages shouldn't fit  
      if ( toggle && self.styleablesList( '>:data(styleable_item):visible' ).length == 1 ) {  
        data.fit = true;//Set styleable fit setup on true
        self.updateFit( styleable );
      } else {
        data.fit = false;//Set styleable fit setup on false
      }//END IF/ELSE
    
      //self._controls( e, pc );
      //self._controls( styleable, c );
    }//END FIT
    
///////////////////    
// DELETE STYLES //
///////////////////   
    , deleteStyles: function ( styleable,  styles ) {
      var data = styleable.data( 'styleable_item' );//Find data of styleable
      for ( var i in styles ) { 
        delete data.styles[ styles[ i ] ];
        delete data.saveStyles[ styles[ i ] ];
      }//END LOOP
      this.updateFit( styleable );
      this.domUpdate( styleable );
    }//END DELETESTYLES
    
////////////////    
// DOM UPDATE //
////////////////    
    , domUpdate: function ( styleable, newParent ) {
        var data = styleable.data( 'styleable_item' );//Find data of styleable
        if ( newParent ) data.parent = newParent; 
        styleable.attr( 'style', '' );//Remove existing styles
        styleable.css( $.extend( true, {}, data.styles, data.saveStyles ) );//Update styles
        //console.log( 'UPDATE', data, styleable );
    }//END DOM UPDATE

//////////////////////
// REMOVE STYLEABLE //    
//////////////////////
    , removeStyleable: function ( styleable ) { styleable.remove(); }

//////////
// COPY //    
//////////  
    , copy: function ( styleable, callback ) { 
        var self = this
        , data = styleable.data( 'styleable_item' )//Find data of styleable
        , newData = $.extend( true, {}, data )//Find data of styleable
          ;
          delete newData.ident;
        
        var COPY = this.add( newData, callback )//Make a copy of the styleable
        , copyId = COPY.attr( 'id' )//Get id
        , items = styleable.find( ':data(styleable_item)' )//Find all styleable items in the copied styleable
        ;
        
        ///////////////////////////////////////////////////////////////
        // LOOP TROGH ITEMS OF THE ORIGINAL CONTAINER TO GET         //
        // THEIR DATA OBJS, MODIFY THEM AND ADD THEM TO THEIR CLONES //
        ///////////////////////////////////////////////////////////////
        items.each( function ( i ) {
          var $this = $( this )
            , thisId = $this.attr( 'id' )//Get id of the original item
            , clonesNewId = thisId.replace( styleable.attr( 'id' ), copyId )
            , cloneData = $.extend( true, {}, $this.data( 'styleable_item' ) ,{ allreadyExist: '#' + clonesNewId } )//Create data element for the clone
            ;
            
          var clone = COPY.find( '#' +  thisId ).attr( 'id', clonesNewId );//Update clones id with the new one
          self.add( cloneData, callback );//Add Styleable
          if ( $this.css( 'display' ) == 'none')  clone.fadeOut( 0 );//Hide items that are allready hidden in the original
        });//END EACH
        
        this.saveContent( COPY, [ "UI-CONTAINER-choose" ] );//Save content (new id's) in styleable
      
    }//END COPY
 
////////////////
// SET STYLES //    
////////////////    
    , setStyles: function ( styleable, newStyles ) {
        var data = styleable.data( 'styleable_item' );
        $.extend( data.styles, newStyles );
        if ( newStyles[ 'background-image' ] ) 
        this.updateFit( styleable );
        this.domUpdate( styleable );
    }//END SET STYLES
    
    , setSaveStyles: function ( styleable, newStyles ) {
        var data = styleable.data( 'styleable_item' );
        $.extend( data.saveStyles, newStyles );
        this.domUpdate( styleable );
    }//END SET STYLES
       
//////////////////////////
// ALL CONTAINER HEIGHT //
//////////////////////////   
    , allContainerHeight: function () {
        var allContainer = this.element.find('> :data(styleable_item)')
          , allContainerHeight = 0
          ;
        allContainer.each( function () { allContainerHeight += $( this ).outerHeight( true ); });//Get height of all containers togheter in parent grid //
        return allContainerHeight;
    }//END ALL CONATINER HEIGHT
    
////////////
// REZISE //
////////////    
    , resize: function ( styleable, newHeight, newWidth, newLeft, newTop ) {
        var data = styleable.data( 'styleable_item' )//Find data of styleable
          , self = this
          , e = this.element 
          , sumHeight = this.allContainerHeight()
          ;
            
        if ( newHeight ) data.saveStyles.height = newHeight;//Set new height
        if ( newWidth ) data.saveStyles.width = newWidth;//Set new width
        if ( newLeft ) data.saveStyles.left = newLeft;//Set new left
        if ( newTop ) data.saveStyles.top = newTop;//Set new top
        
        this.domUpdate( styleable );//Update dom element
        this._trigger( 'afterResize', null, self.ui() );
    }//END REZISE

//////////////////
// SAVE CONTENT //
//////////////////
    , saveContent: function ( styleable, no ) {
       
        var data = styleable.data( 'styleable_item' )//Find data of styleable
             , o = this.options
             , no = no || o.no
             ;
        
        if (  $.inArray( data.task, o.dontSaveContentOnTask ) > -1 ) return;//Exclude styleables with a task that has no needs to save content

        /////////////////
        // MANAGES DOM //
        /////////////////
        function createPseudoDom ( dom ) {
          var storage = [];
         
          for ( var ch = 0; ch <= dom.length; ch++ ) {
            if ( dom[ ch ] != undefined ) {
              var attr = pseudoAttr( dom[ ch ].attributes, no )//Get attributes of the current node
                , sl = storage.length
                ;
              if ( attr !== 'no'  ) {
                
                storage.push( {} );
                storage[ sl ][ 'attributes' ] = pseudoAttr( attr );
                storage[ sl ][ 'childNodes' ] = createPseudoDom( dom[ ch ].childNodes );
                storage[ sl ][ 'nodeName' ] = dom[ ch ].nodeName;
                storage[ sl ][ 'nodeType' ] = dom[ ch ].nodeType;
                storage[ sl ][ 'nodeValue' ] = dom[ ch ].nodeValue;
                
              }//END IF
             
            }//END IF
          }//END LOOP
          return storage;
        }//END CREATEPSEUDODOM
        
        ////////////////////////
        // MANAGES ATTRIBUTES //
        ////////////////////////
        function pseudoAttr ( attr, no  ) {
          var attrStorage = [];
          for ( var x in attr ) {
            if (  $.inArray(attr[ x ].value, no || [] )  !==  -1 ) return 'no'; 
            if ( ! $.isFunction( attr[ x ] ) && typeof  attr[ x ] != 'number' &&  attr[ x ].name != 'style' ) {
              attrStorage.push( { name:  attr[ x ].name, value: attr[ x ].value } );
            }//END IF  
          }//END LOOP
          return attrStorage;
        }//END PSEUDOATTR
        
        data.html = createPseudoDom( styleable[ 0 ].childNodes );
      
    }//END SAVE CONTENT

//////////
// HTML //
////////// 
    , html: function ( styleable, pseudoDom ) {
        var data = styleable.data( 'styleable_item' )
          , html = []
          ;
        ////////////////////////////////////
        // MAKES AN ARRAY OF HTML CODE ;) //
        ////////////////////////////////////
        function toHtml( obj ) {
          ////////////////////
          // IF IT IS A TAG //
          ////////////////////
          if ( obj.nodeType != 3 ) {
            html.push( '<', obj.nodeName.toLowerCase() );//Open starttag / tag name
              for ( var attr in obj.attributes ) html.push( ' ' + obj.attributes[ attr ].name  + '="' + obj.attributes[ attr ].value + '"' );//CREATE ATTRIBUTES
              html.push( '>' );//Close starttag
              for ( var child in obj.childNodes ) toHtml( obj.childNodes[ child ] );//Loop trough childnodes and add it 
              html.push( '</' + obj.nodeName.toLowerCase() + '>' );//END TAG
          }//END IF 
          /////////////////////
          // IF IT IS A TEXT //
          /////////////////////
          else html.push( obj.nodeValue );
        }//END CREATEDOM
       
        for ( var obj in pseudoDom ) toHtml( pseudoDom[ obj ] );//Loop trough obj of pseudoDom elements
        $( html.join('') ).prependTo( styleable );//Preappend to styleable
    }//END HTML
    
//////////////////////////
// CREATESTYLEABLESLIST //
//////////////////////////
    , styleablesList: function ( selector ) {
        if ( ! selector ) selector = ':data(styleable_item)';//If selector is not difined find all container in e ( different selector is used in fit )
        var allStyleable = this.element.find( selector )
          , e = this.element
          , list = []
          ;
         
        if ( ! allStyleable.is( '.GRID' ) ) allStyleable.each( function () { 
          list.push( $(this).data( 'styleable_item' ) );
        });//END EACH
        return list;
    }//END CREATESTYLEABLESLIST
    , getSytleableData: function ( selector ) {
      return $( selector ).data( 'styleable_item' ); 
    }
    
    ,_triggerCallback: function  ( styleable, callback, data, overwrite ) {
      if ( typeof callback == 'function' ) callback( data, overwrite );
    } 
//////////////
// CONTROLS //
//////////////    
    , _controls: function ( setup ) { 
       $( '.UI' ).controls( 'add', setup  )
    }//END _CONTROLS  
   
  });//END WIDGET
})( jQuery );