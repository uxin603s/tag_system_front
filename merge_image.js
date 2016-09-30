function merge_image(merge_image_arr,callback){
	
	var merge_image=function(){
		console.log(merge_image_arr)
		var c=document.createElement('canvas')
		c.width=1200;
		c.height=630;
		var c=c.getContext("2d");
		
		for(var i in merge_image_arr){
			var item=merge_image_arr[i];
		
			c.drawImage(item.image_object,item.x,item.y,item.w,item.h);
		}
		
		callback && callback(c.canvas.toDataURL())
	}
	var image_onload=function(src,callback){
		var img=new Image;
		img.onload=function(img){
			callback && callback(img);
		}.bind(this,img)
		img.src=src;
	}
	var check_object={finish_count:0};
	for(var i in merge_image_arr){
		var item=merge_image_arr[i];
		image_onload(item.image_src,function(item,check_object,img){
			item.image_object=img;
			check_object.finish_count++
			if(merge_image_arr.length<=check_object.finish_count){
				merge_image();
			}
		}.bind(this,item,check_object));
	}
}