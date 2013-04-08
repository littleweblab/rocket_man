DELIMITER $$
  DROP PROCEDURE IF EXISTS `gradety_master`.`script_find_last_page`$$
  CREATE DEFINER=`root`@`localhost` PROCEDURE `script_find_last_page`( 
    IN _projectid varchar( 12 )
  , IN _parentid varchar( 12 ) 
  , OUT _back varchar( 12 )
  )
  BEGIN
    DECLARE __pageId varchar( 12 ) DEFAULT '0';
    DECLARE __nextPageId varchar( 12 );
    DECLARE __last varchar( 12 );
    DECLARE __done varchar( 12 );
    
    -- --------------------------------------------------------------------
    -- LOOP THROUGH PAGES ON THE SAME LEVEL UNTIL THE LAST PAGE IS FOUND --
    -- --------------------------------------------------------------------
    REPEAT
      SELECT pageid INTO __nextPageId FROM  gradety_a0b0c0.pages WHERE previd = __pageId AND parentid = _parentid; -- Find next page with __pageID as prevpage
      IF __nextPageId IS NULL THEN SET __nextPageId = '0'; -- If no page under the parent exist set 0
      END IF;
      
      SET __pageId = __nextPageId; 
      -- SELECT __pageId;
       
      IF __nextPageId = __last THEN SET __done = 'done'; -- If __last has repeated say UNTIL to stop 
      ELSE SET __last = __nextPageId; -- Else update __last with the next pageid to look for  
      END IF; 
      
      UNTIL __done = 'done'	
    END REPEAT;
    -- END LOOP
    SET _back = __pageId;
  END$$
DELIMITER ;