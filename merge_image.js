function merge_image(merge_image_arr,callback){
	var merge_result=function(){
		// console.log(merge_image_arr)
		
		var c=init_canvas(1200,630);
		merge_image_arr.sort(function(a,b){
			return a.zIndex-b.zIndex;
		});
		for(var i in merge_image_arr){
			var item=merge_image_arr[i];			
			c.drawImage(item.image_object,item.x,item.y,item.w,item.h);
		}
		
		callback && callback(c.canvas.toDataURL())
	}
	var image_onload=function(item,callback){
		if(item.type==1){
			var img=merge_text(item);
			callback && callback(img);
		}else if (item.type==2){
			var img=new Image;
			img.onload=function(img){
				callback && callback(img);
			}.bind(this,img)
			img.src=item.image_src;
		}else{
			callback && callback(null);
		}
		
	}
	var check_object={finish_count:0};
	for(var i in merge_image_arr){
		var item=merge_image_arr[i];
		image_onload(item,function(item,check_object,img){
			item.image_object=img;
			if(img){
				item.w=img.width;
				item.h=img.height;
			}
			check_object.finish_count++
			if(merge_image_arr.length<=check_object.finish_count){
				merge_result();
			}
		}.bind(this,item,check_object));
	}
}