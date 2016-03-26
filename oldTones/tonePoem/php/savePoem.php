<?php

	include "defaultDataBaseVars.php";

	$newPoem = $_POST["newPoem"];
	$BPM = $_POST["BPM"];
	$scale = $_POST["scale"];
	$iKey = $_POST["iKey"];
	$title = $_POST["title"];


	$pStmt = $dbh->prepare("CALL savePoem(?, ?, ?, ?, ?)");

    $pStmt->bindParam(1, $newPoem);
  	$pStmt->bindParam(2, $BPM);
	$pStmt->bindParam(3, $scale);
	$pStmt->bindParam(4, $iKey);
	$pStmt->bindParam(5, $title);
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
