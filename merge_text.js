function merge_text(item){
	item=JSON.parse(JSON.stringify(item));
	function area_scale_w_h(item){
		var len=item.text_content.length;	
		var text_size=item.text_size;
		if(item.useFontBg && item.FontBgSize){
			text_size+=item.FontBgSize*2;
		}
		var area=len*text_size*text_size*1.2*1.2;//計算文字面積
		
		var scale=Math.sqrt(item.w*item.h/area);		
		
		item.text_size=Math.floor(item.text_size*scale);//計算需要縮放比例
		
		// var area_new=len*item.text_size*item.text_size*1.1*1.1;//計算文字面積
		// console.log(area,area_new)
	}
	// var tmp=item.text_content.match(/###user_name###([\w\W]+?)###user_name###/)
	// if(tmp){
		// console.log(tmp)
		// var user_name_tmp=item.text_content.substr(tmp.index,tmp[0].length);
		// console.log(user_name_tmp)
		// item.text_content=item.text_content.substr(tmp[0].length,item.text_content.length-tmp[0].length);
		// console.log(item.text_content)
	// }
	// ###user_name###wang chi###user_name###
	
	function get_ok_width_string(item,c,limit_w){
		var result_arr=[];	
		if(item.text_content.indexOf("\n")!=-1){
			item.text_content=item.text_content.replace(/###user_name###/g," ");
			var tmp=item.text_content.split("\n");
			for(var i in tmp){
				var text=tmp[i];
				var width=c.measureText(text).width;
				result_arr.push({text:text,w:width});
			}
			return result_arr;
		}
		
		var type=0;
		
		if(item.text_content.indexOf(" ")==-1){
			var get_count=Math.floor(item.w/item.text_size)*2;
			// console.log(get_count)
			if(!limit_w){
				var limit_w=item.w;;
			}
			type=1;
			var tmp_line_limit_count=get_count;
			var tmp_text_content=item.text_content;
			// if(item.text_size<20){
				// limit_w*=20/item.text_size;
				// get_count*=20/item.text_size
				// item.text_size=20;
				// c.font=item.text_size+"px 微軟正黑體";
			// }
		}else{
			var tmp_text_content=item.text_content.split(" ");
			if(!limit_w){			
				var limit_w=0;
				for(var i in tmp_text_content){
					var tmp_w=c.measureText(tmp_text_content[i]).width;
					if(tmp_w>limit_w){
						limit_w=tmp_w;
					}
				}
			}
			type=2;
			var tmp_arr=[];
		}
		
		var start_time=Date.now();
		while(true){
			if(type==1){
				var text=tmp_text_content.substr(0,tmp_line_limit_count);
			}else{
				var text=tmp_text_content.join(" ");
			}
				
			var width=c.measureText(text).width;
			if(type==1){
				if(width>limit_w){
					
					tmp_line_limit_count--;
					
				}else{
					
					var start=text.length;
					var count=tmp_text_content.length-text.length;
					tmp_text_content=tmp_text_content.substr(start,count);
					if(text){
						result_arr.push({text:text,w:width});
					}
					var tmp_line_limit_count=get_count;
					if(!tmp_text_content.length){
						// var count=result_arr.length;
						// if(count!=1){
							// var w1=result_arr[count-2].w/2;	
							// var w2=result_arr[count-1].w;	
							
							// if(w1 > w2){
								// var result_arr=[];
								// limit_w++;
								
								// var tmp_text_content=item.text_content;
								// continue;
							// }
						// }
						return result_arr;
					}
				}
			}else{
				if(width>limit_w && tmp_text_content.length!==1){
					tmp_arr.unshift(tmp_text_content.pop());
				}else{
					if(text){
						result_arr.push({text:text,w:width});
					}
					tmp_text_content=tmp_arr;
					
					if(tmp_text_content.length){
						var tmp_arr=[];
					}else{
						return result_arr;
					}
					
				}
			}
			if(((Date.now()-start_time)/2000)>1){
				throw "卡迴圈，強制中斷";
			}
		}
		return result_arr;
	}
	
	function make_text(text,item,w,h){
		var c=init_canvas(w,h);
		c.fillStyle=item.text_color;
		c.font=item.text_size+"px 微軟正黑體";
		c.textBaseline="middle";
		if(item.useFontBg && item.FontBgSize){
			c.lineWidth = item.FontBgSize;
			c.strokeStyle = item.FontBgColor;		
		}
		var x=0;
		var y=item.text_size/2;
		
		if(item.useFontBg && item.FontBgSize){
			// x+=item.FontBgSize;
			// y+=item.FontBgSize/2;
		}
		if(item.useFontBg && item.FontBgSize){
			c.strokeText(text,x,y);	
		}
		c.fillText(text,x,y);	
		// if(item.useLine){
			// if(item.useLine==1){
				// var line_y=.9;
			// }else{
				// var line_y=.5;
			// }
			// c.strokeStyle = item.text_color;
			// c.lineWidth = Math.floor(item.text_size/10);
			
			// var y=h*line_y-c.lineWidth/2
			// c.moveTo(line_x,y);
			// c.lineTo(line_w,y);
			// c.stroke();
		// }		
		return c.canvas;	
	}	
	
	item.text_content=item.text_content.trim();
	if(item.text_size>item.h){
		item.text_size=item.h;
	}
	area_scale_w_h(item);
	
	var c=init_canvas(item.w,item.h);
	c.fillStyle=item.text_color;
	c.font=item.text_size+"px 微軟正黑體";
	c.textBaseline="middle";
	
	if(item.useFontBg && item.FontBgSize){
		c.lineWidth = item.FontBgSize;
		c.strokeStyle = item.FontBgColor;
	}
	// if(item.text_type==0 && !item.text_content.match(/[^a-zA-Z0-9\.]+/)){
		// item.text_type=1;
	// }
	
	if(item.text_type==0){
		var result_arr=get_ok_width_string(item,c);
	}else if(item.text_type==1){
		var text=item.text_content;
		var width=c.measureText(text).width;
		var result_arr=[
			{
				text:text,
				w:width,
			}
		];
		
	}else if(item.text_type==2){
		var text_arr=item.text_content.split("");
		var result_arr=[];
		for(var i in text_arr){
			var text=text_arr[i];
			var width=c.measureText(text).width;
			result_arr.push({
				text:text,
				w:width,
			})
		}
	}
	alert("計算出 寬和高 不符合比例改變limit_w");
	return
	if(item.text_size<20){
		item.text_size=20;
		c.font=item.text_size+"px 微軟正黑體";
		for(var i in result_arr){
			var text=result_arr[i].text;
			result_arr[i].w=c.measureText(text).width;
		}
	}
	
	var max_h=item.text_size*1.5;
	if(item.useFontBg && item.FontBgSize){
		max_h+=item.FontBgSize/2;
	}
	
	var max_w=0;
	for(var i in result_arr){
		if(result_arr[i].w>max_w){
			max_w=result_arr[i].w
		}
	}
	var new_w=max_w;
	var new_h=max_h*result_arr.length;
	
	var image_arr=[];
	for(var i in result_arr){
		var data=result_arr[i];
		var text=data.text;
		var w=data.w;
		var text_img=make_text(text,item,w,max_h);
		image_arr.push(text_img);
	}
	
	
	var new_c=init_canvas(new_w,new_h);
	var x=0;
	var y=0;
	for(var i in image_arr){
		var data=image_arr[i];
		var w=data.width;
		var h=data.height;
		if(item.text_hAlign==0){
			x=0;
		}else if(item.text_hAlign==1){
			x=(new_w-w)/2;
		}else if(item.text_hAlign==2){
			x=(new_w-w);
		}		
		new_c.drawImage(image_arr[i],x,y,w,h);
		y+=h;
	}
	// return new_c.canvas
	var scale=item.w/new_w;
	// if(scale<1){
		new_w*=scale;
		new_h*=scale;
		if(new_h>item.h){
			scale=item.h/new_h;
			new_w*=scale;
			new_h*=scale;
		}
	// }
	
	// console.log(scale,new_w,new_h)
	
	var x=0;
	var y=0;
	if(item.text_hAlign==0){
		x=0;
	}else if(item.text_hAlign==1){
		x=(item.w-new_w)/2;
	}else if(item.text_hAlign==2){
		x=(item.w-new_w);
	}	
	if(item.text_vAlign==0){
		y=0;
	}else if(item.text_vAlign==1){
		y=(item.h-new_h)/2;
	}else if(item.text_vAlign==2){
		y=(item.h-new_h);
	}	
	// console.log(y)
	// console.log()
	// return downScaleImage(new_c.canvas,scale)
	c.drawImage(new_c.canvas,x,y,new_w,new_h);
	return c.canvas
}