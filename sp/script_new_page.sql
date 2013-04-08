DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_new_page`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE  `gradety_master`.`script_new_page`(
  IN pid varchar( 12 ),
  IN pageid varchar( 36 ),
  IN parentid varchar( 36 ),
  IN previd varchar( 36 ),
  IN designid varchar( 12 ),
  IN pagename varchar( 12 ),
  IN urlname varchar( 12 ),
  IN notinmenu tinyint( 1 ),
  IN visible tinyint( 1 ),
  IN pagetype varchar( 12 ),
  #IN tpl longtext,
  IN ownertable varchar( 12 ),
  IN languagekey char( 3 ),
  IN landingpage tinyint( 1 )
)
BEGIN
  /*******************
  ingoing parameters
  ********************/
  SET @pid := pid;
  SET @pageid := pageid;
  SET @parentid := parentid; 
  SET @previd := previd;
  SET @designid := designid;
  SET @pagename := pagename;
  SET @urlname := urlname;
  SET @notinmenu := notinmenu;
  SET @visible := visible;
  SET @pagetype := pagetype;
  #SET @tpl := @tpl;
  SET @ownertable := ownertable;
  SET @languagekey := languagekey;
  SET @landingpage := landingpage;
  /*******************
  internal variables
  *******************/
  set @namespace:='gradety_';
  set @stm := '';
  set @newident := '';
  /*************************
  build database-injection
  **************************/
  set @dbi:=concat(@namespace,@pid);

  #call script_gen_ident('page',@pid,@newident);
  #start transaction;

   /*********************************
    create a new page with newident
   **********************************/

  set @stm:= concat(
    'insert into ',
    @dbi,
    '.pages (
      pageid,
      parentid,
      previd,
      designid,
      pagename,
      urlname,
      notinmenu,
      visible,
      pagetype,
      tpl,
      ownertable,
      languagekey,
      landingpage,
      created_at,
      updated_at 
    )
    values(
     @pageid,
     @parentid,
     @previd,
     @designid,
     @pagename,
     @urlname,
     @notinmenu,
     @visible,
     @pagetype,
     "no tpl",
     @ownertable,
     @languagekey,
     @landingpage,
     now(),
     now()
    )'
  );

  
  PREPARE STM FROM @stm;
  EXECUTE STM;
  DEALLOCATE PREPARE STM;

  commit;

  select @newident as newident;

END $$

DELIMITER ;