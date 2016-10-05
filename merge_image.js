function merge_image(w,h,merge_image_arr,callback){
	var merge_image_arr=JSON.parse(JSON.stringify(merge_image_arr));
	merge_image_arr.sort(function(a,b){
		return a.zIndex-b.zIndex;
	});
	var rotate_image=function(item){
		if(item.rotate){
			//以圖中心旋轉
			var rotate_width=Math.sqrt(item.w*item.w+item.h*item.h);//畢氏定理，正方形邊
			//取得360度旋轉圖不會切到
			//將圖定位到中心
			var x=(rotate_width-item.w)/2;
			var y=(rotate_width-item.h)/2;
			var c=init_canvas(rotate_width,rotate_width);
			c.translate(rotate_width/2,rotate_width/2);
			c.rotate(item.rotate*Math.PI/180);
			c.translate(-rotate_width/2,-rotate_width/2);
			c.drawImage(item.image_object,x,y);
			item.image_object=c.canvas;
			item.x-=x;
			item.y-=y;
			item.w=rotate_width;
			item.h=rotate_width;
		}
	}
	var merge_result=function(){
		var c=init_canvas(w,h);
		for(var i in merge_image_arr){
			var item=merge_image_arr[i];	
			if(item.image_object){
				rotate_image(item);
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
					c.lineJoin="round";
					c.lineWidth=cr;
					c.strokeStyle =item.bgColor;
					c.strokeRect(cr/2,cr/2,new_w-cr,new_h-cr);
				}else{
					var cr=0;
				}
				c.fillStyle=item.bgColor;
				c.fillRect(cr/2,cr/2,new_w-cr,new_h-cr);

				c.drawImage(img,item.bgPadding,item.bgPadding,item.w,item.h);
				item.w=new_w;
				item.h=new_h;
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
			console.log("有圖片漏掉沒合成");
			callback && callback(null);
		}
	}
	var check_object={finish_count:0};
	for(var i in merge_image_arr){
		var item=merge_image_arr[i];
		image_onload(item,function(item,check_object,img){
			item.image_object=img;
			check_object.finish_count++
			if(merge_image_arr.length<=check_object.finish_count){
				merge_result();
			}
		}.bind(this,item,check_object));
	}
}