DELIMITER $$
  DROP PROCEDURE IF EXISTS `gradety_master`.`sript_update_file`$$
  CREATE DEFINER=`root`@`localhost` PROCEDURE `sript_update_file`( 
    IN _projectid varchar( 12 )
  , IN _fileid varchar( 255 )
  , IN _filenombre varchar( 255 )
  , IN _suffix varchar( 12 )
  , IN _mimetype varchar( 12 ) 
  , IN _addedby varchar( 255 )
  , IN _usedin varchar( 255 )
  , IN _usageAs varchar( 12 )
  )
  BEGIN
    UPDATE gradety_a0b0c0.files SET filenombre = _filenombre, mimetype = _mimetype, suffix = _suffix, addedby = _addedby, usedin = _usedin, usageAs = _usageAs, updated = now() WHERE fileid = _fileid; 
    SELECT _fileid as fileId;
 END$$
DELIMITER ;