DELIMITER $$
  DROP PROCEDURE IF EXISTS `gradety_master`.`script_file_to_blob`$$
  CREATE DEFINER=`root`@`localhost` PROCEDURE `script_file_to_blob`( 
    IN _projectid varchar( 12 )
  , IN _fileid varchar( 255 )
  , IN _path varchar( 255 )
  , IN _size int( 11 )
  )
  BEGIN
     UPDATE gradety_a0b0c0.files SET filedata = LOAD_FILE( _path ), filesize = _size  WHERE fileid = _fileid; 
     SELECT _fileid as fileId ;
 END$$
DELIMITER ;