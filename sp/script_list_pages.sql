DELIMITER $$
  DROP PROCEDURE IF EXISTS `gradety_master`.`script_list_pages`$$
  CREATE DEFINER=`root`@`localhost` PROCEDURE `script_list_pages`(
   IN _projectid varchar( 12 )  
  )
  BEGIN
    ######################
    # INGOING PARAMETERS #
    ######################
    SET @projectid := _projectid;
    
    ######################
    # INTERNAL VARIABLES #
    ######################
    SET @namespace := 'gradety_';
    SET @stm := '';
    
    ############################
    # BUILD DATABASE-INJECTION #
    ############################
    SET @dbi := concat( @namespace, @projectid );
    SET @stm := concat( 'SELECT pageid, pagename, previd, parentid, urlname, tpl FROM ', @dbi, '.pages order by pagename' );
    PREPARE STM FROM @stm;
    EXECUTE STM;    
    DEALLOCATE PREPARE STM;

  END$$
DELIMITER ;