<?php
	$db_host = '127.0.0.1';
	$db_user = '';
	$db_pwd = '';
	$database = '';
	$table = '';
	$pdfsite = '#page=';
	$entrys = array();
	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		$address=$_GET["url"];
		$keyword=$_GET["keywords"];
		$rating=$_GET["rating"];
	}
	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		$keyword =  $_POST['keyword'];
		$address = $_POST['address'];
		$pagesite = $_POST['pagesite'];
		$rating = $_POST['rating'];
		if($pagesite != '')
		{
		$cache = (string)$pagesite;
		$pdfsite =  $pdfsite.$cache;
		$address =  $address.$pdfsite;
		}
	}
	if (!mysql_connect($db_host, $db_user, $db_pwd))
		die("Can't connect to database");
	if (!mysql_select_db($database))
		die("Can't select database");
	$sql = "INSERT INTO $table(rating,keyword,address)VALUES (".$rating.", '".$keyword."', '".$address."')";
	//echo ($sql);
	$result = mysql_query($sql);
	//header('Location: examples.html'); 
?>
