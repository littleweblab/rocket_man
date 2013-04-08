DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_copy_design`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `script_copy_design`(
  IN identtype varchar(50),
  IN pid varchar(12),
  OUT result_ident varchar(100)
)
BEGIN

  /*
  * generates an arbitrary ident, based on the maxident
  * of the designs-table
  * input: identype =>  design / page / project
  * output: result_ident => qualified new ident
  */
 
  # ingoing parameters
  set @identtype := identtype;
  set @pid:=pid;

  # internal variables
  set @namespace:='gradety_';
  set @maxident := '00000000';
  set @stm := '';
  set @id_seperator:='_';

  # build database-injection
  set @dbi:=concat(@namespace,@pid);
SELECT identtype;
  # develop the set of query-commands: @stm...
  CASE @identtype
      WHEN 'design' THEN
        BEGIN
          SET @stmmax:=concat('select max(designid) from ',@dbi,'.designs into @maxident');
          SET @stmcheck:=concat('select designid from ',@dbi,'.designs where designid=@newident into @check');
          SET @id_seperator:='_';
        END;
      WHEN 'page' THEN
        BEGIN
          SET @stm:=concat('select max(pageid) from ',@dbi,'.pages into @maxident');
          SET @stmcheck:=concat('select pageid from ',@dbi,'.pages where pageid=@newident into @check');
          SET @id_seperator:='';
        END;
        
WHEN 'file' THEN
BEGIN
  SET @stm:=concat('select max(fileid) from ',@dbi,'.files into @maxident');
  SET @stmcheck:=concat('select fileid from ',@dbi,'.files where fileid=@newident into @check');
  SET @id_seperator:='';
END;

        
      WHEN 'project' THEN
        BEGIN
          SET @stm:=concat('select max(projectid) from ',@namespace,'master.projects into @maxident');
          SET @stmcheck:=concat('select projectid from ',@namespace,'master.projects where projectid=@newident into @check');
          SET @id_seperator:='';
        END;
      ELSE
        BEGIN
        END;
  END CASE;

  #select @identtype,@stm as myquery;
  /* just for example
  PREPARE STM FROM @stmmax;
  EXECUTE STM;
  */

  #set @maxident = IFNULL(@maxident,left(UUID(),8));

  set @ident:=UPPER(replace(convert(UUID() using utf8) collate utf8_unicode_ci ,'-',''));

  #select 'UUID ident ==> ', @ident,length(@ident);

  set @newident := '';
  set @I:=0;
  set @C1:='';
  set @C2:='';
  set @check:='';
  set @ID:='';

  REPEAT
    REPEAT
      set @I:=@I +1;
      set @C1:=mid(@ident,@I,1);
      set @C2:=mid(@ident,@I+8,1);
      set @N :=ASCII(@C1)+ ASCII(@C2)-48;

      #select '@N ==> ',@I,ASCII(@C1),ASCII(@C2), @N, CHAR(@N using utf8) as C;

      IF (@I=1 and @N<=57) THEN
        set @N := @N + 17;
      END IF;
      IF (@N>=58) THEN
        IF (@N<=64) THEN set @N := @N + 7;
        END IF;
      END IF;
      IF (@N>=91) THEN
        set @N := @N -26;
      END IF;
      set @ID := concat(@ID,CHAR(@N using utf8) collate utf8_unicode_ci);

      #select '@N ==> ',@I,ASCII(@C1),ASCII(@C2), @N, CHAR(@N using utf8) as C;

    UNTIL @I>=8 END REPEAT;

    #select 'id ==> ', @ID;

    set @newident:=CONCAT(convert(@ID using utf8) collate utf8_unicode_ci,@id_seperator);

    # remark STM is ::> select designid from designs where designid=@newident into @check;
    PREPARE STM FROM @stmcheck;
    EXECUTE STM;

    #select 'check ==> ', @check, 'newident ==> ', @newident;

  UNTIL @check='' END REPEAT;

  #select 'newident ==> ', @newident;

  DEALLOCATE PREPARE STM;

  select @newident into result_ident;

END$$
DELIMITER ;