<?php

	include "defaultDataBaseVars.php";
  
	if(isset($_POST["pageNumber"]))
	{
		$pageNumber = $_POST["pageNumber"];
	}
	else{
		$pageNumber = 1;
	}
		    

	$pStmt = $dbh->prepare("CALL getRecentPoems(?)");
  
  $pStmt->bindParam(1, $pageNumber);
	$pStmt->execute();

	$results = array();
	do {
		$results = $pStmt->fetchAll(PDO::FETCH_ASSOC);
		//var_dump($results);
	} while ($pStmt->nextRowset() && $pStmt->columnCount());
	
	$json = json_encode($results);
	print_r($json);	

	$pStmt->closeCursor();
	unset($pStmt);
 
 ?>
