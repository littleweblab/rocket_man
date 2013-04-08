module.exports = function body$design () {
  ( route, /^\/design/ )
    // WIZZARD
    ( body$designwizzard )
    //DRAW 
    ( route, /^\/draw/ )
      ( DIV, { class: 'GRID-panelSetup' } )
        ( DIV, { class: 'UI-CONTAINER-option' } )()
      ()//div
      ( DIV, { class: 'GRID-panelStage' } )
        ( DIV, { class: 'STAGE' } )
          ( DIV, { class: 'PAGE' } )()
        ()//div
      ()//div
      ( DIV, { class: 'GRID-panelBrowse' } )
        ( DIV, { class: 'CONTAINER-browse UI-CONTAINER-panel' } )()
      ()//div
    ()//route
    ( DIV, { class: 'GRID-panelStage' } )
      ( DIV, { class: 'STAGE' } )
        //ADD DESIGN BUTTON 
        ( DIV, { class: 'STICKER-stageAddButton' } )
          ( A, { class: 'BUTTON-addFlatMaxi-option STYLE-stageAddFlatMaxi' } )
            ( 'Create a new page design' )
            ( SPAN, { class: 'STICKER-addFlatMaxiIcon ICON-add-maxi-option' } )( 'Icon Add' )()
          ()//a
        ()//div
        //HEADLINE 
        ( DIV, { class: 'CONTAINER-stageWizard' } )
          ( H2, { class: 'STYLE-stageMarginTop-97 STYLE-stageWizardDimensionHead' } )
            ( 'Edit one of your great' )
            ( BR )
            ( 'page designs' )
          ()//h2
        ()//div
        //DESIGN ITEM 
      ()//div
    ()//div
  ()//route
};