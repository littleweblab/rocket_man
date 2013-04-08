(function($){
    
    $.widget("gadget.dev_gadgetFocus", {
           options:{
              mouseEvent: true  
            , size: 'normal'
            , selectable: '.CONTAINER'  
            }
            
           ,_create: function(){ 
              var self = this, o = self.options, size = '<div class="STICKER-focusHighlight-'+o.size+'"></div>';
              $.extend(this,{  marker : {}});
              self.target = this.element;
              self.body = $('body');
              this.marker.nw = $(size);
              this.marker.no = $(size);
              this.marker.sw = $(size);
              this.marker.so = $(size);
              
              self.body.append( self.marker.nw , self.marker.no, self.marker.sw, self.marker.so);
              
              this.marker.nw.fadeOut(0);
              this.marker.no.fadeOut(0);
              this.marker.sw.fadeOut(0);
              this.marker.so.fadeOut(0);
              
              if(self.body.data('gadgetFocus') == undefined)
              {
                 self.body.data('gadgetFocus', $());
              }
              
            
           }
           ,_init: function(){
               var self = this, o = this.options; 
               if(o.disabled == false && o.mouseEvent == true)
               {
                   self.element
                       .data('focused', false)
                       .unbind('click.focus')
                       .bind('click.focus', function(event){
                         
                           event.stopImmediatePropagation();
                           var current =  self.body.data('gadgetFocus');
                         
                           
                           if(current[0] !== self.element[0])
                           {
                               self.target =  $(event.target);
                               self.body.data('gadgetFocus').dev_gadgetFocus('deactivate');
                               if(!self.target.is(o.selectable)) self.target.closest(o.selectable);
                               self.activate(); 
                           }  
                       });
                }
           }
           ,defocus:function(){
              var self = this, o = this.options; 
               self.element
                   .unbind('clickoutside.focus')
                   .bind('clickoutside.focus', function(event){
                       event.stopImmediatePropagation();
                      //var f = IOSC.zeroNodes.doFindNodeByIdent( self.element.attr('id') ).IsFocused;
                       var current =  self.body.data('gadgetFocus');
                    
                       //if(f== true)
                       if(current[0] == self.element[0])
                       {
                           self.target =  $(event.target);
                          
                      
                           if(!self.target.is(o.selectable)) self.target.closest(o.selectable);
                           
                           // IF PREVENTS DEFOCUS OUTSIDE OF THE STAGE
                           if(self.target.isChildOf('.STAGE:not(' + o.selectable + ')') || self.target.is('.STAGE')) self.deactivate();  
                       }
                   });
           }
           ,destroy: function(){
               self = this;
               self.body.data('gadgetFocus', $());
               self.element.unbind('.focus');
               self.marker.nw.remove();
               self.marker.no.remove();
               self.marker.sw.remove();
               self.marker.so.remove();
               
               $.Widget.prototype.destroy.apply(this);
           }
           ,_setOption: function( key, value ) {
               //this.element.unbind('.focus')
               this.options[ key ] = value;
               this._init();
           }
           ,ui:function(){  return{  element: this.element , target: this.target  }; }
           
          , setPosition: function ( showAgain , top , prevsHeight) {

            var self = this
              , selfHeight = self.element.height()
              , parent = self.element.parent()
              , parentHeight = parent.height()
              , containerList = parent.find( '.CONTAINER' ).length
              , elementsOff = ( parentHeight < self.element.outerHeight() && containerList == 1 ) ? parent : self.element
              , scrollBarW = elementsOff.innerWidth() - elementsOff.attr( 'clientWidth' )
              , scrollBarH = elementsOff.innerHeight() - elementsOff.attr( 'clientHeight' );
            
            ////////////////////////////////////////////
            // IF TOP OF CONTAINER IS OUT OF THE VIEW //
            ////////////////////////////////////////////     
            //if ( parent.scrollTop() < top || parent.scrollTop() == 0 || containerList == 1   ) { 
            if ( 
                 ( parent.scrollTop() + parentHeight >= prevsHeight && parent.scrollTop() < prevsHeight )
              || ( parent.scrollTop() == 0 && parent.scrollTop() >= prevsHeight )
            ) { 
              this.marker.nw.css( 'display', 'block' );
              this.marker.no.css( 'display', 'block' );
            } else {
              this.marker.nw.css( 'display', 'none' );
              this.marker.no.css( 'display', 'none' );
            }//END IF/ELSE
            ///////////////////////////////////////////////
            // IF BOTTOM OF CONTAINER IS OUT OF THE VIEW //
            ///////////////////////////////////////////////
            //var test = self.element.position()
            
            if ( 
                ( prevsHeight + selfHeight <= parentHeight + parent.scrollTop() ) 
              && parent.scrollTop() <= prevsHeight + selfHeight
            ){
            //if ( ( top + selfHeight - parent.scrollTop() ) == parentHeight || top + selfHeight <=  parentHeight  ) {  
              this.marker.sw.css( 'display', 'block' );
              this.marker.so.css( 'display', 'block' );
            } else {
              this.marker.sw.css( 'display', 'none' );
              this.marker.so.css( 'display', 'none' );
            }//END IF/ELSE
            //////////////////
            // SET POSITION //
            //////////////////
            self.marker.nw.position({ collision:'none none', of: elementsOff, my: 'left top', at: 'left top', offset: '0 0' });
            self.marker.no.position({ collision:'none none', of: elementsOff, my: 'right top', at: 'right top', offset: '-' + scrollBarW  + ' 0' });
            self.marker.sw.position({ collision:'none none', of: elementsOff, my: 'left bottom', at: 'left bottom', offset: 0 + ' -' +  scrollBarH });
            self.marker.so.position({ collision:'none none', of: elementsOff, my: 'right bottom', at: 'right bottom', offset: '-' + scrollBarW  + ' -' + scrollBarH });
            ////////////////////////////////////////////
            // IF ONLY THE POSITION SHOULD BE UPDATED //
            ////////////////////////////////////////////
            if ( showAgain == 'dontShowAgain' ) {    
              this.marker.nw.css( 'display', 'none' );
              this.marker.no.css( 'display', 'none' );
              this.marker.sw.css( 'display', 'none' );
              this.marker.so.css( 'display', 'none' );
            }//END IF
         }//END SET POSITION
          
           
           ,activate:function(){
               
               var self = this, o = this.options; 
               if(o.disabled == false)
               {   
                   self.show(); 
                   self.body.data('gadgetFocus', self.element);
                   self._trigger( 'activate', null, self.ui());   
                   self.defocus();
                   self.element.data('focused', true);
               } 
           }
 
           
           ,deactivate:function(){
               
               var self = this, o = this.options; 
               if(o.disabled == false)
               {
                   self.hide();
                   self._trigger( 'deactivate', null, self.ui());
                   self.element.unbind('clickoutside.focus');
                   self.element.data('focused', false);
                   self.body.data('gadgetFocus', $());
                   self.body.data('gadgetOnHoldFocus',self.element );
               }
           }
           ,reset: function(){
               var self = this, o = this.options; 
               if(o.disabled == false)
               {
                    
                      self._trigger( 'refresh', null, self.ui());
                      
               }
           }
            
           ,show: function(){
               
               var self = this
                 , o = this.options
                 , pos = self.element.position()
                 , prevsHeight = 0
                 ;
              
              
               self.element.prevAll( '.CONTAINER' ).each(function(){ prevsHeight +=  $( this ).outerHeight() });//Get height of the prev containers
               
                
               if(o.disabled == false)
               {
                  
                   self.setPosition(null, pos.top, prevsHeight);  
                   self.marker.nw.fadeIn(100);
                   self.marker.no.fadeIn(100);
                   self.marker.sw.fadeIn(100);
                   self.marker.so.fadeIn(100);
                   self.element.mutate('size', function(event){
                      self.setPosition(null, pos.top, prevsHeight);
                      self._trigger( 'mutate', null, self.ui());
                   });
                }
           
           }
           ,hide: function(){
               
               var self = this, o = this.options; 
               if(o.disabled == false)
               {
                   self.marker.nw.fadeOut(100);
                   self.marker.no.fadeOut(100);
                   self.marker.sw.fadeOut(100);
                   self.marker.so.fadeOut(100);
                   self.element.unmutate();
               }
        }
            
    });
    
    
})(jQuery);

