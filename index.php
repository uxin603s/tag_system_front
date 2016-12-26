<?php
session_start();
if(isset($_SESSION['rid'])){
	
}else{
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
	
	<script src="app/factories/tagName.js?t=<?=time()?>"></script>
	
	<script src="app/factories/crud.js?t=<?=time()?>"></script>
	<script src="app/factories/idSearch.js?t=<?=time()?>"></script>
	
	<script src="app/components/index/index.js?t<?=time()?>"></script>
	
	<script src="app/components/webTagType/webTagType.js?t<?=time()?>"></script>
	<script src="app/components/tagLevel/tagLevel.js?t<?=time()?>"></script>
	
	
	<script src="app/components/tagRecusion/tagRecusion.js?t<?=time()?>"></script>
	
	<script src="app/components/idSearch/idSearch.js?t<?=time()?>"></script>
	<script src="app/components/tagSearch/tagSearch.js?t<?=time()?>"></script>
	
	<script src="app/components/idRelation/idRelation.js?t<?=time()?>"></script>
	
	
	<script src="app/directives/ngRightClick/ngRightClick.js?t<?=time()?>"></script>
	<script src="app/directives/ngEnter/ngEnter.js?t<?=time()?>"></script>
	<script src="app/directives/sortable/sortable.js?t<?=time()?>"></script>
	
	<link rel="stylesheet" type="text/css" href="css/bootstrap-3.3.7.min.css?t=<?=time()?>" />
	<link rel="stylesheet" type="text/css" href="css/index.css?t=<?=time()?>" />
</head>
<body ng-app="app"  style="overflow-y: scroll;" >

	<index ng-if="!cache.not_finish_flag"></index>
</body>
</html>