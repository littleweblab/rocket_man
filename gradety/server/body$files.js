module.exports = function body$files () {
  ( route, /^\/files/ )
    ( DIV, { class: 'GRID-panelStage' } )
      ( DIV, { class: 'UI-CONTAINER-silver' } )
        //FILES HEAD
        ( DIV, { class: 'CONTAINER-filesHead' } )
          ( DIV, { class: 'FUNCTION-filesHeadGrid' } )
            //UPLOAD BUTTON 
            ( DIV, { class: 'GRID-files20' } )
              ( DIV, { class: 'CONTAINER-uploadNewFile' } )
                ( INPUT, {type: 'file', class:'STYLE-filesDropzone', name: 'files[]', 'data-text': 'Upload a new file' } )
              ()//div
              ( DIV, { class: 'CONTAINER-filesListGridSwitch' } )
                ( MENU, { class: 'FUNCTION-listGridSwitch CONTAINER-listGridSwitch' } )
                  ( LI, { class: 'ITEM-listGridSwitch-selected ITEM-listGridSwitch-first' } )
                    ( A, { class: 'ITEM-listGridSwitch-first STYLE-listGridSwitch-list ITEM-listGridSwitch-selected' } )( 'Liste' )()//A
                  ()//li
                  ( LI, { class: 'ITEM-listGridSwitch-last' } )
                    ( A, { class: 'ITEM-listGridSwitch-last STYLE-listGridSwitch-grid' } )
                      ( 'Grid' )
                    ()//a
                  ()//li
                ()//menu
              ()//div
            ()//div             
            //SOURCE SELECTION 
            ( DIV, { class: 'GRID-files60' } )()//div
            //SEARCH
            ( DIV, { class: 'GRID-files20' } )
              ( DIV, { class: 'CONTAINER-filesSearch STYLE-filesRight' } )
                ( BR )//margin collapse hook
                ( INPUT, { class: 'FORM-search STYLE-filesSearchInput', type: "text" } )
              ()//div
            ()//div
          ()//div
        ()//div 
        //FILES TABLE 
        ( DIV, { class: 'TABLE CONTAINER-filesBody' } )
          ( body$filestable )
        ()           
      ()//div
    ()//div
  ()//route
};//END FFILES