DELIMITER $$
DROP PROCEDURE IF EXISTS `gradety_master`.`script_new_design`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `script_new_design`(
   IN projectid varchar(12),
   IN designname varchar(100),
   IN designposition varchar(10),
   IN designmarginleft varchar(10),
   IN designmarginright varchar(10),
   IN designwidth varchar(10),
   IN designheigth varchar(10)
)
BEGIN
  /*******************
   ingoing parameters
  ********************/
  set @projectid := projectid;
  set @designname:=designname;
  set @designposition:=designposition;
  set @designmarginleft:= designmarginleft;
  set @designmarginright:= designmarginright;
  set @designwidth:=designwidth;
  set @designheigth:=designheigth;

  /*******************
   internal variables
  *******************/
  set @namespace:='gradety_';
  set @stm := '';
  set @newident := 'AAAA003_';

  /*************************
   build database-injection
  **************************/
  set @dbi:=concat(@namespace,@pid);

  call script_gen_ident('design',@projectid,@newident);
  #set @newident:=concat(@newident collate utf8_unicode_ci);

  #start transaction;

  /********************************
  create a new design with newident
  ********************************/

  set @stm:= concat('insert into ',@dbi,'.designs (designid,created_at,updated_at,designname)'
                   ,'values(@newident,now(),now(),@designname)');

  #select @stm;

  PREPARE STM FROM @stm;
  EXECUTE STM;

  #insert into designs (designid,created_at,updated_at,designname)
  #values(@newident,now(),now(),designname);

  /**************************************************
  * zeronode (zerotype root) for the start of bifork
  * build here with the parameters from gradety_master
  * todo !!!!!!!!!
  **************************************************/
  set @bifork := concat(
  '[{"constant": [{"datatype": "constant",'
  , '"designname": "', @designname, '",'
  , '"status": "view",'
  , '"height": "', @designheigth, '",'
  , '"width": "', @designwidth, '",'
  , '"groundzeroident": "zero",'
  , '"defaultnodeorientation": "h",'
  , '"levelseperator": ".",'
  , '"websiteident": "', @newident,'",'
  , '"defaultcontainerheight": 40,'
  , '"mincontainerheight": 30,'
  , '"projectident": "', @projectid,'"'
  , '}]},'
  , '{"rules": [{'
  , '"datatype": "rules",'
  , '"deltaheightrule": "add",'
  , '"containerheightrule": "fix",'
  , '"identrule": "count",'
  , '"dummy": "nil"'
  , '}]},'
  , '{"tree": ['
  ,'{"ident": "', @newident,'0",'
  ,'"fit":false'
  ,',"type":"item"'
  ,',"styles":{'
  ,' "background-color":"transparent"'
  ,',"background-image":"none"'
  ,',"background-attachment":"scroll"'
  ,',"background-position":"10px 10px"'
  ,',"background-repeat":"no-repeat"'
  ,'},'
  ,'"saveStyles":{'
  ,' "width":"auto"'
  ,',"height":"auto"'
  ,',"display":"block"'
  ,',"position":"relative"'
  ,',"word-wrap":"break-word"'
  ,',"z-index":"auto" }'
  ,',"sortable":false'
  ,',"task":"stage"'
  ,',"resizable":false'
  ,',"html":""'
  ,',"label":"Container"'
  ,',"openAccordions":[]'
  ,',"overflow":"auto"'
  ,',"allreadyExist":".STAGE"'
  ,',"storage":{}'
  ,',"self":""'
  ,',"parent":"body"'
  ,',"datatype":"stage"'
  ,'},'
  ,'{"ident": "', @newident,'1",'
  ,'"parent":"', @newident,'0",'
  ,'"fit":false'
  ,',"type":"page"'
  ,',"styles":{'
  ,' "background-color":"#ffffff"'
  ,',"min-height":"', @designheigth, '"'
  ,',"margin-top": "30px"'
  ,',"margin-right":"', @designmarginright, '"'
  ,',"margin-bottom": "30px"' 
  ,',"margin-left":"', @designmarginleft, '"'
  ,'}'
  ,',"saveStyles":{'
  ,' "width":"', @designwidth, '"'
  ,',"height":"auto"'
  ,',"display":"block"'
  ,',"position":"relative"'
  ,',"word-wrap":"break-word"'
  ,',"z-index":"auto"'
  ,'}'
  ,',"sortable":false'
  ,',"task":"page"'
  ,',"resizable":false'
  ,',"html":""'
  ,',"label":"Page"'
  ,',"openAccordions":[]'
  ,',"overflow":"auto"'
  ,',"allreadyExist":".PAGE"'
  ,',"storage":{}'
  ,',"self":""'
  #,',"parent": ".STAGE"'
  ,',"datatype":"page"'
  ,'},'
  , '{"ident": "', @newident,'2",'
  , '"parentident":"', @newident,'1",'
  , '"datatype":"node",'
  , '"height": "', @designheigth, '",'
  , '"width": "', @designwidth, '",'
  , '"align":"fit"'
  , '}]}]'
); # end of concat

  set @stm:= concat('UPDATE ',@dbi,'.designs SET bifork=@bifork where designid=?');

  PREPARE STM FROM @stm;
  EXECUTE STM USING @newident;
  DEALLOCATE PREPARE STM;

  #commit;

  select @newident as newident;

END$$
DELIMITER ;