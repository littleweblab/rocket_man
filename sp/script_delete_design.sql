DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_delete_design`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `script_delete_design`(
   IN pid varchar(12),
   IN designid varchar(12)
)
BEGIN
   /*******************
    ingoing parameters
   ********************/
   set @pid:=pid;
   set @designid:= designid;

   /*******************
    internal variables
   *******************/
   set @namespace:='gradety_';
   set @stm := '';

   /*************************
    build database-injection
   **************************/
   set @dbi:=concat(@namespace,@pid);

   IF (length(@designid)>0) THEN

      set @stm:= concat('delete from ',@dbi,'.designs where designid=?');

      #select @stm;

      PREPARE STM FROM @stm;
      EXECUTE STM USING @designid;
      DEALLOCATE PREPARE STM;

      select concat('design deleted ',@designid) as design_execcode;

   ELSE

      select concat('design not deleted, ',@designid) as design_execcode;

   END IF;


END$$
DELIMITER ;