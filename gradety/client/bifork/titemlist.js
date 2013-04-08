///////////////////////////////////////
// CLASS-DEFINITIONS, WITH CAPITAL T //
////////////////////////////////////////////////////////////////////// 
// STUCTURE TITEMLIST AS FLATLIST                                   //
// STORES EVERY OBJECT AS POINTER : <TITEMLIST>.ITEM[INDEX].ITEMOBJ //
//////////////////////////////////////////////////////////////////////
// BASIC-CLASS: ITEMS FOR THE ITEMLIST //
/////////////////////////////////////////
  
  /////////////////
  // CONSTRUCTOR //                        
  /////////////////
	function TItem () {
	  ///////////////////////
	  // WITHOUT STRUCTURE //
	  ///////////////////////
		this.AbsoluteIndex = -1;
		this.ItemObj = new Object();//Pointer
	}//END TITEM
  
  //////////////////////////////////////////
	// METHODS OF TITEM                     //
	// ASSIGN, SET PROPERTIES FROM ANOTHER  //
	// ITEM (NO REFERENCE MEANS NO POINTER) //
	//////////////////////////////////////////
	function TItem_doAssign ( item ) {
	  for ( var each in item ) this[ each ] = item[ each ];
	}//END TITEM_DOASSIGN
	
	function TItem_doFree () {
		for ( var i in this ) this[ i ] = null;
	}//END TITEM_DOFREE 
	
	//////////////////////////////////////////////////////////////
	// PROTOTYPING TITEM DOASSIGN ( ASSIGN IS A RESERVED WORD ) //
	//////////////////////////////////////////////////////////////
	TItem.prototype.doAssign=TItem_doAssign;
	TItem.prototype.doFree=TItem_doFree;
	
	//////////////////////////
	// METHODS OF TITEMLIST //
	//////////////////////////
	function TItemlist_doCount () {
		return this.Count;		
	}//END TITEMLIST_DOCOUNT 
	
	//////////////////////////////////////////////////
	// APPEND BEHIND LAST ELEMENT, WITH DOASSIGN !! //
	//////////////////////////////////////////////////
	function TItemlist_doAdd ( item ) {
	  this.Count++;
		var i = this.Count;
		//////////////////////////////////////
		// SETTING PROPERTIES WITH DOASSIGN //
		//////////////////////////////////////
		this.Item[ i ] = new TItem();
		this.Item[ i ].doAssign( item );
		this.Item[ i ].AbsoluteIndex = i;
		return this.Count;
	}//END TITEMLIST_DOADD
	
	////////////////////////////////
	// REPLACING AN ITEM BY INDEX //
	////////////////////////////////
	function TItemlist_doSet ( i, item ) {
		if ( i <= this.Count ) {  
      item.AbsoluteIndex = i
		  this.Item[ i ].doAssign( item );
		  return item.AbsoluteIndex
		}//END IF 
	}//END TITEMLIST_DOSET

	function TItemlist_doGet ( i ) {
		if ( i <= this.Count ) return this.Item[ i ];
	}//END TITEMLIST_DOGET

	function TItemlist_doRemove ( i ) {
		if ( i >= 1 && i <= this.Count ) {  
			this.Item[ i ].doFree();
			this.Item[ i ] = null;
			//this.Item.splice( i, 1)
			this.doIndexDown( i );
    }//END IF 	
	}//END TITEMLIST_DOREMOVE

	function TItemlist_doInsert ( i, item , target ) {
	  console.log('doInsert',i, item, this.doCount())
		if ( i == 0 ) i = 1;
		if ( this.Count <= 0 ) this.doAdd( item );//Empty list, use add
		else if ( i >= 1 && i <= this.Count ) {
		  this.doIndexUp( i );
			this.Item[ i ] = new TItem();
			return this.doSet( i, item );
		}//END ELSE IF 
		else alert('TItemlist_doInsert index > count')
	}//END TITEMLIST_DOINSERT

	function TItemlist_doIndexOf ( ident ) {
		alert('yet not build!');
	}//END TITEMLIST_DOINDEXOF 

	function TItemlist_doIndexUp ( index ) {
	  this.Count++;
		for ( var i = this.Count; i > index; i-- ) {
		  this.Item[ i ] = this.Item[ i - 1 ];
			this.Item[ i ].AbsoluteIndex = i;
		}//END LOOP				
	}//END TITEMLIST_DOINDEXUP

	function TItemlist_doIndexDown ( index ) {
	  if ( index == this.Count ) this.Count--;
		else {
		  for ( var i = index; i < this.Count; i++ ) {
					this.Item[ i ] = this.Item[ i + 1 ];
					this.Item[ i ].AbsoluteIndex = i;
			}//END LOOP
			this.Count--;
		}//END IF/ELSE
	}//END TITEMLIST_DOINDEXDOWN

	function TItemlist_doMove ( CurIndex, TargetIndex ) {		
		if ( CurIndex != TargetIndex ) {
		  if ( ( TargetIndex < 0 ) || ( TargetIndex > this.Count ) ) { /* ungültiger index, nichts tun */ }
		  else {
		    /////////////////////////  
			  // SAVE TARGET IN TEMP //
			  /////////////////////////
			  this.tmpItem.doAssign(this.Item[TargetIndex]);
			  this.Item[TargetIndex].doAssign(this.Item[CurIndex]);
			  this.Item[CurIndex].doAssign(this.tmpItem);
			}//END ELSE					
		}//END IF
	}//END TITEMLIST_DOMOVE

	function TItemlist_doClear () {
		for ( i = 1; i <= this.Count; i++ ) {
			this.Item[ i ].doFree();
			this.Item[ i ] = null;
		}//END LOOP 
		this.Count = 0;
	}//END TITEMLIST_DOCLEAR

	function TItemlist_doFree () {
    for ( var i = 1; i <= this.Count; i++ ) {
			this.Item[ i ].ItemObj = null;
			this.Item[ i ].doFree();
			this.Item[ i ] = null;
		}//END LOOP
		for (var each in this ) {
			this[ each ] = null;
		}//END LOOP
	}//END TITEMLIST_DOFREE

  //////////////////////////////
	// CONSTRUCTOR FOR ITEMLIST //
	//////////////////////////////
	function TItemlist ( myname ) {
		this.Owner = '';
		this.Listname = myname;
		this.Ident = '';
		this.Count = 0;
		this.Item = new Array();
	}//END TITEMLIST
	
	//////////////////////////////////
	// METHODS OF TITEMLIST         //
	// PROTOTYPING WITHOUT BRACKETS //
	//////////////////////////////////
	TItemlist.prototype.doCount = TItemlist_doCount;
	TItemlist.prototype.doAdd = TItemlist_doAdd;
	TItemlist.prototype.doRemove = TItemlist_doRemove;
	TItemlist.prototype.doInsert = TItemlist_doInsert;
	TItemlist.prototype.doMove = TItemlist_doMove;
	TItemlist.prototype.doGet = TItemlist_doGet;
	TItemlist.prototype.doSet = TItemlist_doSet;
	TItemlist.prototype.doIndexOf = TItemlist_doIndexOf;
	TItemlist.prototype.doIndexDown = TItemlist_doIndexDown;
	TItemlist.prototype.doIndexUp = TItemlist_doIndexUp;
	TItemlist.prototype.doClear = TItemlist_doClear;
	TItemlist.prototype.doFree = TItemlist_doFree;