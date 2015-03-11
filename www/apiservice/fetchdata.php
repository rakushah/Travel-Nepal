<?php
	header('Access-Control-Allow-Origin: *');

	$sqlconn=mysqli_connect('localhost','root','','phonegap_test') or die(mysqli_error());

	$dataquery=mysqli_query($sqlconn,"SELECT * FROM data");

	$arr=array();
	while($r=mysqli_fetch_object($dataquery)){
		array_push($arr,array("id"=>$r->id,"FirstName"=>$r->FirstName,"LastName"=>$r->LastName,"Address"=>$r->Address,"Phone"=>$r->Phone,"img_url"=>$r->img_url));

	}
	print_r(json_encode($arr));
?>