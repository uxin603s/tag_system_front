<?php
setcookie("go_to","",time()-3600);
session_start();


if(isset($_SESSION['rid'])){
	
}else{
	setcookie("access_token",$_GET['access_token']);
	setcookie("go_to",$_SERVER['REQUEST_URI']);
	header("location:login.php");
	exit;
}
?>
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<meta charset="utf-8" />
	<script src="js/jquery-1.12.4.min.js?t=<?=time()?>"></script>
	<script src="js/angular-1.5.8.min.js?t=<?=time()?>"></script>
	<script src="js/localForage-1.4.2.min.js?t=<?=time()?>"></script>
	<script src="js/promiseRecursive.js?t=<?=time()?>"></script>
	
	<script src="js/postMessageHelper/postMessageHelper.js?t=<?=time()?>"></script>
	
	<script src="app/module/cache/cache.js?t=<?=time()?>"></script>
	
	<script src="app/app.js?t=<?=time()?>"></script>
	<script src="app/components/api/api.js?t<?=time()?>"></script>
</head>
<body 
ng-app="app"
style="overflow-y: scroll;"
>
	<api 
	ng-if="!cache.not_finish_flag"
	></api>
</body>
</html>