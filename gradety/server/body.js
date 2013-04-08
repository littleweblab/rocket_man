module.exports = function body () {
  ( body$css )
  ( body$mysql )
  ( listen, 0xFAB )//PORT 4011
    ( route, /^\/static/ )
      ( fs )
        ( dir )
         ( head.url.pathname )
      ()//fs 
    ()//route
    // BLOB 
    ( route,  /^\/blob/ )
      ( method, 'GET' )
        ( addContentLength )
          ( postGet , function ( f ) { 
              f.ties = sqlties;
              sqlios.blob( f );
              return 
          })
      ()//method
    ()//route
    ( body$ajax )
    //( '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' )
    ( HTML, { xmlns:'http://www.w3.org/1999/xhtml', 'xml:lang':'de',  lang:'de' } )
      ( body$head )
      ( BODY )
        ( DIV, { class: 'UI' } )
          ( DIV, { class: 'GRID-panelMenu' } )
            ( DIV, { class: 'CONTAINER-menubar' } )
              ( MENU, { class: 'FUNCTION-menubar' } )()
            ()//div
          ()//div
          //TOOLBAR
          ( DIV, { class: 'GRID-panelToolbar' } )
            ( DIV, { class: 'CONTAINER-toolbar' } )()
          ()//div
          //HELP 
          ( DIV, { class: 'GRID-panelHelp' } )
            ( DIV, { class: 'UI-CONTAINER-option STYLE-panelShadow' } )()
          ()//div
          //EDIT                
          ( DIV, { class:'GRID-panelEdit' } )
            //DESIGN
            ( body$design )
            //PAGES 
           
            ( route, /^\/pages/ )
              
              ( DIV, { class: 'GRID-panelSetup' } )
                ( DIV, { class: 'UI-CONTAINER-option' } )()
              ()//div
              ( DIV, { class: 'GRID-panelStage' } )
                ( DIV, { class: 'STAGE', id: 'STAGE'} )
                  ( DIV, { class: 'PAGE' } )
                    ( DIV, { class: 'CONTAINER-pagePageContent' } )
                      ( H1 )( 'New page' )()
                      ( H2 )( 'This page has no design' )( BR )( 'please choose one:' )()  
                    ()//div
                  ()//div
                ()//div
              ()//div
              ( DIV, { class: 'GRID-panelBrowse' } )
                ( DIV, { class: 'CONTAINER-browse UI-CONTAINER-panel' } )()//div
              ()//div
            ()//route
            //PEOPLE 
            ( route, /^\/people/ )
              ( DIV, { class: 'GRID-panelSetup' } )
                ( DIV, { class: 'UI-CONTAINER-option' } )()//div
              ()//div
              ( DIV, { class: 'GRID-panelStage' } )
                ( DIV, { class: 'STAGE' } )
                  ( DIV, { class: 'PAGE' } )()//div
                ()//div
              ()//div
            ()//route
            //FILES 
            ( body$files )
          ()//div 
          //MODESWITCH  
          ( body$modeswitch ) 
        ()//div
      ()//body
    ()//html
  ();//node$listen    
};//END BODY
  
  
