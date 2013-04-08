/**
 * @author Arno Prinz
 * 
 * sequence of js-files :
 *  					- jquery.js
 *  					- tsplit_beta.js
 *						- titemlist.js
 *  					- tzeroconstants.js
 * 						- tcontainer.js
 * 						- tnodeelement.js
 * 						- tnodes.js
 */
		// Bifork-Structure 	
		// Constructor
		// Classes for node

		// constants
	TNode.prototype.Type='node';

  function TNode() {
  	this.Owner = NIL;// nil-object, just a pointer
  	this.Spin = 0;		
  	this.ZeroNodeType = 'none';// 'root' 'container' 'sticker'
  	this.RemoveFlag = false;
  	this.HasParent = false;
  	this.Parent = new Object();
  	this.Parent = nilNode;
  	this.HasChild = false;
  	this.Child = new Object();
  	this.Child = nilNode;
  	 this.ContainerList = new TItemlist( 'list of container' );
  	this.ContainerList.Owner = this;

  	this.Text = ''; 
  	this.LevelMarker = '';
  	this.Top = 0;
  	this.Left = 0;
  	this.Width = 0;
  	this.Height = 0;
  	this.Ident = '';

  	this.Orientation = zeroConstants.defaultnodeorientation; //'v'; // v or h
  	this.Align = 'none';// none fit top bottom left right
  	this.Selector = '';
  	this.Visible = null;
    this.LeftDistance = 0;
    this.TopDistance = 0;
    this.HasChanged = false;
    this.HasRightScrollbar = false;
    this.HasBottomScrollbar = false;
    this.zIndex = 'auto';
    this.Label = 'Grid'
    this.fixHeight = true
  }
  ////////////////////////////////////////////
	// METHODS OF TNODE                       //
	// ASSIGN, EIGENSCHAFTEN VON ANDEREM ITEM //
	// ZUWEISEN (KEINE REFERENZ)              //
	////////////////////////////////////////////
	function TNode_doAssign( nd ) {
		for ( var i in nd ) this[ i ] = nd[ i ];
	}
	

        // find the end of a biforkstructure using an global helpobj from thelper.js
        // result is a neighbour in the bifork 
        function TNode_doRecursiveFindEnd(align){
            HelpObj[0]=this;
            if (this.HasChild) {
                switch (align){
                    case 'left':    HelpObj[0]=this.Child.UpNode.doRecursiveFindEnd(align);
                        break;
                    case 'right':   HelpObj[0]=this.Child.DownNode.doRecursiveFindEnd(align);
                        break;
                    case 'top':     HelpObj[0]=this.Child.UpNode.doRecursiveFindEnd(align);
                        break;
                    case 'bottom':  HelpObj[0]=this.Child.DownNode.doRecursiveFindEnd(align);
                        break;
                }
            }
            //console.log('Find end :' + startot + '-'+ align + ' -> '  + HelpObj[0].Ident + ' H:' + HelpObj[0].Height + ' W:' + HelpObj[0].Width);

            return HelpObj[0];            
        }

        function TNode_changeHeight(dh)
        {
            //console.log('node-height change ident -> ' + this.Ident + ' index:' + this.Parent.AbsoluteIndex + '  ' + this.Align + 'old H:' + this.Height + 'old W:' + this.Width);

            this.Height+=dh;
            this.HasChanged=true;

            //console.log('node-height change ident -> ' + this.Ident + ' index:' + this.Parent.AbsoluteIndex + '  ' + this.Align + 'new H:' + this.Height + 'new W:' + this.Width);

            return this.Height;
        }

        function TNode_changeWidth(dw)
        {
            //console.log('node-width change ident -> ' + this.Ident + ' index:' + this.Parent.AbsoluteIndex + '  ' + this.Align + 'old H:' + this.Height + 'old W:' + this.Width);

            this.Width+=dw;
            this.HasChanged=true;

            //console.log('node-width change ident -> ' + this.Ident + ' index:' + this.Parent.AbsoluteIndex + '  ' + this.Align + 'new H:' + this.Height + 'new W:' + this.Width);

            return this.Width;


        }

		function TNode_doFree()
		{
			var i;
			for (i in this) this[i] = null;
		}

        //action: nothing / reconstruction / append / insert / move / update / delete
        // allowed action for create no send: nothing / reconstruction
        //                         with send: append / insert / relink 
	function TNode_doDOM_Create ( action ) {
    
    var myparent = ( this.HasParent ) ? this.Parent.Parent : this.Owner // owner-ident is the ident of the zero-div (for a container too)
      , mynode = this
      , domparentident = ( this.HasParent ) ? '#' + this.Parent.Parent.Ident : '#' + this.Owner.Ident
      , domident='#' + this.Ident
      , myident=this.Ident
      , $newNode = $('<div/>')
    
    // remove the click events
    if ( myparent.Type == 'node' ) {
      
      $( '.UI' )
        .controls( 
          'remove'
        , '#' + myparent.Ident + '/grid/sortable'
        , '#' + myparent.Ident + '/grid/dev_gadgetBubble'
        , '#' + myparent.Ident + '/grid/styleable'
        , '#' + myparent.Ident + '/grid/dev_gadgetMedithumb'
        , '#' + myparent.Ident + '/grid/dev_gadgetSplit'
        )
        ;
        
        myparent.Visible=false;
    }
  
    $newNode
      .appendTo(domparentident)
      .attr( 'id', myident )
      .gadgetCreate({ 
        'css': { 'height': parseInt( mynode.Height ) + 'px', 'width': parseInt( mynode.Width ) + 'px' }
      , 'addClass': 'GRID' 
      });//END GADGET CREATE
      
    if ( mynode.Spin < 0 ) { 
    
      $newNode.addClass( 'BOX' );    
      
      $( '.UI' )
        .controls(
          'add'
        , [ $( '#' + this.Ident ).not( ':has(> .GRID)' ), 'grid/sortable' ]
        , [ '#' + this.Ident,  'grid/resizable', { maxWidth: controls$design$draw$grid( '_myrightwidth' )( mynode ) , handles: controls$design$draw$grid( '_myhandles' )( mynode ) } ]
        , '#' + this.Ident + '/grid/dev_gadgetBubble'
        , '#' + this.Ident + '/grid/styleable'
        , '#' + this.Ident + '/grid/dev_gadgetMedithumb'
        , '#' + this.Ident + '/grid/dev_gadgetSplit'  
        )
        ; 
    
    } else {
            
      $( '.UI' )
        .controls(
          'add'
        , [ $( '#' + this.Ident ).not( ':has(> .GRID)' ), 'grid/sortable' ]
        , '#' + this.Ident + '/grid/dev_gadgetBubble'
        , '#' + this.Ident + '/grid/styleable'
        , '#' + this.Ident + '/grid/dev_gadgetMedithumb'
        , '#' + this.Ident + '/grid/dev_gadgetSplit'
        )
        .controls( 'remove', '#' + this.Ident + '/grid/resizable' )
        ; 
  
    }//END IF/ELSE
        
    if ( mynode.ZeroNodeType == 'root' ) { 
      
      $newNode.addClass( 'BOX' );    
      
      $( '.UI' )
        .controls(
          'add'
        , [ $( '#' + this.Ident ).not( ':has(> .GRID)' ), 'grid/sortable' ]
        , [ '#' + this.Ident,  'grid/dev_gadgetSplit', { mouseEvent: false } ]
        , '#' + this.Ident + '/grid/dev_gadgetBubble'
        , '#' + this.Ident + '/grid/styleable'
        )
        .controls('remove', '#' + this.Ident + '/grid/dev_gadgetMedithumb' )
        ;  
        
    }//END IF
    this.Visible = true; 
  }//END TNODE_DODOM_CREATE			
		
 
        
      

        // switch resizer on or off 
        function TNode_doDOM_ToggleZeroResizing(switcher){
            alert('under construction');
        }         


       
      
         
     

        // remove node-elment
		function TNode_doDOM_Remove(action){
    
            var mynode = this
            // Moved this up, otherwise the return if spin==0 kicks in
            //action: nothing / reconstruction / append / update / delete
            action = action || 'delete'; // default - action
            switch (action){
                case 'delete':
                    //IOSC.doSend(this,'delete');
                    /* STICKER_mp IOSC.doRequestGridList(); */
                break;              
            }

            var domident='#' + this.Ident;
			
			if (this==undefined) return;
      
            
            //$('#' + mynode.Ident).dev_gadgetControls({ obj:mynode, sortable:  ['add',':has(> .GRID)'], dev_gadgetBubble:'add',dev_gadgetSplit:'add', dev_gadgetMedithumb:'add', resizable: 'add'  });
            $( '.UI' ).controls(
              'add'
            , [ $( '#' + mynode.Ident ).not(':has(> .GRID)'), 'grid/sortable' ]
            , '#' + mynode.Ident + '/grid/resizable'
            , '#' + mynode.Ident + '/grid/dev_gadgetBubble'
            , '#' + mynode.Ident + '/grid/styleable'
            , '#' + mynode.Ident + '/grid/dev_gadgetMedithumb'
            , [ '#' + mynode.Ident,  'grid/dev_gadgetSplit'  ]
            )
          
         
         console.log('controls_nodeelement_5');
			$(domident).remove();			
			
			// Node is zeronode ?? no buttons to restore and leave the routine ======>
			if (this.Spin==0){
			    return;				
			}

			var myparentident='';
			var ot='';
			if (this.HasParent){
				myparentident=this.Parent.Parent.Ident; // Parent Node
				ot=this.Parent.Parent.Orientation;
			}else{
				myparentident=this.Owner.Ident;	// Parent-Container		
				ot=this.Owner.Orientation;			
			};
            
		}
	
		function TNode_doDOM_Refresh(action){

            if (this.HasChanged){
        
        		//this.addScrollBar(this);

                $('#' + this.Ident).css({
                    'width':this.Width + 'px',
                    'height':this.Height + 'px'
                });

                this.doDOM_RetrieveOffset()
           	        
    	        // new position for split buttons
    	    
    	        $('#' + this.Ident).dev_gadgetSplit('setPosition')
    			
    			//action: nothing / reconstruction / append / update / delete
    			action = action || 'update'; // default - action
    			switch (action){
    				case 'update'://IOSC.doSend(this,'update');
    				break;				
    			}
                this.HasChanged=false;
            }
        }


        function TNode_doDOM_RetrieveOffset(){
            
            //var myoffset=$.offset();

            var myoffset=$('#' + this.Ident).offset();
            this.LeftDistance=Math.ceil(myoffset.left);
            this.TopDistance=Math.ceil(myoffset.top);        

            //console.log('node-retrieve offset: ident -> ' + this.Ident + ' index:' + this.Parent.AbsoluteIndex + '  ' + this.Align + ' LD:' + this.LeftDistance + ' TD:' + this.TopDistance);
            //console.log('node-retrieve offset: ident -> ' + this.Ident + ' index:' + this.Parent.AbsoluteIndex + '  ' + this.Align + ' H:' + this.Height + ' W:' + this.Width);
        }


		// basic datastructurebuilding functions, stand
		function TNode_doDBTreeDataobject(){
			var myparentid='';
			if (this.Align=='fit' || this.Align=='client' ){
				// container-zeronode
				return{	'datatype': 'node',
						'ident': this.Ident,
						'parentident': this.Owner.Ident, // eg.zeronodeident
						'containerident': this.Owner.Owner.Ident,
						'align': this.Align,
						'level': 0,
						'levelmarker': this.LevelMarker,
						'height': this.Height,
						'width': this.Width,
						'buildorder': 'noinfo',
						'rightscrollbar': this.HasRightScrollbar,
            'bottomscrollbar': this.HasBottomScrollbar,
						'url': '/zeronode',
						'index': 0,
						'parentindex': 0,
                        'parentspin': 0
						}				
			} else {				
				return{	'datatype': 'node',
						'ident': this.Ident,
						'parentident': this.Parent.Parent.Ident,
						'containerident': '',
						'align': this.Align,
						'level': this.Parent.Level,
						'levelmarker': this.LevelMarker,
						'height': this.Height,
						'width': this.Width,
						'buildorder': 'BUILD' + zeroConstants.websiteident,
						'url': '/split',
                        'index': this.Parent.AbsoluteIndex,
						'parentindex': this.Parent.Parent.Parent.AbsoluteIndex,
                        'parentspin': this.Parent.Parent.Spin
						}
			}
		}
		

		 


	    function TNode_getParentIdent(){
	        if (this.Align=='fit' || this.Align=='client' ){
	            return this.Owner.Owner.Ident;
            } else {
                return this.Parent.Parent.Ident; 
            }
	      
	    };
			
						
      TNode.prototype.doAssign = TNode_doAssign; 
      TNode.prototype.doFree = TNode_doFree;
      TNode.prototype.changeHeight=TNode_changeHeight;
      TNode.prototype.changeWidth=TNode_changeWidth;
      TNode.prototype.doRecursiveFindEnd=TNode_doRecursiveFindEnd;
      TNode.prototype.doDOM_Create=TNode_doDOM_Create;
      TNode.prototype.doDOM_ToggleZeroResizing=TNode_doDOM_ToggleZeroResizing;
      TNode.prototype.doDOM_Remove=TNode_doDOM_Remove;
      TNode.prototype.doDOM_Refresh=TNode_doDOM_Refresh;
      TNode.prototype.doDOM_RetrieveOffset=TNode_doDOM_RetrieveOffset;
      TNode.prototype.doDBTreeDataobject=TNode_doDBTreeDataobject;
      TNode.prototype.getParentIdent = TNode_getParentIdent;
        
	    // empty node for construction of the first node without parent
		var nilNode = new TNode();
		nilNode.LevelMarker = 'nil';   // leer wie null
		nilNode.Parent=nilNode;
		nilNode.Text = 'no node found';
		
		// temporary node for saving etc.
		var tmpNode = new TNode();
		// class-definitions, with capital T
		// basic-class: objects for TNodes








/// REMOVE LATER


    //////////////////////////////////////////////////////////////////////////
    // CLASS FOR SETTING ATTRIBUTES IN TNODES -ADD ETC.                     //
    // COMMUNICATION-PORT-ATTRIBUTES CPA                                    //
    // DEFAULTACTION SET TO APPEND (NEW NODE)                               //
    // IN CASE OF ZERONODE USE UID,UH,UW TO COMUNICATE WITH THE ATTRIBUTES  //
    //////////////////////////////////////////////////////////////////////////
    function TComAttr () {
        this.action = 'append';// nothing / reconstruction / append / insert / update / delete
        this.uid = '';//UpNode: ident 
        this.uh = 0;//height
        this.uw = 0;//width
        this.did = '';//DownNode:ident 
        this.dh = 0;//height
        this.dw = 0;//width
    }//END TCOMATTR

    function TComContainerAttr () {
        this.Action = 'append';// nothing / reconstruction / append / insert /update / delete 
        this.Ident  = '';//Container:   ident 
        this.Height = 0;//height
        this.Given = {};
        this.Kind = '';
        this.Text = '';
        this.Options = {kindSpecials: {}};
        this.Attributes = {};
        this.HasRightScrollbar = false;
        this.IsFitToParent = false;
        this.Html = ''; 
        this.Wrap = '';
        this.Label = '';
        this.Nature = '';
        this.RelatedContainer = '';
    }//END TCOMCONTAINERATTR