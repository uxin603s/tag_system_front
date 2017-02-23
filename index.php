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
	
	<script src="app/modules/cache/cache.js?t=<?=time()?>"></script>
	<script src="app/modules/param/param.js?t=<?=time()?>"></script>
	
	<script src="app/modules/tagSystem/tagSystem.js?t=<?=time()?>"></script>
	<script src="app/modules/tagSystem/components/searchTag/searchTag.js?t=<?=time();?>"></script>
	<script src="app/modules/tagSystem/components/searchTagElement/searchTagElement.js?t=<?=time();?>"></script>
	<script src="app/modules/tagSystem/components/sourceTag/sourceTag.js?t=<?=time();?>"></script>
	<script src="app/modules/tagSystem/components/tagLevel/tagLevel.js?t=<?=time();?>"></script>
	<script src="app/modules/tagSystem/components/tagType/tagType.js?t=<?=time();?>"></script>
	<script src="app/modules/tagSystem/components/tagRelation/tagRelation.js?t=<?=time();?>"></script>
	<script src="app/modules/tagSystem/components/insertTagElement/insertTagElement.js?t=<?=time();?>"></script>
	<script src="app/modules/tagSystem/factories/tagSystem.js?t=<?=time();?>"></script>
	<script src="app/modules/tagSystem/factories/tagType.js?t=<?=time();?>"></script>
	<script src="app/modules/tagSystem/factories/tagLevel.js?t=<?=time();?>"></script>
	<script src="app/modules/tagSystem/factories/tagRelation.js?t=<?=time();?>"></script>
	
	<script src="app/app.js?t=<?=time()?>"></script>
	
	<script src="app/components/index/index.js?t<?=time()?>"></script>
	
	<script src="app/directives/ngRightClick/ngRightClick.js?t<?=time()?>"></script>
	<script src="app/directives/ngEnter/ngEnter.js?t<?=time()?>"></script>
	<script src="app/directives/sortable/sortable.js?t<?=time()?>"></script>
	
	<link rel="stylesheet" type="text/css" href="css/bootstrap-3.3.7.min.css?t=<?=time()?>" />
	<link rel="stylesheet" type="text/css" href="css/index.css?t=<?=time()?>" />
	<script>
	if(window.location.hash){
		window.location.href="http://"+window.location.hostname+window.location.pathname+window.location.search;
	}
	</script>
</head>
<body 
ng-app="app"
style="overflow-y: scroll;"
>
	<index 
	ng-if="!cache.not_finish_flag"></index>
</body>
</html>