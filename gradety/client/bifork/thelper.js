/**
 * @author Arno Prinz
 *
 * global helper-functions and variables 
 * 
 */

var hpCurMouseGrip={
	flagDown:false,
	flagOver:false,
	flagClick:false,
	h:0,
	w:0,
	background:'#327a87',
	obj:{},
	ident:'',
	ttype:'nil',
	clear:function(){
		flagDown=false;
		flagOver=false;
		h=0;
		w=0;
		background='black';
		obj=null;
		ident='';
		ttype='nil';
	} 
}

function doHelpDomIdent(id){
    return '#'+id;
}

function doHelpResize(event, ui){
	alert('little helper' + event);
}



var HelpList = {
	list : [],
	add: function (obj){
		HelpList.list.push(obj);
		},
	get: function(){
		return HelpList.list;
	}
}

var HelpObj=[];

var HelpGlobalLeftDistance=-99999
var HelpGlobalTopDistance=-99999

// global json object to test copy and paste
var HelpJson={};

// place the caller in a remove - button event 
function doHelpTest(test,obj){
    switch (test){

    case 'sql_script_delete':
 
        var callScript = ({
            projectid:'A0B0C0'
          , script:'script_delete_design'
          , data: zeroConstants.websiteident // enthält design_id
          , columns: JSON.stringify({ columnnames:[ 'none']})   
                        
        });
                        
        var answer = $.ajax({

              url: '/ajax/script'
            , type: 'POST'
            , async: false
            , cache: false
            , timeout: 30000
            , data: callScript
            , error: function(err){ alert('error'); }
            , success: function(msg){ 
              
              //alert('msg', msg)
            }
        
        }).responseText; //END $.AJAX 

        alert('script response' + 'answer ==> ' + answer);
        //console.log('designident ==> ' + designident);
        var answerobj = jQuery.parseJSON( answer );
        
    break;

    case 'sql_script':
 
        /*
        var callScript = ({
            projectid:'A0B0C0'
          , script:'script_list_designs'
          //, data: JSON.stringify({designname: saveData.name, designposition: saveData.position, designwidth: saveData.width, designheight: saveData.height})
          , columns: JSON.stringify({ columnnames:[ 'none']})   
                        
        });
                        
        var answer = $.ajax({

              url: '/ajax/script'
            , type: 'POST'
            , async: false
            , cache: false
            , timeout: 30000
            , data: callScript
            , error: function(err){ alert('error'); }
            , success: function(msg){ 
              
              alert('msg', msg)
            }
        
        }).responseText; //END $.AJAX 

        alert('script response' + 'answer ==> ' + answer);
        //console.log('designident ==> ' + designident);
        var answerobj = jQuery.parseJSON( answer );
        //var mybifork =jQuery.parseJSON( answerobj[0]['designid'] );
    */
    break;

    // test 1.) read bifork to a JSON-obj
    //      2.) clear bifork
    //      3.) restore form JSON-obj
    case 'biforkrestore':

        //  create list of objects, needed types  
        var myobjects=IOSC.zeroNodes.doStepper('ioslist');

        // create a dataobject
        // normal bifork-dataobject
        //var mydataobject=IOS.doWrite(myobjects);
        // special mongo-database-tree-dataobject mdbtdo
        var mydbtreeobject=IOSC.Interface.doBiforkToDBJson(myobjects);
        //var mydbtreeobject=IOSC.Interface.doWriteDBTree(myobjects);
        var mydbtreestring = JSON.stringify(mydbtreeobject);
        
        // delete all elements and DOM !!!!!!!!!!! 
        IOSC.zeroNodes.doClearAll();
        
        IOSC.Interface.dd={};
        
        // reconstruct biforks and DOM
        // simulation of the IOS.doRead subroutine 
        IOSC.Interface.dd=mydbtreeobject;
        
        IOSC.doRestoreBiForksFromDBTree(IOSC.zeroNodes);

        //var objectstring = JSON.stringify(IOS.dd);
        var pause='ici';
        
        //IOSC.doSetConstant();
        //IOSC.doSetRules();
        //IOSC.doSetZeroNodes();        


    break;

    case 'relinkident':

        var mynode=IOSC.zeroNodes.Item[1].UpNode;
         
        var targetIdent=obj.Ident;  
         
        sourceIdent=mynode.Child.UpNode.Ident; 
        IOSC.doRelinkIdent(sourceIdent,targetIdent); 
        sourceIdent=mynode.Child.DownNode.Ident; 
        IOSC.doRelinkIdent(sourceIdent,targetIdent); 

         //if (mynode.HasChild==true && obj.HasChild==false){
            
            
         //}

    break;

    case 'getnode':

           // use global HelpJson as clipboard  

           var sourcenode={};
           var sourcenodesobj={};
            
           sourcenode=obj;
           
           sourcenodesobj=sourcenode.Owner; // the TNodes-structure of 
           
           if (sourcenode.ContainerList.Count>0){
               HelpJson=sourcenodesobj.doCopyBranchToJson(sourcenode);
           }           
            
            
           if (sourcenode.HasChild==true && obj.HasChild==false){

               HelpJson=sourcenodesobj.doCopyBranchToJson(sourcenode);
           }

    break;

    case 'putnode':

           var targetnode=obj;
           var targetnodesobj=obj.Owner; // the TNodes-structure
                        
           if (targetnode.HasChild==false && targetnode.ContainerList.Count==0){

                targetnodesobj.doPasteBranchFromJson(HelpJson,targetnode,'insert');
           }

    break;

    case 'copynode':

           var sourcenode={};
           var sourcenodesobj={};
           var targetnode={};
           
           targetnode=obj;
            
           // source: get the branch-"content" from the opposite node 

           switch (targetnode.Spin){
           case 1:      sourcenode=targetnode.Parent.DownNode;
           break;
           case -1:     sourcenode=targetnode.Parent.UpNode;
           break;
           default:     sourcenode=targetnode;
           }

           sourcenode=IOSC.zeroNodes.Item[2].UpNode;
           targetnode=obj;
           
           IOSC.doMove(sourcenode,targetnode);
           
           sourcenodesobj=sourcenode.Owner; // the TNodes-structure of 
           
           if (sourcenode.ContainerList.Count>0){
               var jsonsource=sourcenodesobj.doCopyBranchToJson(sourcenode);
               sourcenodesobj.doPasteBranchFromJson(jsonsource,targetnode,'insert');               
           }           
            
            
           if (sourcenode.HasChild==true && obj.HasChild==false){

                // !! using json-obj as clipboard
                var jsonsource=sourcenodesobj.doCopyBranchToJson(sourcenode);
                sourcenodesobj.doPasteBranchFromJson(jsonsource,targetnode,'insert');

                // !! using direct copying form node to node 
                //sourcenodesobj.doCopyBranchToNode(sourcenode,targetnode,'insert');  // source, target
                
                // !! remove the source
                //sourcenodesobj.doRemoveBranch(sourcenode,'delete');    
           }

    break;

    case 'clearall':

           // test clearall
           IOSC.zeroNodes.doClearAll();

    break;

    case 'checkstepper':

           // test find by ident
           
           // test form index of node
           var index = 3; // (obj.ZeroNodeType=='none')?obj.Parent.AbsoluteIndex:0;
           //if (obj.HasChild){
               var mylist=IOSC.zeroNodes.doStepper('identlist',obj,index+1);
           //}
           //var mylist=IOSC.zeroNodes.doStepper('identlist');
           //var mylist=IOSC.zeroNodes.doStepper('bifork');
           for (var e=0;e<=mylist.length-1;e++){
               console.log(mylist[e].Ident);
               console.log('element type: ' + mylist[e].Type + ' ident: ' + mylist[e].Ident 
               + ' zeronodetype: ' + mylist[e].ZeroNodeType
               + ' object ->', mylist[e]);
           } 

    break;

    case 'findident':

           // test find by ident
           
           // test form index of node
           var index = (obj.ZeroNodeType=='none')?obj.Parent.AbsoluteIndex:0;
           //var mylist=IOSC.zeroNodes.doStepper('identlist',obj,index+1);
           //var mylist=IOSC.zeroNodes.doStepper('identlist');
           var mylist=IOSC.zeroNodes.doStepper('bifork');
           var myelement={};
           for (var e=0;e<=mylist.length-1;e++){
               console.log(mylist[e].Ident);
               myelement=IOSC.zeroNodes.doFindNodeByIdent(mylist[e].Ident);
               console.log('element type: ' + myelement.Type + ' ident: ' + myelement.Ident 
               + ' zeronodetype: ' + myelement.ZeroNodeType
               + ' object ->', myelement);
           } 

    break;

        // test remove a branch in dom only and render it again
    case 'render':
        
        var srcct={}; // source-container
        var targetct={}; // target-container


            var mydownnode=obj.Parent.DownNode;
            
            var myjson=obj.Owner.Nodes.doCopyBranchToJson(obj); 


        // .1 remove container in node


        for (var j=1;j<=obj.ContainerList.Count;j++){



            /*
            srcct=obj.ContainerList.Item[j];
            console.log('test render -> myobjects: Index:' + j + ' id:'+ srcct.Ident);
             
            if (srcct.Nodes.Count != undefined) {
                var myjson=srcct.Nodes.doCopyBranchToJson(); 
                var dataobj=[{'tree': []}]
                for ( var e in myjson){                
                        dataobj[0].tree[dataobj[0].tree.length] = myjson[e];
                }
                console.log('test render -> ',dataobj);
                srcct.Nodes.doClearAll('nothing');                
                //srcct.Nodes.Item[0].doDOM_Remove('nothing');
                //IOSC.doRestoreBiForksFromDBTree(srcct.Nodes,'container',myjson);
                //myct.doDOM_ContainerRemove('nothing');
                //targetct=mydownnode.doContainerMove(srcct);
                //IOSC.doRestoreBiForksFromDBTree(targetct.Nodes,'container',myjson);


                //for (var e in myobjects){
                    //console.log('-> ' + e + ' | element type: ' + myobjects[e].Type + ' ident: ' + myobjects[e].Ident  + ' ->' , myobjects[e]);
                //}
            } 
            */
        }
    
    
    
    break;

    case 'movecontainer':


    break;

    case 'movenode':
         var sourcenode=IOSC.zeroNodes.Item[2].UpNode;
         var sourcenodesobj=sourcenode.Owner; // the TNodes-structure of 
         var targetnode=obj;
   
         if (sourcenode.HasChild==true && obj.HasChild==false){

            // !! using json-obj as clipboard
            var jsonsource=sourcenodesobj.doCopyBranchToJson(sourcenode);

            sourcenodesobj.doRemoveBranch(sourcenode,'nothing');

            sourcenodesobj.doPasteBranchFromJson(jsonsource,targetnode,'relink');
            
         }
    break;

    }//switch test
}

// consol.log helper
function doPrint(text,obj){
    if (IfDefConLog.FlagDoPrint){
        if (obj==undefined){
            console.log('::>>' + text);       
        }else{
            console.log('::>>' + text, obj);
        }
    }
}
// consol.log helper
function doPrintAjax(text,obj){
    if (IfDefConLog.FlagDoPrintAjax){
        if (obj==undefined){
            console.log('ajax::>>' + text);       
        }else{
            console.log('ajax::>>' + text, obj);
        }
    }
}

