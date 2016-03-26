<?php

	include "defaultDataBaseVars.php";

	$id = $_POST["id"];

	$pStmt = $dbh->prepare("CALL getPoemById(?)");

    $pStmt->bindParam(1, $id);
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
