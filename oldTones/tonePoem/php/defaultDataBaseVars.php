<?php
	
  $defaultHost = "127.0.0.1";
  $defaultDataBase = "Tone_Poems";
  $defaultUser = "root";
  $defaultPass = "SuperBatMan31";
 
	$dbh = new PDO("mysql:host=".$defaultHost.";dbname=".$defaultDataBase.";",
				   $defaultUser,
				   $defaultPass, 
				   array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8") 
				  );
	
?>