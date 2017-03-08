<!DOCTYPE html>
<html>
	<head>
		<title>測試檔</title>
		<meta charset="UTF-8" />
		<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>
		<script src="init_canvas.js?t=<?=time()?>"></script>
		<script src="dataURItoBlob.js?t=<?=time()?>"></script>
		<script src="merge_image.js?t=<?=time()?>"></script>
		<script src="merge_text.js?t=<?=time()?>"></script>
		
		<script>
		angular.module("app",[]).controller("testCtrl",["$scope",function($scope){
			
			$scope.text_position={
				zIndex:1,
				x:50,y:50,
				w:500,h:500,
				text_hAlign:0,
				text_vAlign:0,
				text_size:500,
				text_color:"#FF0000",
				// text_content:"###user_name###wang###space###chi###user_name###jkhfjdfhfghgf###user_name###gg###space###wp###user_name###",
				// text_content:"fgfdfgdfg dfgdfgdfg dfgdfg fgggg",
				// text_content:"ffgfdgdfg dfgdfgdf",
				text_content:"",
				
				text_type:0,
				
				useFontBg:1,
				FontBgSize:5,
				FontBgColor:"#0000FF",
				
				useLine:2,
				
				useBg:1,
				bgPadding:0,
				bgColor:"#0000FF",
				bgBorderRadius:0,
				rotate:0,
			}
			var text_list=[
			"###user_name###wang###space###chi###user_name###","###user_name###ggwp###user_name###",
			"吃飯","與","gogo","sleep",
			];
			
			setInterval(function(){
				$scope.text_position.text_content+=text_list[Math.floor(Math.random()*text_list.length)]
				// $scope.text_position.text_content+=" "
				$scope.$apply();
			},1000)
			
			// $scope.text_position.text_hAlign=($scope.text_position.text_hAlign*1+1) %3
			// $scope.text_position.text_vAlign=($scope.text_position.text_vAlign*1+1) %3
			// $scope.lock=false;
			$scope.$watch("text_position",function(){
				// clearTimeout($scope.timer);
				// $scope.timer=setTimeout(function(){
					if($scope.lock)return
					var text_position=angular.copy($scope.text_position);
					$scope.lock=true;
					var post_data={
						func_name:"MergeText::init",
						arg:text_position,
					}
					$.post("ajax.php",post_data,function(res){
						console.log(res.time)
						$scope.lock=false;
						$scope.image=res.data;
						$scope.image1=merge_text(text_position).toDataURL();
						$scope.$apply();
					},"json")
				// },500)
				
				
				
			},1)
			
		}])
			
/*
java -jar ../compiler-latest/closure-compiler-v20160911.jar \
--js init_canvas.js \
--js dataURItoBlob.js \
--js merge_image.js \
--js merge_text.js \
--js_output_file canvas_merge_image.min.js
*/
		</script>
	</head>
	<body ng-app="app">
		<div ng-controller="testCtrl">
		{{lock?1:0}}
			<div style="display:inline-block;vertical-align: top;">
				<div ng-repeat="(name,item) in text_position">
					{{name}}:
					<textarea 
					ng-model="text_position[name]"
					></textarea>
				</div>
			</div>
			<div style="display:inline-block;vertical-align: top;">
				<img style="vertical-align: top;" ng-src="{{image}}" />
				<img style="vertical-align: top;" ng-src="{{image1}}" />
			</div>
		</div>
		
		
	</body>
</html>