CREATE TABLE `files` (
    `fileid` varchar( 36 ) collate utf8_unicode_ci NOT NULL
  , `filenombre` varchar( 12 ) COLLATE utf8_unicode_ci DEFAULT NULL
  , `mimetype` varchar( 255 ) COLLATE utf8_unicode_ci DEFAULT NULL
  , `suffix` varchar( 12 ) COLLATE utf8_unicode_ci DEFAULT NULL
  , `filesize` int( 11 ) DEFAULT NULL
  , `filedata` longblob
  , `addedby` varchar( 12 ) COLLATE utf8_unicode_ci DEFAULT NULL
  , `usedin` varchar( 12 ) COLLATE utf8_unicode_ci DEFAULT NULL
  , `usageAs` varchar( 12 ) COLLATE utf8_unicode_ci DEFAULT NULL
  , `created` datetime DEFAULT NULL
  , `updated` datetime DEFAULT NULL
  , `delete_flag` int( 1 ) default 0
  , PRIMARY KEY ( `fileid` )
) ENGINE = InnoDB AUTO_INCREMENT = 478 DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;