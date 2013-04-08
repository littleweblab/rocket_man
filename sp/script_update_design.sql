DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_update_design`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `script_update_design`(
   IN pid varchar(12)
   , IN designid varchar(12)
   , IN bifork longtext
)
BEGIN
   #declare mybif longtext;

   /*******************
    ingoing parameters
   ********************/
   set @pid:=pid;
   set @designid:= designid;
   set @mybif:=quote(bifork);

   #set @mybif:=bifork;
   #select @mybif;

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

      IF bifork='test' THEN
        set @stm:= concat('UPDATE ',@dbi,'.designs SET updated_at=now() where designid=?');
      ELSE
        set @stm:= concat('UPDATE ',@dbi,'.designs SET bifork=', quote(bifork) , ' where designid=?');
      END IF;

      #select @stm;

      PREPARE STM FROM @stm;
      EXECUTE STM USING @designid;
      DEALLOCATE PREPARE STM;

      select concat('design updated ',@designid) as execcode;

      call script_parse_bifork(@pid,@did,'image',true);
      select * from tmp_bifork;

   ELSE

      select concat('design not updated, ',@designid) as execcode;

   END IF;


END$$
DELIMITER ;