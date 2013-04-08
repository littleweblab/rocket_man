DELIMITER $$
  DROP PROCEDURE IF EXISTS `gradety_master`.`script_new_file`$$
  CREATE DEFINER=`root`@`localhost` PROCEDURE `script_new_file`( 
    IN _projectid varchar( 12 )
  , IN _filenombre varchar( 255 )
  , IN _suffix varchar( 12 )
  , IN _mimetype varchar( 12 ) 
  , IN _addedby varchar( 255 )
  , IN _usedin varchar( 255 )
  , IN _usageAs varchar( 12 )
  )
  BEGIN
    SET @genid = '';
      CALL script_gen_ident( 'page', _projectid, @genid );
      INSERT INTO gradety_a0b0c0.files ( fileid, filenombre, mimetype, suffix, addedby, usedin, usageAs, created, updated ) VALUES( @genid, _filenombre, _mimetype, _suffix, _addedby, _usedin, _usageAs, now(), now() );  
      SELECT @genid AS fileId;
      END$$
  END IF;

DELIMITER ;