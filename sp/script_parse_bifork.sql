DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_parse_bifork`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `script_parse_bifork`(
IN pid varchar(12),
IN did varchar(12),
IN listtype varchar(20),
IN clear boolean
)
BEGIN
   declare pos int default 1;


   /****************************
    ingoing parameters
    listtype : container | image
   ****************************/
   set @pid:=pid;
   set @did:=did;
   set @listtype:=listtype;
   set @clear:=clear;

   /*******************
    internal variables
   *******************/
   set @namespace:='gradety_';
   set @stm := '';
   set @bif:='';
   set @s1:='';
   set @b='';

   IF @clear THEN
   drop temporary table if exists tmp_bifork;
     create temporary table tmp_bifork
     (
      designid varchar(12) collate utf8_unicode_ci NOT NULL,
      ident varchar(100) collate utf8_unicode_ci NOT NULL,
      property varchar(100) collate utf8_unicode_ci NULL,
      content varchar(200) collate utf8_unicode_ci NULL,
      PRIMARY KEY  (designid,ident)
   );
   END IF;

   /*************************
    build database-injection
   **************************/
   set @dbi:=concat(@namespace,@pid);

   /*************************
    select the bifork-string
   **************************/
   set @stm:= concat('select bifork from ',@dbi,'.designs where designid= ? into @bif');

   #select @stm;

   PREPARE STM FROM @stm;
   EXECUTE STM USING @did;
   DEALLOCATE PREPARE STM;

   set @p:=1;
   set @count:=1;
   set @i:=0;

   /*************************
    parse through the bifork
    look for part --> tree
   **************************/
   set @p:=locate('"datatype":"tree":[',@bif,@count);
   set @count:=@p+19;

   CASE @listtype
   WHEN 'container' THEN
     BEGIN
       REPEAT
         set @i:=@i+1;
         set @p:=locate('"datatype":"container"',@bif,@count);
         #select @p;

         IF @p>0 THEN
            set @pb:=locate('"ident":"',@bif,@p+21);
            set @pe:=locate('",',@bif,@pb+9);
            set @s1:= substr(@bif,@pb,@pe-@pb+1);
            #select @p,@pb,@pe,@s1;

            insert into tmp_bifork (designid,ident,property,content)
            values(did,replace(substring_index(@s1,':',-1),'"',''),'','');

         END IF;

         set @count:=@pe;

       UNTIL @p=0 END REPEAT;

     END; # <-container

     WHEN 'image' THEN
     BEGIN
       REPEAT
         set @i:=@i+1;
         set @p:=locate('"datatype":"container"',@bif,@count);
         #select @p;

         IF @p>0 THEN
            set @pb:=locate('"ident":"',@bif,@p+21);
            set @pe:=locate('",',@bif,@pb+9);
            set @s1:= substr(@bif,@pb,@pe-@pb+1);
            #select 'ident',@p,@pb,@pe,@s1;

            set @pb:=locate('<img src=',@bif,@pb);
            #select @pb as img;
            IF @pb>0 THEN
              set @pe:=locate('"',@bif,@pb+1);
              set @pe:=locate('"',@bif,@pe+1);
              set @s2:= substr(@bif,@pb,@pe-@pb+1);
              set @s2:= replace(@s2,'\\','');
              set @s2:= replace(@s2,'u000du000a','');
              set @s3:= substring_index(@s2,'=',-1);
              set @s3:= replace(@s3,'"','');
              #select 'image',@p,@pb,@pe,@s2,@s3;

              insert into tmp_bifork (designid,ident,property,content)
              values(did,replace(substring_index(@s1,':',-1),'"',''),@s3,substring_index(@s3,'/',-1));

            END IF;
         END IF;

         set @count:=@pe;

       UNTIL @p=0 END REPEAT;

     END; # <-image
     ELSE
     BEGIN
     END;
   END CASE;




  #select * from tmp_bifork;

  #select @bif1 as BIFORKTEXT;

END$$
DELIMITER ;