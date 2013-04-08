(function($){
    
    $.widget("gadget.dev_gadgetBrackets", {
           options:{
               nwOffset: '3 11'
              ,noOffset: '-4 11'
              ,swOffset: '3 1'
              ,soOffset: '-4 1'
            }
            
           ,_create: function(){ 
              var self = this;
              $.extend(this,{  brackets : {}});
              
              this.brackets.nw = $('<div class="STICKER-cornerMarker-nw"></div>')
              this.brackets.no = $('<div class="STICKER-cornerMarker-no"></div>')
              this.brackets.sw = $('<div class="STICKER-cornerMarker-sw"></div>')
              this.brackets.so = $('<div class="STICKER-cornerMarker-so"></div>')

              $('body').append( self.brackets.nw , self.brackets.no, self.brackets.sw, self.brackets.so);
              
             
              
           }
           ,_init: function(){ 
               
               var _self = this;
               _self.setPosition('dontShowAgain'); 
                 
           }
           ,destroy: function(){
               this.brackets.nw.remove()
               this.brackets.no.remove()
               this.brackets.sw.remove()
               this.brackets.so.remove()
             
               $.Widget.prototype.destroy.apply(this);
           }
           ,_setOption: function( key, value ) {
               this.options[ key ] = value;
               this._init()
                      
           }
            /* 
           ,setPosition: function(showAgain){
               
               var self = this;
               this.brackets.nw.css('display','block');
               this.brackets.no.css('display','block');
               this.brackets.sw.css('display','block');
               this.brackets.so.css('display','block');
               
               self.brackets.nw.position({of:self.element, my:'center center', at:'left top', offset: self.options.nwOffset });
               self.brackets.no.position({of:self.element, my:'center center', at:'right top', offset: self.options.noOffset });
               self.brackets.sw.position({of:self.element, my:'center center', at:'left bottom', offset: self.options.swOffset });
               self.brackets.so.position({of:self.element, my:'center center', at:'right bottom', offset: self.options.soOffset });
               
               if(showAgain =='dontShowAgain')
               {    
                   this.brackets.nw.css('display','none');
                   this.brackets.no.css('display','none');
                   this.brackets.sw.css('display','none');
                   this.brackets.so.css('display','none');
               }
           }*/
            , setPosition: function ( showAgain , top, prevsHeight ) {

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
               
               if ( 
                  ( parent.scrollTop() + parentHeight >= prevsHeight && parent.scrollTop() < prevsHeight )
               || ( parent.scrollTop() == 0 && parent.scrollTop() >= prevsHeight )
               ) {   
                 this.brackets.nw.css( 'display', 'block' );
                 this.brackets.no.css( 'display', 'block' );
               } else {
                 this.brackets.nw.css( 'display', 'none' );
                 this.brackets.no.css( 'display', 'none' );
               }//END IF/ELSE
               ///////////////////////////////////////////////
               // IF BOTTOM OF CONTAINER IS OUT OF THE VIEW //
               ///////////////////////////////////////////////
               if ( 
                  ( prevsHeight + selfHeight <= parentHeight + parent.scrollTop() ) 
                 && parent.scrollTop() <= prevsHeight + selfHeight
               ){  this.brackets.so.css( 'display', 'block' );
               } else {
                 this.brackets.sw.css( 'display', 'none' );
                 this.brackets.so.css( 'display', 'none' );
               }//END IF/ELSE
               //////////////////
               // SET POSITION //
               //////////////////
               self.brackets.nw.position({ collision:'none none', of: elementsOff,  my: 'center center', at: 'left top', offset: '0 11' });
               self.brackets.no.position({ collision:'none none', of: elementsOff,  my:'center center', at: 'right top', offset: '-' + scrollBarW  + ' 11' });
               self.brackets.sw.position({ collision:'none none', of: elementsOff,  my:'center center', at: 'left bottom', offset: 0 + ' -' +  scrollBarH });
               self.brackets.so.position({ collision:'none none', of: elementsOff,  my:'center center', at: 'right bottom', offset: '-' + scrollBarW  + ' -' + scrollBarH });
               ////////////////////////////////////////////
               // IF ONLY THE POSITION SHOULD BE UPDATED //
               ////////////////////////////////////////////
               if ( showAgain == 'dontShowAgain' ) {    
                 this.brackets.nw.css( 'display', 'none' );
                 this.brackets.no.css( 'display', 'none' );
                 this.brackets.sw.css( 'display', 'none' );
                 this.brackets.so.css( 'display', 'none' );
               }//END IF
            }//END SET POSITION
           
            
           ,show: function(){
               
               var self = this
                 , pos = self.element.position()
                 , prevsHeight = 0
                 ;
               
               self.element.prevAll( '.CONTAINER' ).each(function(){ prevsHeight +=  $( this ).outerHeight() });//Get height of the prev containers
                   
               self.setPosition();  
               self.brackets.nw.fadeIn(300)
               self.brackets.no.fadeIn(300)
               self.brackets.sw.fadeIn(300)
               self.brackets.so.fadeIn(300)
               
               self.element.mutate('size', function(event){

                   self.setPosition('null', pos.top,  prevsHeight );
               
               });
           
           }
           ,hide: function(){
               
               var self = this;
               self.setPosition();  
               self.brackets.nw.fadeOut(300)
               self.brackets.no.fadeOut(300)
               self.brackets.sw.fadeOut(300)
               self.brackets.so.fadeOut(300)
               self.element.unmutate();
               
        }
            
    });
    
    
})(jQuery);