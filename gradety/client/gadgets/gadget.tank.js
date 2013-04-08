(function($){
    
    $.widget("gadget.dev_gadgetTank", {
           options:{    
             
           }
            
           ,_create: function(){ 
               
              var self = this, o = self.options;
              
              ////////////////////////////////////////////////////
              // CREATE GRID FOR TANK IF IT STILL DOESN'T EXIST //
              ////////////////////////////////////////////////////
                
                self.grid = self.element.find('.GRID-tank'); 
                                
                if(!self.grid.length) self.grid = $('<div class="GRID-tank"></div>').prependTo(self.element);
                if(o.disabled == false )
                { 
                    self.createNewContent().appendTo(self.grid);
                    self.help = self.addHelp().appendTo(self.grid);
                }
           }
           ,_init: function(){  
                
                var self = this, o = self.options;
                
                ///////////////////////////////////////
                // ADD SORTABLE FOR CONTENT ELEMENTS //
                /////////////////////////////////////// 
                    
                    self._addSortable(self.grid);
           
           }
           ,_addChoose: function(target){

                var self = this, o = self.options, parent = target.closest('.GRID-tank, .COLUMN');
                target.dev_gadgetChoose({

                /////////////////
                // CHOOSE TEXT //
                /////////////////
                    
                    'Text': function(event, ui){

                        ui.button.bind('click', function(){ 
                        
                        /////////////////////////
                        // SET CONTENT TO TEXT //
                        /////////////////////////
                         
                            
                            target.dev_gadgetChoose('destroy')
                                  .removeClass('ui-sortable-disabled');
                                  //.dev_gadgetControls({'type':'text', 'all':'add'})
                                  
                          
                        ///////////////////////////////////
                        // CREATE NEW CONTENT/ADD BUTTON //
                        ///////////////////////////////////
                                  
                                  self.createNewContent().appendTo(target.closest('.GRID-tank, .COLUMN'));
                                   
                        });
                    }
                    
                ////////////////////
                // CHOOSE COLUMNS //
                ////////////////////         
                           
                    ,'Columns': function(event, ui){ 
                         ui.button.bind('click', function(){ 
                             
                           
                             target.dev_gadgetChoose('destroy')
                                  
                                   .removeClass('ui-sortable-disabled')
                                   .append(self._createNewColumn(target));
                                   
                                    self._setColumnsSize(target);
                                    self._addColumnRemoveButton(target);
                                    self._addColumnButton(target);
                                    
                                   ///////////////////////////////////
                                   // CREATE NEW CONTENT/ADD BUTTON //
                                   ///////////////////////////////////

                                    self.createNewContent().appendTo(self.grid);
                                
                                    
                                    target.find('.COLUMN')
                                          .mutate('sizeWidth,sizeHeight', function(event){
                                       
                                              var $columns = target.find('.COLUMN'), h = '0';
                                      
                                              $columns.each(function(i){
                                                  
                                                  var column = $(this), height = column.height();
                                                  if( height > h) h  = height; 
                                           
                                              });
                                      
                                              $columns.css('min-height',h);
                                          });

                         });
                    
                    }
                    
                //////////////////
                // CHOOSE IMAGE //
                //////////////////
                
                    ,'Image': function(event, ui) { }
                    
                ///////////////////
                // CHOOSE CANCEL //
                ///////////////////
                    
                    ,'cancel': {  
                        
                        action: function(event, ui){ ui.button.bind('click', function(){  
                            
                           target.remove(); 
                            
                        ////////////////////////////////////////////////////////////
                        // CREATE NEW CONTENT/ADD BUTTON AND HELP IF TANK IS EMTY //
                        ////////////////////////////////////////////////////////////
                            
                            self.createNewContent().appendTo(parent);
                            if(self.getContentLength() == 0) self.help = self.addHelp().appendTo(self.grid);
                        
                        });} 
                    }
                });
           }
           ,removeAddButtons: function(target, noChoose){
               
               var self = this, o = self.options;
               
               target.find('.BUTTON-AddAsText, .BUTTON-addMaxi')
                     .fadeOut(400, function(){
                      
                     ///////////////////////
                     // REMOVE ADD BUTTON //
                     ///////////////////////   
                     
                         $(this).remove(); 
                         
                     ///////////////////
                     // ADD CHOOSE    //
                     ///////////////////
                         
                         if(!noChoose) self._addChoose(target);  
                     
                     });
           }
           ,createAddButton: function(text,size){
               
               var self = this, addText = text || 'Add new'
                  ,newButtonNormal = $('<a class="BUTTON-AddAsText STYLE-patternAddAsText"><span class="ICON-add-mini STICKER-AddAsText"></span>'+addText+'</a>')
                  ,newButtonLarge = $('<a class="BUTTON-addMaxi">'+addText+'<span class="STICKER-addMaxiIcon ICON-add-maxi">Icon Add</span></a>')
                
                  ,created;
                  
              /////////////////////
              // SET BUTTON SIZE //
              /////////////////////
              
                  if(size == 'normal' || size == undefined) created = newButtonNormal;
                  else if(size == 'large') created = newButtonLarge;

              /////////////////////////
              // ADD BUTTON TO LIST  //
              /////////////////////////      
                          
                  if(!self.addButtons) self.addButtons = created;
                  else self.addButtons.add(created);

              ////////////////////////
              // RETURN NEW BUTTON  //
              ////////////////////////       
                  
                  return created;
           }
           ,createNewContent: function(button, tag){
                 
               var self = this, 
                   o = self.options, 
                   create = tag || 'div', 
                   content = $('<'+create+'></div>').addClass('CONTENT ui-sortable-disabled').append('<div class="HELPER-tankSortable"></div>'),
                   size =  button || (self.getContentLength() > 0)?'normal':'large',
                   Size = size.substr(0, 1).toUpperCase()+size.substr(1);
                   
               ////////////////////////
               // RETURN NEW BUTTON  //
               ////////////////////////
                   
                   if(button != false)
                   {
                       
                       self.createAddButton('Add Content', size )
                           .addClass('STYLE-TankAddButton'+ Size)
                           .appendTo(content)
                           
                       ////////////
                       // EVENT  //
                       ////////////
                             
                           .bind('click.addToTank', function(event){
                               
                               event.stopPropagation();
                               self.removeAddButtons(content);
                               
                           ////////////////////////////////////////
                           // REMOVE HELP TEXT IF IT STILL EXIST //
                           ////////////////////////////////////////
                           
                               if(self.help !== undefined) self.help.fadeOut(400, function(){$(this).remove();});
                           });
                   };
                   
                   self._resetColumnsHeight();
                   
               ////////////////////////
               // RETURN NEW CONTENT //
               ////////////////////////
                  return content;
           }

           ,getContentLength: function(element){ var target = element;  if(!element) target = this.element; return target.find('.CONTENT:not(.ui-sortable-disabled)').length; }
           ,addHelp: function(){ if(this.getContentLength() == 0) return $('<div class="CONTAINER-help"><h1>PleaseHelp</h1><p>This should be a great help in the future</p></div>'); }

           ,_addSortable: function(target){
               var self = this, o = self.options;
               
             
               
               target.sortable({
                     
                     disabled:(o.disabled == false )?false:true
                    ,items: '> .CONTENT:not(.ui-sortable-disabled)'
                    ,connectWith: (target.is('.COLUMN'))?'.COLUMN , .GRID-tank':'.COLUMN ,.GRID-tank'
                    ,placeholder: 'UI-GRID-sortable-placeholder' 
                    ,containment: 'body'
                    ,cancel: 'ui-sortable-disabled'
                    ,cursorAt: { left: 43, top: 33 }
                    ,helper : 'clone'
                    ,appendTo: 'body'
                    ,tolerance: 'pointer'
                    ,toleranceElement: '> .HELPER-tankSortable' 
                    ,start: function(event, ui){
                         
                          var $tankGrid = ui.item.closest('.GRID-tank, .COLUMN'), $columns = self.grid.find('.COLUMN');
                          
                          self._removeAddColumnButtons($('body')); 
                          self._removeAddColumnButtons($('body')); 
                        
                          //if($tankGrid.is('.GRID-tank')) self._addDroppable($columns);
                          if($tankGrid.is('.COLUMN')) self._addDroppable($('.GRID-tank')); $('.GRID-tank').droppable('disable');
                          
                         
                          //self.grid.find('.ui-sortable-disabled').fadeOut(0);
                          $('.GRID-tank, .COLUMN').find('.ui-sortable-disabled, .CONTAINER-help').fadeOut(0);
                          
                          
                          ui.helper.css({
                                         ' border-radius': 12
                                        ,'-moz-border-radius': 12
                                        ,'-webkit-border-radius': 12
                                        ,'box-shadow': '#414141 1px 1px 8px'
                                        ,'-moz-box-shadow': '#414141 1px 1px 8px'
                                        ,'-webkit-box-shadow': '#414141 1px 1px 8px'
                                        ,'width': 86
                                        ,'height': 66
                                        ,'overflow':'hidden'
                    
                                       })
                                       .find('> *')
                                       .css('display', 'none');
                                       
                        /////////////////////////////////////////////////////////////
                        // WORARRAOUND: IT LOOKS LIKE SORTABLE                     //
                        // CREATES THE CONTAINMENT PROPERTIES BEFORE               //
                        // THE START AND DON'T REFRESH IT ON SORT.                 //
                        // SO THE WIDGET DOESN'T USE THE                           //    
                        // NEW DIMENSIONS OF ui.item TO FIND THE LIMITATIONS       //
                        // OF THE .STAGE. SO I HAD TO ANNUL THE WIDGET             //
                        // AND UPDATE CONTAINMENT AGAIN WITH ._setContainment()    //
                        // DIRECTLY WITH A CALL IN WIDETS DATA ELEMENT.            //
                        /////////////////////////////////////////////////////////////
                        // + 9 PREVENTS A SCROLLBAR FOR .STAGE IN                  //
                        // MOZILLA, THAT IS CAUSED BY THE SHADOW OF THE ui.helper  //
                        /////////////////////////////////////////////////////////////
                           
                           var sortable= ui.item.data('sortable-item');
                               sortable.helperProportions = { height: 66 + 9 , width: 86 + 9  };
                               ui.item.data('sortable-item')._setContainment();
                            
                    }
                    ,over: function(event, ui){    
                        
                        var $tankGrid = ui.item.closest('.GRID-tank, .COLUMN'); 
                       
                        //if($tankGrid.is('.GRID-tank')) self.grid.find('.ui-sortable-disabled, .CONTAINER-help').fadeOut(0); 
                        
                        if( $tankGrid.is('.COLUMN') )
                        {  
                            $('.GRID-tank').droppable('disable'); 
                            $tankGrid.sortable( "refresh" );
                        };
                    }    
                    ,out: function(event, ui){     
                        
                        var $tankGrid = ui.item.closest('.GRID-tank, .COLUMN');
                            console.log('$target');
                        
                        //if($tankGrid.is('.GRID-tank')) self.grid.find('.ui-sortable-disabled, .CONTAINER-help').fadeIn(300); 
                        
                        if( $tankGrid.is('.COLUMN') )
                        {  
                            $('.GRID-tank').droppable('enable');  
                            $tankGrid.sortable( "refresh" );
                        }
                    }
                    ,stop: function(event, ui){
                       
                  
                        var $tankGrid = ui.item.closest('.GRID-tank, .COLUMN')
                           ,$this = $(this)
                           ,$container = $tankGrid.parent()
                           ,$target =  ui.item.parent()
                           ,$allTanks = $('.GRID-tank')
                           ,thisIsColumn = $(this).is('.COLUMN')
                           ,targetIsColumn = $tankGrid.is('.COLUMN')
                           ,targetLength = $container.dev_gadgetTank('getContentLength', $tankGrid);
                          
                        /////////////////////////////
                        // REMOVE DROPPABLE OPIONS //
                        /////////////////////////////    
                        
                            self.grid.find('.COLUMN').droppable('destroy'); 
                            $allTanks.droppable('destroy');
                        
                        /////////////////////////////////
                        // ADD CONTENT TO ANOTHER TANK //
                        /////////////////////////////////
                        
                           if( targetLength == 1 )
                           { 
                               $target.find('.ui-sortable-disabled, .CONTAINER-help').remove();
                               $tankGrid.append( $container.dev_gadgetTank('createNewContent'));   
                           }
                        
                        /////////////////////////////////
                        // FROM TANK TO TANK/COLUMNS   //
                        /////////////////////////////////
                            
                            if($target.is('.COLUMN'))
                            {
                                $target.find('> .ui-sortable-disabled, .CONTAINER-help').remove();
                                self.createNewContent('normal').appendTo($target);
                            }
                        
                        //////////////////
                        // OLD SORTABLE //
                        //////////////////
                            
                            if(!thisIsColumn)
                            {
                                
                            ///////////////
                            // EMTY TANK //
                            ///////////////
                               
                                if( self.getContentLength($this) == 0 )
                                {
                                    $this.find('>.ui-sortable-disabled, >.CONTAINER-help').remove();
                                    self.createNewContent().appendTo($this);
                                    self.help = self.addHelp().appendTo($this);
                                }
                               
                            } 
                            
                        ////////////
                        // COLUMN //
                        ////////////
                            
                            else if(thisIsColumn){
                                
                                $this.find('>.ui-sortable-disabled').remove();
                                self.createNewContent().appendTo($this);
                            }
                            
                        //////////////////////////////////////////////////////
                        // FADE THE REST OF THE HIDDEN ADD BUTTONS IN AGAIN //
                        //////////////////////////////////////////////////////
                            
                           $('.GRID-tank, .COLUMN').find('.ui-sortable-disabled, .CONTAINER-help').fadeIn(0);   
                        
                        //////////////////////////////////
                        // ADD ADD COLUMN BUTTONS AGAIN //
                        //////////////////////////////////  
                           
                           self._addColumnButton($('.GRID-tank'));
                           
                      }   
                });
               
           }
           ,destroy: function(){
               
               this.grid.sortable('destroy');
               this.grid.find('.ui-sortable-disabled, .CONTAINER-help').remove();
               
               $.Widget.prototype.destroy.apply(this);
             
           }
           ,_setOption: function( key, value ) {
                var self = this;
                this.options[ key ] = value;

                switch(key) {

                /////////////
                // DISABLE //
                /////////////

                    case 'disabled':
                    
                        if(value == true) {
                            
                        ////////////////////////
                        // REMOVE ADD BUTTONS //
                        ////////////////////////

                            self.grid.find('.ui-sortable-disabled, .CONTAINER-help').remove();
                            
                        //////////////////////
                        // DISABLE SORTABLE //
                        //////////////////////
                            
                            self.grid.sortable('disable'); 
                        }
                        else {
                            
                        //////////////////////////////
                        // CREATE ADD BUTTONS AGAIN //
                        //////////////////////////////

                            self.createNewContent().appendTo(self.grid);
                            
                        /////////////////////
                        // ENABLE SORTABLE //
                        /////////////////////

                            self.grid.sortable('enable'); 
                            
                        ///////////////////////////
                        // ADD HELP IF NECESARRY //
                        ///////////////////////////
                        
                            if(self.getContentLength() == 0) self.help = self.addHelp().appendTo(self.grid);  
                        }
                    break;
                }
           }
           ,_createNewColumn: function(target)
           {
               var self = this, 
                   o = self.options,
                   newColumn = (target.is('.COLUMN'))?$('<div class="COLUMN"></div>'):$('<div class="COLUMN"></div><div class="COLUMN"></div>');
                   return newColumn;
           }
           ,_addColumnRemoveButton: function(target){
               
               var self = this, columns = target.find('.COLUMN');
               self._removeColumnRemoveButtons(target);    
               columns.each(function(i){ 
              
                   var $column = $(this);
                   $column.dev_gadgetMedithumb({  
                       
                      'button.Delete':{
                          
                          'addClass': 'STYLE-itemMedithumbIcon ICON-trash-mini', 
                          'action': function(events, ui){}
                      }
                      ,action: function(event, ui){
                          
                          ui.element.bind({

                             'mouseenter.medithumb':  function(){  ui.self.show(600); }
                            ,'leaveTop.medithumb':  function(){    ui.self.hide(700); }
                            ,'leaveBottom.medithumb':  function(){ ui.self.hide(0); }
                            ,'leaveLeft.medithumb':  function(){   ui.self.hide(700); }
                            ,'leaveRight.medithumb':  function(){  ui.self.hide(0); }

                          });
                          ui.medithumb.bind({     

                            'mouseenter.medithumb':  function(){  ui.self.show(0); ui.element.dev_gadgetAddColumn('show'); }
                           ,'mouseleave.medithumb':  function(){  ui.self.hide(0); ui.element.dev_gadgetAddColumn('hide');  }

                         });
                      
                      }
                         
                   });
               });
               
           }
           ,_removeColumnRemoveButtons: function(target){ target.find('.COLUMN').dev_gadgetMedithumb('destroy'); }
           ,_addColumnButton: function(target) 
           {
               var self = this, columns = target.find('.COLUMN');
               
               ///////////////////////////////////////////////
               // CREATE REGISTER OF ALL ADD COLUMN BUTTONS //
               ///////////////////////////////////////////////

                   self._removeAddColumnButtons(target); 
                  
               
               ////////////////
               // ADD BUTTON //
               ////////////////  
               
                    columns.dev_gadgetAddColumn({
                         'onShow': function(even,ui){   ui.element.dev_gadgetMedithumb('show');}
                        ,'onHide': function(even,ui){   ui.element.dev_gadgetMedithumb('hide');}
                        ,'action': function(even,ui){   
                            
                            var newColumn = self._createNewColumn(ui.element).insertAfter(ui.element);
                            self._setColumnsSize(target);
                            self._addColumnButton(target);
                            self._addColumnRemoveButton(target);
                        }  
                    });
           }
           ,_removeAddColumnButtons: function(target){ target.find('.COLUMN').dev_gadgetAddColumn('destroy');}
           ,_setColumnsSize: function(target){
               
                var self = this
                  ,o = self.options
                  ,columns = target.find('.COLUMN') 
                  ,L =  columns.length
                  ,W = target.width()
                  ,columnWidth = W / L;
            
                ///////////////////
                // SETUP COLUMNS //
                ///////////////////
                  
                    columns.each(function(i){ 
                    
                        var $column = $(this);
                        
                ////////////////////////////
                // REMOVE OLD ADD BUTTONS //
                ////////////////////////////  
                     
                        $column.find('>.ui-sortable-disabled')
                                  .remove()
                               .end()
                               .width(Math.floor(columnWidth));
                        
                        self.createNewContent().appendTo($column);   
                        self._addSortable($column);
                    });
                 
                 
           }
           
           ,_resetColumnsHeight:function(){
                 var self = this; 
                 self.grid.find('.COLUMN')
                          .each(function(){ var $column = $(this);  
                            
                              if($column.css('min-height') > 120) $column.css('min-height',0); 
                              else $column.css('min-height',120);
                          });
               
           }
           ,_addDroppable: function(target){

                var self = this ,o = self.options;
                
                target.droppable({

                    accept:'.CONTENT'
                    ,over: function(){
                        var $drop = $(this);
                    
                        $('.UI-GRID-sortable-placeholder').fadeOut(0);
                        $('<div/>').addClass('UI-GRID-sortable-placeholder HELPER-tankDropPlaceHolder').appendTo(this);

                    }
                    ,out: function(){
                        $('.GRID-tank, .COLUMN').find('.UI-GRID-sortable-placeholder').fadeIn(0);
                        $(this).find('.HELPER-tankDropPlaceHolder').remove(); 
                    }
                    ,drop: function(event, ui) { 
                        
                        var $drop = $(this), $clone = ui.draggable.clone(true,true).css('display','block');

                        $(this).find('.HELPER-tankDropPlaceHolder').remove(); 
                        ui.draggable.remove();

                        $drop.append($clone);  
                        $drop.find('.ui-sortable-disabled').remove();
                        self.createNewContent().appendTo($drop);
                        
                        $drop.droppable('destroy');

                    }

                });
           }
          
           ,ui:function(){  return{  element: this.element  }; }
           
            
    });
    
    
})(jQuery);

(function($){
    $.widget("gadget.dev_gadgetAddColumn", {
       
       options:{
           position:{ 
               my:'left bottom' 
              ,at:'left top' 
              ,offset:'0 0'
              ,collision:'none none'
           }
        }
        ,_create: function(){}
        ,_init: function(){ 
            
            var self = this, o = self.options, w = self.element.width(), button;
            
            ////////////////////////
            // ADD OF TO POSITION //
            ////////////////////////
                
                o.position.of = self.element;
                
            ////////////////
            // ADD BUTTON //
            //////////////// 

                self.button = $('<a class="BUTTON-addColumn">Add Column<span class="STICKER-addColumn ICON-add-maxi">Icon Add</span></a>')
                              .appendTo('body')
                              .width(w-20)
                              .position(o.position)
                              .bind({
                                  
                                  'mouseleave.addTop': function(){ self.hide(self.button, 500);  self._trigger( 'onHide', null, self.ui() );}
                                 ,'mouseenter.addTop': function(){ self.show(self.button);  self._trigger( 'onShow', null, self.ui() );}
                                 ,'click.addTop': function(){ self._trigger( 'action', null, self.ui() );}
                               
                               });

            ////////////////////////////////
            // ADD MOUSEEVENTS TO COLUMNS //
            ////////////////////////////////                    

                self.element.bind({

                    'mouseenter.addTop': function(){ self.show(500); }
                   ,'leaveLeft.addTop': function(){ self.hide(700); }
                   ,'leaveRight.addTop leaveBottom.addTop': function(){ self.hide(self.button); }
                 
                });
           }
           ,destroy: function(){
               this.button.remove();
               this.element.unbind('.addTop');
               $.Widget.prototype.destroy.apply(this);
           }
           ,_setOption: function( key, value ) {
               this.options[ key ] = value;
           }
           ,show: function(tempo)
           {
              var self = this,  timer = tempo || 0,  o = this.options;
                
                  self.button
                      .css({'display':'block'})
                      .position(o.position)
                       .clearQueue()
                      .stop()
                     
                      .delay(timer)
                      .animate({ opacity:10 },{ duration:300 });   
          }
          ,hide: function(tempo)
          {
              var self = this, timer = tempo || 0;
                 
                  self.button
                      .clearQueue()
                      .stop() 
                      .delay(timer)
                      .animate({ opacity:0 },{ duration:300, complete: function() { $(this).css('display','none'); }});
          }
          ,ui: function(){ return{  element: this.element }; }
          
            
    });
    
    
})(jQuery);
