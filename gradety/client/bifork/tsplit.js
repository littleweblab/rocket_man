
// Bifork-Structure 	
// Constructor
// Classes for TSplit
// 
//			|===> UpNode    = TNode
//    ======
//			|===> DownNode  = TNode
//

// constants
TSplit.prototype.Type='split';

	function TSplit()
{
	this.Owner=NIL;				// nil-object, just a pointer
	this.AbsoluteIndex =-1;
	this.RelativIndex = -1;		// Index related to LevelMarker 
	this.RemoveFlag=false;
	this.HasParent=false;
	this.Parent = new Object();
	this.Parent = nilNode;
	this.HasUpNode =true;
	this.UpNode = new TNode();
	this.HasDownNode =true;
	this.DownNode = new TNode();
	this.Text = ''; 
	this.Level = -1;
	this.LevelMarker = '';
	this.Top = 0;
	this.Left = 0;
	this.Width = 0;
	this.Height = 0;
	//this.Ident='';
	this.Orientation=zeroConstants.defaultnodeorientation; //'v'; // v or h
	this.Selector='';

}

    // assign, Eigenschaften von anderem Item zuweisen (keine Referenz)
    function TSplit_doAssign(split)
    {
        var i;
        for (i in split) this[i] = split[i];
    }


function TSplit_doDOM_Refresh(){
	this.doDOM_SetResize();
	this.UpNode.doDOM_Refresh();
	this.DownNode.doDOM_Refresh();
	
}

function TSplit_doDOM_SetResize(){
	// owner-ident is the ident of the zero-div (for a container too)
	//var domparentident= (this.HasParent) ? '#' + this.Parent.Parent.Ident : '#' + this.Owner.Ident;
	//var myident=this.Ident;
	//var mynode=this;
	//return false;
	// get value

	var tstupmaxwidth=$('#' + this.UpNode.Ident).resizable("option","maxWidth");
	var tstdownmaxwidth=$('#' + this.DownNode.Ident).resizable("option","maxWidth");
	
	
	
	if (this.Orientation=='v'){
		//var mymaxwidth=this.Width;
		//$('#' + this.UpNode.Ident).resizable("option","maxWidth", mymaxwidth);
	}else if (this.Orientation=='h'){
		//var mymaxwidth=this.Width;
		//$('#' + this.UpNode.Ident).resizable("option","maxWidth", mymaxwidth);
	}
}

function TSplit_doFree(){
		delete this.UpNode;
		delete this.DownNode;
}

// builds a helperlist down all tree up- and donwnodes
function TSplit_doRecursiveDrillDown(){
	HelpList.add(this.UpNode);
	HelpList.add(this.DownNode);
				
	if (this.UpNode.HasChild){this.UpNode.Child.doRecursiveDrillDown()}
	if (this.DownNode.HasChild){this.DownNode.Child.doRecursiveDrillDown()}
}

    function TSplit_doRecursiveDrillDownFitHeightFix(d){
        // now, look for orientation,
        // in case of vertical call for up- and down-node
        // hence for down-node only

        //console.log('doRecursiveDrillDownFitHeightFix');

        switch(this.Orientation) {
        case 'v':
                // basic-fitting for the currentsplit
                this.UpNode.changeHeight(d);
                this.DownNode.changeHeight(d);
                this.Height+=d;                    
                
                if (this.UpNode.HasChild){this.UpNode.Child.doRecursiveDrillDownFitHeightFix(d, this.UpNode.Align)}
                if (this.DownNode.HasChild){this.DownNode.Child.doRecursiveDrillDownFitHeightFix(d, this.DownNode.Align)}

                // change DOM after drilldown !!
                this.doDOM_Refresh();

            break;
        case 'h':
                var dd = 0;
                var du = 0;
                switch (zeroRules.ResizeHeightPartingRule){
                case 'absolute': 
                        dd = d;
                        this.DownNode.changeHeight(dd);
                        break;
                case 'relative': 
                        var du = Math.floor(d * (this.UpNode.Height / this.Height));
                        var dd = d - du;
                        this.UpNode.changeHeight(du);
                        this.DownNode.changeHeight(dd);
                        break;
                case 'shift': 
                        if (this.DownNode.TopDistance<=HelpGlobalTopDistance){
                            dd=d;
                            this.DownNode.changeHeight(dd);
                        }else{
                            du=d;
                            this.UpNode.changeHeight(du);
                        }

                        break;
                default:
                        du=0;
                        dd=d;
                        this.DownNode.changeHeight(dd);
                }

                this.Height+=d;                  

                if (this.UpNode.HasChild){this.UpNode.Child.doRecursiveDrillDownFitHeightFix(du, this.UpNode.Align)}
                if (this.DownNode.HasChild){this.DownNode.Child.doRecursiveDrillDownFitHeightFix(dd, this.DownNode.Align)}

                // change DOM after drilldown !!
                this.doDOM_Refresh();


            break;
        case 'n':
            break;
        }            
    }

function TSplit_doRecursiveDrillDownFitHeight(d){
	// now, look for orientation,
	// in case of vertical call for up- and down-node
	// hence for down-node only

	switch(this.Orientation) {
	case 'v':
			// basic-fitting for the currentsplit
                this.UpNode.changeHeight(d);
                this.DownNode.changeHeight(d);
			this.Height+=d;
			
			// look in containerlist if isfittoparent
			if (this.UpNode.ContainerList.Count==1){
			    if (this.UpNode.ContainerList.Item[1].IsFitToParent){
                    this.UpNode.ContainerList.Item[1].doFitToParent(this.UpNode.Height);
                    }
                }
			
                if (this.DownNode.ContainerList.Count==1){
                    if (this.DownNode.ContainerList.Item[1].IsFitToParent){
                    this.DownNode.ContainerList.Item[1].doFitToParent(this.DownNode.Height);
                    }
                }

			if (this.UpNode.HasChild){this.UpNode.Child.doRecursiveDrillDownFitHeight(d, this.UpNode.Align)}
			if (this.DownNode.HasChild){this.DownNode.Child.doRecursiveDrillDownFitHeight(d, this.DownNode.Align)}

                // change DOM after drilldown !!
                this.doDOM_Refresh();

		break;
	case 'h':
			//this.DownNode.Height+=d;				
                this.DownNode.changeHeight(d);
			this.Height+=d;					

			if (this.DownNode.HasChild){this.DownNode.Child.doRecursiveDrillDownFitHeight(d, this.DownNode.Align)}

                // change DOM after drilldown !!
                this.doDOM_Refresh();

		break;
	case 'n':
		break;
	}			 
}

function TSplit_doRecursiveDrillDownFitWidthFix(d){
	// now, look for orientation,
	// in case of vertical call for up- and down-node
	// hence for down-node only

        //console.log('doRecursiveDrillDownFitWidthFix');

	switch(this.Orientation) {
	case 'h':
			
                // do basic-fitting for the currentsplit 
                this.UpNode.changeWidth(d);
                this.DownNode.changeWidth(d);
                this.Width+=d;

			if (this.UpNode.HasChild){this.UpNode.Child.doRecursiveDrillDownFitWidthFix(d, this.UpNode.Align)}
			if (this.DownNode.HasChild){this.DownNode.Child.doRecursiveDrillDownFitWidthFix(d, this.DownNode.Align)}
                
                // change DOM after drilldown !!
                this.doDOM_Refresh();
                
		break;
	case 'v':
			var dd = 0;
			var du = 0;
			switch (zeroRules.ResizeWidthPartingRule){
			case 'absolute': 
					dd = d;
                        this.DownNode.changeWidth(dd);
					break;
			case 'relative': 
					var du = Math.floor(d * (this.UpNode.Width / this.Width));
					var dd = d - du;
                        this.UpNode.changeWidth(dd);
                        this.DownNode.changeWidth(dd);
					break;
			case 'shift': 
                        if (this.DownNode.LeftDistance<=HelpGlobalLeftDistance){
                            dd=d;
                            this.DownNode.changeWidth(dd);
                        }else{
                            du=d;
                            this.UpNode.changeWidth(du);
                        }

					break;
			default:
					du=0;
					dd=d;
                        this.DownNode.changeWidth(dd);
			}

			this.Width+=d;					

			// for UP- and DownNode check Container

			if (zeroRules.ResizeWidthPartingRule=='shift') {
				for (i = 1; i <= this.UpNode.ContainerList.Count; i++) {
						this.UpNode.ContainerList.Item[i].doFitContainerWidthEnh(du);
					}						
				for (i = 1; i <= this.DownNode.ContainerList.Count; i++) {
						this.DownNode.ContainerList.Item[i].doFitContainerWidthEnh(-dd);
					}
			}else{						
			for (i = 1; i <= this.UpNode.ContainerList.Count; i++) {
					this.UpNode.ContainerList.Item[i].doFitContainerWidthEnh(du);
				}						
			for (i = 1; i <= this.DownNode.ContainerList.Count; i++) {
					this.DownNode.ContainerList.Item[i].doFitContainerWidthEnh(-dd);
				}
			}						

			if (this.UpNode.HasChild){this.UpNode.Child.doRecursiveDrillDownFitWidthFix(du, this.UpNode.Align)}
			if (this.DownNode.HasChild){this.DownNode.Child.doRecursiveDrillDownFitWidthFix(dd, this.DownNode.Align)}

                // change DOM after drilldown !!
                this.doDOM_Refresh();

		break;
	case 'n':
		break;
	}			 
}

function TSplit_doRecursiveDrillDownFitWidthEnh(d){
	// now, look for orientation,
	// in case of vertical call for up- and down-node
	// hence for down-node only
	switch(this.Orientation) {
	case 'h':
			// basic-fitting for the currentsplit
			//this.UpNode.Width+=d;
			//this.DownNode.Width+=d;
                this.UpNode.changeWidth(d);
                this.DownNode.changeWidth(d);
			this.Width+=d;
			
			if (this.UpNode.HasChild){this.UpNode.Child.doRecursiveDrillDownFitWidthEnh(d, this.UpNode.Align)}
			if (this.DownNode.HasChild){this.DownNode.Child.doRecursiveDrillDownFitWidthEnh(d, this.DownNode.Align)}

                // change DOM after drilldown !!
                this.doDOM_Refresh();

		break;
	case 'v':
			//this.DownNode.Width+=d;				
                this.DownNode.changeWidth(d);
			this.Width+=d;					

			if (this.DownNode.HasChild){this.DownNode.Child.doRecursiveDrillDownFitWidthEnh(d, this.DownNode.Align)}

                // change DOM after drilldown !!
                this.doDOM_Refresh();

		break;
	case 'n':
		break;
	}			 
}

    // inner setting, no further links, paints split with it's nodes
    // align, set from the calling node
    function TSplit_doFitHeightFix(d,align){
        var du = d;
        var dd = d;

        switch(this.Orientation) {
        case 'v':
            break;
        case 'h':
            switch (align) {
                case 'top':
                    this.UpNode.changeHeight(+du);
                    this.DownNode.changeHeight(-dd);
                    break;
                case 'bottom':
                    this.UpNode.changeHeight(-du);
                    this.DownNode.changeHeight(+dd);
                    break;
                case 'nil':
                    this.DownNode.changeHeight(dd);
                    break;
            }
        case 'n':
            break;
        }
        this.doDOM_Refresh();
    }

// inner setting, no further links, paints split with it's nodes
// align, set from the calling node
function TSplit_doFitHeight(d,align){
	switch(this.Orientation) {
	case 'v':
                this.UpNode.changeHeight(d);
                this.DownNode.changeHeight(d);
			this.Height+=d;					
		break;
	case 'h':
			switch (align) {
				case 'top':
                        this.UpNode.changeHeight(d);
					break;
				case 'bottom':
                        this.DownNode.changeHeight(d);
					break;
				case 'nil':
                        this.DownNode.changeHeight(d);
					break;
			}					
			this.Height += d;
		break;
	case 'n':
		break;
	}
	this.doDOM_Refresh();
}

// inner setting, no further links, paints split with it's nodes
// align, set from the calling node
function TSplit_doFitWidthFix(d,align){
	var du = d;
	var dd = d;

	switch(this.Orientation) {
	case 'h':
		break;
	case 'v':
		switch (align) {
			case 'left':
                    this.UpNode.changeWidth(+du);
                    this.DownNode.changeWidth(-dd);
				break;
			case 'right':
                    this.UpNode.changeWidth(-du);
                    this.DownNode.changeWidth(+dd);
				break;
			case 'nil':
                    this.DownNode.changeWidth(+dd);
				break;
		}
	case 'n':
		break;
	}
	this.doDOM_Refresh();
}

// enhance totalwidth
// inner setting, no further links, paints split with it's nodes
// align, set from the calling node
function TSplit_doFitWidthEnh(d,align){
	switch(this.Orientation) {
	case 'h':
                this.UpNode.changeWidth(d);
                this.DownNode.changeWidth(d);
			this.Width+=d;					
		break;
	case 'v':
			switch (align) {
				case 'left':
                        this.UpNode.changeWidth(d);
					break;
				case 'right':
                        this.DownNode.changeWidth(d);
					break;
				case 'nil':
                        this.DownNode.changeWidth(d);
					break;
			}					
			this.Width += d;
		break;
	case 'n':
		break;
	}
	this.doDOM_Refresh();
}

// prototyping for TSplit
TSplit.prototype.doDOM_Refresh=TSplit_doDOM_Refresh;
TSplit.prototype.doDOM_SetResize=TSplit_doDOM_SetResize;
TSplit.prototype.doAssign=TSplit_doAssign;
TSplit.prototype.doFree = TSplit_doFree;
TSplit.prototype.doRecursiveDrillDown=TSplit_doRecursiveDrillDown;
TSplit.prototype.doRecursiveDrillDownFitHeightFix=TSplit_doRecursiveDrillDownFitHeightFix;
TSplit.prototype.doRecursiveDrillDownFitHeight=TSplit_doRecursiveDrillDownFitHeight;
TSplit.prototype.doRecursiveDrillDownFitWidthFix=TSplit_doRecursiveDrillDownFitWidthFix;
TSplit.prototype.doRecursiveDrillDownFitWidthEnh=TSplit_doRecursiveDrillDownFitWidthEnh;
TSplit.prototype.doFitHeightFix=TSplit_doFitHeightFix;
TSplit.prototype.doFitHeight=TSplit_doFitHeight;
TSplit.prototype.doFitWidthFix=TSplit_doFitWidthFix;
TSplit.prototype.doFitWidthEnh=TSplit_doFitWidthEnh;
//TSplit.prototype.doAssign = TSplit_doAssign; 
