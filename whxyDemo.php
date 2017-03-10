<!DOCTYPE html>
<html>
<head>
	<title></title>
	<meta charset="utf-8" />
	<script src="js/jquery-1.12.4.min.js"></script>
	<script src="js/angular-1.5.8.min.js"></script>
	<script src="js/localForage-1.4.2.min.js"></script>
	
	<script src="js/canvas_merge_image/Canvas.js"></script>
	<style>
	@font-face {
		font-family:'王漢宗特明體繁';
		src: url("merge_text/王漢宗特明體繁.ttf");
	}
	</style>
	
	<script src="app/modules/cache/cache.js"></script>
	
	<link rel="stylesheet" href="font-awesome-4.7.0/css/font-awesome.min.css">
	<script>
	//先模擬 單行 多行 計算單行需要的寬和高
	
	function make_text(text,item,w,h){
		console.log(text,item.text_size)
		// if(item.text_size < 20 ){
			// var c=(new Canvas(w,h)).getContext("2d");
			// return c.canvas;
		// }
		var item=JSON.parse(JSON.stringify(item));
		var c=(new Canvas(w,h)).getContext("2d");
		c.fillStyle=item.text_color;
		c.font=item.text_size+"px '"+item.font_family+"' ";
		// console.log(c.font)
		c.textBaseline="middle";
		var x=0;
		var y=item.text_size/2;
		
		if(item.useFontBg*1 && item.FontBgSize*1){
			c.lineWidth = item.FontBgSize;
			c.strokeStyle = item.FontBgColor;				
		}
		
		if(item.useFontBg*1 && item.FontBgSize*1){
			x+=item.FontBgSize;
			y+=item.FontBgSize/2;
		}
		
		if(item.useFontBg*1 && item.FontBgSize*1){
			c.strokeText(text,x,y);	
		}
		c.fillText(text,x,y);		
		var real_w=c.measureText(text).width;
		if(item.useFontBg*1 && item.FontBgSize*1){//measureText不會計算到c.lineWidth寬
			real_w+=item.FontBgSize*2
		}
		var real_h=item.text_size*1
		if(item.useFontBg*1 && item.FontBgSize*1){//measureText不會計算到c.lineWidth寬
			real_h+=item.FontBgSize*2;
		}

		if((real_w*1 > w*1 || real_h*1 > h*1) && item.text_size >= 20 ){// 
			item.text_size*=0.9;
			return make_text(text,item,w,h);
		}
		return c.canvas;	
	}
	
	angular.module("app",["cache"])
	.controller("whxyDemoCtrl",["$scope","$timeout",function($scope,$timeout){
		var text_object={
			"x":26,"y":445,"w":322,"h":145,
			"zIndex":"2","lock":"","hide":"","scale":"",
			"name":"新座標","type":"1","rotate":"0","text_size":"500","text_hAlign":"0","text_vAlign":"0","text_type":"0","text_color":"#000000","text_content":"{{{變數A[2]}}}{{{變數A[2]}}}{{{變數A[2]}}}{{{變數A[2]}}}{{{變數A[2]}}}{{{變數A[2]}}}","useBg":"","bgPadding":"0","bgColor":"#000000","bgBorderRadius":"0",
			"useFontBg":1,"FontBgColor":"#ffffff","FontBgSize":"3","useLine":""
		};
		
		text_object.w=150
		text_object.h=100
		text_object.text_size=50
		text_object.text_content="aaa"
		text_object.FontBgSize=3;
		text_object.font_family="微軟正黑體"
		// text_object.text_color="rgba(0,0,0,0)";
		
		$scope.cache.text_object || ($scope.cache.text_object=text_object);
		$scope.font_wait_load={};
		var draw=function(text_object){
			return
			if(document.fonts.check("16px "+text_object.font_family)){
				var start_time=Date.now();
				// var c=merge_text(text_object);
				console.log('qq')
				var c=make_text(text_object.text_content,text_object,text_object.w,text_object.h);
				$scope.img=c.toDataURL("image/png");
				console.log((Date.now()-start_time)/1000)
			}else{
				$scope.font_wait_load[text_object.font_family] || ($scope.font_wait_load[text_object.font_family]=[])
				$scope.font_wait_load[text_object.font_family].push(text_object)
			}
			
		}
		
		$scope.$watch("cache.text_object",draw,1)
		
		document.fonts.onloadingdone = function (e) {
			for(var i in e.fontfaces){
				if($scope.font_wait_load[e.fontfaces[i].family]){
					while($scope.font_wait_load[e.fontfaces[i].family].length){
						var text_object=$scope.font_wait_load[e.fontfaces[i].family].pop()
						draw(text_object)
						$scope.$apply();
					}
				}
				
			}
		};
		
		// function (){
			// var c=(new Canvas(w,h)).getContext("2d");
			// var size=$scope.text_size-bg_text_size;
			// c.fillStyle="#f00000";
			// c.font=size+"px '微軟正黑體' ";
			// c.textBaseline="middle";
			// var x=0
			// x+=bg_text_size/2;
			
			// var y=size/2;
			// y+=bg_text_size/2;
			// c.lineWidth=bg_text_size;
			// c.strokeStyle="#000000";	
			// c.strokeText($scope.text,x,y);	
			// c.fillText($scope.text,x,y);
			
			// var real_w=c.measureText($scope.text).width
			// real_w+=bg_text_size
		// }
		
		
		$scope.text="a";
		$scope.times=[];
		$scope.times.length=2;
		
		var w=100;
		var h=100;
		$scope.text_size=100
		var bg_text_size=10
		
		var c=(new Canvas(w,h)).getContext("2d");
		while(1){
			var size=$scope.text_size-bg_text_size;
			c.fillStyle="#f00000";
			c.font=size+"px '微軟正黑體' ";
			c.textBaseline="middle";
			var x=0
			x+=bg_text_size/2;
			
			var y=size/2;
			y+=bg_text_size/2;
			c.lineWidth=bg_text_size;
			c.strokeStyle="#000000";	
			c.strokeText($scope.text,x,y);	
			c.fillText($scope.text,x,y);
			
			var real_w=c.measureText($scope.text).width
			real_w+=bg_text_size
			var w=c.canvas.width
			// if(w>real_w){
				// c.canvas.width=real_w;
			// }else{
				$scope.img1=c.canvas.toDataURL("image/png");
				$scope.w=c.canvas.width;
				$scope.h=c.canvas.height;
				break;
			// }
		}
		// $scope.img2=make_text("a",tmp,text_object.w,text_object.h).toDataURL("image/png");
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
	<textarea  
	ng-model="cache.text_object.text_content" >
	</textarea>{{cache.text_object.text_content.length}}
	<input type="text" ng-model="cache.text_object.font_family" />
	<input type="text" ng-model="cache.text_object.w" />
	<input type="text" ng-model="cache.text_object.text_size" />
	<input type="text" ng-model="cache.text_object.FontBgSize" />
	<input type="text" ng-model="cache.text_object.text_color" />
	<input type="text" ng-model="cache.text_object.FontBgColor" />
	<div>
		<img 
		ng-repeat="item in times track by $index" 
		ng-src="{{img1}}"
		/>
	</div>
	<div 
	style="
	line-height:1;
	font-size:{{text_size}}px;
	font-family:'微軟正黑體';
	color: #000000;
	
	">
		<span 
		ng-repeat="item in times track by $index" 
		style="display:inline-block;width:{{w}}px;height:{{h}}px;text-align:center;" 
		>{{text}}</span>
	</div>
	<div 
	ng-repeat="(family,item) in font_wait_load"
	style="
	font-size:{{cache.text_object.text_size}}px;
	font-family:'{{family}}';
	opacity:0;
	position:absolute;
	"
	>
		123
	</div>
	<div class="col-xs-4" ng-if="0" >
		<whxys	
		width="1200" 
		height="630" 
		whxys="cache.whxys1"
		cache="cache.tmp1"
		></whxys>		
	</div>
	<div class="col-xs-4" ng-if="0" >
		<whxys	
		width="1200" 
		height="630" 
		whxys="cache.whxys2"
		cache="cache.tmp2"
		></whxys>		
	</div>
</body>
</html>