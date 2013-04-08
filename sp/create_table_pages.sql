DROP TABLE IF EXISTS `gradety_a0b0c0`.`pages`;
CREATE TABLE  `gradety_a0b0c0`.`pages` (
  `pageid` varchar(36) collate utf8_unicode_ci NOT NULL,
  `parentid` varchar(36) collate utf8_unicode_ci NOT NULL,
  `previd` varchar(36) collate utf8_unicode_ci NOT NULL,
  `designid` varchar(12) collate utf8_unicode_ci NOT NULL,
  `pagename` varchar(100) collate utf8_unicode_ci default '',
  `urlname` varchar(100) collate utf8_unicode_ci default '',
  `notinmenu` tinyint(1) default '0',
  `visible` tinyint(1) default '0',
  `pagetype` varchar(12) collate utf8_unicode_ci NOT NULL,
  `tpl` longtext COLLATE utf8_unicode_ci NULL ,
  `ownertable` varchar(12) collate utf8_unicode_ci default NULL,
  `languagekey` char(3) collate utf8_unicode_ci NOT NULL default '',
  `landingpage` tinyint(1) default '0',
  `created_at` datetime default NULL,
  `updated_at` datetime default NULL,
  `delete_flag` int( 1 ) default 0
  PRIMARY KEY  (`pageid`)
  #PRIMARY KEY  (`pageid`,`designid`),
  #KEY `FK_pages_designs` (`designid`),
  #CONSTRAINT `FK_pages_designs` FOREIGN KEY (`designid`) REFERENCES `designs` (`designid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
