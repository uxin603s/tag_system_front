<!DOCTYPE html>
<html>
<head>
	<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
	<script src="postMessageHelper.js?t=<?=time()?>"></script>
	<script>
	$(document).ready(function(){
		//master需要init 才能send 
		//init(string connect_name,window)
		postMessageHelper.init("text",$("#b")[0].contentWindow)
		
		//send(string connect_name,mix send_data)
		postMessageHelper.send("text",{a:1,b:2})
		
		//receive(string connect_name,callback)
		postMessageHelper.receive("text",function(res){
			console.log(res)
		})
		
		//一個connect send可以多個 但receive只能1個
		postMessageHelper.send("text",'qqq')
	})
	</script>
</head>
<body>
<iframe 
id="b"
src="object.php?t=<?=time()?>"></iframe>
</body>
</html>