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

	TZeroConstants.prototype.Type='zeroconstants';

	function TZeroConstants(h,w) {
		this.status='new'; // = new / edit / view
  
		(h==null) ? this.Height= 400 : this.Height=h;
		(w==null) ? this.Width= 800 : this.Width=w;
		this.groundzeroident='zero'; // value of div-ident of the first div
		this.defaultnodeorientation='h'; //v=vertical h=horizontal
		this.LevelSeperator='.';
		this.websiteident='wi';
		this.defaultcontainerheight=50;
    this.mingridheight=5;
    this.mingridwidth=5;
		this.mincontainerheight=5;
		this.defaultenhanceheight=50;
		this.defaultenhancewidth=25;
		this.containerpadding=3;
    this.projectident='pi';
    this.containerlist = 'Conatainerlist'
    this.designposition = 'Center'
    this.options = { kindSpecials: {} }
	}

	// the "nil-object", definition for TObjects without parent or owner etc.
	// for TNodes use nilNode
	
	function TNilObject(){
		//this.obj= null; //new Object();
	}
	
	var NIL= new TNilObject();
	
	/**
	 *	from this point edit the default values 
	 * 
	*/
	
	// Ground Zero === basic and first div of all
	var zeroConstants= new TZeroConstants(400,600); // default height and width
	// Give somethiong like a ident for the whole project
    //zeroConstants.projectident='A0B0C0';
	  //zeroConstants.websiteident='00AABBCC';
	
	/*	Rules, manages the behaviour of the bifork-stuckture
	 * 
	 *  DeltaHeightRule ->  'fix'		 
	 *  					'add'	enlarge the whole system 
	 *						'deny'	warning and ask for permission
	 * 
	 *  ResizeWidthFixRule ->  true | false (true means no enhancement of the total site-width)   
	 *  
	 *   
	 *   ResizeWidthPartingRule -> relativ | absolute | shift
	 *   							(relativ means keep the relations between left and right node)
	 * 								(shift   means +d left from line , -d right from line)  
	 * 
	 *  ContainerHeightRule -> 	'fix'	use defaultheight	
	 *  						'half'	use the half of the rest of node-height
	 * 							
	 * 
	 * 
	 *  IdentRule -> 	'count'		iterate 
	 *  				'level' 	use level-pattern
	 * 
	 * 
	 */

    /*
     * ifdef-flags for controlling the output to debug-console
     */
    
    function TIfDefConLog(){
        this.FlagDoPrintAjax=false;
        this.FlagDoPrint=false;
        this.FlagDatabaseLoad=false;    // TIOS, show the loaded data
        this.FlagDatabaseSend=false;    // TIOS, show the send-process
        this.FlagZeroNode=false;        // IOCS main bifork controller, show the object
        this.AfterResizeFlagZeroNode=false; // show bifork controller
        this.AfterCreateFlagSplit=false; // show created split
    }

    var IfDefConLog=new TIfDefConLog();
    IfDefConLog.FlagDoPrint=true;
    IfDefConLog.FlagDoPrintAjax=true;
    //IfDefConLog.FlagDatabaseLoad=true;
    //IfDefConLog.FlagDatabaseSend=true;
    //IfDefConLog.AfterLoadFlagZeroNode=true;
    //IfDefConLog.AfterResizeFlagZeroNode=true;
    //IfDefConLog.AfterCreateFlagSplit=true;

    function TIfDefTest(){
        this.FlagSetTestButton=false; // add a test button to node
    }
    
    var IfDefTest= new TIfDefTest();

    IfDefTest.FlagSetTestButton=false; // set no Testbutton 
    //IfDefTest.FlagSetTestButton=true; // set Testbutton 

    
	TRules.prototype.Type='rules';
	
	function TRules(){
		this.ResizeWidthFixRule=true;
        this.ResizeHeightFixRule=true;
		//this.ResizeWidthPartingRule='absolute';
		//this.ResizeWidthPartingRule='relative';
		this.ResizeWidthPartingRule='shift';
        this.ResizeHeightPartingRule='shift';
		this.DeltaHeightRule='deny';
		this.ContainerHeightRule='fix'; // or fix, then use defaultheight
		//this.ContainerHeightRule='half'; // or fix, then use defaultheight
		this.IdentRule='count'; // or level, just numbers
		//this.IdentRule='level'; // or level = level-pattern 
	}
	
	var zeroRules= new TRules();
	
	// class for creating html-id via program
	
	function TIdenter(base,lastcount){
		this.IdenterCount=lastcount || 0;	// 0 - infinity, building html ident for div and container 
		this.Base=zeroConstants.websiteident;
	}
	
	function TIdenter_doIterate(lm){
		if (lm == undefined) {
			this.IdenterCount++;
			return this.Base + this.IdenterCount.toString();
		}
		else {
			if (zeroRules.IdentRule == 'count') {
				this.IdenterCount++;
				return this.Base + this.IdenterCount.toString();
			}
			if (zeroRules.IdentRule == 'level') {
				this.IdenterCount++;
				var result=lm.replace(/[.]/g, '');
				var result=result.replace(/[+]/g, 'U');
				var result=result.replace(/[-]/g, 'D');
				return this.Base  + result + this.IdenterCount.toString();
			}
		}
	}
	
	TIdenter.prototype.doIterate = TIdenter_doIterate;
	
	var zeroIdenter = new TIdenter();

