module.exports = function body$designwizzard () {
  ( route, /^\/wizzard/ )
    ( DIV, { class: 'GRID-panelStage' } )
      //STAGE
      ( DIV, { class: 'STAGE' } )
        //BREADCRUMP
        ( DIV, { class: 'CONTAINER-breadcrump' } )
          ( MENU, { class: 'FUNCTION-breadcrump' } )
            ( LI, { class: 'ITEM-breadcrump' } )
              ( SPAN, { class:'ITEM-breadcrump-intro' } )( 'Create a new page design:' )()
            ()//li
          ()//menu 
        ()//div
        //ENTER NAME
        ( DIV, { class: 'CONTAINER-stageWizard-name' } )
          ( H2, { class: 'STYLE-stageMarginTop-97 STYLE-stageWizardDimensionHead' } )
            ( SPAN )( 'Name: ' )()
            ( 'Enter name of the new design' )
          ()//h2

          ( FORM, { class: 'FORM STYLE-stageWizardForm' } )
            ( INPUT, { class: 'STYLE-stageWizardInput', type: 'text', name: 'name', value: 'Insert name here' } ) 
            ( INPUT, { class: 'STYLE-stageWizardButton', type: 'button', name: 'next', value: 'Next' } )
          ()//form             
        ()//div  
        //SELECT POSITION   
        ( DIV, { class: 'CONTAINER-stageWizard-position' } )
          ( H2, { class: 'STYLE-stageMarginTop-97 STYLE-stageWizardDimensionHead' } )
            ( SPAN )( 'Position: ' )()
            ( 'Select a position for your' )
            ( BR )
            ( 'new page design.' )
          ()//h2
          ( DIV, { class: 'GRID-stage-950' } )
            ( DIV, { class: 'GRID-stage-108' } )
              ( DIV, { class: 'UI-CONTAINER-choose' } )
                ( A, { class: 'UI-BUTTON-choose STYLE-stageChooseForWizard', name: 'left' } )( 'Left' )()
              ()//div
            ()//div
            ( DIV, { class: 'GRID-stage-734' } )
              ( DIV, { class: 'UI-CONTAINER-choose' } )
                (A, { class: 'UI-BUTTON-choose STYLE-stageChooseForWizard', name: 'center' } )( 'Center' )()
              ()//div
              ( DIV, { class: 'UI-CONTAINER-choose' } )
                ( A, { class: 'UI-BUTTON-choose STYLE-stageChooseForWizard STYLE-stageChooseForWizardStretch', name: 'stretch' } )
                  ( 'Stretch page to the maximal window width' )
                ()//a
                ( DIV, { class: 'STYLE-stageChooseForWizardStretchArrowLeft ICON-blackArrowLeft-maxi' } )()
                ( DIV, { class: 'STYLE-stageChooseForWizardStretchArrowRight ICON-blackArrowRight-maxi' } )()
              ()//div
            ()//div
            ( DIV, { class:'GRID-stage-108'})
              ( DIV, { class:'UI-CONTAINER-choose'})
                ( A, { class:'UI-BUTTON-choose STYLE-stageChooseForWizard',  name: 'right' })('Right')()//END UI-BUTTON-CHOOSE
              ()//div
            ()//div
          ()//div
        ()//div
        // ENTER DIMENSION 
        ( DIV, { class: 'CONTAINER-stageWizard-dimension' } )
          ( H2, { class: 'STYLE-stageMarginTop-97 STYLE-stageWizardDimensionHead' } )
            ( SPAN )( 'Dimension: ' )()
            ( 'Setup dimensions' )
            ( BR )
            ( 'for your design.' )
          ()//h2
          ( FORM, { class: 'FORM STYLE-stageWizardForm' } )
            ( LABEL, { class: 'FORM-label STYLE-stageWizardLabel' } )( 'Width' )()
            ( INPUT, { class: 'STYLE-stageWizardInput', type: 'text', name: 'width', 'data-special': 'stepper', value: '1024px' } )
            ( LABEL, { class: 'FORM-label STYLE-stageWizardLabel' } )( 'Height' )()
            ( INPUT, { class: 'STYLE-stageWizardInput', type:'text', name:'height', 'data-special':'stepper', value:'728px' } )
            ( INPUT, { class: 'STYLE-stageWizardButton', type:'button', name:'next', value:'Next' } )
          ()//form             
        ()//div
        //CREATE NEW DESIGN 
        ( DIV, { class: 'CONTAINER-stageWizard-create' } )
          ( H1, { class: 'STYLE-stageMarginTop-97' } )( 'Create new Design:' )()
          ( H2, { class: 'STYLE-stageWizardDimensionHead' } )()
          ( FORM, { class: 'FORM STYLE-stageWizardForm' } )
            ( INPUT, { class: 'STYLE-stageWizardButton', type: 'button', name: 'create', value: 'Create design' } )
          ()//form
        ()//div
      ()//div
    ()//div
  ()//route
};//END WIZZARD