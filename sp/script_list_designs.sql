DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_list_designs`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `script_list_designs`(
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

   set @stm:= concat('select designid, designname from ',@dbi,'.designs order by designname');

   #select @stm;

   PREPARE STM FROM @stm;
   EXECUTE STM;   #USING @id;
   DEALLOCATE PREPARE STM;


END$$
DELIMITER ;