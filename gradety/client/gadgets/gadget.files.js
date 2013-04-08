(function($){

    $.widget("gadget.dev_gadgetFiles", {
        options:{
           	changeSorting: function(event, data){ console.log(data.sortCol+", "+data.orderBy); }
			,sortableButtons: {}
			//,one:{ callback:function(event, ui){console.log( ui)}, style:'panel', back: false, items:'li.ITEM-browse'   }
            //,three:{ callback:function(event, ui){console.log( ui)}, style:'option', back: true, items:'li.ITEM-browse'   }     
        }
        ,_create: function(){ 
            var self = this, o = this.options;        
        }
        ,_init: function(){ 
            
            var self = this, o = this.options, eachCounter = 0;

            if(o.disabled == false)
            {
				self._setFileupload($(self.element).find(".STYLE-libraryFileInput"));
            }
        }
        ,destroy: function(){
            var self = this, o = this.options; 
            
			delete o.sortableButtons;

            $.Widget.prototype.destroy.apply(this);
            
        }
        ,_setOption: function( key, value ) {
           
            var self = this, o = this.options, opts ={}; 
            this.options[ key ] = value;
            
            opts[ key ] = value;
                       
        }
        ,remove:function(name){
            var self = this, o = this.options, n = jQuery.inArray(name, self.number ), t;
            delete o.sortableButtons;
            self.number.splice(n, 1);
        }
		
		,_setFileupload: function(uploadInput){
		        var self = this, o = self.options, w = $(document), activate = false, headContent = $(self.element).find(".FUNCTION-libraryHeadGrid");
			
			
				if(self.nicer == undefined)
	             {
					 uploadInput.wrap('<form class="STICKER-libraryUploadForm" action="/library_images" method="POST" enctype="multipart/form-data"></form>')
	                 self.nicer = uploadInput.parent();
	             }
		
				self.nicer.fileUpload({
		                  fieldName: 'libraryFile',
						  namespace: 'libraryUpload',
		                  multipart: true,
		                  withCredentials: false,
		                  
						  onDocumentDragEnter: function(event){ 
							/*vorläufig*/ $('.TABLE table').dev_gadgetTable("showAllHiddenCells");
							console.log(activate);
		                    if(activate == false)
		                    {
		                        headContent.fadeOut(150);
		                        self.nicer
		                            .css({
		                                 'background-image': 'url("../../images/ui/dropzone/ui_bg_conatiner_dropzone.png")'  
		                                ,'background-repeat': 'no-repeat'
		                                ,'background-position': '50% 45%'
		                                ,'padding-top': 0
		                                ,'padding-left': 0
		                                ,'padding-right': 0
		                                ,'padding-bottom': 0
		                                ,'margin-top': 0
		                                ,'margin-left': 0
		                                ,'border': '2px dashed #d0d3d5' 
		                                ,'border-radius': 10
		                                ,'-moz-border-radius': 10
		                                ,'-webkit-border-radius': 10

		                            })
		                            .stop()
		                            .animate({
		                                 'width': self.nicer.parent().width()-30
		                                ,'height': '70px'
										,'left': 10
										,'top': 10
		                                 ,opacity: 1
		                                }
		                                , function(){ 
		                                    activate = true; 
		                                    w.bind('mouseleave.formFile.form mouseenter.formFile.form', function(){
												/*vorläufig*/ $('.TABLE table').dev_gadgetTable("hideAllHiddenCells");
		                                        self.nicer
		                                            .animate({
		                                                 opacity: 0
														,left: 0
														,top: 20
		                                                ,width: 175 
		                                                ,height: 36 }
		                                                ,function(){ 

		                                                    self.nicer
		                                                        .css({
		                                                            'background-image': 'none'  
		                                                            ,'border': 0 
		                                                            ,'padding-top': 6
		                                                            ,'padding-left': 6
		                                                            ,'padding-right': 6
		                                                            ,'padding-bottom': 6
		                                                            ,'margin-top': -6
		                                                            ,'margin-left': -6
		                                                            ,'border-radius': 0
		                                                            ,'-moz-border-radius': 0
		                                                            ,'-webkit-border-radius': 0
		                                                         });


		                                                     w.unbind('.formFile');
		                                                     activate = false;
		                                                     self.nicer.css({'opacity' :1,   overflow : 'hidden'} );
		                                                     headContent.fadeIn(200);
		                                                 }
		                                             );
		                                    });
		                                }
		                            );
		                     }         
		                }
			
						  ,onDragEnter: function(event){ 

		                      if(activate == false)
		                      {     
		                          activate = true;  
		                          self.element.find('.STICKER-dropfile-arrow').effect( 'bounce',function(){  activate = false;} )
		                      }         

		                  }
		                  ,initUpload: function(){}
		                  ,onDrop: function(event)
		                  {
		                      if(column.find('img').length && o.imageLimit == 1){
		                          self._createImage(column);  
		                          self._replaceImage(column); 

		                      }
		                      else if(column.find('img').length && o.imageLimit > 1){

		                         alert('FUTURE'); 

		                      } 
		                      else {

		                          self._createImage(column);  
		                          self._changeToImage(column); 
		                      }
		                  }
		              })


		             if(this.options.disabled == true)
		             {
		               self.hide() 
		             } 
		   }
		
                
        ,ui: function(){ return $.extend(true, {element: self.element},  self.options.sortableButtons) }
        
        
        
        
});


})(jQuery);