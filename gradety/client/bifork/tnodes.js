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
			
		// BiFork-Controller: handles TSplit and TNode  		
		// ===========================================
		// methods for TNodes
		// Basic add function, makes a split plus two nodes
		// parameter current node, , 'v' or 'h', cpa->TComAttr for reconstruction only
		// redundance: Align  orientation	v	h	(Left	horizontal) 
		//	spin = +1			   upnode	left	top
		//	spin = -1			 downnode	right	bottom
		//                    
		function TNodes_doAdd( nd, orientation, txt, comportattr )
		{
			var cpa= comportattr || new TComAttr();
			var curindex=-1;
			var curlevel=-11;
		 	var ot = (orientation==null) ? zeroConstants.defaultnodeorientation : orientation;
			// count=0 	==> ignore nd, it is the first node of all nodes
			// 				creates the zero-div, base of all following nodes
			if (this.Count == 0) {
				this.Count = 1;
				curindex = 1;
				curlevel = 1;
			}else{
				
				switch (nd.Spin){
					// nd is UpNode
					case  1:	curindex=nd.Parent.AbsoluteIndex + 1;
								break;
					// nd is DownNode
					case -1:	if (nd.Parent.UpNode.HasChild){
									// look for highest index in branch
									curindex = nd.Parent.AbsoluteIndex + 1;
									for (var i=curindex;i<=this.Count;i++){
									    if(this.Item[i].Level<=nd.Parent.Level){									        
									        break;
									    }
                                       curindex=i;
									}
									curindex++;
									
									//while (this.Item[curindex].Level>nd.Parent.Level){
									//    curindex++;
								    //};
									// last index + 1
									//curindex++;	
								}else{
									curindex=nd.Parent.AbsoluteIndex + 1;		
								}								
								break;
					// nd is ZeroNode
					case  0:	curindex = 1;
								break;
					default:
				}
				
				var curlevel=nd.Parent.Level + 1;
				this.doIndexUp(curindex); // Count increments internal				
			}
			
			// create new split
			var obj = this.Item[curindex] = new TSplit();
			obj.Parent = nd; //nd.Parent;
			obj.HasParent = true;
			nd.HasChild = true;
			nd.Child = obj;
			with (obj) {
				Owner = this; 	// split-owner is nodes-structure
				AbsoluteIndex = curindex;			
				Level = curlevel;
				RelativIndex = (nd.Spin<0) ? 2 : 1;   // Parent DownNode then 2
				//Ident = this.doIterateIdent();
				Orientation = ot;
				Text = txt;
				LevelMarker = nd.LevelMarker + this.Seperator + curlevel;

				if (cpa.action == 'reconstruction' || cpa.action == 'insert' || cpa.action == 'relink') {
					switch (ot) {
						case 'v':
							Width = cpa.uw  + cpa.dw;
							Height =cpa.uh; 
							break;
							
						case 'h':
							Height = cpa.uh + cpa.dh;
							Width = cpa.uw;
							break;
					}
				}
				else {
					switch (ot) {
						case 'v':
							Width = nd.Width;
							Height = nd.Height;
							break;
							
						case 'h':
							Height = nd.Height;
							Width = nd.Width;
							break;
							
						default:
							{
								Width = nd.Width;
								Height = nd.Height;
							}
					}
				} 
			}

			// set UpNode and DownNode
			// 1.UpNode
			
			obj.UpNode.Owner = this; 	// node-owner is nodes-structure
			obj.UpNode.Parent = obj;
			obj.UpNode.HasParent = true;
			obj.UpNode.Spin = 1; 				// Up
			obj.UpNode.Orientation = obj.Orientation; // ?? could be read from Parent.Orientation
			obj.UpNode.Text=obj.Text;
			obj.UpNode.LevelMarker = obj.LevelMarker + '+'; 
			obj.UpNode.Ident = (cpa.uid=='')?zeroIdenter.doIterate(obj.UpNode.LevelMarker):cpa.uid;
			if (cpa.action == 'reconstruction'|| cpa.action == 'insert' || cpa.action == 'relink') {
				obj.UpNode.Width = cpa.uw;
				obj.UpNode.Height = cpa.uh;
			}
			else {
				switch (obj.UpNode.Orientation) {
					case 'v':
						obj.UpNode.Width = Math.ceil(nd.Width / 2);
						obj.UpNode.Height = nd.Height;
						break;
						
					case 'h':
						obj.UpNode.Height = Math.ceil(nd.Height / 2);
						obj.UpNode.Width = nd.Width;
						break;
						
					default:
						{
							obj.UpNode.Width = nd.Width;
							obj.UpNode.Height = nd.Height;
						}
				}
			} 

			// 2.DownNode
			obj.DownNode.Owner = this; 	// node-owner is nodes-structure
			obj.DownNode.Parent = obj;
			obj.DownNode.HasParent = true;
			obj.DownNode.Spin = -1; 				// down
			obj.DownNode.Orientation = obj.Orientation; // ?? could be read from Parent.Orientation
			obj.DownNode.Text=obj.Text;
			obj.DownNode.LevelMarker = obj.LevelMarker + '-'; 
			obj.DownNode.Ident = (cpa.did=='')?zeroIdenter.doIterate(obj.DownNode.LevelMarker):cpa.did;
			if (cpa.action == 'reconstruction'|| cpa.action == 'insert' || cpa.action == 'relink') {
				obj.DownNode.Width = cpa.dw;
				obj.DownNode.Height =cpa.dh;								
			}else{
				switch (obj.DownNode.Orientation) {
					case 'v':
						obj.DownNode.Width = Math.floor(nd.Width / 2); 
						obj.DownNode.Height = nd.Height;
						// - obj.UpNode.Width;
						break;
						
					case 'h':
						obj.DownNode.Height = Math.floor(nd.Height / 2); 
						obj.DownNode.Width = nd.Width;
						// - obj.UpNode.Height;
						break;
						
					default:
						{
							obj.DownNode.Width = nd.Width;
							obj.DownNode.Height = nd.Height;
						}
				}
			}
			// set alignment for up- and downnode
			switch(obj.Orientation) {
				case 'v':
					obj.UpNode.Align='left';
					obj.UpNode.LevelMarker+='L';
					obj.DownNode.Align='right';
					obj.DownNode.LevelMarker+='R';
					break;
				case 'h':
					obj.UpNode.Align='top';
					obj.UpNode.LevelMarker+='T';
					obj.DownNode.Align='bottom';
					obj.DownNode.LevelMarker+='B';
					break;
			}
            
             // console !!!!!!!!!!!!!!!!!!
             if (IfDefConLog.AfterCreateFlagSplit){
                 console.log('SplitCreate ->' + 'Index: ' + obj.AbsoluteIndex 
                 + ' UpNode,DownNode: ' + obj.UpNode.Ident + '|' + obj.DownNode.Ident, obj);
             }

			// now call DOM_create from the two node-objects himself
			obj.UpNode.doDOM_Create(cpa.action);
			obj.DownNode.doDOM_Create(cpa.action);
			
			obj.UpNode.doDOM_RetrieveOffset();
			obj.DownNode.doDOM_RetrieveOffset();
                        
            //console.log('upnode   -> ' + obj.AbsoluteIndex + '  ' + obj.UpNode.Align + ' LD:' + obj.UpNode.LeftDistance + ' TD:' + obj.UpNode.TopDistance);
            //console.log('downnode -> ' + obj.AbsoluteIndex +  '  ' + obj.DownNode.Align + ' LD:' + obj.DownNode.LeftDistance + ' TD:' + obj.DownNode.TopDistance);

            //console.log('element -> ' + obj.AbsoluteIndex + ' VD:' + obj.LeftDistance + ' HD:' + obj.TopDistance);
            //console.log('element -> ' + obj.AbsoluteIndex + ' pos:' + position.left + '/' + position.top);

			return this.Item[curindex];
		}


  function TNodes_doAddZeroNode( nid, comportattr, zeronodetype ) {
    var cpa = comportattr || new TComAttr()
      , mynode = this.Item[ 0 ] = new TNode();
    
    with ( mynode ) {
      
      Owner = this; //TNode becomes owner of his nodes
      AbsoluteIndex = 0;
      HasChild = false;
      Level = 0;
      ZeroNodeType=zeronodetype;
      
      
      if ( zeronodetype == 'root' ) {
        Text = 'groundzero';
        LevelMarker = this.Seperator + '0';
        HasParent = false;
        Parent = NIL;
        this.PagePosition = cpa.designposition;
      
      } else {
       
        Text = this.Owner.Text + 'zero';
        switch ( this.Owner.Type ) {
          case 'nodes' : LevelMarker = this.Owner.LevelMarker + this.Seperator + '0';
          break;
          case 'split' : LevelMarker = this.Owner.LevelMarker + this.Seperator + '0';
          break;
          case 'node' : LevelMarker = this.Owner.LevelMarker + this.Seperator + '0';
          break;
          case 'container' : LevelMarker = this.Owner.Owner.LevelMarker + this.Seperator + '0';
          break;
          default : LevelMarker = 'objecttype missing';
        }//END SWITCH 
        
        Parent = NIL;
      }// END IF/ELSE
      
      RelativIndex = -1;
      Ident = ( cpa.uid == '' ) ? zeroIdenter.doIterate( LevelMarker ) : cpa.uid;
      Orientation = 'n';
      Align='fit';
    }//END WIDTH
            
    var oH = $( '#' + mynode.Owner.Ident ).outerHeight();
    var iH = $( '#' + mynode.Owner.Ident ).innerHeight();
    var xH = $( '#' + mynode.Owner.Ident ).height();
    var oW = $( '#' + mynode.Owner.Ident ).outerWidth();
    var iW = $( '#' + mynode.Owner.Ident ).innerWidth();
    var xW = $( '#' + mynode.Owner.Ident ).width();
    
    ///////////////////////////////////////////////////////       
    // now set the height and width for the page-element //
    ///////////////////////////////////////////////////////
    this.Height =  xH;
    this.Width =  xW;
    
    ////////////////////////////////////////////////
    // ON RELOADS                                 //
    // THE ZERO NODE IN A CONTAINER HAS PROBLEMS  //
    // TO GET THE WIDTH OF HIS PARENT BECAUSE IT  //
    // ISN'T VISIBLE AT THE MOMENT OF IT'S RELEAD //
    // SO I PUT A IF QUESTION TO GET THE DB VALUE // 
    // IF JQUERY GETS 0 for w.                    //
    ////////////////////////////////////////////////
    
    var w = $( '#' + mynode.Owner.Ident ).width();
    if( w == 0 ) w = cpa.w;
    
    var h = $( '#' + mynode.Owner.Ident ).height();
    if( h == 0 ) h = cpa.h;
    
    mynode.Height = h;
    mynode.Width = w
    
    // from ground zero or  from container
    mynode.doDOM_Create( cpa.action );
    
    var myoffset = $( '#' + mynode.Ident ).offset();
    mynode.LeftDistance = Math.ceil( myoffset.left );
    mynode.TopDistance = Math.ceil( myoffset.top );
    
    return mynode 
  }//END TNODES_DOADDZERONODE



		function TNodes_doRemove(split,action){
			action=action||'delete';
			var parentnode=split.Parent;
			
			// save content of upnode in tmpNode
			var tmpNode=new TNode();
			tmpNode.doAssign(split.UpNode);
			
			split.RemoveFlag=true;
			split.UpNode.RemoveFlag=true;
			split.DownNode.RemoveFlag=true;

            // remove the children of the up- and downnodes first
            // delete from the last element to the first
            // therefore sort them in a flat list to count them down 
            var list=[];
            var n=0;
            var curindex = split.AbsoluteIndex+1;
            var obj = new Object()
            obj = this.Item[curindex];
            // remove children and branches
            // SUBTREES WILL BE REMOVED AUTOMATICALLY by mongoid_tree
            // remove children and branches in DOM only
            if (split.UpNode.HasChild || split.DownNode.HasChild){
                while (obj.Level>split.Level) {
                    //obj.UpNode.doDOM_Remove('nothing'); // dont send
                    //obj.DownNode.doDOM_Remove('nothing');
                    list[n]=obj.UpNode;
                    n++;
                    list[n]=obj.DownNode;
                    n++;
                    obj.RemoveFlag=true;
                    obj.UpNode.RemoveFlag=true;
                    obj.DownNode.RemoveFlag=true;
                    curindex++;
                    //if (curindex>this.Count) break;
                    obj = this.Item[curindex];
                    if (obj==undefined) break;                                  
                };
                // count down to delete
                for (var i=list.length-1;i>=0;i--){
                    list[i].doDOM_Remove('nothing');
                }  
            }

			// at last the parent nodes
			split.UpNode.doDOM_Remove(action);
			split.DownNode.doDOM_Remove(action);
            
            // restruct the bifork, delete marked items with RemoveFlag=true
			this.doCleanUpIndex(); 

      $( '.UI' ).controls(
          'add'
          , [ $( '#' + parentnode.Ident ).not( ':has(> .GRID)' ), 'grid/sortable' ]
          , parentnode.ZeroNodeType !== 'root' ? '#' + parentnode.Ident + '/grid/dev_gadgetSplit' : [ '#' + parentnode.Ident,  'grid/dev_gadgetSplit', { mouseEvent: false } ]  
          , '#' + parentnode.Ident + '/grid/dev_gadgetBubble'
          , '#' + parentnode.Ident + '/grid/styleable'
          )
          ;

      if ( parentnode.ZeroNodeType !== 'root' ) { 
        $( '.UI' )
            .controls( 
              'add'
            , [ $( '#' + parentnode.Ident ).not( ':has(> .CONTAINER, > .STICKER )' ), 'grid/dev_gadgetMedithumb' ] 
            )
            ;
      }//END IF 
        
      parentnode.HasChild=false;
		}
						
        function TNodes_doRemoveZeroNode(action){
            if (this.Count > 0) {
                alert('you can not remove zeronode before Count is 0')
                return;
            }   
            action=action||'delete';
            var myownerobj=this.Owner;
            this.Item[0].doDOM_Remove(action);
            delete this.Item[0];
            if ( myownerobj.Type == 'container' ) {
                //this.Owner.doDOM_SetClickEvents(['all']); //container or stickerobj
         
              $( '.UI' ).controls(
                'add'
              , [ $( '#' + this.Owner.Ident ).not( ':has(> .GRID)' ), 'grid/sortable' ]
              , '#' + this.Owner.Ident + '/grid/dev_gadgetSplit'
              , '#' + this.Owner.Ident + '/grid/resizable'
              , '#' + this.Owner.Ident + '/grid/dev_gadgetBubble'
              , '#' + this.Owner.Ident + '/grid/styleable'
              , '#' + this.Owner.Ident + '/grid/dev_gadgetMedithumb'
              )
              ;
            }//END IF
        }//END TNODES_DOREMOVEZERONODE

		// not for i=0, belongs to node zero
		function TNodes_doIndexUp(index)
		{
			var i = 1;
			this.Count++;
                			
			for (i=this.Count; i>index; i--){
				this.Item[i]=this.Item[i-1];
				// restore internal item-values
				this.Item[i].AbsoluteIndex=i;
			}				

            //console.log('IndexUP for Index, Count : ' + index + ' --> ' + this.Count );
            //for (i=1;i<this.Count;i++){ 
            //    console.log('IndexUP Index=' + i + ' -->' + this.Item[i].AbsoluteIndex + ' ' + ' UpNode,DownNode: '
            //     + this.Item[i].UpNode.Ident + '|' + this.Item[i].DownNode.Ident, this.Item[i]);
            // }

		}

		// not for i=0, belongs to node zero
		function TNodes_doIndexDown(index)
		{
			if (index==this.Count){
				this.Count--;
			}
			else {
				var i = 1;	
				
				for (i=index; i<this.Count; i++){
					this.Item[i]=this.Item[i+1];
					// restore internal item-values
					this.Item[i].AbsoluteIndex=i;
				}
				this.Count--;
			}
		}
  
		function TNodes_doCleanUpIndex() // delete all items with RemoveFlag=true
		{	
			var curindex=1;
			do {
				if (this.Item[curindex].RemoveFlag) {
					do {					
						this.doIndexDown(curindex);						
						if (curindex>=this.Count){ break;}
					} while (this.Item[curindex].RemoveFlag );
				}
			}while (curindex++<=this.Count)
			var n=this.Item.length - 1;
			curindex = this.Count+1;
			for (curindex;curindex<=n;curindex++){
				//this.Item[curindex].doFree();
				delete this.Item[curindex];
			}			
			this.Item.length=this.Count + 1;
		}

		// retired, builds an extra <div> with class PAGE (frame-base)
		// groundzero is now rendered by rails
		// groundzero -> 'body' , container -> container id
  		function TNodes_doDOM_ZeroCreateNotUsed()
		{		
			alert('retired, donno use');

			$('<div id=' + this.Ident + ' class="PAGE" name=" ' + this.Objectname + ' ">' + '</div>')
			.css({
				'height': this.Height + 'px',
				'width' : this.Width + 'px'
			}).appendTo('body');

		}

 		// TNodes.Ident is from Frame-base of zero or zeroground
 		// zeroNode -> means ident=stage, in container -> ident is ident of the container
		function TNodes_doDOM_ZeroRefresh(action){

            if (this.Item[0].ZeroNodeType=='root'){
                alert('Do not call Zero-Refresh for Page !!');
                return;
            }
            
            if (this.Item[0].ZeroNodeType=='container' /* STICKER_mp || this.Item[0].ZeroNodeType=='sticker' */){

    			$('#' + this.Item[0].Ident).css({
    				'width':this.Item[0].Width + 'px',
    				'height':this.Item[0].Height + 'px'
    				})

                //action: n=nothing / r=reconstruction / a=append / u=update / d=delete
                action = action || 'update'; // default-action
                switch (action) {
                    case 'update':
                        //IOSC.doSend(this.Item[0],'update');
                        break;
                }                               
    		}


		}
		
        function TNodes_doDOM_FitHeightFix(nd,dh){
            // is the zero-node ???
            if (nd.HasParent!=true){
                if (nd.Text=='groundzero'){
                    
                }else{
                    if (nd.HasChild){
                        nd.Child.doFitHeight(dh, nd.Align);
                    }
                    nd.Owner.Owner.Height=nd.Child.Height;
                    nd.Owner.Owner.doDOM_Refresh('update');
                } 
                return false
            }; // zero-node

            dh=dh || 0;
            var myalign = 'none';
            var myspin = nd.Spin;
            var curct={};   // current container
            var i=0;    
            var sumcontainerheight=0;            
            // 1. ::::> 
            //set the current split from the node that triggered the change of width 
            
                var cursplit = nd.Parent;
                
                if (cursplit.UpNode.ContainerList.Count>0){
                    sumcontainerheight=cursplit.UpNode.doGetTotalContainerHeight();                            
                }
                
                cursplit.doFitHeightFix(dh, nd.Align);
                
                // 2. ::::>
                // the line of the parentnode has been dragged, position * is changed
                // fit the UpNode-Child of the bifork-split
                /*              |-- +
                 *      |-- * --
                 *  0 --        |-- +
                 *      |--
                 *  
                 */
                

                if (cursplit.Orientation == 'h') {
                    if (nd.Spin == 1) {
                        if (cursplit.UpNode.HasChild) {
                            cursplit.UpNode.Child.doRecursiveDrillDownFitHeightFix(dh, cursplit.UpNode.Align);// call through up node 
                        }
                        if (cursplit.DownNode.HasChild) {
                            cursplit.DownNode.Child.doRecursiveDrillDownFitHeightFix(-dh, cursplit.DownNode.Align);// call through down node
                        }
                    }
                    else {
                    }
                }
                
                // 3. ::::>
                // call recursiv down for drilldown all splits below
                // call it just for the opposite node 
                if (cursplit.Orientation == 'v') {
                    if (nd.Spin == 1) {
                        if (cursplit.DownNode.HasChild) {
                            cursplit.DownNode.Child.doRecursiveDrillDownFitHeightFix(dh, cursplit.DownNode.Align);// call through down node
                        }
                    }
                    else {
                        if (cursplit.UpNode.HasChild) {
                            cursplit.UpNode.Child.doRecursiveDrillDownFitHeightFix(dh, cursplit.UpNode.Align);// call through up node 
                        }
                    }
                }
                
                // 4. ::::>
                // uses recursive drilldown for all splits descent with level greater then cursplit
                // split-elements are restored in external object helplist
                // this list is local for the node, no drilldown ins any container
                // horizontal-orientation causes no height-resizing
                var j=0;
                var cursplit = nd.Parent;
                
                if (cursplit.Orientation == 'h') {
                    HelpList.list.length = 0;
                    HelpList.add(cursplit.UpNode); // first add his own node
                    if (cursplit.UpNode.HasChild) {
                        cursplit.UpNode.Child.doRecursiveDrillDown();
                    }
                    var upnodelist = HelpList.get();
                    for (j = 0; j <= upnodelist.length - 1; j++) {
                        if (upnodelist[j].ContainerList.Count == undefined) {
                        // no structure             
                        }
                        else {
                            for (i = 1; i <= upnodelist[j].ContainerList.Count; i++) {
                                curct=upnodelist[j].ContainerList.Item[i];
                                if (curct.IsFitToParent){
                                  curct.doToggleIsFitToParent ( true ); 
                                }
                            }
                        }
                    }
                    HelpList.list.length = 0;
                    HelpList.add(cursplit.DownNode); // first add his own node
                    if (cursplit.DownNode.HasChild) {
                        cursplit.DownNode.Child.doRecursiveDrillDown();
                    }
                    var downnodelist = HelpList.get();
                    for (j = 0; j <= downnodelist.length - 1; j++) {
                        if (downnodelist[j].ContainerList.Count == undefined) {
                        // no structure             
                        }
                        else {
                            for (i = 1; i <= downnodelist[j].ContainerList.Count; i++) {
                                curct=downnodelist[j].ContainerList.Item[i];
                                if (curct.IsFitToParent){
                                    curct.doToggleIsFitToParent ( true ); 
                                }
                            }
                        }
                    }  
                    
                }

            if (IfDefConLog.AfterResizeFlagZeroNode==true){console.log( $( '.PAGE' ).ios( 'GetZeroNodes' ).zeroNodes )};
                
            return true;
        } // end of Fit Height fix

       
		// parameters nd node | dh delta-height)
		function TNodes_doDOM_FitHeightEnh(nd,dh,caller){
			dh=dh || 0;
			caller=caller || 'default'; // the function, calling this routine
			var myalign = 'none';
			var myspin = nd.Spin;

            // first the zeroNode
            this.Item[0].changeHeight(dh);
            this.Item[0].doDOM_Refresh();
            this.Height+=dh;

			// node HasParent ??? ==> normal node or zeronode
            if (nd.ZeroNodeType=='none') {
				var cursplit = nd.Parent;

                // 1. ::::>  
                //set the current split from the node that triggered the change of height 
				
				cursplit.doFitHeight(dh, nd.Align);				

                // 2. ::::>  
				// the line of the parentnode has been dragged, position * is changed
				// fit the UpNode-Child of the bifork-split
				/*				|-- +
				 *  	|--	* --
				 *  0 --		|-- +
				 *		|--
				 *  
				 */
				
				if (cursplit.Orientation == 'h') {
					if (nd.Spin == 1) {
						if (cursplit.UpNode.HasChild) {
							cursplit.UpNode.Child.doRecursiveDrillDownFitHeight(dh, cursplit.UpNode.Align);// call through down node
						}
					}
					else {
					}
				}

                // 3. ::::>  
				// call recursiv down for drilldown all splits below
				// call it just for the opposite node 
				if (cursplit.Orientation == 'v') {
					if (nd.Spin == 1) {
						if (cursplit.DownNode.HasChild) {
							cursplit.DownNode.Child.doRecursiveDrillDownFitHeight(dh, cursplit.DownNode.Align);// call through down node
						}
					}
					else {
						if (cursplit.UpNode.HasChild) {
							cursplit.UpNode.Child.doRecursiveDrillDownFitHeight(dh, cursplit.UpNode.Align);// call through up node 
						}
					}
				}
				
				// 4. ::::>
				// query for list of all split-above the current split
				// in down to up order, parent is from type node
				if (cursplit.HasParent) {
					var splitlist = this.doStepper('upsplits', cursplit.Parent);
				}
				else {
				
				// node is zero-node !!!
				}
				
    			myalign = cursplit.Parent.Align; // tell last align 
				myspin = cursplit.Parent.Spin; // tell last spin (means up- or down-node)
				for (var e in splitlist) {
					cursplit = splitlist[e];
					cursplit.doFitHeight(dh, myalign);
					if (cursplit.Orientation == 'v') {
						if (myspin == 1) {
							if (cursplit.DownNode.HasChild) {
								cursplit.DownNode.Child.doRecursiveDrillDownFitHeight(dh, cursplit.DownNode.Align);// call through down node
							}
						}
						else {
							if (cursplit.UpNode.HasChild) {
								cursplit.UpNode.Child.doRecursiveDrillDownFitHeight(dh, cursplit.UpNode.Align);// call through up node 
							}
						}
					}
					
					myalign = cursplit.Parent.Align;
					myspin = cursplit.Parent.Spin;
				}
			}// has parent
			else{
				// else is zero-node
                // 2. ::::>  

                // fit the Node-Child of the zero-node --> this.Item[0]
                if (nd.ZeroNodeType=='root'){  
                    if (nd.HasChild){
                        nd.Child.doRecursiveDrillDownFitHeight(dh, 'bottom')
                    }                       
                    if (nd.ContainerList.Count==1){
                        if (nd.ContainerList.Item[1].IsFitToParent){
                            // calculate the new height ( = dh for the moment)
                            var ctdh=this.Item[0].Height-nd.ContainerList.Item[1].Height;
                            nd.ContainerList.Item[1].doFitToParent(nd.Height);
                        }
                    }
                }				
                if (nd.ZeroNodeType=='container'){
                    //if (this.Item[0].Owner.Owner.IsFitToParent){
                        if (nd.HasChild){
                            nd.Child.doRecursiveDrillDownFitHeight(dh, 'bottom');
                        }                                          
                    //}
                }    
                /* STICKER_mp              
                if (nd.ZeroNodeType=='sticker'){
                    doPrint('nodes-heightEnh sticker ->' + nd.Ident)
                    nd.ContainerList.Item[1].doFitToParent(nd.Height);
                }
                */
			}       
									 			
			var i=0;	

		}   // end of Fit Height
		
		function TNodes_doDOM_FitWidthFix(nd,dw){
			dw=dw || 0;
			//var myalign = 'none';
			var myspin = nd.Spin;
			var curct={};	// current container
			var i=0;	
						
			// first 
			//set the current split from the node that triggered the change of width 
			// is not the zero-node
			if (nd.HasParent) {
				var cursplit = nd.Parent;
				
				cursplit.doFitWidthFix(dw, nd.Align);
				
				// second
				// the line of the parentnode has been dragged, position * is changed
				// fit the UpNode-Child of the bifork-split
				/*				|-- +
				 *  	|--	* --
				 *  0 --		|-- +
				 *		|--
				 *  
				 */
				
				if (cursplit.Orientation == 'v') {
					if (nd.Spin == 1) {
						if (cursplit.UpNode.HasChild) {
							cursplit.UpNode.Child.doRecursiveDrillDownFitWidthFix(dw, cursplit.UpNode.Align);// call through up node 
						}
						if (cursplit.DownNode.HasChild) {
							cursplit.DownNode.Child.doRecursiveDrillDownFitWidthFix(-dw, cursplit.DownNode.Align);// call through down node
						}
					}
					else {
					}
				}
				
				// third
				// call recursiv down for drilldown all splits below
				// call it just for the opposite node 
				if (cursplit.Orientation == 'h') {
					if (nd.Spin == 1) {
						if (cursplit.DownNode.HasChild) {
							cursplit.DownNode.Child.doRecursiveDrillDownFitWidthFix(dw, cursplit.DownNode.Align);// call through down node
						}
					}
					else {
						if (cursplit.UpNode.HasChild) {
							cursplit.UpNode.Child.doRecursiveDrillDownFitWidthFix(dw, cursplit.UpNode.Align);// call through up node 
						}
					}
				}
				
				// third
				// query for list of all split-above the current split
				// in down to up order, parent is from type node
				if (cursplit.HasParent) {
					var splitlist = this.doStepper('upsplits', cursplit.Parent);
				}
				else {
				
				// node is zero-node !!!
				}
				
				
			}
			
			// uses recursive drilldown for all splits descent with level greater then cursplit
			// split-elements are restored in external object helplist
			// this list is local for the node, no drilldown ins any container
			// Top-orientation causes no width-resizing
			var j=0;
			var mycontainerlist=[];
			
			if (nd.HasParent) {
				var cursplit = nd.Parent;
				
				if (cursplit.Orientation == 'v') {
					HelpList.list.length = 0;
					HelpList.add(cursplit.UpNode); // first add his own node
					if (cursplit.UpNode.HasChild) {
						cursplit.UpNode.Child.doRecursiveDrillDown();
					}
					var upnodelist = HelpList.get();
					for (j = 0; j <= upnodelist.length - 1; j++) {
						if (upnodelist[j].ContainerList.Count == undefined) {
						// no structure				
						}
						else {
							for (i = 1; i <= upnodelist[j].ContainerList.Count; i++) {
								curct=upnodelist[j].ContainerList.Item[i];
								curct.doFitContainerWidthEnh(upnodelist[j].Width);
							}
						}
					}
					HelpList.list.length = 0;
					HelpList.add(cursplit.DownNode); // first add his own node
					if (cursplit.DownNode.HasChild) {
						cursplit.DownNode.Child.doRecursiveDrillDown();
					}
					var downnodelist = HelpList.get();
					for (j = 0; j <= downnodelist.length - 1; j++) {
						if (downnodelist[j].ContainerList.Count == undefined) {
						// no structure				
						}
						else {
							for (i = 1; i <= downnodelist[j].ContainerList.Count; i++) {
								curct=downnodelist[j].ContainerList.Item[i];
								curct.doFitContainerWidthEnh(downnodelist[j].Width);
							}
						}
					}					
				}
				
			}
		}

		// parameters : calling node, delta-width, zeroflag (true change zeronode also)
		function TNodes_doDOM_FitWidthEnh(nd,dw,zeroflag){
			//console.log('call: doDOM_FitWidthEnh -> ' + nd.Type + ' -> ' + nd.Ident);

			dw=dw || 0;
			zeroflag=zeroflag || true;
			var myalign = 'none';
			var myspin = nd.Spin;

            // first the zeroNode
            this.Item[0].changeWidth(dw);
            this.Item[0].doDOM_Refresh();
            this.Width+=dw;

			// first 
			//set the current split from the node that triggered the change of width 
			// is not the zero-node
            // node HasParent ??? ==> normal node or zeronode
            if (nd.ZeroNodeType=='none') {
				var cursplit = nd.Parent;
				
				cursplit.doFitWidthEnh(dw, nd.Align);
				
				// second
				// the line of the parentnode has been dragged, position * is changed
				// fit the UpNode-Child of the bifork-split
				/*				|-- +
				 *  	|--	* --
				 *  0 --		|-- +
				 *		|--
				 *  
				 */
				
				if (cursplit.Orientation == 'v') {
					if (nd.Spin == 1) {
						if (cursplit.UpNode.HasChild) {
							cursplit.UpNode.Child.doRecursiveDrillDownFitWidthEnh(dw, cursplit.UpNode.Align);// call through down node
						}
						if (cursplit.DownNode.HasChild) {
							cursplit.DownNode.Child.doRecursiveDrillDownFitWidthEnh(dw, cursplit.DownNode.Align);// call through down node
						}
					}
					else {
					}
				}
				
				// third
				// call recursiv down for drilldown all splits below
				// call it just for the opposite node 
				if (cursplit.Orientation == 'h') {
					if (nd.Spin == 1) {
						if (cursplit.DownNode.HasChild) {
							cursplit.DownNode.Child.doRecursiveDrillDownFitWidthEnh(dw, cursplit.DownNode.Align);// call through down node
						}
					}
					else {
						if (cursplit.UpNode.HasChild) {
							cursplit.UpNode.Child.doRecursiveDrillDownFitWidthEnh(dw, cursplit.UpNode.Align);// call through up node 
						}
					}
				}
				
				// third
				// query for list of all split-above the current split
				// in down to up order, parent is from type node
				if (cursplit.HasParent) {
					var splitlist = this.doStepper('upsplits', cursplit.Parent);
				}
				else {

				}
				
				
				myalign = cursplit.Parent.Align; // tell last align 
				myspin = cursplit.Parent.Spin; // tell last spin (means up- or down-node)
				for (var e in splitlist) {
					cursplit = splitlist[e];
					cursplit.doFitWidthEnh(dw, myalign);
					if (cursplit.Orientation == 'h') {
						if (myspin == 1) {
							if (cursplit.DownNode.HasChild) {
								cursplit.DownNode.Child.doRecursiveDrillDownFitWidthEnh(dw, cursplit.DownNode.Align);// call through down node
							}
						}
						else {
							if (cursplit.UpNode.HasChild) {
								cursplit.UpNode.Child.doRecursiveDrillDownFitWidthEnh(dw, cursplit.UpNode.Align);// call through up node 
							}
						}
					}
					
					myalign = cursplit.Parent.Align;
					myspin = cursplit.Parent.Spin;
				}
			}else{ // zero-node
                if (nd.ZeroNodeType=='root'){                    // || nd.ZeroNodeType=='sticker'){
                  
                    // zeronode container
                    if (nd.ContainerList.Count == undefined) {
                    // no structure             
                    }
                    else {
                        for (i = 1; i <= nd.ContainerList.Count; i++) {
                            curct=nd.ContainerList.Item[i];
                            curct.doFitContainerWidthEnh(nd.Width + dw);
                        }
                    }
                    
                    if (nd.HasChild) {
                        var curct={};
                        nd.Child.doRecursiveDrillDownFitWidthEnh(dw, nd.Align);// call through zero node
                        cursplit=nd.Child;
                        HelpList.list.length = 0;
                        HelpList.add(cursplit.UpNode); // first add his own node
                        if (cursplit.UpNode.HasChild) {
                            cursplit.UpNode.Child.doRecursiveDrillDown();
                        }
                        var upnodelist = HelpList.get();
                        for (j = 0; j <= upnodelist.length - 1; j++) {
                            if (upnodelist[j].ContainerList.Count == undefined) {
                            // no structure             
                            }
                            else {
                                for (i = 1; i <= upnodelist[j].ContainerList.Count; i++) {
                                    curct=upnodelist[j].ContainerList.Item[i];
                                    curct.doFitContainerWidthEnh(upnodelist[j].Width);
                                }
                            }
                        }
                        HelpList.list.length = 0;
                        HelpList.add(cursplit.DownNode); // first add his own node
                        if (cursplit.DownNode.HasChild) {
                            cursplit.DownNode.Child.doRecursiveDrillDown();
                        }
                        var downnodelist = HelpList.get();
                        for (j = 0; j <= downnodelist.length - 1; j++) {
                            if (downnodelist[j].ContainerList.Count == undefined) {
                            // no structure             
                            }
                            else {
                                for (i = 1; i <= downnodelist[j].ContainerList.Count; i++) {
                                    curct=downnodelist[j].ContainerList.Item[i];
                                    curct.doFitContainerWidthEnh(downnodelist[j].Width);
                                }
                            }
                        }
                                               
                    }
                }
                
                if (nd.ZeroNodeType=='container'){
 
                };
                         
			}			
		}

        // set Stage outer DIV
        function TNodes_doDOM_StageRefresh( znd ){
            // 
            // $('#' + this.Ident).css({
            //        'width':znd.width + 'px',
            //        'height':znd.height + 'px'
            //        })
        }
  
 
  

  
  
  



		// search for all bifork-elements with an ident e.g. nodes, containers, stickers
		// !! renamed to doFindElementByIdent(id) !!
		function TNodes_doFindNodeByIdent(id){		
			var i=1;
			var obj = null;
    		if (this.Item[0]!=undefined){    		    
            	if (id==this.Item[0].Ident){
    				obj = this.Item[0];
    				return obj;
			    }
			}
			// look case zero-node has containerlist
//obj=this.Item[0].doCheckContainerIdent(id);
			if (obj != undefined) {
				return obj;
			}
			

			do {				
					if (this.Item[i] == undefined) {
						break;
					}

					// look upnode
					if (id==this.Item[i].UpNode.Ident){
						obj = this.Item[i].UpNode;
						break;
					}
					
					// look downnode	
					if (id==this.Item[i].DownNode.Ident){
						obj = this.Item[i].DownNode;
						break;
					}

					// look upnode-container
					//obj=this.Item[i].UpNode.doCheckContainerIdent(id);
					if (obj != undefined) {
						break;
					}
					
                
                

					// look downnode-container
					//obj = this.Item[i].DownNode.doCheckContainerIdent(id);
					if (obj != undefined) {
						break;
					}
					
			} while (i++ < this.Count);
			return obj;
		}
		


        // parameter current node and direction : left or right, up or down
        // returns the absolute top- or leftdistance
        function TNodes_doFindClosestLineDistance(nd,direction){
            var mysplit=nd.Parent;
            var myupnode=nd.Parent.UpNode;
            var mydownnode=nd;            
            var resultnode={};
 
            // TOP ********************************************************
            if (direction=='top'){
                resultnode=myupnode;                                        
                
                if (myupnode.HasChild==true){
                    var ot=mysplit.Orientation;
                    var maxTD=mydownnode.TopDistance - myupnode.Height;

                    //console.log(mysplit.AbsoluteIndex + '.top element -> maxTD:' + maxTD);                    
                    
                    var n=(mydownnode.HasChild)?mydownnode.Child.AbsoluteIndex-1:this.Count;
                    for (var i=myupnode.Child.AbsoluteIndex;i<=n;i++){
                        if (this.Item[i].Level<=mysplit.Level) {
                            break;
                        }
                        if (ot==this.Item[i].Orientation){
                            if (this.Item[i].UpNode.TopDistance + this.Item[i].UpNode.Height>=maxTD){
                                maxTD=this.Item[i].UpNode.TopDistance + this.Item[i].UpNode.Height;
                                resultnode=this.Item[i].UpNode;
                                //console.log(this.Item[i].UpNode.Ident + ' ' + i + '.top element -> maxTD:' + maxTD);                    
                            }
                        }                                
                    }
                }
                //console.log('top: max topdistance -->' + maxTD + ' | ' +  'top resultnode->' ,resultnode);

                if (nd.Parent.AbsoluteIndex==resultnode.Parent.AbsoluteIndex){
                    var upinterval=myupnode.Height + mydownnode.Height - zeroConstants.mingridheight                                
                }else{
                    var upinterval=nd.Height + nd.TopDistance - resultnode.TopDistance - resultnode.Height - zeroConstants.mingridheight;
                }
    
                return upinterval;
                
            } // end top

            // BOTTOM *************************************
            if (direction=='bottom'){
                resultnode=mydownnode;                                        
                
                if (mydownnode.HasChild==true){
                    var ot=mysplit.Orientation;
                    var minTD=mydownnode.TopDistance + mydownnode.Height;

                    //console.log(mysplit.AbsoluteIndex + '.bottom element -> minTD:' + minTD);                    

                    for (var i=mydownnode.Child.AbsoluteIndex;i<=this.Count; i++){
                        if (this.Item[i].Level<=mysplit.Level) {
                            break;
                        }
                        if (ot==this.Item[i].Orientation){
                            if (this.Item[i].DownNode.TopDistance<=minTD){
                                minTD=this.Item[i].DownNode.TopDistance;
                                resultnode=this.Item[i].DownNode;
                                //console.log(this.Item[i].DownNode.Ident + ' ' + i + '.element -> minTD:' + minTD);                    
                            }
                        }                                
                    }
                }
                //console.log('bottom: min topdistance -->' + minTD + ' | ' + 'bottom resultnode -->' ,resultnode);

                if (nd.Parent.AbsoluteIndex==resultnode.Parent.AbsoluteIndex){
                    var downinterval=zeroConstants.mingridheight;                                
                }else{
                    if (nd.TopDistance>resultnode.TopDistance){
                        alert('negative distance during finding bottomline ');
                        downinterval=zeroConstants.mingridheight;
                    }else{
                    var downinterval=nd.Height - (resultnode.TopDistance - nd.TopDistance) + zeroConstants.mingridheight;
                    }
                }

                return downinterval;
                
            }// end bottom


            // LEFT ********************************************************
            if (direction=='left'){
                resultnode=myupnode;                                        
                
                if (myupnode.HasChild==true){
                    var ot=mysplit.Orientation;
                    var maxLD=mydownnode.LeftDistance - myupnode.Width;

                    //console.log(mysplit.AbsoluteIndex + '.left element -> maxLD:' + maxLD);                  
                    
                    var n=(mydownnode.HasChild)?mydownnode.Child.AbsoluteIndex-1:this.Count;
                    for (var i=myupnode.Child.AbsoluteIndex;i<=n;i++){
                        if (this.Item[i].Level<=mysplit.Level) {
                            break;
                        }
                        if (ot==this.Item[i].Orientation){
                            if (this.Item[i].UpNode.LeftDistance + this.Item[i].UpNode.Width>=maxLD){
                                maxLD=this.Item[i].UpNode.LeftDistance + this.Item[i].UpNode.Width;
                                resultnode=this.Item[i].UpNode;
                                //console.log(this.Item[i].UpNode.Ident + ' ' + i + '.left element -> maxLD:' + maxLD);                  
                            }
                        }                                
                    }
                }
                //console.log('left max leftdistance -->' + maxLD + ' | ' + 'left resultnode->' ,resultnode);

                if (nd.Parent.AbsoluteIndex==resultnode.Parent.AbsoluteIndex){
                    var upinterval=myupnode.Width + mydownnode.Width - zeroConstants.mingridwidth;                                
                }else{
                    var upinterval=nd.Width + (nd.LeftDistance - resultnode.LeftDistance) - resultnode.Width - zeroConstants.mingridwidth;

                    if (upinterval<zeroConstants.mingridwidth){
                        console.log('negative distance during finding rightline '); 
                        upinterval=zeroConstants.mingridwidth;
                    }                                      
                }
                
                return upinterval;

            } // end left
            
            // RIGHT *************************************
            if (direction=='right'){
                resultnode=mydownnode;                                        
                
                if (mydownnode.HasChild==true){
                    var ot=mysplit.Orientation;
                    var minLD=mydownnode.LeftDistance + mydownnode.Width;

                    //console.log(mysplit.AbsoluteIndex + '.right element -> minLD:' + minLD); // + ' minTD:' + minTD);                    

                    for (var i=mydownnode.Child.AbsoluteIndex;i<=this.Count; i++){
                        if (this.Item[i].Level<=mysplit.Level) {
                            break;
                        }
                        if (ot==this.Item[i].Orientation){
                            if (this.Item[i].DownNode.LeftDistance<=minLD){
                                minLD=this.Item[i].DownNode.LeftDistance;
                                resultnode=this.Item[i].DownNode;
                                //console.log(this.Item[i].DownNode.Ident + ' ' + i + '.element -> minLD:' + minLD); // + ' minTD:' + minTD);                    
                            }
                        }                                
                    }
                }
                //console.log('right: min leftdistance -->' + minLD + ' | ' + 'right resultnode->' ,resultnode);
    
                if (nd.Parent.AbsoluteIndex==resultnode.Parent.AbsoluteIndex){
                    var downinterval=zeroConstants.mingridwidth;                                
                }else{
                    var downinterval=nd.Width - (resultnode.LeftDistance - nd.LeftDistance) + zeroConstants.mingridwidth;
                    
                    if (downinterval<zeroConstants.mingridwidth){
                        console.log('negative distance during finding rightline ');                
                        downinterval=zeroConstants.mingridwidth;
                        }
                }

                return downinterval;

            }// end right
            
        }     

        /* CopyBranchToNode, not complete implemented, use CopyBranchToJson and PasteBranchFromJson instead !
         * 
         * copies a branch form a node elsewhere (source) to another node (target)
         * 
         * 1.)  copies elements from the bifork TNodes (given by source.owner), starts
         *      with the child of the source-node and transfers it to the tmpnds-TNode-structure
         *      and holds the internal absoluteindex of the origin. It is a doAssign-copy, which
         *      transfers the content and is not a reference.
         *      Caution: the Children and Parents within the copys are still pointers !!
         *      and changes while work on the bifork.
         *      The original parent-link is stored by the local addendum .ParentIndex
         * 
         * 2.)  compile the tmpnds-structure to a two-dimensional horizontal array:
         *      levellist[level, absoluteindex]
         *      (it's a sorting for levels and elements)
         *        
         * 3.)  by iterating through levels and indexes  the target is build up with TNodes.doAdd().
         *      References of the new elements are stored in the builditems[absoluteindex] - array
         *      using the original absoluteindex to find the parentnode of the new build element.
         *      The first split is added to the node given by the parameter target, the others
         *      get their parentnode for the doAdd from builditems[mysplit.ParentIndex] using 
         *      the old index of the source-TNodes. builditems[splitindex] keeps track of the 
         *      new items using the former AbsoluteIndex. That's the trick.
         * 
         *      Possible actions: 'append' 'insert' 'reconstruction'    
         */

        function TNodes_doCopyBranchToNode(source,target,action){
            alert('not full implemented, use CopyBranchToJson and PasteBranchFromJson instead !');
            action=action||'append';
            var mysplit={};
            var nodeAttr=new TComAttr();
            var boxnodeAttr=new TComAttr();
            var cAttr=new TComContainerAttr();
           
            // !!! to build ==> check target, if source fits !!!!!!!!!!!!!!!!!!!!!!!!!!
            
                        
            if (source.HasChild==true && target.HasChild==false){                
                
                /*  ================================================
                 *  copying the branchpart from sourcenode to tmpnds
                 *  ================================================
                 */  
                
                var mysourcends=source.Owner;
                var tmpnds=new TNodes('tempNodes',target.Owner,target.Owner.Ident);
                var maxlevel=-1;


                // set the startlevel
                var minlevel=source.Child.Level;

                // get all objects with ident from this branch
                // load it into the tmpnds
                for (var i=source.Child.AbsoluteIndex;i<=mysourcends.Count;i++){
            
                    mysplit=mysourcends.Item[i];
                    if (i>source.Child.AbsoluteIndex && mysplit.Level<=source.Child.Level){
                        break;
                    }
                    tmpnds.Item[i] = new TSplit();
                    tmpnds.Item[i].doAssign(mysplit);
                    tmpnds.Item[i].ParentIndex=mysplit.Parent.Parent.AbsoluteIndex;
                    if (mysplit.Level>maxlevel){
                        maxlevel=mysplit.Level;
                    }
                                        
                    // show copy-result
                    doPrint('copy to node -> ' + i + ' type:' + mysplit.Type);
                    doPrint('copy-target  -> ' + i + ' type:' + tmpnds.Item[i].Type);
        
                    // +  ' ident: ' + myobjectlist[e].Ident  + ' ->' , myobjectlist[e]);
                                                
                }
                
                /*  =======================================================
                 *   wide sort of mpnds into levellist[level, absoluteindex]
                 *  =======================================================
                 */

                // initialize the two-dimensional horizontal array
                var levellist = new Array(maxlevel-minlevel+1);
                for (var L=minlevel;L<=maxlevel;L++){
                    levellist[L] = new Array();
                }
                
                // wide-sort of the elements of tmpnds by level and index
                // in levellist[level, absoluteindex]
                for (var S in tmpnds.Item){
                    mysplit=tmpnds.Item[S];
                    levellist[mysplit.Level][S]=tmpnds.Item[S];
                }

                delete tmpnds;

                /* ====================================================
                 * starts the pasting-process into node from here
                 * ====================================================
                 */

                var firstsplitflag=true;
                var mytargetnode=target;
                var mytargetnds=target.Owner;
                var mytargetparentid=target.Parent.Ident;
                var builditems=new Array();
                
                nodeAttr.action=action;

                var myorientation='';
                
                var updata ={};     // UpNode of split, name is identical to doPastBranchFromJson 
                var downdata={};    // DownNode
                
                var zeronodeflag=false;
                var firstsplitflag=true;
                                        
                // holds the differences (heigth and width) between source to target 
                var dh=0;
                var dw=0;

 
                //var builditems=new Array();  // stores the added, new splits with the source-indexes   
                var splitindex=0;            // keeps track to the buildorder of data.index (AbsoluteIndex of the original structure)
                                             // is S in CopyBranchToNode()
                var parentsplitindex=0;      // means the split-linking in terms of parent and child (skiping the link over node)
                var parentspin=0;
                                                                
                //nodeAttr.action=action;
                firstsplitflag=true;
                
                // sequential process 

                for (L=minlevel;L<=maxlevel;L++){                   
                    for (S in levellist[L]){
                        
                        mysplit=levellist[L][S];
            
                    // distinguish the different element-types
                    
                    //if (data.datatype=='node'){
                        
                        updata=mysplit.UpNode;
                        downdata=mysplit.DownNode;

                        
                        if (zeronodeflag==false){
                            
                            // set the splitorientation
                            switch(updata.Align){
                                case 'left': myorientation='v';
                                break;
                                case 'top': myorientation='h';
                                break;
                                default: myorientation='n';
                            }
                            
                            myorientation=mysplit.Orientation;
                            //splitindex=updata.Parent.AbsoluteIndex;
                            splitindex=mysplit.AbsoluteIndex;
                            //parentsplitindex=updata.Parent.Parent.Parent.AbsoluteIndex;  // parent means in terms of s
                            parentsplitindex=mysplit.Parent.Parent.AbsoluteIndex;  // parent means in terms of s
                            parentspin=mysplit.Parent.Spin; 
                                                                                                       
                            // for the first split target-parameter)
                            // firstsplitflag 
                            
                            if (firstsplitflag){
 
                                var mytargetnode=target;     // defines the target for the first split
                                var mytargetnds=target.Owner;
                                var mytargetparentid=target.Parent.Ident;

                            }else{ // targets for the next splits are in builditems 

                                if (parentspin==1){
                                    mytargetnode=builditems[parentsplitindex].UpNode;
                                    mytargetparentid=mytargetnode.Ident;    
                                }else{
                                    mytargetnode=builditems[parentsplitindex].DownNode;
                                    mytargetparentid=mytargetnode.Ident;
                                }
                             }
                            
                            // get the differences (heigth and width) between source to target 
                            if (updata.Align=='left'){
                                dh=mytargetnode.Height-updata.Height;
                                dw=mytargetnode.Width-(updata.Width+downdata.Width);
                                
                            } else if (updata.Align=='top'){
                                dh=mytargetnode.Height-(updata.Height+downdata.Height);
                                dw=mytargetnode.Width-updata.Width;                                    
                            } else {
                                dh=mytargetnode.Height-updata.Height;
                                dw=mytargetnode.Width-updata.Width;                                                                        
                            }


                            if (action=='append' || action=='insert'){
                                nodeAttr.uid='';
                                nodeAttr.did='';

                            }else{
                                nodeAttr.uid=updata.Ident;
                                nodeAttr.did=downdata.Ident;
                                
                            }        
        
                            // append -> build split like clicking splitbuttons
                            // insert -> take the heights and widths form source 
                            switch (action){
                            case 'append':
                                nodeAttr.uh=updata.Height;
                                nodeAttr.uw=updata.Width;
                                nodeAttr.dh=downdata.Height;
                                nodeAttr.dw=downdata.Width;
                            break;
                            case 'insert':
                                    switch(updata.Align){
                                    case 'left':
                                            nodeAttr.uh=updata.Height+dh; //nodeAttr.uh=updata.height
                                            nodeAttr.uw=updata.Width;
                                            nodeAttr.dh=downdata.Height+dh;  //nodeAttr.dh=downdata.height
                                            nodeAttr.dw=downdata.Width+dw;                                    
                                    break;
                                    case 'top':
                                        //if (builditems[cursplitindex].Parent.Spin==1){
                                            nodeAttr.uh=updata.Height
                                            nodeAttr.uw=updata.Width+dw;   //nodeAttr.uw=updata.width
                                            nodeAttr.dh=downdata.Height+dh;
                                            nodeAttr.dw=downdata.Width+dw; //nodeAttr.dw=downdata.width                                                                               
                                    break;
                                    default:
                                            nodeAttr.uh=updata.Height;
                                            nodeAttr.uw=updata.Width;
                                            nodeAttr.dh=downdata.Height;
                                            nodeAttr.dw=downdata.Width;                                    
                                    }
                            break;
                            default:
                                    nodeAttr.uh=updata.Height;
                                    nodeAttr.uw=updata.Width;
                                    nodeAttr.dh=downdata.Height;
                                    nodeAttr.dw=downdata.Width;
                            }

                            builditems[splitindex]={};        
                            builditems[splitindex]=mytargetnds.doAdd(mytargetnode, myorientation, 'split made by id -> ' + mytargetparentid,nodeAttr);    



                            //partcount=0;
                            firstsplitflag=false; 

                        }//zeronodeflag
                        
                    //}//node
                 
                }//for

            }//for

               delete builditems;
               delete levellist;
                
                     
            }// has child
            
            return true;
            
}


        /* remove branch is a helperfunction which removes the child-split in a node,
         * copies and relinks the opposite node in the empty region
         * geometry 
         * 
         *   
         */
  function TNodes_doRemoveBranch( nd, action ) {
    action = action || 'nothing';
    var sourcenode = {}
      , mynodesobj = {}
      , targetnode = {};
            
    mynodesobj = nd.Owner;// the TNodes-structure of 
    targetnode = nd.Parent.Parent;
    /////////////////////////////////////////////////////////////
    // SOURCE: GET THE BRANCH-"CONTENT" FROM THE OPPOSITE NODE //
    /////////////////////////////////////////////////////////////
    switch ( nd.Spin ) {
      case 1: sourcenode = nd.Parent.DownNode;
      break;
      case -1: sourcenode = nd.Parent.UpNode;
      break;
      default: sourcenode = nd;
    }//END SWITCH
                       
    if ( sourcenode.HasChild ) {
    
      
      
      // first swap the child's up and down to the target in the database

      // using json-obj as clipboard                
      var jsonsource=mynodesobj.doCopyBranchToJson();
      //remove the split with delete, because the relink has dropped the children
      mynodesobj.doRemove(nd.Parent,'delete'); // owner is TNodes, parent is TSplit
      mynodesobj.doPasteBranchFromJson(jsonsource, targetnode,'relink');
      mynodesobj.doRemove(nd.Parent,'delete'); 
    } else if ( sourcenode.ContainerList.Count > 0 ) {
      ///////////////////////////////
      // LOOP TROUGH CONTAINERLIST //
      ///////////////////////////////
      for ( var i in sourcenode.ContainerList.Item ) {
        var container = sourcenode.ContainerList.Item[ i ];
          if ( container !== null ) {
            var storedLabel =  container.Label//Store label to override the 'copy of' wich is added after copy
            if ( container.Nature == 'Container' || container.Nature == 'Sticker' ) {
              var copy = targetnode.doContainerMove( container, undefined, true );
              targetnode.ContainerList.Item[ copy ].Label = storedLabel;// Make the copy and overwrite the labal of the copy
            }//END IF 
          }//END IF
      }//END LOOP
        mynodesobj.doRemove( nd.Parent, 'delete' ); // owner is TNodes, parent is TSplit
    } else {
        mynodesobj.doRemove( nd.Parent, 'delete' ); // owner is TNodes, parent is TSplit               
    }//END ELSE
  }//END TNODES_DOREMOVEBRANCH
        
        /*  creats an jsonlike object for copy branches, parameter is a node, the "sourcepoint"
         *  result is a "wide" sorting against a "deep" one , see also doCopyBranchToNode()
         *
         *  to create the json-object the doDBTreeDataabject()-function of the element is called
         * 
         * copies a branch form a node elsewhere (source) to another node (target)
         * 
         * 
         * 1.)  copies elements from the bifork TNodes (given by source.owner), starts
         *      with the child of the source-node and transfers it to the tmpnds-TNode-structure
         *      and holds the internal absoluteindex of the origin. It is a doAssign-copy, which
         *      transfers the content and is not a reference.
         *      Caution: the Children and Parents within the copys are still pointers !!
         *      and changes while work on the bifork.
         *      The original parent-link is stored by the local addendum .ParentIndex
         * 
         * 2.)  compile the tmpnds-structure to a two-dimensional horizontal array:
         *      levellist[level, absoluteindex]
         *      (it's a sorting for levels and elements)
         *        
         * 3.)  by iterating through levels and indexes a flat json-structure is created in right order
         *      to restore the click-processes which had builded the bifork.
         *      A list of node-, container- and sticker-elements in json-format is the return of the function.
         *      This list can be processed by any further operation
         * 
         * 4.)  Elements with internal biforks, like container and stickers
         *      If a container has a bifork, then the substructure must totaly processed form zero to the last node.
         *      This is done by a recursive call of the container.Nodes.doCopyBranchToJson with the zeronode as parameter.
         *      The returnvalue is a json-list-object, which is stored in partlist. The elements of the partlist are
         *      appended at the primary list-object.
         *      The problem is: in every further processing-function each bifork has it's own absoluteindex-counting.
         *      Hence the builditems-protocoll-array is not uniquely defined based on that index,
         *      and the access to the node gets an older one from a earlier doAdd().
         *      The solution is to build seperate builditems and tmpnds for each recursive calling when processing
         *      through the json-object-list. But there must be some kind of flags to mark the start and end of
         *      the recursive branch. At this points a dataobject with the datatype 'command' and a 'todo' is
         *      inserted in the flow of elements. The real biforkstructure must of course ignore them.      
         *      stackup marks the beginning and stackdown the end. The fromJson-function can use these commands
         *      save the current state in a stack and to restore the old state after addinbg the substructure.
         *      
         *      Possible actions: 'append' 'insert' 'reconstruction'    
         *
         * 
         *  special datatypes = nonedata
         * 
         *  'datatype': 'command'  --> todo: stackup     (after a zeronode in container or sticker)
         *                                   stackdown   (after the last node froma container or sticker)
         *                                   reason see in FromJson
         */
        
        function TNodes_doCopyBranchToJson(source){
            
            var mysplit={};
            var splitnodecollection=new Array();
            var nodeAttr=new TComAttr();
            var boxnodeAttr=new TComAttr();
            var tmpnds=new TNodes('tempNodes',source.Owner,source.Owner.Ident);
            var e=0;
            var maxlevel=-1;
            var list=[];    // array for json-bifork-objects
            var myitemlist={};  // subelementlist container or sticker
            var myitemnds={};   // Nodes in subelement
            var partlist={};   // return-receiver for recursive callings 
            var curindex=0;
            var mybuildorder='noinfo';

            switch (source.Type){
                case 'node':
                      var mysourcends=source.Owner;
                      var myzeronode=null;
                      var zeronodeflag=false;  
                break;
                
                case 'nodes':
                      var myzeronode=new TNode();
                      myzeronode.doAssign(source.Item[0]);
                      var mysourcends=source;
                      source=mysourcends.Item[0];
                      var zeronodeflag=true;                    
                break;

                case 'container':
                      var mysourcends=source.Nodes;
                      source=mysourcends.Item[0];
                      tmpnds.Item[0]=source; 
                break;
                /* STICKER_mp
                case 'sticker':
                      var mysourcends=source.Nodes;
                
                break;*/
                default:
                return null;
            } 
            
            /*  ====================================
             *  Node with childs == bifork-structure
             *  ==================================== 
             */                        
            
            if (source.HasChild==true){
                
                mybuildorder='child';
                
                // set the startlevel
                var minlevel=source.Child.Level;

                // get all objects with ident from this branch
                // load it into the tmpnds
                for (var i=source.Child.AbsoluteIndex;i<=mysourcends.Count;i++){
            
                    mysplit=mysourcends.Item[i];
                    if (i>source.Child.AbsoluteIndex && mysplit.Level<=source.Child.Level){
                        break;
                    }
                    tmpnds.Item[i] = new TSplit();
                    tmpnds.Item[i].doAssign(mysplit);
                    tmpnds.Item[i].ParentIndex=mysplit.Parent.Parent.AbsoluteIndex;
                    if (mysplit.Level>maxlevel){
                        maxlevel=mysplit.Level;
                    }
                                        
                    // show copy-result
                    doPrint('copy to node -> ' + i + ' type:' + mysplit.Type);
                    doPrint('copy-target  -> ' + i + ' type:' + tmpnds.Item[i].Type);
        
                    // +  ' ident: ' + myobjectlist[e].Ident  + ' ->' , myobjectlist[e]);
                                                
                }
                
                // initialize the two-dimensional horizontal array
                var levellist = new Array(maxlevel-minlevel+1);
                for (var L=minlevel;L<=maxlevel;L++){
                    levellist[L] = new Array();
                }
                
                // sort the elements of tmpnds in levellist[level, absoluteindex]
                for (var S in tmpnds.Item){
                    mysplit=tmpnds.Item[S];
                    levellist[mysplit.Level][S]=tmpnds.Item[S];
                }

                if (zeronodeflag){
                    curindex=list.length;
                    list[list.length]=myzeronode.doDBTreeDataobject();
                    list[curindex].buildorder='zeronode'; 
                }
                
                for (L=minlevel;L<=maxlevel;L++){                   
                    for (S in levellist[L]){
                    
                        mysplit=levellist[L][S];
                        
                        curindex=list.length;
                        list[curindex]=mysplit.UpNode.doDBTreeDataobject();
                        list[curindex].buildorder=mybuildorder; //'U'+mysplit.AbsoluteIndex;
                        curindex=list.length;
                        list[curindex]=mysplit.DownNode.doDBTreeDataobject();
                        list[curindex].buildorder=mybuildorder; //'D'+mysplit.AbsoluteIndex;

                        // scanning the sub-elements

                        // the two nodes in a mini-array for dry-code
                        // UpNode
                        splitnodecollection[1]=mysplit.UpNode;
                        // DownNode
                        splitnodecollection[2]=mysplit.DownNode;
 
                        // container and splits 
                        // seq. up- and downnode  => 1, then 2
                        for (var i=1;i<=2;i++){
                          // t iterats 1 and 2 for container und splits to keep the code dry 
                          for (var t=1;t<=2;t++){  
                            
                            switch (t){
                                case 1: myitemlist=splitnodecollection[i].ContainerList;
                                break;
                                case 2: myitemlist=splitnodecollection[i].StickerList;
                                break;
                            }
                            
                            for (var j=1;j<=myitemlist.Count;j++){
                                curindex=list.length;
                                list[curindex]=myitemlist.Item[j].doDBTreeDataobject();
                                list[curindex].buildorder=mybuildorder;
                                
                                myitemnds=myitemlist.Item[j].Nodes;
                                
                                // scanning for bifork in container
                                if (myitemnds.Item !=undefined){

                                    // recursive calling over object TNodes -> incl. zeronode
                                    partlist = myitemnds.doCopyBranchToJson(myitemlist.Item[j].Nodes);                     

                                    for (e in partlist) { 
                                        if (e==1){ 
                                             // insert a control-command between the data
                                             // at zeronode-position in container-elementlist
                                             list[list.length]={
                                                 'datatype': 'command',
                                                 'todo': 'stackup'
                                            }
                                        }
                                        curindex=list.length;
                                        list[curindex]=partlist[e];
                                        list[curindex].buildorder=mybuildorder;
                                    }
                                    // mark last element
                                    curindex=list.length-1;
                                    list[curindex].buildorder='lastelement';
                                    
                                    // insert a control-command between the data
                                    list[list.length]={
                                        'datatype': 'command',
                                        'todo': 'stackdown'
                                    }
                                
                                }//if != undefined
                            }// for itemlist

                          }// for t container and sticker
                        }// for i, up und down
                     }//for levellist
                }// for levellist

                // list of objects to console
                for (var e in list){
                    doPrint('copy to json -> [' + e + ']'  
                    + ' ident: ' + list[e].ident  
                    + ' type: ' + list[e].datatype
                    + ' buildorder: ' + list[e].buildorder
                    + ' ->' , list[e]);
                }

                delete levellist;

            }// end node-child


            /*  ======================================
             *  Zeronode without children in container
             *  ====================================== 
             */                        

            if (source.HasChild==false && source.ZeroNodeType=='container'){
                mybuildorder='nochild';
                curindex=list.length;
                list[curindex]=source.doDBTreeDataobject();
                list[curindex].buildorder=mybuildorder;
                
                // list of objects to console
                for (var e in list){
                    doPrint('copy to json -> [' + e + ']'  
                    + ' ident: ' + list[e].ident  
                    + ' type: ' + list[e].datatype  
                    + ' ->' , list[e]);
                }
            
            }

            /*  ======================================
             *  Zeronode without children in sticker
             *  ====================================== 
             */                        
/* STICKER_mp
            if (source.HasChild==false && source.ZeroNodeType=='sticker'){
                mybuildorder='nochild';
                curindex=list.length;
                list[curindex]=source.doDBTreeDataobject();
                list[curindex].buildorder=mybuildorder;
                
                // list of objects to console
                for (var e in list){
                    doPrint('copy to json -> [' + e + ']'  
                    + ' ident: ' + list[e].ident  
                    + ' type: ' + list[e].datatype  
                    + ' ->' , list[e]);
                }
            
            }*/

            /*  ====================================
             *  Node with containerlist
             *  ==================================== 
             */                        

            if (source.ContainerList.Count>0){
                mybuildorder='container';
                myitemlist=source.ContainerList;

                for (var j=1;j<=myitemlist.Count;j++){

                    curindex=list.length;
                    list[curindex]=myitemlist.Item[j].doDBTreeDataobject();
                    list[curindex].buildorder=mybuildorder;
                    /* STICKER_mpif (myitemlist.Owner.ZeroNodeType=='sticker'){
                      list[curindex].buildorder='sticker';  
                    }*/
                    
                    myitemnds=myitemlist.Item[j].Nodes;
                    
                    // scanning for bifork in container
                    if (myitemnds.Item !=undefined){

                        // recursive calling over object TNodes -> incl. zeronode
                        partlist = myitemnds.doCopyBranchToJson(myitemlist.Item[j].Nodes);                     

                        for (e in partlist) { 
                            if (e==1){ 
                                 // insert a control-command between the data
                                 // at zeronode-position in container-elementlist
                                 list[list.length]={
                                     'datatype': 'command',
                                     'todo': 'stackup'
                                }
                            }
                           
                            list[list.length]=partlist[e];
                        }

                         // insert a control-command between the data
                        list[list.length]={
                            'datatype': 'command',
                            'todo': 'stackdown'
                        }
                    }//----
                
                }

                // list of objects to console
                for (var e in list){
                    doPrint('copy to json -> [' + e + ']'  
                    + ' ident: ' + list[e].ident  
                    + ' type: ' + list[e].datatype  
                    + ' ->' , list[e]);
                }


            }// end node-container


            /*  ====================================
             *  Node with stickerlist
             *  ==================================== 
             */                        
/* STICKER_mp
            if (source.StickerList.Count>0){
                mybuildorder='sticker';
                myitemlist=source.StickerList;

                for (var j=1;j<=myitemlist.Count;j++){

                    curindex=list.length;
                    list[curindex]=myitemlist.Item[j].doDBTreeDataobject();
                    list[curindex].buildorder=mybuildorder;
                    
                    myitemnds=myitemlist.Item[j].Nodes;
                    
                    // scanning for bifork in container
                    if (myitemnds.Item !=undefined){

                        // recursive calling over object TNodes -> incl. zeronode
                        partlist = myitemnds.doCopyBranchToJson(myitemlist.Item[j].Nodes);                     

                        for (e in partlist) { 
                            if (e==1){ 
                                 // insert a control-command between the data
                                 // at zeronode-position in container-elementlist
                                 list[list.length]={
                                     'datatype': 'command',
                                     'todo': 'stackup'
                                }
                            }
                           
                            list[list.length]=partlist[e];
                        }

                         // insert a control-command between the data
                        list[list.length]={
                            'datatype': 'command',
                            'todo': 'stackdown'
                        }
                    }//----
                
                }

                // list of objects to console
                for (var e in list){
                    doPrint('copy to json -> [' + e + ']'  
                    + ' ident: ' + list[e].ident  
                    + ' type: ' + list[e].datatype  
                    + ' ->' , list[e]);
                }


            }// end node-sticker */

            delete tmpnds;
            
            return list;

        }

        // paste an json-object (build with CopcBranchToJson) in any node of a bifork
        // myjson -> list with objects
        // target -> reference where to paste
        // action -> append logical copy, widths and heigths are set by rule (like clicking)
        //           insert build the structure from the left-top, saving the height and width
        //           relink, a sort of move with preserving the dom-idents
        //           reconstruction, like insert without sending to the database
        
        /*
         *
         *  'datatype': 'command'  -->  stackup     (after a zeronode in container or sticker)
         *                              stackdown   (after the last node froma container or sticker)
         *                              reason see in FromJson
         *
         *  To avoid inconclusive indexes of tmpnds- and builditem-arrays, the differend bifork-structures
         *  are hold in a stack-array which are load up with unshift and read down with shift.
         *  The stacks are builditemsstack and mytargetndsstack
         *  command json-objects controls the behavior of the stacks.       
         */


        function TNodes_doPasteBranchFromJson(myjson,target,action){            
            // check to deny the action
            if (target.HasChild==true){
                return false;    
            }

            action=action||'append';
            var data = {};
            var nodeAttr=new TComAttr();
            var boxnodeAttr=new TComAttr();
            var cAttr=new TComContainerAttr();
            /* STICKER_mp var sAttr= new TComStickerAttr(); */
            var myorientation='';
            
            var partcount=0;
            var updata ={};
            var downdata={};
            
            var zeronodeflag=false;
            var firstsplitflag=false;
            var startwithcontainerflag=false;
                                    
            var mytargetnode={};         // defines the current target for adding the split
            var mytargetnds={};         // obj for the TNodes of the current target, triggers the doADD()
            var mytargetparentid='';
            var builditems=new Array();  // stores the added, new splits with the source-indexes   
            var splitindex=0;            // keeps track to the buildorder of data.index (AbsoluteIndex of the original structure)
                                         // is S in CopyBranchToNode()
            var parentsplitindex=0;      // means the split-linking in terms of parent and child (skiping the link over node)
            var parentspin=0;

            var lastzeronode={};

            var containernode={};
            var buildcontainer=new Array();
            var lastcontainer={};
            var lastcontainerindex=0;
            var lastcontainerhasnode=false;
            
            /* STICKER_mp var stickernode={}; 
            var buildsticker=new Array();
            var laststicker={};
            var laststickerindex=0;
            var laststickerhasnode=false;


            // stacks
            var builditemsstack=new Array();
            var mytargetndsstack=new Array();
            
            
            // holds the differences (heigth and width) between source to target 
            var dh=0;
            var dw=0;
     
            nodeAttr.action=action;
            
            var firstelement=myjson[0];        // get the element e=0

            mytargetnode=target;     // defines the target for the first action
            mytargetnds=target.Owner;
            mytargetparentid=target.Parent.Ident;
            
            switch (firstelement.datatype){
            case 'node':
                firstsplitflag=true;
            break;
            case 'container':
                startwithcontainerflag=true;
            case 'command':
            break;
            default:    
            }
                    
            // sequential process the json-object
            for (var e in myjson){
                                
                data=myjson[e];
                                    
                // distinguish the different element-types

                /*  **************************************************************
                 *  control - not a real dataelement
                 */
                if (data.datatype=='command'){
                    switch (data.todo){
                    case 'stackup':
                        // nodes-stack one up (TNodes-bifork)
                        mytargetndsstack.unshift(mytargetnds);                           
                        
                        if (lastzeronode.ZeroNodeType=='container'){
                            mytargetnds=lastcontainer.Nodes;
                        }
                        /* STICKER_mp
                        if (lastzeronode.ZeroNodeType=='sticker'){
                            mytargetnds=laststicker.Nodes;
                        }*/
                        
                        // builditemsstack one up
                        builditemsstack.unshift(builditems);
                        builditems=new Array();
                    break;
    
                    case 'stackdown':
                        // nodes-stack one down  (TNodes-bifork)
                        mytargetnds=mytargetndsstack.shift();
                        // builditemsstack one down
                        builditems=builditemsstack.shift();
                    break;
                    }
                }
                                
                /*  ****************************************************
                 *  node
                 */
                if (data.datatype=='node'){
                    
                    if (data.align=='fit'){
                        zeronodeflag=true;
                    }else{
                        zeronodeflag=false;
                    }
                        
                    // handle zeronode 
                    if (partcount==0 && zeronodeflag==true){
                        myorientation='n';
                        splitindex=0;updata.index;
                        parentsplitindex=0;
                        parentspin=0;
                        
                        if (action=='append' || action=='insert'){
                            nodeAttr.uid='';
                        }else{
                            nodeAttr.uid=data.ident;
                        }        
                        
                        //mytargetnode=lastcontainer;     // defines the target for the first split
                        //mytargetparentid=target.Parent.Ident;
    
                        if (lastcontainerhasnode){
                            //mytargetnode.ContainerList.Item[lastcontainerindex].doAddZeroSplit(lastcontainer.Ident,nodeAttr);
                            lastzeronode=lastcontainer.doAddZeroSplit(lastcontainer.Ident,nodeAttr);
                            lastcontainerhasnode=false; 
                        }
                        /* STICKER_mp
                        if (laststickerhasnode){
                            lastzeronode=laststicker.doAddZeroSplit(laststicker.Ident,nodeAttr);                        
                            laststickerhasnode=false;
                        }
                        */
                    }
    
                    if (partcount==0 && zeronodeflag==false){
                        updata=data;
                    }
    
                    if (zeronodeflag==false){
                        partcount++;
                    }
    
                    // waits for down node
                    if (partcount==2 && zeronodeflag==false){
                         
                        downdata=data;
                        
                        // set the splitorientation
                        switch(updata.align){
                            case 'left': myorientation='v';
                            break;
                            case 'top': myorientation='h';
                            break;
                            default: myorientation='n';
                        }
                        
                        splitindex=updata.index;
                        parentsplitindex=updata.parentindex;  // parent means in terms of s
                        parentspin=updata.parentspin; 
                                                                                                   
                        // for the first split target-parameter)
                        // firstsplitflag 
                                
                        /* if (firstsplitflag){
     
                            mytargetnode=target;     // defines the target for the first split
                            mytargetnds=target.Owner;
                            mytargetparentid=target.Parent.Ident;
    
                        }else{ // targets for the next splits are in builditems 
                        */
                        
                        if (firstsplitflag==false){
    
                            switch (parentspin){
                            case  1:    mytargetnode=builditems[parentsplitindex].UpNode;
                                        mytargetparentid=mytargetnode.Ident;
                                        break;    
                            case -1:    mytargetnode=builditems[parentsplitindex].DownNode;
                                        mytargetparentid=mytargetnode.Ident;
                                        break;
                            case  0:    mytargetnode=lastcontainer.Nodes.Item[0];
                                        mytargetparentid=mytargetnode.Ident;    
                            break;
                            default:
                            }
                         }
                        
                        // get the differences (heigth and width) between source to target 
                        if (updata.align=='left'){
                            dh=mytargetnode.Height-updata.height;
                            dw=mytargetnode.Width-(updata.width+downdata.width);
                            
                        } else if (updata.align=='top'){
                            dh=mytargetnode.Height-(updata.height+downdata.height);
                            dw=mytargetnode.Width-updata.width;                                    
                        } else {
                            dh=mytargetnode.Height-updata.height;
                            dw=mytargetnode.Width-updata.width;                                                                        
                        }
    
    
                        if (action=='append' || action=='insert'){
                            nodeAttr.uid='';
                            nodeAttr.did='';
    
                        }else{
                            nodeAttr.uid=updata.ident;
                            nodeAttr.did=downdata.ident;
                            
                        }        
    
                        // append -> build split like clicking splitbuttons
                        // insert -> take the heights and widths form source 
                        switch (action){
                        case 'append':
                            nodeAttr.uh=updata.height;
                            nodeAttr.uw=updata.width;
                            nodeAttr.dh=downdata.height;
                            nodeAttr.dw=downdata.width;
                        break;
                        case 'insert':
                                switch(updata.align){
                                case 'left':
                                        nodeAttr.uh=updata.height+dh; //nodeAttr.uh=updata.height
                                        nodeAttr.uw=updata.width;
                                        nodeAttr.dh=downdata.height+dh;  //nodeAttr.dh=downdata.height
                                        nodeAttr.dw=downdata.width+dw;                                    
                                break;
                                case 'top':
                                    //if (builditems[cursplitindex].Parent.Spin==1){
                                        nodeAttr.uh=updata.height
                                        nodeAttr.uw=updata.width+dw;   //nodeAttr.uw=updata.width
                                        nodeAttr.dh=downdata.height+dh;
                                        nodeAttr.dw=downdata.width+dw; //nodeAttr.dw=downdata.width                                                                               
                                break;
                                default:
                                        nodeAttr.uh=updata.height;
                                        nodeAttr.uw=updata.width;
                                        nodeAttr.dh=downdata.height;
                                        nodeAttr.dw=downdata.width;                                    
                                }
                        break;
                        case 'relink':
                                switch(updata.align){
                                case 'left':
                                        nodeAttr.uh=updata.height+dh; //nodeAttr.uh=updata.height
                                        nodeAttr.uw=updata.width;
                                        nodeAttr.dh=downdata.height+dh;  //nodeAttr.dh=downdata.height
                                        nodeAttr.dw=downdata.width+dw;                                    
                                break;
                                case 'top':
                                    //if (builditems[cursplitindex].Parent.Spin==1){
                                        nodeAttr.uh=updata.height
                                        nodeAttr.uw=updata.width+dw;   //nodeAttr.uw=updata.width
                                        nodeAttr.dh=downdata.height+dh;
                                        nodeAttr.dw=downdata.width+dw; //nodeAttr.dw=downdata.width                                                                               
                                break;
                                default:
                                        nodeAttr.uh=updata.height;
                                        nodeAttr.uw=updata.width;
                                        nodeAttr.dh=downdata.height;
                                        nodeAttr.dw=downdata.width;                                    
                                }
                        break;
                        default:
                                nodeAttr.uh=updata.height;
                                nodeAttr.uw=updata.width;
                                nodeAttr.dh=downdata.height;
                                nodeAttr.dw=downdata.width;
                        }
    
                        builditems[splitindex]={};        
                        builditems[splitindex]=mytargetnds.doAdd(mytargetnode, myorientation, 'split made by id -> ' + mytargetparentid,nodeAttr);    
    
                        partcount=0;
                        firstsplitflag=false; 
    
                    }//partcount
    
                    // show current node-element
                   doPrint('pasteobj->' + e + '|type:' + data.datatype 
                    + '|ident:' + data.ident
                    + '|parentindex:' + data.parentindex
                    + '|parentspin:' + data.parentspin);
    
                    
                }//node
     
                 /* ******************************
                 *  container
                 */
                if (data.datatype=='container'){
    
                    cAttr.action=action;
                    
                    if (action=='append' || action=='insert'){
                        cAttr.id='';
    
                            } else {
                                cAttr.Ident=data.ident;                            
                            }
                            // SaVe
                            cAttr.Height=data.height;
                            cAttr.Width=data.width;
                            cAttr.Given=data.given;
                            cAttr.Kind=data.kind;
                            cAttr.Attributes=data.styles;
                            cAttr.HasRightScrollbar=data.rightscrollbar;
                            cAttr.IsFitToParent=data.fit_height;
                            cAttr.Wrap = data.wrap;
                            cAttr.Label = data.label;
                            cAttr.Html = data.html;
                            cAttr.Nature = data.nature;
                            cAttr.Options = data.options;
                            cAttr.RelatedContainer = data.relatedcontainer;

                    if (data.buildorder=='container'){
     
                        mytargetnode=target;     // defines the target for the first split
                        mytargetnds=target.Owner;
                        mytargetparentid=target.Parent.Ident;

                        containernode=target;
    
                    }
                   
                    
                    else{     
                        // targets for the next containers are in builditems 
                        switch (data.parentspin){
                        case 1:     containernode=builditems[splitindex].UpNode;
                        break;
                        case -1:    containernode=builditems[splitindex].DownNode;
                        break;
                        default:    containernode=builditems[splitindex].UpNode;
                        }
                    }
    
                    //lastcontainer=containernode.doAddContainer(null,cAttr);        
                    lastcontainerindex=lastcontainer.AbsoluteIndex;
                    
                    // startobject is container in a node (no children)
                    if (firstsplitflag){
                        //mytargetnds=lastcontainer.Nodes;
                        firstsplitflag=false;                            
                    }
    
                    if (data.nodescount!=undefined){
                        lastcontainerhasnode=true;
                    }else{
                        lastcontainerhasnode=false;
                    }
                                            
                    // show current container-element
                    doPrint('pasteobj->' + e + '|type:' + data.datatype 
                    + '|ident:' + data.ident
                    + '|parentindex:' + data.parentindex
                    + '|parentspin:' + data.parentspin);
                                                   
                }// container
             
       
        }// end PasteBranchFromJson            

		// parameter task
		// calls the type of list to return 		
		function TNodes_doStepper(task,nd,index){		
            var index=index||0;
            var i=index;
			var partlist = {};
			var curobj = {};

			// internal function, greps task and  
			var taskmanager = {
				list: [],
				doTask: function(obj){
					switch (task) {
						case 'bifork':
							taskmanager.list.push(obj);
						break;
						case 'splitlist':
							if (obj.Type=='split') {taskmanager.list.push(obj)};
						break;
						case 'nodelist':
							if (obj.Type=='node') {taskmanager.list.push(obj)};
						break;
						case 'containerlist':
							if (obj.Type=='container') {taskmanager.list.push(obj)};
						break;
						case 'nodeslist':
							if (obj.Type=='nodes') {taskmanager.list.push(obj)};
						break;
						case 'ioslist':
							if (obj.Type=='split' 
							/* || obj.Type=='container' */
      				|| ( obj.Type=='node' && obj.Spin==0 )
      				) 
							{ taskmanager.list.push( obj ) };
						break;
            case 'visiblelist':
              if (obj.Type=='container'
              || obj.Type=='node'
              ) 
              { taskmanager.list.push( obj ) };
            break;
						case 'fitlist':
							if (obj.Type=='split') {taskmanager.list.push(obj)};
						break;
                        case 'identlist':
                            if (obj.Type=='node' 
                            || obj.Type=='container'
                            || obj.Type=='sticker')
                            {taskmanager.list.push(obj)};
                        break;
					}
				},
				doContainerPartlist: function(obj){
					for (var j=1;j<=obj.ContainerList.Count;j++){
				 		taskmanager.doTask(obj.ContainerList.Item[j]);
						if (obj.ContainerList.Item[j].Nodes.doStepper != undefined) {
				 		// recursive calling of the stepper
						partlist = obj.ContainerList.Item[j].Nodes.doStepper(task);						
						for (e in partlist) { taskmanager.doTask(partlist[e])}
						}
				 	}  							
				}
          
       
			}
			
			// catch special tasks and leave function with return
			if (task=='upsplits'){
				var curnode = nd;
				var cursplit = {};
				var nextsplit = {};
				do {
					if (curnode.HasParent==false) break;
					cursplit = curnode.Parent;
					taskmanager.list.push(cursplit);
					curnode = cursplit.Parent;
				} while (curnode.Parent.AbsoluteIndex>0);
				return taskmanager.list;
			}
			
			// wrong index-value
			//if (index>this.Count){
			//    return taskmanager.list;  // leave the stepper >>>>>>>>>>
			//}
			
            // normal stepper form item 0 to n          
            for (i=index;i<=this.Count;i++) {

                // index is set > 0 --> break if level of split is reached again
                if (index>i && this.Item[i].Level<=this.Item[index].Level){
                    break;
                } 

                if (i==0){
                    taskmanager.doTask(this.Item[0]);
                    taskmanager.doContainerPartlist(this.Item[0]);
                }else{
                    taskmanager.doTask(this.Item[i]);
                    // look upnode
                    taskmanager.doTask(this.Item[i].UpNode);                
                    // look upnode-container
                    taskmanager.doContainerPartlist(this.Item[i].UpNode);
                    // look upnode-sticker
                     /* STICKER_mp  taskmanager.doStickerPartlist(this.Item[i].UpNode); */
                    // look downnode    
                    taskmanager.doTask(this.Item[i].DownNode);
                    // look downnode-container
                    taskmanager.doContainerPartlist(this.Item[i].DownNode);
                    // look downnode-sticker
                    /* STICKER_mp   taskmanager.doStickerPartlist(this.Item[i].DownNode); */
                                                    
                }
            }                                 

			return taskmanager.list;
		}

		function TNodes_doClearAll(action){
			action=action||'nothing';
			if (this.Count==0) return false;
			var clearlist=this.doStepper('containerlist');
			var obj={};
			for (var i=0;i<=clearlist.length-1;i++){
				obj=clearlist[i];
				
				for (var j=1;j<=obj.Nodes.Count;j++){
					obj.Nodes.doRemove(obj.Nodes.Item[j],action);
				}
					
				obj.doDOM_ContainerRemove(action);
				delete clearlist[i].Nodes;				
			}
            //////////////////////////////////    
            // tmp: no stickers do not remove
            //////////////////////////////////
            /*
            var clearlist=this.doStepper('stickerlist');
            var obj={};
            for (var i=0;i<=clearlist.length-1;i++){
                obj=clearlist[i];
                
                for (var j=1;j<=obj.Nodes.Count;j++){
                    obj.Nodes.doRemove(obj.Nodes.Item[j],action);
                }
                    
                obj.doDOM_StickerRemove(action);
                delete clearlist[i].Nodes;              
            }
            */
			// kill nodes

			for (var j=1;j<=this.Count;j++){
					this.doRemove(this.Item[j],action);
				}
			
			// kill first element, only if in container
			if (this.Item[0].ZeroNodeType!='root'){
                this.doRemoveZeroNode();			    
			}					
		}
		
		function TNodes_doDummy(){
			var i=0;
		}

		// Constructor TNodes Items 
		TNodes.prototype.Type='nodes';
		TNodes.prototype.Seperator=zeroConstants.LevelSeperator;

		function TNodes(myname, myowner, myident)
		{
			this.Objectname=myname;	// string === name
			this.Owner=myowner;		// object
			this.Count = 0;			// item-counter
			this.Item = []; //new Array();// TNode-elements
			this.Key = [];  //new Array(); // reserved for hash: ident - absoluteindex
			this.tmpNode = new TNode(); // intern, 
		
			this.Ident = myident || zeroConstants.websiteident + zeroConstants.groundzeroident
			this.Height = this.Owner.Height;
			this.Width = this.Owner.Width;
			
		}

		// basic datastructurebuilding functions reporting box (zeronode) in Item[0]
		function TNodes_doDBTreeDataobject(){
			var mynode = this.Item[0]; // zeronode
			return {
				'datatype': 'node',
				'ident': mynode.Ident,
				'parentident': mynode.Owner.Ident, // eg.zeronodeident
				'containerident': mynode.Owner.Owner.Ident,
				'align': mynode.Align,
				'level': 0,
				'levelmarker': mynode.LevelMarker,
				'height': mynode.Height,
				'width': mynode.Width,
				'buildorder': 'noinfo'
			};
		}
		
		
		function TNodes_doGetVisibleGrids(){

    	      var iosc  =  $( '.PAGE' ).ios( 'GetZeroNodes' ).doStepper('nodelist')
    	        , list = [];

                 for(grid in iosc) if(!iosc[grid].HasChild) list.push(iosc[grid])

                 return list
        }
		
		// methods
    TNodes.prototype.doAdd = TNodes_doAdd;
		TNodes.prototype.doAddZeroNode=TNodes_doAddZeroNode;
    TNodes.prototype.doRemove = TNodes_doRemove;
		TNodes.prototype.doRemoveZeroNode=TNodes_doRemoveZeroNode;
		TNodes.prototype.doDOM_ZeroCreate = TNodes_doDOM_ZeroCreateNotUsed;
		TNodes.prototype.doDOM_ZeroRefresh = TNodes_doDOM_ZeroRefresh;
    TNodes.prototype.doDOM_FitHeightFix = TNodes_doDOM_FitHeightFix;
		TNodes.prototype.doDOM_FitHeightEnh = TNodes_doDOM_FitHeightEnh;
		TNodes.prototype.doDOM_FitWidthFix = TNodes_doDOM_FitWidthFix;
		TNodes.prototype.doDOM_FitWidthEnh = TNodes_doDOM_FitWidthEnh;
    TNodes.prototype.doDOM_StageRefresh = TNodes_doDOM_StageRefresh;
		TNodes.prototype.doIndexUp = TNodes_doIndexUp;
		TNodes.prototype.doIndexDown = TNodes_doIndexDown;
		TNodes.prototype.doCleanUpIndex = TNodes_doCleanUpIndex;
		TNodes.prototype.doFindNodeByIdent = TNodes_doFindNodeByIdent;
		//TNodes.prototype.doFindContainerByIdent = TNodes_doFindContainerByIdent;
		TNodes.prototype.doGetVisibleGrids = TNodes_doGetVisibleGrids;
    TNodes.prototype.doFindClosestLineDistance = TNodes_doFindClosestLineDistance;
		TNodes.prototype.doStepper = TNodes_doStepper;
		TNodes.prototype.doClearAll = TNodes_doClearAll;
		TNodes.prototype.doDBTreeDataobject = TNodes_doDBTreeDataobject;
    TNodes.prototype.doCopyBranchToJson = TNodes_doCopyBranchToJson;
    TNodes.prototype.doCopyBranchToNode = TNodes_doCopyBranchToNode;
    TNodes.prototype.doRemoveBranch =TNodes_doRemoveBranch;
    TNodes.prototype.doPasteBranchFromJson = TNodes_doPasteBranchFromJson;

        // tests
        TNodes.prototype.doDummy = TNodes_doDummy;

