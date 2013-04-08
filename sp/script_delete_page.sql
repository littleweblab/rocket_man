DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_delete_page`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `script_delete_page`(
  IN _projectid varchar( 12 )
, IN _pageid varchar( 12 )
, OUT _return varchar( 12 )
)
BEGIN
  DECLARE __last varchar( 12 );
  DECLARE __done varchar( 12 );
  DECLARE __pageId varchar( 12 ) DEFAULT _pageid;
  DECLARE __nextPageId varchar( 12 );
  DECLARE __wasPrevOfDeleted varchar( 12 );
  DECLARE __parent varchar( 12 ) DEFAULT 'emty';
  

  -- --------------------------------------------------------
  -- UPDATE FOLLOWING PAGE WITH DELETED PAGES PREVID VALUE -- 
  -- --------------------------------------------------------
  SELECT parentid FROM gradety_a0b0c0.pages WHERE pageid = __pageId INTO __parent; 
  SELECT previd FROM gradety_a0b0c0.pages WHERE pageid = __pageId  AND parentid = __parent INTO __wasPrevOfDeleted;
  UPDATE gradety_a0b0c0.pages SET previd = __wasPrevOfDeleted WHERE previd = __pageId;  
  
  -- --------------------------------------------------------
  -- LOOP UNTIL EVERY PAGE BENEATH DELETED PAGE IS FOUND   --
  -- AND MARKED AS TRASH                                   --
  -- -------------------------------------------------------- 
  REPEAT
    UPDATE gradety_a0b0c0.pages SET delete_flag = 1 WHERE pageid = __pageId OR parentid = __pageId; -- Mark as trashed 
    SELECT pageid INTO __nextPageId FROM  gradety_a0b0c0.pages WHERE parentid = __pageId LIMIT 1; -- Find next page with children
    SET __pageId =  __nextPageId;
    
    IF  __nextPageId = __last OR  __nextPageId IS NULL THEN SET __done = 'done'; -- If __last has repeated say UNTIL to stop 
    ELSE SET __last =  __nextPageId; -- Else update __last with the next pageid to look for  
    END IF; 
    
    UNTIL __done = 'done'	
  END REPEAT;
  
  -- -----------------------
  -- REMOVE FLAGGED PAGES -- 
  -- -----------------------
  DELETE FROM gradety_a0b0c0.pages WHERE delete_flag = 1; 
  
  -- ------------------------------------------------------------------------------
  -- RETURN NEXT PAGE OR PREV PAGE. IF BOTH DOESN'T EXIST IT RETURNS PARENT PAGE --
  -- ------------------------------------------------------------------------------
  SELECT pageid FROM gradety_a0b0c0.pages WHERE previd = __wasPrevOfDeleted AND parentid = __parent INTO _return; -- get next pages id
  IF _return = '' OR  _return IS NULL THEN  SET _return = __wasPrevOfDeleted; -- if next doesn't exist get previous page
  END IF;
  IF _return = '' OR  _return IS NULL OR  _return = '0' THEN SET _return = __parent; -- If prev- and nextpage doesnt exit take parentpage 
  END IF;
  
END$$

DELIMITER ;