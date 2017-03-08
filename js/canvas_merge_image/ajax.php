<?php
include_once __DIR__."/MergeText.php";

if(isset($_REQUEST['func_name'])){
	$func_name=$_REQUEST['func_name'];
	if(in_array($func_name,['MergeText::init'])){
		$arg=empty($_REQUEST['arg'])?[]:$_REQUEST['arg'];
		echo @json_encode(call_user_func($func_name,$arg),JSON_NUMERIC_CHECK);
	}
}