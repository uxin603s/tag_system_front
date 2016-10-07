function merge_image(config,merge_image_arr,callback,message_callback,error_callback){
	var timeFlag={
		data:{},
		set:function(name){
			this.data[name] || (this.data[name]=[]);
			this.data[name].push(Date.now())
		},
		get:function(){
			return this.data;
		},
	}
	timeFlag.set("全部")
	try{
		var message=[];
		var merge_image_arr=JSON.parse(JSON.stringify(merge_image_arr));
		if(!isNaN(merge_image_arr[0].zIndex)){
			merge_image_arr.sort(function(a,b){
				return a.zIndex-b.zIndex;
			});
		}
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
			var c=init_canvas(config.w,config.h);
			if(config.format){
				config.format=config.format.toLowerCase();
				var jpeg_check=false;
				jpeg_check =jpeg_check || config.format.indexOf("jpeg")!=-1;
				jpeg_check =jpeg_check || config.format.indexOf("jpg")!=-1;
				
				if(jpeg_check){
					c.fillStyle="#ffffff";
					c.fillRect(0,0,config.w,config.h);
				}
			}
			for(var i in merge_image_arr){
				var item=merge_image_arr[i];	
				if(item.image_object){
					// timeFlag.set("圖層"+i+"圖合圖")
					rotate_image(item);
					c.drawImage(item.image_object,item.x,item.y,item.w,item.h);
					// timeFlag.set("圖層"+i+"圖合圖")
				}
			}
			
			callback && callback(c.canvas.toDataURL(config.format,config.compress))
			timeFlag.set("全部")
			var arr=timeFlag.get();
			for(var i in arr){
				message.push(i+">>"+((arr[i][1]-arr[i][0])/1000)+"秒")
			}
			message_callback && message_callback(message)
		}
		var image_onload=function(item,index,callback){
			if(item.type==1){
				timeFlag.set("圖層"+index+"文字合成")
				var img=merge_text(item,index,message);
				timeFlag.set("圖層"+index+"文字合成")
				if(item.bgPadding){
					var bgPadding=item.bgPadding;
				}else{
					var bgPadding=0;
				}
				if(item.useBg){
					item.x-=bgPadding;
					item.y-=bgPadding;
					var new_w=item.w+bgPadding*2;
					var new_h=item.h+bgPadding*2;
					var c=init_canvas(new_w,new_h);
					if(item.bgBorderRadius){
						var cr=item.bgBorderRadius*2;
						c.lineJoin="round";
						c.lineWidth=cr;
						c.strokeStyle=item.bgColor;
						c.strokeRect(cr/2,cr/2,new_w-cr,new_h-cr);
					}else{
						var cr=0;
					}
					c.fillStyle=item.bgColor;
					c.fillRect(cr/2,cr/2,new_w-cr,new_h-cr);
					c.drawImage(img,bgPadding,bgPadding,item.w,item.h);
					item.w=new_w;
					item.h=new_h;
					img=c.canvas;
				}
				callback && callback(img);
			}else if (item.type==2){
				var img=new Image;
				timeFlag.set("圖層"+index+"圖片讀取")
				img.onload=function(img,index){
					timeFlag.set("圖層"+index+"圖片讀取")
					callback && callback(img);
				}.bind(this,img,index)
				img.src=item.image_src;
			}
			else{
				throw "有圖片漏掉沒合成";
			}
		}
		var check_object={finish_count:0};
		for(var i in merge_image_arr){
			var item=merge_image_arr[i];
			image_onload(item,i,function(item,check_object,img){
				item.image_object=img;
				check_object.finish_count++
				if(merge_image_arr.length<=check_object.finish_count){
					merge_result();
				}
			}.bind(this,item,check_object));
		}
	}catch(e){
		error_callback && error_callback(e)
	}	
	return this;
}