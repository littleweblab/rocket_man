//////////////////////
// BIFORK-IOS       //
////////////////////////////////////////////
                    // CALLBACKS:         // 
                    // action             //
                    // OPTIONS:           //
                    // -type              //
                    // -action            //
                    // -selectable:       //
                    //      single,       //
                    //      none,         //
                    //      multiSelect   //
                    //                    //
                    /////////////////////////////////
                    // the new call for IOSC.
                    // $('.PAGE').ios('GetZeroNodes').
                    /////////////////////////////////       
(function($) {  
    $.widget( "bifork.ios", {

// OPTIONS:                        
            options:{ 
                rootident: '',
            }
// CREATE:   
            ,_create: function(){
                var self = this,   
                    o = self.options,   
                    el = self.element;                   
                    
                this.el = this.element;
                    
                this.dd={};
                //this.IOCS={};

                console.log('widget ios rootident: ' + o.rootident);
               
            }
// INIT:                            
            ,_init: function(){
                var self = this.element, o = this.options;
                //////////////
                // THE REST //
                //////////////
                this.ZeroNodeType = 'root'; //mark as root - zeronode
                this.Projectid = '';        // Projectid, visible for gadgets
                ////////////////////////////
                // BUILDING THE STRUCTURE //
                ////////////////////////////
                this._doReadBiforkFromDB(); //get bootstrap from webserver
                this._doSetConstant();

                console.log('widget ios init zeroconstants: ',zeroConstants);

                this._doSetRules();
                ////////////////////////////////////////////////////////////////////////////////////////
                // zeroNodes now part of TIOS.class --> you need an doReadDBTree() for each rootident //
                ////////////////////////////////////////////////////////////////////////////////////////
                this.zeroNodes = new TNodes( 'zeroNodes', NIL, o.rootident );
                this._doRestoreBiForkFromDB(this.zeroNodes);// subfiles/startdatafile
                
                // simulattion of an IOSC
                this.IOSC={zeroNodes:this.zeroNodes};
                
            }

// DESTROY:              
             ,destroy: function() { 
             
                 this.element.unbind().remove();                                  
                 $.Widget.prototype.destroy.apply(this);
             }
             
// SETOPTION             
             ,_setOption: function( option, value ) {
                 $.Widget.prototype._setOption.apply( this, arguments );   
                 var el = this.element;   
                 switch (option) {   
                    case "width":   
                        break;   
                    case "height":   
                        break;   
                }   
             }

// Test function with arguments
            ,GetM2: function(value) {
                var q=value * value
                return q;                
            }

// GET ZERONODES
            ,GetZeroNodes: function() {
                return this.zeroNodes;
            }

// GET NODEBYIDENT mapped function for TNodes.doFindNodeByIdent
            ,GetNodeByIdent: function(ident) {
                return this.zeroNodes.doFindNodeByIdent(ident);
            }
            
// GET ZERONODETYPE
            ,GetZeroNodeType: function() {
                return this.ZeroNodeType;
            }

// DO READBIFORKFROMDB
            ,_doReadBiforkFromDB: function () {
                this.dd = jQuery.parseJSON( 
                    $.ajax({
                        url: '/design/ajax'
                      , data: { 
                          type: 'design$draw$loadDesign'
                          , data: JSON.stringify({ projectId: URL.address[ URL.address.length -2 ]
                                , designId: URL.address[ URL.address.length -1 ]
                                })   
                      }//END DATA
                      , error: function ( err ) { alert('error'); }
                      , success: function ( msg ) {}
                    }).responseText //END $.AJAX 
                );//END JQUERY.PARSEJSON 
            }//END DOREADDBTREE
          

// DO UPDATEPAGE
            ,doUpdatePage:function () {
              
                var rootzeronode = this.zeroNodes.Item[ 0 ]
                  , mypw = rootzeronode.ContainerList.Item[ 1 ].Attributes.width
                  , myph = rootzeronode.ContainerList.Item[ 1 ].Attributes.height
                  , dw = mypw - rootzeronode.Width 
                  , dh =  myph - rootzeronode.Height
                  ;
                  
                  console.log('### TIOSC_doUpdatePage ###')
                  console.log( 'mypw', mypw )
                  console.log( 'myph', myph )
                  console.log( 'rootzeronode.Width', rootzeronode.Width )
                  console.log( 'rootzeronode.Height', rootzeronode.Height )
                  console.log( 'dw', dw )
                  console.log( 'dh', dh )
                
                
                this.zeroNodes.doDOM_FitWidthEnh( rootzeronode, dw, true );
                this.zeroNodes.doDOM_FitHeightEnh( rootzeronode, dh );
                        
                zeroConstants.Height = myph;
                zeroConstants.Width = mypw;
                zeroConstants.designposition = this.zeroNodes.PagePosition;
                
             
              }//END doUpdatePage

// DO SENDBIFORK
            ,doSendBifork: function  ( action ) {
                
                var self = this
                  , myUrl = ''
                  ///////////////////////////////////////////////
                  // CREATE LIST OF OBJECTS, NEED TYPE OF LIST //
                  ///////////////////////////////////////////////  
                  , mybiforklist= this.zeroNodes.doStepper( 'ioslist' )
                  //////////////////////////////////////////////////////////////
                  // CONVERT ELEMENTS OF LIST-DATABASE-TREE-DATAOBJECT MDBTDO //
                  //////////////////////////////////////////////////////////////
                  , mydbtreeobject = this._doBiforkToDBJson( mybiforklist )
                  console.log('mydbtreeobject', mydbtreeobject)
                  var mydbtreestring = JSON.stringify( mydbtreeobject );
            
                  // version using  mysql ios.js function update
                /*
                callScript = {
                    //projectid: 'A0B0C0' // do not remove is for search
                      projectid: URL.address[ URL.address.length -2 ]
                    , script:'script_update_design'
                    , parameters: URL.address[ URL.address.length -1 ] // script parameters
                    , data: mydbtreestring
                    , columns: JSON.stringify({ columnnames:[ 'none'] })   
                  };
                  
                  */
                callScript = { type: 'design$draw$updateDesign', data: JSON.stringify( [  URL.address[ URL.address.length -2 ], URL.address[ URL.address.length -1 ],  mydbtreestring ] ) 
                }
                
                $.ajax({
                    url: '/design/ajax'
                  , type: 'POST'
                  , async: true
                  , cache: false
                  , data: callScript
                  , error: function( err ){ 
                        alert(err.responseText);
                        console.log('error from sql ' + err.responseText);
                  }
                 , success: function( msg ){ 
                      console.log('message from sql ', msg[0].execcode);
                      alert( msg[0].execcode ); }
                }); //END AJAX
            
                
              }//END TIOSC_DOSENDBIFORK
              
              


// DO FILTERBIFORK
            /////////////////////////////////////////////////////////////        
            // extracts a list from the biforkobject dd with one datatype
            /////////////////////////////////////////////////////////////
            ,_doFilterBifork: function( datatype ) {
              var list = [];
              switch ( datatype ) {
                        case 'constant' : list[ list.length ] = this.dd[ 0 ].constant[ 0 ]; break;
                        case 'rules' : list[ list.length ] = this.dd[ 1 ].rules[ 0 ]; break;
                        case 'biforks' : for ( var r in this.dd[ 2 ].bifork ) list[ list.length ] = this.dd[ 2 ].bifork[ r ]; break;
                        case 'tree' : for ( var r in this.dd[ 2 ].tree ) list[ list.length ] = this.dd[ 2 ].tree[ r ];  break;
                    }
              return list;
            }
            
// DO SETCONSTANT
            ,_doSetConstant: function() {
                var mylist = this._doFilterBifork( 'constant' );
                for ( var e in mylist ) {
                        zeroConstants.status = mylist[ e ].status;
                        zeroConstants.Height = mylist[ e ].height;
                        zeroConstants.Width = mylist[ e ].width;
                        zeroConstants.groundzeroident = mylist[ e ].groundzeroident;
                        zeroConstants.defaultnodeorientation = mylist[ e ].defaultnodeorientation;
                        zeroConstants.LevelSeperator = mylist[ e ].levelseperator;
                        zeroConstants.websiteident = mylist[ e ].websiteident;
                        zeroConstants.defaultcontainerheight = 100; //mylist[e].defaultcontainerheight;
                        zeroConstants.mincontainerheight = mylist[ e ].mincontainerheight;
                        zeroIdenter.Base = zeroConstants.websiteident;
                        zeroConstants.projectident = mylist[ e ].projectident;
                        zeroConstants.designposition =  mylist[ e ].designposition
                        this.Projectid=mylist[ e ].projectident;
                    }//END LOOP
                    console.log('zeroConstants',zeroConstants)
              }//END T_DOSETCONSTANT 
            
// DOSETRULES
            ,_doSetRules: function () {
                var mylist = this._doFilterBifork( 'rules' );
                for ( var e in mylist ) {
                    zeroRules.DeltaHeightRule = mylist[ e ].deltaheightrule;
                    zeroRules.ContainerHeightRule = mylist[ e ].containerheightrule;
                    zeroRules.IdentRule = mylist[ e ].identrule;                
                }//END LOOP 
            }//END TIOSC_DOSETRULES

// DO RESTOREBIFORKFROMDB
            ////////////////////////////////////////////////////////////////
            // NEEDS TWO NODES FOR A BIFORK (EG. ONE SPLIT AND TWO NODES) //
            ////////////////////////////////////////////////////////////////
            ,_doRestoreBiForkFromDB: function () {
                ///////////////////////////////////////////
                // get part 'tree' from IOS - dataobject //
                ///////////////////////////////////////////
                var mylist = this._doFilterBifork( 'tree' )
                  , myobj = {}
                  , data = {}
                  , mynodes = {}
                  , nodeAttr = new TComAttr()
                  , boxnodeAttr = new TComAttr()
                  , cAttr = new TComContainerAttr()
                  , myorientation = ''
                  , partcount = 0
                  , zeronodeflag = false
                  , root = null;
                  
                var nds=this.zeroNodes; 
             
                for ( var e in mylist ) {
                  if (e == 2) {
                        boxnodeAttr.action = 'reconstruction';
                        boxnodeAttr.uid = mylist[ e ].ident;
                        boxnodeAttr.designposition = zeroConstants.designposition;//Add page position  
                        $( '.PAGE' ).width( zeroConstants.Width ).css( 'min-height', zeroConstants.Height );//Set page dimensions in dom because doAddZeroNode needs them.
                        root = nds.doAddZeroNode( zeroConstants.websiteident + '0', boxnodeAttr, 'root' );//Create root 
                                            
                    continue;
                    }//END IF
                    
                    data = mylist[ e ];
                 
              
                    if ( data.datatype == 'node' ) {
                      
                        if ( data.align == 'client' ) data.align = 'fit';//workaround for old align=client, set to fit // repair to fit
                      
                        switch( data.align ) {
                          case 'fit':   // zeronode, box
                              boxnodeAttr.action = 'reconstruction';
                              boxnodeAttr.uid = data.ident;
                              boxnodeAttr.uh = data.height;
                              boxnodeAttr.uw = data.width;
                              myobj = nds.doFindNodeByIdent( data.parentident );//returns biforkelement-object
                              if ( myobj == undefined ) alert( 'unkown ident !!' );
                              if( myobj.Type == 'container')  myobj.doAddZeroSplit(data.parentident, boxnodeAttr);//create new TNodes in container
                              else alert('doRestoreBiForksFromDBTree, zeronode unknown parent !');
                              myorientation = 'n';
                              partcount = 0;
                              zeronodeflag = true;                  
                            break;//END FIT
        
                          case 'left':
                              nodeAttr.uid = data.ident;
                              nodeAttr.uh = data.height;
                              nodeAttr.uw = data.width;
                              myorientation = 'v';
                              partcount++;
                              zeronodeflag = false;
                            break;//END LEFT
                          
                          case 'right':
                              nodeAttr.did = data.ident;
                              nodeAttr.dh = data.height;
                              nodeAttr.dw = data.width;
                              myorientation = 'v';
                              partcount++;
                              zeronodeflag = false;
                            break;//END RIGHT
                          
                          case 'top':
                              nodeAttr.uid = data.ident;
                              nodeAttr.uh = data.height;
                              nodeAttr.uw = data.width;
                              myorientation = 'h';
                              partcount++;
                              zeronodeflag = false;
                            break;//END TOP
                            
                          case 'bottom':
                              nodeAttr.did = data.ident;
                              nodeAttr.dh = data.height;
                              nodeAttr.dw = data.width;
                              myorientation = 'h';
                              partcount++;
                              zeronodeflag = false;
                            break;//END BOTTOM
                        }//END SWITCH
                        
                        ///////////////////////////             
                        // waits for second node //
                        ///////////////////////////
                        if ( partcount == 2 && zeronodeflag == false ) {
                            nodeAttr.action = 'reconstruction';
                            myobj = nds.doFindNodeByIdent( data.parentident );
                            mynodes = myobj.Owner; // set nodes-controll 
                            if ( myobj == undefined ) alert( 'unkown ident !!' );
                            mynodes.doAdd( myobj, myorientation, 'split made by id -> '+ myobj.Ident, nodeAttr );// append bifork to current nodes-structure 
                            partcount = 0;
                        }//END IF
                    }
                
                
                  if ( data.datatype == 'stage' ) {
                     $('.STAGE').parent().styleable(
                        'add'
                        , data  
                     );//END STYLEABLE
                  }
                  if ( data.datatype == 'page'  ) {
                      console.log(data)
                       $('.STAGE').styleable(
                          'add'
                          , data  
                         );//END STYLEABLE
                  }
                  if ( data.datatype == 'styleable'  ) {
                    $( '#' + data.parent ).styleable(
                      'add'
                      , data  
                      , function ( data, overwrite ) {
                          $( '.UI' ).controls(
                             'remove'
                           , [  data.parent, 'grid/dev_gadgetSplit' ]
                           , [  data.parent, 'grid/dev_gadgetMedithumb' ]
                           )
                           .controls( 
                            'add'
                          , [ data.self, data.type ]
                          , [ data.self, data.task, overwrite ]
                          )
                          ;
                        }//END CALLBACK
                    )//END STYLEABLE
                    ;   
                    helperEmtyPageDesign();
                  }//END IF
                
                }//END LOOP IN E IN MYLIST
                
                /////////////////////////////////////////////////
                // RESTSTORE COUNTER OF IDENTER IN ZEROIDENTER //
                /////////////////////////////////////////////////
                zeroIdenter.IdenterCount += e; //count of members in list   
                ////////////////////////////////////
                // CREATE STYLEABLE ITEM FOR PAGE //
                ////////////////////////////////////

                if ( IfDefConLog.AfterLoadFlagZeroNode == true ){ console.log( 'After DB-Load: ', this.zeroNodes ); };
          }//END TIOSC_DORESTOREBIFORKFROMDB


// DO BIFORKTODBJSON
          /////////////////////////////////////////////////  
          // NODE-VERSION FOR OUTPUT THE BIFORKSTRUCTURE //
          /////////////////////////////////////////////////
          ,_doBiforkToDBJson: function( list ) {
            var myparentident = ''
              , dataobj = [ { 'constant': [] }, { 'rules': [] }, { 'tree': [] } ];
    
            dataobj[ 0 ].constant[ dataobj[ 0 ].constant.length ] = {
              'datatype': 'constant'
            , 'status': 'view'
            , 'height': zeroConstants.Height
            , 'width': zeroConstants.Width
            , 'groundzeroident': zeroConstants.groundzeroident
            , 'defaultnodeorientation': zeroConstants.defaultnodeorientation
            , 'levelseperator': zeroConstants.LevelSeperator
            , 'websiteident': zeroConstants.websiteident
            , 'defaultcontainerheight': zeroConstants.defaultcontainerheight
            , 'projectident': zeroConstants.projectident
            , 'designposition': zeroConstants.designposition
            };//END DATAOBJ
          
            dataobj[ 1 ].rules[ dataobj[ 1 ].rules.length ] = {
              'datatype': 'rules'
            , 'deltaheightrule': zeroRules.DeltaHeightRule
            , 'containerheightrule': zeroRules.ContainerHeightRule
            , 'identrule': zeroRules.IdentRule
            , 'dummy': 'nil'
            };//END DATAOBJ
                
          
            var styleableStage = $( '.STAGE' ).parent().styleable('getSytleableData', '.STAGE' );
            var styleablePage = $( '.STAGE' ).styleable( 'getSytleableData', '.PAGE' );
           
            dataobj[ 2 ].tree[ dataobj[ 2 ].tree.length ] = $.extend( true,{}, styleableStage, { 'datatype': 'stage', parent: 'body', self:'' }  );
            dataobj[ 2 ].tree[ dataobj[ 2 ].tree.length ] = $.extend( true,{}, styleablePage, { 'datatype': 'page', parent: styleablePage.parent.attr( 'id' ), self:'' }  );
              
            for ( var e in list ) {                
              switch( list[ e ].Type ) {
                case 'split' :
                  myparentident = ( list[ e ].Level == 0 ) ? list[ e ].Owner.Ident : list[ e ].Parent.Ident; 
                  dataobj[ 2 ].tree[ dataobj[ 2 ].tree.length ] = list[ e ].UpNode.doDBTreeDataobject(); // build form upnode
                  dataobj[ 2 ].tree[ dataobj[ 2 ].tree.length ] = list[ e ].DownNode.doDBTreeDataobject();  // build form downnode:
                  
                    var styleableExistUpNode = 
                      $( '#' + list[ e ].UpNode.Ident ).data( 'styleable' ) != undefined 
                    ? $( '#' + list[ e ].UpNode.Ident ).styleable( 'styleablesList' ) 
                    : ''
                    ;
                    
                    var styleableExistDownNode = 
                      $( '#' + list[ e ].DownNode.Ident ).data( 'styleable' ) != undefined 
                    ? $( '#' + list[ e ].DownNode.Ident).styleable( 'styleablesList' ) 
                    : ''
                    ; 
                 
                    for ( var styleable in styleableExistUpNode ) { 
                      dataobj[ 2 ].tree[ dataobj[ 2 ].tree.length ] = 
                        $.extend( 
                          true
                        ,{}
                        , styleableExistUpNode[ styleable ]
                        , { 'datatype': 'styleable', parent: list[ e ].UpNode.Ident, self: '' }  
                        )//END EXTEND
                        ;
                    }//END LOOP
                    for ( var styleable in styleableExistDownNode ) { 
                      dataobj[ 2 ].tree[ dataobj[ 2 ].tree.length ] = 
                        $.extend(
                          true 
                        , {}
                        , styleableExistDownNode[ styleable ]
                        , { 'datatype': 'styleable',  parent: list[ e ].DownNode.Ident, self:'' } 
                        )//END EXTEND
                        ;
                    }//END LOOP              
                  
                    console.log('>', styleableExistUpNode )
                    console.log('>', styleableExistDownNode )
                break;
              
                
                case 'container' :
                  dataobj[ 2 ].tree[ dataobj[ 2 ].tree.length ] = list[ e ].doDBTreeDataobject();
                break;
                case 'node' :
                  // if (e==0) break; // ignore groundzero ??? 
                  if ( list[ e ].Spin == 0 ) {
                    myparentident = list[ e ].Owner.Owner.Ident; 
                    dataobj[ 2 ].tree[ dataobj[ 2 ].tree.length ] = list[ e ].doDBTreeDataobject(); // build form zeronode
                  }//END IF
                break;
                default:
                  dataobj[ 2 ].tree[ dataobj[ 2 ].tree.length ] = {
                    'datatype': 'unknown in index ' + e.tostring
                  , 'buildorder':   'BUILD'+ zeroConstants.websiteident + dataobj[2].tree.length
                  };
                break;
              }//END SWITCH               
            }//END LOOP IN LIST
            return dataobj;
          }//END DOBIFORKTODBJSON



    }); // END  $.widget     
            
})(jQuery);
             