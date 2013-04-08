( function ( $ ) {
  $.widget( "gadget.page", {
    ////////
    options: {
    ////////  
      defaults: {
        projectid: 'x'
      , pageid: 'x'
      , parentid: 'x'
      , previd: 'x'
      , designid: 'x'
      , pagename: 'x'
      , urlname: 'x' 
      , notinmenu: 'x' 
      , visible: 'x' 
      , pagetype: 'x'
      , tpl: 'x'
      , ownertable: 'x'
      , languagekey: 'x'
      , landingpage: 'x'
      }//END DEFAULT PAGE
    }//END OPTIONS
    
    ////////  
    , _init: function () {
    ////////
        var URL = helperExamineUrl();
        this.pageid = URL.address[ 1 ] || 'first'
        this.projectid = URL.address[ 0 ]; 
        this.pages =
          this.element
            .data( 'pages', { } )
            .data( 'pages' )
            ; 

        this._getPage( this.pageid, this.projectid  );
        this.currentPage = this.addToPageObj( { pageid: this.pageid } ); //Create page obj of the current page 

     }
    //////////
    , _create: function () {}
    //////////
    
    /////////////
    , _setOption: function ( key, value ) {
    /////////////
      this.options[ key ] = value;
      switch ( key ) {}//END SWITCH
      if ( key = 'disabled' && value == false ) {}
    }//END OPTIONS 
    
    //////////
    , destroy: function () { $.Widget.prototype.destroy.apply( this ); }
    //////////
    
    /////
    , ui: function () { return {  element: this.element, pageid: this.pageid   }; }
    /////
    
    //////////////    
    , _examineUrl: helperExamineUrl
    //////////////
    
    ///////////
    , _getPage: function ( pageid, projectid, designid ) {
    ////////////////////////////////////////////
        // GET PAGE INFORMATION FROM DATABASE //
        ////////////////////////////////////////

        var data = 
          $.parseJSON( 
            this._ajax( {
              pageid: pageid
            , projectid: projectid
            , designid: designid
            })//END _AJAX
          );//END PARSEJSON

      
      this._updateCurrentPageId( data.pageid );
      
      if ( data.css ) this._addCss( data );
      if ( data.tpl ) this._addTpl( data );
      if ( ! data.tpl && ! data.css ) this._addDesignSelection( data, pageid, projectid );
     
    }//END GETPAGE
    
    /////////////
    , _addScript: function ( data ) {
    //////////////////////////////////////////
      // PUT STYLEABLES SCRIPTS IN THE HEAD // 
      ////////////////////////////////////////
      var script = document.createElement( 'script' );
      script.type = 'text/javascript';
      script.text = data.script;
      $( 'head' )[ 0 ].appendChild( script );
    }//END ADDCSS

    //////////
    , _addCss: function ( data ) {
    /////////////////////////////////////////////////////
      // ADD CSS INFORMATION ( FAB ) CODE TO HTML HEAD //
      ///////////////////////////////////////////////////
      var css = document.createElement( 'script' );
      css.type = 'text/javascript';
      css.src = '/static/client/fab.js';
      css.text = '( STYLE )' + data.css + '()';
      $( 'head' )[ 0 ].appendChild( css );
    }//END ADDCSS
    
    //////////
    , _addTpl: function ( data ) {
    ///////////////////////////////////////////////////
        // ADD PAGES HTML GRID ( FAB ) CODE TO STAGE //
        /////////////////////////////////////////////// 
        var self = this
        , tpl = document.createElement( 'script' )
        ;

        this.designid = data.designid;
        tpl.type = 'text/javascript';
        tpl.src = '/static/client/fab.js';
        tpl.text = data.tpl.replace( /class/g, 'className' );
        tpl.onload = function () {
        
          self._trigger( 'addControls', null, self.ui() );
          $( '#' + data.designid + '2' ).unwrap();//Remove double page
          //self._addScript(  data );

        }//END ONLOAD
        ;
      
        $( '.STAGE' )
          .attr( 'id', data.designid + '0' )
          .find( '.PAGE' )
            .html( '' )
            .attr( 'id', data.designid + '1' )
            [ 0 ]
            .appendChild( tpl )
            ;
    }//END ADD TPL
    
    /////////////////////
    , _addDesignSelection: function ( data, pageid, projectid ) {
    ///////////////////////////////////////////////////////////////////////
      // ADD LIST OF DESIGNS TO MAKE A CHOISE WITCH PAGE SHOULD BE ADDED //
      /////////////////////////////////////////////////////////////////////

      var self = this;
      $( '.PAGE' )
        .designBrowser( { 
           designs: data 
         , pageId: pageid
         , projectId: projectid         
         , maxColumns: 3
         , onAClick: function ( event, ui ) {
            console.log( ui )
            self._getPage( ui.pageId, ui.projectId, ui.designId ) 
         }//END ONCLICK
        });
      
    }//END ADD DESIGN SELECTION 
    
    ///////////////////////
    , _updateCurrentPageId: function ( id ) {
    ///////////////////////
      //if ( this.currentPage.pageid != 'first' ) return;
      var self = this;

      //this.addToPageObj( $.extend( true,{}, self.pages.first, { pageid: id } ) );     
      //delete this.pages.first;
      this.pageid = id;//Update pageid 
      //this.currentPage.pageid = id;//Update pageid 
    }//END UPDATE CURRENT PAGE ID
        
    ////////
    , _ajax: function ( data, url, callback ) {
    ////////
        var self = this;
        return $.ajax({
          url: url || '/pages/ajax'
        , data: $.extend( { pageid: self.pageid, projectid: self.projectid  }, data ) 
        , success: function ( response ) {  
          
          callback( response );
        }
        }).responseText
        ;//END AJAX
    }//END SEND DATA
        
    /////////////
    , _syncMenus: function ( menu ) { /*$( 'PAGE menu'  ).not( menu ).html( menu.html() );*/  }//END _SYNC MENU
    /////////////
    
    /////////////////
    , _createUrlName: function ( name ) {
    /////////////////  
        return name
                .replace( /[^a-zA-Z :,. 0-9_,+;-]/g, '' )
                .replace( / /g, '-' )
                .toLowerCase()
                ; 
    }// END _CREATEURLNAME
    
    
    ////////////////
    , createPath: function ( $selector, old ) {
    ////////////////
       ///////////////////////////////////////////////////////////////////////
       // IF URLNAME IS ALREADY ANOTHER THAN THE NAME NO NEW PATH IS NEEDED //
       /////////////////////////////////////////////////////////////////////// 
       if ( old && this._createUrlName( old ) != $selector.attr( 'href' ).split( '/' ).pop() ) return false; //console.log(  this._createUrlName( old ) , x = $selector.attr( 'href' ).split( '/' ).pop() ) 
       
       var pagename = ''
        /////////////////
        // CREATE PATH //
        /////////////////  
        $selector
          .parentsUntil('.CONTAINER, .STICKER', 'menu' )
            .parent()
              .find( '> a' )
                .each( function () { pagename += $( this ).attr( 'href' ) } )
                ;
        
        ///////////////////////////////
        // MAKE URL CONFORM PAGENAME //
        ///////////////////////////////
        pagename += '/'
        pagename += this._createUrlName( $selector.text() );
               
        return pagename;
    }//END CREATEURLNAME

    ///////////////
    , addToPageObj: function ( obj ) {
    ///////////////
       if ( ! obj ) return false;
       var o = this.options
          , pageObj = $.extend( true, {}, o.defaults, obj )
          ;
        pageObj.projectid = this.projectid;//Set projectid

        return this.pages[ pageObj.pageid ] = pageObj;//Add new page to pageobj

    }//END ADD TO PAGE OBJ
    
    ////////////
    , getPageId: function () { return this.pageid }
    ////////////
    
    /////////
    , remove: function ( pageid ) { this.updatePageObj( { pagetype: 'removed' },  pageid ) }
    /////////    

    ////////////////
    , updatePageObj: function ( obj, pageid ) {
    ////////////////
        this.pages[ pageid || this.currentPage.pageid ] = $.extend( this.pages[ pageid || this.currentPage.pageid ], obj );// If no id is defined he updates the currentPage
    }//END UPDATE PAGE OBJ

    //////////
    , newPage: function ( $menu ) {
    //////////
        var newPages = $.makeArray( $menu.find( 'a:contains(New Page)' ) )
          , number = function ( p, number  ) {
             if ( ! p.length ) return number;
             var c = parseInt( $( p.pop() ).text().match( /\d+$/ ) );
              number = number < c ? c : number;    
              return arguments.callee( p, number );
            } ( $.merge( [], newPages ) , 0 )//END NUMBER 
            
          , pageid = uuid().substring( 0, 8 ).toUpperCase()//Create pageId
          , pagename = number != 0 ? 'New Page ' + ( number + 1 ) : newPages.length ? 'New Page 1' : 'New Page' 
          , $newPage =  $( '<a/>' ).attr( 'data-id', pageid ).text( pagename ).appendTo( $menu ).wrap( '<li></li>' )
          , $newPagePrev = $newPage.parent().prev().find( 'a:first' )
          ;
          
          //////////////
          // ADD PATH //
          //////////////
          $newPage.attr( 'href', this.createPath($newPage ) )//Add path  
          
          ///////////////////////////////////
          // ADJUST CSS STYLES & BIND DROP //
          ///////////////////////////////////
          $menu.page$menu( 'adjustCssClass', $newPage )
               .page$menu( 'bindDrop', $newPage )
               .page$menu( 'bindRename', $newPage )
               ;
          $menu.page$menu( 'adjustCssClass', $newPagePrev );
         
          /////////////////////
          // UPDATE PAGE OBJ //
          /////////////////////
          this.addToPageObj( this.createPageInformation( $newPage ) );
          this.addToPageObj( this.createPageInformation( $newPagePrev ) );
         
          ////////////////
          // SYNC MENUS //
          ////////////////
          //this._syncMenus( menu );
    
    }//END NEW PAGE
    
    ////////////////////////
    , createPageInformation: function ( $page, pagename ) {
    ////////////////////////
        if ( ! $page.length ) return false;
        var $prev = $page.closest( 'li' ).prev().find( '> a' )
          , $parent = $page.closest( 'menu' ).prev( 'a' )
          ;
        
        return {  
          pageid : $page.data( 'id' ) || uuid().substring( 0, 8 ).toUpperCase()//Create pageId ;
        , pagename : $page.text()
        , urlname : this._createUrlName( $page.text() )//$page.attr( 'href' ) || this._createUrlName(  $page.text() )
        , previd : $prev.length ? $prev.data( 'id' ) : 0
        , parentid : $parent.length ? $parent.data( 'id' ) : 0
        }
    }//END CREATEPAGEINFORMATION
    
    /////// 
    , save: function ( callback ) { 
    //////////////////////////
        // SAVE TO DATABASE //
        //////////////////////
        var self = this
          , pages = this.pages
          , json = {}
          ;
        delete pages.x  
        this.currentPage.tpl = JSON.stringify({
          css: toFab( $( 'style' )[ 0 ] ).replace( /\(.*STYLE.*\)/, '' ).replace( /\(\)/, '' )
        , tpl: toFab( $( '.PAGE' )[ 0 ] )
        , designid: this.designid
        });
        
        for ( var i in pages ) json[ pages[ i ].pageid ] = function ( page, order, array ) {
          if ( ! order.length ) return array;
          array.push( page[ order.shift() ] );
          return arguments.callee( page, order, array );
        } ( pages[ i ], [ 'projectid', 'pageid', 'parentid', 'previd', 'designid', 'pagename', 'urlname', 'notinmenu', 'visible', 'pagetype', 'tpl', 'ownertable', 'languagekey', 'landingpage' ] , [] )
        ;//END LOOP 
        
        var asArray = [];
        for ( var i in json ) {
          ///////////////////////////////////////////////////////////
          // REMOVED PAGES AT THE END TO PREVENT DATABASE PROBLEMS //
          ///////////////////////////////////////////////////////////
          if ( $.inArray( 'removed', json[ i ] ) == -1  ) asArray.unshift( json[ i ] );
          else asArray.push( json[ i ] );
        }
        this._ajax( { update: JSON.stringify( asArray  ) }, null ,callback );
    }//END SAVE
  });//END WIDGET
})( jQuery );