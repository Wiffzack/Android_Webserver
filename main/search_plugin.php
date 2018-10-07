<html>
<?php
	$phpVar = $_GET["keywords"];
	$phpn =  '"' . $phpVar . '"';
	$db_host = '';
	$db_user = '';
	$db_pwd = '';
	$database = '';
	$table = '';
	$entrys = array();
	if (!mysql_connect($db_host, $db_user, $db_pwd))
		die("Can't connect to database");
	if (!mysql_select_db($database))
		die("Can't select database");
    $sql = "SELECT address FROM $table WHERE INSTR(keyword, ".$phpn.") LIMIT 1";
    $result = mysql_query($sql);
	while($row = mysql_fetch_row($result))
	{
    echo "<tr>";
    foreach($row as $cell)
        echo "<td><a href='".$cell."'>Link1</a></td>";
		header("location:$cell")
		echo "<script> var bool = '$cell'; var url = bool; var referLink  = document.createElement('a'); referLink.href = url; document.body.appendChild(referLink); referLink.click();   </script>";;
		$test1 = $cell;
    echo "</tr>\n";
	}
	$value = mysql_fetch_object($result);
	if (!$value) {
	//pass
	}
	else{
	$entrys['address'] = $value->address;
	//echo $entrys['address'];
	echo "<a href='".$entrys['address']."'>Link</a>";
	//echo json_encode($entrys['address']);
	}

?>
</html>
