<!DOCTYPE html>
<html>
<head>
	<title></title>
	<meta charset="utf-8" />
	<script src="js/jquery-1.12.4.min.js"></script>
	<script src="js/angular-1.5.8.min.js"></script>
	<script src="js/localForage-1.4.2.min.js"></script>
	<script src="app/modules/cache/cache.js"></script>
	
	<link rel="stylesheet" href="font-awesome-4.7.0/css/font-awesome.min.css">
	<script>
	angular.module("app",["cache"])
	.controller("whxyDemoCtrl",["$scope","$timeout",function($scope,$timeout){
		var whxy_demo=[
			{x:0,y:0,w:100,h:100,image_src:"http://ipetair.com/wp-content/uploads/2014/09/479_%E7%8B%97%E7%8B%97%E7%9A%84%E8%BA%AB%E9%AB%94%E8%AA%9E%E8%A8%80%E4%BD%A0%E7%9F%A5%E5%A4%9A%E5%B0%91_1.jpg"},
			{x:50,y:50,w:100,h:100,image_src:"http://static.mindcity.sina.com.tw/MC_data/focus/fate/008/images/area111/14159593911621.jpg"},
			{x:50,y:50,w:100,h:100,image_src:"http://d36lyudx79hk0a.cloudfront.net/p0/mn/p2/c16531eda44144f6.jpg"},
		];
		var tmp_demo={
			hide:{},
			lockScale:{},
			record:[],
		};
		
		$scope.cache.whxys1 || ($scope.cache.whxys1=angular.copy(whxy_demo));
		$scope.cache.tmp1 || ($scope.cache.tmp1=angular.copy(tmp_demo));
		$scope.cache.whxys2 || ($scope.cache.whxys2=angular.copy(whxy_demo));
		$scope.cache.tmp2 || ($scope.cache.tmp2=angular.copy(tmp_demo));
		
	}])
	</script>
	<script src="app/components/whxy/whxy.js?t<?=time()?>"></script>
	<script src="app/components/whxy/whxys.js?t<?=time()?>"></script>
	<script src="app/components/record/record.js?t<?=time()?>"></script>
	<script src="app/directives/sortable/sortable.js?t<?=time()?>"></script>
	<link rel="stylesheet" type="text/css" href="css/bootstrap-3.3.7.min.css" />
	<link rel="stylesheet" type="text/css" href="css/index.css" />
</head>
<body 
ng-app="app"
ng-controller="whxyDemoCtrl"
ng-if="!cache.not_finish_flag"
style="overflow-y: scroll;"
>
	<div class="col-xs-4">
		<whxys	
		width="1200" 
		height="630" 
		whxys="cache.whxys1"
		cache="cache.tmp1"
		></whxys>		
	</div>
	<div class="col-xs-4" >
		<whxys	
		width="1200" 
		height="630" 
		whxys="cache.whxys2"
		cache="cache.tmp2"
		></whxys>		
	</div>
</body>
</html>