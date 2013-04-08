function stylesObj(){ 
    
    var styles = [
        
        ['Spacing', 

            ["Margin (Outer Spacing)",{
                     defaults:{"margin-top":"5px","margin-right":"5px","margin-bottom":"5px","margin-left":"5px"}
                    ,styles:["margin-top","margin-right","margin-bottom","margin-left"]
                    ,label:['top','right','bottom','left']
                    ,rows:[2,2,2,2]
                    ,type:['stepper','stepper','stepper','stepper']
                    ,description:"Margin refers to the distance between elements (boxes, containers). You can choose different distances for each side - top, right, bottom, left."
       			},[ 'page' ]
       ] //END MARGIN

            ,["Padding (Inner Spacing)",{
                     defaults:{"padding-top":"5px","padding-right":"5px","padding-bottom":"5px","padding-left":"5px"}
                    ,styles:["padding-top","padding-right","padding-bottom","padding-left"]
                    ,label:['top','right','bottom','left']
                    ,rows:[2,2,2,2]
                    ,type:['stepper','stepper','stepper','stepper']
                    ,description:"Padding refers to the distance between the elements (box, container) edge and elements within. You can choose different distances for each side - top, right, bottom, left."
            	}] // END PADDING

        ]// END SPACING
        
		,['Background',
		
			["Background Color",{
                     defaults:{"background-color":"#ffbf3e"}
                    ,styles:["background-color"]
                    ,label:['Color']
                    ,rows:[4]
                    ,type:['color']
                    ,description:"Choose a background color for your element."
					/*how can we set this to "none" / "transparent"?*/
       			}] //END BACKGROUND COLOR

			,["Background Image",{
	                 defaults:{"background-image":"none","background-attachment":"scroll","background-position":"10px 10px","background-repeat":"no-repeat"}
	                ,styles:["background-image","background-attachment","background-position","background-repeat"]
	                ,label:['none','Attachment', ['Horizontal-position','Vertikal-Position'], 'Tiling']
	                ,rows:[ 4, 4, [ 2,2 ], 4]
	                ,type:['file',['scroll','fixed'],['multi','stepper','stepper'],['no-repeat','repeat','repeat-x','repeat-y']]
	                ,description:"Add an image (file) to an elements background. Decide wether the image scrolls (attachment), has a given position (position) or tiles (tiling)."
	    			/*how can we reset this to "none"?*/
				},[ 'stage' ]
			
			] //END BACKGROUND IMAGE
				
		]// END BACKGROUND
		
        ,['Border',

			["Default Border",{
                     defaults:{"border-color":"#8C6922","border-style":"dashed","border-width":"5px"}
                    ,styles:["border-color","border-style","border-width"]
                    ,label:['Color','Style','Width']
                    ,rows:[4,2,2]
                    ,type:['color',['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','inherit'],'stepper']
                    ,description:"Define the border around your element. Choose style, color and width for each side - top, right, bottom, left."
       			}] //END DEFAULT BORDER
			
			,["Border Top",{
	                 defaults:{"border-top-color":"#8C6922","border-top-style":"dashed","border-top-width":"5px"}
	                ,styles:["border-top-color","border-top-style","border-top-width"]
	                ,label:['Color','Style','Width']
	                ,rows:[4,2,2]
	                ,type:['color',['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','inherit'],'stepper']
	                ,description:"Define the border around your element. Choose style, color and width for the top rim."
       			}] //END BORDER TOP
			
			,["Border Right",{
	                 defaults:{"border-right-color":"#8C6922","border-right-style":"dashed","border-right-width":"5px"}
	                ,styles:["border-right-color","border-right-style","border-right-width"]
	                ,label:['Color','Style','Width']
	                ,rows:[4,2,2]
	                ,type:['color',['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','inherit'],'stepper']
	                ,description:"Define the border around your element. Choose style, color and width for the right rim."
       			}] //END BORDER RIGHT
			
			,["Border Bottom",{
	                 defaults:{"border-bottom-color":"#8C6922","border-bottom-style":"dashed","border-bottom-width":"5px"}
	                ,styles:["border-bottom-color","border-bottom-style","border-bottom-width"]
	                ,label:['Color','Style','Width']
	                ,rows:[4,2,2]
	                ,type:['color',['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','inherit'],'stepper']
	                ,description:"Define the border around your element. Choose style, color and width for the bottom rim."
				}] //END BORDER BOTTOM
							
			,["Border Left",{
	                 defaults:{"border-left-color":"#8C6922","border-left-style":"dashed","border-left-width":"5px"}
	                ,styles:["border-left-color","border-left-style","border-left-width"]
	                ,label:['Color','Style','Width']
	                ,rows:[4,2,2]
	                ,type:['color',['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','inherit'],'stepper']
	                ,description:"Define the border around your element. Choose style, color and width for the left rim."
       			}] //END BORDER LEFT
			
		]// END BORDER
		
        ,['Shape & Effect',

			["Corners",{
                     defaults:{"border-top-left-radius":"12px","border-top-right-radius":"12px","border-bottom-left-radius":"12px","border-bottom-right-radius":"12px"}
                    //TOBI ,moz-defaults:{"-moz-border-radius-topleft":"12px","-moz-border-radius-topright":"12px","-moz-border-radius-bottomleft":"12px","-moz-border-radius-bottomright":"12px"}
	                //TOBI ,webkit-defaults:{"-webkit-border-top-left-radius":"12px","-webkit-border-top-right-radius":"12px","-webkit-border-bottom-left-radius":"12px","-webkit-border-bottom-right-radius":"12px"}
					,styles:["border-top-left-radius","border-top-right-radius","border-bottom-left-radius","border-bottom-right-radius"]
					//TOBI ,moz-styles:["-moz-border-radius-topleft","-moz-border-radius-topright","-moz-border-radius-bottomleft","-moz-border-radius-bottomright"]
					//TOBI ,webkit-styles:["-webkit-border-top-left-radius","-webkit-border-top-right-radius","-webkit-border-bottom-left-radius","-webkit-border-bottom-right-radius"]
                    ,label:['top-left','top-right','bottom-left','bottom-right']
                    ,rows:[2,2,2,2]
                    ,type:['stepper','stepper','stepper','stepper']
                    ,description:"Choose between squared or rounded corners for each elemens side. If you opt for rounded corners you can define them individually."
       			}] //END CORNERS
			
			,["Shadow",{
	                 defaults:{"box-shadow":"10px 10px 5px 2px #666666"}
					//TOBI ,moz-defaults:{"-moz-box-shadow":"10px 10px 0px 5px #666666"}
					//TOBI ,webkit-defaults:{"-webkit-box-shadow":"10px 10px 0px 5px #666666"}
					,styles:["box-shadow"]
					//TOBI ,moz-styles:["-moz-box-shadow"]
					//TOBI ,webkit-styles:["-webkit-box-shadow"]
	                ,label:['Shadow','Inset','Horizontal Offset','Vertical Offset','Blur','Spread','Color']
	                ,rows:[[4,2,2,2,2,4]]
	                ,type:[['multi','checkbox','stepper','stepper','stepper','stepper','color']]
	                ,description:"Here's the posibility to define a shadow for your element considering color, lenght and blur."
       			}] //END SHADOW
		
			/*TOBI ,["Opacity",{
	                 defaults:{"opacity":"100"}
					//TOBI ,moz-defaults:{"-moz-opacity":"100"}
	                ,styles:["opacity"]
	                //TOBI ,moz-styles:["-moz-opacity"]
	                ,label:['Opacity']
	                ,rows:[4]
	                ,type:['stepper']
	                ,description:"Make your element transparent"
       			}] //END OPACITY
			*/
		]// END SHAPE + EFFECT
      
		,['Dimension',
		
			["Height",{
                 	 defaults:{"height":"150px","min-height":"150px","max-height":"150px"}
                	,styles:["height","min-height","max-height"]
					,label:['Height','Min. Height','Max. Height']
                	,rows:[4,2,2]
                	,type:['stepper','stepper','stepper']
                	,description:"Defines an elements constant height. The options min and max allow adjustable heights with a given minimum and/or maximum height."
   				},[ 'page' ]
   				
   		] //END HEIGHT

			,["Width",{
	                 defaults:{"width":"150px","min-width":"150px","max-width":"150px"}
	                ,styles:["width","min-width","max-width"]
					,label:['Width','Min. Width','Max. Width']
	                ,rows:[4,2,2]
	                ,type:['stepper','stepper','stepper']
	                ,description:"Defines an elements constant width. The options min and max allow adjustable widths with a given minimum and/or maximum width."
	   			},[ 'page' ]
	   	  ] //END WIDTH		
			
		]// END DIMENSION
         
		,['Font & Text',

			["Font",{
         			 defaults:{"font-family":"Arial, sans-serif","font-size":"12px","font-weight":"normal","font-style":"normal"}
        			,styles:["font-family","font-size","font-weight","font-style"]
					    ,label:[['Font','Font Family','Default Font Family'],'Size','Weight','Style']
        			,rows:[[4,4], 4, 2, 2, 4]
        			,type:[['multi',['Helvetica,','Arial,','Times,','Verdana,'],['sans-serif','serif','cursive','fantasy','monospace']],'stepper',['normal','bold','bolder','lighter','100','200','300','400','500','600','700','800','900'],['normal','italic','oblique']]
        			,description:"When it comes to text you need to choose a font considering size, style and weight."
				}] //END FONT		

			,["Text Style",{
	         		 defaults:{"color":"#000000", "text-transform":"none","text-decoration":"none"}
	        		,styles:["color","text-transform","text-decoration"]
					,label:['Color','Upper and Lower Case','Decoration']
	        		,rows:[4,4,4]
	        		,type:['color',['none','capitalize','uppercase','lowercase'],['none','underline','line-through']]
	        		,description:"Here's where you can define text characteristics."
				}] //END TEXT STYLE		
      
      /*,["Text Shadow",{
	         		 defaults:{"color":"#000000","text-shadow":"2px 2px 2px #000","text-transform":"uppercase","text-decoration":"underline"}
	        		,styles:["color","text-shadow","text-transform","text-decoration"]
					,label:['Color',['Text-Shadow','Horizontal Offset','Vertical Offset','Blur','Color'],'Upper and Lower Case','Decoration']
	        		,rows:[4,[2,2,4,4],4,4]
	        		,type:['color',['multi','stepper','stepper','stepper','color'],['none','capitalize','uppercase','lowercase'],['none','underline','line-through']]
	        		,description:"Here's where you can define text characteristics."
				}] //END TEXT STYLE		*/
  			

			,["Text Spacing",{
		 	 		 defaults:{"line-height":"16px","letter-spacing":"2px","word-spacing":"5px"}
					,styles:["line-height","letter-spacing","word-spacing"]
					,label:['Line Height','Letter Spacing','Word Spacing']
					,rows:[4,2,2]
					,type:['stepper','stepper','stepper']
					,description:"Here's where you can define text characteristics."
				}] //END TEXT SPACING

			,["Text Alignment",{
			 	 	 defaults:{"text-align":"left","vertical-align":"baseline","text-indent":"0px","direction":"ltr"}
					,styles:["text-align","vertical-align","text-indent","direction"]
					,label:['Horizontal Alignment','Vertical Alignment','Indenting','Writing Direction']
					,rows:[4,4,2,2]
					,type:[['left','right','center','justify'],['select','baseline','sub','super','top','text-top','bottom','text-bottom','length'],'stepper',[1,'ltr','rtl']]
					,description:"Here's where you can define text characteristics."
				}] //END TEXT ALIGNMENT

		]// END FONT + TEXT
		
		,['Various',
			["Cursor Appearance",{
	                 defaults:{"cursor":"default"}
	                ,styles:["cursor"]
					,label:['Cursor']
	                ,rows:[4]
	                ,type:[['auto','crosshair','default','pointer','move','e-resize','ne-resize','nw-resize','n-resize','se-resize','sw-resize','s-resize','w-resize','text','wait','help','url']]
	                ,description:"Here's where you can define the appearance of the mouse cursor over the element."
	   			}] //END CURSOR APPEARANCE
	
			,["Page Layout",{
		          	 defaults:{"white-space":"no-wrap"}
		           	,styles:["white-space"]
					,label:['Page Layout']
		            ,rows:[4]
		            ,type:[['normal','pre','nowrap','prewrap','pre']]
		            ,description:"Here's where you can define how line breaks and spaces are handled."
		   		}] //END PAGE LAYOUT

			,["Overflow",{
          	 		 defaults:{"overflow":"visible"}
           			,styles:["overflow"]
					,label:['Overflow']
            		,rows:[4]
            		,type:[['visible','hidden','scroll','auto','no-display','no-content','overflow-x','overflow-y']]
            		,description:"Here's where you can define how an elements content is handled if it doesn't fit inside the element."
   				}] //END OVERFLOW
		
		]// END VARIOUS
		
    ];// END STYLES
    
    return styles;
};    

function givenObj () {
  var given = [
    [ 'container', { 
        label: [ 'Fit to Grid', 'Follow Grid' ]
      , defaults: [ 'unchecked', 'checked' ]
      , givens: [ 'fit', 'follow' ]
      , values:[ 'fit', 'follow' ]
      , rows:[ 2, 2 ]
      , type:[ 'checkbox', 'checkbox' ]
    }],//END CONTAINER

    [ 'sticker', { 
        label:[ 'Fit to Grid', 'Follow Grid' ]
      , defaults:[ 'unchecked','unchecked' ]
      , givens:[ 'fit','follow' ]
      , values:[ 'fit','follow' ]
      , rows:[ 2, 2 ]
      , type:[ 'checkbox', 'checkbox' ]
    }],//END STICKER
    
    [ 'menu', { 
        label: [ 'Fit to Grid', 'Follow Grid', 'headline', 'Type', 'Level deepth', 'Start in Pagetree'  ]
      , defaults: [ 'unchecked', 'checked', 'headline', 'horizontal', '1', '1' ]
      , givens: [ 'fit', 'follow', 'headline', 'menuType', 'menuLevelDeepth', 'menuLevel'  ]
      , values:[  'fit', 'follow', 'Menu Options', 'horizontal', '1', '1' ]
      , rows:[ 2, 2, 4, 4, 2, 2 ]
      , type:[ 'checkbox', 'checkbox', 'headline', ['Horizontal', 'Vertical'], [ '1', '2', '3' ], 'stepper' ]
    }],//END CONTAINER
   
    [ 'page', { 
        label: [ 'headline', 'Left', 'Center', 'Right', 'Stretch', 'headline', 'Top', 'Bottom', 'headline', 'none', 'headline', 'none', 'Background-attachment', 'Horizontal-position', 'Vertikal-Position', 'Tiling','headline', 'Width', 'Height' ]
      , defaults: [ 'headline', 'false', 'false', 'false', 'false', 'headline', '30px', '30px', 'headline', 'transparent', 'headline', 'none', 'scroll', '10px' , '10px', 'no-repeat', 'headline', '600px' ]
      , values: [ 'Page position', 'left', 'center', 'right', 'stretch', 'Page margin', '30px', '30px' , 'Window background-color', 'transparent', 'Window background-image', 'none', 'scroll', '10px', '10px', 'no-repeat', 'Page dimension', '800px', '600px' ]
      , givens: [ 'headline', 'position', 'position', 'position', 'position', 'headline', 'margin-top01', 'margin-bottom01', 'headline', 'background-color01', 'headline' ,'background-image01', 'background-attachment01', 'background-position01', 'background-position01', 'background-repeat01', 'headline', 'width01', 'height01' ]
      , rows: [ 4, 1, 1, 1, 1, 4, 2, 2, 4, 4, 4, 4, 4, 2, 2, 4, 4, 2, 2 ]
      , type: [ 'headline', 'radio', 'radio', 'radio', 'radio','headline', 'stepper', 'stepper', 'headline', 'color', 'headline', 'file', ['select','scroll','fixed'], 'stepper','stepper',['select','no-repeat','repeat','repeat-x','repeat-y'],'headline', 'stepper', 'stepper' ]
    }]// END CONTAINER
  ]// END GIVEN
  return given
};


function menuObj () {
  var menu = {
    vertical: { 
        'conatiner': {}
      , 'base': {  

              "margin-top": "0px"
            , "margin-right": "0px"
            , "margin-bottom": "0px"
            , "margin-left": "0px"
            , "padding-top": "5px"
            , "padding-right": "10px"
            , "padding-bottom": "5px"
            , "padding-left": "10px"
            , "background-color": "#a9b3be"
            , "font-family": "Arial, sans-serif"
            , "font-size": "14px"
            , "font-weight": "bold"
            , "font-style": "normal"
            , "color": "#ffffff"

      }//END BASE 
      , '1' : [ { 'margin-top': '20px' }//First
              , { "margin-top": "1px" }//Default
              , { 'background-color': '#ffffff', 'color': '#7a7a7b', 'margin-bottom': '0px', 'padding-bottom': '6px' }//Hover
              , { 'background-color': '#333334' }//Selected
              , { 'background-color': '#333334' ,"border-bottom-color": "#4b4b4c", "border-bottom-style":"dotted", "border-bottom-width":"2px"}//Selected with Sub
              , { 'margin-bottom': '20px' }//Last 
              ]//END 1
      , '2' : [ { 'background-color': '#333334', "font-weight": "normal", 'font-size': '12px', 'padding-left': '20px' }//First
              , { 'background-color': '#333334', "font-weight": "normal", 'font-size': '12px', 'padding-left': '20px' }//Default
              , { 'background-color': '#49494a', "font-weight": "normal", 'color': '#7a7a7b', 'margin-bottom': '0px', 'padding-bottom': '6px', 'font-size': '12px', 'padding-left': '20px' }//Hover
              , { 'background-color': '#282828', "font-weight": "normal", 'font-size': '12px', 'padding-left': '20px' }//Selected
              , { 'background-color': '#282828', "font-weight": "normal", 'font-size': '12px', "border-bottom-color": "#4b4b4c", "border-bottom-style":"dotted", "border-bottom-width":"1px", 'padding-left': '20px' }//Selected with Sub
              , { 'background-color': '#333334', "font-weight": "normal", 'font-size': '12px', 'padding-left': '20px' }//Last 
              ]//END 2
      , '3' : [ { 'background-color': '#282828', "font-weight": "normal", 'font-size': '10px', 'padding-left': '30px' }//First
              , { 'background-color': '#282828', "font-weight": "normal", 'font-size': '10px', 'padding-left': '30px' }//Default
              , { 'background-color': '#313131', "font-weight": "normal", 'font-size': '10px', 'color': '#7a7a7b', 'margin-bottom': '0px', 'padding-bottom': '6px', 'padding-left': '30px' }//Hover
              , { 'background-color': '#282828', "font-weight": "normal", 'font-size': '10px', 'padding-left': '30px' }//Selected
              , { 'background-color': '#282828', "font-weight": "normal", 'font-size': '10px', 'padding-left': '30px' }//Selected with Sub
              , { 'background-color': '#282828', "font-weight": "normal", 'font-size': '10px', 'padding-left': '30px' }//Last 
              ]//END 3
    }//END VERTICAL
    , horizontal: { 
        'conatiner': {
              'padding-top': '5px'
            , 'padding-bottom': '5px' 
        
      }
      
      , 'base': {  

              "margin-top": "5px"
            , "margin-right": "0px"
            , "margin-bottom": "0px"
            , "margin-left": "5px"
            , "padding-top": "5px"
            , "padding-right": "15px"
            , "padding-bottom": "8px"
            , "padding-left": "15px"
            , "background-color": "#a9b3be"
            , "border-top-left-radius": "8px"
            , "border-top-right-radius": "8px"
            , "border-bottom-left-radius": "8px"
            , "border-bottom-right-radius": "8px"
            , "font-family": "Arial, sans-serif"
            , "font-size": "14px"
            , "font-weight": "bold"
            , "font-style": "normal"
            , "color": "#ffffff"
      }//END BASE 
      
      , '1' : [ {}//First
              , {}//Default
              , { 'margin-bottom': '0px' }//Last 
              , { 'background-color': '#ffffff', 'color': '#7a7a7b', 'margin-bottom': '0px', 'padding-bottom': '6px' }//Hover
              , { 'background-color': '#333334' }//Selected
              , { 'background-color': '#333334' }//Selected with Sub
             
              ]
      , '2' : [ {}//First
              , {}//Default
              , { 'margin-bottom': '0px' }//Last 
              , { 'background-color': '#ffffff', 'color': '#7a7a7b', 'margin-bottom': '0px', 'padding-bottom': '6px' }//Hover
              , { 'background-color': '#333334' }//Selected
              , { 'background-color': '#333334' }//Selected with Sub
              
              ]
      , '3' : [ {}//First
              , {}//Default
              , { 'margin-bottom': '0px' }//Last 
              , { 'background-color': '#ffffff', 'color': '#7a7a7b', 'margin-bottom': '0px', 'padding-bottom': '6px' }//Hover
              , { 'background-color': '#333334' }//Selected
              , { 'background-color': '#333334' }//Selected with Sub
            
              ]
    }//END VERTICAL
  };//END MENU
  return menu
}//END MENUOBJ


        
   
    
    