(function($) {  
    
    
    $.widget("gadget.dev_gadgetWrite", {
        options:{
                    
                    
            numbersOfUndos: 3,
            newlinesEnabled:true,
            cancel: undefined,
            eventType:'dblclick',
                    
                   
        
        }
        
        ,_create: function()
        {   
              var self = this;
                var hasContent = this.element.find('> *').not('.ui-resizable-handle, .CONTENT-writeText');
                  /////////////////////////////////
                  // CREATE TEXT AREA   
                  /////////////////////////////////
                  this.writeText = $('<div class="CONTENT-writeText" contenteditable="false"></div>').appendTo(this.element)
                  hasContent.appendTo(this.writeText);
                 
                 
               
                 
                  
                  
                  //this.options.editableArea = $('.STAGE');

                  // CREATE CANCEL BUTTON      
                  this.writeText.dev_gadgetBubble({ mouseEvent: false, 'button.cancel_ico':{ addClass:'STYLE-itemMedithumbIcon ICON-cancel-mini' },  'button.Cancel':{ } })
                  if(this.options.cancel == undefined)
                  {
                      this.cancelButton = this.writeText.data('dev_gadgetBubble').bubble
                      this.options.cancel = this.cancelButton 
                  }
                  
                  
                  
                 
                 
                  
                  
                  
                    this.formatArea = $('.CONTAINER-browse') 
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Variables to save temporary information                                                               //
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
                      this.write = $.extend({},{   

                                  $editable : this.writeText, editable : this.writeText[0],
                                  $body : $('body'), prevValue :  this.element.html(),
                                  $selection : 0, selectionClass : 0,  
                                  $toFormat : this.element, ///.children(':first');
                                  lastWrap: this.writeText.children(':last'), 
                                  // UNDO REDO
                                  saveSteps : [], saveStepsCaret : [], saveChangePointer : 0, lastDo : 'redo'
                      }) 
                     
                  
        }
        ,_init:function(){
            var self = this, o = this.options
            /////////////////////////////////
            // initinal event bind
            /////////////////////////////////
            if(o.disabled == false)
            {
                self.element.bind(self.options.eventType+'.startedit', self._bindStartEdit());
            }
            
        }
       
        ,ui: function(){  
             
             return { writeText: this.writeText,  element: this.element,  textStyles:  this.write.textStyles }
        }
        
        ,destroy:function(){
            
            
            this.writeText.find('a').dev_gadgetLink('destroy');
            this.writeText.dev_gadgetBrackets('destroy');
            this.writeText.dev_gadgetBubble('destroy');
            this.writeText.unbind('.gadgetWrite');
            this.element.unbind('.gadgetWrite');
            $(this.writeText.html()).prependTo(this.element);
            this.writeText.remove();  
            $.Widget.prototype.destroy.apply(this);
            $('#TextStyles').undelegate('li.HELPER-textStyles','click');
        }
        
        ,_setOption: function( key, value ) { 
            this.writeText.unbind('.gadgetWrite');
            this.element.unbind('.gadgetWrite');   
      		this.options[ key ] = value;
      		this._init();
      	
      	}
        
// START
         ,startEdit: function()
         {
             
              var self = this, id = self.element.attr('id');
                    
                        
                   
              //self.writeText.css('min-height', self.element.innerHeight() );
         //--------------------------------------------
         // Saves the html of editable before it will
         // be changed 
         //--------------------------------------------    
             self.write.prevValue = self.write.$editable.html();
             //if(self.options.cancel !== undefined)
             //{
                 self._bindCancel();
             //}
         //--------------------------------------------
         // set attribute contentEditable to false
         //--------------------------------------------  
             //self.write.$editable.css('background','#ccc');
         
             self.write.$editable.attr('contentEditable', true);
         //--------------------------------------------
         // Adds text format functions 
         //--------------------------------------------  
             self._bindTextSelection(self.write.$editable);
             //if(self.options.formatArea !== "")
             //{
                 self._bindTextFormat();
             //}
             self._bindNotEditable();
             //self._bindRemoveFromat();
             self._bindKeyboardSettings();
             
         //--------------------------------------------
         // Set caret at the end of editable at the
         //--------------------------------------------
         
             var $lastChild = self.write.$editable.children(':last');
             var childrenLength = self.write.$editable.children().length;
       

             if( !self.write.$editable.children().length )
             {
                 self.write.$editable.append('<p class="p'+id+'">&nbsp;</p>')
                 self._setRange( self.write.$editable, self.write.$editable.children(':last'), false );
           
             } 
             else if(    // if editable has only one child
                         childrenLength == 1 
                         // if editables only child is emty
                         &&  $lastChild.text().length == 1
                         // and contains a br
                         &&  $lastChild.children(':last').attr('nodeName') == 'BR'  
                         // and browser is mozilla
                         &&  $.browser.mozilla 
                    
                         // or  if editable has only one child    
                         || childrenLength == 1 
                         // if editables only child is emty   
                         &&  $lastChild.text().length == 1
                         // and browser is webkit
                         &&  $.browser.webkit 
              ){
         
                 self._setRange( self.write.$editable, $lastChild, false );
              } 
              else {
                 // if last child contains a br and their is 
                 // other content the br must be removed for 
                 // a working caret
                 
                 //console.log( $lastChild.children(':last').attr('nodeName'), $lastChild.children(':last')[0].nextSibling.length )
                 if( $lastChild.children(':last').attr('nodeName') == 'BR' && $.browser.mozilla && $lastChild.children(':last')[0].nextSibling == undefined )
                 {
                     //console.log( $lastChild.children(':last') )
                     
                     $lastChild.children(':last').remove() 
                 } 
                 // prevents self._setRange error
                 if($lastChild.text().length == 0)
                 { 
                     $lastChild.html('&nbsp;')
                     self._setRange( self.write.$editable, $lastChild, false );
                 } 
                 // for everything else
                 else {
                     self._setRange( self.write.$editable, $lastChild, true );
                }
              }
          
       
         //--------------------------------------------
         // Saves the first undo/redo step
         //--------------------------------------------
             self.write.saveSteps.unshift(self.write.$editable.html());
     
             self._caret('save');
             self.write.saveStepsCaret.unshift(self.write.$editable.html());
             self._caret('set');
                 //console.log(event, XMLHttpRequest, ajaxOptions)
                 //console.log(self.write.$editable.children(':last'))
               //  this.element.ajaxComplete(function(event, XMLHttpRequest, ajaxOptions){    
                 
                 self._setTextStyles(self.write.$editable.find(' > :last') )
            //} )
              
         }
            
         ,stopEdit: function()
         {
              var self = this;
         //--------------------------------------------
         // Remove Styles
         //--------------------------------------------    
             $('#TextStyles').children().unbind('click.txtEditorStyles');
             
         //--------------------------------------------
         // set attribute contentEditable to false
         //--------------------------------------------
            // self.write.$editable.css('background','transparent')
             self.write.$editable.attr('contentEditable', false);
         //--------------------------------------------
         // If it was not the first click. This removes
         // the last selection was set befor this click.
         //--------------------------------------------
             self._deleteSelection()
             self.write.$editable.unbind('mouseup.txtEditorStyles.gadgetWrite, keyup.txtEditorStyles.gadgetWrite') 
             
             $('.unwrap').unbind('click.txtEditorStyles');
             
                 self.options.cancel.unbind("click.txtEditorCancel");
             
    
             $(document).unbind('keydown.txtEditorKeys');
             self.writeText.unbind('clickoutside.gadgetWrite');
             self._bindStartEdit();
             self.write.saveSteps = [];
             self.write.saveStepsCaret = [];
          
             self.write.textStyles.dev_gadgetMedithumb('destroy');
         //--------------------------------------------   
         // CLEANUP
         //--------------------------------------------
             if($.browser.mozilla)
             { 
                 //var $dirt =  self.write.$editable.find('span[_moz_dirty]')
                 //$dirt.replaceWith( $dirt.html())
                 self.write.$editable.find('br[_moz_dirty]').remove()
         
             }
             
             self.writeText.css('min-height', 0 )
         }


// BIND START EDIT         
        ,_bindStartEdit: function()
        {
             var self = this;
           
        //--------------------------------------------
        // Setup double click to start editing
        //--------------------------------------------

          
                self.element.bind( self.options.eventType+'.startedit.gadgetWrite', function() 
                {
                    self.startEdit(); 

                    $(this).unbind(self.options.eventType+'.startedit')
                    self._trigger('start',null, self.ui())
                   
                    console.log('write.js says: editing started')
                    return false;
                });
            
           
        }
        
///////////////////////////        
// BIND STOP EDTT EVENTS //
///////////////////////////
  
            ,_bindNotEditable: function ()
            {
                var self = this;   
                
            ///////////////////////////////////
            // ON CLICK OUSIDE THE CONTAINER //
            ///////////////////////////////////
                
                self.writeText.bind('clickoutside.gadgetWrite', function(event){
                ////////////////
                // GET TARGET //    
                ////////////////
                    
                    var $target =  $(event.target); // TARGET WICH WA CLICKED  
                    
                ////////////////////////////////////////
                // IF TARGET IS IN STAGE STOP EDITING //
                ////////////////////////////////////////       
                    
                    if($target.closest('.STAGE').length){
                       
                       event.stopPropagation();
                       self.writeText.find('a').dev_gadgetLink('destroy');//IF A LINK IS EDITED ON CLICK OUTSIDE 
                       self.stopEdit(); // TRIGGER EDIT STOP FUNCTON
                       self._trigger('stop',null, self.ui()); // TRIGGERS EXTRA FUNCTIONS ON STOP IF NESSESARY
                       
                    }// END IF
                });//END BIND CLICKOUTSDE
                   
            }
            
// BIND CANCEL EDIT
            ,_bindCancel: function ()
            {
                var self = this;
               
                self.options.cancel.bind('click.txtEditorCancel.gadgetWrite', function()
                {
                    self.cancel()
                    
                });
            }
            ,cancel:function(){
                
                     var self = this;
                    self.write.$editable.html(self.write.prevValue);
                    self.stopEdit(self.write.$editable);
                    self.options.cancel.unbind("click.txtEditorCancel");
                    self._trigger('stop',null, self.ui())
                    console.log('write.js says: editing canceled')
                
            }




// BIND KEYBOARD
              ,_bindKeyboardSettings: function()
              {
                  var self = this;
              //--------------------------------------------
              // Prevent default browser behaviour & formating
              //--------------------------------------------    
                  $(document).bind('keyup.txtEditorKeys.gadgetWrite,keydown.txtEditorKeys.gadgetWrite', function(event){
                       event.preventDefault(); // removes <br _moz_dirty=''> that we don't nees
                       if($.browser.mozilla)
                       { 
                         //   self.write.$editable.find("br[_moz_dirty]").remove();
                           // self.write.$editable.find("span[_moz_dirty]").removeAttr('style');
                       }
                       //self._removeEmpty(self.write.$editable)  
                  })
              //--------------------------------------------
              // Keyevents on other platforms
              //--------------------------------------------
                  if($.client.os !== 'Mac')
                  {
                  //--------------------------------------------
                  // ctrl + z
                  //-------------------------------------------
                      $(document).bind('keydown.txtEditorKeys.gadgetWrite', 'ctrl+z', function(event) 
                      {
                          event.preventDefault();
                          self._undo()
                      });
                  //--------------------------------------------
                  // ctrl + schift +  z
                  //--------------------------------------------
                      $(document).bind('keydown.txtEditorKeys.gadgetWrite', 'ctrl+shift+z', function(event) 
                      {
                          event.preventDefault();
                          redo()
                      });
                  }
              //--------------------------------------------
              // Keyevents on mac
              //--------------------------------------------
                  else if($.client.os == 'Mac'){
                  //--------------------------------------------
                  // cmd + z
                  //--------------------------------------------
                      $(document).bind('keydown.txtEditorKeys.gadgetWrite', 'meta+z', function(event)
                      {
                          event.preventDefault();
                          self._undo()
                      });
                  //--------------------------------------------
                  // cmd + schift +  z 
                  //--------------------------------------------
                      $(document).bind('keydown.txtEditorKeys.gadgetWrite', 'meta+shift+z', function(event)
                      {
                          event.preventDefault();
                          self._redo()
                      });
                  };
              //--------------------------------------------
              // Keyevents for all plattforms
              //--------------------------------------------
              // UP ARROW KEY
                  $(document).bind('keydown.txtEditorKeys.gadgetWrite', 'up',  function(event)
                  {
                  //--------------------------------------------
                  // Removes selection and set caret above it
                  //--------------------------------------------

                      self._saveChange();   
                      if(self.write.$selection.length)
                      {
                          self._caret('save', self.write.$selection[0], 'start');
                          self._caret('set');

                      };


                  //--------------------------------------------
                  // Save change for undo
                  //--------------------------------------------    

                  });
              // LEFT ARROW KEY
                  $(document).bind('keydown.txtEditorKeys.gadgetWrite', 'left',  function(event)
                  {
                  //--------------------------------------------
                  // Set caret at the beginning of the
                  // last selection
                  //--------------------------------------------
                      self._saveChange();  
                      if(self.write.$selection.length)
                      {   

                          self._caret('save', self.write.$selection[0], 'start'); 
                          self._caret('set');


                      };
                  //--------------------------------------------
                  // Save change for undo
                  //--------------------------------------------    

                  });
              // DOWN ARROW KEY
                  $(document).bind('keydown.txtEditorKeys.gadgetWrite', 'down',  function(event) 
                  {
                  //--------------------------------------------
                  // Removes selection and set caret under it
                  //--------------------------------------------
                      self._saveChange();  
                      if(self.write.$selection.length)
                      {  
                          self._caret('save', self.write.$selection[0], 'end');
                          self._caret('set');
                      };

                  //--------------------------------------------
                  // Save change for undo
                  //--------------------------------------------    

                  });
              // RIGHT ARROW KEY
                  $(document).bind('keydown.txtEditorKeys.gadgetWrite', 'right', function(event)
                  {
                      //--------------------------------------------
                      // Set caret at the end of the last selection
                      //-------------------------------------------- 
                      self._saveChange();  
                      if(self.write.$selection.length)
                      {
                          self._caret('save', self.write.$selection[0], 'end');
                          self._caret('set');
                      };

                  //--------------------------------------------
                  // Save change for undo
                  //--------------------------------------------    

                  });
              // RETURN 
                  $(document).bind('keydown.txtEditorKeys.gadgetWrite', 'return', function(event)
                  {
                      event.preventDefault();
                      // switch to setup breaks or not
                      if(self.options.newlinesEnabled == true)
                      {

                          self._caret('save');
                          $('<br/>').insertBefore('#HELPER-lastInsert');
                          self._caret('set');


                      }
                  });
                // BACKSPACE
                $(document).bind('keydown.txtEditorKeys', 'backspace', function(event)
                {
                    self._mergeContent('prev', event);
                });
                // DEL
                $(document).bind('keydown.txtEditorKeys', 'del', function(event)
                { 
                    self._mergeContent('next', event);
                });

                // DEL
                $(document).bind('keydown.txtEditorKeys', 'tab', function(event)
                { 
                    event.preventDefault();
                });
                      
                      
              
              }
              
              ,setFirstTextStyles: function(){
              
                 self = this
                 this._setTextStyles(self.write.$editable.find(' > :last'))
                  
              }
              
              
    
    ,_setTextStyles: function(target){
    
    ///////////////////////////////////
    // COLLECT ELEMENTS TO WORK WITH //
    ///////////////////////////////////

        var self = this 
        ,o = self.options
        ,$textStyles = $(o.textStyleContainer).find('.HELPER-textStyles') // FIND ALL AVIABLE TEXTSTYLES
        ,$newTextStyle = $textStyles.find( target.attr('nodeName')+':not(:has(*))') // FIND TEXTSTYLE OF THE NEW SELECTED TEXT STRING
        ,$toggle = $newTextStyle.closest('.toggle') // FIND PARENT TOGGLER IN THE ACCORDION
       
    /////////////////////////////////////////////////////////////////////////////
    // SAVE IN AS "GLOBAL INSTANCE" IN WIDGET WOR LATER USE IN OTHER FUNCTIONS //
    /////////////////////////////////////////////////////////////////////////////

        self.write.textStyles = $textStyles;
      
    ////////////////////////////
    // IF SELCTED STYLE EXIST //
    ////////////////////////////
      
        if($newTextStyle.length ){
          
        /////////////////////////////////////
        // REMOVE LAST SELCECTED TEXTSTYLE // 
        /////////////////////////////////////         

            $textStyles
                .css('background-color', 'transparent')
                .dev_gadgetMedithumb('destroy');

        ///////////////////////
        // SET NEW TEXTSTYLE // 
        ///////////////////////      

            $newTextStyle
              .parent()
              .css('background-color', '#cddef0')
              .dev_gadgetMedithumb({  
                  mouseEvent: false
                  ,'button.removeStyle': 
                  { 
                      'addClass':'STYLE-itemMedithumbIcon ICON-remove-mini test'  
                      ,'action': function(event, ui){  
    
                          ui.button.unbind('click.style.gadgetWrite')
                          ui.button.bind('click.style.gadgetWrite', function(){ self._bindRemoveFromat(target) })   
                      }//END ACTION
                  }//END BUTTON  
              });//END MEDITHUMB 
                 
                
        /////////////////////////////////////////////////////////////////////////
        // IF ACCORDION OF THE TEXTSTYLE ISN'T COLOSED (togller has height 0 ) // 
        ///////////////////////////////////////////////////////////////////////// 
 
            if($toggle.height() !== 0) $newTextStyle.parent().dev_gadgetMedithumb('show'); // SHOW THE REMOVE TEXTSTYLE BUTTON 
  
        }//END IF      
    }//END SETTEXTSTYLES

              
// BIND TEXT SELECTION
              ,_bindTextSelection: function(object)
              {
                  var self = this;  
                
                  $(object).bind('mouseup.txtEditorStyles.gadgetWrite, keyup.txtEditorStyles.gadgetWrite', function(event)
                  {  
                      // ? Asks wich key is pressed
                      var code= (event.keyCode ? event.keyCode : event.which);
                      var $target = $(event.target)
                  //--------------------------------------------
                  // If schift or the mousebutton was pressed
                  //--------------------------------------------
                      if (code == 16 || event.type == 'mouseup' && $target.attr('class') !== self.write.selectionClass )
                      {
                      //--------------------------------------------
                      // If it was not the first click. This removes
                      // the last selection was set befor this click.
                      //--------------------------------------------
                          self._deleteSelection()
                      //--------------------------------------------
                      // Set selection
                      //--------------------------------------------
                          // ? use warpSelection to wrap the range with a span
                          self.write.$selection = $(this).wrapSelection({ fitToWord: false });
                          self._setTextStyles($target)
                                            
                      //--------------------------------------------
                      // Set self.write.selectionClass
                      //--------------------------------------------
                          self.write.selectionClass = $(self.write.$selection[0]).attr('class')
                      //--------------------------------------------
                      // Set range on the selection
                      //--------------------------------------------
                          if(self.write.$selection.length)
                          {
                            self._setRange(object, self.write.$selection, false)
                            self._setCaretInSelection()
                          };
                      //--------------------------------------------
                      // Prepare variables for self._bindTextFormat()
                      //--------------------------------------------
                          // if the selection is a caret the target ist selects will be formatted
                          if(!self.write.$selection.parent().length && $(event.target).attr('class') !== self.write.selectionClass) 
                          {
                              
                              self.write.$editable = object; 
                            
                              self.write.$toFormat = $(event.target);
                              self._saveChange()

                          }
                          // else the selected ($selected) range will be styled
                          else {
                              
                              self.write.$editable = object; self.write.$toFormat = self.write.$selection; 
                          };

                      }
                  });
              }
              
              
// BIND TEXT FORMAT
              ,_bindTextFormat: function()
              { 
                  var self = this, o = self.options;
                  
                  $(o.textStyleContainer)
                        .undelegate('li.HELPER-textStyles','click')
                        .delegate('li.HELPER-textStyles','click', function(event){ 
                    
                    
                            var $thisStyle = $(this).children(':first'); if( $thisStyle.children().length ) $thisStyle = $thisStyle.children(':first');
                            
                            self._setTextStyles($thisStyle)
                     
            
                  //--------------------------------------------
                  // Formates the selection with the new styling
                  //--------------------------------------------
                      function wrapWith(object, $style, parentWrap, noClass)
                      { 
                          
                      //---------------------------------------------------------
                      // Create a new element width the nodeName of the new style
                      //---------------------------------------------------------    
                          var createWrap = document.createElement($style.attr('nodeName'));
                      //---------------------------------------------------------
                      // Call a function to select the attributes of the new 
                      // style and append it to the new createt element 
                      //---------------------------------------------------------
                          self._setAttr($style, createWrap); 
                      //---------------------------------------------------------
                      // Fills the new element with the text of the selection
                      // style and append it to the new created element 
                      // and appends a Helper class to ist atribute  
                      // to identify it later in the formating process
                      //---------------------------------------------------------
                          var createElement = 0;

                          object.each(function(i)
                          {
                          //--------------------------------------------
                          // if note is a text his value will be saved
                          //--------------------------------------------    
                              if(object[i].nodeType == 3  )
                              {
                                  createElement = document.createTextNode(object[i].nodeValue)
                                  createWrap.appendChild(createElement);
                                  //text.push(object[i].nodeValue)
                              } 
                          //--------------------------------------------
                          // if note is a DOM element his value will 
                          // be saved
                          //--------------------------------------------
                              else { 
                                  // if parent wrap is true the nodes 
                                  // wich are HTML tags 
                                  // be wrap by objectsParents  
                                  if(parentWrap == true)
                                  {    
                                     createElement = document.createElement(object[i].nodeName);

                                     self._setAttr($(object[i]), createElement); 
                                     $(createElement).html($((object[i])).text());

                                     createWrap.appendChild(createElement);
                                  } 
                                  else {
                                      createElement = document.createTextNode($(object[i]).text())
                                      createWrap.appendChild(createElement);    
                                  } 
                              }
                          });
                          if(noClass != 'no')  $(createWrap).addClass('HELPER-bindTextFormat-lastWrap'); 
                      //---------------------------------------------------------
                      // Return the new element to work with  
                      //---------------------------------------------------------
                          return createWrap;
                      };
                  //--------------------------------------------
                  // find the position of the node wich is send 
                  // on function call
                  //--------------------------------------------
                      function counter(object)
                      { 
                          var counter = 0; var found = false;
                      //--------------------------------------------
                      // counter each node child of objects parent 
                      // until the object is found 
                      //--------------------------------------------
                          object.parent().contents().each(function() 
                          {
                              // if it doesn't have the class of the oject counter 
                              if($(this).attr('class') !== object.attr('class') && found == false) 
                              {
                                  counter++ 
                              } 
                              // else if it is found set var found on true
                              else { 
                                  found = true 
                              }
                          }); // ??? found = false;
                      //--------------------------------------------
                      // After the position of the object is found
                      // the function send it back to work width
                      //--------------------------------------------
                          return counter
                      };
                  //--------------------------------------------
                  // Cuts the Parent of the Selection in two 
                  // peaces with the selection in between 
                  // So that Parent and selection is on the
                  // same DOM tree level.
                  //--------------------------------------------
                      function reWrap(object) 
                      {
                          
                          object.each(function(i)
                          {
                             var $this = $(this); 
                             var $parent = $this.parent(); 
                          //--------------------------------------------
                          // Wrap
                          //--------------------------------------------
                             var before = $parent.contents().filter(function(index) { return index < counter($this) })
                             var after = $parent.contents().filter(function(index) { return index > counter($this) })
                             
                             before.replaceWith(wrapWith(before, $parent, true , 'no'));
                             //before.removeClass('HELPER-bindTextFormat-lastWrap')

                             after.replaceWith(wrapWith(after, $parent, true, 'no'));

                             $('.HELPER-bindTextFormat-lastWrap').removeClass('HELPER-bindTextFormat-lastWrap'); //.removeAttr('class')

                              if(self.write.$toFormat.length == 1 )
                              {
                                  object.parent().children().unwrap()	
                              }
                          });
                      };

                      
                  self.element.find('> a').remove()
                  console.log('startF', self.write.$toFormat == undefined)
         
                  //--------------------------------------------
                  // If to format exists
                  //--------------------------------------------
                      if(self.write.$toFormat !== 0 && self.write.$toFormat !== '')
                      { 
                      
                      //--------------------------------------------
                      // and is a selection and not a target
                      //--------------------------------------------

                          if(self.write.$toFormat.attr('class') == self.write.selectionClass ) 
                          {
                          //--------------------------------------------
                          // Selection is ony in one element
                          //--------------------------------------------
                              
                              if(self.write.$toFormat.length == 1)
                              {
                              //--------------------------------------------
                              //  A | Selection is only one span. Selection 
                              //      parent is a inline-element and selection
                              //      will be formated as a block-element.
                              //      so selection parent and the
                              //      block-element wich wraps it will be cut
                              //      in two pieces and the selection will be
                              //      fill the spot new formated
                              //--------------------------------------------
                                  if( self.write.$toFormat.parent().css('display') == 'inline' && $thisStyle.css('display') !== 'inline' )
                                  {
                                      console.log('A')
                                      reWrap(self.write.$toFormat); reWrap(self.write.$toFormat); self.write.$toFormat.replaceWith(wrapWith(self.write.$toFormat, $thisStyle));
                                       
                                  }
                              //--------------------------------------------
                              //  B | Selection is only one span. Selection 
                              //      parent is a block-element and selection
                              //      will be formated as a display-block 
                              //      element.the parent is cat in two the
                              //      selection is set in between the spot
                              //--------------------------------------------
                                  else if( $thisStyle.css('display') !== 'inline')
                                  {
                                      console.log('B')
                                      reWrap(self.write.$toFormat); self.write.$toFormat.replaceWith(wrapWith(self.write.$toFormat, $thisStyle));
                                      
                                  }
                                
                              //--------------------------------------------
                              //  C | Selection is only one span. Selection
                              //      will be formated as a
                              //      display-inline element.
                              //--------------------------------------------
                                  else{
                                      console.log('C')
                                      self.write.$toFormat.replaceWith(wrapWith(self.write.$toFormat, $thisStyle));
                                      
                                  }
                              }
                          //--------------------------------------------
                          // Selection selects more than one element
                          //--------------------------------------------
                              else {
                              //--------------------------------------------
                              // D | two elements are selected and the
                              //     selection begins in the first and ends
                              //     in the second element take the selection
                              //     out of the elements and place it
                              //     between them
                              //--------------------------------------------
                                  if($thisStyle.css('display') !== 'inline')
                                  {
                                      console.log('D')
                                      reWrap(self.write.$toFormat);
                                      self.write.$toFormat.wrap('<'+ $thisStyle.attr('nodeName')  + '><\/'+ $thisStyle.attr('nodeName')  + '>' )
                                      self._setAttr($thisStyle, self.write.$toFormat.parent()); 
                                      self.write.$toFormat.parent().addClass('HELPER-bindTextFormat-lastWrap').unwrap()	
                                      self.write.$toFormat.not(':first').unwrap().remove()
                                      self.write.$toFormat.replaceWith(self.write.$selection.text());
                                       
                                  }
                              //--------------------------------------------
                              // E + F | these two manage wraps with display-
                              //         inline elements
                              //--------------------------------------------
                                  else{
                                      self.write.$toFormat.each(function()
                                      {
                                          if($(this).parent().css('display') !== 'inline')
                                          {
                                              console.log('E')
                                              $(this).replaceWith( wrapWith($(this), $thisStyle) );
                                              
                                          }
                                          else{
                                               console.log('F')
                                              $(this).replaceWith($(this).text());
                                             
                                          }
                                      });
                                  }
                              } 
                          }
                      //--------------------------------------------
                      // else if toFormat is a target
                      // it changes the selected elements format
                      //--------------------------------------------
                          else {
                          //--------------------------------------------
                          // Is Emty 
                          //--------------------------------------------
                              if(self.write.$toFormat === self.write.$editable )
                              {
                                  if(self.write.$editable.children().length == 1){
                                      console.log('M') 
                                      self.write.$editable.children().replaceWith(wrapWith(self.write.$toFormat, $thisStyle));
                                  }
                                  else 
                                  {  console.log('N') 
                                      self.write.$editable.wrapInner(wrapWith(self.write.$toFormat, $thisStyle))

                                  }

                              }

                              else if(self.write.$toFormat === self.element )
                              {
                                    
                                    self.write.$editable.children(':last').replaceWith(wrapWith(self.write.$editable.children(':last'), $thisStyle)); 
                                    
                              }
                              
                              
                              else if( self.write.$toFormat.parent().css('display') !== 'inline' && self.write.$toFormat.css('display')  == 'inline'  && $thisStyle.css('display') !== 'inline' )
                              {
                                  console.log('Z') 
                               
                                   //reWrap($('.HELPER-bindTextFormat-lastWrap'));
                                    reWrap(self.write.$toFormat); self.write.$toFormat.replaceWith(wrapWith(self.write.$toFormat, $thisStyle));
                                    
                                  
                              } 
                              else if( $thisStyle.css('display') !== 'inline' && self.write.$toFormat.css('display') == 'inline')
                              {
                                  console.log('G')
                                  reWrap(self.write.$toFormat); self.write.$toFormat.replaceWith(wrapWith(self.write.$toFormat, $thisStyle));
                                  
                              }
                              
                              else if($thisStyle.css('display') !== 'inline' || self.write.$toFormat.css('display') == 'inline' )
                              {
                                    console.log('H')
                                    self.write.$toFormat.replaceWith(wrapWith(self.write.$toFormat, $thisStyle));
                                   
                              } 
                              // ???
                              else{
                                  console.log('I')
                                  self.write.$toFormat.html(wrapWith(self.write.$toFormat, $thisStyle) );
                                  

                              }
                          }
                      }
                      
                      //--------------------------------------------
                      // If to format doesn't exist we use the last
                      // wrap to format
                      //--------------------------------------------
                      else {
                            // if we wrap a inline element with a block element
                            if(self.write.lastWrap.css('display') == 'inline' && $thisStyle.css('display') !== 'inline' )
                            {
                                console.log('Q')
                                var parent = self.write.lastWrap.parent();
                                    reWrap(self.write.lastWrap); 
                                    self.write.lastWrap.replaceWith(wrapWith(self.write.lastWrap, $thisStyle));
                                    parent.replaceWith(parent.html())
                            
                            }
                            // if we wrap a block element with an inline element
                            else if(self.write.lastWrap.css('display') !== 'inline' && $thisStyle.css('display') == 'inline')
                            {
                                console.log('W')
                                self.write.lastWrap.wrapInner('<'+ $thisStyle.attr('nodeName')  +' class="HELPER-bindTextFormat-lastWrap" ' +'><\/'+ $thisStyle.attr('nodeName')  + '>' )
                                      
                            }
                            else{
                               console.log('T')
                               self.write.lastWrap.replaceWith(wrapWith(self.write.lastWrap, $thisStyle));  
                            }
                           
                          
                      }
                      
                       self._setRange( self.write.$editable, $('.HELPER-bindTextFormat-lastWrap'), true);
                      
                       self.write.lastWrap = $('.HELPER-bindTextFormat-lastWrap')
                       $('.HELPER-bindTextFormat-lastWrap').removeClass('HELPER-bindTextFormat-lastWrap'); 
                     
                     
                     
                     
                      
                    
                      self._removeEmpty(self.write.$editable)     
                      self._saveChange(); 
                      self._setLink( self.write.lastWrap);  
                          
                        

                        self.write.$toFormat =''
                        //self.write.$selection = 0;
                      return false

                   })
                 }

 //////////////
 // SET LINK //
 //////////////

    ,_setLink: function(target){

    ///////////////////////////////////////////////
    // ONLY IF TARGET IS A HREF LINK WILL BE SET //
    ///////////////////////////////////////////////

        if(target.attr('nodeName') == 'A') target.dev_gadgetLink(); 

    }
                 
                 
                 
                
// BIND REMOVE FORMAT
                ,_bindRemoveFromat: function()
                { 
                    var self = this, id = self.element.attr('id');
                    //--------------------------------------------
                    // If to self.write.$toFormat doesn't exist 
                    // We can use self.write.lastWrap 
                    //--------------------------------------------
                     console.log('bindRemoveFromat',self.write.$toFormat, self.write.lastWrap )
                        if(self.write.$toFormat.length == 0 || self.write.$toFormat === self.element)
                        {
                        //--------------------------------------------
                        // And 
                        //--------------------------------------------    
                            if( self.write.lastWrap.length !== 0 )
                            {
                               
                                self.write.$toFormat = self.write.lastWrap;
                            } 
                            else {
                                self.write.$toFormat = self.write.$editable.children(':last');
                            }
                         }
                     
                    //--------------------------------------------
                    // If self.write.$toFormat is not the root div width 
                    // the contentEditable="true" tag remove 
                    // the format
                    //--------------------------------------------
                        if(self.write.$toFormat[0] !== self.write.$editable[0])
                        {
                        //--------------------------------------------
                        // if self.write.$toFormat is a display-block element
                        //--------------------------------------------
                            if(self.write.$toFormat.css('display') !== 'inline')
                            {
                            //--------------------------------------------
                            // wrap new width a paragraph contains a 
                            // Helperclass to set caret
                            //--------------------------------------------
                                self.write.$toFormat.wrap('<p class="p'+id+' HELPER-bindTextFormat-lastWrap"></p>')
                                         // replace self.write.$toFormat with its test
                                         .replaceWith(self.write.$toFormat.text()); 
                            //--------------------------------------------
                            // set caret on helper class
                            //--------------------------------------------
                                self._setRange( self.write.$editable, $('.HELPER-bindTextFormat-lastWrap'), true);
                                // ? set element width helper class on self.write.$toFormat if designer 
                                //   clicks another style without select toFormat again so that 
                                //   the last selection will formated again 
                                self.write.$toFormat = $('.HELPER-bindTextFormat-lastWrap');
                                //self.write.lastWrap = self.write.$toFormat
                                //   Remove Helper class
                                //self.write.lastWrap = $('.HELPER-bindTextFormat-lastWrap')
                                $('.HELPER-bindTextFormat-lastWrap').removeClass('HELPER-bindTextFormat-lastWrap');
                            }
                        //--------------------------------------------
                        // self.write.$toFormat is a display-inline element
                        // the parent becomes the helper class to 
                        // set the caret
                        //--------------------------------------------
                            else {
                                self.write.$toFormat.parent().addClass('HELPER-bindTextFormat-lastWrap').end().replaceWith(self.write.$toFormat.text())

                                self._setRange( self.write.$editable, $('.HELPER-bindTextFormat-lastWrap'), true);

                                self.write.$toFormat = $('.HELPER-bindTextFormat-lastWrap');
                                //self.write.lastWrap = self.write.$toFormat
                                
                                $('.HELPER-bindTextFormat-lastWrap').removeClass('HELPER-bindTextFormat-lastWrap');
                            }
                        }
                        
                    
                        self._setTextStyles(self.write.$toFormat)
                        //self.write.$toFormat= 0
                        return false;
                      
                    
                }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper functions                                                                                     //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// REMOVE EMTY TAGS
             ,_removeEmpty: function(array)
             {
                 var self = this;
                 
                 array.children().each( function(){
                     var $this = $(this)
                    
                       if($this.text() == "" || $this.text().length == 0)
                       {

                         $(this).remove() ;
                       }
                   })
              }
        
// DELETE SELECTION
                ,_deleteSelection: function ()
                {   
                    var self = this;
                //--------------------------------------------
                // If it was not the first click. This removes 
                // the last selection was set befor this click. 
                //--------------------------------------------    
               
                    
                    if(self.write.$selection !== 0) 
                    { 
                        self.write.$selection.each(function()
                        {
                            $(this).replaceWith($(this).html()); 
                        });
                        self.write.$selection = 0;
                    }
                }
              
                
// SET RANGE
                ,_setRange: function(object, select, setCaret, e) 
                {
                    var self = this;
                // ! will need ie-range script to emulate setStart, setEnd and createRange() for IE & jquery.textNode.js	

                    var $parent = object; var range = document.createRange(); var section = [ ];

                //-------------------------------------------------
                // Default If selection is not a Break 
                //-------------------------------------------------
                        if(select.attr('nodeName') !== 'BR' && select.attr('id') !== 'HELPER-lastInsert'){

                            // ? Set focus on the editable element for this two browsers because they don't focus 
                            //   editable content elements together by their own after setting a range on it.
                            if($.browser.mozilla || $.browser.opera)
                            {
                                $parent.focus()
                            }
                        //--------------------------------------
                        // Filter selected textNodes
                        //--------------------------------------
                            object.textNodes().each(function()
                            {
                                if($(this).parent().attr('class') == select.attr('class'))
                                {
                                    section.push(this);
                                }
                            });
                        //--------------------------------------
                        // Set Range Start & End points
                        //--------------------------------------
                            range.setStart(section[0], 0); 
                            range.setEnd(  section[section.length -1] , section[ section.length -1 ].length ); 
                        //--------------------------------------
                        // Set Caret to the end of the selection
                        //--------------------------------------
                            if(setCaret == true && !$.browser.msie)
                            {
                                range.collapse(false);
                            // ? Special sulution for IE because IERANGE.js has problems width the collapse() object if it is set to false.
                            //   So I use the native collpase() object of the IE and build a new range.
                            } 
                            else if(setCaret == true) 
                            {
                                var range = document.body.createTextRange();
                                    range.moveToElementText(section[section.length -1].parentNode);	
                                    // Special for IE 7 to set caret at the same position like the other browsers  
                                    if(jQuery.browser.version < 8.0)
                                    {
                                        range.moveEnd('character',  -1);
                                    } 
                                    // and IE 8   
                                    else {
                                        range.moveEnd('character',  0);
                                    }

                                    range.collapse(false);
                                    range.select()
                            }
                //-------------------------------------------------
                // If selection is Br set caret behind th new break
                //------------------------------------------------- 
                    }
                    else{ 

                        referenceNode = document.getElementById(select.attr('id'));
                        //range.setStartAfter(referenceNode);
                        range.setStartBefore(referenceNode);
                        range.collapse(true);

                    }
                //-------------------------------------
                // Set Range 
                //-------------------------------------
                    // ? This is a filter the setup the selection only in IE if setCaret is false and 
                    //   we can use the methodes of the IERANGE.js     
                    if(setCaret == false || !$.browser.msie && setCaret == true || select.attr('nodeName') == 'BR' || select.attr('id') == 'HELPER-lastInsert' )
                    {
                            var select = window.getSelection();
                                select.removeAllRanges();
                                select.addRange(range);

                    }


                }
// CARET
                ,_caret: function (option, object, pos)
                {
                    var self = this;
                //-------------------------------------------------
                // save: Saves and set a caret position 
                //       width a span
                //------------------------------------------------- 
                    if(option == 'save')
                    {
                    //-------------------------------------------------
                    // If an object is defined to save the selection
                    //-------------------------------------------------
                        if(object !== undefined)
                        {
                        //-------------------------------------------------
                        // Clear old ranges
                        //-------------------------------------------------    
                           self._clearSelection()
                        //-------------------------------------------------
                        // Create placeholder to save caret position
                        //-------------------------------------------------
                           if(pos == 'start' && pos !== undefined)
                           {
                               // save caret at the beginning
                               $('<span id="HELPER-lastInsert"></span><span id="HELPER-emty">&nbsp;</span>').prependTo(object)
                           }
                           // or caret at the end of the object
                           else if( pos == 'end' || pos == undefined) {
                               $('<span id="HELPER-lastInsert"></span><span id="HELPER-emty">&nbsp;</span>').appendTo(object)
                           }
                        }
                    //-------------------------------------------------
                    // Else if no object is defined
                    //-------------------------------------------------
                        else {
                        //-------------------------------------------------
                        // If option is Save and browser is not IE
                        //-------------------------------------------------
                            if(!$.browser.msie)
                            {
                            //-------------------------------------------------
                            // Create selection & range object at the position
                            // of the caret
                            //-------------------------------------------------
                                var select = window.getSelection(); var range = select.getRangeAt(0);
                           //-------------------------------------------------
                            // Create the span placeholder
                            //------------------------------------------------- 
                                placeholder = document.createElement('span');
                                // add an id to identify and 
                                // work with it later
                                //$(placeholder).text('@');
                                $(placeholder).attr('id', 'HELPER-lastInsert');
                                // and place the new node it at the caret position
                                range.insertNode(placeholder);
                            }
                        //-------------------------------------------------
                        // Else if it is an IE
                        //-------------------------------------------------
                            else {
                            //-------------------------------------------------
                            // Create range object at the position of the caret
                            //-------------------------------------------------
                                range = document.selection.createRange();
                            //-------------------------------------------------
                            // And paste some HTML at carets position to 
                            // create the placeholder span 
                            // HELPER-emty is needed to let 
                            // range.setStartBefore(referenceNode) in self._setRange
                            // in IE work
                            //-------------------------------------------------
                                range.pasteHTML(' <span id="HELPER-lastInsert"></span><span id="HELPER-emty">&nbsp;</span>');
                            }
                        }
                    }
                //-------------------------------------------------
                // set: set the Caret at his old position
                //-------------------------------------------------
                    else if (option == 'set') {
                    //-------------------------------------------------
                    // Removes a  possible current selection 
                    // for self._setCaretInSelection() because else Safari 
                    // & IE will need two clicks to remove range and 
                    // set caret what the others do with ones
                    //-------------------------------------------------
                        self._deleteSelection() 
                    //-------------------------------------------------
                    // Call self._setRange() on editabel and set the caret 
                    // before the placeholder span
                    //-------------------------------------------------
                        self._setRange( self.write.$editable, $('#HELPER-lastInsert'), true);
                    //-------------------------------------------------
                    // remove placeholder span
                    //-------------------------------------------------
                      $('#HELPER-lastInsert').remove();
                      $('#HELPER-emty').remove();
                    }
                }
// SAVE CHANGE
//var saveChangePointer = 0;
//var self.write.lastDo = 'redo';

                ,_saveChange:  function(){
                        var self = this;

                       if( self.write.saveSteps[1] == undefined && self.write.saveSteps[0] == self.write.$editable.html())
                       {

                       }
                       else if( self.write.saveSteps[1] !== self.write.$editable.html())
                       {   


                           self.write.saveSteps.unshift(self.write.$editable.html());

                           self._caret('save');
                           self.write.saveStepsCaret.unshift(self.write.$editable.html());

                           $('#HELPER-lastInsert').remove();
                           $('#HELPER-emty').remove();

                           if(self.write.saveSteps.length > self.options.numbersOfUndos + 1)
                           {
                               self.write.saveSteps.pop();
                           }
                       }
                   }
                   /*
                  $(document).bind('keydown', 'Ctrl+p', function(event) 
                  {    
                      event.preventDefault();
                      console.log( self.write.saveSteps.join('---------- >>'))
                      console.log('END END END')
                       console.log( self.write.saveStepsCaret.join('---------- >>'))
                  });*/

                  ,_undo: function()
                  {
                      var self = this;
                  // first undo is special event is needed
                      if(self.write.saveSteps.length == 1 )
                      {
                            self._saveChange()

                      }
                      if(self.write.lastDo == 'redo' && self.write.saveSteps.length != 1)
                      {
                          self.write.saveChangePointer++
                      }

                      if(self.write.saveChangePointer <= self.write.saveSteps.length - 1)
                      {
                          console.log(self.write.saveStepsCaret[self.write.saveChangePointer])
                          $('.doEdit').html( self.write.saveStepsCaret[self.write.saveChangePointer])
                          self._caret('set');

                          self.write.saveChangePointer++
                          self.write.lastDo = 'undo'
                      }
                  }

                  ,_redo: function ()
                  {
                      var self = this;
                      if(self.write.lastDo == 'undo')
                      {
                          self.write.saveChangePointer--
                      }
                       console.log(self.write.saveStepsCaret[self.write.saveChangePointer])
                      if(self.write.saveChangePointer != 0 && self.write.saveSteps.length != 1)
                      {
                          self.write.saveChangePointer--
                          $('.doEdit').html(self.write.saveStepsCaret[self.write.saveChangePointer])
                          self._caret('set')
                          self.write.lastDo = 'redo'
                      }
                  }



// CLEAR SELECTION 
                ,_clearSelection: function () 
                {
                    var self = this;
                    var select = 0;
                    if(document.selection && document.selection.empty)
                    {
                        document.selection.empty() ;
                    } 
                    else if(window.getSelection) {
                        select=window.getSelection();
                        if(select && select.removeAllRanges)
                        select.removeAllRanges();
                    }
                }
// SET CARET IN SELECTION
                ,_setCaretInSelection: function ()
                { 
                    var self = this;
                    // if selection exists
                    if(self.write.$selection.length) 
                    {   
                        self.write.$selection.bind('mousedown.test.gadgetWrite', function(event)
                        {  
                            self._clearSelection();
                            $(this).unbind('mousedown.test.gadgetWrite');
                        }); 

                        self.write.$selection.bind('mouseup.test.gadgetWrite', function()
                        {  
                            self._caret('save');
                            self._caret('set'); 

                            $(this).unbind('mouseup.test.gadgetWrite')
                        });
                    }                 
                }
// SET ATTRIBUTES
                ,_setAttr: function (object, appendAttrTo)
                {
                    var self = this;
                // find, filter and returns attriutes of an object and append it to another defined element (appendAttrTo)

                //--------------------------------------------
                // Get the attributes of the object
                //--------------------------------------------
                    var attrs = object[0].attributes;
                //--------------------------------------------
                // Add each attribute to appendAttrTo
                //--------------------------------------------
                    for(var i=0;i<attrs.length;i++)
                    {
                        // ? Filter to select wich attribute will be added
                        if(    attrs[i].nodeName == 'id' 
                            || attrs[i].nodeName == 'class' 
                            || attrs[i].nodeName == 'src' 
                            || attrs[i].nodeName == 'href'
                        ){
                            $(appendAttrTo).attr(attrs[i].nodeName , attrs[i].nodeValue );
                        }
                    };
                //--------------------------------------------
                // Returns the changed element
                //--------------------------------------------
                    return appendAttrTo;
                }

// MERGE CONTENT
                ,_mergeContent: function(option, event)
                {
                    var self = this;
        
                //--------------------------------------------
                // Special solution for webkit Browsers if two
                // elements where merged by pressing backspace
                // at the beginning of the second element
                // webkit prowsers wrap the content of the 
                // second element with a span called 
                // .Apple-style-span, so before taht happend
                // we do the merge by our self.
                //--------------------------------------------
                    var select = window.getSelection(); var range = select.getRangeAt(0); var rangeEndOffset = range.endOffset;
        
                    if($.browser.mozilla)
                    {
            
                        if( $(select.anchorNode.parentNode).text().length == 1 && $(select.anchorNode.parentNode).is(":first-child")  == true  )
                                               {   
                                                              event.preventDefault();
                                                
                                            
                                                            //--------------------------------------------
                                                            // save current element in a variable
                                                            //--------------------------------------------
                                                                var $this = $(select.anchorNode.parentNode)
                                                            //--------------------------------------------
                                                            // prevent remove of the last child of self.write.$editable
                                                            // in Mozilla 
                                                            //--------------------------------------------    
                                                                $this.html(' <br>');
                                                                self._setRange( self.write.$editable, self.write.$editable.children(':last'), true );
                                                
                                                                self._caret('save');
                                                                self._caret('set');
                                                }
        
                    }
    
        
                    if($.browser.webkit)
                    {
                    //--------------------------------------------
                    // Prevents delete of the first child 
                    // if it's the only child of $  
                    //  
                    //--------------------------------------------    
                        if($(select.anchorNode.parentNode).text().length == 1 && $(select.anchorNode.parentNode).is(":first-child")  == true  )
                        {   
              
                            event.preventDefault();
                        //--------------------------------------------
                        // save current element in a variable
                        //--------------------------------------------
                            var $this = $(select.anchorNode.parentNode)
                        //--------------------------------------------
                        // set range/caret: &nbsp; is needed to set 
                        // caret in safari
                        //--------------------------------------------    
                            $this.html('&nbsp;')
            
                            self._setRange( self.write.$editable, self.write.$editable.children(':first'), false );

                            self._caret('save');
                            self._caret('set');
                        }
                        else {
                        //--------------------------------------------
                        // Add a new id to second selected element 
                        // to identify it because the selection 
                        // makes problems with jquery manipulation
                        //--------------------------------------------  
                        $(select.anchorNode.parentNode).attr('id' , 'HELPER-remove');
                            // Create jQuery objects
                            var $this = $('#HELPER-remove');
                            // set brother differt if del or backspace is pressed
                            if(option == 'prev')
                            {
                                var $brother = $this.prev();
                            }
                            else if(option == 'next'){
                                 var $brother = $this.next();
                            }
            
            
                          //  console.log($this.text().length , $this.next().length)
            
                        //--------------------------------------------
                        // Removes selected element and appends his 
                        // content to his brother element if
                        // rangeEndOffset is 0 and the brother is not
                        // an display inline element.
                        //--------------------------------------------
                            if(rangeEndOffset == 0 && $brother.length  && $brother.css('display') !== 'inline' && option == 'prev')
                            {
                            //--------------------------------------------
                            // Prevent wrap with Apples span
                            //--------------------------------------------   
                                event.preventDefault()
                            //--------------------------------------------
                            // Saves the position of the caret
                            //--------------------------------------------
                                 self._caret('save')
                             //--------------------------------------------
                             // Append content of selected element to
                             // brother element and removes it
                             //--------------------------------------------
                                 $('#HELPER-remove').contents().appendTo($brother).end().end().remove()
                             //--------------------------------------------
                             // Set caret again
                             //--------------------------------------------
                                 self._caret('set')
                             }
                        //--------------------------------------------
                        // Removes brother after selected element
                        // and appends his content to it, if
                        // rangeEndOffset is as high as selected
                        // elements text length and the brother is not
                        //--------------------------------------------
                            else if (rangeEndOffset == $this.text().length  && $brother.length  && $brother.css('display') !== 'inline' && option == 'next') {
                            //--------------------------------------------
                            // Prevent wrap with Apples span
                            //--------------------------------------------
                                event.preventDefault() 
                            //--------------------------------------------
                            // Saves the position of the caret 
                            //--------------------------------------------   
                                 self._caret('save') 
                             //--------------------------------------------
                             // Append content of selected element to 
                             // brother element and removes it  
                             //--------------------------------------------
                                 $brother.contents().appendTo($this).end().end().remove()
                             //--------------------------------------------
                             // Set caret again
                             //--------------------------------------------
                                 self.write.$editable.children('font').remove()  
                                 self._caret('set')
                            }
                        }
                    //--------------------------------------------
                    // Deletes the complete selection width keypress
                    //--------------------------------------------
                        if( self.write.$selection.length == 2 && self.write.$selection.first().parent().css('display') !== 'inline' && self.write.$selection.last().parent().css('display') !== 'inline' )
                        {   
                                event.preventDefault()
                  
                                var $firstParent = self.write.$selection.first().parent();
                                var $secondParent = self.write.$selection.last().parent();

                               $('<span id="HELPER-lastInsert"></span> ').appendTo($firstParent)

                                $secondParent.contents().appendTo($firstParent)
                                self.write.$selection.remove()

                                $secondParent.remove()
                                self.write.$editable.children('font').remove()  
                                self._caret('set') 
               
                        }
                        $this.removeAttr('id');
                    }
        
   
            }
//END WRITE
});






})(jQuery);