(function($){
    
    $.widget("gadget.dev_gadgetPatterns", {
           options:{
               
                selection: function(event,ui){ }
               ,createNewItem: function(event,ui){ alert('new Item')}
               ,createNewPattern: function(event,ui){ alert('new Pattern')}
               ,draggable: true
               ,droppable: true
               ,draggableOpts: {
                   zIndex: 10050
                   ,revert: true
                   ,revertDuration: 100
                   ,opacity: 0.7
                   ,scroll: false
                   ,containment: 'body'
               }
               ,droppableOpts:{
                   
                    accept: 'li.ITEM-patterns'
                   ,activeClass: 'CONTAINER-dropzone-active'
                   ,hoverClass: 'CONTAINER-dropzone-hover'
                   ,drop: function(event, ui){ 
                        var pattern =  $(this).find('strong').text()
                        $('.CONTAINER-patterns').dev_gadgetPatterns('createNewItem', ui.draggable, pattern );
                        ui.draggable.remove();
                      
                   }
               }
           }
            
           ,_create: function(){ 
           
              var self = this;
              
              self.items = self.element.find('li.ITEM-patterns');
              self.patterns = self.element.find('li.ITEM-patterns-dropzone'); 
              self.all = self.items.add(self.patterns);
              
              self.addNewPattern = self.element.find('.BUTTON-AddAsText');
              self.addNewItem = self.element.find('.BUTTON-addFlatMaxi-option');
              
           }
           
           ,_init: function(){ 
              
              var self = this, o = self.options;
              
              self._selectItem(self.items.first() )
              self._setEvents();
              //self._loop(self.items, '_createDrag' );
              self._loop(self.patterns, '_createDrop');
            
            
           }
           ,destroy: function(){
             
              $.Widget.prototype.destroy.apply(this);
           }
           
           ,_setOption: function( key, value ) {
               
              this.options[ key ] = value;
           }
           
           ,_loop: function($toLoop, action, options){
               var self = this;
               $toLoop.each(function(){ self[action]($(this), options)});
           }
           
           ,_selectItem: function(toSelect){
               var self = this;
                    
               if( self.selected) self._unSelectItem(self.selected)
               
               self.selected = toSelect
          
               if(toSelect.is('li.ITEM-patterns-dropzone'))
               {
                   toSelect.find('.CONTAINER-dropzone').addClass('CONTAINER-dropzone-selected')
               }
               else if('li.ITEM-patterns')
               {
                   toSelect.find('a.ITEM-patterns').addClass('ITEM-patterns-selected')
                   self._createDrag(toSelect);
               }
                  
               self._trigger( 'selection', null, self.ui() );    
           }
           ,_unSelectItem: function(toSelect){
               var self = this;
                if(toSelect.is('li.ITEM-patterns-dropzone'))
                {
                    toSelect.find('.CONTAINER-dropzone').removeClass('CONTAINER-dropzone-selected')
                }
                else if('li.ITEM-patterns')
                {
                    toSelect.find('a.ITEM-patterns').removeClass('ITEM-patterns-selected')
                    self._removeDrag(toSelect);
                }
                   
           }
           
           ,_setEvents: function(){
               var self = this, o = self.options;
               if(o.disabled == false)
               {
                   var self = this;
                   self.element.delegate('li.ITEM-patterns ,li.ITEM-patterns-dropzone', 'click.SelectClick.patterns', function(){ self._selectItem($(this)) });
                   self.addNewPattern.bind('click.addNewPattern.pattern', function(){ self.createNewPattern() });
                   self.addNewItem.bind('click.addNewItemr.pattern', function(){ self.createNewItem(); });
               }
           }
           ,_removeEvents: function(){
                
                var self = this;
                self.element.undelegate('li.ITEM-patterns, li.ITEM-patterns-dropzone');
                self.addNewPattern.unbind('click.addNewPattern.pattern');
                self.addNewItem.unbind('click.addNewItemr.pattern');
           }
           
          
           ,createNewItem: function(newItem, pattern){
               
               var self = this;
               self._trigger( 'createNewItem', null, { item: newItem, pattern: pattern } );   
               
           }
           
           ,createNewPattern: function(pattern){
               
               var self = this
               self._trigger( 'createNewPattern', null, { pattern: pattern } );   
           }
           
           ,_createDrop: function(toDrop){
               var self = this, o = this.options;
               
               if(o.disabled == false && o.droppable == true)
               {
                  var self = this;
                  toDrop.find('.CONTAINER-dropzone').droppable(o.droppableOpts)
               }  
                 
           }
           ,_removeDrag: function(drag){ drag.draggable('destroy'); }
           ,_createDrag: function(toDrag){
               var self = this, o = this.options;
               if(o.disabled == false && o.draggable == true)
               {
                  var self = this;
                  toDrag.draggable(o.draggableOpts);
                      
                      
                 
               }
           }
           ,ui: function(){ return{ selected: this.selected, funtion: this.element.find('.FUNCTION-patterns')  } }
           
          


            
    });
    
    
})(jQuery);