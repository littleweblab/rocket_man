DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_list_files`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `script_list_files`(
   IN pid varchar(12)
)
BEGIN
   /*******************
    ingoing parameters
   ********************/
   set @pid:=pid;

   /*******************
    internal variables
   *******************/
   set @namespace:='gradety_';
   set @stm := '';

   /*************************
    build database-injection
   **************************/
   set @dbi:=concat(@namespace,@pid);

   set @stm:= concat('
     select item_id, item_name, updated_at, mime_type, added_by, source, used_in from ',@dbi,'.library order by item_name, updated_at
   ');

   #select @stm;

   PREPARE STM FROM @stm;
   EXECUTE STM;   #USING @id;
   DEALLOCATE PREPARE STM;


END$$
DELIMITER ;