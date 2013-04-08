DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_update_page`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `script_update_page`(
    IN _projectid varchar( 12 )
  , IN _pageid varchar( 36 )
  , IN _parentid varchar( 36 )
  , IN _previd varchar( 36 )
  , IN _designid varchar( 12 )
  , IN _pagename varchar( 12 )
  , IN _urlname varchar( 12 )
  , IN _notinmenu varchar( 1 )
  , IN _visible varchar( 1 )
  , IN _pagetype varchar( 12 )
  , IN _tpl longtext
  , IN _ownertable varchar( 12 )
  , IN _languagekey varchar( 3 )
  , IN _landingpage varchar( 1 )
  )
BEGIN
    -- --------------------
    --  CREATE VARIABLES -- 
    -- --------------------
   	DECLARE to_update longtext DEFAULT '';
 	  DECLARE name_space varchar( 100 ) DEFAULT concat('gradety_', _projectid, '.pages' );
    
    -- ----------------------------------
    -- DEAL WITH UNKNOWN PREVIOUS PAGE --
    -- ----------------------------------------------
    -- If _prev is 'last' page will be             --
    -- added after the last page on the same level --  
    -- ----------------------------------------------    
    IF ( _previd = 'unknown' ) THEN CALL script_find_last_page( _projectid, _parentid, _previd );
    END IF;
  	
  	-- --------------------
  	-- ASK IF PAGE EXIST --
  	-- --------------------
  	SET @exist = '';
	  SET @askExist = concat( 'SELECT pageid INTO @exist FROM ', name_space ,' WHERE pageid=', quote( _pageid )  );    
    PREPARE askExist FROM @askExist;
    EXECUTE askExist;
		
    -- ---------------------------
    -- REMOVE IF IT MEANT TO BE --
    -- ---------------------------
	 	IF ( _pagetype = 'removed' ) THEN   
	 	  SET @return = '';
	 	  CALL script_delete_page( _projectid, _pageid, @return );
	 	  SELECT 'removed' AS pageWas, @return AS id; -- > return
	  
	  -- ---------------------
	  -- IF EXIST UPDATE IT -- 
	  -- ---------------------
	  ELSEIF ( @exist != '' ) THEN 
		  IF ( _parentid != 'x' ) THEN SET to_update = concat( to_update , ' parentid=' , quote( _parentid ) , ',' );
		  END IF;
		
		  IF ( _previd != 'x' ) THEN SET to_update = concat( to_update , '  previd=' , quote(  _previd ) , ',' );
	    END IF;
		
	  	IF ( _designid != 'x' ) THEN SET to_update = concat( to_update , '  designid= ' , quote( _designid ) , ',' );
		  END IF;
		
		  IF ( _pagename != 'x' ) THEN SET to_update = concat( to_update , '  pagename=' , quote( _pagename ) , ',' );
		  END IF;
		
		  IF ( _urlname != 'x' ) THEN SET to_update = concat( to_update , ' urlname=' , quote( _urlname ) , ',' );
		  END IF;
		
		  IF ( _notinmenu  != 'x' ) THEN SET to_update = concat( to_update, ' notinmenu=' , _notinmenu  , ',' );
		  END IF;
		
		  IF ( _visible != 'x' ) THEN SET to_update = concat( to_update , ' visible=' ,  _visible  , ',' );
		  END IF;
		
		  IF ( _pagetype != 'x' ) THEN SET to_update = concat( to_update , ' pagetype=' , quote( _pagetype ), ','  );
		  END IF;
		
		  IF ( _tpl != 'x' ) THEN SET to_update = concat( to_update , '  tpl=' , quote( _tpl ) , ',' );
		  END IF;
		
		  IF ( _ownertable != 'x' ) THEN SET to_update = concat( to_update , '  ownertable=' , quote( _ownertable ) , ',' );
		  END IF;
		
		  IF ( _languagekey != 'x' ) THEN SET to_update = concat( to_update , '  languagekey=' , quote( _languagekey ) , ',' );
		  END IF;
		
		  IF ( _landingpage != 'x' ) THEN SET to_update = concat( to_update , '  landingpage=' , _landingpage  , ',' );
		  END IF;
				
		  SET to_update = concat( 'UPDATE gradety_', _projectid , '.pages SET', TRIM( TRAILING ',' FROM to_update ), ' WHERE pageid=', quote( _pageid ) );
		  SET @makeUpdate := to_update;    
    	  PREPARE makeUpdate FROM @makeUpdate;
    	  EXECUTE makeUpdate;
    
      SELECT 'updated' AS  pageWas, _pageid AS id; -- > return
	
	  -- -------------------------
	  -- ELSE CREATE A NEW PAGE --
	  -- -------------------------
	  ELSE 
		  CALL gradety_master.script_new_page( 
			  _projectid
			, _pageid
			, _parentid
			, _previd
			, _designid
			, _pagename
			, _urlname
			, _notinmenu
			, _visible
			, _pagetype
			, _ownertable
			, _languagekey
			, _landingpage 
		  );
		
		SELECT 'added' AS  pageWas, _pageid AS id; -- > return
	  END IF;
  END $$
DELIMITER ;