function merge_image(w,h,merge_image_arr,callback){
	var merge_image_arr=JSON.parse(JSON.stringify(merge_image_arr));
	var merge_result=function(){
		var c=init_canvas(w,h);
		merge_image_arr.sort(function(a,b){
			return a.zIndex-b.zIndex;
		});
		for(var i in merge_image_arr){
			var item=merge_image_arr[i];	
			if(item.image_object){
				c.drawImage(item.image_object,item.x,item.y,item.w,item.h);
			}
		}
		callback && callback(c.canvas.toDataURL())
	}
	var image_onload=function(item,callback){
		if(item.type==1){
			
			var img=merge_text(item);
			
			if(item.useBg){
				item.x-=item.bgPadding;
				item.y-=item.bgPadding;
				var new_w=item.w+item.bgPadding*2;
				var new_h=item.h+item.bgPadding*2;
				
				var c=init_canvas(new_w,new_h);
				
				
				if(item.bgBorderRadius){
					var cr=item.bgBorderRadius*2;
					c.lineJoin = "round";
					c.lineWidth = cr;
					c.strokeStyle =item.bgColor;
					c.strokeRect(cr/2,cr/2,new_w-cr,new_h-cr);
				}else{
					var cr=0;
				}
				c.fillStyle=item.bgColor;
				c.fillRect(cr/2,cr/2,new_w-cr,new_h-cr);

				c.drawImage(img,item.bgPadding,item.bgPadding,item.w,item.h);
				img=c.canvas;
			}
			callback && callback(img);
		}else if (item.type==2){
			var img=new Image;
			img.onload=function(img){
				callback && callback(img);
			}.bind(this,img)
			img.src=item.image_src;
		}
		else{
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