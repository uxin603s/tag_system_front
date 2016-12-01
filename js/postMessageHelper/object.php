<!DOCTYPE html>
<html>
<head>
	<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
	<script src="postMessageHelper.js?t=<?=time()?>"></script>
	<script>
	$(document).ready(function(){
		//slave不需要再 init 就可發送資料
		postMessageHelper.receive("text",function(res){
			console.log(res)
		});
		postMessageHelper.send("text",{c:3,d:4})
		postMessageHelper.send("text",'ggwp')
		
	});
	</script>
</head>
<body>

</body>
</html>