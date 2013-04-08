DELIMITER $$
  DROP PROCEDURE IF EXISTS `gradety_master`.`script_delete_file`$$
  CREATE DEFINER=`root`@`localhost` PROCEDURE `script_delete_file`( 
    IN _projectid varchar( 12 )
  , IN _fileid varchar( 255 )
  )
  BEGIN
     DELETE FROM gradety_a0b0c0.files where fileid= _fileid;
     SELECT _fileid AS removedFile;  
 END$$
DELIMITER ;