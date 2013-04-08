DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_copy_design`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `script_copy_design`(
   IN pid varchar(12),
   IN designid varchar(12)
)
BEGIN
    # ingoing parameters
    set @pid:=pid;
    set @designid:=designid;

    # internal variables
    set @namespace:='gradety_';
    set @stm := '';

    # build database-injection
    set @dbi:=concat(@namespace,@pid);

    IF (length(@designid)>0) THEN

      set @newident := '';
      call script_gen_ident('design',@pid,@newident);

      # create a new design with newident
      set @stm:= concat(
      'insert into ',@dbi,'.designs (designid,bifork,created_at,updated_at,designname)
       select @newident,replace(bifork,designid,@newident),now(),now(),concat("copie of ",designname)
       from ',@dbi,'.designs where designid=@designid'
      );

      PREPARE STM FROM @stm;
      EXECUTE STM;

      set @stm:= concat('select designid,designname from ',@dbi,'.designs where designid=@newident');

      PREPARE STM FROM @stm;
      EXECUTE STM;

      DEALLOCATE PREPARE STM;

    ELSE

      select concat('design not copied, ',@designid) as design_execcode;

    END IF;


END$$
DELIMITER ;